import { cn } from "@/lib/utils";
import { GenericProps } from "@/types";
import { Suspense } from "react";
import NavbarDynamicFetch from "./navbar-dynamic-fetch";

interface PageProps extends GenericProps {
    params: {
        orgId: string;
    };
}

function NavbarDynamic({ className, params, ...props }: PageProps) {
    return (
        <header
            className={cn("border-b bg-primary dark:bg-background", className)}
            {...props}
        >
            <nav className="flex h-11 items-center selection:bg-background selection:text-black dark:selection:bg-foreground">
                <Suspense>
                    <NavbarDynamicFetch params={params} />
                </Suspense>
            </nav>
        </header>
    );
}

export default NavbarDynamic;
