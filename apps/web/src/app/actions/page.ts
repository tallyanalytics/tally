"use server"

import { auth } from '../../../auth';
import { InternalCountPageViews, InternalGetBounceRate, InternalGetEventCount, InternalGetPageSources, InternalGetPageView, InternalGetPageViews } from '../../db/queries';


export async function GetPageViews(siteId: string) {
    const session = await auth();

    if (!session)
        throw (401)

    const userId = session?.user?.id ?? ""

    return await InternalGetPageViews(siteId, userId);
}



export async function GetPageView(siteId: string) {
    const session = await auth();

    if (!session)
        throw (401)

    const userId = session?.user?.id ?? ""

    return await InternalGetPageView(siteId, userId);
}

export async function GetPageSources(siteId: string) {
    const session = await auth();

    if (!session)
        throw (401)

    const userId = session?.user?.id ?? ""

    return await InternalGetPageSources(siteId, userId);
}

export async function CountPageViews(siteId: string) {
    const session = await auth();

    if (!session)
        throw (401)

    const userId = session?.user?.id ?? ""

    return await InternalCountPageViews(siteId, userId);
}

export async function GetEventCount(siteId: string) {
    const session = await auth();

    if (!session)
        throw (401)

    const userId = session?.user?.id ?? ""

    return await InternalGetEventCount(siteId, userId);
}

export async function GetBounceRate(siteId: string) {
    const session = await auth();

    if (!session)
        throw (401)

    const userId = session?.user?.id ?? ""
    return await InternalGetBounceRate(siteId, userId);
}
