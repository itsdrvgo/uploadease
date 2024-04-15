import NavbarNewOrg from "@/components/global/navbar/navbar-new-org";
import { siteConfig } from "@/config/site";
import { LayoutProps } from "@/types";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        default: "Create New Organization",
        template: "%s | " + siteConfig.name,
    },
    description: "Create a new organization to manage your projects and teams.",
};

function Layout({ children }: LayoutProps) {
    return (
        <>
            <NavbarNewOrg />
            <main className="flex flex-1 flex-col bg-background">
                {children}
            </main>
        </>
    );
}

export default Layout;
