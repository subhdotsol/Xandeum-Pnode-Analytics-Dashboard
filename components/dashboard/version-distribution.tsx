"use client";

import { motion } from "framer-motion";
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

const COLORS = ["#14F1C6", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6"];

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
        <Card className="glass-card border-space-border">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <PackageCheck className="w-5 h-5 text-neo-teal" />
                    <span className="gradient-text">Version Distribution</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Chart */}
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ percentage }) => `${percentage}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(13, 27, 42, 0.95)",
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                    borderRadius: "8px",
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Version List */}
                <div className="space-y-2">
                    {data.map((item, index) => (
                        <motion.div
                            key={item.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/20"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                />
                                <span className="font-mono text-sm">
                                    v{item.name}
                                    {item.name === latest && (
                                        <span className="ml-2 text-xs text-neo-teal">(Latest)</span>
                                    )}
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="font-bold">{item.value}</span>{" "}
                                <span className="text-muted-foreground">
                                    ({item.percentage}%)
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Outdated Warning */}
                {outdatedPercentage > 20 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20"
                    >
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-yellow-500">
                                    {outdatedCount} nodes running outdated versions
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {outdatedPercentage.toFixed(1)}% of the network should upgrade
                                    to v{latest}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </CardContent>
        </Card>
    );
}
