import { getOrganizationFromCache } from "@/lib/redis/methods/organization";
import { getTemplateFromCache } from "@/lib/redis/methods/template";
import { cachedOrgClientSchema } from "@/lib/validation/cache/organization";
import { GenericProps } from "@/types";
import { notFound } from "next/navigation";
import UploadVideoPage from "./upload-video-page";

interface PageProps extends GenericProps {
    params: {
        orgId: string;
    };
}

async function UploadVideoFetch({ params, ...props }: PageProps) {
    const { orgId } = params;

    const org = await getOrganizationFromCache(orgId);
    if (!org) notFound();

    const template = await getTemplateFromCache(orgId);

    const parsedOrg = cachedOrgClientSchema.parse(org);

    return (
        <UploadVideoPage
            org={{
                ...parsedOrg,
                template,
            }}
            {...props}
        />
    );
}

export default UploadVideoFetch;
