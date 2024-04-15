import { z } from "zod";
import {
    orgFeaturesSchema,
    orgIdSchema,
    orgInviteCodeSchema,
    orgNameSchema,
} from "../organizations";

export const cachedOrganizationSchema = z.object({
    id: orgIdSchema,
    name: orgNameSchema,
    passcode: z.string().min(1, "Passcode must be at least 1 character long"),
    inviteCode: orgInviteCodeSchema,
    creatorId: z.string(),
    features: orgFeaturesSchema,
    memberCount: z.number(),
    createdAt: z.string(),
});

export const cachedOrgClientSchema = cachedOrganizationSchema.omit({
    passcode: true,
    inviteCode: true,
});

export type CachedOrgData = z.infer<typeof cachedOrganizationSchema>;
export type CachedOrgClientData = z.infer<typeof cachedOrgClientSchema>;
