"use client";

import { motion } from "framer-motion";

// Radial Progress Component
export function RadialProgress({
    label,
    value,
    icon,
    color,
}: {
    label: string;
    value: number;
    icon: string;
    color: string;
}) {
    const circumference = 2 * Math.PI * 70;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-6 rounded-2xl border border-border/50 hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/10 group"
        >
            <div className="flex flex-col items-center justify-center">
                <div className="relative w-40 h-40">
                    {/* Background circle */}
                    <svg className="transform -rotate-90 w-40 h-40">
                        <circle
                            cx="80"
                            cy="80"
                            r="70"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-muted"
                        />
                        {/* Progress circle */}
                        <circle
                            cx="80"
                            cy="80"
                            r="70"
                            stroke={`hsl(var(--primary))`}
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out drop-shadow-lg"
                            style={{ stroke: `hsl(var(--primary))` }}
                        />
                    </svg>
                    {/* Center content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-3xl mb-1">{icon}</div>
                        <div className={`text-2xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                            {value.toFixed(1)}%
                        </div>
                    </div>
                </div>
                <div className="mt-4 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {label}
                </div>
            </div>
        </motion.div>
    );
}

// Animated Stat Card
export function AnimatedStatCard({
    label,
    value,
    icon,
    delay,
}: {
    label: string;
    value: string;
    icon: string;
    delay: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: delay / 1000 }}
            className="glass-card p-4 rounded-xl border border-border/50 hover:border-primary/50 transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/10"
        >
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">{label}</p>
                    <p className="text-lg font-bold">{value}</p>
                </div>
                <div className="text-3xl opacity-60">{icon}</div>
            </div>
        </motion.div>
    );
}

// Glass Card Component
export function GlassCard({
    title,
    icon,
    children,
}: {
    title: string;
    icon: string;
    children: React.ReactNode;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-6 rounded-2xl border border-border/50 hover:border-primary/30 transition-all hover:shadow-xl"
        >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>{icon}</span>
                <span className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                    {title}
                </span>
            </h2>
            {children}
        </motion.div>
    );
}

// Info Item
export function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col gap-1 p-3 rounded-lg glass-card border border-border/30">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-sm font-mono font-medium truncate">{value}</span>
        </div>
    );
}

// Metric Box
export function MetricBox({
    label,
    value,
    color,
}: {
    label: string;
    value: number;
    color: string;
}) {
    return (
        <div className="glass-card p-4 rounded-xl border border-border/30 text-center">
            <div className={`text-2xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent mb-1`}>
                {value}
            </div>
            <div className="text-xs text-muted-foreground">{label}</div>
        </div>
    );
}

// Animated Bar
export function AnimatedBar({
    label,
    value,
    max,
    color,
}: {
    label: string;
    value: number;
    max: number;
    color: string;
}) {
    const percentage = max > 0 ? (value / max) * 100 : 0;

    return (
        <div>
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>{label}</span>
                <span className="font-mono">{value}</span>
            </div>
            <div className="h-3 bg-muted/50 rounded-full overflow-hidden backdrop-blur-sm">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full ${color} rounded-full shadow-lg`}
                />
            </div>
        </div>
    );
}

// Storage Heatmap
export function StorageHeatmap({ percentage }: { percentage: number }) {
    return (
        <div className="grid grid-cols-4 gap-1 p-4 glass-card rounded-lg">
            {Array.from({ length: 16 }).map((_, i) => {
                const isActive = (i / 16) * 100 < percentage;
                return (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05, duration: 0.3 }}
                        className={`h-8 rounded transition-all duration-500 ${isActive
                                ? 'bg-gradient-to-br from-primary to-primary/60 shadow-lg shadow-primary/20'
                                : 'bg-muted'
                            }`}
                    />
                );
            })}
        </div>
    );
}
