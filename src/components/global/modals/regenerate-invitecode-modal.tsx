"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc/client";
import { generateInviteLink, handleClientError } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

interface PageProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    userId: string;
    orgId: string;
}

function RegenerateInviteCodeModal({
    isOpen,
    setIsOpen,
    userId,
    orgId,
}: PageProps) {
    const router = useRouter();

    const { mutate: regenerateCode, isPending } =
        trpc.orgs.regenerateInviteCode.useMutation({
            onMutate: () => {
                const toastId = toast.loading("Regenerating invite code...");
                return { toastId };
            },
            onSuccess: (res, __, ctx) => {
                navigator.clipboard.writeText(
                    generateInviteLink(res.org.inviteCode, res.org.id)
                );

                toast.success(
                    "Invite code regenerated, and copied to clipboard",
                    {
                        id: ctx.toastId,
                    }
                );

                setIsOpen(false);
                router.refresh();
            },
            onError: (err, _, ctx) => {
                handleClientError(err, ctx?.toastId);
            },
        });

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    isDisabled={isOpen}
                    className="w-full md:w-fit"
                >
                    Regenerate Code
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Regenerate Invite Code</DialogTitle>
                </DialogHeader>

                <div className="space-y-2">
                    <p>
                        This will invalidate the old invite code. Are you sure
                        you want to regenerate the invite code?
                    </p>
                    <p className="text-muted-foreground/80">
                        The new invite code will be copied to your clipboard.
                    </p>
                </div>

                <DialogFooter className="justify-end gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        isDisabled={isPending}
                        onClick={() => setIsOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        variant="destructive"
                        isDisabled={isPending}
                        isLoading={isPending}
                        onClick={() => regenerateCode({ userId, orgId })}
                    >
                        Regenerate Invite Code
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default RegenerateInviteCodeModal;
