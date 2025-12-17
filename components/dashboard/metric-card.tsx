"use client";

import { motion } from "framer-motion";
import { Activity, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
    title: string;
    value: string | number;
    change?: {
        value: number;
        isPositive: boolean;
    };
    icon?: React.ReactNode;
    delay?: number;
    colorClass?: string;
}

export function MetricCard({
    title,
    value,
    change,
    icon,
    delay = 0,
    colorClass = "primary",
}: MetricCardProps) {
    const colorMap = {
        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
        accent: "hsl(var(--accent))",
        chart1: "hsl(var(--chart-1))",
        chart2: "hsl(var(--chart-2))",
        chart3: "hsl(var(--chart-3))",
    };

    const color = colorMap[colorClass as keyof typeof colorMap] || colorMap.primary;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
        >
            <Card className="glass-card-strong border-border card-hover overflow-hidden relative shimmer group">
                {/* Colored accent border */}
                <div
                    className="absolute top-0 left-0 w-1.5 h-full transition-all duration-300 group-hover:w-2"
                    style={{ backgroundColor: color }}
                />
                {/* Subtle top glow */}
                <div
                    className="absolute top-0 left-0 right-0 h-px opacity-50"
                    style={{ backgroundColor: color }}
                />
                <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                        <div className="space-y-3 flex-1">
                            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                {title}
                            </p>
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: delay + 0.2, type: "spring", stiffness: 200 }}
                            >
                                <p className="text-4xl font-bold tracking-tight">{value}</p>
                            </motion.div>
                            {change && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: delay + 0.4 }}
                                    className={`flex items-center gap-1.5 text-sm font-semibold ${change.isPositive ? "text-green-400" : "text-red-400"
                                        }`}
                                >
                                    {change.isPositive ? (
                                        <TrendingUp className="w-4 h-4" />
                                    ) : (
                                        <TrendingDown className="w-4 h-4" />
                                    )}
                                    <span>{Math.abs(change.value)}%</span>
                                </motion.div>
                            )}
                        </div>
                        {icon && (
                            <motion.div
                                className="p-4 rounded-xl relative"
                                style={{
                                    backgroundColor: `${color}15`,
                                    borderColor: `${color}30`,
                                }}
                                whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div style={{ color }}>{icon}</div>
                                <div
                                    className="absolute inset-0 rounded-xl blur-xl opacity-40"
                                    style={{ backgroundColor: color }}
                                />
                            </motion.div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
