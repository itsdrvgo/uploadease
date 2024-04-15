import { SIGNIN_PAGE } from "@/config/const";
import { getOrganizationFromCache } from "@/lib/redis/methods/organization";
import { getTemplateFromCache } from "@/lib/redis/methods/template";
import { cachedOrgClientSchema } from "@/lib/validation/cache/organization";
import { GenericProps } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import OrgSettingsPage from "./settings-page";

interface PageProps extends GenericProps {
    params: {
        orgId: string;
    };
}

async function SettingsFetchPage({ className, params, ...props }: PageProps) {
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

    const orgTemplate = await getTemplateFromCache(orgId);

    const isCreator = org.creatorId === user.id;

    const data = isCreator
        ? {
              type: "creator" as const,
              org: {
                  ...org,
                  template: orgTemplate,
              },
          }
        : {
              type: "others" as const,
              org: {
                  ...cachedOrgClientSchema.parse(org),
                  template: orgTemplate,
              },
          };

    return (
        <OrgSettingsPage
            className={className}
            data={data}
            user={user}
            {...props}
        />
    );
}

export default SettingsFetchPage;
