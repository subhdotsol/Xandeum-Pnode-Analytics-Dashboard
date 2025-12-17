"use client";

import * as React from "react";
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

// Use CSS variables for dynamic theming
const getChartColors = () => {
    if (typeof window === "undefined") return [];
    const styles = getComputedStyle(document.documentElement);
    return [
        styles.getPropertyValue("--chart-1").trim() || "217 91% 60%",
        styles.getPropertyValue("--chart-2").trim() || "25 95% 53%",
        styles.getPropertyValue("--chart-3").trim() || "142 71% 45%",
        styles.getPropertyValue("--chart-4").trim() || "280 65% 60%",
        styles.getPropertyValue("--chart-5").trim() || "340 82% 52%",
    ].map(hsl => `hsl(${hsl})`);
};

const FALLBACK_COLORS = [
    "hsl(217 91% 60%)",  // Blue
    "hsl(25 95% 53%)",   // Orange
    "hsl(142 71% 45%)",  // Green
    "hsl(280 65% 60%)",  // Purple
    "hsl(340 82% 52%)",  // Pink
];

export function VersionDistribution({
    distribution,
    latest,
    outdatedCount,
    outdatedPercentage,
    total,
}: VersionDistributionProps) {
    const [colors, setColors] = React.useState(FALLBACK_COLORS);

    React.useEffect(() => {
        const chartColors = getChartColors();
        if (chartColors.length > 0) {
            setColors(chartColors);
        }
    }, []);

    const data = Object.entries(distribution).map(([version, count]) => ({
        name: version,
        value: count,
        percentage: ((count / total) * 100).toFixed(1),
    }));

    return (
        <Card className="glass-card-strong border-border h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <PackageCheck className="w-5 h-5 text-primary" />
                    <span>Version Distribution</span>
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
                                        fill={colors[index % colors.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--card))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "8px",
                                    color: "hsl(var(--foreground))",
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
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: colors[index % colors.length] }}
                                />
                                <span className="font-mono text-sm">
                                    v{item.name}
                                    {item.name === latest && (
                                        <span className="ml-2 text-xs text-primary font-semibold">
                                            (Latest)
                                        </span>
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
                            <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
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
