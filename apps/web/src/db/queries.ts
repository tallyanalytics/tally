import "server-only";

import { subMinutes } from 'date-fns';
import { and, count, desc, eq, gt, sql } from 'drizzle-orm';
import { db, pageView, site, siteSession, visitor } from "../db/schema";


export async function InternalGetPageView(siteId: string, userId: string) {
    return await db.select(
        {
            page: pageView.path,
            views: sql<number>`COUNT(*)`.as("views")
        }
    ).from(pageView)
        .leftJoin(siteSession, eq(pageView.sessionId, siteSession.id))
        .leftJoin(site, and(eq(site.id, siteId), eq(site.userId, userId)))
        .groupBy(pageView.path);
}

export async function InternalGetPageViews(siteId: string, userId: string) {
    return await db.select().from(pageView)
        .leftJoin(siteSession, eq(pageView.sessionId, siteSession.id))
        .leftJoin(site, and(eq(site.id, siteId), eq(site.userId, userId)))
        .where(eq(pageView.sessionId, siteId));
}

export async function InternalGetPageSources(siteId: string, userId: string) {
    return await db.select(
        {
            referrer: pageView.referrer,
            amount: sql<number>`COUNT(*)`.as("amount")
        }
    ).from(pageView)
        .leftJoin(siteSession, eq(pageView.sessionId, siteSession.id))
        .leftJoin(site, and(eq(site.id, siteId), eq(site.userId, userId)))
        .groupBy(pageView.referrer);
}

export async function InternalCountPageViews(siteId: string, userId: string) {
    return await db.select({ total: count() }).from(pageView)
        .leftJoin(siteSession, eq(pageView.sessionId, siteSession.id))
        .leftJoin(site, and(eq(site.id, siteId), eq(site.userId, userId)))
}

export async function InternalCountSessions(siteId: string, userId: string) {
    return await db.select({ total: count() }).from(siteSession)
        .where(eq(siteSession.siteId, siteId))
        .leftJoin(site, eq(site.userId, userId));
}


export async function InternalGetRecentSessions(siteId: string, userId: string) {
    return await db.selectDistinct({
        id: siteSession.id,
        visitorId: siteSession.visitorId,
        startedAt: siteSession.startedAt,
        updatedAt: siteSession.updatedAt,
        siteId: siteSession.siteId,
        referrer: pageView.referrer,
        views: sql<number>`COUNT(${pageView.id})`.as('views')
    }).from(siteSession)
        .leftJoin(site, and(eq(site.id, siteId), eq(site.userId, userId)))
        .leftJoin(pageView, eq(pageView.sessionId, siteSession.id))
        .groupBy(siteSession.id, pageView.id)
        .orderBy(desc(siteSession.updatedAt)).limit(20)
}


export async function InternalGetRecentSessionPages(sessionId: string, userId: string) {
    return await db.select({ views: count() }).from(pageView)
        .leftJoin(siteSession, eq(siteSession.id, sessionId))
        .leftJoin(site, eq(site.userId, userId));
}


export async function InternalCreateSite(name: string, domain: string, userId: string) {
    return await db.insert(site).values({ name, domain, userId });
}

export async function InternalGetSites(userId: string) {
    return await db.select({ href: site.id, name: site.name }).from(site).where(eq(site.userId, userId));
}

export async function InternalGetSite(id: string, userId: string) {
    const [domain] = await db.select({
        domain: site.domain,
    }).from(site).where(and(eq(site.id, id), eq(site.userId, userId)));

    console.log(domain)
    return domain;
}

export async function InternalGetRecentVisitors(siteId: string, userId: string) {
    return await db.selectDistinct({
        id: visitor.id,
        name: visitor.name,
        lastVisit: visitor.lastVisit,
        firstVisit: visitor.firstVisit,
        country: visitor.country,
        referrer: visitor.referrer,
    }).from(visitor)
        .leftJoin(siteSession, eq(visitor.id, siteSession.visitorId))
        .leftJoin(site, and(eq(site.id, siteId), eq(site.userId, userId)))
        .orderBy(desc(visitor.lastVisit)).limit(20)
}


export async function InternalCountActiveVisitors(userId: string, siteId: string) {
    const tenMinutesAgo = subMinutes(new Date(), 10);

    const [data] = await db.selectDistinct({
        count: count(),
    }).from(visitor)
        .leftJoin(siteSession, eq(visitor.id, siteSession.visitorId))
        .leftJoin(site, and(eq(site.id, siteId), eq(site.userId, userId)))
        .where(gt(visitor.lastVisit, tenMinutesAgo));
    console.log(data)

    return data;
}

export async function InternalGetEventCount(siteId: string, userId: string) {
    //? Add other table counts, eg custom events or make an events table and count there (RESET EVERY MONTH)
    return await InternalCountPageViews(siteId, userId);
}

export async function InternalGetBounceRate(siteId: string, userId: string) {
    const [data] = await db
        .selectDistinct({
            bounceRate: count(siteSession.id)
        })
        .from(siteSession)
        .leftJoin(site, and(eq(site.id, siteId), eq(site.userId, userId)))
        .leftJoin(pageView, eq(pageView.sessionId, siteSession.id))
        .groupBy(siteSession.id)
        .having(eq(count(pageView.id), 1))

    return data;
}