"use client";

import { useSupabase } from "@/hooks/useSupabase";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { HTMLAttributes } from "react";
import { toast } from "sonner";

interface LogoutButtonProps extends HTMLAttributes<HTMLButtonElement> {
    text?: string;
    redirectURL?: string;
    queryParams?: {
        [key: string]: string;
    };
}

function LogoutButton({ className, text, ...props }: LogoutButtonProps) {
    const router = useRouter();
    const { supabase } = useSupabase();

    const handleLogout = () => {
        supabase.auth.signOut({
            scope: "local",
        });
        toast.success("See you soon!");
        router.push("/");
        router.refresh();
    };

    return (
        <button
            className={cn("p-2 py-1 text-sm", className)}
            onClick={handleLogout}
            {...props}
        >
            {text || "Logout"}
        </button>
    );
}

export default LogoutButton;
