import { db } from "@/lib/drizzle";
import { users } from "@/lib/drizzle/schema";
import { CachedUserData, cachedUserSchema } from "@/lib/validation/cache/user";
import { eq } from "drizzle-orm";
import { redis } from "../..";
import { generateCachedUserKey, generateCachedUsernamesKey } from "../../util";

const usernamesKey = generateCachedUsernamesKey();

export async function getCachableUser(userId: string) {
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
    });
    if (!user) return null;

    const cachableUser: CachedUserData = {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        plan: user.plan,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
    };

    return cachableUser;
}

export async function addUserToCache(user: CachedUserData) {
    const key = generateCachedUserKey(user.id);
    await redis.set(key, JSON.stringify(user));
}

export async function updateUserInCache(user: CachedUserData) {
    const key = generateCachedUserKey(user.id);
    await redis.set(key, JSON.stringify(user));
}

export async function deleteUserFromCache(userId: string) {
    const key = generateCachedUserKey(userId);
    await redis.del(key);
}

export async function getUserFromCache(userId: string) {
    const key = generateCachedUserKey(userId);

    const cachedUser = await redis.get<CachedUserData | null>(key);

    if (!cachedUser || !cachedUserSchema.safeParse(cachedUser).success) {
        const user = await getCachableUser(userId);
        if (!user) return null;

        await addUserToCache(user);
        return user;
    }

    return cachedUser;
}

export async function addUsernameToCache(username: string) {
    await redis.sadd(usernamesKey, username);
}

export async function updateUsernameInCache(
    oldUsername: string,
    newUsername: string
) {
    const pipeline = redis.pipeline();
    pipeline.srem(usernamesKey, oldUsername);
    pipeline.sadd(usernamesKey, newUsername);
    await pipeline.exec();
}

export async function deleteUsernameFromCache(username: string) {
    await redis.srem(usernamesKey, username);
}

export async function checkExistingUsernameInCache(username: string) {
    const existingUsernamesRaw = await redis.smembers<string[][]>(usernamesKey);
    const existingUsernames = existingUsernamesRaw.flatMap(
        (existingUsername) => existingUsername
    );
    return existingUsernames.includes(username);
}
