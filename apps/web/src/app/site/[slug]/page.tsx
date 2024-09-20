"use client"

import { CalendarIcon } from "@radix-ui/react-icons";
import { Button } from "@repo/ui/button";
import { Calendar } from "@repo/ui/calendar";
import { cn } from "@repo/ui/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { format } from "date-fns";
import { SessionProvider } from 'next-auth/react';
import { useState } from "react";
import { DateRange } from "react-day-picker";
import Overview from "../../../components/dashboard/overview";
import Pages from "../../../components/dashboard/pages";
import Sessions from "../../../components/dashboard/sessions";
import Sources from "../../../components/dashboard/sources";
import TopNav from "../../../components/dashboard/topNav";
import UniqueViews from "../../../components/dashboard/uniqueViews";
import Visitors from "../../../components/dashboard/visitors";


export default function Page({ params }: { params: { slug: string } }): JSX.Element {
  console.log(params.slug)
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  })

  return (
    <main className="w-full grid grid-cols-2 gap-6">
      <div className="col-span-2 w-100">
        <SessionProvider>
          <TopNav slug={params.slug} />
        </SessionProvider>
      </div>
      <div className="col-span-2">
        <Select>
          <SelectTrigger className="w-[150px] float-end">
            <SelectValue placeholder="Select time" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="apple">Last hour</SelectItem>
              <SelectItem value="banana">Last day</SelectItem>
              <SelectItem value="blueberry">Last week</SelectItem>
              <SelectItem value="grapes">Last month</SelectItem>
              <SelectItem value="pineapple">Last year</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] pl-3 text-left font-normal bg-card",
                !dateFilter && "text-muted-foreground"
              )}
            >
              {dateFilter?.from ? (
                dateFilter.to ? (
                  <>
                    {format(dateFilter.from, "LLL dd, y")} -{" "}
                    {format(dateFilter.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateFilter.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateFilter}
              onSelect={setDateFilter}
              disabled={(date: Date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="col-span-2">
        <Overview params={params} />
      </div>
      <div className="col-span-2">
        <UniqueViews params={params} />
      </div>
      <div className="col-span-2 lg:col-span-1">
        <Pages params={params} />
      </div>
      <div className="col-span-2 lg:col-span-1">
        <Sources params={params} />
      </div>
      <div className="col-span-2 lg:col-span-1">
        <Visitors params={params} />
      </div>
      <div className="col-span-2 lg:col-span-1">
        <Sessions params={params} />
      </div>
    </main >
  );
}
