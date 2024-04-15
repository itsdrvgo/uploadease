import { SIGNIN_PAGE } from "@/config/const";
import { getOrganizationFromCache } from "@/lib/redis/methods/organization";
import { cn } from "@/lib/utils";
import { GenericProps } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

interface PageProps extends GenericProps {
    params: {
        orgId: string;
    };
}

async function NavbarDynamicFetch({ className, params, ...props }: PageProps) {
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

    return (
        <div className={cn("p-2 px-6", className)} {...props}>
            <p className="text-sm text-muted-foreground-strict">{org.name}</p>
        </div>
    );
}

export default NavbarDynamicFetch;
