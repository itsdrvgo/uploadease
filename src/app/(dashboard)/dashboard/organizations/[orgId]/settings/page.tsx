import SettingsFetchPage from "@/components/dashboard/orgs/org/settings/settings-fetch-page";
import NavbarDynamic from "@/components/global/navbar/navbar-dynamic";
import Sidebar from "@/components/global/sidebar/sidebar";
import Skeleton from "@/components/ui/skeleton";
import { Metadata } from "next";
import { Suspense } from "react";

interface PageProps {
    params: {
        orgId: string;
    };
}

export const metadata: Metadata = {
    title: "Settings",
    description: "Organization settings",
};

function Page({ params }: PageProps) {
    return (
        <>
            <Sidebar params={params} />

            <div className="ml-14 flex flex-1 flex-col md:ml-[4.5rem]">
                <NavbarDynamic params={params} />

                <section className="flex flex-1 justify-center bg-background">
                    <Suspense fallback={<OrgSettingsSkeleton />}>
                        <SettingsFetchPage params={params} />
                    </Suspense>
                </section>
            </div>
        </>
    );
}

export default Page;

function OrgSettingsSkeleton() {
    return (
        <div className="w-full max-w-2xl space-y-5 p-5 py-10">
            {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-52 w-full rounded-xl" />
            ))}
        </div>
    );
}
