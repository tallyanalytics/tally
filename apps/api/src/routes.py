import hashlib
from datetime import datetime, timedelta
from enum import Enum, auto
from typing import Annotated

import geocoder
from fastapi import APIRouter, Header, Request, status
from pydantic import BaseModel

from .queries import (
    create_page_view,
    create_site_session,
    create_visitor,
    get_site_domain,
    get_site_sessions_by_visitor,
    get_site_token,
    get_visitor_id,
    update_session_duration,
    update_session_updated_at,
    update_visitor_last_visit,
)

router = APIRouter(
    prefix="/v0",
)


class Type(Enum):
    PAGE_EVENT = auto()
    CLICK_EVENT = auto()
    CUSTOM_EVENT = auto()


class PageEvent(BaseModel):
    pathname: str
    search: str | None
    referrer: str | None
    date: datetime


class ClickEvent(BaseModel):
    pathname: str
    date: datetime


class Event(BaseModel):
    token: str
    name: str
    type: Type
    data: PageEvent | ClickEvent


@router.post("/t", status_code=status.HTTP_200_OK)
def track_event(  # noqa: C901
    request: Request,
    event: Event,
    user_agent: Annotated[str | None, Header()] = None,
):
    domain = request.headers.get("referer")  # Make sure domain doesn't contain path

    if event.token:
        site = get_site_token(event.token)
    else:
        site = get_site_domain(domain)

    if "https://" in domain:
        site = site.replace("https://", "")
    if "www." in site:
        site = site.replace("www.", "")
    if site.endsWith("/"):
        site = site.replace("/", "")

    ip = request.client.host

    if not site:
        return

    id = unique_hash(
        domain,
        ip,
        user_agent,
        site[0]["salt"],
    )

    visitors = get_visitor_id(id)

    if not visitors:
        location = geocoder.ip(ip)
        create_visitor(id, location.country, domain)
    else:
        update_visitor_last_visit(id)

    if event.type == Type.PAGE_EVENT:
        event_data = {
            "search": event.data.search,
            "path": event.data.pathname,
            "referrer": event.data.referrer,
            "date": event.data.date.isoformat(),
        }
    elif event.type == Type.CLICK_EVENT:
        pass
    elif event.type == Type.CUSTOM_EVENT:
        pass

    if not event_data:
        return

    visitors = get_visitor_id(id)
    sessions = get_site_sessions_by_visitor(visitors[0]["id"])

    if not sessions or datetime.now() > datetime.fromisoformat(sessions[0]["updatedAt"]) + timedelta(minutes=10):
        sessions = create_site_session(site[0]["id"], visitors[0]["id"])
        create_page_view(sessions[0]["id"], event_data)
    else:
        update_session_updated_at(sessions[0]["id"])
        update_session_duration(sessions[0]["id"])
        create_page_view(sessions[-1]["id"], event_data)


def unique_hash(domain, ip, user_agent, salt):
    id = f"{domain}{ip}{user_agent}{salt}"
    hash = hashlib.sha256(id.encode())

    return hash.hexdigest()
