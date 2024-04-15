import OrgsFetchPage from "@/components/dashboard/orgs/orgs-fetch-page";
import NavbarDash from "@/components/global/navbar/navbar-dash";
import Sidebar from "@/components/global/sidebar/sidebar";
import { Icons } from "@/components/icons/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Skeleton from "@/components/ui/skeleton";
import { Suspense } from "react";

function Page() {
    return (
        <>
            <Sidebar />

            <div className="ml-14 flex flex-1 flex-col md:ml-[4.5rem]">
                <NavbarDash />

                <section className="flex flex-1 justify-center bg-background">
                    <Suspense fallback={<OrgsSkeleton />}>
                        <OrgsFetchPage />
                    </Suspense>
                </section>
            </div>
        </>
    );
}

export default Page;

function OrgsSkeleton() {
    return (
        <div className="w-full max-w-5xl space-y-5 p-5 py-10">
            <div className="flex flex-col-reverse gap-2 md:flex-row md:items-center">
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" isDisabled>
                        Join Organization
                    </Button>

                    <Button size="sm" isDisabled>
                        New Organization
                    </Button>
                </div>

                <Input
                    placeholder="Search for an organization"
                    type="search"
                    sizes="sm"
                    startContent={
                        <Icons.search className="size-3 text-muted-foreground" />
                    }
                    isDisabled
                    classNames={{
                        container: "md:w-52 h-8",
                    }}
                />
            </div>

            <Skeleton className="aspect-video md:w-96" />
        </div>
    );
}
