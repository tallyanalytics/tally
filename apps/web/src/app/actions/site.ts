"use server"

import { auth } from "../../../auth";
import { InternalCountActiveVisitors, InternalCreateSite, InternalGetSite, InternalGetSites } from '../../db/queries';

export async function CreateSite(params: { name: string, domain: string }) {
    const session = await auth();

    if (!session)
        throw (401)

    const userId = session?.user?.id ?? ""
    return await InternalCreateSite(params.name, params.domain, userId)
}

export async function GetSites() {
    const session = await auth();

    if (!session)
        throw (401)

    const userId = session?.user?.id ?? ""
    return await InternalGetSites(userId);
}

export async function GetSite(id: string) {
    const session = await auth();

    if (!session)
        throw (401)

    const userId = session?.user?.id ?? ""

    return await InternalGetSite(id, userId);
}

export async function CountActiveVisitors(siteId: string) {
    const session = await auth();

    if (!session)
        throw (401)

    const userId = session?.user?.id ?? ""

    return await InternalCountActiveVisitors(userId, siteId)
}