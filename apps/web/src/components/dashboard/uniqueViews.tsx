"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@repo/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@repo/ui/chart";
import { Area, AreaChart, CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis } from "recharts";


const visitors = [
    { date: "2022-01-01", views: 100 },
    { date: "2022-01-02", views: 30 },
    { date: "2022-01-03", views: 12 },
    { date: "2022-01-04", views: 5 },
    { date: "2022-01-05", views: 2 },
    { date: "2022-01-06", views: 1 },
    { date: "2022-01-07", views: 0 },
    { date: "2022-01-08", views: 0 },
    { date: "2022-01-09", views: 0 },
    { date: "2022-01-10", views: 0 },
    { date: "2022-01-11", views: 0 },
    { date: "2022-01-12", views: 0 },
    { date: "2022-01-13", views: 0 },
    { date: "2022-01-14", views: 0 },
    { date: "2022-01-15", views: 0 },
    { date: "2022-01-16", views: 0 },
    { date: "2022-01-17", views: 0 },
    { date: "2022-01-18", views: 0 },
    { date: "2022-01-19", views: 0 },
    { date: "2022-01-20", views: 0 },
    { date: "2022-01-21", views: 0 },
    { date: "2022-01-22", views: 0 },
    { date: "2022-01-23", views: 0 },
    { date: "2022-01-24", views: 0 },
    { date: "2022-01-25", views: 0 },
]
const chartConfig = {
    views: {
        label: "views",
        color: "hsl(var(--primary))",
    },
} satisfies ChartConfig

export default function UniqueViews({ params }: { params: { slug: string } }) {
    return (
        <Card className="rounded-3xl shadow">
            <CardHeader>
                <CardTitle>Page Views</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer className="min-h-[200px] w-full max-h-[300px]" config={chartConfig}>
                    <AreaChart
                        accessibilityLayer
                        data={visitors}
                        margin={{
                            top: 20,
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent
                                labelKey="Page views "
                                hideIndicator={true}
                                className="p-2"
                                nameKey="Page views "
                                indicator="line" />
                            }
                        />
                        <Area
                            dataKey="views"
                            type="natural"
                            fill="hsl(var(--primary))"
                            stroke="hsl(var(--primary))"
                            dot={{
                                fill: "var(--primary)",
                            }}
                            activeDot={{
                                r: 6,
                            }}
                        >
                        </Area>
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card >
    )
}