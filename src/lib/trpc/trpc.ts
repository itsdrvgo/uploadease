import { initTRPC, TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import superjson from "superjson";
import { ZodError } from "zod";
import { redis } from "../redis";
import { Context } from "./context";

export const cacheMap = new Map<string, number>();

export const t = initTRPC.context<Context>().create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError:
                    error.cause instanceof ZodError
                        ? error.cause.flatten()
                        : null,
            },
        };
    },
});

const isAuth = t.middleware(async ({ ctx, next }) => {
    if (!ctx.user?.id)
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You're not authorized",
        });

    return next({
        ctx: {
            ...ctx,
            user: ctx.user,
        },
    });
});

const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(50, "10s"),
    timeout: 1000,
    ephemeralCache: cacheMap,
});

const ratelimiter = t.middleware(async ({ ctx, next }) => {
    const { req } = ctx;

    const identifier = req.headers.get("x-forwarded-for") ?? "127.0.0.1";

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
        ctx: {
            ...ctx,
        },
    });
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure.use(ratelimiter);
export const protectedProcedure = publicProcedure.use(isAuth);

export function handleRatelimitError(error: unknown) {
    if (error instanceof Error)
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
        });
    else {
        console.error(error);
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Unknown error",
        });
    }
}
