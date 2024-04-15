import { z } from "zod";

export const usernameSchmea = z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be at most 50 characters");

export const emailSchema = z.string().email("Invalid email address");

export const userUpdateSchema = z.object({
    username: usernameSchmea,
    email: emailSchema.optional(),
});

export const userClientSchema = z.object({
    id: z.string(),
    username: z.string(),
    email: z.string(),
    plan: z.number().min(0).max(2),
    avatar: z.string().url(),
    createdAt: z.date(),
});

export type UserUpdateData = z.infer<typeof userUpdateSchema>;
export type UserClientData = z.infer<typeof userClientSchema>;
