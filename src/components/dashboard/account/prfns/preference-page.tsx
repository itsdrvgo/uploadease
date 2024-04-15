"use client";

import UserUpdateForm from "@/components/forms/user-update-form";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CachedUserData } from "@/lib/validation/cache/user";
import { GenericProps } from "@/types";

interface PageProps extends GenericProps {
    user: CachedUserData;
}

function PreferencePage({ className, user, ...props }: PageProps) {
    return (
        <div
            className={cn("w-full max-w-2xl space-y-5 p-5 py-10", className)}
            {...props}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                </CardHeader>

                <UserUpdateForm user={user} />
            </Card>
        </div>
    );
}

export default PreferencePage;
