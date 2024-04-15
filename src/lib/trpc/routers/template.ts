import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { templates } from "../../drizzle/schema";
import { checkExistingMemberInOrganizationCache } from "../../redis/methods/organization";
import {
    addTemplateToCache,
    getTemplateFromCache,
} from "../../redis/methods/template";
import { generateId } from "../../utils";
import { cachedTemplateSchema } from "../../validation/cache/template";
import { orgIdSchema } from "../../validation/organizations";
import {
    videoCategorySchema,
    videoDescriptionSchema,
    videoTagsSchema,
} from "../../validation/videos";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const templateRouter = createTRPCRouter({
    getTemplate: protectedProcedure
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
        .use(async ({ input, ctx, next }) => {
            const { orgId, userId } = input;

            const isUserMember = await checkExistingMemberInOrganizationCache(
                orgId,
                userId
            );
            if (!isUserMember)
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message:
                        "You're not authorized to get this organization's template",
                });

            return next({
                ctx,
            });
        })
        .query(async ({ input }) => {
            const { orgId } = input;

            const template = await getTemplateFromCache(orgId);
            if (!template)
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Template not found",
                });

            const parsableTemplate = cachedTemplateSchema
                .omit({
                    title: true,
                })
                .merge(
                    z.object({
                        title: z
                            .string()
                            .max(100, "Title must be at most 100 characters"),
                    })
                )
                .parse(template);

            return {
                template: parsableTemplate,
            };
        }),
    createTemplate: protectedProcedure
        .input(
            z.object({
                orgId: orgIdSchema,
                userId: z.string(),
                template: z.object({
                    title: z
                        .string()
                        .max(100, "Title must be at most 100 characters"),
                    description: videoDescriptionSchema,
                    categoryId: videoCategorySchema,
                    tags: videoTagsSchema,
                }),
            })
        )
        .use(({ input, ctx, next }) => {
            if (input.userId !== ctx.user.id)
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You're not authorized to create a template",
                });

            return next({
                ctx,
            });
        })
        .use(async ({ input, ctx, next }) => {
            const { orgId, userId } = input;

            const isUserMember = await checkExistingMemberInOrganizationCache(
                orgId,
                userId
            );
            if (!isUserMember)
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message:
                        "You're not authorized to create a template for this organization",
                });

            return next({
                ctx,
            });
        })
        .mutation(async ({ input, ctx }) => {
            const { orgId, template } = input;
            const { db } = ctx;

            const templateId = generateId();

            await Promise.all([
                db.insert(templates).values({
                    id: templateId,
                    orgId,
                    ...template,
                }),
                addTemplateToCache({
                    id: templateId,
                    orgId,
                    ...template,
                }),
            ]);

            return {
                templateId,
            };
        }),
});
