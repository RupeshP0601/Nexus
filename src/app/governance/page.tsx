"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout";
import { formatDistanceToNow } from "date-fns";

interface ComplianceRule {
    id: string;
    name: string;
    category: string;
    status: "active" | "warning" | "violated";
    lastChecked: Date;
    description: string;
}

interface AuditLog {
    id: string;
    action: string;
    user: string;
    timestamp: Date;
    details: string;
    severity: "info" | "warning" | "critical";
}

export default function GovernancePage() {
    const [complianceRules, setComplianceRules] = useState<ComplianceRule[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"compliance" | "audit" | "policies">("compliance");

    useEffect(() => {
        // DEMO MODE: Using mock data
        setTimeout(() => {
            const mockRules: ComplianceRule[] = [
                {
                    id: "rule1",
                    name: "GDPR Data Retention",
                    category: "Data Privacy",
                    status: "active",
                    lastChecked: new Date(Date.now() - 1 * 60 * 60 * 1000),
                    description: "Customer data must be deleted after 24 months of inactivity",
                },
                {
                    id: "rule2",
                    name: "PCI-DSS Compliance",
                    category: "Payment Security",
                    status: "active",
                    lastChecked: new Date(Date.now() - 2 * 60 * 60 * 1000),
                    description: "All payment data must be encrypted at rest and in transit",
                },
                {
                    id: "rule3",
                    name: "SOC 2 Type II",
                    category: "Security",
                    status: "active",
                    lastChecked: new Date(Date.now() - 3 * 60 * 60 * 1000),
                    description: "Annual security audit and continuous monitoring required",
                },
                {
                    id: "rule4",
                    name: "Data Export Limits",
                    category: "Data Privacy",
                    status: "warning",
                    lastChecked: new Date(Date.now() - 5 * 60 * 60 * 1000),
                    description: "Bulk data exports require manager approval",
                },
                {
                    id: "rule5",
                    name: "Access Control Review",
                    category: "Security",
                    status: "warning",
                    lastChecked: new Date(Date.now() - 24 * 60 * 60 * 1000),
                    description: "User access rights must be reviewed quarterly",
                },
            ];

            const mockLogs: AuditLog[] = [
                {
                    id: "log1",
                    action: "Account Data Export",
                    user: "sarah.johnson@afors.com",
                    timestamp: new Date(Date.now() - 30 * 60 * 1000),
                    details: "Exported 47 account records to CSV",
                    severity: "info",
                },
                {
                    id: "log2",
                    action: "Bulk Status Update",
                    user: "mike.chen@afors.com",
                    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                    details: "Updated status for 12 accounts from MQL to SQL",
                    severity: "info",
                },
                {
                    id: "log3",
                    action: "Failed Login Attempt",
                    user: "unknown@external.com",
                    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
                    details: "5 failed login attempts from IP 203.45.67.89",
                    severity: "warning",
                },
                {
                    id: "log4",
                    action: "Permission Change",
                    user: "admin@afors.com",
                    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
                    details: "Granted admin access to john.smith@afors.com",
                    severity: "critical",
                },
                {
                    id: "log5",
                    action: "Data Deletion",
                    user: "system",
                    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
                    details: "Auto-deleted 23 inactive accounts per GDPR retention policy",
                    severity: "info",
                },
                {
                    id: "log6",
                    action: "API Key Generated",
                    user: "sarah.johnson@afors.com",
                    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
                    details: "Generated new API key for CRM integration",
                    severity: "warning",
                },
            ];

            setComplianceRules(mockRules);
            setAuditLogs(mockLogs);
            setIsLoading(false);
        }, 500);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "bg-green-500/20 text-green-400 border-green-500/30";
            case "warning":
                return "bg-amber-500/20 text-amber-400 border-amber-500/30";
            case "violated":
                return "bg-red-500/20 text-red-400 border-red-500/30";
            default:
                return "bg-slate-500/20 text-slate-400 border-slate-500/30";
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "critical":
                return "bg-red-500/20 text-red-400";
            case "warning":
                return "bg-amber-500/20 text-amber-400";
            default:
                return "bg-blue-500/20 text-blue-400";
        }
    };

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case "critical":
                return "🚨";
            case "warning":
                return "⚠️";
            default:
                return "ℹ️";
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-96">
                    <span className="text-slate-400">Loading governance data...</span>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Governance & Compliance</h1>
                    <p className="text-muted-foreground mt-1">
                        Monitor compliance rules, audit logs, and data governance policies
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard
                        title="Compliance Rules"
                        value={complianceRules.length.toString()}
                        status="active"
                    />
                    <StatCard
                        title="Active Rules"
                        value={complianceRules.filter((r) => r.status === "active").length.toString()}
                        status="success"
                    />
                    <StatCard
                        title="Warnings"
                        value={complianceRules.filter((r) => r.status === "warning").length.toString()}
                        status="warning"
                    />
                    <StatCard
                        title="Audit Events (24h)"
                        value={auditLogs.length.toString()}
                        status="info"
                    />
                </div>

                {/* Tabs */}
                <div className="border-b border-[#1E293B]">
                    <div className="flex gap-6">
                        <button
                            onClick={() => setActiveTab("compliance")}
                            className={`pb-3 px-1 border-b-2 transition-colors ${activeTab === "compliance"
                                    ? "border-[#2563EB] text-white"
                                    : "border-transparent text-slate-400 hover:text-white"
                                }`}
                        >
                            Compliance Rules
                        </button>
                        <button
                            onClick={() => setActiveTab("audit")}
                            className={`pb-3 px-1 border-b-2 transition-colors ${activeTab === "audit"
                                    ? "border-[#2563EB] text-white"
                                    : "border-transparent text-slate-400 hover:text-white"
                                }`}
                        >
                            Audit Logs
                        </button>
                        <button
                            onClick={() => setActiveTab("policies")}
                            className={`pb-3 px-1 border-b-2 transition-colors ${activeTab === "policies"
                                    ? "border-[#2563EB] text-white"
                                    : "border-transparent text-slate-400 hover:text-white"
                                }`}
                        >
                            Data Policies
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === "compliance" && (
                    <div className="rounded-lg border border-[#1E293B] bg-[#0F172A] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#1E293B]">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                            Rule Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                            Last Checked
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                            Description
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1E293B]">
                                    {complianceRules.map((rule) => (
                                        <tr key={rule.id} className="hover:bg-[#1E293B]/30">
                                            <td className="px-6 py-4 text-sm font-medium text-white">
                                                {rule.name}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-400">
                                                {rule.category}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-2 py-1 rounded text-xs uppercase font-medium border ${getStatusColor(
                                                        rule.status
                                                    )}`}
                                                >
                                                    {rule.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-400">
                                                {formatDistanceToNow(rule.lastChecked, { addSuffix: true })}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-400">
                                                {rule.description}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === "audit" && (
                    <div className="space-y-3">
                        {auditLogs.map((log) => (
                            <div
                                key={log.id}
                                className="rounded-lg border border-[#1E293B] bg-[#0F172A] p-4 hover:border-[#334155] transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3 flex-1">
                                        <span className="text-2xl">{getSeverityIcon(log.severity)}</span>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-white font-medium">{log.action}</h3>
                                                <span
                                                    className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(
                                                        log.severity
                                                    )}`}
                                                >
                                                    {log.severity}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-400 mb-2">{log.details}</p>
                                            <div className="flex items-center gap-4 text-xs text-slate-500">
                                                <span>👤 {log.user}</span>
                                                <span>
                                                    🕐 {formatDistanceToNow(log.timestamp, { addSuffix: true })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "policies" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <PolicyCard
                            title="Data Retention Policy"
                            description="Automatically delete inactive customer data after 24 months to comply with GDPR"
                            status="active"
                            lastUpdated={new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)}
                        />
                        <PolicyCard
                            title="Access Control Policy"
                            description="Role-based access control with quarterly reviews and automatic deprovisioning"
                            status="active"
                            lastUpdated={new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)}
                        />
                        <PolicyCard
                            title="Data Export Policy"
                            description="All bulk data exports require manager approval and are logged for audit"
                            status="active"
                            lastUpdated={new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)}
                        />
                        <PolicyCard
                            title="Encryption Policy"
                            description="All sensitive data must be encrypted at rest (AES-256) and in transit (TLS 1.3)"
                            status="active"
                            lastUpdated={new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)}
                        />
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

function StatCard({
    title,
    value,
    status,
}: {
    title: string;
    value: string;
    status: "active" | "success" | "warning" | "info";
}) {
    const getColor = () => {
        switch (status) {
            case "success":
                return "text-green-400";
            case "warning":
                return "text-amber-400";
            case "info":
                return "text-blue-400";
            default:
                return "text-white";
        }
    };

    return (
        <div className="rounded-lg border border-[#1E293B] bg-[#0F172A] p-6">
            <p className="text-sm text-slate-400 mb-2">{title}</p>
            <p className={`text-2xl font-bold ${getColor()}`}>{value}</p>
        </div>
    );
}

function PolicyCard({
    title,
    description,
    status,
    lastUpdated,
}: {
    title: string;
    description: string;
    status: string;
    lastUpdated: Date;
}) {
    return (
        <div className="rounded-lg border border-[#1E293B] bg-[#0F172A] p-6">
            <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <span className="px-2 py-1 rounded text-xs uppercase font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                    {status}
                </span>
            </div>
            <p className="text-sm text-slate-400 mb-4">{description}</p>
            <p className="text-xs text-slate-500">
                Last updated: {formatDistanceToNow(lastUpdated, { addSuffix: true })}
            </p>
        </div>
    );
}
