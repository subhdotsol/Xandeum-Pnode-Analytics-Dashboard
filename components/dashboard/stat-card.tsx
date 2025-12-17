"use client";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    iconName: keyof typeof LucideIcons;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    delay?: number;
}

export function StatCard({
    title,
    value,
    subtitle,
    iconName,
    trend,
    delay = 0,
}: StatCardProps) {
    const Icon = LucideIcons[iconName] as any;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
        >
            <Card className="glass-card border-space-border hover-lift cursor-pointer">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                            <p className="text-sm text-muted-foreground">{title}</p>
                            <motion.p
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: delay + 0.2 }}
                                className="text-3xl font-bold"
                            >
                                {value}
                            </motion.p>
                            {subtitle && (
                                <p className="text-xs text-muted-foreground">{subtitle}</p>
                            )}
                            {trend && (
                                <div
                                    className={`text-xs font-medium ${trend.isPositive ? "text-green-500" : "text-red-500"
                                        }`}
                                >
                                    {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                                </div>
                            )}
                        </div>
                        <div className="p-3 bg-primary/10 rounded-lg">
                            <Icon className="w-6 h-6 text-primary" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
