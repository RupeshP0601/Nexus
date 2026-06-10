"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface FunnelStage {
    stage: string;
    count: number;
    percentage: number;
}

export function FunnelChart() {
    const [data, setData] = useState<FunnelStage[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/funnel-stats");
                if (response.ok) {
                    const funnelData = await response.json();
                    setData(funnelData);
                }
            } catch (error) {
                console.error("Failed to fetch funnel stats:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="rounded-lg border border-[#1E293B] bg-[#0F172A] p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Pipeline Funnel</h3>
                <div className="h-64 flex items-center justify-center">
                    <span className="text-slate-400">Loading funnel data...</span>
                </div>
            </div>
        );
    }

    const colors = ["#2563EB", "#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE"];

    return (
        <div className="rounded-lg border border-[#1E293B] bg-[#0F172A] p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Pipeline Funnel</h3>

            {/* Stats Summary */}
            <div className="grid grid-cols-5 gap-4 mb-6">
                {data.map((stage, index) => (
                    <div key={stage.stage} className="text-center">
                        <p className="text-xs text-slate-400 mb-1">{stage.stage}</p>
                        <p className="text-2xl font-bold text-white">{stage.count}</p>
                        {index > 0 && (
                            <p className="text-xs text-green-400 mt-1">{stage.percentage}%</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Bar Chart */}
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis
                        dataKey="stage"
                        stroke="#94A3B8"
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis
                        stroke="#94A3B8"
                        style={{ fontSize: '12px' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1E293B',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            color: '#fff',
                        }}
                        labelStyle={{ color: '#fff' }}
                        formatter={(value: number, name: string, props: any) => {
                            const percentage = props.payload.percentage;
                            return [
                                `${value} accounts${percentage > 0 ? ` (${percentage}% conversion)` : ''}`,
                                'Count'
                            ];
                        }}
                    />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
