"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@repo/ui/chart";
import { differenceInDays, } from 'date-fns';
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import useSWR from "swr";
import { GetDailyPageViews } from "../../app/actions/site";

const chartConfig = {
    views: {
        label: "views",
        color: "hsl(var(--primary))",
    },
    date: {
        label: "date",
        color: "hsl(var(--primary))",
    },
} satisfies ChartConfig

export default function UniqueViews({ params, filter, selectValue }: { params: { slug: string }, filter: DateRange | undefined, selectValue: string }) {
    const { data, error, isLoading, mutate } = useSWR(`/unique/views/${params.slug}`, async () => await GetDailyPageViews(params.slug, filter));

    const [dates, setDates] = useState<{ date: string, views: number }[]>([]);

    useEffect(() => {
        mutate();
        AppendDates();
    }, [filter]);

    function FormatXTick(date: string) {
        const fDate = new Date(date);
        if (selectValue === "lastHour" || selectValue === "lastDay")
            return fDate.toTimeString().split(" ")[0];
        return fDate.toLocaleDateString('en-GB');
    }

    function AppendDates() {
        if (!filter?.from) return;
        console.log(selectValue);

        const today = new Date();
        const dateList = [];

        if (selectValue === "lastHour") {
            for (let i = 0; i < 60; i++) {
                const date = new Date(today);
                date.setMinutes(date.getMinutes() - i);
                dateList.push({ date: date.toISOString(), views: 0 });
            };
        } else if (selectValue === "lastDay") {
            for (let i = 0; i < 24; i++) {
                const date = new Date(today);
                date.setHours(today.getHours() - i);
                dateList.push({ date: date.toISOString(), views: 0 });
            };
        } else {
            const diff = differenceInDays(filter?.to || new Date(), filter?.from);

            for (let i = 0; i < diff; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() - i);
                dateList.push({ date: date.toISOString(), views: 0 });
            };
        }
        setDates(dateList);
    }

    function joinArraysByDate(arr1) {
        const combined = [...arr1, ...dates];
        let result = [];

        if (selectValue === "lastHour") {
            result = combined.reduce((acc, item) => {
                const dateTimeKey = new Date(item.date).toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"

                if (acc[dateTimeKey]) {
                    acc[dateTimeKey].views = item.views;
                } else {
                    acc[dateTimeKey] = { date: item.date, views: item.views };
                }
                return acc;
            }, {});

        } else if (selectValue === "lastDay") {
            result = combined.reduce((acc, item) => {
                const dateTimeKey = new Date(item.date).toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"

                if (acc[dateTimeKey]) {
                    acc[dateTimeKey].views = item.views;
                } else {
                    acc[dateTimeKey] = { date: item.date, views: item.views };
                }
                return acc;
            }, {});
        } else {
            result = combined.reduce((acc, item) => {

                if (acc[item.date]) {
                    acc[item.date].views = item.views;
                } else {
                    acc[item.date] = { date: item.date, views: item.views };
                }
                return acc;
            }, {});
        }

        return Object.values(result).reverse();
    }

    return (
        <Card className="rounded-3xl shadow-sm">
            <CardHeader>
                <CardTitle>Page Views</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer className="min-h-[200px] w-full max-h-[300px]" config={chartConfig}>
                    <AreaChart
                        accessibilityLayer
                        data={joinArraysByDate(data || [])}
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
                            tickFormatter={FormatXTick}
                        />
                        <ChartTooltip
                            content={<ChartTooltipContent
                                labelKey="views "
                                nameKey="Views "
                                indicator="line" />
                            }
                        />
                        <Area
                            dataKey="views"
                            type="linear"
                            fill="hsl(var(--primary))"
                            stroke="hsl(var(--primary))"
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
