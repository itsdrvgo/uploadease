import NavbarDynamic from "@/components/global/navbar/navbar-dynamic";
import Sidebar from "@/components/global/sidebar/sidebar";
import { Metadata } from "next";

interface PageProps {
    params: {
        orgId: string;
    };
}

export const metadata: Metadata = {
    title: "Videos",
    description: "View and manage videos in your organization",
};

function Page({ params }: PageProps) {
    return (
        <>
            <Sidebar params={params} />

            <div className="flex h-screen flex-1 flex-col overflow-y-auto">
                <NavbarDynamic params={params} />

                <section className="flex flex-1 justify-center bg-background">
                    hello
                </section>
            </div>
        </>
    );
}

export default Page;
