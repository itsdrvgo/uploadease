"use client";

import { Icons } from "@/components/icons/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/components/ui/link";
import Skeleton from "@/components/ui/skeleton";
import { SIGNIN_PAGE } from "@/config/const";
import { siteConfig } from "@/config/site";
import { useSupabase } from "@/hooks/useSupabase";
import { useSidebarStore } from "@/lib/store/sidebar";
import { useUserDropdownStore } from "@/lib/store/user-dropdown";
import { trpc } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { CachedUserClientData } from "@/lib/validation/cache/user";
import { GenericProps } from "@/types";
import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { redirect, usePathname } from "next/navigation";
import UploadEase from "../../svgs/UploadEase";
import LogoutButton from "../buttons/logout-button";
import ThemeSwitch from "../buttons/theme-switch";

interface List {
    category: string;
    items: {
        name: string;
        href: string;
        icon: keyof typeof Icons;
    }[];
}

const lists: List[] = [
    {
        category: "Organizations",
        items: [
            {
                name: "All Organizations",
                href: "/dashboard/organizations",
                icon: "building",
            },
        ],
    },
    {
        category: "Account",
        items: [
            {
                name: "Preferences",
                href: "/dashboard/account/preferences",
                icon: "settings",
            },
            {
                name: "Audit Logs",
                href: "/dashboard/account/logs",
                icon: "clipboardList",
            },
            {
                name: "Billing",
                href: "/dashboard/account/billing",
                icon: "dollar",
            },
            {
                name: "Security",
                href: "/dashboard/account/security",
                icon: "lock",
            },
        ],
    },
];

interface PageProps extends GenericProps {
    params?: {
        orgId?: string;
    };
}

