"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout";
import Link from "next/link";

interface Account {
    id: string;
    name: string;
    industry: string;
    country: string | null;
    revenue: number | null;
    tier: number;
    fitScore: number;
    intentScore: number;
    totalScore: number;
    status: string;
    lastActivity: Date;
}

export default function AccountsPage() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState({
        status: "",
        industry: "",
        tier: "",
    });

    useEffect(() => {
        // DEMO MODE: Using mock data
        setTimeout(() => {
            const mockAccounts: Account[] = [
                {
                    id: "acc1",
                    name: "Emirates NBD",
                    industry: "BFSI",
                    country: "UAE",
                    revenue: 5200000000,
                    tier: 1,
                    fitScore: 45,
                    intentScore: 47,
                    totalScore: 92,
                    status: "sql",
                    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
                },
                {
                    id: "acc2",
                    name: "Etisalat",
                    industry: "Telecom",
                    country: "UAE",
                    revenue: 13500000000,
                    tier: 1,
                    fitScore: 43,
                    intentScore: 45,
                    totalScore: 88,
                    status: "sql",
                    lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000),
                },
                {
                    id: "acc3",
                    name: "Qatar National Bank",
                    industry: "BFSI",
                    country: "Qatar",
                    revenue: 4800000000,
                    tier: 1,
                    fitScore: 42,
                    intentScore: 43,
                    totalScore: 85,
                    status: "sql",
                    lastActivity: new Date(Date.now() - 3 * 60 * 60 * 1000),
                },
                {
                    id: "acc4",
                    name: "Saudi Telecom Company",
                    industry: "Telecom",
                    country: "KSA",
                    revenue: 15000000000,
                    tier: 1,
                    fitScore: 38,
                    intentScore: 40,
                    totalScore: 78,
                    status: "mql",
                    lastActivity: new Date(Date.now() - 6 * 60 * 60 * 1000),
                },
                {
                    id: "acc5",
                    name: "Abu Dhabi Commercial Bank",
                    industry: "BFSI",
                    country: "UAE",
                    revenue: 3200000000,
                    tier: 2,
                    fitScore: 37,
                    intentScore: 39,
                    totalScore: 76,
                    status: "mql",
                    lastActivity: new Date(Date.now() - 12 * 60 * 60 * 1000),
                },
                {
                    id: "acc6",
                    name: "Dubai Islamic Bank",
                    industry: "BFSI",
                    country: "UAE",
                    revenue: 2800000000,
                    tier: 2,
                    fitScore: 35,
                    intentScore: 33,
                    totalScore: 68,
                    status: "nurture",
                    lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000),
                },
                {
                    id: "acc7",
                    name: "Omantel",
                    industry: "Telecom",
                    country: "Oman",
                    revenue: 1500000000,
                    tier: 2,
                    fitScore: 30,
                    intentScore: 35,
                    totalScore: 65,
                    status: "nurture",
                    lastActivity: new Date(Date.now() - 48 * 60 * 60 * 1000),
                },
            ];

            setAccounts(mockAccounts);
            setIsLoading(false);
        }, 500);
    }, []);

    // Filter accounts
    const filteredAccounts = accounts.filter((account) => {
        if (filter.status && account.status !== filter.status) return false;
        if (filter.industry && account.industry !== filter.industry) return false;
        if (filter.tier && account.tier !== parseInt(filter.tier)) return false;
        return true;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "sql":
                return "bg-green-500/20 text-green-400 border-green-500/30";
            case "mql":
                return "bg-blue-500/20 text-blue-400 border-blue-500/30";
            case "opportunity":
                return "bg-purple-500/20 text-purple-400 border-purple-500/30";
            default:
                return "bg-slate-500/20 text-slate-400 border-slate-500/30";
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 75) return "text-green-400";
        if (score >= 50) return "text-amber-400";
        return "text-red-400";
    };

    const formatRevenue = (revenue: number | null) => {
        if (!revenue) return "N/A";
        return `$${(revenue / 1000000000).toFixed(1)}B`;
    };

    const formatLastActivity = (date: Date) => {
        const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
        if (hours < 1) return "Just now";
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-96">
                    <span className="text-slate-400">Loading accounts...</span>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Accounts</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage and track all target accounts
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-[#1E293B] hover:bg-[#334155] text-white rounded-lg font-medium transition-colors border border-[#334155]">
                            Import Accounts
                        </button>
                        <button className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg font-medium transition-colors">
                            + Add Account
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard title="Total Accounts" value={accounts.length.toString()} />
                    <StatCard
                        title="SQL Accounts"
                        value={accounts.filter((a) => a.status === "sql").length.toString()}
                        trend="+3"
                    />
                    <StatCard
                        title="Avg. Score"
                        value={Math.round(
                            accounts.reduce((sum, a) => sum + a.totalScore, 0) / accounts.length
                        ).toString()}
                    />
                    <StatCard
                        title="Total Pipeline"
                        value={formatRevenue(
                            accounts.reduce((sum, a) => sum + (a.revenue || 0), 0)
                        )}
                    />
                </div>

                {/* Filters */}
                <div className="rounded-lg border border-[#1E293B] bg-[#0F172A] p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">
                                Status
                            </label>
                            <select
                                value={filter.status}
                                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                                className="w-full px-3 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-white text-sm"
                            >
                                <option value="">All Statuses</option>
                                <option value="nurture">Nurture</option>
                                <option value="mql">MQL</option>
                                <option value="sql">SQL</option>
                                <option value="opportunity">Opportunity</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">
                                Industry
                            </label>
                            <select
                                value={filter.industry}
                                onChange={(e) => setFilter({ ...filter, industry: e.target.value })}
                                className="w-full px-3 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-white text-sm"
                            >
                                <option value="">All Industries</option>
                                <option value="BFSI">BFSI</option>
                                <option value="Telecom">Telecom</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">
                                Tier
                            </label>
                            <select
                                value={filter.tier}
                                onChange={(e) => setFilter({ ...filter, tier: e.target.value })}
                                className="w-full px-3 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-white text-sm"
                            >
                                <option value="">All Tiers</option>
                                <option value="1">Tier 1</option>
                                <option value="2">Tier 2</option>
                                <option value="3">Tier 3</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={() => setFilter({ status: "", industry: "", tier: "" })}
                                className="w-full px-3 py-2 bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-white rounded-lg text-sm transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Accounts Table */}
                <div className="rounded-lg border border-[#1E293B] bg-[#0F172A] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#1E293B]">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Account
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Industry
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Country
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Revenue
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Tier
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Score
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Last Activity
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1E293B]">
                                {filteredAccounts.map((account) => (
                                    <tr key={account.id} className="hover:bg-[#1E293B]/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-white">
                                                {account.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-400">
                                            {account.industry}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-400">
                                            {account.country}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-400">
                                            {formatRevenue(account.revenue)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-400">
                                            Tier {account.tier}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`text-sm font-bold ${getScoreColor(
                                                        account.totalScore
                                                    )}`}
                                                >
                                                    {account.totalScore}
                                                </span>
                                                <span className="text-xs text-slate-500">
                                                    ({account.fitScore}/{account.intentScore})
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2 py-1 rounded text-xs uppercase font-medium border ${getStatusColor(
                                                    account.status
                                                )}`}
                                            >
                                                {account.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-400">
                                            {formatLastActivity(account.lastActivity)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/agents/${account.id}`}
                                                className="text-[#2563EB] hover:underline text-sm font-medium"
                                            >
                                                View →
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredAccounts.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-slate-400">No accounts found matching your filters</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

function StatCard({
    title,
    value,
    trend,
}: {
    title: string;
    value: string;
    trend?: string;
}) {
    return (
        <div className="rounded-lg border border-[#1E293B] bg-[#0F172A] p-6">
            <p className="text-sm text-slate-400 mb-2">{title}</p>
            <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-white">{value}</p>
                {trend && <span className="text-sm text-green-400">{trend}</span>}
            </div>
        </div>
    );
}
