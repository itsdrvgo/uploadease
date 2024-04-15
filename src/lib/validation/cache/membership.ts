import { z } from "zod";
import { orgIdSchema, orgRolesSchema } from "../organizations";

export const cachedMembershipSchema = z.object({
    id: z.string(),
    orgId: orgIdSchema,
    userId: z.string(),
    role: orgRolesSchema,
    createdAt: z.string(),
});

export type CachedMembershipData = z.infer<typeof cachedMembershipSchema>;
