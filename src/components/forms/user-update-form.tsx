"use client";

import { trpc } from "@/lib/trpc/client";
import { cn, handleClientError } from "@/lib/utils";
import { CachedUserData } from "@/lib/validation/cache/user";
import { UserUpdateData, userUpdateSchema } from "@/lib/validation/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { CardContent, CardFooter } from "../ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

interface PageProps {
    user: CachedUserData;
}

function UserUpdateForm({ user }: PageProps) {
    const router = useRouter();

    const form = useForm<UserUpdateData>({
        resolver: zodResolver(userUpdateSchema),
        defaultValues: {
            username: user.username,
            email: user.email,
        },
    });

    const { mutate: updateUsername, isPending } =
        trpc.users.updateUsername.useMutation({
            onMutate: () => {
                const toastId = toast.loading("Updating username...");
                return { toastId };
            },
            onSuccess: (data, __, ctx) => {
                toast.success("Username updated successfully", {
                    id: ctx.toastId,
                });
                router.refresh();
                form.resetField("username", {
                    defaultValue: data.user.username,
                });
            },
            onError: (err, _, ctx) => {
                handleClientError(err, ctx?.toastId);
            },
        });

    return (
        <Form {...form}>
            <form
                className={cn("transition-all ease-in-out")}
                onSubmit={(...args) =>
                    form.handleSubmit((data) =>
                        updateUsername({
                            username: data.username,
                            userId: user.id,
                        })
                    )(...args)
                }
            >
                <CardContent>
                    <div className="space-y-6 md:space-y-2">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem className="grid items-center gap-2 space-y-0 md:grid-cols-4">
                                    <FormLabel className="col-span-1">
                                        Username
                                    </FormLabel>
                                    <div className="col-span-3 space-y-1">
                                        <FormControl>
                                            <Input
                                                type="text"
                                                sizes="sm"
                                                placeholder="Username"
                                                isDisabled={isPending}
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
                            name="email"
                            render={({ field }) => (
                                <FormItem className="grid items-center gap-2 space-y-0 md:grid-cols-4">
                                    <FormLabel className="col-span-1">
                                        Email
                                    </FormLabel>
                                    <div className="col-span-3 space-y-1">
                                        <FormControl>
                                            <Input
                                                type="email"
                                                sizes="sm"
                                                placeholder="Email"
                                                isDisabled
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>
                </CardContent>

                <CardFooter
                    className={cn(
                        "justify-end gap-2",
                        !form.formState.isDirty && "p-0 opacity-0"
                    )}
                >
                    <Button
                        size="sm"
                        variant="ghost"
                        isDisabled={isPending}
                        className={cn(
                            !form.formState.isDirty && "pointer-events-none h-0"
                        )}
                        type="button"
                        onClick={() =>
                            form.reset({
                                username: user.username,
                                email: user.email,
                            })
                        }
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        size="sm"
                        variant="destructive"
                        isDisabled={isPending || !form.formState.isValid}
                        isLoading={isPending}
                        className={cn(
                            !form.formState.isDirty && "pointer-events-none h-0"
                        )}
                    >
                        Update
                    </Button>
                </CardFooter>
            </form>
        </Form>
    );
}

export default UserUpdateForm;
