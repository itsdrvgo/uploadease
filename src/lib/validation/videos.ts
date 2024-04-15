import { z } from "zod";
import { orgIdSchema } from "./organizations";

// SINGLE

export const videoIdSchema = z.string().length(16, "Invalid video ID");
export const videoTitleSchema = z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be at most 100 characters");
export const videoDescriptionSchema = z
    .string()
    .max(5000, "Description must be at most 5000 characters");
export const videoThumbnailSchema = z.string().url("Invalid thumbnail URL");
export const videoUrlSchema = z.string().url("Invalid video URL");
export const videoCategorySchema = z.number().int().min(0, "Invalid category");
export const videoTagsSchema = z
    .array(z.string())
    .refine((tags) => tags.join("").length <= 500, {
        message: "Tags must be at most 500 characters combined",
    });
export const videoPrivacySchema = z.enum(["public", "private", "unlisted"]);
export const videoStatusSchema = z.enum(["draft", "published", "scheduled"]);

// COMPOUND

export const videoSchema = z.object({
    id: videoIdSchema,
    title: videoTitleSchema,
    description: videoDescriptionSchema,
    thumbnail: videoThumbnailSchema,
    videoUrl: videoUrlSchema,
    categoryId: videoCategorySchema,
    tags: videoTagsSchema,
    privacy: videoPrivacySchema,
    status: videoStatusSchema,
    editorId: z.string(),
    orgId: orgIdSchema,
    uploadedAt: z.date(),
    createdAt: z.date(),
});

export const videoFormSchema = z.object({
    title: videoTitleSchema,
    description: videoDescriptionSchema,
    categoryId: z
        .string()
        .refine((id) => !isNaN(parseInt(id)), "Invalid category"),
});

export type VideoData = z.infer<typeof videoSchema>;
export type VideoFormData = z.infer<typeof videoFormSchema>;
