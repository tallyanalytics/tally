"use server"

import { auth } from '../../../auth';
import { InternalCountSessions, InternalGetRecentSessionPages, InternalGetRecentSessions } from '../../db/queries';

export async function GetRecentSessions(siteId: string) {
    const session = await auth();

    if (!session)
        throw (401)

    const userId = session?.user?.id ?? ""

    return await InternalGetRecentSessions(siteId, userId);
}

export async function GetRecentSessionPages(sessionId: string) {
    const session = await auth();

    if (!session)
        throw (401)

    const userId = session?.user?.id ?? ""

    return await InternalGetRecentSessionPages(sessionId, userId);
}

export async function CountSessions(siteId: string) {
    const session = await auth();

    if (!session)
        throw (401)

    const userId = session?.user?.id ?? ""
    console.log(siteId, userId)

    return await InternalCountSessions(siteId, userId);
}
