"use client"

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarProvider";

export function MainContent({ children }: { children: ReactNode }) {
    const { collapsed } = useSidebar();

    return (
        <main
            className={cn(
                "flex-1",
                collapsed ? "lg:ml-14" : "lg:ml-48"
            )}
        >
            {children}
        </main>
    );
}
