import { SIGNIN_PAGE } from "@/config/const";
import { getUserFromCache } from "@/lib/redis/methods/user";
import { GenericProps } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PreferencePage from "./preference-page";

async function AccountFetch({ className, ...props }: GenericProps) {
    const cookieStore = cookies();

    const supabase = createServerComponentClient({
        cookies: () => cookieStore,
    });
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect(SIGNIN_PAGE);

    const cachedUser = await getUserFromCache(user.id);
    if (!cachedUser) redirect(SIGNIN_PAGE);

    return (
        <PreferencePage className={className} user={cachedUser} {...props} />
    );
}

export default AccountFetch;
