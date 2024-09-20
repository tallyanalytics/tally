"use client"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@repo/ui/card";
import { ScrollArea } from "@repo/ui/scroll-area";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@repo/ui/table";
import { useEffect, useState } from "react";
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

export default function Sessions({ params }: { params: { slug: string } }) {
    const [sessions, setSessions] = useState<Session[]>([]);

    useEffect(() => {
        async function call() {
            const response = await GetRecentSessions(params.slug);
            setSessions(response);
        }
        call();
    }, [])

    return (
        <Card className="rounded-3xl shadow">
            <CardHeader>
                <CardTitle className="font-semibold">Recent Sessions</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea type="always" className={`min-h-[150px] h-[400px] h-max-[400px]`}>
                    <Table className="text-left">
                        <TableHeader className="sticky">
                            <TableRow>
                                <TableHead>Referrer</TableHead>
                                <TableHead>Viewed Pages</TableHead>
                                <TableHead>Last Visit</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sessions.map((session, index) => (
                                <TableRow key={index}>
                                    <TableCell>{session.referrer ?? "Direct/Unknown"}</TableCell>
                                    <TableCell>{session?.views}</TableCell>
                                    <TableCell>{session?.updatedAt.toLocaleString("en-GB")}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </CardContent>
        </Card >
    )
}
