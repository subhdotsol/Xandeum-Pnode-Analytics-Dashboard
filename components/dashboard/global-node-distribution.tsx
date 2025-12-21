"use client";

import { useMemo, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, MapPin, Server, Wifi, WifiOff, Eye } from "lucide-react";

interface NodeData {
    address: string;
    country?: string;
    city?: string;
}

interface GlobalNodeDistributionProps {
    nodes: NodeData[];
}

// Country flag emoji lookup
const countryFlags: Record<string, string> = {
    "Germany": "🇩🇪",
    "United States": "🇺🇸",
    "Finland": "🇫🇮",
    "France": "🇫🇷",
    "Netherlands": "🇳🇱",
    "United Kingdom": "🇬🇧",
    "Canada": "🇨🇦",
    "Japan": "🇯🇵",
    "Singapore": "🇸🇬",
    "Australia": "🇦🇺",
    "Brazil": "🇧🇷",
    "India": "🇮🇳",
    "Poland": "🇵🇱",
    "Sweden": "🇸🇪",
    "Switzerland": "🇨🇭",
    "Russia": "🇷🇺",
    "Ukraine": "🇺🇦",
    "Italy": "🇮🇹",
    "Spain": "🇪🇸",
    "South Korea": "🇰🇷",
};

export function GlobalNodeDistribution({ nodes }: GlobalNodeDistributionProps) {
    const [healthStats, setHealthStats] = useState({ healthy: 0, degraded: 0, offline: 0 });

    // Fetch health stats from analytics
    useEffect(() => {
        async function fetchHealth() {
            try {
                const res = await fetch("/api/analytics");
                if (res.ok) {
                    const data = await res.json();
                    setHealthStats({
                        healthy: data.health?.healthy || 0,
                        degraded: data.health?.degraded || 0,
                        offline: data.health?.offline || 0,
                    });
                }
            } catch (err) {
                console.error("Failed to fetch health stats", err);
            }
        }
        fetchHealth();
    }, []);

    const distribution = useMemo(() => {
        const countryCount = new Map<string, { count: number; cities: Set<string> }>();

        nodes.forEach(node => {
            if (node.country) {
                const existing = countryCount.get(node.country) || { count: 0, cities: new Set<string>() };
                existing.count++;
                if (node.city) existing.cities.add(node.city);
                countryCount.set(node.country, existing);
            }
        });

        const total = nodes.filter(n => n.country).length;
        const uniqueCountries = countryCount.size;

        const topCountries = Array.from(countryCount.entries())
            .map(([country, data]) => ({
                country,
                count: data.count,
                cities: data.cities.size,
                percentage: total > 0 ? (data.count / total) * 100 : 0,
                flag: countryFlags[country] || "🌍"
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 6);

        return { topCountries, uniqueCountries, total };
    }, [nodes]);

    return (
        <Card className="border border-border bg-card">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <Globe className="w-4 h-4 text-blue-500" />
                    Global Node Distribution
                </CardTitle>
                <p className="text-xs text-muted-foreground">Network geography and status overview</p>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-3">
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <MapPin className="w-4 h-4 text-blue-500" />
                        </div>
                        <p className="text-2xl font-bold">{distribution.uniqueCountries}</p>
                        <p className="text-xs text-muted-foreground">Locations</p>
                    </div>

                    <div className="text-center p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <Server className="w-4 h-4 text-green-500" />
                        </div>
                        <p className="text-2xl font-bold text-green-500">{healthStats.healthy}</p>
                        <p className="text-xs text-muted-foreground">Online</p>
                    </div>

                    <div className="text-center p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <Eye className="w-4 h-4 text-yellow-500" />
                        </div>
                        <p className="text-2xl font-bold text-yellow-500">{healthStats.degraded}</p>
                        <p className="text-xs text-muted-foreground">Degraded</p>
                    </div>

                    <div className="text-center p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <WifiOff className="w-4 h-4 text-red-500" />
                        </div>
                        <p className="text-2xl font-bold text-red-500">{healthStats.offline}</p>
                        <p className="text-xs text-muted-foreground">Offline</p>
                    </div>
                </div>

                {/* Geographic Insights */}
                <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        Geographic Insights
                    </h4>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                        {distribution.topCountries.map((item, idx) => (
                            <div
                                key={item.country}
                                className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                            >
                                <span className="text-lg">{item.flag}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{item.country}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {item.count} nodes • {item.cities} {item.cities === 1 ? 'city' : 'cities'}
                                    </p>
                                </div>
                                <span className="text-xs font-mono text-muted-foreground">
                                    {item.percentage.toFixed(0)}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Distribution Bar */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground">Network Distribution</span>
                        <span className="text-xs text-muted-foreground">{distribution.total} geolocated</span>
                    </div>
                    <div className="h-3 rounded-full overflow-hidden flex bg-muted">
                        <div
                            className="bg-green-500 transition-all duration-500"
                            style={{ width: `${(healthStats.healthy / (healthStats.healthy + healthStats.degraded + healthStats.offline)) * 100 || 0}%` }}
                        />
                        <div
                            className="bg-yellow-500 transition-all duration-500"
                            style={{ width: `${(healthStats.degraded / (healthStats.healthy + healthStats.degraded + healthStats.offline)) * 100 || 0}%` }}
                        />
                        <div
                            className="bg-red-500 transition-all duration-500"
                            style={{ width: `${(healthStats.offline / (healthStats.healthy + healthStats.degraded + healthStats.offline)) * 100 || 0}%` }}
                        />
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            <span>Online</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-yellow-500" />
                            <span>Degraded</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                            <span>Offline</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
