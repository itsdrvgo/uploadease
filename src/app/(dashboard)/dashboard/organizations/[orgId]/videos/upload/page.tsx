import UploadVideoFetch from "@/components/dashboard/orgs/org/videos/upload/upload-video-fetch";
import NavbarDynamic from "@/components/global/navbar/navbar-dynamic";
import Sidebar from "@/components/global/sidebar/sidebar";
import { Icons } from "@/components/icons/icons";
import { Separator } from "@/components/ui/separator";
import Skeleton from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
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
                    <Suspense fallback={<UploadVideoSkeleton />}>
                        <UploadVideoFetch params={params} />
                    </Suspense>
                </section>
            </div>
        </>
    );
}

export default Page;

function UploadVideoSkeleton() {
    return (
        <div className="w-full max-w-5xl space-y-10 p-5 py-10">
            <div className="flex flex-col-reverse items-center gap-5 md:flex-row md:justify-between">
                <h2 className="text-lg font-semibold md:text-2xl">
                    Upload a Video
                </h2>

                <div className="flex items-center gap-2">
                    {generateStepBar({
                        label: "Upload",
                        icon: "upload",
                        isActive: true,
                    })}

                    <Separator className="w-10" />

                    {generateStepBar({
                        label: "Metadata",
                        icon: "info",
                        isActive: false,
                    })}

                    <Separator className="w-10" />

                    {generateStepBar({
                        label: "Finalize",
                        icon: "video",
                        isActive: false,
                    })}
                </div>
            </div>

            <Skeleton className="aspect-video w-full rounded-xl" />
        </div>
    );
}

function generateStepBar({
    label,
    icon,
    isActive = false,
}: {
    label: string;
    icon: keyof typeof Icons;
    isActive: boolean;
}) {
    const Icon = Icons[icon];

    return (
        <div className="flex items-center gap-2 text-sm">
            <div
                className={cn(
                    "rounded-full p-2 text-white",
                    "border border-accent",
                    isActive
                        ? "bg-accent"
                        : "bg-transparent text-accent dark:text-background-strict"
                )}
            >
                <Icon className="size-4" />
            </div>
            <p className="hidden md:inline-block">{label}</p>
        </div>
    );
}
