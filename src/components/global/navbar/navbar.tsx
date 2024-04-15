"use client";

import { Icons } from "@/components/icons/icons";
import UploadEase from "@/components/svgs/UploadEase";
import { Link } from "@/components/ui/link";
import { menu } from "@/config/menu";
import { siteConfig } from "@/config/site";
import { useSupabase } from "@/hooks/useSupabase";
import { useNavbarStore } from "@/lib/store/navbar";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import LoginButton from "../buttons/login-button";

function Navbar() {
    const [isMenuHidden, setIsMenuHidden] = useState(false);
    const isMenuOpen = useNavbarStore((state) => state.isOpen);
    const setIsMenuOpen = useNavbarStore((state) => state.setIsOpen);

    const { getUser } = useSupabase();
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;

        if (latest > previous && latest > 150) setIsMenuHidden(true);
        else setIsMenuHidden(false);
    });

    const { data, isPending } = useQuery({
        queryKey: ["user"],
        queryFn: getUser,
    });

    return (
        <>
            <motion.header
                variants={{
                    visible: {
                        y: 0,
                    },
                    hidden: {
                        y: "-100%",
                    },
                }}
                animate={isMenuHidden ? "hidden" : "visible"}
                transition={{
                    duration: 0.35,
                    ease: "easeInOut",
                }}
                className="sticky inset-x-0 top-0 z-50 flex h-auto w-full items-center justify-center bg-primary-strict px-4 py-3 backdrop-blur-md backdrop-saturate-100 md:py-4"
                style={{
                    backgroundImage: "url(./noise-light.png)",
                }}
                data-menu-open={isMenuOpen}
            >
                <nav className="flex w-full max-w-7xl justify-between gap-5">
                    <div className="flex items-center gap-10">
                        <Link
                            type="link"
                            href="/"
                            className="flex items-center gap-2 md:gap-3"
                        >
                            <UploadEase className="size-9 md:size-10" />
                            <h4 className="text-base font-bold text-white md:text-xl">
                                {siteConfig.name}
                            </h4>
                        </Link>

                        <div className="hidden gap-1 sm:flex md:gap-4">
                            {!!menu.length &&
                                menu.map((item, index) => (
                                    <div key={index}>
                                        <Link
                                            type="button"
                                            variant="ghost"
                                            className={cn(
                                                "text-sm font-medium text-background-strict",
                                                "hover:scale-105 hover:bg-white/20 hover:text-background-strict",
                                                "hover:shadow-md",
                                                "h-auto px-4 py-[6px]"
                                            )}
                                            href={item.href}
                                            isExternal={item.isExternal}
                                            showAnchorIcon={
                                                item.isAnchorVisible
                                            }
                                        >
                                            {item.title}
                                        </Link>
                                    </div>
                                ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-end">
                        <button
                            aria-label="Mobile Menu Toggle Button"
                            aria-pressed={isMenuOpen}
                            className="sm:hidden"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <Icons.menu className="size-6 text-background-strict" />
                        </button>

                        {isPending ? null : !data ? (
                            <AuthButtons />
                        ) : (
                            <Link
                                type="button"
                                href="/dashboard"
                                size="sm"
                                className={cn(
                                    "hover:scale-105 hover:shadow-black/20",
                                    "bg-background-strict text-primary-strict hover:bg-background-strict",
                                    "hidden px-4 sm:inline-flex"
                                )}
                            >
                                Dashboard
                            </Link>
                        )}
                    </div>
                </nav>
            </motion.header>
        </>
    );
}

export default Navbar;

function AuthButtons() {
    return (
        <div className="hidden items-center gap-2 sm:flex">
            <LoginButton
                size="sm"
                variant="destructive"
                endContent={<Icons.externalLink className="size-4" />}
                className={cn(
                    "hover:scale-105 hover:shadow-black/20",
                    "bg-destructive-strict text-background-strict hover:bg-destructive-strict",
                    "px-4"
                )}
            >
                Try for Free
            </LoginButton>

            <LoginButton
                size="sm"
                className={cn(
                    "hover:scale-105 hover:shadow-black/20",
                    "bg-background-strict text-primary-strict hover:bg-background-strict",
                    "px-4"
                )}
            />
        </div>
    );
}
