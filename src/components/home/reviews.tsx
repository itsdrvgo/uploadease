"use client";

import { cn } from "@/lib/utils";
import { GenericProps } from "@/types";
import { Meteors } from "../ui/meteors";
import { User } from "../ui/user";

interface ReviewCard {
    name: string;
    channel: string;
    content: string;
    image: string;
}

const reviews: ReviewCard[] = [
    {
        name: "Josh tried coding",
        channel: "@joshtriedcoding",
        content:
            "I am a content creator and I have been using UploadEase for a while now. It has been a great experience for me. I have been able to manage my content with ease and it has helped me grow my channel.",
        image: "https://yt3.googleusercontent.com/BOomnT3SS1g-FQSUVBy51TaK2ylqbQzD8zeV783mM-W1q3MMbvE8jdjEeWwFqHmlm5Dk4dSAtg=s176-c-k-c0x00ffffff-no-rj",
    },
    {
        name: "Theo - t3.gg",
        channel: "@t3dotgg",
        content:
            "What I love about UploadEase is that it is very easy to use. Never have I ever had any issues with it. It has been a great experience for me and I would recommend it to anyone.",
        image: "https://yt3.googleusercontent.com/4NapxEtLcHQ6wN2zA_DMmkOk47RFb_gy6sjSmUZGg_ARHjlIUjFsrNFddrcKMkTYpBNxCp3J=s176-c-k-c0x00ffffff-no-rj",
    },
    {
        name: "The Browser Company",
        channel: "@TheBrowserCompany",
        content:
            "Damn! This is the best content management tool I have ever used. What are you waiting for? Go get it now and thank me later.",
        image: "https://yt3.googleusercontent.com/qSqmb9GaIyvWgVGFYGOJKIZ3SFHuUxeP9O5-4VkGReaIv4pYNkJiFPjAppvps0hyQ9JfUVBFQ5s=s176-c-k-c0x00ffffff-no-rj",
    },
    {
        name: "RoomieOfficial",
        channel: "@RoomieOfficial",
        content:
            "The easiest way to manage your content. I've 3 editors and 2 writers and we all use UploadEase. It has been a great experience for us. The platform is very easy to use and it has helped us grow our channel. I would recommend it to anyone.",
        image: "https://yt3.googleusercontent.com/JHQBFattn7RY5bDMKYImnXzm9QbnGaQebqMc42S8987890S7BRxu0Dsl8hNtTOT7SVWCUl-DFA=s176-c-k-c0x00ffffff-no-rj",
    },
    {
        name: "Daniel Thrasher",
        channel: "@danielthrasher",
        content:
            "Even though I am a musician, I have been using UploadEase to manage my content. All I can say is that it has been a great experience for me. I would recommend it to anyone.",
        image: "https://yt3.googleusercontent.com/ytc/AIf8zZTIsKaNdN5MDoGE4onaeoXmhmUKZyxln0Vp4dux=s176-c-k-c0x00ffffff-no-rj",
    },
    {
        name: "Josh tried coding",
        channel: "@joshtriedcoding",
        content:
            "I am a content creator and I have been using UploadEase for a while now. It has been a great experience for me. I have been able to manage my content with ease and it has helped me grow my channel.",
        image: "https://yt3.googleusercontent.com/BOomnT3SS1g-FQSUVBy51TaK2ylqbQzD8zeV783mM-W1q3MMbvE8jdjEeWwFqHmlm5Dk4dSAtg=s176-c-k-c0x00ffffff-no-rj",
    },
    {
        name: "Theo - t3.gg",
        channel: "@t3dotgg",
        content:
            "What I love about UploadEase is that it is very easy to use. Never have I ever had any issues with it. It has been a great experience for me and I would recommend it to anyone. I have been able to manage my content with ease and it has helped me grow my channel. I would recommend it to anyone. Do not hesitate to get started with UploadEase.",
        image: "https://yt3.googleusercontent.com/4NapxEtLcHQ6wN2zA_DMmkOk47RFb_gy6sjSmUZGg_ARHjlIUjFsrNFddrcKMkTYpBNxCp3J=s176-c-k-c0x00ffffff-no-rj",
    },
    {
        name: "The Browser Company",
        channel: "@TheBrowserCompany",
        content:
            "Damn! This is the best content management tool I have ever used. What are you waiting for? Go get it now and thank me later.",
        image: "https://yt3.googleusercontent.com/qSqmb9GaIyvWgVGFYGOJKIZ3SFHuUxeP9O5-4VkGReaIv4pYNkJiFPjAppvps0hyQ9JfUVBFQ5s=s176-c-k-c0x00ffffff-no-rj",
    },
    {
        name: "RoomieOfficial",
        channel: "@RoomieOfficial",
        content:
            "The easiest way to manage your content. I've 3 editors and 2 writers and we all use UploadEase. It has been a great experience for us.",
        image: "https://yt3.googleusercontent.com/JHQBFattn7RY5bDMKYImnXzm9QbnGaQebqMc42S8987890S7BRxu0Dsl8hNtTOT7SVWCUl-DFA=s176-c-k-c0x00ffffff-no-rj",
    },
    {
        name: "Daniel Thrasher",
        channel: "@danielthrasher",
        content:
            "Even though I am a musician, I have been using UploadEase to manage my content. All I can say is that it has been a great experience for me. I would recommend it to anyone.",
        image: "https://yt3.googleusercontent.com/ytc/AIf8zZTIsKaNdN5MDoGE4onaeoXmhmUKZyxln0Vp4dux=s176-c-k-c0x00ffffff-no-rj",
    },
];

function Reviews({ className, ...props }: GenericProps) {
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
                    "flex w-full max-w-7xl flex-col items-center gap-14 p-5 pb-10 pt-20 md:py-20"
                )}
            >
                <div className="space-y-2">
                    <h2 className="text-center text-4xl font-bold text-foreground-strict">
                        What our customers are saying
                    </h2>

                    <p className="max-w-2xl text-balance text-center text-black/80">
                        We are proud to have helped many businesses and
                        individuals with their content management needs. Here
                        are some of the reviews from our customers.
                    </p>
                </div>

                <div className="grid cursor-default grid-cols-1 gap-4 md:auto-rows-auto md:grid-cols-3">
                    {reviews.map((reviewer, index) => (
                        <div
                            key={index}
                            className={cn(
                                "group relative",
                                index === 3 || index === 6
                                    ? "md:col-span-2"
                                    : ""
                            )}
                        >
                            <div className="absolute inset-0 size-full scale-[0.80] rounded-full bg-black/20 opacity-0 blur-3xl transition-all ease-in-out group-hover:opacity-100" />

                            <div
                                className={cn(
                                    "relative flex h-full flex-col items-start justify-between gap-10 overflow-hidden rounded-xl bg-background-strict p-5 text-foreground-strict shadow-md"
                                )}
                                style={{
                                    backgroundImage: "url(./noise-light.png)",
                                }}
                            >
                                <p>{reviewer.content}</p>

                                <User
                                    name={reviewer.name}
                                    description={reviewer.channel}
                                    avatar={{
                                        src: reviewer.image,
                                        alt: reviewer.name,
                                    }}
                                    classNames={{
                                        description: "text-black/80",
                                    }}
                                />

                                <Meteors
                                    number={20}
                                    className="hidden group-hover:block"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Reviews;
