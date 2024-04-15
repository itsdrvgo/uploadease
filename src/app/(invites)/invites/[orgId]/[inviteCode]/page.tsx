import InviteValidatePage from "@/components/invites/invite-validate-page";
import { EmptyPlaceholder } from "@/components/ui/empty-placeholder";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

interface PageProps {
    params: {
        orgId: string;
        inviteCode: string;
    };
}

function Page({ params }: PageProps) {
    return (
        <section className="flex h-full min-h-screen items-center justify-center p-5">
            <Suspense fallback={<PendingPage />}>
                <InviteValidatePage params={params} />
            </Suspense>
        </section>
    );
}

export default Page;

function PendingPage() {
    return (
        <EmptyPlaceholder
            title="Validating invite"
            description="Please wait while we validate your invite..."
            icon="user"
            endContent={<Spinner />}
        />
    );
}
