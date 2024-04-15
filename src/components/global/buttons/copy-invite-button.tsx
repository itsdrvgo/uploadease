"use client";

import { Icons } from "@/components/icons/icons";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, generateInviteLink } from "@/lib/utils";
import { GenericProps, OrgData } from "@/types";
import { useState } from "react";
import { toast } from "sonner";

interface PageProps extends GenericProps {
    data: OrgData;
}

function CopyInvite({ className, data, ...props }: PageProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <div
            className={cn(
                "flex items-center justify-between gap-2 rounded-md bg-background p-3 py-2",
                className
            )}
            {...props}
        >
            <p className="max-w-40 cursor-not-allowed select-none appearance-none overflow-hidden truncate text-sm text-foreground md:max-w-full">
                {generateInviteLink(
                    data.type === "creator"
                        ? data.org.inviteCode
                        : "**********",
                    data.org.id
                )}
            </p>

            <DropdownMenu
                open={isDropdownOpen}
                onOpenChange={setIsDropdownOpen}
            >
                <div>
                    <DropdownMenuTrigger asChild>
                        <Button
                            size="icon"
                            isDisabled={data.type === "others"}
                            className="text-white"
                        >
                            <Icons.copy className="size-3" />
                        </Button>
                    </DropdownMenuTrigger>
                </div>

                <DropdownMenuContent aria-label="Invite Options">
                    <DropdownMenuItem
                        disabled={data.type === "others"}
                        onSelect={() => {
                            if (data.type === "creator") {
                                navigator.clipboard.writeText(data.org.id);
                                toast.success(
                                    "Copied organization ID to clipboard"
                                );
                            }
                        }}
                    >
                        Copy Organization ID
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        disabled={data.type === "others"}
                        onSelect={() => {
                            if (data.type === "creator") {
                                navigator.clipboard.writeText(
                                    data.org.inviteCode
                                );
                                toast.success(
                                    "Copied invite code to clipboard"
                                );
                            }
                        }}
                    >
                        Copy Invite Code
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        disabled={data.type === "others"}
                        onSelect={() => {
                            if (data.type === "creator") {
                                navigator.clipboard.writeText(
                                    generateInviteLink(
                                        data.type === "creator"
                                            ? data.org.inviteCode
                                            : "**********",
                                        data.org.id
                                    )
                                );
                                toast.success(
                                    "Copied invite link to clipboard"
                                );
                            }
                        }}
                    >
                        Copy Invite Link
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

export default CopyInvite;
