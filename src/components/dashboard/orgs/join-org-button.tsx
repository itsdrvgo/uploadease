"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc/client";
import { handleClientError } from "@/lib/utils";
import { OrgJoinData, orgJoinSchema } from "@/lib/validation/organizations";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface PageProps {
    user: User;
}

function JoinOrgButton({ user }: PageProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const form = useForm<OrgJoinData>({
        resolver: zodResolver(orgJoinSchema),
        defaultValues: {
            id: "",
            passcode: "",
        },
    });

    const { mutate: joinOrg, isPending } =
        trpc.orgs.joinOrgByPasscode.useMutation({
            onMutate: () => {
                const toastId = toast.loading("Joining organization...");
                return { toastId };
            },
            onSuccess: ({ org }, __, ctx) => {
                toast.success("Welcome to " + org.name, {
                    id: ctx.toastId,
                });
                router.push("/dashboard/organizations/" + org.id);
                router.refresh();
            },
            onError: (err, _, ctx) => {
                handleClientError(err, ctx?.toastId);
            },
        });

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    Join Organization
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Join an Organization</DialogTitle>

                    <DialogDescription>
                        Join any organization by entering the organization ID
                        and passcode.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        className="space-y-5"
                        onSubmit={(...args) =>
                            form.handleSubmit((data) =>
                                joinOrg({
                                    orgId: data.id,
                                    passcode: data.passcode,
                                    userId: user.id,
                                })
                            )(...args)
                        }
                    >
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name="id"
                                render={({ field }) => (
                                    <FormItem className="grid grid-cols-4 items-center space-y-0">
                                        <FormLabel className="col-span-1">
                                            ID
                                        </FormLabel>
                                        <div className="col-span-3 space-y-1">
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    sizes="sm"
                                                    placeholder="Organization ID"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="passcode"
                                render={({ field }) => (
                                    <FormItem className="grid grid-cols-4 items-center">
                                        <FormLabel className="col-span-1">
                                            Passcode
                                        </FormLabel>
                                        <div className="col-span-3 space-y-1">
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    sizes="sm"
                                                    placeholder="Organization Passcode"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter>
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
                                isDisabled={
                                    isPending || !form.formState.isValid
                                }
                                isLoading={isPending}
                            >
                                Join Organization
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default JoinOrgButton;
