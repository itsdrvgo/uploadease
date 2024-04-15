"use client";

import { trpc } from "@/lib/trpc/client";
import { handleClientError } from "@/lib/utils";
import { OrgData } from "@/types";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { toast } from "sonner";
import { Button } from "../../ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../ui/dialog";
import { Switch } from "../../ui/switch";

interface PageProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    userId: string;
    orgId: string;
    isInvitePaused: boolean;
    setIsInvitePaused: Dispatch<SetStateAction<boolean>>;
    data: OrgData;
    trigger?: ReactNode;
}

function InviteManageModal({
    isOpen,
    setIsOpen,
    userId,
    orgId,
    data,
    isInvitePaused,
    setIsInvitePaused,
    trigger = (
        <div>
            <Switch
                isDisabled={data.type === "others" || isOpen}
                checked={!isInvitePaused}
            />
        </div>
    ),
}: PageProps) {
    const router = useRouter();

    const { mutate: manageInviteState, isPending } =
        trpc.orgs.manageInviteState.useMutation({
            onMutate: () => {
                const toastId = toast.loading("Updating invite state...");
                return { toastId };
            },
            onSuccess: (_, __, ctx) => {
                toast.success(
                    isInvitePaused
                        ? "Invite link is now active, anyone can join"
                        : "Invite link is now paused, new members can't join",
                    {
                        id: ctx.toastId,
                    }
                );
                setIsInvitePaused(!isInvitePaused);
                setIsOpen(false);
                router.refresh();
            },
            onError: (err, _, ctx) => {
                handleClientError(err, ctx?.toastId);
            },
        });

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {isInvitePaused ? "Resume" : "Pause"} Invite Link
                    </DialogTitle>
                </DialogHeader>

                <p>
                    This will {isInvitePaused ? "resume" : "pause"} the invite
                    link for this organization. Are you sure you want to
                    continue?
                </p>

                <DialogFooter className="justify-end gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        isDisabled={isPending}
                        type="button"
                        onClick={() => setIsOpen(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        size="sm"
                        variant="destructive"
                        isDisabled={isPending}
                        isLoading={isPending}
                        onClick={() =>
                            manageInviteState({
                                orgId,
                                userId,
                                inviteState: !isInvitePaused,
                            })
                        }
                    >
                        {isInvitePaused ? "Resume" : "Pause"} Invites
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default InviteManageModal;
