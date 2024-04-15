import NewOrgUserFetch from "@/components/dashboard/new/new-org-fetch";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Loader from "@/components/ui/loader";
import { Suspense } from "react";

function Page() {
    return (
        <section className="flex flex-1 justify-center p-5 py-10">
            <div className="max-w-xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Create an Organization</CardTitle>
                        <CardDescription>
                            Your organization will be the primary account for
                            your YouTube team, and you can invite others to
                            join.
                        </CardDescription>
                    </CardHeader>

                    <Suspense fallback={<Loader />}>
                        <NewOrgUserFetch />
                    </Suspense>
                </Card>
            </div>
        </section>
    );
}

export default Page;
