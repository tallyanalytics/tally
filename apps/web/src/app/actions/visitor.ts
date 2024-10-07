"use server"

import { DateRange } from 'react-day-picker';
import { auth } from '../../../auth';
import { InternalGetRecentVisitors } from '../../db/queries';

export async function GetRecentVisitors(siteId: string, filter: DateRange | undefined) {
    const session = await auth();

    if (!session)
        throw (401)

    if (!filter)
        throw (400)

    const userId = session?.user?.id ?? ""

    return await InternalGetRecentVisitors(siteId, userId, filter);
}