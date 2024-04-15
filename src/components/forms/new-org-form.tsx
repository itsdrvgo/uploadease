"use client";

import { trpc } from "@/lib/trpc/client";
import { handleClientError } from "@/lib/utils";
import { OrgCreateData, orgCreateSchema } from "@/lib/validation/organizations";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@supabase/supabase-js";
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
import { Separator } from "../ui/separator";

interface OrgFormProps {
    user: User;
}

function NewOrgForm({ user }: OrgFormProps) {
    const router = useRouter();

    const form = useForm<OrgCreateData>({
        resolver: zodResolver(orgCreateSchema),
        defaultValues: {
            name: "",
            passcode: "",
        },
    });

    const { mutate: createOrg, isPending: isOrgCreating } =
        trpc.orgs.createOrg.useMutation({
            onMutate: () => {
                const toastId = toast.loading("Creating organization...");
                return { toastId };
            },
            onSuccess: ({ orgId }, __, ctx) => {
                toast.success("Organization created successfully", {
                    id: ctx.toastId,
                });
                router.push("/dashboard/organizations/" + orgId);
            },
            onError: (err, _, ctx) => {
                handleClientError(err, ctx?.toastId);
            },
        });

    return (
        <Form {...form}>
            <form
                onSubmit={(...args) =>
                    form.handleSubmit((data) =>
                        createOrg({
                            ...data,
                            creatorId: user.id,
                        })
                    )(...args)
                }
            >
                <CardContent className="space-y-5">
                    <Separator />

                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-4 items-center space-y-0">
                                    <FormLabel className="col-span-1">
                                        Name
                                    </FormLabel>
                                    <div className="col-span-3 space-y-1">
                                        <FormControl>
                                            <Input
                                                type="text"
                                                sizes="sm"
                                                placeholder="Organization Name"
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
                </CardContent>

                <CardFooter className="justify-end gap-2">
                    <Button
                        size="sm"
                        type="button"
                        variant="outline"
                        isDisabled={isOrgCreating}
                        onClick={() => router.push("/dashboard")}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        size="sm"
                        variant="destructive"
                        isDisabled={isOrgCreating || !form.formState.isValid}
                        isLoading={isOrgCreating}
                    >
                        Create Organization
                    </Button>
                </CardFooter>
            </form>
        </Form>
    );
}

export default NewOrgForm;
