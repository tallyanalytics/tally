"use server"

import { DateRange } from 'react-day-picker';
import { auth } from '../../../auth';
import { InternalCountSessions, InternalGetRecentSessionPages, InternalGetRecentSessions } from '../../db/queries';

export async function GetRecentSessions(siteId: string, filter: DateRange | undefined) {
    const session = await auth();

    if (!session)
        throw (401)

    if (!filter)
        throw (400)

    const userId = session?.user?.id ?? ""

    return await InternalGetRecentSessions(siteId, userId, filter);
}

export async function GetRecentSessionPages(sessionId: string) {
    const session = await auth();

    if (!session)
        throw (401)

    const userId = session?.user?.id ?? ""

    return await InternalGetRecentSessionPages(sessionId, userId);
}

export async function CountSessions(siteId: string, filter: DateRange | undefined) {
    const session = await auth();

    if (!session)
        throw (401)

    if (!filter)
        throw (400)

    const userId = session?.user?.id ?? ""

    return await InternalCountSessions(siteId, userId, filter);
}
