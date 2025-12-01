import SideNav from "@/components/layout/SideNav";
import React, { ReactNode } from "react";
import { ToastContainer } from "react-toastify";


export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <ToastContainer toastClassName="text-[13px] font-inter font-[500]" />
            <SideNav />
            {children}
        </>
    )
}