"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

interface TriggerEvent {
    id: string;
    headline: string;
    category: string;
    sector: string;
    country: string | null;
    source: string;
    url: string | null;
    publishedAt: Date;
}

const categoryColors = {
    regulatory: "bg-red-500/20 text-red-400 border-red-500/30",
    tender: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    funding: "bg-green-500/20 text-green-400 border-green-500/30",
    executive_change: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

const categoryLabels = {
    regulatory: "REGULATORY",
    tender: "TENDER",
    funding: "FUNDING",
    executive_change: "EXEC CHANGE",
};

const countryFlags: Record<string, string> = {
    UAE: "🇦🇪",
    KSA: "🇸🇦",
    Qatar: "🇶🇦",
    Bahrain: "🇧🇭",
    Kuwait: "🇰🇼",
    Oman: "🇴🇲",
};

export function LiveTicker() {
    const [events, setEvents] = useState<TriggerEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchEvents = async () => {
        try {
            const response = await fetch("/api/trigger-events");
            if (response.ok) {
                const data = await response.json();
                setEvents(data);
            }
        } catch (error) {
            console.error("Failed to fetch trigger events:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();

        // Refresh every 5 minutes
        const interval = setInterval(fetchEvents, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    if (isLoading) {
        return (
            <div className="w-full overflow-hidden bg-[#0F172A] border-y border-[#1E293B] py-3">
                <div className="flex items-center gap-3 px-6">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-semibold text-green-500">LIVE</span>
                    </div>
                    <span className="text-sm text-slate-400">Loading market intelligence...</span>
                </div>
            </div>
        );
    }

    // Duplicate events for seamless infinite scroll
    const duplicatedEvents = [...events, ...events];

    return (
        <div className="w-full overflow-hidden bg-[#0F172A] border-y border-[#1E293B] py-3">
            <div className="flex items-center gap-6">
                {/* LIVE Indicator */}
                <div className="flex items-center gap-2 px-6 flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-semibold text-green-500">LIVE</span>
                </div>

                {/* Scrolling Ticker */}
                <div className="flex-1 overflow-hidden">
                    <div className="flex gap-8 animate-marquee hover:[animation-play-state:paused]">
                        {duplicatedEvents.map((event, index) => (
                            <TickerItem key={`${event.id}-${index}`} event={event} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function TickerItem({ event }: { event: TriggerEvent }) {
    const [showTooltip, setShowTooltip] = useState(false);
    const categoryKey = event.category as keyof typeof categoryColors;
    const categoryColor = categoryColors[categoryKey] || categoryColors.regulatory;
    const categoryLabel = categoryLabels[categoryKey] || event.category.toUpperCase();
    const flag = event.country ? countryFlags[event.country] || "🌍" : "🌍";
    const timeAgo = formatDistanceToNow(new Date(event.publishedAt), { addSuffix: true });

    return (
        <div
            className="relative flex items-center gap-3 flex-shrink-0 group"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            {/* Category Badge */}
            <span
                className={`px-2 py-0.5 text-xs font-bold rounded border ${categoryColor} whitespace-nowrap`}
            >
                {categoryLabel}
            </span>

            {/* Headline */}
            <span className="text-sm text-white font-medium whitespace-nowrap">
                {event.headline}
            </span>

            {/* Country Flag */}
            <span className="text-lg">{flag}</span>

            {/* Time Ago */}
            <span className="text-xs text-slate-400 whitespace-nowrap">{timeAgo}</span>

            {/* Tooltip */}
            {showTooltip && (
                <div className="absolute bottom-full left-0 mb-2 w-80 p-3 bg-[#1E293B] border border-[#334155] rounded-lg shadow-xl z-50">
                    <p className="text-sm text-white font-medium mb-2">{event.headline}</p>
                    <div className="space-y-1 text-xs text-slate-400">
                        <p>
                            <span className="font-semibold">Source:</span> {event.source}
                        </p>
                        <p>
                            <span className="font-semibold">Sector:</span> {event.sector}
                        </p>
                        {event.url && (
                            <a
                                href={event.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#2563EB] hover:underline block truncate"
                            >
                                {event.url}
                            </a>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
