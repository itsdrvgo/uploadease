"use client";

import TeamCollaboration from "@/../public/team_collaboration.png";
import { cn } from "@/lib/utils";
import { GenericProps } from "@/types";
import Image from "next/image";
import { Icons } from "../icons/icons";
import { CardBody, CardContainer, CardItem } from "../ui/3d-card";

interface ChallengeCard {
    title: string;
    description: string;
    icon: keyof typeof Icons;
}

const challenges: ChallengeCard[] = [
    {
        title: "Collaboration",
        description: "We'll help you manage your editorial workflow.",
        icon: "users",
    },
    {
        title: "Reviewing",
        description: "Easily review and approve content before publishing.",
        icon: "check",
    },
    {
        title: "Scheduling",
        description: "We'll help you schedule your content for publishing.",
        icon: "alarm",
    },
    {
        title: "Distribution",
        description: "We'll help you distribute your content across platforms.",
        icon: "globe",
    },
];

function Challenges({ className, ...props }: GenericProps) {
    return (
        <section
            className={cn("flex justify-center bg-primary-strict", className)}
            style={{
                backgroundImage: "url(./noise-light.png)",
            }}
            id="features"
            {...props}
        >
            <div className="flex max-w-7xl flex-col items-center justify-between p-5 py-10 pb-20 text-white lg:flex-row lg:gap-20">
                <div className="space-y-7 lg:basis-1/2 lg:space-y-10">
                    <div className="space-y-5 text-center selection:bg-background-strict selection:text-foreground-strict lg:text-start">
                        <h2
                            className="text-balance text-3xl font-bold lg:text-4xl"
                            id="how-it-works"
                        >
                            We&apos;re here to help you overcome your challenges
                        </h2>

                        <p className="text-sm text-muted-foreground-strict lg:text-base">
                            Managing your content all by yourself can be a
                            daunting task, but we got you covered. Explore some
                            of our customers&apos; top content management
                            challenges and how we help them overcome it.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 lg:gap-5">
                        {challenges.map((challenge) => {
                            return (
                                <ChallangeCard
                                    key={challenge.title.toLowerCase()}
                                    challenge={challenge}
                                />
                            );
                        })}
                    </div>
                </div>

                <div className="hidden selection:bg-background-strict selection:text-foreground-strict lg:inline-block lg:basis-1/2">
                    <CardContainer>
                        <CardBody className="group/card size-auto sm:w-[30rem]">
                            <CardItem translateZ="100">
                                <Image
                                    src={TeamCollaboration}
                                    className="group-hover/card:drop-shadow-xl"
                                    alt="UploadEase"
                                    width={600}
                                    height={600}
                                />
                            </CardItem>
                        </CardBody>
                    </CardContainer>
                </div>
            </div>
        </section>
    );
}

export default Challenges;

function ChallangeCard({
    challenge: { description, icon, title },
}: {
    challenge: ChallengeCard;
}) {
    const Icon = Icons[icon];

    return (
        <div
            key={title.toLowerCase()}
            className="group flex cursor-default flex-col items-center gap-4 rounded-xl bg-background-strict p-4 py-6 text-center text-foreground-strict shadow-md"
        >
            <div className="rounded-full bg-primary-strict p-5 shadow-md shadow-black/20 transition-all ease-in-out group-hover:-translate-y-1/2">
                <Icon className="size-5 text-white lg:size-6" />
            </div>

            <div className="space-y-2">
                <h4 className="text-base font-semibold lg:text-xl">{title}</h4>

                <p className="text-balance text-sm text-black/80 lg:text-base">
                    {description}
                </p>
            </div>
        </div>
    );
}
