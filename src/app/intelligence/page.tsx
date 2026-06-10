"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import { formatDistanceToNow } from "date-fns";

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
    signals: Signal[];
}

interface Signal {
    id: string;
    type: string;
    description: string;
    source: string;
    createdAt: Date;
}

export default function IntelligencePage() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [recentSignals, setRecentSignals] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const [filters, setFilters] = useState({
        industry: "",
        country: "",
        tier: "",
        status: "",
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        // DEMO MODE: Using mock data instead of API calls
        setTimeout(() => {
            // Mock accounts with signals
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
                    signals: [
                        { id: "sig1", type: "website_visit", description: "Visited pricing page 3 times", source: "Website", createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) },
                        { id: "sig2", type: "content_download", description: "Downloaded digital banking whitepaper", source: "Marketing Automation", createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000) }
                    ]
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
                    signals: [
                        { id: "sig3", type: "email_engagement", description: "Opened 5G transformation email", source: "Marketing Automation", createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000) }
                    ]
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
                    signals: [
                        { id: "sig4", type: "demo_request", description: "Requested compliance automation demo", source: "Website", createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000) }
                    ]
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
                    signals: [
                        { id: "sig5", type: "website_visit", description: "Visited solutions page", source: "Website", createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000) }
                    ]
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
                    signals: []
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
                    signals: [
                        { id: "sig6", type: "linkedin_engagement", description: "Engaged with LinkedIn post", source: "Third-Party Data", createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000) }
                    ]
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
                    signals: []
                }
            ];

            // Mock recent signals
            const mockSignals = [
                { id: "sig1", type: "website_visit", description: "Visited pricing page 3 times", source: "Website", createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), points: 10, account: { name: "Emirates NBD" } },
                { id: "sig3", type: "email_engagement", description: "Opened 5G transformation email", source: "Marketing Automation", createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), points: 5, account: { name: "Etisalat" } },
                { id: "sig4", type: "demo_request", description: "Requested compliance automation demo", source: "Website", createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), points: 15, account: { name: "Qatar National Bank" } },
                { id: "sig2", type: "content_download", description: "Downloaded digital banking whitepaper", source: "Marketing Automation", createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), points: 8, account: { name: "Emirates NBD" } },
                { id: "sig5", type: "website_visit", description: "Visited solutions page", source: "Website", createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), points: 3, account: { name: "Saudi Telecom Company" } },
                { id: "sig6", type: "linkedin_engagement", description: "Engaged with LinkedIn post", source: "Third-Party Data", createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), points: 5, account: { name: "Dubai Islamic Bank" } }
            ];

            setAccounts(mockAccounts);
            setRecentSignals(mockSignals);
            setIsLoading(false);
        }, 500);
    };

    const handleRecalculateAll = async () => {
        // DEMO MODE: Mock recalculation
        alert("✅ Recalculated 7 accounts successfully! (Demo mode - using mock data)");
    };

    // Filter accounts
    const filteredAccounts = accounts.filter((account) => {
        if (filters.industry && account.industry !== filters.industry) return false;
        if (filters.country && account.country !== filters.country) return false;
        if (filters.tier && account.tier !== parseInt(filters.tier)) return false;
        if (filters.status && account.status !== filters.status) return false;
        return true;
    });

    // Prepare scatter data
    const scatterData = filteredAccounts.map((account) => ({
        x: account.intentScore,
        y: account.fitScore,
        z: account.revenue ? Math.log10(account.revenue) * 5 : 10, // Size based on revenue
        account,
    }));

    const getScoreColor = (totalScore: number) => {
        if (totalScore >= 75) return "#10B981"; // Green
        if (totalScore >= 50) return "#F59E0B"; // Amber
        return "#EF4444"; // Red
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-96">
                    <span className="text-slate-400">Loading intelligence data...</span>
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
                        <h1 className="text-3xl font-bold text-foreground">Intelligence Matrix</h1>
                        <p className="text-muted-foreground mt-1">
                            Dual-axis scoring: Fit vs Intent
                        </p>
                    </div>
                    <button
                        onClick={handleRecalculateAll}
                        className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg font-medium transition-colors"
                    >
                        Recalculate All Scores
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Main Content - 3 columns */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Scatter Plot Matrix */}
                        <div className="rounded-lg border border-[#1E293B] bg-[#0F172A] p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Account Positioning Matrix</h3>

                            <ResponsiveContainer width="100%" height={500}>
                                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                                    <XAxis
                                        type="number"
                                        dataKey="x"
                                        name="Intent Score"
                                        domain={[0, 50]}
                                        stroke="#94A3B8"
                                        label={{ value: "Intent Score →", position: "bottom", fill: "#94A3B8" }}
                                    />
                                    <YAxis
                                        type="number"
                                        dataKey="y"
                                        name="Fit Score"
                                        domain={[0, 50]}
                                        stroke="#94A3B8"
                                        label={{ value: "← Fit Score", angle: -90, position: "left", fill: "#94A3B8" }}
                                    />

                                    {/* Quadrant dividers */}
                                    <ReferenceLine x={25} stroke="#475569" strokeDasharray="5 5" />
                                    <ReferenceLine y={25} stroke="#475569" strokeDasharray="5 5" />

                                    <Tooltip
                                        content={({ payload }) => {
                                            if (!payload || payload.length === 0) return null;
                                            const data = payload[0].payload;
                                            const account = data.account;

                                            return (
                                                <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-4 shadow-lg">
                                                    <p className="text-white font-bold mb-2">{account.name}</p>
                                                    <div className="space-y-1 text-sm">
                                                        <p className="text-slate-400">
                                                            Fit: <span className="text-white">{account.fitScore}</span> |
                                                            Intent: <span className="text-white">{account.intentScore}</span> |
                                                            Total: <span className="text-white font-bold">{account.totalScore}</span>
                                                        </p>
                                                        <p className="text-slate-400">
                                                            {account.industry} • {account.country}
                                                        </p>
                                                        {account.signals.length > 0 && (
                                                            <div className="mt-2 pt-2 border-t border-[#334155]">
                                                                <p className="text-slate-400 text-xs mb-1">Recent Signals:</p>
                                                                {account.signals.slice(0, 3).map((signal: Signal) => (
                                                                    <p key={signal.id} className="text-xs text-slate-300">
                                                                        • {signal.description}
                                                                    </p>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => setSelectedAccount(account)}
                                                        className="mt-3 w-full px-3 py-1.5 text-xs bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded transition-colors"
                                                    >
                                                        Open Dossier
                                                    </button>
                                                </div>
                                            );
                                        }}
                                    />

                                    <Scatter data={scatterData} fill="#8884d8">
                                        {scatterData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={getScoreColor(entry.account.totalScore)}
                                                opacity={0.8}
                                            />
                                        ))}
                                    </Scatter>
                                </ScatterChart>
                            </ResponsiveContainer>

                            {/* Quadrant Labels */}
                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <QuadrantLabel
                                    title="EDUCATE"
                                    description="High fit, low intent"
                                    color="bg-slate-500/10"
                                    position="top-left"
                                />
                                <QuadrantLabel
                                    title="PRIORITY TARGETS"
                                    description="High fit, high intent"
                                    color="bg-blue-500/20"
                                    position="top-right"
                                />
                                <QuadrantLabel
                                    title="DEPRIORITIZE"
                                    description="Low fit, low intent"
                                    color="bg-gray-500/10"
                                    position="bottom-left"
                                />
                                <QuadrantLabel
                                    title="NURTURE"
                                    description="Low fit, high intent"
                                    color="bg-slate-500/10"
                                    position="bottom-right"
                                />
                            </div>
                        </div>

                        {/* Account Score Table */}
                        <AccountScoreTable
                            accounts={filteredAccounts}
                            filters={filters}
                            onFilterChange={setFilters}
                        />
                    </div>

                    {/* Signal Feed Sidebar - 1 column */}
                    <div className="lg:col-span-1">
                        <SignalFeed signals={recentSignals} />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function QuadrantLabel({
    title,
    description,
    color,
    position,
}: {
    title: string;
    description: string;
    color: string;
    position: string;
}) {
    return (
        <div className={`p-4 rounded-lg ${color} border border-[#1E293B]`}>
            <h4 className="text-white font-bold text-sm mb-1">{title}</h4>
            <p className="text-slate-400 text-xs">{description}</p>
        </div>
    );
}

function AccountScoreTable({
    accounts,
    filters,
    onFilterChange,
}: {
    accounts: Account[];
    filters: any;
    onFilterChange: (filters: any) => void;
}) {
    const [sortBy, setSortBy] = useState<string>("totalScore");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    const handleSort = (column: string) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortOrder("desc");
        }
    };

    const sortedAccounts = [...accounts].sort((a, b) => {
        const aVal = (a as any)[sortBy];
        const bVal = (b as any)[sortBy];

        if (sortOrder === "asc") {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });

    return (
        <div className="rounded-lg border border-[#1E293B] bg-[#0F172A] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#1E293B]">
                <h3 className="text-lg font-semibold text-white mb-4">Account Scores</h3>

                {/* Filters */}
                <div className="grid grid-cols-4 gap-3">
                    <select
                        value={filters.industry}
                        onChange={(e) => onFilterChange({ ...filters, industry: e.target.value })}
                        className="px-3 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-white text-sm"
                    >
                        <option value="">All Industries</option>
                        <option value="BFSI">BFSI</option>
                        <option value="Telecom">Telecom</option>
                    </select>

                    <select
                        value={filters.country}
                        onChange={(e) => onFilterChange({ ...filters, country: e.target.value })}
                        className="px-3 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-white text-sm"
                    >
                        <option value="">All Countries</option>
                        <option value="UAE">UAE</option>
                        <option value="KSA">KSA</option>
                        <option value="Qatar">Qatar</option>
                    </select>

                    <select
                        value={filters.tier}
                        onChange={(e) => onFilterChange({ ...filters, tier: e.target.value })}
                        className="px-3 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-white text-sm"
                    >
                        <option value="">All Tiers</option>
                        <option value="1">Tier 1</option>
                        <option value="2">Tier 2</option>
                        <option value="3">Tier 3</option>
                    </select>

                    <select
                        value={filters.status}
                        onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
                        className="px-3 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-white text-sm"
                    >
                        <option value="">All Statuses</option>
                        <option value="nurture">Nurture</option>
                        <option value="mql">MQL</option>
                        <option value="sql">SQL</option>
                        <option value="opportunity">Opportunity</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-[#1E293B]">
                        <tr>
                            <th
                                onClick={() => handleSort("name")}
                                className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white"
                            >
                                Account {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                Tier
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                Country
                            </th>
                            <th
                                onClick={() => handleSort("fitScore")}
                                className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white"
                            >
                                Fit {sortBy === "fitScore" && (sortOrder === "asc" ? "↑" : "↓")}
                            </th>
                            <th
                                onClick={() => handleSort("intentScore")}
                                className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white"
                            >
                                Intent {sortBy === "intentScore" && (sortOrder === "asc" ? "↑" : "↓")}
                            </th>
                            <th
                                onClick={() => handleSort("totalScore")}
                                className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white"
                            >
                                Total {sortBy === "totalScore" && (sortOrder === "asc" ? "↑" : "↓")}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                Last Signal
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1E293B]">
                        {sortedAccounts.map((account) => (
                            <tr key={account.id} className="hover:bg-[#1E293B]/30">
                                <td className="px-6 py-4 text-sm text-white font-medium">
                                    {account.name}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-400">
                                    Tier {account.tier}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-400">
                                    {account.country}
                                </td>
                                <td className="px-6 py-4 text-sm text-white">
                                    {account.fitScore}
                                </td>
                                <td className="px-6 py-4 text-sm text-white">
                                    {account.intentScore}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <span
                                        className="px-2 py-1 rounded font-bold"
                                        style={{
                                            color: account.totalScore >= 75 ? "#10B981" : account.totalScore >= 50 ? "#F59E0B" : "#EF4444",
                                        }}
                                    >
                                        {account.totalScore}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <span className="px-2 py-1 rounded bg-[#1E293B] text-slate-300 text-xs uppercase">
                                        {account.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-400">
                                    {account.signals.length > 0
                                        ? formatDistanceToNow(new Date(account.signals[0].createdAt), { addSuffix: true })
                                        : "No signals"}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <a
                                        href={`/accounts/${account.id}`}
                                        className="text-[#2563EB] hover:underline"
                                    >
                                        View
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function SignalFeed({ signals }: { signals: any[] }) {
    const getSourceIcon = (source: string) => {
        switch (source.toLowerCase()) {
            case "website":
                return "🌐";
            case "marketing automation":
                return "📧";
            case "third-party data":
                return "📊";
            default:
                return "📡";
        }
    };

    return (
        <div className="rounded-lg border border-[#1E293B] bg-[#0F172A] p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-white mb-4">Live Signal Feed</h3>

            <div className="space-y-3 max-h-[800px] overflow-y-auto">
                {signals.map((signal) => (
                    <div
                        key={signal.id}
                        className="p-3 rounded-lg bg-[#1E293B] border border-[#334155] hover:border-[#2563EB] transition-colors"
                    >
                        <div className="flex items-start gap-2">
                            <span className="text-xl flex-shrink-0">{getSourceIcon(signal.source)}</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-medium truncate">
                                    {signal.account?.name || "Unknown Account"}
                                </p>
                                <p className="text-slate-400 text-xs mt-1">
                                    {signal.description}
                                </p>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-xs font-medium">
                                        +{signal.points || 5} pts
                                    </span>
                                    <span className="text-slate-500 text-xs">
                                        {formatDistanceToNow(new Date(signal.createdAt), { addSuffix: true })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
