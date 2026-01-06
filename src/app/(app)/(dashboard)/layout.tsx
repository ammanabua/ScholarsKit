'use client'
import SideNav from "@/components/layout/SideNav";
import React, { ReactNode, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    // Client-side auth check - handles browser back button after logout
    useEffect(() => {
        if (!isLoading && !user) {
            router.replace('/sign-in');
        }
    }, [user, isLoading, router]);

    // Show nothing while checking auth (prevents flash of content)
    if (isLoading) {
        return (
            <div className="flex w-full h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    // If no user, don't render the dashboard (redirect is happening)
    if (!user) {
        return null;
    }

    return (
        <div className="flex w-full h-screen overflow-hidden">
            <SideNav />
            <main className="flex-1 overflow-y-auto overflow-x-hidden">{children}</main>
        </div>
    )
}