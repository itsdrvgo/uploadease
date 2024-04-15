"use client";

import CopyInvite from "@/components/global/buttons/copy-invite-button";
import DeleteOrgModal from "@/components/global/modals/delete-org-modal";
import InviteManageModal from "@/components/global/modals/invite-manage-modal";
import ManageUploadDefaultsModal from "@/components/global/modals/manage-upload-defaults-modal";
import RegenerateInviteCodeModal from "@/components/global/modals/regenerate-invitecode-modal";
import ResetPasscodeModal from "@/components/global/modals/reset-passcode-modal";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input, inputVariants } from "@/components/ui/input";
import { trpc } from "@/lib/trpc/client";
import { cn, handleClientError } from "@/lib/utils";
import { OrgCreateData, orgCreateSchema } from "@/lib/validation/organizations";
import { GenericProps, OrgWithTemplateData } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface PageProps extends GenericProps {
    data: OrgWithTemplateData;
    user: User;
}

function SettingsPage({ className, data, user, ...props }: PageProps) {
    const router = useRouter();
    const [isInvitePaused, setIsInvitePaused] = useState(
        data.org.features.isInvitePaused
    );

    const [isInviteManageModalOpen, setIsInviteManageModalOpen] =
        useState(false);
    const [isDeleteOrgModalOpen, setIsDeleteOrgModalOpen] = useState(false);
    const [isResetPasscodeModalOpen, setIsResetPasscodeModalOpen] =
        useState(false);
    const [isRegenerateCodeModalOpen, setIsRegenerateCodeModalOpen] =
        useState(false);
    const [isUploadDefaultsModalOpen, setIsUploadDefaultsModalOpen] =
        useState(false);

    const form = useForm<Omit<OrgCreateData, "passcode">>({
        resolver: zodResolver(
            orgCreateSchema.omit({
                passcode: true,
            })
        ),
        defaultValues: {
            name: data.org.name,
        },
    });

    const { mutate: updateName, isPending: isNameUpdating } =
        trpc.orgs.updateName.useMutation({
            onMutate: () => {
                const toastId = toast.loading("Updating organization name...");
                return { toastId };
            },
            onSuccess: (res, __, ctx) => {
                toast.success("Organization name updated successfully", {
                    id: ctx.toastId,
                });
                router.refresh();
                form.resetField("name", {
                    defaultValue: res.org.name,
                });
            },
            onError: (err, _, ctx) => {
                handleClientError(err, ctx?.toastId);
            },
        });

    return (
        <>
            <div
                className={cn(
                    "w-full max-w-2xl space-y-5 p-5 py-10",
                    className
                )}
                {...props}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>General</CardTitle>
                    </CardHeader>

                    <Form {...form}>
                        <form
                            className={cn("transition-all ease-in-out")}
                            onSubmit={(...args) =>
                                form.handleSubmit((data) =>
                                    updateName({
                                        name: data.name,
                                        orgId: data.name,
                                        userId: user.id,
                                    })
                                )(...args)
                            }
                        >
                            <CardContent>
                                <div className="space-y-6 md:space-y-2">
                                    <div className="grid items-center gap-2 space-y-0 md:grid-cols-4">
                                        <h4 className="col-span-1 text-sm font-semibold leading-none">
                                            ID
                                        </h4>

                                        <button
                                            className={cn(
                                                inputVariants({
                                                    sizes: "sm",
                                                }),
                                                "col-span-3 cursor-pointer items-center opacity-50"
                                            )}
                                            type="button"
                                            onClick={() => {
                                                navigator.clipboard.writeText(
                                                    data.org.id
                                                );

                                                toast.success(
                                                    "Copied organization ID to clipboard"
                                                );
                                            }}
                                        >
                                            <p className="max-w-40 select-none appearance-none overflow-hidden truncate text-sm text-foreground md:max-w-full">
                                                {data.org.id}
                                            </p>
                                        </button>
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem className="grid items-center gap-2 space-y-0 md:grid-cols-4">
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
                                </div>
                            </CardContent>

                            <CardFooter
                                className={cn(
                                    "justify-end gap-2",
                                    !form.formState.isDirty && "p-0 opacity-0"
                                )}
                            >
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    className={cn(
                                        !form.formState.isDirty &&
                                            "pointer-events-none h-0"
                                    )}
                                    isDisabled={isNameUpdating}
                                    onClick={() =>
                                        form.reset({
                                            name: data.org.name,
                                        })
                                    }
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    size="sm"
                                    variant="destructive"
                                    isDisabled={
                                        isNameUpdating ||
                                        !form.formState.isValid
                                    }
                                    isLoading={isNameUpdating}
                                    className={cn(
                                        !form.formState.isDirty &&
                                            "pointer-events-none h-0"
                                    )}
                                >
                                    Update
                                </Button>
                            </CardFooter>
                        </form>
                    </Form>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Invites</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <CopyInvite
                            data={data}
                            className="dark:bg-default-100"
                        />
                    </CardContent>

                    <CardFooter className="flex-col gap-2 md:flex-row md:justify-end">
                        <RegenerateInviteCodeModal
                            isOpen={isRegenerateCodeModalOpen}
                            setIsOpen={setIsRegenerateCodeModalOpen}
                            orgId={data.org.id}
                            userId={user.id}
                        />

                        <InviteManageModal
                            isOpen={isInviteManageModalOpen}
                            setIsOpen={setIsInviteManageModalOpen}
                            isInvitePaused={isInvitePaused}
                            setIsInvitePaused={setIsInvitePaused}
                            data={data}
                            orgId={data.org.id}
                            userId={user.id}
                            trigger={
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    className="w-full md:w-fit"
                                    isDisabled={isInviteManageModalOpen}
                                >
                                    {isInvitePaused
                                        ? "Resume Invites"
                                        : "Pause Invites"}
                                </Button>
                            }
                        />
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Upload Defaults</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="flex flex-wrap items-center justify-between gap-5 md:gap-10">
                            <div className="md:basis-3/5">
                                <p className="text-sm text-muted-foreground/80">
                                    Bored of uploading the same metadata every
                                    time? Set default metadata for every upload.
                                </p>
                            </div>

                            <ManageUploadDefaultsModal
                                isOpen={isUploadDefaultsModalOpen}
                                setIsOen={setIsUploadDefaultsModalOpen}
                                userId={user.id}
                                orgId={data.org.id}
                                template={data.org.template}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Danger Zone</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="flex flex-wrap items-center justify-between gap-5 md:gap-10">
                            <div className="md:basis-3/5">
                                <h4 className="font-medium">Reset Passcode</h4>
                                <p className="text-sm text-muted-foreground/80">
                                    In case your organization&apos;s passcode is
                                    compromised, you can reset it here.
                                </p>
                            </div>

                            <ResetPasscodeModal
                                isOpen={isResetPasscodeModalOpen}
                                setIsOpen={setIsResetPasscodeModalOpen}
                                orgId={data.org.id}
                                userId={user.id}
                            />
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-5 md:gap-10">
                            <div className="md:basis-3/5">
                                <h4 className="font-medium">
                                    Delete Organization
                                </h4>
                                <p className="text-sm text-muted-foreground/80">
                                    Deleting your organization will remove all
                                    data, and you won&apos;t be able to recover
                                    it.
                                </p>
                            </div>

                            <DeleteOrgModal
                                isOpen={isDeleteOrgModalOpen}
                                setIsOpen={setIsDeleteOrgModalOpen}
                                orgId={data.org.id}
                                userId={user.id}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

export default SettingsPage;
