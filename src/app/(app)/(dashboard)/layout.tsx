import SideNav from "@/components/layout/SideNav";
import React, { ReactNode } from "react";


export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <SideNav />
            {children}
        </>
    )
}