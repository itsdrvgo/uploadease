import { membershipRouter } from "./routers/membership";
import { orgRouter } from "./routers/organization";
import { templateRouter } from "./routers/template";
import { muxRouter } from "./routers/upload";
import { userRouter } from "./routers/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
    users: userRouter,
    orgs: orgRouter,
    memberships: membershipRouter,
    mux: muxRouter,
    templates: templateRouter,
});

export type AppRouter = typeof appRouter;
