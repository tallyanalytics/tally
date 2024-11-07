import "server-only";

import { differenceInDays, differenceInMinutes, subMinutes } from 'date-fns';
import { and, count, desc, eq, gt, gte, lt, lte, sql, sum, sumDistinct } from 'drizzle-orm';
import { DateRange } from 'react-day-picker';
import { db, pageView, site, siteSession, visitor } from "../db/schema";


export async function InternalGetPageView(siteId: string, userId: string, filter: DateRange) {
    if (filter?.from && filter?.to) {
        return await db.select(
            {
                page: pageView.path,
                views: sql<number>`COUNT(*)`.as("views")
            }
        ).from(pageView)
            .where(and(gte(pageView.date, filter.from), lte(pageView.date, filter.to)))
            .leftJoin(siteSession, eq(pageView.sessionId, siteSession.id))
            .leftJoin(site, and(eq(site.id, siteId), eq(site.userId, userId)))
            .groupBy(pageView.path);
    } else if (filter?.from) {
        return await db.select(
            {
                page: pageView.path,
                views: sql<number>`COUNT(*)`.as("views")
            }
        ).from(pageView)
            .where(and(gte(pageView.date, filter.from)))
            .leftJoin(siteSession, eq(pageView.sessionId, siteSession.id))
            .leftJoin(site, and(eq(site.id, siteId), eq(site.userId, userId)))
            .groupBy(pageView.path);
    }
}

export async function InternalGetPageViews(siteId: string, userId: string) {
    return await db.select().from(pageView)
        .leftJoin(siteSession, eq(pageView.sessionId, siteSession.id))
        .leftJoin(site, and(eq(site.id, siteId), eq(site.userId, userId)))
        .where(eq(pageView.sessionId, siteId));
}

export async function InternalGetPageSources(siteId: string, userId: string, filter: DateRange) {
    if (filter?.from && filter?.to) {
        return await db.select(
            {
                referrer: pageView.referrer,
                amount: sql<number>`COUNT(*)`.as("amount")
            }
        )
            .from(pageView)
            .where(and(gte(pageView.date, filter.from), lte(pageView.date, filter.to)))
            .leftJoin(siteSession, eq(pageView.sessionId, siteSession.id))
            .leftJoin(site, and(eq(site.id, siteId), eq(site.userId, userId)))
            .groupBy(pageView.referrer);
    } else if (filter?.from) {
        return await db.select(
            {
                referrer: pageView.referrer,
                amount: sql<number>`COUNT(*)`.as("amount")
            }
        )
            .from(pageView)
            .where(and(gte(pageView.date, filter.from)))
            .leftJoin(siteSession, eq(pageView.sessionId, siteSession.id))
            .leftJoin(site, and(eq(site.id, siteId), eq(site.userId, userId)))
            .groupBy(pageView.referrer);
    }
}

export async function InternalCountPageViews(siteId: string, userId: string, filter: DateRange) {
    if (filter?.from && filter?.to) {
        return await db.select({ total: count() }).from(pageView)
            .where(and(gte(siteSession.startedAt, filter.from), lte(siteSession.startedAt, filter.to)))
            .leftJoin(siteSession, eq(pageView.sessionId, siteSession.id))
            .leftJoin(site, and(eq(site.id, siteId), eq(site.userId, userId)));
    } else if (filter?.from) {
        return await db.select({ total: count() }).from(pageView)
            .where(gte(pageView.date, filter.from))
            .leftJoin(siteSession, eq(pageView.sessionId, siteSession.id))
            .leftJoin(site, and(eq(site.id, siteId), eq(site.userId, userId)));
    } else {
        console.log("NONE", filter);
    }
}

export async function InternalCountSessions(siteId: string, userId: string, filter: DateRange) {
    if (filter?.from && filter?.to) {
        return await db.select({ total: count() }).from(siteSession)
            .where(and(gte(siteSession.startedAt, filter.from), lte(siteSession.startedAt, filter.to), eq(siteSession.siteId, siteId)))
            .leftJoin(site, eq(site.userId, userId))
    } else if (filter?.from) {
        return await db.select({ total: count() }).from(siteSession)
            .where(and(gte(siteSession.startedAt, filter.from), eq(siteSession.siteId, siteId)))
            .leftJoin(site, eq(site.userId, userId))
    }
}


export async function InternalGetRecentSessions(siteId: string, userId: string, filter: DateRange) {
    if (filter?.from && filter?.to) {
        return await db.selectDistinct({
            id: siteSession.id,
            visitorId: siteSession.visitorId,
            startedAt: siteSession.startedAt,
            updatedAt: siteSession.updatedAt,
            siteId: siteSession.siteId,
            referrer: pageView.referrer,
            views: sql<number>`COUNT(${pageView.id})`.as('views')
        })
            .from(siteSession)
            .where(and(gte(siteSession.startedAt, filter.from), lte(siteSession.startedAt, filter.to)))
            .leftJoin(site, and(eq(site.id, siteId), eq(site.userId, userId)))
            .leftJoin(pageView, eq(pageView.sessionId, siteSession.id))
            .groupBy(siteSession.id, pageView.id)
            .orderBy(desc(siteSession.updatedAt)).limit(20)
    } else if (filter?.from) {
        return await db.selectDistinct({
            id: siteSession.id,
            visitorId: siteSession.visitorId,
            startedAt: siteSession.startedAt,
            updatedAt: siteSession.updatedAt,
            siteId: siteSession.siteId,
            referrer: pageView.referrer,
            views: sql<number>`COUNT(${pageView.id})`.as('views')
        })
            .from(siteSession)
            .where(and(gte(siteSession.startedAt, filter.from)))
            .leftJoin(site, and(eq(site.id, siteId), eq(site.userId, userId)))
            .leftJoin(pageView, eq(pageView.sessionId, siteSession.id))
            .groupBy(siteSession.id, pageView.id)
            .orderBy(desc(siteSession.updatedAt)).limit(20)
    }
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
    return domain;
}

