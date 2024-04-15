import { SIGNIN_PAGE } from "@/config/const";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import NewOrgForm from "../../forms/new-org-form";

async function NewOrgUserFetch() {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({
        cookies: () => cookieStore,
    });

    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect(SIGNIN_PAGE);

    return <NewOrgForm user={user} />;
}

export default NewOrgUserFetch;
