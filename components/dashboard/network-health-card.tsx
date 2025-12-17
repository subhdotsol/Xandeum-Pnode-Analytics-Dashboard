"use client";

import { motion } from "framer-motion";
import {
    Activity,
    TrendingUp,
    TrendingDown,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    Zap,
    Shield,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { NetworkTotals, NetworkHealth } from "@/types/pnode";

interface NetworkHealthCardProps {
    score: number;
    totals: NetworkTotals;
    health: NetworkHealth;
}

export function NetworkHealthCard({
    score,
    totals,
    health,
}: NetworkHealthCardProps) {
    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-500";
        if (score >= 60) return "text-yellow-500";
        return "text-red-500";
    };

    const getScoreGradient = (score: number) => {
        if (score >= 80)
            return "from-green-500/20 to-emerald-500/20 dark:from-green-500/10 dark:to-emerald-500/10";
        if (score >= 60)
            return "from-yellow-500/20 to-orange-500/20 dark:from-yellow-500/10 dark:to-orange-500/10";
        return "from-red-500/20 to-rose-500/20 dark:from-red-500/10 dark:to-rose-500/10";
    };

    const healthyPercentage = (health.healthy / totals.total) * 100;
    const degradedPercentage = (health.degraded / totals.total) * 100;
    const offlinePercentage = (health.offline / totals.total) * 100;

    const metrics = [
        {
            label: "Healthy Nodes",
            value: health.healthy,
            percentage: healthyPercentage,
            icon: CheckCircle2,
            color: "text-green-500",
            bgColor: "bg-green-500/10",
        },
        {
            label: "Degraded Nodes",
            value: health.degraded,
            percentage: degradedPercentage,
            icon: AlertTriangle,
            color: "text-yellow-500",
            bgColor: "bg-yellow-500/10",
        },
        {
            label: "Offline Nodes",
            value: health.offline,
            percentage: offlinePercentage,
            icon: XCircle,
            color: "text-red-500",
            bgColor: "bg-red-500/10",
        },
    ];

    return (
        <Card className="light-card dark:glass-card-strong border-border h-full overflow-hidden">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-accent" />
                    <span className="dark:notion-text-gradient">
                        Network Health
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Score Display with Status Badge */}
                <div
                    className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${getScoreGradient(
                        score
                    )} p-8 border border-border/50`}
                >
                    <div className="relative z-10 flex flex-col items-center justify-center gap-4">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="text-7xl font-bold notion-text-gradient dark:text-foreground">
                                {score}
                            </div>
                            <div className="text-sm text-muted-foreground text-center mt-1">
                                out of 100
                            </div>
                        </motion.div>

                        <Badge
                            variant={score >= 80 ? "default" : score >= 60 ? "secondary" : "destructive"}
                            className="text-xs px-3 py-1"
                        >
                            {score >= 80 ? (
                                <>
                                    <Shield className="w-3 h-3 mr-1" /> Excellent
                                </>
                            ) : score >= 60 ? (
                                <>
                                    <Zap className="w-3 h-3 mr-1" /> Good
                                </>
                            ) : (
                                <>
                                    <AlertTriangle className="w-3 h-3 mr-1" /> Needs Attention
                                </>
                            )}
                        </Badge>
                    </div>

                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-accent/5 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-primary/5 blur-2xl" />
                </div>

                {/* Health Metrics Grid */}
                <div className="grid grid-cols-3 gap-4">
                    {metrics.map((metric, index) => (
                        <motion.div
                            key={metric.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 + 0.3 }}
                            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                            <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                                <metric.icon className={`w-5 h-5 ${metric.color}`} />
                            </div>
                            <div className="text-2xl font-bold">{metric.value}</div>
                            <div className="text-xs text-muted-foreground text-center">
                                {metric.label}
                            </div>
                            <div className="text-xs font-semibold text-muted-foreground">
                                {metric.percentage.toFixed(1)}%
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Progress Bars */}
                <div className="space-y-3">
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Network Distribution</span>
                            <span>{totals.total} total nodes</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden flex">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${healthyPercentage}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="bg-green-500"
                            />
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${degradedPercentage}%` }}
                                transition={{ duration: 1, delay: 0.6 }}
                                className="bg-yellow-500"
                            />
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${offlinePercentage}%` }}
                                transition={{ duration: 1, delay: 0.7 }}
                                className="bg-red-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Trend Indicator (Mock data - could be real in future) */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium">Network Trending Up</span>
                    </div>
                    <span className="text-sm text-muted-foreground">+2.3% vs last hour</span>
                </div>
            </CardContent>
        </Card>
    );
}
