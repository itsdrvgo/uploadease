import { LayoutProps } from "@/types";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Invitation",
    description: "Accept an invitation to join an organization.",
};

function Layout({ children }: LayoutProps) {
    return (
        <main
            className="flex-1 bg-primary dark:bg-background"
            style={{
                backgroundImage: "url(../../../noise-light.png)",
            }}
        >
            {children}
        </main>
    );
}

export default Layout;
