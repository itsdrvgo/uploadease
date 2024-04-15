import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const url = new URL(req.url);
    const res = NextResponse.next();

    const supabase = createMiddlewareClient({ req, res });
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (url.pathname.startsWith("/auth")) {
        if (user) return NextResponse.redirect(new URL("/dashboard", req.url));
        return res;
    }

    if (!user) return NextResponse.redirect(new URL("/auth/signin", req.url));
    if (url.pathname === "/dashboard")
        return NextResponse.redirect(
            new URL("/dashboard/organizations", req.url)
        );

    return res;
}

export const config = {
    matcher: ["/dashboard/:path*", "/auth/:path*", "/invites/:path*"],
};
