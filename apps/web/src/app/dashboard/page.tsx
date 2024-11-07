"use client"

import { Card, CardHeader, CardTitle } from "@repo/ui/card";
import { Skeleton } from "@repo/ui/skeleton";
import useSWR from "swr";
import AddSiteButton from "../../components/dashboard/addSiteButton";
import { GetSites } from "../actions/site";

export default function Page(): JSX.Element {
    const { data, error, isLoading } = useSWR("/sites", async () => await GetSites());
    return (
        <main className="w-full grid grid-cols-2 gap-6">
            <div className="col-span-2 w-100">
                <DashboardNav />
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
    return (
        <div className="w-100 flex justify-between">
            <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>
            <div className="flex content-center items-center">
                <div className="pr-4">
                    <AddSiteButton />
                </div>
            </div>
        </div >
    )
}

