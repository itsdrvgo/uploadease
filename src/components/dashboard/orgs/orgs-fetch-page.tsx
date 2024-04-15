import { SIGNIN_PAGE } from "@/config/const";
import { db } from "@/lib/drizzle";
import { memberships } from "@/lib/drizzle/schema";
import {
    OrgMembershipWithOrgAndCreatorClientData,
    orgMembershipWithOrgAndCreatorClientSchema,
} from "@/lib/validation/organizations";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import OrgViewPage from "./org-view-page";

async function OrgsFetchPage() {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({
        cookies: () => cookieStore,
    });

    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect(SIGNIN_PAGE);

    let parsedMemberships: OrgMembershipWithOrgAndCreatorClientData[] = [];

    const memships = await db.query.memberships.findMany({
        where: eq(memberships.userId, user.id),
        with: {
            organization: {
                with: {
                    creator: true,
                },
            },
        },
    });

    if (!!memships.length)
        parsedMemberships = z
            .array(orgMembershipWithOrgAndCreatorClientSchema)
            .parse(memships);

    return <OrgViewPage user={user} memberships={parsedMemberships} />;
}

export default OrgsFetchPage;
