"use client";

import {
    Activity,
    CheckCircle2,
    AlertTriangle,
    XCircle,
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
        if (score >= 80) return "text-green-600 dark:text-green-400";
        if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
        return "text-red-600 dark:text-red-400";
    };

    const getScoreLabel = (score: number) => {
        if (score >= 80) return "Excellent";
        if (score >= 60) return "Good";
        return "Needs Attention";
    };

    const healthyPercentage = (health.healthy / totals.total) * 100;
    const degradedPercentage = (health.degraded / totals.total) * 100;
    const offlinePercentage = (health.offline / totals.total) * 100;

    const metrics = [
        {
            label: "Healthy",
            value: health.healthy,
            percentage: healthyPercentage,
            icon: CheckCircle2,
            color: "text-green-600 dark:text-green-400",
            bgColor: "bg-green-100 dark:bg-green-900/30",
            barColor: "bg-green-500",
        },
        {
            label: "Degraded",
            value: health.degraded,
            percentage: degradedPercentage,
            icon: AlertTriangle,
            color: "text-yellow-600 dark:text-yellow-400",
            bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
            barColor: "bg-yellow-500",
        },
        {
            label: "Offline",
            value: health.offline,
            percentage: offlinePercentage,
            icon: XCircle,
            color: "text-red-600 dark:text-red-400",
            bgColor: "bg-red-100 dark:bg-red-900/30",
            barColor: "bg-red-500",
        },
    ];

    return (
        <Card className="border border-border bg-card h-full">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                    <Activity className="w-5 h-5" />
                    Network Health
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Score Display */}
                <div className="flex items-center justify-between p-6 rounded-lg bg-muted/50">
                    <div>
                        <div className={`text-5xl font-bold ${getScoreColor(score)}`}>
                            {score}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                            out of 100
                        </div>
                    </div>
                    <Badge variant="secondary" className="text-sm">
                        {getScoreLabel(score)}
                    </Badge>
                </div>

                {/* Health Metrics */}
                <div className="grid grid-cols-3 gap-4">
                    {metrics.map((metric) => (
                        <div
                            key={metric.label}
                            className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/30"
                        >
                            <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                                <metric.icon className={`w-4 h-4 ${metric.color}`} />
                            </div>
                            <div className="text-xl font-bold">{metric.value}</div>
                            <div className="text-xs text-muted-foreground">
                                {metric.label}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {metric.percentage.toFixed(1)}%
                            </div>
                        </div>
                    ))}
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Distribution</span>
                        <span>{totals.total} nodes</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden flex">
                        <div
                            style={{ width: `${healthyPercentage}%` }}
                            className="bg-green-500"
                        />
                        <div
                            style={{ width: `${degradedPercentage}%` }}
                            className="bg-yellow-500"
                        />
                        <div
                            style={{ width: `${offlinePercentage}%` }}
                            className="bg-red-500"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
