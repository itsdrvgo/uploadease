"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc/client";
import { handleClientError } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../ui/dialog";

interface PageProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    userId: string;
    orgId: string;
}

function DeleteOrgModal({ isOpen, setIsOpen, userId, orgId }: PageProps) {
    const router = useRouter();
    const [statement, setStatement] = useState("");

    const { mutate: deleteOrg, isPending } = trpc.orgs.deleteOrg.useMutation({
        onMutate: () => {
            const toastId = toast.loading("Deleting organization...");
            return { toastId };
        },
        onSuccess: (_, __, ctx) => {
            toast.success("Organization deleted", {
                id: ctx.toastId,
            });

            setIsOpen(false);
            router.push("/dashboard");
        },
        onError: (err, _, ctx) => {
            handleClientError(err, ctx?.toastId);
        },
    });

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="destructive" isDisabled={isOpen}>
                    Delete Organization
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Organization</DialogTitle>
                </DialogHeader>

                <div className="space-y-8">
                    <div className="space-y-3">
                        <p>
                            You&apos;re about to delete this organization. This
                            action is irreversible.
                        </p>
                        <ul className="list-disc text-muted-foreground/80">
                            <li className="ml-5">
                                All existing members will be removed.
                            </li>
                            <li className="ml-5">
                                All existing projects will be removed.
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <span className="text-sm">
                            Type{" "}
                            <span className="rounded-md bg-foreground-strict/10 px-1 py-[2px] text-destructive-strict dark:bg-accent">
                                DELETE
                            </span>{" "}
                            in the field below to confirm.
                        </span>

                        <Input
                            type="text"
                            sizes="sm"
                            placeholder="DELETE"
                            value={statement}
                            onValueChange={setStatement}
                        />
                    </div>
                </div>

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
                        isDisabled={isPending || statement !== "DELETE"}
                        isLoading={isPending}
                        onClick={() => deleteOrg({ userId, orgId, statement })}
                    >
                        Delete Organization
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default DeleteOrgModal;
