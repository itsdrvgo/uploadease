import { db } from "@/lib/drizzle";
import { memberships } from "@/lib/drizzle/schema";
import {
    CachedMembershipData,
    cachedMembershipSchema,
} from "@/lib/validation/cache/membership";
import { and, eq } from "drizzle-orm";
import { redis } from "../..";
import { generateCachedMembershipKey } from "../../util";

export async function getCachableMembership(orgId: string, memberId: string) {
    const membership = await db.query.memberships.findFirst({
        where: and(
            eq(memberships.orgId, orgId),
            eq(memberships.userId, memberId)
        ),
        with: {
            user: true,
        },
    });
    if (!membership) return null;

    const cachableMembership: CachedMembershipData = {
        id: membership.id,
        orgId: membership.orgId,
        userId: membership.userId,
        role: membership.role,
        createdAt: membership.createdAt.toISOString(),
    };

    return cachableMembership;
}

export async function addMembershipToCache(membership: CachedMembershipData) {
    const key = generateCachedMembershipKey(
        membership.orgId,
        membership.userId
    );
    await redis.set(key, JSON.stringify(membership));
}

export async function updateMembershipInCache(
    membership: CachedMembershipData
) {
    const key = generateCachedMembershipKey(
        membership.orgId,
        membership.userId
    );
    await redis.set(key, JSON.stringify(membership));
}

export async function deleteMembershipFromCache(
    orgId: string,
    memberId: string
) {
    const key = generateCachedMembershipKey(orgId, memberId);
    await redis.del(key);
}

export async function deleteMembershipsFromCache(orgId: string) {
    const keys = await redis.keys("organization:" + orgId + ":membership:*");
    await redis.del(...keys);
}

export async function getMembershipFromCache(orgId: string, memberId: string) {
    const key = generateCachedMembershipKey(orgId, memberId);

    const cachedMembership = await redis.get<CachedMembershipData | null>(key);

    if (
        !cachedMembership ||
        !cachedMembershipSchema.safeParse(cachedMembership).success
    ) {
        const membership = await getCachableMembership(orgId, memberId);
        if (!membership) return null;

        await addMembershipToCache(membership);
        return membership;
    }

    return cachedMembership;
}
