"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Building2,
    Radar,
    Bot,
    Shield,
    ChevronLeft,
    ChevronRight,
    Settings
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Accounts", href: "/accounts", icon: Building2 },
    { name: "Intelligence", href: "/intelligence", icon: Radar },
    { name: "AI Agents", href: "/agents", icon: Bot },
    { name: "Governance", href: "/governance", icon: Shield },
];

export function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div
            className={cn(
                "relative flex flex-col bg-[#0F172A] border-r border-[#1E293B] transition-all duration-300 ease-in-out",
                collapsed ? "w-16" : "w-60"
            )}
        >
            {/* Logo Area */}
            <div className="flex h-16 items-center justify-between px-4 border-b border-[#1E293B]">
                {collapsed ? (
                    <div className="flex items-center justify-center w-full">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center">
                            <span className="text-white font-bold text-lg">AN</span>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center">
                            <span className="text-white font-bold text-lg">AN</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-white tracking-tight">Afors Smart Dart</span>
                            <span className="text-xs text-slate-400">RevOps Platform</span>
                        </div>
                    </div>
                )}

                {!collapsed && (
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-1.5 rounded-md hover:bg-[#1E293B] text-slate-400 hover:text-white transition-colors"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Expand Button (when collapsed) */}
            {collapsed && (
                <button
                    onClick={() => setCollapsed(false)}
                    className="absolute top-20 -right-3 z-10 p-1 rounded-full bg-[#2563EB] text-white shadow-lg hover:bg-[#1D4ED8] transition-colors"
                >
                    <ChevronRight className="h-3 w-3" />
                </button>
            )}

            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-3">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-[#1E293B] text-white"
                                    : "text-slate-400 hover:bg-[#1E293B]/50 hover:text-white"
                            )}
                            title={collapsed ? item.name : undefined}
                        >
                            {/* Active indicator - left blue border */}
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#2563EB] rounded-r-full" />
                            )}

                            <item.icon className={cn(
                                "h-5 w-5 flex-shrink-0 transition-colors",
                                isActive ? "text-[#2563EB]" : "text-slate-400 group-hover:text-white"
                            )} />

                            {!collapsed && (
                                <span className="truncate">{item.name}</span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section - Settings & User */}
            <div className="border-t border-[#1E293B] p-3 space-y-2">
                {/* Settings */}
                <Link
                    href="/settings"
                    className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        pathname === "/settings"
                            ? "bg-[#1E293B] text-white"
                            : "text-slate-400 hover:bg-[#1E293B]/50 hover:text-white"
                    )}
                    title={collapsed ? "Settings" : undefined}
                >
                    <Settings className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && <span>Settings</span>}
                </Link>

                {/* User Profile */}
                <div className={cn(
                    "flex items-center gap-3 px-3 py-2",
                    collapsed && "justify-center"
                )}>
                    <UserButton
                        appearance={{
                            elements: {
                                avatarBox: "h-8 w-8"
                            }
                        }}
                    />
                    {!collapsed && (
                        <div className="flex flex-col min-w-0">
                            <span className="text-xs font-medium text-white truncate">Sales Director</span>
                            <span className="text-xs text-slate-400 truncate">Middle East BFSI</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
