from datetime import datetime

from supabase import Client, create_client

# Supabase URL and API Key
SUPABASE_URL = "https://fjfsjpbtdigkirokhiak.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqZnNqcGJ0ZGlna2lyb2toaWFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM5MDYyODEsImV4cCI6MjAzOTQ4MjI4MX0.h4ihBVVioyouc58LrfpG9c0fR2sltUhleDwnlB-qnjA"

# Initialize the Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


# Insert into SiteSession table
def create_site_session(site_id: str, visitor_id: str):
    response = (
        supabase.table("siteSession")
        .insert(
            {
                "siteId": site_id,
                "visitorId": visitor_id,
                # "pageViews": page_views,
                "updatedAt": datetime.now().isoformat(),
            },
        )
        .execute()
    )
    return response.data


def create_page_view(session_id, data):
    response = (
        supabase.table("pageView")
        .insert(
            {
                "sessionId": session_id,
                "search": data["search"],
                "path": data["path"],
                "referrer": data["referrer"],
            },
        )
        .execute()
    )


def get_site_domain(domain):
    response = supabase.table("site").select("*").eq("domain", domain).execute()
    return response.data


def get_site_token(token):
    response = supabase.table("site").select("*").eq("token", token).execute()
    return response.data


# Query specific site session by visitor_id
def get_site_sessions_by_visitor(visitor_id: str):
    response = (
        supabase.table("siteSession")
        .select("*")
        .eq("visitorId", visitor_id)
        .order("startedAt", desc=True)
        .limit(1)
        .execute()
    )
    return response.data


def add_page_view_event(id: int, page_view: list):
    response = (
        supabase.table("siteSession")
        .update({"pageViews": page_view, "updatedAt": datetime.now().isoformat()})
        .eq("id", id)
        .execute()
    )
    return response.data


def get_visitor_id(id: str):
    response = supabase.table("visitor").select("*").eq("hashId", id).execute()
    return response.data


def create_visitor(id: str, country, referrer):
    response = supabase.table("visitor").insert({"hashId": id, "country": country, "referrer": referrer}).execute()
    return response.data


def update_visitor_last_visit(id: str):
    response = supabase.table("visitor").update({"lastVisit": datetime.now().isoformat()}).eq("hashId", id).execute()
    return response.data


def update_session_duration(id: str):
    response = (
        supabase.table("siteSession")
        .update(
            {
                "duration": supabase.func("EXTRACT(EPOCH FROM updatedAt - startedAt)"),
            },
        )
        .eq("id", id)
        .execute()
    )
    return response.data


def update_session_updated_at(id: str):
    response = (
        supabase.table("siteSession")
        .update(
            {
                "updatedAt": datetime.now().isoformat(),
            },
        )
        .eq("id", id)
        .execute()
    )
    return response.data
