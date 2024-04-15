import NavbarDash from "@/components/global/navbar/navbar-dash";
import Sidebar from "@/components/global/sidebar/sidebar";
import { siteConfig } from "@/config/site";
import { LayoutProps } from "@/types";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        default: "Preferences",
        template: "%s | " + siteConfig.name,
    },
    description: "Manage your account settings and preferences.",
};

function Layout({ children }: LayoutProps) {
    return (
        <div className="h-screen flex-1 basis-0">
            <div className="flex h-full">
                <Sidebar />

                <div className="flex h-screen flex-1 flex-col">
                    <NavbarDash />

                    <main className="flex-1 bg-background">{children}</main>
                </div>
            </div>
        </div>
    );
}

export default Layout;
