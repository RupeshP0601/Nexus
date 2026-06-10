"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout";

interface Dossier {
    id: string;
    overview: string;
    painPoints: string[];
    valueProposition: string;
    messageAngle: string;
    targetStakeholder: string;
    account: {
        id: string;
        name: string;
        industry: string;
        country: string;
        totalScore: number;
        tier: number;
    };
}

interface Contact {
    id: string;
    name: string;
    title: string;
    email: string | null;
    linkedin: string | null;
}

export default function DossierPage() {
    const params = useParams();
    const router = useRouter();
    const accountId = params.id as string;

    const [dossier, setDossier] = useState<Dossier | null>(null);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showDraftPanel, setShowDraftPanel] = useState(false);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [channel, setChannel] = useState<"email" | "linkedin">("email");
    const [draft, setDraft] = useState<any>(null);
    const [isDrafting, setIsDrafting] = useState(false);

    useEffect(() => {
        // Load mock data
        setTimeout(() => {
            const { mockDossiers, mockContacts } = require('@/lib/mockData');

            const dossierData = mockDossiers[accountId];
            const contactsData = mockContacts[accountId] || [];

            if (dossierData) {
                setDossier(dossierData);
            }

            setContacts(contactsData);
            if (contactsData.length > 0) {
                setSelectedContact(contactsData[0]);
            }

            setIsLoading(false);
        }, 500);
    }, [accountId]);

    const handleRegenerateDossier = async () => {
        alert("✅ Dossier regenerated! (Demo mode - using mock data)");
        // In demo mode, just show alert
        // Uncomment below for real API:
        /*
        if (!confirm("Regenerate dossier? This will overwrite the current one.")) {
            return;
        }

        try {
            const response = await fetch(`/api/accounts/${accountId}/generate-dossier`, {
                method: "POST",
            });

            if (response.ok) {
                alert("Dossier regenerated successfully!");
                window.location.reload();
            }
        } catch (error) {
            console.error("Error regenerating dossier:", error);
            alert("Failed to regenerate dossier");
        }
        */
    };

    const handleGenerateOutreach = async () => {
        if (!selectedContact) {
            alert("Please select a contact first");
            return;
        }

        setIsDrafting(true);

        // Simulate AI generation delay
        setTimeout(() => {
            const { mockDraftMessages } = require('@/lib/mockData');
            const mockDraft = mockDraftMessages[channel];

            setDraft({
                ...mockDraft,
                id: `draft-${Date.now()}`,
                contactId: selectedContact.id,
                accountId: accountId,
            });
            setShowDraftPanel(true);
            setIsDrafting(false);
        }, 1500);

        // Uncomment for real API:
        /*
        try {
            const response = await fetch(`/api/accounts/${accountId}/draft-message`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    channel,
                    contactId: selectedContact.id,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setDraft(data.draft);
                setShowDraftPanel(true);
            } else {
                alert("Failed to generate message");
            }
        } catch (error) {
            console.error("Error generating message:", error);
            alert("Failed to generate message");
        } finally {
            setIsDrafting(false);
        }
        */
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-96">
                    <span className="text-slate-400">Loading dossier...</span>
                </div>
            </DashboardLayout>
        );
    }

    if (!dossier) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center h-96">
                    <span className="text-slate-400 mb-4">No dossier found for this account</span>
                    <button
                        onClick={() => router.push("/agents")}
                        className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg"
                    >
                        Back to Agents
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">{dossier.account.name}</h1>
                        <div className="flex items-center gap-3 mt-2">
                            <span className="px-3 py-1 rounded-lg bg-green-500/20 text-green-400 font-bold text-sm">
                                Score: {dossier.account.totalScore}
                            </span>
                            <span className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-400 font-medium text-sm">
                                Tier {dossier.account.tier}
                            </span>
                            <span className="px-3 py-1 rounded-lg bg-purple-500/20 text-purple-400 font-medium text-sm">
                                {dossier.account.industry}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={handleRegenerateDossier}
                        className="px-4 py-2 bg-[#334155] hover:bg-[#475569] text-white rounded-lg font-medium transition-colors"
                    >
                        🔄 Regenerate Dossier
                    </button>
                </div>

                {/* Dossier Content */}
                <div className="space-y-6">
                    {/* Company Overview */}
                    <div className="rounded-lg border border-[#1E293B] bg-[#0F172A] p-6">
                        <h3 className="text-lg font-semibold text-white mb-3">📊 Company Overview</h3>
                        <p className="text-slate-300 leading-relaxed">{dossier.overview}</p>
                    </div>

                    {/* Pain Points */}
                    <div className="rounded-lg border border-[#1E293B] bg-[#0F172A] p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">🎯 Inferred Pain Points</h3>
                        <div className="space-y-3">
                            {dossier.painPoints.map((point, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <span className="text-red-400 text-xl flex-shrink-0">⚠️</span>
                                    <p className="text-slate-300">{point}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Value Proposition */}
                    <div className="rounded-lg border-2 border-[#2563EB] bg-blue-500/5 p-6">
                        <h3 className="text-lg font-semibold text-white mb-3">💡 Afors Value Proposition</h3>
                        <p className="text-slate-300 leading-relaxed">{dossier.valueProposition}</p>
                    </div>

                    {/* Message Angle */}
                    <div className="rounded-lg border border-[#1E293B] bg-[#0F172A] p-6">
                        <h3 className="text-lg font-semibold text-white mb-3">✉️ Recommended Message Angle</h3>
                        <div className="border-l-4 border-[#2563EB] pl-4 py-2 bg-[#1E293B] rounded-r">
                            <p className="text-slate-300 italic text-lg">&ldquo;{dossier.messageAngle}&rdquo;</p>
                        </div>
                    </div>

                    {/* Target Stakeholder */}
                    <div className="rounded-lg border border-[#1E293B] bg-[#0F172A] p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">👤 Target Stakeholder</h3>
                        <div className="bg-[#1E293B] rounded-lg p-4">
                            <p className="text-white font-medium text-lg mb-2">{dossier.targetStakeholder}</p>
                            {contacts.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    <p className="text-sm text-slate-400">Available Contacts:</p>
                                    {contacts.map((contact) => (
                                        <div
                                            key={contact.id}
                                            className="flex items-center justify-between p-3 bg-[#0F172A] rounded border border-[#334155]"
                                        >
                                            <div>
                                                <p className="text-white font-medium">{contact.name}</p>
                                                <p className="text-sm text-slate-400">{contact.title}</p>
                                            </div>
                                            {contact.linkedin && (
                                                <a
                                                    href={contact.linkedin}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-3 py-1.5 text-xs bg-[#0077B5] hover:bg-[#006399] text-white rounded transition-colors"
                                                >
                                                    LinkedIn
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Generate Outreach Button */}
                <div className="flex items-center justify-center gap-4 p-6 rounded-lg border border-[#1E293B] bg-[#0F172A]">
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-slate-400">Channel:</label>
                        <select
                            value={channel}
                            onChange={(e) => setChannel(e.target.value as "email" | "linkedin")}
                            className="px-3 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-white text-sm"
                        >
                            <option value="email">Email</option>
                            <option value="linkedin">LinkedIn</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-sm text-slate-400">Contact:</label>
                        <select
                            value={selectedContact?.id || ""}
                            onChange={(e) => {
                                const contact = contacts.find((c) => c.id === e.target.value);
                                setSelectedContact(contact || null);
                            }}
                            className="px-3 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-white text-sm"
                        >
                            {contacts.map((contact) => (
                                <option key={contact.id} value={contact.id}>
                                    {contact.name} - {contact.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={handleGenerateOutreach}
                        disabled={isDrafting || !selectedContact}
                        className="px-6 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isDrafting ? "Generating..." : "✨ Generate Outreach Message"}
                    </button>
                </div>
            </div>

            {/* Draft Message Panel */}
            {showDraftPanel && draft && (
                <DraftMessagePanel
                    draft={draft}
                    contact={selectedContact!}
                    channel={channel}
                    onClose={() => {
                        setShowDraftPanel(false);
                        setDraft(null);
                    }}
                    onRegenerate={handleGenerateOutreach}
                />
            )}
        </DashboardLayout>
    );
}

function DraftMessagePanel({
    draft,
    contact,
    channel,
    onClose,
    onRegenerate,
}: {
    draft: any;
    contact: Contact;
    channel: "email" | "linkedin";
    onClose: () => void;
    onRegenerate: () => void;
}) {
    const [editedSubject, setEditedSubject] = useState(draft.subjectLine || "");
    const [editedBody, setEditedBody] = useState(draft.body);
    const [status, setStatus] = useState<"draft" | "sent" | "discarded">("draft");

    const handleMarkAsSent = async () => {
        setStatus("sent");
        alert("✅ Message marked as sent! (Demo mode)");
        setTimeout(onClose, 1500);

        // Uncomment for real API:
        /*
        try {
            const response = await fetch("/api/drafts", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    draftId: draft.id,
                    status: "sent",
                    editedBody: editedBody !== draft.body ? editedBody : undefined,
                }),
            });

            if (response.ok) {
                setStatus("sent");
                alert("Message marked as sent!");
                setTimeout(onClose, 1500);
            }
        } catch (error) {
            console.error("Error marking as sent:", error);
            alert("Failed to mark as sent");
        }
        */
    };

    const handleDiscard = async () => {
        if (!confirm("Discard this draft?")) {
            return;
        }

        alert("Draft discarded (Demo mode)");
        onClose();

        // Uncomment for real API:
        /*
        try {
            const response = await fetch("/api/drafts", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    draftId: draft.id,
                    status: "discarded",
                }),
            });

            if (response.ok) {
                onClose();
            }
        } catch (error) {
            console.error("Error discarding draft:", error);
        }
        */
    };

    const charCount = editedBody.length;
    const charLimit = channel === "linkedin" ? 300 : 10000;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-end z-50" onClick={onClose}>
            <div
                className="bg-[#0F172A] w-full max-w-2xl h-full overflow-y-auto border-l border-[#1E293B] shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white">Draft Message</h2>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-white text-2xl"
                        >
                            ×
                        </button>
                    </div>

                    {/* To */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">To:</label>
                        <div className="p-3 bg-[#1E293B] rounded-lg border border-[#334155]">
                            <p className="text-white font-medium">{contact.name}</p>
                            <p className="text-sm text-slate-400">{contact.title}</p>
                        </div>
                    </div>

                    {/* Channel */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Channel:</label>
                        <div className="px-3 py-2 bg-[#1E293B] rounded-lg border border-[#334155] text-white capitalize">
                            {channel}
                        </div>
                    </div>

                    {/* Subject (Email only) */}
                    {channel === "email" && (
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">
                                Subject Line:
                            </label>
                            <input
                                type="text"
                                value={editedSubject}
                                onChange={(e) => setEditedSubject(e.target.value)}
                                className="w-full px-4 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                            />
                        </div>
                    )}

                    {/* Message Body */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Message:</label>
                        <textarea
                            value={editedBody}
                            onChange={(e) => setEditedBody(e.target.value)}
                            rows={channel === "linkedin" ? 6 : 12}
                            className="w-full px-4 py-3 bg-[#1E293B] border border-[#334155] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] font-mono text-sm"
                        />
                        <div className="flex items-center justify-between mt-2">
                            <span
                                className={`text-sm ${charCount > charLimit ? "text-red-400" : "text-slate-400"
                                    }`}
                            >
                                {charCount} / {charLimit} characters
                            </span>
                            {channel === "linkedin" && charCount > 300 && (
                                <span className="text-xs text-red-400">
                                    ⚠️ LinkedIn limit exceeded
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleMarkAsSent}
                            disabled={status === "sent"}
                            className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {status === "sent" ? "✓ Marked as Sent" : "Mark as Sent"}
                        </button>
                        <button
                            onClick={onRegenerate}
                            className="px-4 py-3 bg-[#334155] hover:bg-[#475569] text-white rounded-lg font-medium transition-colors"
                        >
                            🔄 Regenerate
                        </button>
                        <button
                            onClick={handleDiscard}
                            className="px-4 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg font-medium transition-colors"
                        >
                            Discard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
