import { SIGNIN_PAGE } from "@/config/const";
import { getOrganizationFromCache } from "@/lib/redis/methods/organization";
import { cachedOrgClientSchema } from "@/lib/validation/cache/organization";
import { GenericProps } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import OrgPage from "./org-page";

interface PageProps extends GenericProps {
    params: {
        orgId: string;
    };
}

async function OrgFetchPage({ className, params, ...props }: PageProps) {
    const { orgId } = params;

    const cookieStore = cookies();
    const supabase = createServerComponentClient({
        cookies: () => cookieStore,
    });

    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect(SIGNIN_PAGE);

    const org = await getOrganizationFromCache(orgId);
    if (!org) notFound();

    const isCreator = org.creatorId === user.id;

    const data = isCreator
        ? {
              type: "creator" as const,
              org: org,
          }
        : {
              type: "others" as const,
              org: cachedOrgClientSchema.parse(org),
          };

    return <OrgPage className={className} data={data} user={user} {...props} />;
}

export default OrgFetchPage;
