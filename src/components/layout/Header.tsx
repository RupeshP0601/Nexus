"use client";

import { UserButton } from "@clerk/nextjs";
import { Bell, Search, AlertTriangle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const pageTitles: Record<string, string> = {
    "/dashboard": "Command Center",
    "/accounts": "Account Intelligence",
    "/intelligence": "Signal Engine",
    "/agents": "AI Agent Console",
    "/governance": "RevOps Governance",
    "/settings": "Settings",
};

export function Header() {
    const pathname = usePathname();
    const [searchOpen, setSearchOpen] = useState(false);
    const pageTitle = pageTitles[pathname || "/dashboard"] || "Afors Smart Dart";

    // Command+K shortcut
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setSearchOpen(true);
                document.getElementById("global-search")?.focus();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-[#1E293B] bg-[#0F172A] px-6">
            {/* Left: Page Title */}
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold text-white tracking-tight">
                    {pageTitle}
                </h1>
            </div>

            {/* Center: Global Search */}
            <div className="flex items-center gap-4 flex-1 max-w-2xl mx-8">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        id="global-search"
                        type="text"
                        placeholder="Search accounts, opportunities, signals... (⌘K)"
                        className="w-full rounded-lg border border-[#1E293B] bg-[#1E293B]/50 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
                        onFocus={() => setSearchOpen(true)}
                        onBlur={() => setSearchOpen(false)}
                    />
                    {!searchOpen && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <kbd className="px-2 py-0.5 text-xs font-semibold text-slate-400 bg-[#0F172A] border border-[#1E293B] rounded">
                                ⌘K
                            </kbd>
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Notifications & User */}
            <div className="flex items-center gap-4">
                {/* SLA Alert Indicator */}
                <button className="relative p-2 rounded-lg hover:bg-[#1E293B] text-amber-500 transition-colors group">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-amber-500 text-[#0F172A] text-xs font-bold flex items-center justify-center">
                        3
                    </span>
                    <div className="absolute right-0 top-12 hidden group-hover:block w-48 p-2 bg-[#1E293B] border border-[#334155] rounded-lg shadow-xl">
                        <p className="text-xs text-slate-300 font-medium">3 SLA Breaches</p>
                        <p className="text-xs text-slate-400 mt-1">Leads require immediate action</p>
                    </div>
                </button>

                {/* Notifications */}
                <button className="relative p-2 rounded-lg hover:bg-[#1E293B] text-slate-400 hover:text-white transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#0F172A]"></span>
                </button>

                {/* User */}
                <UserButton
                    appearance={{
                        elements: {
                            avatarBox: "h-9 w-9 ring-2 ring-[#2563EB]"
                        }
                    }}
                />
            </div>
        </header>
    );
}
