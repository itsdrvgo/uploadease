"use client";

import { trpc } from "@/lib/trpc/client";
import { handleClientError } from "@/lib/utils";
import { CachedOrgClientData } from "@/lib/validation/cache/organization";
import { CachedUserClientData } from "@/lib/validation/cache/user";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

interface PageProps {
    params: {
        orgId: string;
        inviteCode: string;
    };
    user: User;
    org: CachedOrgClientData;
    creator: Omit<CachedUserClientData, "email">;
}

function InviteAccept({ params, user, org, creator }: PageProps) {
    const { orgId, inviteCode } = params;
    const router = useRouter();

    const { mutate: joinOrg, isPending } =
        trpc.orgs.joinOrgByInviteCode.useMutation({
            onMutate: () => {
                const toastId = toast.loading("Joining organization...");
                return { toastId };
            },
            onSuccess: ({ org }, __, ctx) => {
                toast.success("Welcome to " + org.name, {
                    id: ctx.toastId,
                });
                router.push("/dashboard/organizations/" + orgId);
                router.refresh();
            },
            onError: (err, _, ctx) => {
                handleClientError(err, ctx?.toastId);
            },
        });

    return (
        <div className="flex max-w-xs flex-col items-center gap-5 rounded-xl bg-background p-10 text-center shadow-md">
            <div>
                <Avatar>
                    <AvatarImage
                        src={creator.avatar}
                        alt={creator.username}
                        className="size-32"
                    />
                    <AvatarFallback>{creator.username}</AvatarFallback>
                </Avatar>
            </div>

            <p className="text-balance text-center">
                <span className="font-semibold">@{creator.username}</span> has
                invited you to join{" "}
                <span className="font-semibold">{org.name}</span>.
            </p>

            <Button
                size="sm"
                className="font-semibold text-white shadow-md"
                isDisabled={isPending}
                isLoading={isPending}
                onClick={() =>
                    joinOrg({
                        inviteCode,
                        orgId,
                        userId: user.id,
                    })
                }
            >
                Accept
            </Button>
        </div>
    );
}

export default InviteAccept;
