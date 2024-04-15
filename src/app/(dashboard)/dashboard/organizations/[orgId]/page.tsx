import OrgFetchPage from "@/components/dashboard/orgs/org/org-fetch-page";
import NavbarDynamic from "@/components/global/navbar/navbar-dynamic";
import Sidebar from "@/components/global/sidebar/sidebar";
import Skeleton from "@/components/ui/skeleton";
import { getOrganizationFromCache } from "@/lib/redis/methods/organization";
import { getUserFromCache } from "@/lib/redis/methods/user";
import { Metadata } from "next";
import { Suspense } from "react";

interface PageProps {
    params: {
        orgId: string;
    };
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { orgId } = params;

    const org = await getOrganizationFromCache(orgId);
    if (!org)
        return {
            title: "Organization not found",
            description: "The organization you are looking for does not exist.",
        };

    const creator = await getUserFromCache(org.creatorId);
    if (!creator)
        return {
            title: org.name,
            description: "Organization page for " + org.name + ".",
        };

    return {
        title: org.name + " by @" + creator.username,
        description: "Organization page for " + org.name + ".",
    };
}

function Page({ params }: PageProps) {
    return (
        <>
            <Sidebar params={params} />

            <div className="ml-14 flex flex-1 flex-col md:ml-[4.5rem]">
                <NavbarDynamic params={params} />

                <section className="flex flex-1 justify-center bg-background">
                    <Suspense fallback={<OrgSkeleton />}>
                        <OrgFetchPage params={params} />
                    </Suspense>
                </section>
            </div>
        </>
    );
}

export default Page;

function OrgSkeleton() {
    return (
        <div className="w-full max-w-5xl space-y-10 p-5 py-10">
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-6 w-20 rounded-full" />
            </div>

            <div className="space-y-3 rounded-xl bg-input p-5 shadow-md">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-foreground/60">
                        Invite Members
                    </h3>

                    <Skeleton className="h-8 w-14 rounded-full" />
                </div>

                <div className="flex items-center justify-between gap-2 rounded-md bg-background p-3 py-2">
                    <Skeleton className="h-8 w-1/2 rounded-full" />

                    <Skeleton className="size-8" />
                </div>
            </div>
        </div>
    );
}
