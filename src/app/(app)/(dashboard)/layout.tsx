import SideNav from "@/components/layout/SideNav";
import React, { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex w-full min-h-screen max-h-screen overflow-x-hidden">
            <SideNav />
            <main className="flex-1 overflow-y-auto overflow-x-hidden">{children}</main>
        </div>
    )
}