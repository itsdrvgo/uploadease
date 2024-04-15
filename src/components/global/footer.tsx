import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { GenericProps } from "@/types";
import CutOut from "../home/cutout";
import { Icons } from "../icons/icons";
import { Link } from "../ui/link";

interface SiteLink {
    title: string;
    href: string;
    icon: keyof typeof Icons;
}

const siteLinks: SiteLink[] = [
    {
        title: "YouTube",
        href: siteConfig.links?.youtube || "#",
        icon: "youtube",
    },
    {
        title: "Instagram",
        href: siteConfig.links?.instagram || "#",
        icon: "instagram",
    },
    {
        title: "X",
        href: siteConfig.links?.x || "#",
        icon: "x",
    },
    {
        title: "Discord",
        href: siteConfig.links?.discord || "#",
        icon: "discord",
    },
];

function Footer({ className, ...props }: GenericProps) {
    return (
        <>
            <CutOut isReversed />

            <footer
                className={cn(
                    "flex justify-center bg-primary-strict",
                    className
                )}
                style={{
                    backgroundImage: "url(./noise-light.png)",
                }}
                {...props}
            >
                <div className="flex w-full max-w-7xl flex-col items-center gap-5 p-5 pt-7 text-white selection:bg-background-strict selection:text-foreground-strict md:flex-row md:justify-between md:py-10">
                    <p>
                        &copy; {new Date().getFullYear()} UploadEase. All rights
                        reserved.
                    </p>

                    <div className="flex items-center gap-2">
                        {siteLinks.map((siteLink, index) => {
                            const Icon = Icons[siteLink.icon];

                            return (
                                <Link
                                    type="button"
                                    key={index}
                                    href={siteLink.href}
                                    size="icon"
                                    className="rounded-full bg-background-strict hover:scale-105 hover:bg-white hover:shadow-lg hover:shadow-black/20"
                                >
                                    <Icon className="size-4 text-primary" />
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </footer>
        </>
    );
}

export default Footer;
