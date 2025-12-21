"use client";

import { useMemo } from "react";
import { Globe, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GeoNode {
    country?: string;
    city?: string;
}

interface GeographicDistributionProps {
    nodes: Array<{ country?: string; city?: string }>;
}

// Country flag emoji map
const countryFlags: Record<string, string> = {
    "United States": "🇺🇸",
    "Germany": "🇩🇪",
    "France": "🇫🇷",
    "United Kingdom": "🇬🇧",
    "Netherlands": "🇳🇱",
    "Canada": "🇨🇦",
    "Singapore": "🇸🇬",
    "Japan": "🇯🇵",
    "Australia": "🇦🇺",
    "Finland": "🇫🇮",
    "Sweden": "🇸🇪",
    "Switzerland": "🇨🇭",
    "Ireland": "🇮🇪",
    "Poland": "🇵🇱",
    "India": "🇮🇳",
    "Brazil": "🇧🇷",
    "South Korea": "🇰🇷",
    "Spain": "🇪🇸",
    "Italy": "🇮🇹",
    "Russia": "🇷🇺",
    "China": "🇨🇳",
    "Hong Kong": "🇭🇰",
    "Taiwan": "🇹🇼",
    "Vietnam": "🇻🇳",
    "Indonesia": "🇮🇩",
    "Malaysia": "🇲🇾",
    "Thailand": "🇹🇭",
    "Philippines": "🇵🇭",
    "Mexico": "🇲🇽",
    "Argentina": "🇦🇷",
    "Chile": "🇨🇱",
    "Colombia": "🇨🇴",
    "South Africa": "🇿🇦",
    "Nigeria": "🇳🇬",
    "Egypt": "🇪🇬",
    "Israel": "🇮🇱",
    "United Arab Emirates": "🇦🇪",
    "Turkey": "🇹🇷",
    "Ukraine": "🇺🇦",
    "Czech Republic": "🇨🇿",
    "Austria": "🇦🇹",
    "Belgium": "🇧🇪",
    "Denmark": "🇩🇰",
    "Norway": "🇳🇴",
    "Portugal": "🇵🇹",
    "Romania": "🇷🇴",
    "Bulgaria": "🇧🇬",
    "Greece": "🇬🇷",
    "Hungary": "🇭🇺",
};

export function GeographicDistribution({ nodes }: GeographicDistributionProps) {
    const distribution = useMemo(() => {
        const countryCount = new Map<string, number>();

        nodes.forEach(node => {
            if (node.country) {
                countryCount.set(node.country, (countryCount.get(node.country) || 0) + 1);
            }
        });

        const total = nodes.filter(n => n.country).length;

        return Array.from(countryCount.entries())
            .map(([country, count]) => ({
                country,
                count,
                percentage: total > 0 ? (count / total) * 100 : 0,
                flag: countryFlags[country] || "🌍"
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10); // Top 10 countries
    }, [nodes]);

    const totalCountries = useMemo(() => {
        return new Set(nodes.filter(n => n.country).map(n => n.country)).size;
    }, [nodes]);

    if (distribution.length === 0) {
        return (
            <Card className="border border-border bg-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                        <Globe className="w-5 h-5" />
                        Global Distribution
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground text-center py-8">
                        Loading geographic data...
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border border-border bg-card">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                        <Globe className="w-5 h-5" />
                        Global Distribution
                    </CardTitle>
                    <span className="text-sm text-muted-foreground">
                        {totalCountries} countries
                    </span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {distribution.map((item, index) => (
                        <div key={item.country} className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground w-4">{index + 1}</span>
                            <span className="text-lg">{item.flag}</span>
                            <span className="text-sm font-medium flex-1 truncate">{item.country}</span>
                            <div className="flex items-center gap-2">
                                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-primary/50 to-primary rounded-full transition-all duration-500"
                                        style={{ width: `${item.percentage}%` }}
                                    />
                                </div>
                                <span className="text-sm text-muted-foreground w-12 text-right">
                                    {item.count}
                                </span>
                                <span className="text-xs text-muted-foreground w-12 text-right">
                                    {item.percentage.toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {distribution.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            Top location
                        </span>
                        <span className="font-medium">
                            {distribution[0]?.flag} {distribution[0]?.country}
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
