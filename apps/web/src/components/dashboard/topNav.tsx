"use client"
import { Skeleton } from "@repo/ui/skeleton";
import useSWR from "swr";
import { GetSite } from "../../app/actions/site";
import AddSiteButton from "./addSiteButton";
import ActiveVisitors from "./countActiveVisitors";

export default function TopNav({ slug, }: { slug: string }) {
    const { data, error, isLoading } = useSWR(`/site/${slug}`, async () => await GetSite(slug));

    // const session = useSession();
    return (
        <div className="w-100 flex justify-between">
            <div>
                <h1 className="text-2xl font-bold">Site Overview</h1>
                {
                    isLoading ?
                        <Skeleton className="h-5 w-[200px]" />
                        :
                        <span className="text-sm">{data?.domain}</span>

                }
                <ActiveVisitors slug={slug} />
            </div>
            <div className="flex content-center items-center">
                <div className="pr-4">
                    <AddSiteButton />
                </div>
            </div>
        </div >
    )
}