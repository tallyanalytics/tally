"use client"

import { DashboardIcon, FileIcon, GearIcon } from "@radix-ui/react-icons";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@repo/ui/accordion";
import { Button, buttonVariants } from "@repo/ui/button";
import { cn } from "@repo/ui/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@repo/ui/sheet";
import Link from "next/link";
import { useParams, usePathname } from 'next/navigation';
import useSWR from "swr";
import { ModeToggle } from "../theme-toggle";


import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import { Card, CardContent } from "@repo/ui/card";
import { Progress } from "@repo/ui/progress";
import { Separator } from "@repo/ui/separator";
import { SessionProvider, useSession } from "next-auth/react";
import { GetEventCount } from "../../app/actions/page";
import { GetSites } from "../../app/actions/site";

function Menu() {
    const { data, error, isLoading } = useSWR(`/site`, async () => await GetSites());
    const pathname = usePathname();
    const session = useSession();
    if (isLoading) return

    return (
        <div>
            <Button variant="ghost" className="flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline">
                <Avatar className="h-5 w-5 mr-2">
                    {
                        session?.data?.user?.image ?
                            <AvatarImage src={session?.data?.user?.image} alt="User profile image" />
                            :
                            <AvatarFallback>{session?.data?.user?.name?.charAt(0)}</AvatarFallback>
                    }
                </Avatar>
                <div>
                    {session?.data?.user?.name}
                </div>
            </Button>
            <Separator className="my-4 border" />
            <Link
                href="/dashboard"
                className={cn(
                    buttonVariants({
                        variant: "ghost",
                    }),
                    "justify-start w-full",
                    pathname === "/dashboard" && "text-primary"
                )}
            ><DashboardIcon className="mr-2 h-4 w-4" /> Dashboard
            </Link>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="Sites" className="border-b-0">
                    <AccordionTrigger
                        className={cn(
                            buttonVariants({
                                variant: "ghost",
                            }),
                            "justify-between [&[data-state=open]>svg]:rotate-180",
                            pathname.startsWith("/site/") && "text-primary"
                        )}
                    >
                        <div className="flex items-center justify-start">
                            <FileIcon className="mr-2 h-4 w-4" /> Sites
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="ml-2 flex flex-col space-y-1">
                            {data?.map((child, index) => (
                                <Link
                                    key={index}
                                    prefetch={false}
                                    href={`/site/${child.href}`}
                                    className={cn(
                                        buttonVariants({
                                            size: "sm",
                                            variant: "ghost",
                                        }),
                                        "justify-start ml-5",
                                        pathname === `/site/${child.href}` && "text-primary"
                                    )}
                                >
                                    {child.name}
                                </Link>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <Link
                href="/settings"
                className={cn(
                    buttonVariants({
                        variant: "ghost",
                    }),
                    "justify-start w-full",
                    pathname === "/settings" && "text-primary"
                )}
            ><GearIcon className="mr-2 w-4 h-4" />Settings
            </Link>
        </div >
    )
}

function EventUsage() {
    const params = useParams<{ slug: string }>();
    const { data, error, isLoading } = useSWR("/event/count", async () => await GetEventCount(params.slug));

    return (
        <Card className="hidden md:hidden lg:grid  text-center">
            <CardContent className="p-4">
                <div className="lg:grid-cols-1 space-y-1 text-sm">
                    <div className="">Events used</div>
                    <div className="">{data?.[0]?.total} of 1,000,000</div>
                    <div>
                        <Progress value={0} />
                    </div>
                </div>
                <div className="w-full mt-3">
                    <Link href="/upgrade" className={buttonVariants({ variant: "default" }) + "flex self-end w-full sm:hidden lg:flex md:flex"}>
                        Upgrade
                    </Link>
                </div>
            </CardContent>
        </Card>
    )

}

export default function SideNav() {
    return (
        <div className="flex flex-col justify-between h-screen w-full py-6 px-2">
            <nav className="flex-col text-sm font-medium">
                <div className="flex w-full md:hidden lg:hidden items-center">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="lg:hidden">
                                <HamburgerMenuIcon className="h-6 w-6" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left">
                            <SessionProvider>
                                <Menu />
                            </SessionProvider>
                        </SheetContent>
                    </Sheet>
                </div>
                <div className="hidden md:grid lg:grid grid-cols-1">
                    <SessionProvider>
                        <Menu />
                    </SessionProvider>
                </div>
            </nav >
            <div>
                <div className="py-2">
                    <ModeToggle />
                </div>
                <EventUsage />
            </div>
        </div >
    )
}