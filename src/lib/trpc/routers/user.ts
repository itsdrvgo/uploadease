import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { users } from "../../drizzle/schema";
import {
    checkExistingUsernameInCache,
    getUserFromCache,
    updateUserInCache,
    updateUsernameInCache,
} from "../../redis/methods/user";
import { cachedUserClientSchema } from "../../validation/cache/user";
import { usernameSchmea } from "../../validation/users";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
    getUser: protectedProcedure.input(z.string()).query(async ({ input }) => {
        const user = await getUserFromCache(input);
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
            user: parsableUser,
        };
    }),
    updateUsername: protectedProcedure
        .input(
            z.object({
                username: usernameSchmea,
                userId: z.string(),
            })
        )
        .use(({ input, ctx, next }) => {
            if (input.userId !== ctx.user.id)
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You're not authorized to update this user",
                });

            return next({
                ctx,
            });
        })
        .use(async ({ input, ctx, next }) => {
            const existingUser = await getUserFromCache(input.userId);
            if (!existingUser)
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not found",
                });

            const existingUsername = await checkExistingUsernameInCache(
                input.username
            );
            if (existingUsername)
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "Username already exists",
                });

            if (existingUser.username === input.username)
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Username is the same as the current one",
                });

            return next({
                ctx: {
                    ...ctx,
                    existingUser,
                },
            });
        })
        .mutation(async ({ input, ctx }) => {
            const { db, existingUser } = ctx;
            const { userId, username } = input;

            await Promise.all([
                db
                    .update(users)
                    .set({
                        username,
                    })
                    .where(eq(users.id, userId)),
                updateUserInCache({
                    ...existingUser,
                    username,
                }),
                updateUsernameInCache(existingUser.username, username),
            ]);

            return {
                user: {
                    id: userId,
                    username,
                },
            };
        }),
});
