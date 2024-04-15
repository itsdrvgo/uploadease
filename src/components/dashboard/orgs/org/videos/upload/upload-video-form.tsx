"use client";

import { Icons } from "@/components/icons/icons";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import TagsArea from "@/components/ui/tags-area";
import { Textarea } from "@/components/ui/textarea";
import { ytCategories } from "@/config/const";
import { useThumbnailStore } from "@/lib/store/thumbnail";
import { cn, isFileTypePermitted } from "@/lib/utils";
import { CachedOrgClientData } from "@/lib/validation/cache/organization";
import { CachedTemplateData } from "@/lib/validation/cache/template";
import { VideoFormData, videoFormSchema } from "@/lib/validation/videos";
import { UploadEvent } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { ChangeEvent, DragEvent, ElementRef, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const videoCategories = ytCategories.map((category) => ({
    label: category.name,
    value: category.id,
}));

const ACCEPTED_IMAGE_FILE_TYPES = ["image/png", "image/jpeg", "image/jpg"];
const ACCEPTED_IMAGE_FILE_SIZE = 2 * 1024 * 1024;

interface PageProps {
    org: CachedOrgClientData & {
        template: CachedTemplateData | null;
    };
}

function UploadVideoForm({ org }: PageProps) {
    const [isDragActive, setIsDragActive] = useState(false);
    const [tags, setTags] = useState<string[]>(org.template?.tags ?? []);

    const fileInputRef = useRef<ElementRef<"input">>(null);

    const thumbnail = useThumbnailStore((state) => state.thumbnail);
    const setThumbnail = useThumbnailStore((state) => state.setThumbnail);

    const form = useForm<VideoFormData>({
        resolver: zodResolver(videoFormSchema.partial()),
        defaultValues: {
            title: org.template?.title ?? "",
            description: org.template?.description ?? "",
            categoryId: org.template?.categoryId.toString() ?? "22",
        },
    });

    const handleUpload = (e: UploadEvent) => {
        e.preventDefault();
        e.stopPropagation();

        let file: File | undefined;

        if (e.type === "drop")
            file = (e as DragEvent<HTMLDivElement>).dataTransfer.files[0];
        else file = (e as ChangeEvent<HTMLInputElement>).target.files?.[0];

        if (!file) return;

        if (!isFileTypePermitted(file, ACCEPTED_IMAGE_FILE_TYPES)) {
            return toast.error("Invalid file type");
        }

        if (file.size > ACCEPTED_IMAGE_FILE_SIZE) {
            return toast.error("File size is too large");
        }

        if (thumbnail) URL.revokeObjectURL(thumbnail.url);

        setThumbnail({
            file,
            url: URL.createObjectURL(file),
        });
    };

    const handleThumbnailChange = () => {
        if (!thumbnail) return;
        URL.revokeObjectURL(thumbnail.url);
        fileInputRef.current?.click();
    };

    const handleSubmit = (data: VideoFormData) => {
        console.log(data);
    };

    return (
        <Form {...form}>
            <form
                className={cn("space-y-5")}
                onSubmit={(...args) => form.handleSubmit(handleSubmit)(...args)}
                onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
            >
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

                <div className="flex flex-col items-center gap-5 md:flex-row md:justify-between">
                    <div className="space-y-4 md:basis-1/2">
                        <h4 className="text-sm font-semibold leading-none">
                            Thumbnail
                        </h4>

                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground md:text-balance">
                                Upload a thumbnail for the video. It will be
                                displayed as the cover image. The recommended
                                resolution is{" "}
                                <span className="rounded-md bg-muted px-1 py-[2px] font-medium">
                                    1280x720
                                </span>{" "}
                                and the maximum file size is{" "}
                                <span className="rounded-md bg-muted px-1 py-[2px] font-medium">
                                    2 MB
                                </span>
                                .
                            </p>

                            <p className="text-sm text-destructive md:text-balance">
                                * Only {ACCEPTED_IMAGE_FILE_TYPES.join(", ")}{" "}
                                files are allowed
                            </p>
                        </div>
                    </div>

                    <div
                        className={cn(
                            "aspect-video w-full cursor-pointer overflow-hidden rounded-xl md:h-52 md:w-auto",
                            "flex items-center justify-center",
                            !thumbnail &&
                                "border border-dashed border-accent/50 dark:border-border/20",
                            isDragActive &&
                                "border-accent bg-accent/10 dark:bg-accent"
                        )}
                        onDragOver={() => setIsDragActive(true)}
                        onDragLeave={() => setIsDragActive(false)}
                        onClick={() => fileInputRef.current?.click()}
                        onDrop={handleUpload}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleUpload}
                            accept={ACCEPTED_IMAGE_FILE_TYPES.join(", ")}
                        />

                        {thumbnail && (
                            <div className="group/img relative size-full">
                                <Image
                                    src={thumbnail.url}
                                    alt="Thumbnail"
                                    width={1000}
                                    height={1000}
                                    className="size-full object-cover"
                                />

                                <div className="absolute left-0 top-0 flex size-full items-center justify-center bg-black/40 opacity-0 transition-all ease-in-out group-hover/img:opacity-100">
                                    <Button
                                        size="sm"
                                        onClick={handleThumbnailChange}
                                    >
                                        Change Thumbnail
                                    </Button>
                                </div>
                            </div>
                        )}

                        {!thumbnail && (
                            <div
                                className={cn(
                                    "flex flex-col items-center gap-5",
                                    "text-primary dark:text-foreground"
                                )}
                            >
                                <div>
                                    <Icons.upload className="size-8" />
                                </div>

                                <p
                                    className={cn(
                                        "max-w-40 text-balance text-center text-xs",
                                        "text-primary/60 dark:text-foreground/60"
                                    )}
                                >
                                    {isDragActive
                                        ? "Drop the thumbnail here"
                                        : "Drag & Drop or Click to Upload Thumbnail"}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

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
                                    {videoCategories.map((category) => (
                                        <SelectItem
                                            value={category.value}
                                            key={category.value}
                                        >
                                            {category.label}
                                        </SelectItem>
                                    ))}
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

                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}

export default UploadVideoForm;
