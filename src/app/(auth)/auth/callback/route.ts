import { DEFAULT_PROFILE_IMAGE_URL } from "@/config/const";
import { db } from "@/lib/drizzle";
import { users } from "@/lib/drizzle/schema";
import {
    addUsernameToCache,
    addUserToCache,
    getUserFromCache,
} from "@/lib/redis/methods/user";
import { generateId } from "@/lib/utils";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");

    if (code) {
        const cookieStore = cookies();
        const supabase = createRouteHandlerClient({
            cookies: () => cookieStore,
        });

        const {
            data: { user },
        } = await supabase.auth.exchangeCodeForSession(code);

        if (user) {
            const existingUser = await getUserFromCache(user.id);
            const username =
                user.user_metadata.name.split(" ").join("").toLowerCase() +
                "_" +
                generateId(5);

            if (!existingUser)
                await Promise.all([
                    db.insert(users).values({
                        id: user.id,
                        email: user.email!,
                        username,
                        avatar:
                            user.user_metadata.avatar_url ??
                            DEFAULT_PROFILE_IMAGE_URL,
                    }),
                    addUserToCache({
                        id: user.id,
                        email: user.email!,
                        avatar:
                            user.user_metadata.avatar_url ??
                            DEFAULT_PROFILE_IMAGE_URL,
                        createdAt: user.created_at,
                        updatedAt: user.updated_at ?? user.created_at,
                        plan: 0,
                        username,
                    }),
                    addUsernameToCache(username),
                ]);
        }
    }

    const redirectURL = new URL("/dashboard", url.origin);
    return NextResponse.redirect(redirectURL);
}