export async function InternalGetRecentVisitors(siteId: string, userId: string, filter: DateRange) {
    if (filter?.from && filter?.to) {
        return await db.selectDistinct({
            id: visitor.id,
            name: visitor.name,
            lastVisit: visitor.lastVisit,
            firstVisit: visitor.firstVisit,
            country: visitor.country,
            referrer: visitor.referrer,
        }).from(visitor)
            .where(and(gte(visitor.lastVisit, filter.from), lte(visitor.lastVisit, filter.to)))
            .leftJoin(siteSession, eq(visitor.id, siteSession.visitorId))
            .leftJoin(site, and(eq(site.id, siteId), eq(site.userId, userId)))
            .orderBy(desc(visitor.lastVisit)).limit(20)
    } else if (filter?.from) {
        return await db.selectDistinct({
            id: visitor.id,
            name: visitor.name,
            lastVisit: visitor.lastVisit,
            firstVisit: visitor.firstVisit,
            country: visitor.country,
            referrer: visitor.referrer,
        }).from(visitor)
            .where(and(gte(visitor.lastVisit, filter.from)))
            .leftJoin(siteSession, eq(visitor.id, siteSession.visitorId))
            .leftJoin(site, and(eq(site.id, siteId), eq(site.userId, userId)))
            .orderBy(desc(visitor.lastVisit)).limit(20)

    }
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
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

    return await db.selectDistinct({ total: count() }).from(pageView)
        .where(and(gte(pageView.date, startOfMonth), lt(pageView.date, endOfMonth)))
        .leftJoin(siteSession, eq(pageView.sessionId, siteSession.id))
        .leftJoin(site, and(eq(site.id, siteId), eq(site.userId, userId)));
}

export async function InternalGetBounceRate(siteId: string, userId: string, filter: DateRange) {
    if (filter?.from && filter?.to) {
        const [data] = await db
            .selectDistinct({
                bounceRate: count(siteSession.id)
            })
            .from(siteSession)
            .where(and(gte(siteSession.startedAt, filter.from), lte(siteSession.startedAt, filter.to)))
            .leftJoin(site, and(eq(site.id, siteId), eq(site.userId, userId)))
            .leftJoin(pageView, eq(pageView.sessionId, siteSession.id))
            .groupBy(siteSession.id)
            .having(eq(count(pageView.id), 1))

        return data;
    } else if (filter?.from) {
        const [data] = await db
            .selectDistinct({
                bounceRate: count(siteSession.id)
            })
            .from(siteSession)
            .where(and(gte(siteSession.startedAt, filter.from)))
            .leftJoin(site, and(eq(site.id, siteId), eq(site.userId, userId)))
            .leftJoin(pageView, eq(pageView.sessionId, siteSession.id))
            .groupBy(siteSession.id)
            .having(eq(count(pageView.id), 1))

        return data;
    }
}

export async function InternalGetVisitDuration(siteId: string, userId: string, filter: DateRange) {
    if (filter?.from && filter?.to) {
        const [data] = await db
            .selectDistinct({
                sessionCount: count(siteSession.id),
                totalDuration: sql<number>`sum(${siteSession.duration})`,
            }).from(siteSession)
        // .where(and(gte(siteSession.startedAt, filter.from), lte(siteSession.updatedAt, filter.to), eq(site.id, siteId)))
        // .where(and(eq(site.id, siteId), eq(site.userId, userId)));

        if (!data.totalDuration || data.sessionCount === 0)
            return { averageDuration: 0 };

        const averageDuration = data.totalDuration / data.sessionCount;

        return { averageDuration };
    } else if (filter?.from) {
        const [data] = await db
            .selectDistinct({
                sessionCount: count(siteSession.id),
                totalDuration: sql<number>`sum(${siteSession.duration})`,
            }).from(siteSession)
        // .where(and(gte(siteSession.startedAt, filter.from), eq(site.id, siteId)))
        // .where(and(eq(site.id, siteId), eq(site.userId, userId)));

        if (!data.totalDuration || data.sessionCount === 0)
            return { averageDuration: 0 };

        const averageDuration = data.totalDuration / data.sessionCount;

        return { averageDuration };
    }
}


export async function InternalDailyPageViews(userId: string, siteId: string, filter: DateRange) {
    if (!filter?.from) throw (400);

    return await db
        .select({
            date: sql`DATE(${pageView.date})`.as('date'),
            views: count(pageView.id).as('views')
        })
        .from(pageView)
        .where(
            filter.to ?
                and(gte(pageView.date, filter.from), lte(pageView.date, filter.to))
                : gte(pageView.date, filter.from)
        )
        .leftJoin(site, and(eq(site.id, siteId), eq(site.userId, userId)))
        .groupBy(sql`DATE(${pageView.date})`)
        .orderBy(sql`DATE(${pageView.date})`);



}