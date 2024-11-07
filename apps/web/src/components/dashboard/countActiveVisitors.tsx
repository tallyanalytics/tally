import { Skeleton } from "@repo/ui/skeleton";
import useSWR from "swr";
import { CountActiveVisitors } from "../../app/actions/site";


export default function ActiveVisitors({ slug, }: { slug: string }) {
    const { data, error, isLoading } = useSWR(`/active/visitors/${slug}`, async () => await CountActiveVisitors(slug));
    console.log(data);

    if (isLoading) return (<Skeleton className="h-5 w-[200px]" />)
    return (
        <div>
            <span className="text-sm">{data?.count ?? "0"} Active Visitors</span>
        </div>
    )
}