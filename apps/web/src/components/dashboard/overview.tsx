"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";
import { Skeleton } from "@repo/ui/skeleton";
import useSWR from "swr";
import { CountPageViews, GetBounceRate } from "../../app/actions/page";
import { CountSessions } from "../../app/actions/session";

export default function Overview({ params }: { params: { slug: string } }) {
    let countViews: number | undefined;

    function getTotalPageViews(slug: string) {
        const { data, error, isLoading } = useSWR(`/views/count/${slug}`, async () => await CountPageViews(slug));

        if (isLoading) return <Skeleton className="h-5 w-[150px]" />

        const totalViews = data?.[0]?.total ?? 0

        countViews = totalViews

        return totalViews
    }

    function getTotalSessions(slug: string) {
        const { data, error, isLoading } = useSWR(`/sessions/count/${slug}`, async () => await CountSessions(slug));

        if (isLoading || !countViews) return <Skeleton className="h-5 w-[150px]" />

        const totalSessions = data?.[0]?.total ?? 0;

        return (countViews / totalSessions).toFixed(2);
    }

    function getBounceRate(slug: string) {
        const { data, error, isLoading } = useSWR(`/bounce/count/${slug}`, async () => await GetBounceRate(slug));

        if (isLoading || !countViews) return <Skeleton className="h-5 w-[150px]" />

        const bouncedSessions = data?.bounceRate ?? 0;

        return (bouncedSessions / countViews).toFixed(2);
    }

    return (
        <Card className="grid md:grid-cols-4 grid-cols-2 rounded-3xl shadow">
            <CardHeader className="">
                <CardTitle className="text-xs">
                    Total Page Views
                </CardTitle>
                <div className="text-2xl text-muted-foreground">
                    {getTotalPageViews(params.slug)}
                </div>
            </CardHeader>
            <CardHeader>
                <CardTitle className="text-xs">
                    Views Per Visit
                </CardTitle>
                <div className="text-2xl text-muted-foreground">
                    {getTotalSessions(params.slug)}
                </div>
            </CardHeader>
            <CardHeader>
                <CardTitle className="text-xs">
                    Visit Duration
                </CardTitle>
                <div className="text-2xl text-muted-foreground">
                    10,000
                </div>
            </CardHeader>
            <CardHeader>
                <CardTitle className="text-xs">
                    Bounce Rate
                </CardTitle>
                <div className="text-2xl text-muted-foreground">
                    {getBounceRate(params.slug)}
                </div>
            </CardHeader>
        </Card >
    )
}