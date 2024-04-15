import { z } from "zod";

export const cachedUserSchema = z.object({
    id: z.string(),
    username: z.string().min(1, "Username must be at least 1 character long"),
    email: z.string().email("Invalid email address"),
    avatar: z.string().url("Invalid URL"),
    plan: z.number().min(0).max(2),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const cachedUserClientSchema = cachedUserSchema.omit({
    updatedAt: true,
});

export type CachedUserData = z.infer<typeof cachedUserSchema>;
export type CachedUserClientData = z.infer<typeof cachedUserClientSchema>;
