"use client";

import { Icons } from "@/components/icons/icons";
import { Separator } from "@/components/ui/separator";
import { VALID_VIDEO_UPLOAD_STEPS } from "@/config/const";
import { useVideoStore } from "@/lib/store/video";
import { cn } from "@/lib/utils";
import { CachedOrgClientData } from "@/lib/validation/cache/organization";
import { CachedTemplateData } from "@/lib/validation/cache/template";
import { GenericProps, VideoUploadStep } from "@/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import UploadVideoContainer from "./upload-video-container";
import UploadVideoForm from "./upload-video-form";

interface PageProps extends GenericProps {
    org: CachedOrgClientData & {
        template: CachedTemplateData | null;
    };
}

function UploadVideoPage({ className, org, ...props }: PageProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [currentStep, setCurrentStep] = useState<VideoUploadStep>(
        (searchParams.get("step") as VideoUploadStep | undefined) ??
            VALID_VIDEO_UPLOAD_STEPS[0]
    );

    const video = useVideoStore((state) => state.video);

    useEffect(() => {
        setCurrentStep(
            (searchParams.get("step") as VideoUploadStep | undefined) ??
                VALID_VIDEO_UPLOAD_STEPS[0]
        );

        if (!video && searchParams.get("step") !== "upload") {
            router.push(pathname + "?step=upload");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    return (
        <div
            className={cn("w-full max-w-5xl space-y-10 p-5 py-10", className)}
            {...props}
        >
            <div className="flex flex-col-reverse items-center gap-5 md:flex-row md:justify-between">
                <h2 className="text-lg font-semibold md:text-2xl">
                    {currentStep === "upload" && "Upload a Video"}
                    {currentStep === "meta" && "Add Metadata"}
                    {currentStep === "finish" && "Finalize"}
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
                        isActive: currentStep !== "upload",
                    })}

                    <Separator className="w-10" />

                    {generateStepBar({
                        label: "Finalize",
                        icon: "video",
                        isActive: currentStep === "finish",
                    })}
                </div>
            </div>

            <UploadVideoContainer />

            {video && <UploadVideoForm org={org} />}
        </div>
    );
}

export default UploadVideoPage;

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