function Sidebar({ className, params, ...props }: PageProps) {
    const pathname = usePathname();
    const currentPath = pathname.split("/").pop();

    const isSidebarOpen = useSidebarStore((state) => state.isOpen);
    const setIsSidebarOpen = useSidebarStore((state) => state.setIsOpen);
    const isUserDropdownOpen = useUserDropdownStore((state) => state.isOpen);

    const { getUser } = useSupabase();

    const { data: user, isPending } = useQuery({
        queryKey: ["user"],
        queryFn: getUser,
    });

    const dynamicLists = params?.orgId
        ? generateDynamicSidebarMenu(params.orgId)
        : lists;

    return (
        <div
            className={cn(
                "fixed left-0",
                "flex h-screen w-14 flex-col md:w-[4.5rem]",
                "z-10"
            )}
        >
            <aside
                data-state={isSidebarOpen ? "expanded" : "collapsed"}
                className={cn(
                    "border-r border-border-strict/10",
                    "bg-primary dark:bg-background",
                    "h-full w-14 data-[state=expanded]:w-64 md:w-[4.5rem]",
                    "transition-width flex flex-col duration-200 ease-in-out",
                    "selection:bg-white selection:text-foreground-strict",
                    className
                )}
                onMouseEnter={() => setIsSidebarOpen(true)}
                onMouseLeave={() =>
                    !isUserDropdownOpen && setIsSidebarOpen(false)
                }
                {...props}
            >
                <div className="flex items-center p-2 px-4 md:px-6">
                    <Link
                        type="link"
                        href="/dashboard"
                        className="flex items-center gap-2 text-lg font-semibold"
                    >
                        <UploadEase width={25} height={25} />
                        <span
                            className={cn(
                                "whitespace-nowrap text-white transition-opacity ease-in-out",
                                !isSidebarOpen &&
                                    "pointer-events-none opacity-0"
                            )}
                        >
                            {siteConfig.name}
                        </span>
                    </Link>
                </div>

                <div className="flex flex-1 flex-col divide-y divide-border-strict/10">
                    {dynamicLists.map((list) => (
                        <ul
                            key={list.category}
                            className="flex flex-col gap-1 p-1 md:p-2"
                        >
                            {list.items.map((item) => {
                                const Icon = Icons[item.icon];

                                return (
                                    <li key={item.name}>
                                        <Link
                                            type="link"
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-2 rounded-md p-3 py-4 md:p-4",
                                                "transition-all ease-in-out",
                                                "text-sm text-muted-foreground-strict hover:text-white",
                                                "hover:bg-accent",
                                                {
                                                    "bg-accent text-white":
                                                        (currentPath ===
                                                            params?.orgId &&
                                                            item.name ===
                                                                "Home") ||
                                                        (item.name
                                                            .split(" ")
                                                            .join("")
                                                            .toLowerCase() ===
                                                            "allorganizations" &&
                                                            currentPath ===
                                                                "organizations") ||
                                                        currentPath ===
                                                            item.name.toLowerCase(),
                                                }
                                            )}
                                        >
                                            <div>
                                                <Icon className="size-5" />
                                            </div>
                                            <span
                                                className={cn(
                                                    "whitespace-nowrap transition-opacity ease-in-out",
                                                    !isSidebarOpen &&
                                                        "pointer-events-none opacity-0"
                                                )}
                                            >
                                                {item.name}
                                            </span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    ))}
                </div>

                {isPending ? (
                    <SidebarUserSkeleton isSidebarOpen={isSidebarOpen} />
                ) : user ? (
                    params?.orgId ? (
                        <SidebarDynamicUser
                            user={user}
                            orgId={params.orgId}
                            isSidebarOpen={isSidebarOpen}
                        />
                    ) : (
                        <SidebarUser
                            user={user}
                            isSidebarOpen={isSidebarOpen}
                        />
                    )
                ) : (
                    <SidebarUserSkeleton isSidebarOpen={isSidebarOpen} />
                )}
            </aside>
        </div>
    );
}

export default Sidebar;

interface SidebarUserProps {
    user: User;
    orgId: string;
    isSidebarOpen: boolean;
}

function SidebarDynamicUser({ user, orgId, isSidebarOpen }: SidebarUserProps) {
    const { data, isPending } = trpc.memberships.getMembership.useQuery({
        userId: user.id,
        orgId,
    });

    if (isPending) return <SidebarUserSkeleton isSidebarOpen={isSidebarOpen} />;
    if (!data) redirect(SIGNIN_PAGE);

    return (
        <UserItem
            user={data.membership.user}
            isSidebarOpen={isSidebarOpen}
            role={data.membership.role}
        />
    );
}

function SidebarUser({ user, isSidebarOpen }: Omit<SidebarUserProps, "orgId">) {
    const { data, isPending } = trpc.users.getUser.useQuery(user.id);

    if (isPending) return <SidebarUserSkeleton isSidebarOpen={isSidebarOpen} />;
    if (!data) redirect(SIGNIN_PAGE);

    return <UserItem user={data.user} isSidebarOpen={isSidebarOpen} />;
}

function UserItem({
    user,
    isSidebarOpen,
    role,
}: {
    user: Omit<CachedUserClientData, "email">;
    isSidebarOpen: boolean;
    role?: string;
}) {
    const isUserDropdownOpen = useUserDropdownStore((state) => state.isOpen);
    const setIsUserDropdownOpen = useUserDropdownStore(
        (state) => state.setIsOpen
    );

    return (
        <div className="p-1 py-2 md:p-2">
            <DropdownMenu
                open={isUserDropdownOpen}
                onOpenChange={setIsUserDropdownOpen}
            >
                <DropdownMenuTrigger className="w-full">
                    <div
                        className={cn(
                            "flex items-center gap-2 rounded-md p-2 py-3 md:p-3",
                            "transition-all ease-in-out",
                            "text-sm text-white",
                            "hover:bg-accent"
                        )}
                    >
                        <div>
                            <Avatar>
                                <AvatarImage
                                    src={user.avatar}
                                    alt={user.username}
                                />
                                <AvatarFallback>
                                    {user.username[0].toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        <div
                            className={cn(
                                "text-start transition-all ease-in-out",
                                !isSidebarOpen &&
                                    "pointer-events-none opacity-0"
                            )}
                        >
                            <p>@{user.username}</p>
                            {role && (
                                <p className="text-xs capitalize text-muted-foreground-strict">
                                    {role}
                                </p>
                            )}
                        </div>
                    </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                    {lists[1].items.map((item) => {
                        const Icon = Icons[item.icon];

                        return (
                            <DropdownMenuItem key={item.name} className="p-0">
                                <Link
                                    type="link"
                                    href={item.href}
                                    className={cn(
                                        "flex w-full items-center gap-2 p-2 py-1 text-sm text-muted-foreground hover:text-white",
                                        "transition-all ease-in-out"
                                    )}
                                >
                                    <div>
                                        <Icon className="size-4" />
                                    </div>

                                    <span>{item.name}</span>
                                </Link>
                            </DropdownMenuItem>
                        );
                    })}

                    <DropdownMenuSeparator />

                    <DropdownMenuItem className="p-0">
                        <ThemeSwitch />
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem className="p-0 focus:bg-destructive">
                        <LogoutButton className="w-full text-start" />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

function SidebarUserSkeleton({ isSidebarOpen }: { isSidebarOpen: boolean }) {
    return (
        <div className="p-1 py-2 md:p-2">
            <div className="flex items-center gap-2 rounded-md p-2 py-3 md:p-3">
                <div>
                    <Skeleton className="size-8 rounded-full" />
                </div>

                <div
                    className={cn(
                        "space-y-1 transition-all ease-in-out",
                        !isSidebarOpen && "pointer-events-none opacity-0"
                    )}
                >
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                </div>
            </div>
        </div>
    );
}

function generateDynamicSidebarMenu(orgId: string): List[] {
    return [
        {
            category: "Home",
            items: [
                {
                    name: "Home",
                    href: generateDynamicRouteForItem(orgId, ""),
                    icon: "home",
                },
            ],
        },
        {
            category: "Organization",
            items: [
                {
                    name: "Videos",
                    href: generateDynamicRouteForItem(orgId, "videos"),
                    icon: "video",
                },
                {
                    name: "Schedules",
                    href: generateDynamicRouteForItem(orgId, "schedules"),
                    icon: "calendar",
                },
                {
                    name: "Team",
                    href: generateDynamicRouteForItem(orgId, "team"),
                    icon: "users",
                },
                {
                    name: "Notifications",
                    href: generateDynamicRouteForItem(orgId, "notifications"),
                    icon: "bell",
                },
            ],
        },
        {
            category: "Info",
            items: [
                {
                    name: "Settings",
                    href: generateDynamicRouteForItem(orgId, "settings"),
                    icon: "settings",
                },

                {
                    name: "Logs",
                    href: generateDynamicRouteForItem(orgId, "logs"),
                    icon: "clipboardList",
                },
            ],
        },
    ];
}

function generateDynamicRouteForItem(orgId: string, href: string) {
    return "/dashboard/organizations/" + orgId + "/" + href;
}
