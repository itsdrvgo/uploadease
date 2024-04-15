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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ytCategories } from "@/config/const";
import { trpc } from "@/lib/trpc/client";
import { handleClientError } from "@/lib/utils";
import { CachedTemplateData } from "@/lib/validation/cache/template";
import {
    TemplateFormData,
    templateFormSchema,
} from "@/lib/validation/templates";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../ui/form";
import { Label } from "../../ui/label";
import TagsArea from "../../ui/tags-area";

const videoCategories = ytCategories.map((category) => ({
    label: category.name,
    value: category.id,
}));

interface PageProps {
    isOpen: boolean;
    setIsOen: Dispatch<SetStateAction<boolean>>;
    userId: string;
    orgId: string;
    template: CachedTemplateData | null;
}

function ManageUploadDefaultsModal({
    isOpen,
    setIsOen,
    userId,
    orgId,
    template,
}: PageProps) {
    const router = useRouter();
    const [tags, setTags] = useState<string[]>(template?.tags || []);

    const form = useForm<TemplateFormData>({
        resolver: zodResolver(templateFormSchema),
        defaultValues: {
            title: template?.title || "",
            description: template?.description || "",
            categoryId: template?.categoryId.toString() || "22",
        },
    });

    const { mutate: createTemplate, isPending } =
        trpc.templates.createTemplate.useMutation({
            onMutate: () => {
                const toastId = toast.loading(
                    template ? "Updating defaults..." : "Setting defaults..."
                );
                return { toastId };
            },
            onSuccess: (_, __, ctx) => {
                toast.success(template ? "Defaults updated" : "Defaults set", {
                    id: ctx.toastId,
                });

                setIsOen(false);
                router.refresh();
            },
            onError: (err, _, ctx) => {
                handleClientError(err, ctx?.toastId);
            },
        });

    return (
        <Dialog open={isOpen} onOpenChange={setIsOen}>
            <DialogTrigger asChild>
                <Button size="sm" isDisabled={isOpen}>
                    {template ? "Edit Defaults" : "Set Defaults"}
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {template ? "Edit Defaults" : "Set Defaults"}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        className="space-y-5"
                        onSubmit={(...args) =>
                            form.handleSubmit((data) =>
                                createTemplate({
                                    orgId,
                                    userId,
                                    template: {
                                        ...data,
                                        tags,
                                        categoryId: +data.categoryId,
                                    },
                                })
                            )(...args)
                        }
                        onKeyDown={(e) =>
                            e.key === "Enter" && e.preventDefault()
                        }
                    >
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>

                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Enter the title of the video"
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>

                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter the description of the video"
                                                maxRows={30}
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>

                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                            </FormControl>

                                            <SelectContent>
                                                {videoCategories.map(
                                                    (category) => (
                                                        <SelectItem
                                                            value={
                                                                category.value
                                                            }
                                                            key={category.value}
                                                        >
                                                            {category.label}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-2">
                                <Label htmlFor="tags">Tags</Label>
                                <TagsArea tags={tags} setTags={setTags} />
                            </div>
                        </div>

                        <DialogFooter className="justify-end gap-2">
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                isDisabled={isPending}
                                onClick={() => setIsOen(false)}
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
                                {template ? "Save" : "Set Defaults"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default ManageUploadDefaultsModal;
