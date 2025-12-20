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
        <Card className="border border-border bg-card">
            <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <Activity className="w-4 h-4" />
                    Network Health
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-4 pb-4">
                {/* Score Display - Compact */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-baseline gap-2">
                        <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
                            {score}
                        </span>
                        <span className="text-xs text-muted-foreground">/ 100</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                        {getScoreLabel(score)}
                    </Badge>
                </div>

                {/* Health Metrics - Compact */}
                <div className="grid grid-cols-3 gap-2">
                    {metrics.map((metric) => (
                        <div
                            key={metric.label}
                            className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/30"
                        >
                            <div className={`p-1.5 rounded-lg ${metric.bgColor}`}>
                                <metric.icon className={`w-3 h-3 ${metric.color}`} />
                            </div>
                            <div className="text-lg font-bold">{metric.value}</div>
                            <div className="text-xs text-muted-foreground">
                                {metric.label} ({metric.percentage.toFixed(0)}%)
                            </div>
                        </div>
                    ))}
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Distribution</span>
                        <span>{totals.total} nodes</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden flex">
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

