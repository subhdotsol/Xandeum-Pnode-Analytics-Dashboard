"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Globe } from "lucide-react";

interface GeoNode {
    address?: string;
    version?: string;
    country?: string;
    city?: string;
    [key: string]: unknown;
}

interface GeographicInsightsProps {
    nodes: GeoNode[];
    isLoading?: boolean;
}

// Country abbreviation mapping
const COUNTRY_ABBREV: Record<string, string> = {
    "United States": "US",
    "United Kingdom": "UK",
    "Germany": "DE",
    "France": "FR",
    "Netherlands": "NL",
    "Canada": "CA",
    "Australia": "AU",
    "Japan": "JP",
    "Singapore": "SG",
    "India": "IN",
    "Brazil": "BR",
    "South Korea": "KR",
    "Finland": "FI",
    "Poland": "PL",
    "Italy": "IT",
    "Spain": "ES",
    "Sweden": "SE",
    "Norway": "NO",
    "Denmark": "DK",
    "Switzerland": "CH",
    "Austria": "AT",
    "Belgium": "BE",
    "Ireland": "IE",
    "Portugal": "PT",
    "Czech Republic": "CZ",
    "Romania": "RO",
    "Ukraine": "UA",
    "Russia": "RU",
};

function getCountryAbbrev(country: string): string {
    return COUNTRY_ABBREV[country] || country.slice(0, 2).toUpperCase();
}

function getCityAbbrev(city: string): string {
    return city.length > 4 ? city.slice(0, 3).toUpperCase() : city.toUpperCase();
}

export function GeographicInsights({ nodes, isLoading }: GeographicInsightsProps) {
    // Calculate stats
    const stats = useMemo(() => {
        const nodesWithGeo = nodes.filter(n => n.country);

        // Unique locations (city + country combinations)
        const locations = new Set(
            nodesWithGeo
                .filter(n => n.city)
                .map(n => `${n.city}-${n.country}`)
        );

        // Unique countries
        const countries = new Set(nodesWithGeo.map(n => n.country));

        // Version distribution
        const versionCounts = new Map<string, number>();
        nodes.forEach(n => {
            const ver = (n.version as string) || "Unknown";
            versionCounts.set(ver, (versionCounts.get(ver) || 0) + 1);
        });
        const topVersions = Array.from(versionCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4);

        // Country distribution
        const countryCounts = new Map<string, number>();
        nodesWithGeo.forEach(n => {
            if (n.country) {
                countryCounts.set(n.country, (countryCounts.get(n.country) || 0) + 1);
            }
        });
        const topCountries = Array.from(countryCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
        const maxCountryCount = topCountries[0]?.[1] || 1;

        // City distribution
        const cityCounts = new Map<string, number>();
        nodesWithGeo.forEach(n => {
            if (n.city) {
                cityCounts.set(n.city, (cityCounts.get(n.city) || 0) + 1);
            }
        });
        const topCities = Array.from(cityCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4);
        const maxCityCount = topCities[0]?.[1] || 1;

        return {
            locationCount: locations.size,
            countryCount: countries.size,
            topVersions,
            topCountries,
            maxCountryCount,
            topCities,
            maxCityCount,
        };
    }, [nodes]);

    if (isLoading && stats.countryCount === 0) {
        return (
            <Card className="border border-border bg-card h-full">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Geographic Insights
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[280px]">
                    <div className="text-center">
                        <div className="animate-spin w-6 h-6 border-2 border-foreground/20 border-t-foreground rounded-full mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Loading geo data...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border border-border bg-card h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    Geographic Insights
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Coverage Stats */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20">
                        <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-4 h-4 text-violet-500" />
                        </div>
                        <div className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">{stats.locationCount}</div>
                        <div className="text-xs text-violet-600 dark:text-violet-400 font-medium">Locations</div>
                    </div>
                    <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                        <div className="flex items-center gap-2 mb-1">
                            <Globe className="w-4 h-4 text-blue-500" />
                        </div>
                        <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{stats.countryCount}</div>
                        <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Countries</div>
                    </div>
                </div>

                <div className="h-px bg-border" />

                {/* Version Distribution */}
                <div>
                    <div className="text-xs text-muted-foreground mb-2">Version Distribution</div>
                    <div className="space-y-1.5">
                        {stats.topVersions.map(([version, count]) => (
                            <div key={version} className="flex items-center justify-between text-sm">
                                <span className="font-mono text-xs truncate max-w-[140px]">{version}</span>
                                <span className="text-muted-foreground tabular-nums">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="h-px bg-border" />

                {/* Top Countries */}
                <div>
                    <div className="text-xs text-muted-foreground mb-2">Top Countries</div>
                    <div className="space-y-1.5">
                        {stats.topCountries.map(([country, count], index) => {
                            const gradients = [
                                'from-violet-500 to-purple-500',
                                'from-blue-500 to-cyan-500',
                                'from-emerald-500 to-teal-500',
                                'from-amber-500 to-orange-500',
                                'from-pink-500 to-rose-500',
                            ];
                            const textColors = [
                                'text-violet-600 dark:text-violet-400',
                                'text-blue-600 dark:text-blue-400',
                                'text-emerald-600 dark:text-emerald-400',
                                'text-amber-600 dark:text-amber-400',
                                'text-pink-600 dark:text-pink-400',
                            ];

                            return (
                                <div key={country} className="flex items-center gap-2 text-sm">
                                    <span className={`w-8 shrink-0 font-bold ${textColors[index]}`}>
                                        {getCountryAbbrev(country)}
                                    </span>
                                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden shadow-inner">
                                        <motion.div
                                            className={`h-full rounded-full bg-gradient-to-r ${gradients[index]} shadow-sm`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(count / stats.maxCountryCount) * 100}%` }}
                                            transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
                                        />
                                    </div>
                                    <span className={`${textColors[index]} font-bold tabular-nums w-8 text-right shrink-0`}>
                                        {count}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="h-px bg-border" />

                {/* Top Cities */}
                <div>
                    <div className="text-xs text-muted-foreground mb-2">Top Cities</div>
                    <div className="space-y-1.5">
                        {stats.topCities.map(([city, count], index) => {
                            const gradients = [
                                'from-indigo-500 to-blue-500',
                                'from-cyan-500 to-teal-500',
                                'from-green-500 to-emerald-500',
                                'from-orange-500 to-amber-500',
                            ];
                            const textColors = [
                                'text-indigo-600 dark:text-indigo-400',
                                'text-cyan-600 dark:text-cyan-400',
                                'text-green-600 dark:text-green-400',
                                'text-orange-600 dark:text-orange-400',
                            ];

                            return (
                                <div key={city} className="flex items-center gap-2 text-sm">
                                    <span className={`w-10 shrink-0 font-bold ${textColors[index]}`}>
                                        {getCityAbbrev(city)}
                                    </span>
                                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden shadow-inner">
                                        <motion.div
                                            className={`h-full rounded-full bg-gradient-to-r ${gradients[index]} shadow-sm`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(count / stats.maxCityCount) * 100}%` }}
                                            transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 + 0.3 }}
                                        />
                                    </div>
                                    <span className={`${textColors[index]} font-bold tabular-nums w-6 text-right shrink-0`}>
                                        {count}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
