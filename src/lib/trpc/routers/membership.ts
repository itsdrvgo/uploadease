import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getMembershipFromCache } from "../../redis/methods/membership";
import { getUserFromCache } from "../../redis/methods/user";
import { cachedUserClientSchema } from "../../validation/cache/user";
import { orgIdSchema } from "../../validation/organizations";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const membershipRouter = createTRPCRouter({
    getMembership: protectedProcedure
        .input(
            z.object({
                userId: z.string(),
                orgId: orgIdSchema,
            })
        )
        .query(async ({ input }) => {
            const { userId, orgId } = input;

            const membership = await getMembershipFromCache(orgId, userId);
            if (!membership)
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Membership not found",
                });

            const user = await getUserFromCache(userId);
            if (!user)
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not found",
                });

            const parsableUser = cachedUserClientSchema
                .omit({
                    email: true,
                })
                .parse(user);

            return {
                membership: {
                    ...membership,
                    user: parsableUser,
                },
            };
        }),
});
