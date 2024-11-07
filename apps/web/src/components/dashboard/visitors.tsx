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
import { GetRecentVisitors } from "../../app/actions/visitor";

function getFlag(countryName: string) {
    return 'http://purecatamphetamine.github.io/country-flag-icons/3x2/' + countryName + '.svg';
}

interface Visitor {
    name: string | null;
    firstVisit: Date;
    lastVisit: Date;
    referrer: string | null;
    country: string | null;
    id: string;
}


export default function Visitors({ params, filter }: { params: { slug: string }, filter: DateRange | undefined }) {
    const { data, error, isLoading, mutate } = useSWR(`/visitors/${params.slug}`, async () => await GetRecentVisitors(params.slug, filter));

    useEffect(() => {
        mutate();
    }, [filter]);

    return (
        <Card className="rounded-3xl shadow-sm">
            <CardHeader>
                <CardTitle className="font-semibold">Recent Visitors</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea type="always" className={`min-h-[150px] h-[400px] h-max-[400px]`}>
                    {isLoading ? <Skeleton className="h-5 w-full" /> : data && data.length > 0 ? <Table className="text-left">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Country</TableHead>
                                <TableHead>Referrer</TableHead>
                                <TableHead>Last Visit</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data?.map((visitor, index) => (
                                <TableRow key={index}>
                                    <TableCell>{visitor.name}</TableCell>
                                    <TableCell>
                                        {
                                            visitor.country ?
                                                <img
                                                    alt={visitor.country}
                                                    className="w-5 h-5"
                                                    src={getFlag(visitor.country)} />
                                                : ""
                                        }
                                    </TableCell>
                                    <TableCell>{visitor.referrer ?? ""}</TableCell>
                                    <TableCell>{visitor.lastVisit.toLocaleString("en-GB")}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table> : <div className="text-muted-foreground">No visitors found</div>}
                </ScrollArea>
            </CardContent>
        </Card >
    )
}

