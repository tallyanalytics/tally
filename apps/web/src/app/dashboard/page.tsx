"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import { Card, CardHeader, CardTitle } from "@repo/ui/card";
import { SessionProvider, useSession } from "next-auth/react";
import useSWR from "swr";
import AddSiteButton from "../../components/dashboard/addSiteButton";
import { GetSites } from "../actions/site";

export default function Page(): JSX.Element {
    const { data, error, isLoading } = useSWR("/dashboard", async () => await GetSites());

    return (
        <main className="w-full grid grid-cols-2 gap-6">
            <div className="col-span-2 w-100">
                <SessionProvider>
                    <DashboardNav />
                </SessionProvider>
            </div>
            <div>
            </div>
        </main>
    )
}

function DashboardSiteCard(domain: string) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{domain}</CardTitle>
            </CardHeader>
            <div>
                <div></div>
            </div>
        </Card>
    )

}

function DashboardNav() {
    const session = useSession();

    return (
        <div className="w-100 flex justify-between">
            <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>
            <div className="flex content-center items-center">
                <div className="pr-4">
                    <AddSiteButton />
                </div>
                <div>
                    <Avatar className="h-8 w-8">
                        {
                            session?.data?.user?.image ?
                                <AvatarImage src={session?.data?.user?.image} alt="User profile image" />
                                :
                                <AvatarFallback>{session?.data?.user?.name?.charAt(0)}</AvatarFallback>
                        }
                    </Avatar>
                </div>
            </div>
        </div >
    )
}

