"use client";

import { generatePathTitle } from "@/lib/utils";
import { usePathname } from "next/navigation";

function NavbarDash() {
    const pathname = usePathname();

    return (
        <header className="border-b bg-primary dark:bg-background">
            <nav className="flex h-11 items-center selection:bg-white selection:text-black">
                <div className="p-2 px-6">
                    <p className="text-sm text-muted-foreground-strict">
                        {generatePathTitle(pathname)}
                    </p>
                </div>
            </nav>
        </header>
    );
}

export default NavbarDash;
