"use server"

import { auth } from '../../../auth';
import { InternalGetRecentVisitors } from '../../db/queries';

export async function GetRecentVisitors(siteId: string) {
    const session = await auth();

    if (!session)
        throw (401)

    const userId = session?.user?.id ?? ""

    return await InternalGetRecentVisitors(siteId, userId);
}