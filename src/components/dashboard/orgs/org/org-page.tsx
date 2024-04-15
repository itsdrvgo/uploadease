"use client";

import CopyInvite from "@/components/global/buttons/copy-invite-button";
import InviteManageModal from "@/components/global/modals/invite-manage-modal";
import { Icons } from "@/components/icons/icons";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Link } from "@/components/ui/link";
import { cn } from "@/lib/utils";
import { GenericProps, OrgData } from "@/types";
import { User } from "@supabase/supabase-js";
import { useState } from "react";

interface PageProps extends GenericProps {
    data: OrgData;
    user: User;
}

function OrgPage({ className, data, user, ...props }: PageProps) {
    const [isInvitePaused, setIsInvitePause] = useState(
        data.org.features.isInvitePaused
    );
    const [isInviteManageModalOpen, setIsInviteManageModalOpen] =
        useState(false);

    return (
        <>
            <div
                className={cn(
                    "w-full max-w-5xl space-y-10 p-5 py-10",
                    className
                )}
                {...props}
            >
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-lg font-semibold md:text-xl">
                        {data.org.name}
                    </h2>

                    <Chip scheme="primary" variant="dot" size="sm">
                        Active
                    </Chip>
                </div>

                <Card className="border-none">
                    <CardHeader className="flex-row items-center justify-between">
                        <h3 className="text-sm font-medium text-foreground/60">
                            Invite Members
                        </h3>

                        <InviteManageModal
                            isOpen={isInviteManageModalOpen}
                            setIsOpen={setIsInviteManageModalOpen}
                            userId={user.id}
                            orgId={data.org.id}
                            isInvitePaused={isInvitePaused}
                            setIsInvitePaused={setIsInvitePause}
                            data={data}
                        />
                    </CardHeader>

                    <CardContent>
                        <CopyInvite data={data} />
                    </CardContent>
                </Card>

                <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Quick Actions</h3>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {generateQuickActions(data.org.id).map((action) => {
                            const Icon = Icons[action.icon];

                            return (
                                <Link
                                    type="link"
                                    key={action.name}
                                    href={action.href}
                                    className="flex items-center gap-2 rounded-lg bg-white p-3 shadow-md dark:bg-accent dark:text-foreground"
                                >
                                    <Icon
                                        name={action.icon}
                                        className="size-5"
                                    />
                                    <p className="text-sm font-medium">
                                        {action.name}
                                    </p>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}

export default OrgPage;

interface Action {
    name: string;
    href: string;
    icon: keyof typeof Icons;
}

function generateQuickActions(orgId: string): Action[] {
    return [
        {
            name: "Upload a Video",
            href: "/dashboard/organizations/" + orgId + "/videos/upload",
            icon: "upload",
        },
        {
            name: "Update Template",
            href:
                "/dashboard/organizations/" + orgId + "/settings?tab=templates",
            icon: "layoutTemplate",
        },
        {
            name: "View Members",
            href: "/dashboard/organizations/" + orgId + "/team",
            icon: "users",
        },
        {
            name: "View Analytics",
            href: "/dashboard/organizations/" + orgId + "/analytics",
            icon: "analytics",
        },
        {
            name: "Manage Passcode",
            href:
                "/dashboard/organizations/" + orgId + "/settings?tab=passcode",
            icon: "settings",
        },
    ];
}
