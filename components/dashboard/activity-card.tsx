"use client";

import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";

interface ActivityCardProps {
    data?: { time: string; value: number }[];
}

export function ActivityCard({ data }: ActivityCardProps) {
    // Generate mock activity data if not provided
    const activityData = data || Array.from({ length: 24 }, (_, i) => ({
        time: `${i}h`,
        value: Math.floor(Math.random() * 50) + 50,
    }));

    const currentActivity = activityData[activityData.length - 1]?.value || 0;
    const avgActivity = Math.round(
        activityData.reduce((sum, d) => sum + d.value, 0) / activityData.length
    );

    return (
        <Card className="border border-border bg-card">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-muted-foreground" />
                        <h3 className="text-sm font-medium">Activity</h3>
                    </div>
                    <span className="text-xs text-muted-foreground">24h</span>
                </div>

                <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-bold">{currentActivity}%</span>
                    <span className="text-xs text-muted-foreground">avg {avgActivity}%</span>
                </div>

                <div className="h-16">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={activityData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.05} />
                                </linearGradient>
                            </defs>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "var(--card)",
                                    border: "1px solid var(--border)",
                                    borderRadius: "8px",
                                    fontSize: "12px",
                                }}
                                formatter={(value: number) => [`${value}%`, "Activity"]}
                                labelFormatter={(label) => `Time: ${label}`}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#6366f1"
                                strokeWidth={1.5}
                                fill="url(#activityGradient)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
