"use client"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@repo/ui/card";
import { ScrollArea } from "@repo/ui/scroll-area";
import { Skeleton } from "@repo/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@repo/ui/table";
import { useEffect } from "react";
import { DateRange } from "react-day-picker";
import useSWR from "swr";
import { GetRecentSessions } from "../../app/actions/session";

interface Session {
    id: string;
    visitorId: string;
    startedAt: Date;
    updatedAt: Date;
    siteId: string | null;
    referrer: string | null;
    views: number;
}

export default function Sessions({ params, filter }: { params: { slug: string }, filter: DateRange | undefined }) {
    const { data, error, isLoading, mutate } = useSWR(`/visitors/${params.slug}`, async () => await GetRecentSessions(params.slug, filter));
    useEffect(() => {
        mutate();
    }, [filter]);

    return (
        <Card className="rounded-3xl shadow-sm">
            <CardHeader>
                <CardTitle className="font-semibold">Recent Sessions</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea type="always" className={`min-h-[150px] h-[400px] h-max-[400px]`}>
                    {isLoading ? <Skeleton className="h-5 w-full" /> : data && data.length > 0 ? <Table className="text-left">
                        <TableHeader className="sticky">
                            <TableRow>
                                <TableHead>Referrer</TableHead>
                                <TableHead>Viewed Pages</TableHead>
                                <TableHead>Last Visit</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data?.map((session, index) => (
                                <TableRow key={index}>
                                    <TableCell>{session.referrer ?? "Direct/Unknown"}</TableCell>
                                    <TableCell>{session?.views}</TableCell>
                                    <TableCell>{session?.updatedAt?.toLocaleString("en-GB")}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table> : <div className="text-muted-foreground">No sessions found</div>}
                </ScrollArea>
            </CardContent>
        </Card >
    )
}
