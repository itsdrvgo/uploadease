import { db } from "@/lib/drizzle";
import { templates } from "@/lib/drizzle/schema";
import {
    CachedTemplateData,
    cachedTemplateSchema,
} from "@/lib/validation/cache/template";
import { eq } from "drizzle-orm";
import { redis } from "../..";
import { generateCachedTemplateOrgKey } from "../../util";

export async function getCacheableTemplate(orgId: string) {
    const template = await db.query.templates.findFirst({
        where: eq(templates.orgId, orgId),
    });
    if (!template) return null;

    const cachedTemplate: CachedTemplateData = {
        id: template.id,
        orgId: template.orgId,
        title: template.title,
        description: template.description,
        categoryId: template.categoryId,
        tags: template.tags,
    };

    return cachedTemplate;
}

export async function addTemplateToCache(template: CachedTemplateData) {
    const key = generateCachedTemplateOrgKey(template.orgId);
    await redis.set(key, JSON.stringify(template));
}

export async function updateTemplateInCache(template: CachedTemplateData) {
    const key = generateCachedTemplateOrgKey(template.orgId);
    await redis.set(key, JSON.stringify(template));
}

export async function deleteTemplateFromCache(orgId: string) {
    const key = generateCachedTemplateOrgKey(orgId);
    await redis.del(key);
}

export async function getTemplateFromCache(orgId: string) {
    const key = generateCachedTemplateOrgKey(orgId);

    const cachedTemplate = await redis.get<CachedTemplateData | null>(key);

    if (
        !cachedTemplate ||
        !cachedTemplateSchema.safeParse(cachedTemplate).success
    ) {
        const template = await getCacheableTemplate(orgId);
        if (!template) return null;

        await addTemplateToCache(template);
        return template;
    }

    return cachedTemplate;
}
