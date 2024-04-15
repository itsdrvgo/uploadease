import UploadVideoFetch from "@/components/dashboard/orgs/org/videos/upload/upload-video-fetch";
import NavbarDynamic from "@/components/global/navbar/navbar-dynamic";
import Sidebar from "@/components/global/sidebar/sidebar";
import { Metadata } from "next";
import { Suspense } from "react";

interface PageProps {
    params: {
        orgId: string;
    };
}

export const metadata: Metadata = {
    title: "Upload a Video",
    description: "Upload a video to your organization's library",
};

function Page({ params }: PageProps) {
    return (
        <>
            <Sidebar params={params} />

            <div className="ml-14 flex flex-1 flex-col md:ml-[4.5rem]">
                <NavbarDynamic params={params} />

                <section className="flex justify-center bg-background">
                    <Suspense fallback={<div>Loading...</div>}>
                        <UploadVideoFetch params={params} />
                    </Suspense>
                </section>
            </div>
        </>
    );
}

export default Page;
