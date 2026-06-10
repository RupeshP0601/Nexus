"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout";
import Link from "next/link";

interface Account {
    id: string;
    name: string;
    industry: string;
    country: string | null;
    tier: number;
    totalScore: number;
    status: string;
    dossier: any | null;
}

interface Stats {
    totalSQLs: number;
    dossiersGenerated: number;
    messagesSentToday: number;
}

export default function AgentsPage() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [stats, setStats] = useState<Stats>({
        totalSQLs: 0,
        dossiersGenerated: 0,
        messagesSentToday: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading with mock data
        setTimeout(() => {
            // Mock accounts with and without dossiers
            const mockAccounts: Account[] = [
                {
                    id: "acc1",
                    name: "Emirates NBD",
                    industry: "BFSI",
                    country: "UAE",
                    tier: 1,
                    totalScore: 92,
                    status: "sql",
                    dossier: {
                        messageAngle: "How Emirates NBD can accelerate digital banking transformation while reducing technical debt by 40%"
                    }
                },
                {
                    id: "acc2",
                    name: "Etisalat",
                    industry: "Telecom",
                    country: "UAE",
                    tier: 1,
                    totalScore: 88,
                    status: "sql",
                    dossier: {
                        messageAngle: "Modernizing network infrastructure for 5G readiness and customer experience excellence"
                    }
                },
                {
                    id: "acc3",
                    name: "Qatar National Bank",
                    industry: "BFSI",
                    country: "Qatar",
                    tier: 1,
                    totalScore: 85,
                    status: "sql",
                    dossier: {
                        messageAngle: "Streamlining compliance automation and reducing regulatory reporting overhead by 50%"
                    }
                },
                {
                    id: "acc4",
                    name: "Saudi Telecom Company",
                    industry: "Telecom",
                    country: "KSA",
                    tier: 1,
                    totalScore: 78,
                    status: "sql",
                    dossier: null
                },
                {
                    id: "acc5",
                    name: "Abu Dhabi Commercial Bank",
                    industry: "BFSI",
                    country: "UAE",
                    tier: 2,
                    totalScore: 76,
                    status: "sql",
                    dossier: null
                }
            ];

            setAccounts(mockAccounts);
            setStats({
                totalSQLs: 5,
                dossiersGenerated: 3,
                messagesSentToday: 7,
            });
            setIsLoading(false);
        }, 500);
    }, []);

    const handleGenerateDossier = async (accountId: string) => {
        // Mock dossier generation
        alert("✅ Dossier generated! (Demo mode - using mock data)");

        // In demo mode, just reload to show the same data
        // Uncomment below for real API call:
        /*
        try {
          const response = await fetch(`/api/accounts/${accountId}/generate-dossier`, {
            method: "POST",
          });
    
          if (response.ok) {
            alert("Dossier generated successfully!");
            fetchData(); // Refresh
          } else {
            alert("Failed to generate dossier");
          }
        } catch (error) {
          console.error("Error generating dossier:", error);
          alert("Failed to generate dossier");
        }
        */
    };

    const accountsWithoutDossier = accounts.filter((acc) => !acc.dossier);
    const accountsWithDossier = accounts.filter((acc) => acc.dossier);

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-96">
                    <span className="text-slate-400">Loading AI agents...</span>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div>
                    <h1 className="text-3xl font-bold text-foreground">AI Agents</h1>
                    <p className="text-muted-foreground mt-1">
                        Review and act on AI-generated dossiers and outreach messages
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard
                        title="Total SQL Accounts"
                        value={stats.totalSQLs.toString()}
                        icon="🎯"
                        color="blue"
                    />
                    <StatCard
                        title="Dossiers Generated"
                        value={stats.dossiersGenerated.toString()}
                        icon="📋"
                        color="green"
                    />
                    <StatCard
                        title="Messages Sent Today"
                        value={stats.messagesSentToday.toString()}
                        icon="✉️"
                        color="purple"
                    />
                </div>

                {/* Accounts Without Dossier */}
                {accountsWithoutDossier.length > 0 && (
                    <div className="rounded-lg border border-[#1E293B] bg-[#0F172A] overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#1E293B]">
                            <h3 className="text-lg font-semibold text-white">
                                SQL Accounts Pending Dossier Generation
                            </h3>
                            <p className="text-sm text-slate-400 mt-1">
                                These accounts crossed the SQL threshold but don't have dossiers yet
                            </p>
                        </div>

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
                                            Score
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1E293B]">
                                    {accountsWithoutDossier.map((account) => (
                                        <tr key={account.id} className="hover:bg-[#1E293B]/30">
                                            <td className="px-6 py-4 text-sm text-white font-medium">
                                                {account.name}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-400">
                                                {account.industry}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-400">
                                                {account.country}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 font-bold">
                                                    {account.totalScore}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <button
                                                    onClick={() => handleGenerateDossier(account.id)}
                                                    className="px-3 py-1.5 text-xs font-medium text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-colors"
                                                >
                                                    Generate Dossier
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Accounts With Dossier */}
                <div className="rounded-lg border border-[#1E293B] bg-[#0F172A] overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#1E293B]">
                        <h3 className="text-lg font-semibold text-white">
                            Accounts with AI-Generated Dossiers
                        </h3>
                        <p className="text-sm text-slate-400 mt-1">
                            Review insights and draft outreach messages
                        </p>
                    </div>

                    {accountsWithDossier.length === 0 ? (
                        <div className="p-8 text-center">
                            <span className="text-slate-400">No dossiers generated yet</span>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#1E293B]">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                            Account
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                            Tier
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                            Score
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                            Message Angle
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1E293B]">
                                    {accountsWithDossier.map((account) => (
                                        <tr key={account.id} className="hover:bg-[#1E293B]/30">
                                            <td className="px-6 py-4 text-sm text-white font-medium">
                                                {account.name}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-400">
                                                Tier {account.tier}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 font-bold">
                                                    {account.totalScore}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-300 max-w-md truncate">
                                                {account.dossier?.messageAngle || "N/A"}
                                            </td>
                                            <td className="px-6 py-4 text-sm space-x-2">
                                                <Link
                                                    href={`/agents/${account.id}`}
                                                    className="px-3 py-1.5 text-xs font-medium text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-colors inline-block"
                                                >
                                                    View Dossier
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
    icon,
    color,
}: {
    title: string;
    value: string;
    icon: string;
    color: string;
}) {
    const colorClasses = {
        blue: "bg-blue-500/10 text-blue-400",
        green: "bg-green-500/10 text-green-400",
        purple: "bg-purple-500/10 text-purple-400",
    };

    return (
        <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
                </div>
                <div
                    className={`text-4xl p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]
                        }`}
                >
                    {icon}
                </div>
            </div>
        </div>
    );
}
