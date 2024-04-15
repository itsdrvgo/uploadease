import AccountFetch from "@/components/dashboard/account/prfns/account-fetch-page";
import Skeleton from "@/components/ui/skeleton";
import { Suspense } from "react";

function Page() {
    return (
        <section className="flex h-full justify-center">
            <Suspense fallback={<PreferenceSkeleton />}>
                <AccountFetch />
            </Suspense>
        </section>
    );
}

export default Page;

function PreferenceSkeleton() {
    return (
        <div className="w-full max-w-2xl space-y-5 p-5 py-10">
            {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-52 w-full rounded-xl" />
            ))}
        </div>
    );
}
