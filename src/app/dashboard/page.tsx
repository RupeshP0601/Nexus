"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout";
import { LiveTicker } from "@/components/dashboard/LiveTicker";
import { AccountTiers } from "@/components/dashboard/AccountTiers";
import { FunnelChart } from "@/components/dashboard/FunnelChart";
import { SurgingAccounts } from "@/components/dashboard/SurgingAccounts";
import { SLATimers } from "@/components/dashboard/SLATimers";

interface DashboardStats {
    kpis: {
        accountsAtRisk: number;
        hotAccounts: number;
        opportunitiesCreated: number;
        meetingsScheduled: number;
        pipelineValue: string;
        pipelineRawValue: number;
    };
    funnelConversion: {
        nurture: number;
        mql: number;
        sql: number;
        opportunity: number;
    };
    tierDistribution: {
        tier1: number;
        tier2: number;
        tier3: number;
    };
    riskDistribution: {
        low: number;
        medium: number;
        high: number;
    };
    scoreDistribution: {
        low: number;
        medium: number;
        high: number;
        critical: number;
    };
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/dashboard/stats");
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (err) {
                console.error("Failed to fetch dashboard stats:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="min-h-screen flex items-center justify-center bg-[#0B0F19]">
                    <span className="text-slate-400 text-lg animate-pulse">Loading command center stats...</span>
                </div>
            </DashboardLayout>
        );
    }

    const kpis = stats?.kpis || {
        accountsAtRisk: 0,
        hotAccounts: 0,
        opportunitiesCreated: 0,
        meetingsScheduled: 0,
        pipelineValue: "$0.0M",
        pipelineRawValue: 0
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Command Center</h1>
                        <p className="text-slate-400 mt-1">
                            Real-time weighted account intelligence and pipeline orchestration
                        </p>
                    </div>
                    <div className="bg-[#1E293B] border border-[#334155] rounded-full px-4 py-1 text-xs text-slate-300">
                        Live Sync
                    </div>
                </div>

                {/* Live Ticker */}
                <LiveTicker />

                {/* SLA Timers - CRITICAL */}
                <SLATimers />

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <MetricCard
                        title="Pipeline Value"
                        value={kpis.pipelineValue}
                        change="Active Stages"
                        trend="neutral"
                        bgColor="bg-blue-950/20 border-blue-900/40"
                    />
                    <MetricCard
                        title="Opportunities"
                        value={kpis.opportunitiesCreated.toString()}
                        change="Staged Deals"
                        trend="neutral"
                        bgColor="bg-[#0F172A] border-[#1E293B]"
                    />
                    <MetricCard
                        title="Hot Accounts"
                        value={kpis.hotAccounts.toString()}
                        change="Score >= 80"
                        trend="up"
                        bgColor="bg-emerald-950/20 border-emerald-900/40"
                    />
                    <MetricCard
                        title="Meetings Booked"
                        value={kpis.meetingsScheduled.toString()}
                        change="Client Touchpoints"
                        trend="up"
                        bgColor="bg-[#0F172A] border-[#1E293B]"
                    />
                    <MetricCard
                        title="Accounts At Risk"
                        value={kpis.accountsAtRisk.toString()}
                        change="Med / High Risk"
                        trend="down"
                        bgColor="bg-rose-950/20 border-rose-900/40"
                    />
                </div>

                {/* Custom Charts/Distributions Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Deal Risk Distribution Chart */}
                    <div className="rounded-lg border border-[#1E293B] bg-[#0F172A] p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Deal Risk Distribution</h3>
                        <div className="grid grid-cols-3 gap-4 text-center my-auto pt-6">
                            <div className="p-4 bg-emerald-950/10 border border-emerald-900/30 rounded-lg">
                                <p className="text-sm text-emerald-400 font-medium">Low Risk</p>
                                <p className="text-3xl font-bold text-white mt-2">{stats?.riskDistribution.low || 0}</p>
                                <p className="text-xs text-slate-400 mt-1">Healthy Accounts</p>
                            </div>
                            <div className="p-4 bg-amber-950/10 border border-amber-900/30 rounded-lg">
                                <p className="text-sm text-amber-400 font-medium">Medium Risk</p>
                                <p className="text-3xl font-bold text-white mt-2">{stats?.riskDistribution.medium || 0}</p>
                                <p className="text-xs text-slate-400 mt-1">Needs Attention</p>
                            </div>
                            <div className="p-4 bg-rose-950/10 border border-rose-900/30 rounded-lg">
                                <p className="text-sm text-rose-400 font-medium">High Risk</p>
                                <p className="text-3xl font-bold text-white mt-2">{stats?.riskDistribution.high || 0}</p>
                                <p className="text-xs text-slate-400 mt-1">Critical Threat</p>
                            </div>
                        </div>
                    </div>

                    {/* Score Distribution Chart */}
                    <div className="rounded-lg border border-[#1E293B] bg-[#0F172A] p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Account Score Distribution</h3>
                        <div className="space-y-4 pt-2">
                            <DistributionRow label="Critical (>90)" count={stats?.scoreDistribution.critical || 0} color="bg-emerald-500" total={stats?.scoreDistribution.low! + stats?.scoreDistribution.medium! + stats?.scoreDistribution.high! + stats?.scoreDistribution.critical!} />
                            <DistributionRow label="High (75-90)" count={stats?.scoreDistribution.high || 0} color="bg-blue-500" total={stats?.scoreDistribution.low! + stats?.scoreDistribution.medium! + stats?.scoreDistribution.high! + stats?.scoreDistribution.critical!} />
                            <DistributionRow label="Medium (50-75)" count={stats?.scoreDistribution.medium || 0} color="bg-amber-500" total={stats?.scoreDistribution.low! + stats?.scoreDistribution.medium! + stats?.scoreDistribution.high! + stats?.scoreDistribution.critical!} />
                            <DistributionRow label="Low (<50)" count={stats?.scoreDistribution.low || 0} color="bg-rose-500" total={stats?.scoreDistribution.low! + stats?.scoreDistribution.medium! + stats?.scoreDistribution.high! + stats?.scoreDistribution.critical!} />
                        </div>
                    </div>
                </div>

                {/* Surging Accounts */}
                <SurgingAccounts />

                {/* Account Tiers */}
                <AccountTiers />

                {/* Funnel Chart */}
                <FunnelChart />
            </div>
        </DashboardLayout>
    );
}

function MetricCard({
    title,
    value,
    change,
    trend,
    bgColor = "bg-[#0F172A] border-[#1E293B]"
}: {
    title: string;
    value: string;
    change: string;
    trend: "up" | "down" | "neutral";
    bgColor?: string;
}) {
    return (
        <div className={`rounded-lg border p-5 transition-all hover:-translate-y-0.5 hover:shadow-md ${bgColor}`}>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
            <div className="mt-3 flex items-baseline justify-between">
                <p className="text-3xl font-extrabold text-white tracking-tight">{value}</p>
                <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        trend === "up" ? "bg-emerald-950 text-emerald-400" :
                        trend === "down" ? "bg-rose-950 text-rose-400" :
                        "bg-[#1E293B] text-slate-300"
                    }`}
                >
                    {change}
                </span>
            </div>
        </div>
    );
}

function DistributionRow({ label, count, color, total }: { label: string; count: number; color: string; total: number }) {
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
        <div>
            <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                <span>{label}</span>
                <span>{count} Accounts ({percentage}%)</span>
            </div>
            <div className="h-2 w-full bg-[#1E293B] rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
}
