"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { useSupabase } from "@/hooks/useSupabase";
import { supabase } from "@/lib/supabase";
import { cn, getAbsoluteURL } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface LoginButtonProps extends ButtonProps {
    redirectURL?: string;
    queryParams?: {
        [key: string]: string;
    };
}

function LoginButton({
    className,
    children,
    redirectURL = getAbsoluteURL("/auth/callback"),
    queryParams,
    ...props
}: LoginButtonProps) {
    const router = useRouter();
    const { getUser } = useSupabase();

    const { data, isPending } = useQuery({
        queryKey: ["user"],
        queryFn: getUser,
    });

    const handleLogin = () => {
        if (isPending)
            return toast.error("An error occurred. Please try again later.");

        if (data) router.push("/dashboard");
        else
            supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: redirectURL,
                    queryParams,
                },
            });
    };

    return (
        <Button
            className={cn("text-primary", className)}
            onClick={handleLogin}
            {...props}
        >
            {children || "Sign In"}
        </Button>
    );
}

export default LoginButton;
