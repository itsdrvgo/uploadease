"use client";

import { Icons } from "@/components/icons/icons";
import { Button } from "@/components/ui/button";
import { useVideoStore } from "@/lib/store/video";
import { cn, isFileTypePermitted } from "@/lib/utils";
import { GenericProps, UploadEvent } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, DragEvent, ElementRef, useRef, useState } from "react";
import { toast } from "sonner";

const PERMITTED_VIDEO_FILE_TYPES = [
    "video/mp4",
    "video/mkv",
    "video/quicktime",
    "video/mov",
];

function UploadVideoContainer({ className, ...props }: GenericProps) {
    const router = useRouter();
    const pathname = usePathname();

    const [isDragActive, setIsDragActive] = useState(false);

    const fileInputRef = useRef<ElementRef<"input">>(null);

    const video = useVideoStore((state) => state.video);
    const setVideo = useVideoStore((state) => state.setVideo);

    const handleUpload = (e: UploadEvent) => {
        e.preventDefault();
        e.stopPropagation();

        let file: File | undefined;

        if (e.type === "drop")
            file = (e as DragEvent<HTMLDivElement>).dataTransfer.files[0];
        else file = (e as ChangeEvent<HTMLInputElement>).target.files?.[0];

        if (!file) return;

        if (!isFileTypePermitted(file, PERMITTED_VIDEO_FILE_TYPES))
            return toast.error(
                "Invalid file type, only files of type " +
                    PERMITTED_VIDEO_FILE_TYPES.join(", ") +
                    " are permitted"
            );

        if (video) URL.revokeObjectURL(video.url);

        setVideo({
            file,
            url: URL.createObjectURL(file),
        });

        router.push(pathname + "?step=meta");
    };

    const handleVideoChange = () => {
        if (!video) return;
        setVideo(null);
        URL.revokeObjectURL(video.url);
        fileInputRef.current?.click();
    };

    return (
        <div
            className={cn(
                "cursor-pointer rounded-xl",
                "flex items-center justify-center",
                !video && "aspect-video overflow-hidden",
                !video &&
                    "border border-dashed border-accent/50 dark:border-border/20",
                !video &&
                    isDragActive &&
                    "border-accent bg-accent/10 dark:bg-accent",
                className
            )}
            onDragOver={() => setIsDragActive(true)}
            onDragLeave={() => setIsDragActive(false)}
            onClick={() => !video && fileInputRef.current?.click()}
            onDrop={handleUpload}
            {...props}
        >
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleUpload}
                accept={PERMITTED_VIDEO_FILE_TYPES.join(", ")}
            />

            {video && (
                <div className="w-full space-y-5">
                    <video
                        className="aspect-video size-full rounded-xl"
                        controls
                        preload="none"
                    >
                        <source src={video.url} type={video.file.type} />
                        Your browser does not support the video tag.
                    </video>

                    <div className="flex justify-end">
                        <Button size="sm" onClick={handleVideoChange}>
                            Change Video
                        </Button>
                    </div>
                </div>
            )}

            {!video && (
                <div
                    className={cn(
                        "flex flex-col items-center gap-5",
                        "text-primary dark:text-foreground"
                    )}
                >
                    <div>
                        <Icons.upload className="size-10" />
                    </div>

                    <p
                        className={cn(
                            "max-w-40 text-balance text-center text-sm",
                            "text-primary/60 dark:text-foreground/60"
                        )}
                    >
                        {isDragActive
                            ? "Drop the video here"
                            : "Drag & Drop or Click to Upload Video"}
                    </p>
                </div>
            )}
        </div>
    );
}

export default UploadVideoContainer;
