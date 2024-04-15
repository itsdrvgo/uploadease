import Footer from "@/components/global/footer";
import Navbar from "@/components/global/navbar/navbar";
import NavbarMob from "@/components/global/navbar/navbar-mob";
import { LayoutProps } from "@/types";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Managing YouTube Videos Made Easy for Creators",
    description: "Manage your YouTube videos and channel with ease.",
};

export default function Layout({ children }: LayoutProps) {
    return (
        <>
            <div className="flex min-h-screen flex-col" data-overlay-container>
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
            </div>
            <NavbarMob />
        </>
    );
}
