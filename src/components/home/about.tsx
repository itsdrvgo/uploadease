import AboutUE from "@/../public/about_ue.png";
import { cn } from "@/lib/utils";
import { GenericProps } from "@/types";
import Image from "next/image";
import LoginButton from "../global/buttons/login-button";
import { Icons } from "../icons/icons";
import { CardBody, CardContainer, CardItem } from "../ui/3d-card";

function About({ className, ...props }: GenericProps) {
    return (
        <section
            className={cn(
                "flex justify-center bg-background-strict",
                className
            )}
            {...props}
        >
            <div
                className={cn(
                    "flex w-full max-w-7xl flex-col-reverse items-center justify-between gap-10 p-5 py-16 md:flex-row md:py-32"
                )}
            >
                <CardContainer>
                    <CardBody className="group/card relative size-auto">
                        <CardItem translateZ="100">
                            <Image
                                src={AboutUE}
                                className="group-hover/card:drop-shadow-xl"
                                alt="UploadEase"
                                width={600}
                                height={400}
                            />
                        </CardItem>
                    </CardBody>
                </CardContainer>

                <div className="space-y-5 text-center md:basis-1/2 md:space-y-10 md:text-start">
                    <h2 className="text-3xl font-bold text-foreground-strict md:text-4xl">
                        What is Upload
                        <span className="text-primary-strict">Ease</span>?
                    </h2>

                    <div className="space-y-3 text-sm text-foreground-strict md:space-y-5 md:text-base">
                        <p>
                            UploadEase streamlines collaboration between
                            creators and editors, providing an all-in-one
                            solution for optimizing your YouTube channel. With
                            integrated software and resources, our platform
                            simplifies content creation, prioritizing audience
                            growth.
                        </p>
                        <p>
                            Get started with UploadEase for free and unlock a
                            world of possibilities for your YouTube channel.
                        </p>
                    </div>

                    <div className="flex justify-center gap-3 md:justify-start">
                        <LoginButton
                            size="lg"
                            className={cn(
                                "hover:scale-105 hover:shadow-black/20",
                                "bg-background-strict text-primary-strict hover:bg-background-strict"
                            )}
                        >
                            Get Started
                        </LoginButton>

                        <LoginButton
                            variant="destructive"
                            size="lg"
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
                </div>
            </div>
        </section>
    );
}

export default About;
