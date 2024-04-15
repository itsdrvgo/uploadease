import { SIGNIN_PAGE } from "@/config/const";
import { getOrganizationFromCache } from "@/lib/redis/methods/organization";
import { getUserFromCache } from "@/lib/redis/methods/user";
import { cachedOrgClientSchema } from "@/lib/validation/cache/organization";
import { cachedUserClientSchema } from "@/lib/validation/cache/user";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { EmptyPlaceholder } from "../ui/empty-placeholder";
import { Link } from "../ui/link";
import InviteAccept from "./invite-accept";

interface PageProps {
    params: {
        orgId: string;
        inviteCode: string;
    };
}

async function InviteValidatePage({ params }: PageProps) {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({
        cookies: () => cookieStore,
    });

    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect(SIGNIN_PAGE);

    const org = await getOrganizationFromCache(params.orgId);
    if (!org) return <NoOrgPage />;
    if (org.inviteCode !== params.inviteCode) return <NoOrgPage />;

    const creator = await getUserFromCache(org.creatorId);
    if (!creator) return <NoOrgPage />;

    const parsedOrg = cachedOrgClientSchema.parse(org);
    const parsedCreator = cachedUserClientSchema
        .omit({
            email: true,
        })
        .parse(creator);

    return (
        <InviteAccept
            params={params}
            user={user}
            org={parsedOrg}
            creator={parsedCreator}
        />
    );
}

export default InviteValidatePage;

function NoOrgPage() {
    return (
        <EmptyPlaceholder
            title="Organization not found"
            description="The organization you're trying to join doesn't exist. Please check the invite link and try again."
            icon="warning"
            endContent={
                <Link type="button" href="/" size="sm">
                    Go to Home
                </Link>
            }
        />
    );
}
