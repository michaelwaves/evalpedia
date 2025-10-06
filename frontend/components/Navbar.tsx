"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Beaker, FileText, Activity, ChevronLeft, ChevronRight, TestTube2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useSidebar } from "./SidebarProvider";

const navItems = [
    { href: "/evals", label: "Evals", icon: Beaker },
    { href: "/jobs", label: "Jobs", icon: Activity },
    { href: "/playground", label: "Playground", icon: TestTube2 },
    { href: "http://localhost:7575", label: "Logs", icon: FileText },
];

export function Navbar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const { collapsed, setCollapsed } = useSidebar();

    return (
        <>
            {/* Mobile Header */}
            <header className="lg:hidden border-b border-gray-200 dark:border-gray-800 bg-background sticky top-0 z-50">
                <div className="flex h-12 items-center justify-between px-4">
                    <Link href="/" className="flex items-center space-x-2">
                        <Beaker className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Evalpedia</span>
                    </Link>
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Menu className="h-4 w-4" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left">
                            <SheetHeader>
                                <SheetTitle>
                                    <div className="flex items-center space-x-2">
                                        <Beaker className="h-4 w-4" />
                                        <span className="text-sm">Evalpedia</span>
                                    </div>
                                </SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col space-y-1 mt-6">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            target={item.href.startsWith("http") ? "_blank" : "_self"}
                                            onClick={() => setOpen(false)}
                                        >
                                            <Button
                                                variant={pathname === item.href ? "secondary" : "ghost"}
                                                className="w-full justify-start gap-2 h-8 text-sm"
                                            >
                                                <Icon className="h-3.5 w-3.5" />
                                                {item.label}
                                            </Button>
                                        </Link>
                                    );
                                })}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </header>

            {/* Desktop Sidebar */}
            <aside
                className={cn(
                    "hidden lg:flex lg:fixed lg:inset-y-0 lg:z-50 lg:flex-col border-r border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/50",
                    collapsed ? "lg:w-14" : "lg:w-48"
                )}
            >
                <div className="flex h-12 items-center border-b border-gray-200 dark:border-gray-800 px-3">
                    {!collapsed ? (
                        <>
                            <Link href="/" className="flex items-center space-x-2 flex-1">
                                <Beaker className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Evalpedia</span>
                            </Link>
                            <button
                                onClick={() => setCollapsed(!collapsed)}
                                className="h-6 w-6 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-800 rounded"
                            >
                                <ChevronLeft className="h-3.5 w-3.5 text-gray-500" />
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="h-6 w-6 flex items-center justify-center mx-auto hover:bg-gray-200 dark:hover:bg-gray-800 rounded"
                        >
                            <ChevronRight className="h-3.5 w-3.5 text-gray-500" />
                        </button>
                    )}
                </div>
                <nav className="flex-1 px-2 py-3 space-y-0.5">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href}
                                target={item.href.startsWith("http") ? "_blank" : "_self"}
                            >
                                <div
                                    className={cn(
                                        "flex items-center rounded h-8 text-sm",
                                        collapsed ? "justify-center px-0" : "gap-2 px-2",
                                        isActive
                                            ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100"
                                    )}
                                >
                                    <Icon className="h-3.5 w-3.5 shrink-0" />
                                    {!collapsed && <span>{item.label}</span>}
                                </div>
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}
