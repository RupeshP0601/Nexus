"use client";

import { useEffect, useState } from "react";

interface Contact {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    linkedinUrl: string | null;
}

interface Account {
    id: string;
    name: string;
    industry: string;
    country: string | null;
}

interface Lead {
    id: string;
    source: string;
    status: string;
    score: number;
    slaDeadline: Date;
    account: Account;
    contact: Contact | null;
}

export function SLATimers() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchLeads = async () => {
        try {
            const response = await fetch("/api/leads?status=new&orderBy=slaDeadline");
            if (response.ok) {
                const data = await response.json();
                setLeads(data);
            }
        } catch (error) {
            console.error("Failed to fetch leads:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();

        // Auto-refresh every 60 seconds
        const interval = setInterval(fetchLeads, 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    if (isLoading) {
        return (
            <div className="rounded-lg border border-[#1E293B] bg-[#0F172A] p-6">
                <h3 className="text-lg font-semibold text-white mb-6">⏱️ SLA Timers</h3>
                <div className="flex items-center justify-center py-8">
                    <span className="text-slate-400">Loading...</span>
                </div>
            </div>
        );
    }

    if (leads.length === 0) {
        return (
            <div className="rounded-lg border border-[#1E293B] bg-[#0F172A] p-6">
                <h3 className="text-lg font-semibold text-white mb-6">⏱️ SLA Timers</h3>
                <div className="text-center py-8">
                    <p className="text-slate-400">No active leads requiring SLA monitoring</p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-[#1E293B] bg-[#0F172A] p-6">
            <h3 className="text-lg font-semibold text-white mb-6">⏱️ SLA Timers</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {leads.map((lead) => (
                    <TimerCard key={lead.id} lead={lead} onBreach={fetchLeads} />
                ))}
            </div>
        </div>
    );
}

function TimerCard({ lead, onBreach }: { lead: Lead; onBreach: () => void }) {
    const [timeRemaining, setTimeRemaining] = useState<number>(0);
    const [breached, setBreached] = useState(false);
    const [showCallModal, setShowCallModal] = useState(false);

    useEffect(() => {
        const updateTimer = () => {
            const now = Date.now();
            const deadline = new Date(lead.slaDeadline).getTime();
            const remaining = Math.max(0, deadline - now);

            setTimeRemaining(remaining);

            // Check for breach
            if (remaining === 0 && !breached) {
                setBreached(true);
                logBreach();
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [lead.slaDeadline, breached]);

    const logBreach = async () => {
        try {
            await fetch(`/api/leads/${lead.id}/breach`, {
                method: 'POST',
            });
            onBreach(); // Refresh leads list
        } catch (error) {
            console.error('Failed to log breach:', error);
        }
    };

    // Calculate total SLA time based on source
    const getSLAMinutes = () => {
        if (lead.source === 'inbound') return 5; // 5 minutes
        return 24 * 60; // 24 hours
    };

    const totalSLAMs = getSLAMinutes() * 60 * 1000; // milliseconds
    const deadline = new Date(lead.slaDeadline).getTime();
    const startTime = deadline - totalSLAMs;
    const elapsed = Date.now() - startTime;
    const percentRemaining = Math.max(0, ((totalSLAMs - elapsed) / totalSLAMs) * 100);

    // Determine color state
    let colorClass = "text-green-400";
    let bgClass = "bg-green-500/20 border-green-500/30";
    let pulseClass = "";

    if (breached) {
        colorClass = "text-white";
        bgClass = "bg-black border-red-500";
    } else if (percentRemaining < 10) {
        colorClass = "text-red-400";
        bgClass = "bg-red-500/20 border-red-500/30";
        pulseClass = "animate-pulse";
    } else if (percentRemaining < 50) {
        colorClass = "text-amber-400";
        bgClass = "bg-amber-500/20 border-amber-500/30";
    }

    // Format time as HH:MM:SS
    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const leadType = lead.source === 'inbound' ? 'Inbound Inquiry' :
        lead.status === 'sql' ? 'SQL (Outbound)' : 'MQL';

    return (
        <>
            <div className={`rounded-lg border p-4 ${bgClass} ${pulseClass}`}>
                {/* Timer Display */}
                <div className="text-center mb-4">
                    {breached ? (
                        <>
                            <div className="text-4xl font-bold text-red-500 mb-1">BREACHED</div>
                            <div className="text-lg text-slate-400">00:00:00</div>
                        </>
                    ) : (
                        <div className={`text-4xl font-bold ${colorClass} font-mono`}>
                            {formatTime(timeRemaining)}
                        </div>
                    )}
                </div>

                {/* Account Info */}
                <div className="mb-3">
                    <h4 className="text-white font-medium truncate mb-1">{lead.account.name}</h4>
                    <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded bg-[#1E293B] text-slate-400">
                            {leadType}
                        </span>
                        <span className="text-xs text-slate-400">Score: {lead.score}</span>
                    </div>
                </div>

                {/* Assigned Consultant */}
                <div className="mb-4">
                    <p className="text-xs text-slate-400">Assigned to: <span className="text-white">Sales Team</span></p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => setShowCallModal(true)}
                        className="px-3 py-2 text-xs font-medium text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-colors"
                    >
                        Call Now
                    </button>
                    <button
                        onClick={() => handleAction('accept', lead.id)}
                        className="px-3 py-2 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                    >
                        Accept
                    </button>
                    <button
                        onClick={() => handleAction('reject', lead.id)}
                        className="px-3 py-2 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                    >
                        Reject
                    </button>
                    <button
                        onClick={() => handleAction('reassign', lead.id)}
                        className="px-3 py-2 text-xs font-medium text-slate-300 bg-[#1E293B] hover:bg-[#334155] rounded-lg transition-colors"
                    >
                        Reassign
                    </button>
                </div>
            </div>

            {/* Call Modal */}
            {showCallModal && (
                <CallModal
                    lead={lead}
                    onClose={() => setShowCallModal(false)}
                />
            )}
        </>
    );
}

function CallModal({ lead, onClose }: { lead: Lead; onClose: () => void }) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
            <div
                className="bg-[#1E293B] rounded-lg p-6 max-w-md w-full mx-4 border border-[#334155]"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-xl font-bold text-white mb-4">Call {lead.account.name}</h3>

                {lead.contact ? (
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-slate-400 mb-1">Contact Name</p>
                            <p className="text-white font-medium">{lead.contact.name}</p>
                        </div>

                        {lead.contact.phone && (
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Phone Number</p>
                                <a
                                    href={`tel:${lead.contact.phone}`}
                                    className="text-[#2563EB] hover:underline font-medium text-lg"
                                >
                                    {lead.contact.phone}
                                </a>
                            </div>
                        )}

                        {lead.contact.email && (
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Email</p>
                                <a
                                    href={`mailto:${lead.contact.email}`}
                                    className="text-[#2563EB] hover:underline"
                                >
                                    {lead.contact.email}
                                </a>
                            </div>
                        )}

                        {lead.contact.linkedinUrl && (
                            <div>
                                <p className="text-sm text-slate-400 mb-1">LinkedIn</p>
                                <a
                                    href={lead.contact.linkedinUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#2563EB] hover:underline"
                                >
                                    View Profile →
                                </a>
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="text-slate-400">No contact information available</p>
                )}

                <button
                    onClick={onClose}
                    className="mt-6 w-full px-4 py-2 text-sm font-medium text-white bg-[#334155] hover:bg-[#475569] rounded-lg transition-colors"
                >
                    Close
                </button>
            </div>
        </div>
    );
}

function handleAction(action: string, leadId: string) {
    // TODO: Implement action handlers
    console.log(`Action: ${action} for lead ${leadId}`);
    alert(`${action.toUpperCase()} action coming soon for lead ${leadId}`);
}
