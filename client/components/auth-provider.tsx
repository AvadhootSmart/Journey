"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useUser from "@/store/user-store";
import { getMe } from "@/api/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { token, user, setUser, setToken } = useUser();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const fetchUser = async () => {
            if (token && !user) {
                try {
                    const userData = await getMe(token);
                    if (userData) {
                        setUser(userData);
                    } else {
                        // If getMe returns undefined (handled in catch), it might be 403
                        // The getMe function in api/auth/index.ts catches error but doesn't throw or return specific status
                        // Let's refine getMe or handle it here
                    }
                } catch (error: any) {
                    if (error.response?.status === 403) {
                        setToken(null);
                        setUser(null);
                        if (pathname !== "/") {
                            router.push("/");
                        }
                    }
                }
            }
        };

        fetchUser();
    }, [token, user, setUser, setToken, router, pathname]);

    return <>{children}</>;
}
