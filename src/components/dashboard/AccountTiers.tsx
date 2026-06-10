"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Account {
    id: string;
    name: string;
    industry: string;
    country: string | null;
    totalScore: number;
}

interface TierData {
    accounts: Account[];
    count: number;
    surging: number;
    sqls: number;
    opportunities: number;
}

interface TierStats {
    tier1: TierData;
    tier2: TierData;
    tier3: TierData;
}

const countryFlags: Record<string, string> = {
    UAE: "🇦🇪",
    KSA: "🇸🇦",
    Qatar: "🇶🇦",
    Bahrain: "🇧🇭",
    Kuwait: "🇰🇼",
    Oman: "🇴🇲",
};

const tierConfig = [
    {
        tier: 1,
        name: "TIER 1: STRATEGIC",
        color: "#1A2B4A",
        key: "tier1" as const,
    },
    {
        tier: 2,
        name: "TIER 2: SCALE",
        color: "#2563EB",
        key: "tier2" as const,
    },
    {
        tier: 3,
        name: "TIER 3: PROGRAMMATIC",
        color: "#6B7280",
        key: "tier3" as const,
    },
];

export function AccountTiers() {
    const [stats, setStats] = useState<TierStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch("/api/tier-stats");
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Failed to fetch tier stats:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-lg border border-[#1E293B] bg-[#0F172A] p-6">
                        <div className="h-48 flex items-center justify-center">
                            <span className="text-slate-400">Loading...</span>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tierConfig.map((config) => {
                const tierData = stats[config.key];
                return (
                    <TierCard
                        key={config.tier}
                        name={config.name}
                        color={config.color}
                        data={tierData}
                    />
                );
            })}
        </div>
    );
}

function TierCard({
    name,
    color,
    data,
}: {
    name: string;
    color: string;
    data: TierData;
}) {
    return (
        <div className="rounded-lg border border-[#1E293B] bg-[#0F172A] overflow-hidden">
            {/* Header */}
            <div
                className="px-6 py-4 border-b border-[#1E293B]"
                style={{ backgroundColor: color }}
            >
                <h3 className="text-sm font-bold text-white tracking-wide">{name}</h3>
                <p className="text-2xl font-bold text-white mt-1">{data.count}</p>
            </div>

            {/* Sub-stats */}
            <div className="px-6 py-4 border-b border-[#1E293B] grid grid-cols-3 gap-2">
                <div>
                    <p className="text-xs text-slate-400">Surging</p>
                    <p className="text-lg font-bold text-white">{data.surging}</p>
                </div>
                <div>
                    <p className="text-xs text-slate-400">SQLs</p>
                    <p className="text-lg font-bold text-white">{data.sqls}</p>
                </div>
                <div>
                    <p className="text-xs text-slate-400">Opps</p>
                    <p className="text-lg font-bold text-white">{data.opportunities}</p>
                </div>
            </div>

            {/* Top 3 Accounts */}
            <div className="px-6 py-4 space-y-3">
                {data.accounts.length > 0 ? (
                    data.accounts.map((account) => (
                        <AccountScoreBar key={account.id} account={account} />
                    ))
                ) : (
                    <p className="text-sm text-slate-400 text-center py-4">
                        No accounts in this tier
                    </p>
                )}
            </div>
        </div>
    );
}

function AccountScoreBar({ account }: { account: Account }) {
    const flag = account.country ? countryFlags[account.country] || "🌍" : "🌍";

    // Color based on score
    let scoreColor = "bg-red-500";
    if (account.totalScore >= 75) {
        scoreColor = "bg-green-500";
    } else if (account.totalScore >= 50) {
        scoreColor = "bg-amber-500";
    }

    return (
        <Link
            href={`/accounts/${account.id}`}
            className="block group hover:bg-[#1E293B]/50 rounded-lg p-2 transition-colors"
        >
            {/* Account Info */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-sm font-medium text-white truncate">
                        {account.name}
                    </span>
                    <span className="text-lg flex-shrink-0">{flag}</span>
                </div>
                <span className="text-sm font-bold text-white ml-2">{account.totalScore}</span>
            </div>

            {/* Industry Tag */}
            <div className="mb-2">
                <span className="text-xs px-2 py-0.5 rounded bg-[#1E293B] text-slate-400">
                    {account.industry}
                </span>
            </div>

            {/* Score Bar */}
            <div className="w-full h-1.5 bg-[#1E293B] rounded-full overflow-hidden">
                <div
                    className={`h-full ${scoreColor} transition-all duration-300`}
                    style={{ width: `${account.totalScore}%` }}
                />
            </div>
        </Link>
    );
}
