// import Link from "next/link";
// import { ArrowLeft } from "lucide-react";
// import { InteractiveGlobe } from "@/components/dashboard/interactive-globe";
// import type { PNodeInfo } from "@/types/pnode";

// async function getPNodes(): Promise<PNodeInfo[]> {
//     try {
//         const res = await fetch("http://localhost:3000/api/pnodes", {
//             cache: "no-store",
//         });
//         const data = await res.json();
//         return data.data || [];
//     } catch (error) {
//         console.error("Failed to fetch pNodes:", error);
//         return [];
//     }
// }

// export default async function MapPage() {
//     const pnodes = await getPNodes();

//     return (
//         <main className="relative h-screen w-full overflow-hidden bg-black">
//             <Link
//                 href="/"
//                 className="fixed left-6 top-6 z-50 flex items-center gap-2 rounded-lg border border-border/50 bg-background/80 px-3 py-3 backdrop-blur-sm transition-colors hover:bg-background"
//             >
//                 <ArrowLeft className="h-5 w-5" />
//             </Link>

//             <InteractiveGlobe pnodes={pnodes} />
//         </main>
//     );
// }


"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

// Dynamically import map to avoid SSR issues
const MapComponent = dynamic(() => import("../../components/MapComponent"), {
    ssr: false,
    loading: () => (
        <div className="h-screen flex items-center justify-center bg-gray-900">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-white text-lg">Loading map...</p>
            </div>
        </div>
    ),
}) as React.ComponentType<{ pnodes: PNodeWithGeo[] }>;

interface PNode {
    address: string;
    version: string;
    pubkey: string | null;
    last_seen_timestamp: number;
}

interface PNodeWithGeo extends PNode {
    lat?: number;
    lng?: number;
    city?: string;
    country?: string;
}

// Fetch geolocation from ip-api.com
async function fetchGeoLocation(ip: string): Promise<{
    lat: number;
    lng: number;
    city?: string;
    country?: string;
} | null> {
    try {
        console.log(`[GEO] Fetching location for ${ip}`);
        const response = await fetch(
            `http://ip-api.com/json/${ip}?fields=status,lat,lon,city,country`
        );
        const data = await response.json();

        console.log(`[GEO] Response for ${ip}:`, data);

        if (data.status === "success" && data.lat && data.lon) {
            return {
                lat: data.lat,
                lng: data.lon,
                city: data.city,
                country: data.country,
            };
        }
    } catch (error) {
        console.error(`[GEO] Failed to get location for ${ip}:`, error);
    }
    return null;
}

export default function MapPage() {
    const [pnodes, setPnodes] = useState<PNodeWithGeo[]>([]);
    const [loading, setLoading] = useState(true);
    const [geoLoading, setGeoLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [geoProgress, setGeoProgress] = useState({ current: 0, total: 0 });

    useEffect(() => {
        console.log("[MAP] Starting to fetch pNodes...");

        // First, fetch the pNode list
        fetch("/api/pnodes")
            .then((res) => res.json())
            .then(async (data) => {
                console.log("[MAP] Received pNodes data:", data);

                if (data.success) {
                    const nodes = data.data as PNode[];
                    console.log(`[MAP] Got ${nodes.length} pNodes`);
                    setPnodes(nodes);
                    setLoading(false);

                    // Then fetch geolocation for each node
                    setGeoLoading(true);
                    setGeoProgress({ current: 0, total: nodes.length });

                    const nodesWithGeo: PNodeWithGeo[] = [];

                    // Process in batches to avoid rate limiting
                    const batchSize = 10;
                    for (let i = 0; i < nodes.length; i += batchSize) {
                        const batch = nodes.slice(i, i + batchSize);
                        console.log(`[MAP] Processing batch ${i / batchSize + 1}`);

                        const batchResults = await Promise.all(
                            batch.map(async (node) => {
                                const ip = node.address.split(":")[0];
                                const geo = await fetchGeoLocation(ip);

                                setGeoProgress({
                                    current: i + batch.indexOf(node) + 1,
                                    total: nodes.length,
                                });

                                return {
                                    ...node,
                                    lat: geo?.lat,
                                    lng: geo?.lng,
                                    city: geo?.city,
                                    country: geo?.country,
                                };
                            })
                        );

                        nodesWithGeo.push(...batchResults);

                        // Update state after each batch
                        setPnodes([...nodesWithGeo]);

                        // Small delay between batches to avoid rate limiting
                        if (i + batchSize < nodes.length) {
                            await new Promise((resolve) => setTimeout(resolve, 1500));
                        }
                    }

                    console.log(
                        "[MAP] Geolocation complete. Nodes with coords:",
                        nodesWithGeo.filter((n) => n.lat && n.lng).length
                    );

                    setPnodes(nodesWithGeo);
                    setGeoLoading(false);
                } else {
                    setError("Failed to load pNodes");
                    setLoading(false);
                    setGeoLoading(false);
                }
            })
            .catch((err) => {
                console.error("[MAP] Error:", err);
                setError("Network error");
                setLoading(false);
                setGeoLoading(false);
            });
    }, []);

    if (error) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-900">
                <div className="text-center">
                    <p className="text-red-400 text-lg mb-4">{error}</p>
                    <Link href="/" className="text-blue-400 hover:text-blue-300">
                        ← Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const nodesWithCoords = pnodes.filter((n) => n.lat && n.lng);

    return (
        <div className="relative h-screen w-full bg-black">
            {/* Back Button - Upper Left */}
            <Link
                href="/"
                className="fixed top-6 left-6 z-[1000] flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-all duration-200 border border-white/20"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m12 19-7-7 7-7" />
                    <path d="M19 12H5" />
                </svg>
                <span className="font-medium">Dashboard</span>
            </Link>

            {/* Status Legend - Lower Left */}
            <div className="fixed bottom-6 left-6 z-[1000] bg-black/80 backdrop-blur-md border border-white/20 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full shadow-lg shadow-green-500/50"></div>
                    <span className="text-white font-medium">Healthy</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-lg shadow-yellow-500/50"></div>
                    <span className="text-white font-medium">Degraded</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full shadow-lg shadow-red-500/50"></div>
                    <span className="text-white font-medium">Offline</span>
                </div>

                {/* Loading Counter */}
                {(loading || geoLoading) && (
                    <div className="pt-3 border-t border-white/20">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <span className="text-white/80 text-sm font-medium">
                                {loading ? "Fetching nodes..." : "Geolocating..."}
                            </span>
                        </div>
                        {geoLoading && (
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-white/60">Progress</span>
                                    <span className="text-white font-mono">
                                        {geoProgress.current}/{geoProgress.total}
                                    </span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300 rounded-full"
                                        style={{
                                            width: `${geoProgress.total > 0 ? (geoProgress.current / geoProgress.total) * 100 : 0}%`
                                        }}
                                    ></div>
                                </div>
                                <p className="text-white/60 text-xs">
                                    {nodesWithCoords.length} nodes mapped
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Summary when done loading */}
                {!loading && !geoLoading && (
                    <div className="pt-3 border-t border-white/20">
                        <p className="text-white/60 text-xs">
                            {nodesWithCoords.length} of {pnodes.length} nodes visible
                        </p>
                    </div>
                )}
            </div>

            {/* Map - Full Screen */}
            <div className="h-full w-full">
                {!loading && pnodes.length > 0 && <MapComponent pnodes={pnodes} />}
                {!loading && pnodes.length === 0 && (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-white text-lg">No pNodes found</p>
                    </div>
                )}
            </div>
        </div>
    );
}