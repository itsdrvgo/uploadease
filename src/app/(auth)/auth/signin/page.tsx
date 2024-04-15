"use client";

import LoginButton from "@/components/global/buttons/login-button";
import { EmptyPlaceholder } from "@/components/ui/empty-placeholder";

function Page() {
    return (
        <section className="flex h-full min-h-screen items-center justify-center p-5">
            <EmptyPlaceholder
                icon="lock"
                fullWidth={false}
                title="Unauthorized"
                description="You need to sign in to access this page. Click the button below to sign in."
                endContent={<LoginButton className="text-background-strict" />}
            />
        </section>
    );
}

export default Page;
