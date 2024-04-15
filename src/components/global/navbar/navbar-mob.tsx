"use client";

import { Icons } from "@/components/icons/icons";
import { Link } from "@/components/ui/link";
import { menu } from "@/config/menu";
import { useSupabase } from "@/hooks/useSupabase";
import { useNavbarStore } from "@/lib/store/navbar";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import LoginButton from "../buttons/login-button";

function NavbarMob() {
    const isMenuOpen = useNavbarStore((state) => state.isOpen);
    const setIsMenuOpen = useNavbarStore((state) => state.setIsOpen);

    const { getUser } = useSupabase();

    const { data, isPending } = useQuery({
        queryKey: ["user"],
        queryFn: getUser,
    });

    useEffect(() => {
        if (typeof document === "undefined") return;

        if (isMenuOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "auto";
    }, [isMenuOpen]);

    return (
        <ul
            aria-label="Mobile Menu"
            data-menu-open={isMenuOpen}
            className={cn(
                "fixed inset-x-0 z-40 bg-primary-strict",
                "w-screen overflow-hidden px-4 py-3",
                "transition-all duration-500 ease-in-out",
                "h-0 data-[menu-open=true]:h-[calc(100vh-3.75rem)]",
                "-top-1/2 bottom-0 data-[menu-open=true]:top-[3.75rem]",
                "md:hidden"
            )}
            style={{
                backgroundImage: "url(./noise-light.png)",
            }}
        >
            {menu.map((item, index) => {
                const Icon = Icons[item.icon ?? "add"];

                return (
                    <li
                        key={index}
                        className="border-b"
                        aria-label="Mobile Menu Item"
                    >
                        <Link
                            type="link"
                            href={item.href}
                            className="flex items-center justify-between gap-2 px-2 py-5 text-white"
                            isExternal={item.isExternal}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <span>{item.title}</span>
                            <Icon className="size-5" />
                        </Link>
                    </li>
                );
            })}

            <li className="mt-5 space-y-3">
                {isPending ? null : !data ? (
                    <AuthButtonsMobile />
                ) : (
                    <Link
                        type="button"
                        href="/dashboard"
                        variant="outline"
                        size="lg"
                        className="w-full rounded-full text-lg text-white hover:bg-background-strict/10"
                    >
                        Dashboard
                    </Link>
                )}
            </li>
        </ul>
    );
}

export default NavbarMob;

function AuthButtonsMobile() {
    return (
        <>
            <LoginButton
                size="lg"
                variant="outline"
                className="w-full rounded-full text-lg text-white hover:bg-background-strict/10"
            />

            <LoginButton
                variant="destructive"
                size="lg"
                className={cn(
                    "w-full rounded-full shadow-none",
                    "boreder border-destructive-strict bg-destructive-strict hover:bg-destructive-strict/90",
                    "text-lg font-normal text-white"
                )}
                endContent={<Icons.externalLink className="size-4" />}
            >
                Try for Free
            </LoginButton>
        </>
    );
}
