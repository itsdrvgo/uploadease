"use client";

import { cn } from "@/lib/utils";
import { GenericProps } from "@/types";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { User } from "../ui/user";

interface YouTuber {
    name: string;
    channel: string;
    image: string;
}

const youtuberItems: YouTuber[][] = [
    [
        {
            name: "Josh tried coding",
            channel: "@joshtriedcoding",
            image: "https://yt3.googleusercontent.com/BOomnT3SS1g-FQSUVBy51TaK2ylqbQzD8zeV783mM-W1q3MMbvE8jdjEeWwFqHmlm5Dk4dSAtg=s176-c-k-c0x00ffffff-no-rj",
        },
        {
            name: "Theo - t3.gg",
            channel: "@t3dotgg",
            image: "https://yt3.googleusercontent.com/4NapxEtLcHQ6wN2zA_DMmkOk47RFb_gy6sjSmUZGg_ARHjlIUjFsrNFddrcKMkTYpBNxCp3J=s176-c-k-c0x00ffffff-no-rj",
        },
        {
            name: "The Browser Company",
            channel: "@TheBrowserCompany",
            image: "https://yt3.googleusercontent.com/qSqmb9GaIyvWgVGFYGOJKIZ3SFHuUxeP9O5-4VkGReaIv4pYNkJiFPjAppvps0hyQ9JfUVBFQ5s=s176-c-k-c0x00ffffff-no-rj",
        },
        {
            name: "RoomieOfficial",
            channel: "@RoomieOfficial",
            image: "https://yt3.googleusercontent.com/JHQBFattn7RY5bDMKYImnXzm9QbnGaQebqMc42S8987890S7BRxu0Dsl8hNtTOT7SVWCUl-DFA=s176-c-k-c0x00ffffff-no-rj",
        },
        {
            name: "Daniel Thrasher",
            channel: "@danielthrasher",
            image: "https://yt3.googleusercontent.com/ytc/AIf8zZTIsKaNdN5MDoGE4onaeoXmhmUKZyxln0Vp4dux=s176-c-k-c0x00ffffff-no-rj",
        },
    ],
    [
        {
            name: "The Browser Company",
            channel: "@TheBrowserCompany",
            image: "https://yt3.googleusercontent.com/qSqmb9GaIyvWgVGFYGOJKIZ3SFHuUxeP9O5-4VkGReaIv4pYNkJiFPjAppvps0hyQ9JfUVBFQ5s=s176-c-k-c0x00ffffff-no-rj",
        },
        {
            name: "Theo - t3.gg",
            channel: "@t3dotgg",
            image: "https://yt3.googleusercontent.com/4NapxEtLcHQ6wN2zA_DMmkOk47RFb_gy6sjSmUZGg_ARHjlIUjFsrNFddrcKMkTYpBNxCp3J=s176-c-k-c0x00ffffff-no-rj",
        },
        {
            name: "Josh tried coding",
            channel: "@joshtriedcoding",
            image: "https://yt3.googleusercontent.com/BOomnT3SS1g-FQSUVBy51TaK2ylqbQzD8zeV783mM-W1q3MMbvE8jdjEeWwFqHmlm5Dk4dSAtg=s176-c-k-c0x00ffffff-no-rj",
        },
        {
            name: "Daniel Thrasher",
            channel: "@danielthrasher",
            image: "https://yt3.googleusercontent.com/ytc/AIf8zZTIsKaNdN5MDoGE4onaeoXmhmUKZyxln0Vp4dux=s176-c-k-c0x00ffffff-no-rj",
        },
        {
            name: "RoomieOfficial",
            channel: "@RoomieOfficial",
            image: "https://yt3.googleusercontent.com/JHQBFattn7RY5bDMKYImnXzm9QbnGaQebqMc42S8987890S7BRxu0Dsl8hNtTOT7SVWCUl-DFA=s176-c-k-c0x00ffffff-no-rj",
        },
    ],
];

function UserBranding({ className, ...props }: GenericProps) {
    return (
        <section
            className={cn("flex justify-center bg-primary-strict", className)}
            style={{
                backgroundImage: "url(./noise-light.png)",
            }}
            {...props}
        >
            <div className="max-w-7xl space-y-10 p-5 py-10 text-white md:py-20">
                <p className="px-5 text-center text-sm font-medium selection:bg-background-strict selection:text-foreground-strict md:px-0 md:text-base">
                    5,000+ creators trust UploadEase to manage their YouTube
                </p>

                <Carousel
                    opts={{
                        align: "center",
                        loop: true,
                    }}
                    plugins={[
                        Autoplay({
                            delay: 5000,
                        }),
                    ]}
                >
                    <CarouselContent className="cursor-grab">
                        {youtuberItems.map((youtubers, index) => (
                            <CarouselItem key={index}>
                                <div className="grid grid-cols-5 gap-5">
                                    {youtubers.map((youtuber, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-center p-2"
                                        >
                                            <User
                                                name={youtuber.name}
                                                description={youtuber.channel}
                                                avatar={{
                                                    src: youtuber.image,
                                                    alt: youtuber.name,
                                                }}
                                                classNames={{
                                                    container:
                                                        "selection:bg-background-strict selection:text-foreground-strict",
                                                    info: "hidden lg:inline-block",
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </section>
    );
}

export default UserBranding;
