import { db } from "@/lib/drizzle";
import { organizations } from "@/lib/drizzle/schema";
import {
    cachedOrganizationSchema,
    CachedOrgData,
} from "@/lib/validation/cache/organization";
import { eq } from "drizzle-orm";
import { redis } from "../..";
import {
    generateCachedOrganizationKey,
    generateCachedOrgMembersKey,
} from "../../util";

export async function getCachableOrganization(organizationId: string) {
    const organization = await db.query.organizations.findFirst({
        where: eq(organizations.id, organizationId),
        with: {
            memberships: true,
            creator: true,
        },
    });
    if (!organization) return null;

    const cachableOrganization: CachedOrgData = {
        id: organization.id,
        name: organization.name,
        passcode: organization.passcode,
        inviteCode: organization.inviteCode,
        creatorId: organization.creatorId,
        features: organization.features,
        memberCount: organization.memberships.length,
        createdAt: organization.createdAt.toISOString(),
    };

    return cachableOrganization;
}

export async function addOrganizationToCache(organization: CachedOrgData) {
    const key = generateCachedOrganizationKey(organization.id);
    await redis.set(key, JSON.stringify(organization));
}

export async function updateOrganizationInCache(organization: CachedOrgData) {
    const key = generateCachedOrganizationKey(organization.id);
    await redis.set(key, JSON.stringify(organization));
}

export async function deleteOrganizationFromCache(organizationId: string) {
    const key = generateCachedOrganizationKey(organizationId);
    await redis.del(key);
}

export async function getOrganizationFromCache(organizationId: string) {
    const key = generateCachedOrganizationKey(organizationId);

    const cachedOrganization = await redis.get<CachedOrgData | null>(key);

    if (
        !cachedOrganization ||
        !cachedOrganizationSchema.safeParse(cachedOrganization).success
    ) {
        const organization = await getCachableOrganization(organizationId);
        if (!organization) return null;

        await addOrganizationToCache(organization);
        return organization;
    }

    return cachedOrganization;
}

export async function addMemberToOrganizationCache(
    organizationId: string,
    memberId: string
) {
    const key = generateCachedOrgMembersKey(organizationId);
    await redis.sadd(key, memberId);
}

export async function removeMemberFromOrganizationCache(
    organizationId: string,
    memberId: string
) {
    const key = generateCachedOrgMembersKey(organizationId);
    await redis.srem(key, memberId);
}

export async function deleteMembersFromOrganizationCache(
    organizationId: string
) {
    const key = generateCachedOrgMembersKey(organizationId);
    await redis.del(key);
}

export async function checkExistingMemberInOrganizationCache(
    organizationId: string,
    memberId: string
) {
    const key = generateCachedOrgMembersKey(organizationId);

    const existingMemberIdRaw = await redis.smembers<string[][]>(key);
    const existingMemberIds = existingMemberIdRaw.flatMap(
        (existingMemberId) => existingMemberId
    );
    return existingMemberIds.includes(memberId);
}
