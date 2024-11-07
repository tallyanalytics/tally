"use client"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@repo/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@repo/ui/chart";
import { ScrollArea } from "@repo/ui/scroll-area";
import { Skeleton } from "@repo/ui/skeleton";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis, YAxis } from "recharts";
import useSWR from "swr";
import { GetPageSources } from "../../app/actions/page";

const chartConfig = {
    amount: {
        label: "Amount ",
        color: "hsl(var(--chart-1))",
    },
    label: {
        color: "hsl(var(--foreground))",
    },
} satisfies ChartConfig

export default function Sources({ params, filter }: { params: { slug: string }, filter: DateRange | undefined }) {
    const { data, error, isLoading, mutate } = useSWR(`/page/sources/${params.slug}`, async () => await GetPageSources(params.slug, filter));

    useEffect(() => {
        mutate();
    }, [filter]);

    return (
        <Card className="rounded-3xl shadow-sm">
            <CardHeader>
                <CardTitle>Sources</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea type="always" className={`min-h-[150px] h-[400px] h-max-[400px]`}>
                    {isLoading ? <Skeleton className="h-5 w-full" /> : data && data.length > 0 ? <ChartContainer
                        style={{
                            height: data.length * (35 + 8),
                            aspectRatio: "auto",
                        }}
                        className="w-full full"
                        config={chartConfig}>
                        <BarChart
                            accessibilityLayer
                            data={data}
                            layout="vertical"
                            margin={{
                                right: 30,
                            }}
                        >
                            <CartesianGrid vertical={false} horizontal={false} />
                            <YAxis
                                dataKey="referrer"
                                type="category"
                                tickLine={false}
                                axisLine={false}
                                hide
                            />
                            <XAxis dataKey="amount" type="number" hide />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel hideIndicator className="p-2" />}
                            />
                            <Bar
                                barSize={100}
                                dataKey="amount"
                                fill="hsl(var(--primary))"
                                radius={30}
                                shape={(shapeProps: any) => (
                                    <>
                                        <Rectangle {...shapeProps} />
                                        <text x={shapeProps.x + 10} y={shapeProps.y + 22.5} fill="hsl(var(--foreground))">
                                            {shapeProps.referrer ?? "Direct/Unknown"}
                                        </text>
                                        <text x={shapeProps.background.width - 10} y={shapeProps.y + 22.5} textAnchor="end" fill="hsl(var(--foreground))">
                                            {shapeProps.value.toLocaleString("en")}
                                        </text>
                                    </>
                                )}
                            >
                            </Bar>
                        </BarChart>
                    </ChartContainer> : <div className="text-muted-foreground">No data found</div>}
                </ScrollArea>
            </CardContent>
        </Card>
    )
}

