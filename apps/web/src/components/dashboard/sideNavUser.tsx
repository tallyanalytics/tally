"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import { auth } from '../../../auth';

export default async function SideNavUser() {
    "use client"
    const session = await auth();
    return (
        <div>
            <Avatar>
                {
                    session?.user?.image ?
                        <AvatarImage src={session?.user?.image} alt="User profile image" />
                        :
                        <AvatarFallback>{session?.user?.name?.charAt(0)}</AvatarFallback>
                }
            </Avatar>
        </div>)
}