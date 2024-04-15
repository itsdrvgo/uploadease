import { checkExistingMemberInOrganizationCache } from "@/lib/redis/methods/organization";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { createUploadthing, UploadThingError, UTApi } from "uploadthing/server";
import { z } from "zod";

const f = createUploadthing();
export const utapi = new UTApi();

export const customFileRouter = {
    thumbnail: f({
        "image/jpeg": {
            maxFileCount: 1,
            maxFileSize: "2MB",
        },
        "image/png": {
            maxFileCount: 1,
            maxFileSize: "2MB",
        },
    })
        .input(
            z.object({
                uploaderId: z.string(),
                orgId: z.string(),
            })
        )
        .middleware(async ({ input }) => {
            const { uploaderId, orgId } = input;

            const cookieStore = cookies();
            const supabase = createRouteHandlerClient({
                cookies: () => cookieStore,
            });

            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user)
                throw new UploadThingError({
                    code: "FORBIDDEN",
                    message: "You must be logged in to upload a thumbnail",
                });

            if (user.id !== uploaderId)
                throw new UploadThingError({
                    code: "FORBIDDEN",
                    message: "You can only upload thumbnails for yourself",
                });

            const isUserMember = await checkExistingMemberInOrganizationCache(
                orgId,
                uploaderId
            );
            if (!isUserMember)
                throw new UploadThingError({
                    code: "FORBIDDEN",
                    message:
                        "You must be a member of the organization to upload a thumbnail",
                });

            return {
                user,
            };
        })
        .onUploadComplete(() => {}),
};

export type CustomFileRouter = typeof customFileRouter;
