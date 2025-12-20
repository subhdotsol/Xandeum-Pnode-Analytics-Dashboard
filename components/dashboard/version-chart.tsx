"use client";

import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";

interface VersionChartProps {
    distribution: Record<string, number>;
}

export function VersionChart({ distribution }: VersionChartProps) {
    // Convert distribution to chart data
    const data = Object.entries(distribution)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([version, count]) => ({
            version: `v${version}`,
            count,
        }));

    return (
        <Card className="border border-border bg-card">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">Version Distribution</h3>
                    <span className="text-xs text-muted-foreground">
                        {Object.keys(distribution).length} versions
                    </span>
                </div>
                <div className="h-24">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="limeGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#84cc16" stopOpacity={0.4} />
                                    <stop offset="100%" stopColor="#84cc16" stopOpacity={0.05} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="version"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "var(--card)",
                                    border: "1px solid var(--border)",
                                    borderRadius: "8px",
                                    fontSize: "12px",
                                }}
                                formatter={(value: number) => [`${value} nodes`, "Count"]}
                            />
                            <Area
                                type="monotone"
                                dataKey="count"
                                stroke="#84cc16"
                                strokeWidth={2}
                                fill="url(#limeGradient)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
