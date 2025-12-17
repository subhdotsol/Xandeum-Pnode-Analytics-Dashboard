"use client";

import { motion } from "framer-motion";
import { Activity, Server, AlertTriangle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NetworkHealthCardProps {
    score: number;
    totals: {
        total: number;
        healthy: number;
        degraded: number;
        offline: number;
    };
    health: {
        healthyPercentage: number;
        degradedPercentage: number;
        offlinePercentage: number;
    };
}

export function NetworkHealthCard({
    score,
    totals,
    health,
}: NetworkHealthCardProps) {
    const getHealthColor = () => {
        if (score >= 80) return "#14F1C6";
        if (score >= 60) return "#F59E0B";
        return "#EF4444";
    };

    const getHealthStatus = () => {
        if (score >= 80) return "Excellent";
        if (score >= 60) return "Good";
        if (score >= 40) return "Fair";
        return "Poor";
    };

    return (
        <Card className="light-card dark:glass-card-strong border-border h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-accent" />
                    <span className="notion-text-gradient dark:text-foreground">Network Health</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Large Score Display */}
                <div className="flex flex-col items-center justify-center py-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="relative"
                    >
                        <svg className="w-48 h-48 -rotate-90">
                            <circle
                                cx="96"
                                cy="96"
                                r="80"
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth="12"
                                fill="none"
                            />
                            <motion.circle
                                cx="96"
                                cy="96"
                                r="80"
                                stroke={getHealthColor()}
                                strokeWidth="12"
                                fill="none"
                                strokeLinecap="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: score / 100 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                style={{
                                    strokeDasharray: 502.65,
                                    strokeDashoffset: 502.65 - (502.65 * score) / 100,
                                    filter: `drop-shadow(0 0 10px ${getHealthColor()})`,
                                }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-6xl font-bold"
                                style={{ color: getHealthColor() }}
                            >
                                {score}
                            </motion.span>
                            <span className="text-sm text-muted-foreground mt-1">
                                {getHealthStatus()}
                            </span>
                        </div>
                    </motion.div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-center p-4 rounded-lg bg-neo-teal/10 border border-neo-teal/20"
                    >
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Server className="w-4 h-4 text-neo-teal" />
                            <span className="text-xs text-muted-foreground">Healthy</span>
                        </div>
                        <div className="text-2xl font-bold text-neo-teal">
                            {totals.healthy}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                            {health.healthyPercentage.toFixed(1)}%
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-center p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20"
                    >
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-500" />
                            <span className="text-xs text-muted-foreground">Degraded</span>
                        </div>
                        <div className="text-2xl font-bold text-yellow-500">
                            {totals.degraded}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                            {health.degradedPercentage.toFixed(1)}%
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-center p-4 rounded-lg bg-red-500/10 border border-red-500/20"
                    >
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <XCircle className="w-4 h-4 text-red-500" />
                            <span className="text-xs text-muted-foreground">Offline</span>
                        </div>
                        <div className="text-2xl font-bold text-red-500">
                            {totals.offline}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                            {health.offlinePercentage.toFixed(1)}%
                        </div>
                    </motion.div>
                </div>

                {/* Progress Bars */}
                <div className="space-y-3">
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Network Status</span>
                            <span className="text-foreground">{totals.total} nodes</span>
                        </div>
                        <div className="h-2 bg-muted/20 rounded-full overflow-hidden flex">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${health.healthyPercentage}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="bg-neo-teal"
                            />
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${health.degradedPercentage}%` }}
                                transition={{ duration: 1, delay: 0.6 }}
                                className="bg-yellow-500"
                            />
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${health.offlinePercentage}%` }}
                                transition={{ duration: 1, delay: 0.7 }}
                                className="bg-red-500"
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
