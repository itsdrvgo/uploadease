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
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc/client";
import { handleClientError } from "@/lib/utils";
import {
    ResetOrgPasscodeData,
    resetOrgPasscodeSchema,
} from "@/lib/validation/organizations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "../../ui/form";

interface PageProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    userId: string;
    orgId: string;
}

function ResetPasscodeModal({ isOpen, setIsOpen, userId, orgId }: PageProps) {
    const router = useRouter();

    const form = useForm<ResetOrgPasscodeData>({
        resolver: zodResolver(resetOrgPasscodeSchema),
        defaultValues: {
            passcode: "",
            confirmPasscode: "",
        },
    });

    const { mutate: resetPasscode, isPending } =
        trpc.orgs.resetPasscode.useMutation({
            onMutate: () => {
                const toastId = toast.loading("Resetting passcode...");
                return { toastId };
            },
            onSuccess: (_, __, ctx) => {
                toast.success("Passcode reset successfully", {
                    id: ctx.toastId,
                });
                router.refresh();
            },
            onError: (err, _, ctx) => {
                handleClientError(err, ctx?.toastId);
            },
        });

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="sm" isDisabled={isOpen}>
                    Reset Passcode
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reset Passcode</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        className="space-y-5"
                        onSubmit={(...args) =>
                            form.handleSubmit((data) =>
                                resetPasscode({
                                    orgId,
                                    userId,
                                    passcode: data.passcode,
                                    confirmPasscode: data.confirmPasscode,
                                })
                            )(...args)
                        }
                    >
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name="passcode"
                                render={({ field }) => (
                                    <FormItem className="grid grid-cols-4 items-center gap-5 space-y-0">
                                        <FormLabel className="col-span-1">
                                            Passcode
                                        </FormLabel>
                                        <FormControl className="col-span-3">
                                            <Input
                                                type="text"
                                                sizes="sm"
                                                placeholder="New Passcode"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmPasscode"
                                render={({ field }) => (
                                    <FormItem className="grid grid-cols-4 items-center gap-5 space-y-0">
                                        <FormLabel className="col-span-1">
                                            Confirm Passcode
                                        </FormLabel>
                                        <FormControl className="col-span-3">
                                            <Input
                                                type="text"
                                                sizes="sm"
                                                placeholder="Confirm New Passcode"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className="justify-end gap-2">
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                isDisabled={isPending}
                                onClick={() => setIsOpen(false)}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                size="sm"
                                variant="destructive"
                                isDisabled={
                                    isPending || !form.formState.isValid
                                }
                                isLoading={isPending}
                            >
                                Reset Passcode
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default ResetPasscodeModal;
