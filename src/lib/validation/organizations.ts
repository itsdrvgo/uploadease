import { z } from "zod";

// SINGLE

export const orgIdSchema = z.string().length(16, "Invalid organization ID");
export const orgPasscodeSchema = z
    .string()
    .min(8, "Passcode must be at least 8 characters")
    .max(50, "Passcode must be at most 50 characters");
export const orgNameSchema = z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be at most 50 characters");
export const orgInviteCodeSchema = z.string().length(10, "Invalid invite code");
export const orgFeaturesSchema = z.object({
    isInvitePaused: z.boolean(),
});
export const orgRolesSchema = z.union([
    z.literal("creator"),
    z.literal("editor"),
]);

// COMPOUND

export const orgCreatorClientSchema = z.object({
    id: z.string(),
    username: z.string(),
    avatar: z.string(),
});

export const orgClientSchema = z.object({
    id: z.string(),
    name: z.string(),
    creatorId: z.string(),
    createdAt: z.date(),
    memberCount: z.number(),
    features: orgFeaturesSchema,
});

export const orgMembershipClientSchema = z.object({
    id: z.string(),
    createdAt: z.date(),
    orgId: z.string(),
    userId: z.string(),
    role: orgRolesSchema,
});

export const orgWithCreatorClientSchema = orgClientSchema.merge(
    z.object({
        creator: orgCreatorClientSchema,
    })
);

export const orgMembershipWithOrgClientSchema = orgMembershipClientSchema.merge(
    z.object({
        organization: orgClientSchema,
    })
);

export const orgMembershipWithOrgAndCreatorClientSchema =
    orgMembershipWithOrgClientSchema.merge(
        z.object({
            organization: orgWithCreatorClientSchema,
        })
    );

// ACTIONS

export const orgCreateSchema = z.object({
    name: orgNameSchema,
    passcode: orgPasscodeSchema,
});

export const orgJoinSchema = z.object({
    id: orgIdSchema,
    passcode: orgPasscodeSchema,
});

export const resetOrgPasscodeSchema = z
    .object({
        passcode: orgPasscodeSchema,
        confirmPasscode: orgPasscodeSchema,
    })
    .refine((data) => data.passcode === data.confirmPasscode, {
        message: "Passcodes do not match",
        path: ["confirmPasscode"],
    });

export type OrgCreateData = z.infer<typeof orgCreateSchema>;
export type OrgJoinData = z.infer<typeof orgJoinSchema>;
export type ResetOrgPasscodeData = z.infer<typeof resetOrgPasscodeSchema>;

export type OrgMemberShipData = z.infer<typeof orgIdSchema>;
export type OrgCreatorClientData = z.infer<typeof orgCreatorClientSchema>;
export type OrgClientData = z.infer<typeof orgClientSchema>;
export type OrgMembershipWithOrgClientData = z.infer<
    typeof orgMembershipWithOrgClientSchema
>;
export type OrgMembershipWithOrgAndCreatorClientData = z.infer<
    typeof orgMembershipWithOrgAndCreatorClientSchema
>;
export type OrgWithCreatorClientData = z.infer<
    typeof orgWithCreatorClientSchema
>;
