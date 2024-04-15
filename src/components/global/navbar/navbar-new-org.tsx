"use client";

import { Icons } from "@/components/icons/icons";
import UploadEase from "@/components/svgs/UploadEase";
import { Link } from "@/components/ui/link";

function NavbarNewOrg() {
    return (
        <header className="bg-primary dark:border-b dark:bg-background">
            <nav className="flex h-11 items-center selection:bg-background-strict selection:text-foreground-strict">
                <div className="flex items-center gap-1 p-2 px-6 text-muted-foreground-strict">
                    <Link type="link" href="/dashboard">
                        <UploadEase className="size-9" />
                    </Link>

                    <Icons.chevronRight className="size-5" />

                    <p className="text-sm">Create an Organization</p>
                </div>
            </nav>
        </header>
    );
}

export default NavbarNewOrg;
