"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { HTMLAttributes } from "react";
import { Icons } from "../../icons/icons";

function ThemeSwitch({
    className,
    ...props
}: HTMLAttributes<HTMLButtonElement>) {
    const { theme, setTheme } = useTheme();
    const Icon = Icons[theme === "dark" ? "sun" : "moon"];

    return (
        <button
            className={cn(
                "flex w-full items-center gap-2 p-2 py-1 text-sm text-muted-foreground hover:text-white",
                "transition-all ease-in-out",
                className
            )}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            {...props}
        >
            <div>
                <Icon className="size-4" />
            </div>
            <span>Switch to {theme === "dark" ? "light" : "dark"} mode</span>
        </button>
    );
}

export default ThemeSwitch;
