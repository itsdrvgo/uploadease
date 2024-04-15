"use client";

import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { OrgMembershipWithOrgAndCreatorClientData } from "@/lib/validation/organizations";
import { GenericProps } from "@/types";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icons } from "../../icons/icons";
import JoinOrgButton from "./join-org-button";

interface PageProps extends GenericProps {
    user: User;
    memberships: OrgMembershipWithOrgAndCreatorClientData[];
}

function OrgViewPage({ className, memberships, user, ...props }: PageProps) {
    const router = useRouter();
    const createOrgBtnRef = useRef<HTMLButtonElement>(null);
    const [search, setSearch] = useState<string>("");
    const [filteredMemberships, setFilteredMemberships] = useState<
        OrgMembershipWithOrgAndCreatorClientData[]
    >([]);

    const membershipsForCreators = memberships.filter(
        (membership) => membership.role === "creator"
    );
    const membershipsForOthers = memberships.filter(
        (membership) => membership.role !== "creator"
    );

    useEffect(() => {
        setFilteredMemberships(
            memberships.filter((membership) =>
                membership.organization.name.toLowerCase().includes(search)
            )
        );
    }, [search, memberships]);

    return (
        <div
            className={cn("w-full max-w-5xl space-y-5 p-5 py-10", className)}
            {...props}
        >
            <div className="flex flex-col-reverse gap-2 md:flex-row md:items-center">
                <div className="flex items-center gap-2">
                    <JoinOrgButton user={user} />

                    <Button
                        size="sm"
                        color="primary"
                        ref={createOrgBtnRef}
                        onClick={() => router.push("/dashboard/new")}
                    >
                        New Organization
                    </Button>
                </div>

                <Input
                    placeholder="Search for an organization"
                    sizes="sm"
                    type="search"
                    startContent={
                        <Icons.search className="size-3 text-muted-foreground" />
                    }
                    value={search}
                    onValueChange={setSearch}
                    classNames={{
                        container: "md:w-52 h-8",
                    }}
                />
            </div>

            {!!search.length ? (
                filteredMemberships.length === 0 ? (
                    <NotFoundOrgCard />
                ) : (
                    <div className="flex flex-wrap gap-5">
                        {filteredMemberships.map((membership) => (
                            <OrgCard
                                key={membership.organization.id}
                                membership={membership}
                            />
                        ))}
                    </div>
                )
            ) : memberships.length === 0 ? (
                <NoOrgCard onClick={() => createOrgBtnRef.current?.click()} />
            ) : (
                <div className="space-y-10">
                    {membershipsForCreators.length > 0 && (
                        <div className="space-y-5">
                            <h2 className="text-sm font-semibold text-muted-foreground">
                                Your Organizations
                            </h2>

                            <div className="flex flex-wrap gap-5">
                                {membershipsForCreators.map((membership) => (
                                    <OrgCard
                                        key={membership.organization.id}
                                        membership={membership}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {membershipsForOthers.length > 0 && (
                        <div className="space-y-5">
                            <h2 className="text-sm font-semibold text-muted-foreground">
                                Organizations You&apos;re Part Of
                            </h2>

                            <div className="flex flex-wrap gap-5">
                                {membershipsForOthers.map((membership) => (
                                    <OrgCard
                                        key={membership.organization.id}
                                        membership={membership}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default OrgViewPage;

function NotFoundOrgCard({ className, ...props }: GenericProps) {
    return (
        <div
            className={cn(
                "flex aspect-video cursor-pointer flex-col items-center justify-center gap-3 rounded-md bg-card p-5 text-center text-muted-foreground shadow-sm md:w-96",
                className
            )}
            {...props}
        >
            <Icons.search className="size-6" />
            <p className="text-xl">No organizations found</p>
        </div>
    );
}

function NoOrgCard({ className, ...props }: GenericProps) {
    return (
        <div
            className={cn(
                "flex aspect-video cursor-pointer flex-col items-center justify-center gap-3 rounded-md bg-card p-5 text-center text-muted-foreground shadow-sm md:w-96",
                className
            )}
            {...props}
        >
            <Icons.add className="size-6" />
            <p className="text-xl">Create an Organization</p>
        </div>
    );
}

interface OrgCardProps extends GenericProps {
    membership: OrgMembershipWithOrgAndCreatorClientData;
}

function OrgCard({ className, membership, ...props }: OrgCardProps) {
    return (
        <Link
            className="w-full md:w-auto"
            href={"/dashboard/organizations/" + membership.organization.id}
        >
            <div
                className={cn(
                    "flex aspect-video cursor-pointer flex-col justify-between gap-3 rounded-md bg-card p-5 text-muted-foreground shadow-sm md:w-96",
                    className
                )}
                {...props}
            >
                <div className="space-y-1 md:space-y-2">
                    <h3 className="font-semibold text-foreground md:text-lg">
                        {membership.organization.name}
                    </h3>

                    <p className="text-xs text-muted-foreground/80 md:text-sm">
                        @{membership.organization.creator.username}
                    </p>
                </div>

                <Chip
                    variant="dot"
                    scheme={
                        membership.role === "creator" ? "success" : "primary"
                    }
                    classNames={{
                        container: "capitalize",
                    }}
                >
                    {membership.role}
                </Chip>
            </div>
        </Link>
    );
}
