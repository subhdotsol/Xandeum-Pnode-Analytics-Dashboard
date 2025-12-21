"use client";

import { useMemo, useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface StatusDistributionProps {
    totals: {
        total: number;
        healthy: number;
        degraded: number;
        offline: number;
    };
    publicRpcCount?: number;
}

// Animated counter hook
function useAnimatedCounter(targetValue: number, duration: number = 1000) {
    const [count, setCount] = useState(0);
    const startTimeRef = useRef<number | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        if (targetValue === 0) {
            setCount(0);
            return;
        }

        const startValue = 0;
        startTimeRef.current = null;

        const animate = (timestamp: number) => {
            if (!startTimeRef.current) {
                startTimeRef.current = timestamp;
            }

            const elapsed = timestamp - startTimeRef.current;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOutQuad = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutQuad);

            setCount(currentValue);

            if (progress < 1) {
                animationFrameRef.current = requestAnimationFrame(animate);
            }
        };

        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [targetValue, duration]);

    return count;
}

// Individual stat card with animated number
function StatCard({ label, value, color, percentage }: {
    label: string;
    value: number;
    color: string;
    percentage: number;
}) {
    const animatedValue = useAnimatedCounter(value, 1200);

    return (
        <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
                <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                />
                <span className="text-sm text-muted-foreground">{label}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-lg font-semibold tabular-nums">
                    {animatedValue.toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground">
                    ({percentage.toFixed(1)}%)
                </span>
            </div>
        </div>
    );
}

export function StatusDistribution({ totals, publicRpcCount = 0 }: StatusDistributionProps) {
    const { total, healthy, degraded, offline } = totals;

    // Calculate private nodes (not public RPC)
    const privateNodes = total - publicRpcCount;

    const chartData = useMemo(() => [
        { name: "Online", value: healthy, color: "#22c55e" },
        { name: "Degraded", value: degraded, color: "#eab308" },
        { name: "Offline", value: offline, color: "#ef4444" },
    ], [healthy, degraded, offline]);

    const statusData = useMemo(() => [
        {
            label: "Public RPC",
            value: publicRpcCount,
            color: "#3b82f6",
            percentage: total > 0 ? (publicRpcCount / total) * 100 : 0,
        },
        {
            label: "Private Nodes",
            value: privateNodes,
            color: "#8b5cf6",
            percentage: total > 0 ? (privateNodes / total) * 100 : 0,
        },
        {
            label: "Online",
            value: healthy,
            color: "#22c55e",
            percentage: total > 0 ? (healthy / total) * 100 : 0,
        },
        {
            label: "Degraded",
            value: degraded,
            color: "#eab308",
            percentage: total > 0 ? (degraded / total) * 100 : 0,
        },
        {
            label: "Not Seen Recently",
            value: offline,
            color: "#ef4444",
            percentage: total > 0 ? (offline / total) * 100 : 0,
        },
    ], [publicRpcCount, privateNodes, healthy, degraded, offline, total]);

    const animatedTotal = useAnimatedCounter(total, 1200);

    return (
        <Card className="border border-border bg-card">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    Status Distribution
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Pie Chart */}
                    <div className="flex-shrink-0">
                        <div className="w-[140px] h-[140px] mx-auto lg:mx-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={35}
                                        outerRadius={60}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "hsl(var(--card))",
                                            border: "1px solid hsl(var(--border))",
                                            borderRadius: "8px",
                                            fontSize: "12px",
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="text-center mt-2">
                            <div className="text-2xl font-bold tabular-nums">{animatedTotal.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">Total Nodes</div>
                        </div>
                    </div>

                    {/* Stats List */}
                    <div className="flex-1 divide-y divide-border">
                        {statusData.map((stat) => (
                            <StatCard
                                key={stat.label}
                                label={stat.label}
                                value={stat.value}
                                color={stat.color}
                                percentage={stat.percentage}
                            />
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
