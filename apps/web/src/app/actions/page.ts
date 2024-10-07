"use server"

import { DateRange } from 'react-day-picker';
import { auth } from '../../../auth';
import { InternalCountPageViews, InternalGetBounceRate, InternalGetEventCount, InternalGetPageSources, InternalGetPageView, InternalGetPageViews, InternalGetVisitDuration } from '../../db/queries';


export async function GetPageViews(siteId: string) {
    const session = await auth();

    if (!session)
        throw (401)

    const userId = session?.user?.id ?? ""

    return await InternalGetPageViews(siteId, userId);
}



export async function GetPageView(siteId: string, filter: DateRange | undefined) {
    const session = await auth();

    if (!session)
        throw (401)

    if (!filter)
        throw (400)

    const userId = session?.user?.id ?? ""

    return await InternalGetPageView(siteId, userId, filter);
}

export async function GetPageSources(siteId: string, filter: DateRange | undefined) {
    const session = await auth();

    if (!session)
        throw (401)

    if (!filter)
        throw (400)

    const userId = session?.user?.id ?? ""

    return await InternalGetPageSources(siteId, userId, filter);
}

export async function CountPageViews(siteId: string, filter: DateRange | undefined) {
    const session = await auth();

    if (!session)
        throw (401)

    if (!filter)
        throw (400)

    const userId = session?.user?.id ?? ""

    return await InternalCountPageViews(siteId, userId, filter);
}

export async function GetEventCount(siteId: string) {
    const session = await auth();

    if (!session)
        throw (401)

    const userId = session?.user?.id ?? ""

    return await InternalGetEventCount(siteId, userId);
}

export async function GetBounceRate(siteId: string, filter: DateRange | undefined) {
    const session = await auth();

    if (!session)
        throw (401)

    if (!filter)
        throw (400)

    const userId = session?.user?.id ?? ""
    return await InternalGetBounceRate(siteId, userId, filter);
}

export async function GetVisitDuration(siteId: string, filter: DateRange | undefined) {
    const session = await auth();
    // this is my comment
    if (!session)
        throw (401)

    if (!filter)
        throw (400)

    const userId = session?.user?.id ?? ""

    return await InternalGetVisitDuration(siteId, userId, filter);
}