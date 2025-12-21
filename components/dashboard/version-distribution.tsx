"use client";

import * as React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { PackageCheck, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VersionDistributionProps {
    distribution: Record<string, number>;
    latest: string;
    outdatedCount: number;
    outdatedPercentage: number;
    total: number;
}

// Vibrant chart colors
const CHART_COLORS = [
    "#6366f1", // Indigo
    "#f59e0b", // Amber
    "#10b981", // Emerald
    "#ec4899", // Pink
    "#8b5cf6", // Violet
    "#06b6d4", // Cyan
];

export function VersionDistribution({
    distribution,
    latest,
    outdatedCount,
    outdatedPercentage,
    total,
}: VersionDistributionProps) {
    const data = Object.entries(distribution).map(([version, count]) => ({
        name: version,
        value: count,
        percentage: ((count / total) * 100).toFixed(1),
    }));

    return (
        <Card className="border border-border bg-card h-full">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                    <PackageCheck className="w-5 h-5" />
                    Version Distribution
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Chart */}
                <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={65}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--card))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "8px",
                                }}
                                labelStyle={{
                                    color: "hsl(var(--foreground))",
                                }}
                                itemStyle={{
                                    color: "hsl(var(--foreground))",
                                }}
                                formatter={(value: number, name: string) => [`${value} nodes`, `v${name}`]}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Version List */}
                <div className="space-y-1.5">
                    {data.map((item, index) => (
                        <div
                            key={item.name}
                            className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors"
                        >
                            <div className="flex items-center gap-2 min-w-0">
                                <div
                                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                                />
                                <span className="text-sm font-mono truncate">
                                    v{item.name}
                                </span>
                                {item.name === latest && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 flex-shrink-0">
                                        Latest
                                    </span>
                                )}
                            </div>
                            <div className="text-sm text-muted-foreground flex-shrink-0 ml-2">
                                <span className="font-medium text-foreground">{item.value}</span>
                                <span className="ml-1 text-xs">({item.percentage}%)</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Outdated Warning */}
                {outdatedPercentage > 20 && (
                    <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs font-medium text-yellow-800 dark:text-yellow-400">
                                    {outdatedCount} nodes outdated
                                </p>
                                <p className="text-[10px] text-yellow-700 dark:text-yellow-500 mt-0.5">
                                    {outdatedPercentage.toFixed(1)}% should upgrade to v{latest}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
