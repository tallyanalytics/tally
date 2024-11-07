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
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>({
    from: subtractFromCurrentDate({ hours: 1 }),
  })
  const [selectValue, setSelectValue] = useState("lastHour");

  function subtractFromCurrentDate({ hours = 0, days = 0, months = 0, years = 0 }) {
    const currentDate = new Date();

    if (hours) {
      currentDate.setHours(currentDate.getHours() - hours);
    }
    if (days) {
      currentDate.setDate(currentDate.getDate() - days);
    }
    if (months) {
      currentDate.setMonth(currentDate.getMonth() - months);
    }
    if (years) {
      currentDate.setFullYear(currentDate.getFullYear() - years);
    }

    return currentDate;
  }

  function selectOnChange(value: string) {
    let newDate: Date;

    switch (value) {
      case "lastHour": // Last hour
        newDate = subtractFromCurrentDate({ hours: 1 });
        break;
      case "lastDay": // Last day (24 hours)
        newDate = subtractFromCurrentDate({ hours: 24 });
        break;
      case "lastWeek": // Last week (7 days)
        newDate = subtractFromCurrentDate({ days: 7 });
        break;
      case "lastMonth": // Last month
        newDate = subtractFromCurrentDate({ months: 1 });
        break;
      case "last6Months": // Last month
        newDate = subtractFromCurrentDate({ months: 6 });
        break;
      case "lastYear": // Last year
        newDate = subtractFromCurrentDate({ years: 1 });
        break;
      default:
        newDate = new Date(); // Default to the current date if no match
    }

    setSelectValue(value);
    setDateFilter({ from: newDate, to: undefined })
  }

  return (
    <main className="w-full grid grid-cols-2 gap-6">
      <div className="col-span-2 w-100">
        <TopNav slug={params.slug} />
      </div>
      <div className="col-span-2">
        <Select onValueChange={selectOnChange} defaultValue="lastHour">
          <SelectTrigger className="w-[150px] float-end">
            <SelectValue placeholder="Select time" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="lastHour">Last hour</SelectItem>
              <SelectItem value="lastDay">Last day</SelectItem>
              <SelectItem value="lastWeek">Last week</SelectItem>
              <SelectItem value="lastMonth">Last month</SelectItem>
              <SelectItem value="last6Months">Last 6 months</SelectItem>
              <SelectItem value="lastYear">Last year</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {/* <Popover>
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
                date > new Date() || date < new Date("2024-01-01")
              }
              initialFocus
            />
          </PopoverContent>
        </Popover> */}
      </div>
      <div className="col-span-2">
        <Overview params={params} filter={dateFilter} />
      </div>
      <div className="col-span-2">
        <UniqueViews params={params} filter={dateFilter} selectValue={selectValue} />
      </div>
      <div className="col-span-2 lg:col-span-1">
        <Pages params={params} filter={dateFilter} />
      </div>
      <div className="col-span-2 lg:col-span-1">
        <Sources params={params} filter={dateFilter} />
      </div>
      <div className="col-span-2 lg:col-span-1">
        <Visitors params={params} filter={dateFilter} />
      </div>
      <div className="col-span-2 lg:col-span-1">
        <Sessions params={params} filter={dateFilter} />
      </div>
    </main >
  );
}
