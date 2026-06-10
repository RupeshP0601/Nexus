"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Signal {
    id: string;
    type: string;
    description: string | null;
    createdAt: Date;
}

interface SurgingAccount {
    id: string;
    name: string;
    industry: string;
    country: string | null;
    totalScore: number;
    signals: Signal[];
}

const countryFlags: Record<string, string> = {
    UAE: "🇦🇪",
    KSA: "🇸🇦",
    Qatar: "🇶🇦",
    Bahrain: "🇧🇭",
    Kuwait: "🇰🇼",
    Oman: "🇴🇲",
};

const industryColors = {
    BFSI: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    Telecom: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

export function SurgingAccounts() {
    const [accounts, setAccounts] = useState<SurgingAccount[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const response = await fetch("/api/accounts?surging=true&limit=5");
                if (response.ok) {
                    const data = await response.json();
                    setAccounts(data);
                }
            } catch (error) {
                console.error("Failed to fetch surging accounts:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAccounts();
    }, []);

    if (isLoading) {
        return (
            <div className="rounded-lg border border-[#1E293B] bg-[#0F172A] p-6">
                <div className="flex items-center gap-2 mb-6">
                    <span className="text-xl">🔥</span>
                    <h3 className="text-lg font-semibold text-white">Surging Accounts</h3>
                </div>
                <div className="flex items-center justify-center py-8">
                    <span className="text-slate-400">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-[#1E293B] bg-[#0F172A] p-6">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
                <span className="text-xl">🔥</span>
                <h3 className="text-lg font-semibold text-white">Surging Accounts</h3>
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse ml-2" />
            </div>

            {/* Accounts List */}
            {accounts.length > 0 ? (
                <div className="space-y-4">
                    {accounts.map((account) => (
                        <AccountCard key={account.id} account={account} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-slate-400">No surging accounts right now. Check back soon.</p>
                </div>
            )}
        </div>
    );
}

function AccountCard({ account }: { account: SurgingAccount }) {
    const flag = account.country ? countryFlags[account.country] || "🌍" : "🌍";
    const industryKey = account.industry as keyof typeof industryColors;
    const industryColor = industryColors[industryKey] || industryColors.BFSI;

    // Generate initials for logo
    const initials = account.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

    // Generate color from name (consistent hash)
    const colors = [
        "bg-blue-600",
        "bg-purple-600",
        "bg-green-600",
        "bg-amber-600",
        "bg-red-600",
        "bg-indigo-600",
    ];
    const colorIndex = account.name.charCodeAt(0) % colors.length;
    const logoColor = colors[colorIndex];

    // Score color
    let scoreColor = "text-red-400";
    if (account.totalScore >= 75) {
        scoreColor = "text-green-400";
    } else if (account.totalScore >= 50) {
        scoreColor = "text-amber-400";
    }

    // Format intent signals
    const intentSignals = formatIntentSignals(account.signals);

    return (
        <div className="rounded-lg border border-[#1E293B] bg-[#0F172A] p-4 hover:bg-[#1E293B]/30 transition-colors">
            <div className="flex items-start gap-4">
                {/* Company Logo */}
                <div
                    className={`h-12 w-12 rounded-lg ${logoColor} flex items-center justify-center flex-shrink-0`}
                >
                    <span className="text-white font-bold text-sm">{initials}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Company Name & Flag */}
                    <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-white font-medium truncate">{account.name}</h4>
                        <span className="text-lg flex-shrink-0">{flag}</span>
                    </div>

                    {/* Industry Badge */}
                    <div className="mb-3">
                        <span
                            className={`text-xs px-2 py-0.5 rounded border ${industryColor} font-medium`}
                        >
                            {account.industry}
                        </span>
                    </div>

                    {/* Intent Signals */}
                    <p className="text-sm text-slate-400 mb-3">{intentSignals}</p>

                    {/* Score & Actions */}
                    <div className="flex items-center justify-between gap-3">
                        {/* Score */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">Score:</span>
                            <span className={`text-lg font-bold ${scoreColor}`}>
                                {account.totalScore}
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                            <Link
                                href={`/accounts/${account.id}`}
                                className="px-3 py-1.5 text-xs font-medium text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-colors"
                            >
                                View Dossier
                            </Link>
                            <button
                                onClick={() => handleSendMessage(account)}
                                className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-[#1E293B] hover:bg-[#334155] rounded-lg transition-colors"
                            >
                                Send Message
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function formatIntentSignals(signals: Signal[]): string {
    if (signals.length === 0) {
        return "High engagement detected";
    }

    const signalDescriptions = signals.map((signal) => {
        if (signal.description) return signal.description;

        // Fallback formatting based on type
        switch (signal.type) {
            case "website_visit":
                return "Page visit";
            case "content_download":
                return "Whitepaper download";
            case "intent":
                return "Intent signal";
            case "firmographic":
                return "Firmographic change";
            default:
                return signal.type.replace("_", " ");
        }
    });

    // Take first 3 signals
    const displaySignals = signalDescriptions.slice(0, 3);

    if (signals.length > 3) {
        return `${displaySignals.join(" · ")} · +${signals.length - 3} more`;
    }

    return displaySignals.join(" · ");
}

function handleSendMessage(account: SurgingAccount) {
    // TODO: Open AI draft modal
    console.log("Send message to:", account.name);
    alert(`AI message draft modal coming soon for ${account.name}`);
}
