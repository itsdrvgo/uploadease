import { z } from "zod";
import { orgIdSchema } from "./organizations";
import {
    videoCategorySchema,
    videoDescriptionSchema,
    videoTagsSchema,
} from "./videos";

// SINGLE

export const templateIdSchema = z.string().length(16, "Invalid video ID");

// COMPOUND

export const templateSchema = z.object({
    id: templateIdSchema,
    orgId: orgIdSchema,
    title: z.string().max(100, "Title must be at most 100 characters"),
    description: videoDescriptionSchema,
    categoryId: videoCategorySchema,
    tags: videoTagsSchema,
});

export const templateFormSchema = templateSchema
    .omit({
        id: true,
        orgId: true,
        tags: true,
        categoryId: true,
    })
    .merge(
        z.object({
            categoryId: z
                .string()
                .refine((id) => !isNaN(parseInt(id)), "Invalid category"),
        })
    );

export type TemplateData = z.infer<typeof templateSchema>;
export type TemplateFormData = z.infer<typeof templateFormSchema>;
