import { DEFAULT_IP } from "@/config/const";
import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { compareSync, hashSync } from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { memberships, organizations } from "../../drizzle/schema";
import { redis } from "../../redis";
import {
    addMembershipToCache,
    deleteMembershipsFromCache,
} from "../../redis/methods/membership";
import {
    addMemberToOrganizationCache,
    addOrganizationToCache,
    checkExistingMemberInOrganizationCache,
    deleteMembersFromOrganizationCache,
    deleteOrganizationFromCache,
    getOrganizationFromCache,
    updateOrganizationInCache,
} from "../../redis/methods/organization";
import { generateId } from "../../utils";
import { cachedOrgClientSchema } from "../../validation/cache/organization";
import {
    orgCreateSchema,
    orgIdSchema,
    orgInviteCodeSchema,
    orgPasscodeSchema,
} from "../../validation/organizations";
import {
    cacheMap,
    createTRPCRouter,
    handleRatelimitError,
    protectedProcedure,
} from "../trpc";

const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "10s"),
    timeout: 1000,
    ephemeralCache: cacheMap,
});

export const orgRouter = createTRPCRouter({
    getOrg: protectedProcedure
        .input(
            z.object({
                orgId: orgIdSchema,
                userId: z.string(),
            })
        )
        .use(({ input, ctx, next }) => {
            if (input.userId !== ctx.user.id)
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You're not authorized to view this organization",
                });

            return next({
                ctx,
            });
        })
        .query(async ({ input }) => {
            const { orgId } = input;

            const org = await getOrganizationFromCache(orgId);
            if (!org)
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Organization not found",
                });

            const parsedOrg = cachedOrgClientSchema.parse(org);

            return {
                org: parsedOrg,
            };
        }),
    createOrg: protectedProcedure
        .input(
            z.object({
                ...orgCreateSchema.shape,
                creatorId: z.string(),
            })
        )
        .use(({ input, ctx, next }) => {
            if (input.creatorId !== ctx.user.id)
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message:
                        "You're not authorized to create this organization",
                });

            return next({
                ctx,
            });
        })
        .mutation(async ({ ctx, input }) => {
            const { name, passcode, creatorId } = input;
            const { db } = ctx;

            const orgId = generateId();
            const inviteCode = generateId(10);
            const hashedPasscode = hashSync(passcode);

            try {
                await Promise.all([
                    db.transaction(async (tx) => {
                        await tx.insert(organizations).values({
                            id: orgId,
                            name,
                            passcode: hashedPasscode,
                            creatorId,
                            inviteCode,
                        });
                        await tx.insert(memberships).values({
                            userId: creatorId,
                            orgId: orgId,
                            role: "creator",
                        });
                    }),
                    addOrganizationToCache({
                        id: orgId,
                        name,
                        passcode: hashedPasscode,
                        inviteCode,
                        creatorId,
                        features: {
                            isInvitePaused: false,
                        },
                        memberCount: 1,
                        createdAt: new Date().toISOString(),
                    }),
                    addMembershipToCache({
                        id: generateId(),
                        orgId,
                        userId: creatorId,
                        role: "creator",
                        createdAt: new Date().toISOString(),
                    }),
                    addMemberToOrganizationCache(orgId, creatorId),
                ]);
            } catch (err) {
                console.error(err);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to create organization",
                });
            }

            return {
                orgId,
            };
        }),
    deleteOrg: protectedProcedure
        .input(
            z.object({
                orgId: orgIdSchema,
                userId: z.string(),
                statement: z
                    .string()
                    .refine((val) => val === "DELETE", "Invalid statement"),
            })
        )
        .use(({ input, ctx, next }) => {
            if (input.userId !== ctx.user.id)
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message:
                        "You're not authorized to delete this organization",
                });

            return next({
                ctx,
            });
        })
        .use(async ({ input, ctx, next }) => {
            const org = await getOrganizationFromCache(input.orgId);
            if (!org)
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Organization not found",
                });

            if (org.creatorId !== input.userId)
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message:
                        "You're not authorized to delete this organization",
                });

            return next({
                ctx,
            });
        })
        .mutation(async ({ input, ctx }) => {
            const { db } = ctx;
            const { orgId } = input;

            await Promise.all([
                db.delete(organizations).where(eq(organizations.id, orgId)),
                deleteOrganizationFromCache(orgId),
                deleteMembershipsFromCache(orgId),
                deleteMembersFromOrganizationCache(orgId),
            ]);

            return {
                orgId,
            };
        }),
    joinOrgByPasscode: protectedProcedure
        .input(
            z.object({
                orgId: orgIdSchema,
                passcode: orgPasscodeSchema,
                userId: z.string(),
            })
        )
        .use(({ input, ctx, next }) => {
            if (input.userId !== ctx.user.id)
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You're not authorized to join this organization",
                });

            return next({
                ctx,
            });
        })
        .use(async ({ input, ctx, next }) => {
            const org = await getOrganizationFromCache(input.orgId);
            if (!org)
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Organization not found",
                });

            if (org.creatorId === input.userId)
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You can't join an organization you created",
                });

            if (org.features.isInvitePaused)
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Organization has paused invites, try again later",
                });

            const isMember = await checkExistingMemberInOrganizationCache(
                org.id,
                input.userId
            );
            if (isMember)
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You're already a member of this organization",
                });

            const hashedPasscode = org.passcode;
            const passcodeMatches = compareSync(input.passcode, hashedPasscode);

            if (!passcodeMatches)
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Invalid passcode",
                });

            return next({
                ctx: {
                    ...ctx,
                    org,
                },
            });
        })
        .mutation(async ({ input, ctx }) => {
            const { db, org } = ctx;
            const { orgId, userId } = input;

            const membershipId = generateId();

            await Promise.all([
                db.transaction(async (tx) => {
                    await tx
                        .update(organizations)
                        .set({
                            memberCount: org.memberCount + 1,
                        })
                        .where(eq(organizations.id, orgId));
                    await tx.insert(memberships).values({
                        id: membershipId,
                        userId,
                        orgId,
                        role: "editor",
                    });
                }),
                updateOrganizationInCache({
                    ...org,
                    memberCount: org.memberCount + 1,
                }),
                addMembershipToCache({
                    id: membershipId,
                    orgId,
                    userId,
                    role: "editor",
                    createdAt: new Date().toISOString(),
                }),
                addMemberToOrganizationCache(orgId, userId),
            ]);

            const parsedOrg = cachedOrgClientSchema.parse(org);

            return {
                org: parsedOrg,
            };
        }),
    joinOrgByInviteCode: protectedProcedure
        .input(
            z.object({
                inviteCode: orgInviteCodeSchema,
                orgId: orgIdSchema,
                userId: z.string(),
            })
        )
        .use(({ input, ctx, next }) => {
            if (input.userId !== ctx.user.id)
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You're not authorized to join this organization",
                });

            return next({
                ctx,
            });
        })
        .use(async ({ input, ctx, next }) => {
            const org = await getOrganizationFromCache(input.orgId);
            if (!org)
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Organization not found",
                });

            if (org.inviteCode !== input.inviteCode)
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Invalid invite link",
                });

            if (org.creatorId === input.userId)
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You can't join an organization you created",
                });

            if (org.features.isInvitePaused)
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Organization has paused invites, try again later",
                });

            const isMember = await checkExistingMemberInOrganizationCache(
                org.id,
                input.userId
            );
            if (isMember)
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You're already a member of this organization",
                });

            return next({
                ctx: {
                    ...ctx,
                    org,
                },
            });
        })
        .mutation(async ({ input, ctx }) => {
            const { db, org } = ctx;
            const { userId, orgId } = input;

            const membershipId = generateId();

            await Promise.all([
                db.transaction(async (tx) => {
                    await tx
                        .update(organizations)
                        .set({
                            memberCount: org.memberCount + 1,
                        })
                        .where(eq(organizations.id, orgId));
                    await tx.insert(memberships).values({
                        id: membershipId,
                        userId,
                        orgId,
                        role: "editor",
                    });
                }),
                updateOrganizationInCache({
                    ...org,
                    memberCount: org.memberCount + 1,
                }),
                addMembershipToCache({
                    id: membershipId,
                    orgId,
                    userId,
                    role: "editor",
                    createdAt: new Date().toISOString(),
                }),
                addMemberToOrganizationCache(orgId, userId),
            ]);

            const parsedOrg = cachedOrgClientSchema.parse(org);

            return {
                org: parsedOrg,
            };
        }),
    manageInviteState: protectedProcedure
        .input(
            z.object({
                orgId: orgIdSchema,
                userId: z.string(),
                inviteState: z.boolean(),
            })
        )
        .use(async ({ ctx, next }) => {
            const { req } = ctx;

            const identifier = req.headers.get("x-forwarded-for") ?? DEFAULT_IP;

            try {
                const { success, reset } = await ratelimit.limit(identifier);
                if (!success) {
                    const now = Date.now();
                    const retryAfter = Math.floor((reset - now) / 1000);

                    throw new TRPCError({
                        code: "TOO_MANY_REQUESTS",
                        message:
                            "Rate limit exceeded, retry after " +
                            retryAfter +
                            " seconds",
                    });
                }
            } catch (err) {
                handleRatelimitError(err);
            }

            return next({
                ctx,
            });
        })
        .use(({ input, ctx, next }) => {
            if (input.userId !== ctx.user.id)
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message:
                        "You're not authorized to manage this organization",
                });

            return next({
                ctx,
            });
        })
        .use(async ({ input, ctx, next }) => {
            const org = await getOrganizationFromCache(input.orgId);
            if (!org)
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Organization not found",
                });

            if (org.creatorId !== input.userId)
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message:
                        "You're not authorized to manage this organization",
                });

            return next({
                ctx: {
                    ...ctx,
                    org,
                },
            });
        })
        .mutation(async ({ input, ctx }) => {
            const { db, org } = ctx;
            const { orgId, inviteState } = input;

            await Promise.all([
                db
                    .update(organizations)
                    .set({
                        features: {
                            isInvitePaused: inviteState,
                        },
                    })
                    .where(eq(organizations.id, orgId)),
                updateOrganizationInCache({
                    ...org,
                    features: {
                        isInvitePaused: inviteState,
                    },
                }),
            ]);

            return {
                orgId,
            };
        }),
    updateName: protectedProcedure
        .input(
            z.object({
                orgId: orgIdSchema,
                userId: z.string(),
                name: z.string(),
            })
        )
        .use(async ({ ctx, next }) => {
            const { req } = ctx;

            const identifier = req.headers.get("x-forwarded-for") ?? DEFAULT_IP;

            try {
                const { success, reset } = await ratelimit.limit(identifier);
                if (!success) {
                    const now = Date.now();
                    const retryAfter = Math.floor((reset - now) / 1000);

                    throw new TRPCError({
                        code: "TOO_MANY_REQUESTS",
                        message:
                            "Rate limit exceeded, retry after " +
                            retryAfter +
                            " seconds",
                    });
                }
            } catch (err) {
                handleRatelimitError(err);
            }

            return next({
                ctx,
            });
        })
        .use(({ input, ctx, next }) => {
            if (input.userId !== ctx.user.id)
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message:
                        "You're not authorized to update this organization",
                });

            return next({
                ctx,
            });
        })
        .use(async ({ input, ctx, next }) => {
            const org = await getOrganizationFromCache(input.orgId);
            if (!org)
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Organization not found",
                });

            if (org.creatorId !== input.userId)
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message:
                        "You're not authorized to update this organization",
                });

            return next({
                ctx: {
                    ...ctx,
                    org,
                },
            });
        })
        .mutation(async ({ input, ctx }) => {
            const { db, org } = ctx;
            const { orgId, name } = input;

            await Promise.all([
                db
                    .update(organizations)
                    .set({
                        name,
                    })
                    .where(eq(organizations.id, orgId)),
                updateOrganizationInCache({
                    ...org,
                    name,
                }),
            ]);

            return {
                org: {
                    id: orgId,
                    name,
                },
            };
        }),
    regenerateInviteCode: protectedProcedure
        .input(
            z.object({
                orgId: orgIdSchema,
                userId: z.string(),
            })
        )
        .use(async ({ ctx, next }) => {
            const { req } = ctx;

            const identifier = req.headers.get("x-forwarded-for") ?? DEFAULT_IP;

            try {
                const { success, reset } = await ratelimit.limit(identifier);
                if (!success) {
                    const now = Date.now();
                    const retryAfter = Math.floor((reset - now) / 1000);

                    throw new TRPCError({
                        code: "TOO_MANY_REQUESTS",
                        message:
                            "Rate limit exceeded, retry after " +
                            retryAfter +
                            " seconds",
                    });
                }
            } catch (err) {
                handleRatelimitError(err);
            }

            return next({
                ctx,
            });
        })
        .use(({ input, ctx, next }) => {
            if (input.userId !== ctx.user.id)
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message:
                        "You're not authorized to update this organization",
                });

            return next({
                ctx,
            });
        })
        .use(async ({ input, ctx, next }) => {
            const org = await getOrganizationFromCache(input.orgId);
            if (!org)
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Organization not found",
                });

            if (org.creatorId !== input.userId)
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message:
                        "You're not authorized to update this organization",
                });

            return next({
                ctx: {
                    ...ctx,
                    org,
                },
            });
        })
        .mutation(async ({ input, ctx }) => {
            const { db, org } = ctx;
            const { orgId } = input;

            const inviteCode = generateId(10);

            await Promise.all([
                db
                    .update(organizations)
                    .set({
                        inviteCode,
                    })
                    .where(eq(organizations.id, orgId)),
                updateOrganizationInCache({
                    ...org,
                    inviteCode,
                }),
            ]);

            return {
                org: {
                    id: orgId,
                    inviteCode,
                },
            };
        }),
    resetPasscode: protectedProcedure
        .input(
            z
                .object({
                    orgId: orgIdSchema,
                    passcode: orgPasscodeSchema,
                    confirmPasscode: orgPasscodeSchema,
                    userId: z.string(),
                })
                .refine((val) => val.passcode === val.confirmPasscode, {
                    message: "Passcodes do not match",
                })
        )
        .use(async ({ ctx, next }) => {
            const { req } = ctx;

            const identifier = req.headers.get("x-forwarded-for") ?? DEFAULT_IP;

            try {
                const { success, reset } = await ratelimit.limit(identifier);
                if (!success) {
                    const now = Date.now();
                    const retryAfter = Math.floor((reset - now) / 1000);

                    throw new TRPCError({
                        code: "TOO_MANY_REQUESTS",
                        message:
                            "Rate limit exceeded, retry after " +
                            retryAfter +
                            " seconds",
                    });
                }
            } catch (err) {
                handleRatelimitError(err);
            }

            return next({
                ctx,
            });
        })
        .use(({ input, ctx, next }) => {
            if (input.userId !== ctx.user.id)
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message:
                        "You're not authorized to update this organization",
                });

            return next({
                ctx,
            });
        })
        .use(async ({ input, ctx, next }) => {
            const org = await getOrganizationFromCache(input.orgId);
            if (!org)
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Organization not found",
                });

            if (org.creatorId !== input.userId)
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message:
                        "You're not authorized to update this organization",
                });

            const passcodeMatches = compareSync(input.passcode, org.passcode);
            if (passcodeMatches)
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "New passcode can't be the same as the old one",
                });

            return next({
                ctx: {
                    ...ctx,
                    org,
                },
            });
        })
        .mutation(async ({ input, ctx }) => {
            const { db, org } = ctx;
            const { orgId, passcode } = input;

            const hashedPasscode = hashSync(passcode);

            await Promise.all([
                db
                    .update(organizations)
                    .set({
                        passcode: hashedPasscode,
                    })
                    .where(eq(organizations.id, orgId)),
                updateOrganizationInCache({
                    ...org,
                    passcode: hashedPasscode,
                }),
            ]);

            return {
                org: {
                    id: orgId,
                    passcode,
                },
            };
        }),
});
