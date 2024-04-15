"use client";

import { cn } from "@/lib/utils";
import { videoTagsSchema } from "@/lib/validation/videos";
import { ClassValue } from "clsx";
import {
    ClipboardEvent,
    Dispatch,
    ElementRef,
    forwardRef,
    HTMLAttributes,
    KeyboardEvent,
    SetStateAction,
    useRef,
    useState,
} from "react";
import { toast } from "sonner";
import { Icons } from "../icons/icons";
import { Button } from "./button";
import { Chip, ChipProps } from "./chip";

export type TagsAreaProps = {
    classNames?: {
        base?: ClassValue;
        chip?: ChipProps["classNames"];
        mainWrapper?: ClassValue;
        input?: ClassValue;
        buttonWrapper?: ClassValue;
        button?: ClassValue;
    };
    tags: string[];
    setTags: Dispatch<SetStateAction<string[]>>;
    inputId?: string;
};

const TagsArea = forwardRef<
    HTMLDivElement,
    HTMLAttributes<HTMLDivElement> & TagsAreaProps
>(({ classNames, tags, setTags, inputId = "tags", ...props }, ref) => {
    const [tagInputValue, setTagInputValue] = useState("");
    const tagsInputRef = useRef<ElementRef<"input">>(null);

    const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        switch (e.key) {
            case "Enter":
            case ",":
                e.preventDefault();
                handleTagAdd(e);
                break;

            case "Backspace":
                if (!tagInputValue) setTags(tags.slice(0, -1));
                break;
        }
    };

    const handleTagAdd = (e: KeyboardEvent<HTMLInputElement>) => {
        const tag = e.currentTarget.value.trim();
        if (!tag) return;

        if (tags.includes(tag)) return toast.error("Tag already exists");
        const newTags = [...tags, tag];

        const parsedTags = videoTagsSchema.safeParse(newTags);
        if (!parsedTags.success)
            return toast.error(
                parsedTags.error.issues.map((issue) => issue.message).join(", ")
            );

        setTags(newTags);
        setTagInputValue("");
    };

    const handleTagRemove = (tag: string) => {
        setTags(tags.filter((t) => t !== tag));
    };

    const handleCopyTags = () => {
        if (!tags.length) return;

        const tagsString = tags.join(",");
        navigator.clipboard.writeText(tagsString);

        toast.success("Tags copied to clipboard");
    };

    const handleTagPaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const clipboardData = e.clipboardData?.getData("text");
        if (!clipboardData) return;

        const newTags = [...tags, ...clipboardData.split(",")];
        const parsedTags = videoTagsSchema.safeParse(newTags);

        if (!parsedTags.success)
            return toast.error(
                parsedTags.error.issues.map((issue) => issue.message).join(", ")
            );

        const uniqueTags = [
            ...new Set(
                newTags.filter(
                    (tag) => !tags.includes(tag.trim().toLowerCase())
                )
            ),
        ];

        if (!uniqueTags.length) return toast.error("No new tags to add");

        setTags([
            ...tags,
            ...uniqueTags.map((tag) => tag.trim().toLowerCase()),
        ]);
    };

    return (
        <div
            ref={ref}
            className={cn(
                "flex min-h-32 items-start justify-between gap-2 rounded-md bg-input p-3",
                classNames?.base
            )}
            onClick={() => tagsInputRef.current?.focus()}
            {...props}
        >
            <div
                className={cn(
                    "flex w-full flex-wrap gap-1",
                    classNames?.mainWrapper
                )}
            >
                {!!tags.length &&
                    tags.map((tag, i) => (
                        <Chip
                            key={i}
                            classNames={{
                                container: cn(
                                    "tranisition-all text-background-strict ease-in-out",
                                    "cursor-pointer bg-accent hover:bg-accent/60",
                                    classNames?.chip?.container
                                ),
                                ...classNames?.chip,
                            }}
                            onClose={() => handleTagRemove(tag)}
                        >
                            {tag}
                        </Chip>
                    ))}

                <input
                    type="text"
                    id={inputId}
                    ref={tagsInputRef}
                    value={tagInputValue}
                    placeholder="Add tags..."
                    onChange={(e) => setTagInputValue(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    className={cn(
                        "px-1 py-[2px]",
                        "bg-transparent text-xs outline-none",
                        "text-foreground",
                        classNames?.input
                    )}
                    onPaste={handleTagPaste}
                />
            </div>

            <div className={cn(classNames?.buttonWrapper)}>
                <Button
                    type="button"
                    size="icon"
                    className={cn(classNames?.button)}
                    onClick={handleCopyTags}
                >
                    <Icons.copy className="size-3" />
                </Button>
            </div>
        </div>
    );
});

TagsArea.displayName = "TagsArea";

export default TagsArea;
