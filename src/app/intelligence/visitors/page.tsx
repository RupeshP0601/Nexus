"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout";

interface UnmatchedVisitor {
    id: string;
    subject: string;
    notes: string;
    createdAt: Date;
}

interface VisitorData {
    ip: string;
    page: string;
    userAgent: string;
    ipinfo: {
        org?: string;
        city?: string;
        country?: string;
    };
    reason: string;
    timestamp: string;
}

export default function VisitorsPage() {
    const [visitors, setVisitors] = useState<UnmatchedVisitor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedVisitor, setSelectedVisitor] = useState<UnmatchedVisitor | null>(null);

    useEffect(() => {
        fetchVisitors();
    }, []);

    const fetchVisitors = async () => {
        try {
            // Fetch unmatched visitors from Activity table
            const response = await fetch('/api/activities?type=note&subject=Unmatched Visitor');
            if (response.ok) {
                const data = await response.json();
                setVisitors(data);
            }
        } catch (error) {
            console.error('Failed to fetch visitors:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const parseVisitorData = (notes: string): VisitorData | null => {
        try {
            return JSON.parse(notes);
        } catch {
            return null;
        }
    };

    const getPointsForPage = (page: string): number => {
        const pagePoints: Record<string, number> = {
            '/pricing': 20,
            '/case-studies': 15,
            '/compliance': 15,
            '/contact': 25,
            '/demo': 25,
            '/features': 10,
            '/about': 5,
        };
        return pagePoints[page] || 5;
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Website Visitors</h1>
                    <p className="text-muted-foreground mt-1">
                        IP-to-company deanonymization and visitor tracking
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard title="Total Visitors" value="247" change="+12%" trend="up" />
                    <StatCard title="Matched" value="189" change="+8%" trend="up" />
                    <StatCard title="Unmatched" value={visitors.length.toString()} change="-3%" trend="down" />
                    <StatCard title="Match Rate" value="76%" change="+2%" trend="up" />
                </div>

                {/* Unmatched Visitors Table */}
                <div className="rounded-lg border border-[#1E293B] bg-[#0F172A] overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#1E293B]">
                        <h3 className="text-lg font-semibold text-white">Unmatched Visitors (Manual Review)</h3>
                        <p className="text-sm text-slate-400 mt-1">
                            These visitors could not be automatically matched to existing accounts
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="p-8 text-center">
                            <span className="text-slate-400">Loading visitors...</span>
                        </div>
                    ) : visitors.length === 0 ? (
                        <div className="p-8 text-center">
                            <span className="text-slate-400">No unmatched visitors</span>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#1E293B]">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                            IP Address
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                            Company
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                            Location
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                            Page Visited
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                            Points
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                            Time
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1E293B]">
                                    {visitors.map((visitor) => {
                                        const data = parseVisitorData(visitor.notes);
                                        if (!data) return null;

                                        return (
                                            <tr key={visitor.id} className="hover:bg-[#1E293B]/30">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-mono">
                                                    {data.ip}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-white">
                                                    {data.ipinfo.org || 'Unknown'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                                                    {data.ipinfo.city}, {data.ipinfo.country}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-white font-mono">
                                                    {data.page}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 font-medium">
                                                        {getPointsForPage(data.page)} pts
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                                                    {new Date(data.timestamp).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <button
                                                        onClick={() => setSelectedVisitor(visitor)}
                                                        className="px-3 py-1.5 text-xs font-medium text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-colors"
                                                    >
                                                        Match Manually
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Page Points Reference */}
                <div className="rounded-lg border border-[#1E293B] bg-[#0F172A] p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Page Point Values</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <PagePointBadge page="/contact" points={25} />
                        <PagePointBadge page="/demo" points={25} />
                        <PagePointBadge page="/pricing" points={20} />
                        <PagePointBadge page="/case-studies" points={15} />
                        <PagePointBadge page="/compliance" points={15} />
                        <PagePointBadge page="/features" points={10} />
                        <PagePointBadge page="/about" points={5} />
                        <PagePointBadge page="Other pages" points={5} />
                    </div>
                </div>
            </div>

            {/* Manual Match Modal */}
            {selectedVisitor && (
                <ManualMatchModal
                    visitor={selectedVisitor}
                    onClose={() => setSelectedVisitor(null)}
                    onMatch={() => {
                        setSelectedVisitor(null);
                        fetchVisitors();
                    }}
                />
            )}
        </DashboardLayout>
    );
}

function StatCard({
    title,
    value,
    change,
    trend,
}: {
    title: string;
    value: string;
    change: string;
    trend: "up" | "down";
}) {
    return (
        <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="mt-2 flex items-baseline gap-2">
                <p className="text-3xl font-bold text-foreground">{value}</p>
                <span
                    className={`text-sm font-medium ${trend === "up" ? "text-success" : "text-destructive"
                        }`}
                >
                    {change}
                </span>
            </div>
        </div>
    );
}

function PagePointBadge({ page, points }: { page: string; points: number }) {
    return (
        <div className="flex items-center justify-between p-3 rounded-lg bg-[#1E293B]">
            <span className="text-sm text-white font-mono">{page}</span>
            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-xs font-medium">
                {points} pts
            </span>
        </div>
    );
}

function ManualMatchModal({
    visitor,
    onClose,
    onMatch,
}: {
    visitor: UnmatchedVisitor;
    onClose: () => void;
    onMatch: () => void;
}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [accounts, setAccounts] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const data = JSON.parse(visitor.notes) as VisitorData;

    const searchAccounts = async () => {
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const response = await fetch(`/api/accounts?search=${encodeURIComponent(searchQuery)}`);
            if (response.ok) {
                const results = await response.json();
                setAccounts(results);
            }
        } catch (error) {
            console.error('Failed to search accounts:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleMatch = async (accountId: string) => {
        // TODO: Create signal for matched account and delete unmatched visitor log
        alert(`Matched to account ${accountId}. Signal creation coming soon.`);
        onMatch();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
            <div
                className="bg-[#1E293B] rounded-lg p-6 max-w-2xl w-full mx-4 border border-[#334155] max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-xl font-bold text-white mb-4">Match Visitor to Account</h3>

                {/* Visitor Info */}
                <div className="mb-6 p-4 rounded-lg bg-[#0F172A] border border-[#334155]">
                    <p className="text-sm text-slate-400 mb-2">Company from IPInfo:</p>
                    <p className="text-white font-medium text-lg">{data.ipinfo.org || 'Unknown'}</p>
                    <p className="text-sm text-slate-400 mt-2">
                        {data.ipinfo.city}, {data.ipinfo.country} • Visited {data.page}
                    </p>
                </div>

                {/* Search */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                        Search for Account
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && searchAccounts()}
                            placeholder="Enter account name..."
                            className="flex-1 px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                        />
                        <button
                            onClick={searchAccounts}
                            disabled={isSearching}
                            className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg font-medium disabled:opacity-50"
                        >
                            {isSearching ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                </div>

                {/* Results */}
                {accounts.length > 0 && (
                    <div className="space-y-2 mb-6">
                        {accounts.map((account) => (
                            <div
                                key={account.id}
                                className="flex items-center justify-between p-3 rounded-lg bg-[#0F172A] border border-[#334155] hover:border-[#2563EB] transition-colors"
                            >
                                <div>
                                    <p className="text-white font-medium">{account.name}</p>
                                    <p className="text-sm text-slate-400">
                                        {account.industry} • {account.country}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleMatch(account.id)}
                                    className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg"
                                >
                                    Match
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <button
                    onClick={onClose}
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-[#334155] hover:bg-[#475569] rounded-lg transition-colors"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
