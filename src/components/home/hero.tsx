"use client";

import HeroNetwork from "@/../public/hero_network.png";
import { cn } from "@/lib/utils";
import { GenericProps } from "@/types";
import Image from "next/image";
import LoginButton from "../global/buttons/login-button";
import { Icons } from "../icons/icons";
import UploadEase from "../svgs/UploadEase";

function Hero({ className, ...props }: GenericProps) {
    return (
        <section
            className={cn("flex justify-center bg-primary-strict", className)}
            style={{
                backgroundImage: "url(./noise-light.png)",
            }}
            {...props}
        >
            <div
                className={cn(
                    "flex flex-col-reverse items-center justify-between gap-5 md:flex-row md:gap-10",
                    "max-w-7xl p-5 py-10 pb-20 md:py-20",
                    "selection:bg-background-strict selection:text-foreground-strict"
                )}
            >
                <div className="basis-1/2 space-y-7 text-white md:space-y-10">
                    <h1 className="text-center text-4xl font-bold md:text-start md:text-5xl md:leading-tight lg:text-6xl lg:leading-tight">
                        &ldquo;Upload
                        <span className="text-red-500 drop-shadow-md selection:bg-white/20 selection:text-red-500">
                            Ease
                        </span>
                        : The Ultimate Choice for YouTube Creators&rdquo;
                    </h1>

                    <p className="text-center text-base text-white/80 md:text-start md:text-xl lg:text-2xl">
                        Simplify your YouTube workflow with UploadEase.
                        Collaborate, schedule, and upload effortlessly. Get
                        started today!
                    </p>

                    <div className="space-y-7 md:space-y-5">
                        <div className="flex justify-center gap-3 md:justify-start">
                            <LoginButton
                                className={cn(
                                    "hover:scale-105 hover:shadow-black/20",
                                    "bg-background-strict text-primary-strict hover:bg-background-strict"
                                )}
                            >
                                Get Started
                            </LoginButton>

                            <LoginButton
                                variant="destructive"
                                endContent={
                                    <Icons.externalLink className="size-4" />
                                }
                                className={cn(
                                    "hover:scale-105 hover:shadow-black/20",
                                    "bg-destructive-strict text-background-strict hover:bg-destructive-strict"
                                )}
                            >
                                Try for Free
                            </LoginButton>
                        </div>

                        <p className="text-center text-sm text-muted-foreground-strict md:text-start">
                            Get started with a free account. No credit card
                            required.
                        </p>
                    </div>
                </div>

                <div className="md:hidden">
                    <UploadEase height={100} width={100} />
                </div>

                <div className="pointer-events-none hidden md:inline-block">
                    <Image
                        src={HeroNetwork.src}
                        alt="Hero image"
                        width={600}
                        height={600}
                        priority
                        className="drop-shadow-md"
                    />
                </div>
            </div>
        </section>
    );
}

export default Hero;
