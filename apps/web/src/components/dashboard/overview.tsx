"use client"

import { Card, CardHeader, CardTitle } from "@repo/ui/card";
import { Skeleton } from "@repo/ui/skeleton";
import { useEffect } from "react";
import { DateRange } from "react-day-picker";
import useSWR from "swr";
import { CountPageViews, GetBounceRate, GetVisitDuration } from "../../app/actions/page";
import { CountSessions } from "../../app/actions/session";

export default function Overview({ params, filter }: { params: { slug: string }, filter: DateRange | undefined }) {
    let countViews: number | undefined;

    function getTotalPageViews(slug: string) {
        const { data, error, isLoading, mutate } = useSWR(`/views/count/${slug}`, async () => await CountPageViews(slug, filter));

        useEffect(() => {
            mutate();
        }, [filter])

        if (isLoading) return <Skeleton className="h-5 w-[150px]" />

        const totalViews = data?.[0]?.total ?? 0

        countViews = totalViews
        return totalViews
    }

    function getTotalSessions(slug: string) {
        const { data, error, isLoading, mutate } = useSWR(`/sessions/count/${slug}`, async () => await CountSessions(slug, filter));

        useEffect(() => {
            mutate();
        }, [filter, countViews])

        if (isLoading) return <Skeleton className="h-5 w-[150px]" />


        const totalSessions = data?.[0]?.total ?? 0;
        if (totalSessions === 0 || countViews === 0 || !countViews)
            return 0

        return (countViews / totalSessions).toFixed(2);
    }

    function getBounceRate(slug: string) {
        const { data, error, isLoading, mutate } = useSWR(`/bounce/count/${slug}`, async () => await GetBounceRate(slug, filter));

        useEffect(() => {
            mutate();
        }, [filter])

        if (isLoading) return <Skeleton className="h-5 w-[150px]" />

        const bouncedSessions = data?.bounceRate ?? 0;
        if (bouncedSessions === 0 || countViews === 0 || !countViews)
            return 0

        return (bouncedSessions / countViews).toFixed(2);
    }

    function getVisitDuration(slug: string) {
        const { data, error, isLoading, mutate } = useSWR(`/visit/duration/${slug}`, async () => await GetVisitDuration(slug, filter));

        useEffect(() => {
            mutate();
        }, [filter])

        if (isLoading) return <Skeleton className="h-5 w-[150px]" />

        const visitDuration = data?.averageDuration ?? 0;

        return visitDuration;
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
                    Average Views Per Session
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
                    {getVisitDuration(params.slug)}
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