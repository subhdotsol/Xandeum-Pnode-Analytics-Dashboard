"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useMemo } from "react";
import Link from "next/link";

// Create custom colored icons
function createColoredIcon(color: string) {
    return L.divIcon({
        className: "custom-marker",
        html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10],
    });
}

interface PNode {
    address: string;
    version: string;
    pubkey: string | null;
    last_seen_timestamp: number;
    lat?: number;
    lng?: number;
    city?: string;
    country?: string;
}

interface PNodeWithLocation extends PNode {
    lat: number;
    lng: number;
    status: "online" | "recent" | "offline";
}

function getNodeStatus(
    lastSeenTimestamp: number
): "online" | "recent" | "offline" {
    const now = Date.now() / 1000;
    const diff = now - lastSeenTimestamp;

    if (diff < 300) return "online";
    if (diff < 3600) return "recent";
    return "offline";
}

function formatTimeAgo(timestamp: number) {
    const now = Date.now() / 1000;
    const diff = now - timestamp;

    if (diff < 60) return `${Math.floor(diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

export default function MapComponent({ pnodes }: { pnodes: PNode[] }) {
    const pnodesWithLocation = useMemo(() => {
        return pnodes
            .filter((pnode) => pnode.lat && pnode.lng) // Only include nodes with valid coordinates
            .map((pnode) => ({
                ...pnode,
                lat: pnode.lat!,
                lng: pnode.lng!,
                status: getNodeStatus(pnode.last_seen_timestamp),
            })) as PNodeWithLocation[];
    }, [pnodes]);

    const getMarkerColor = (status: string) => {
        switch (status) {
            case "online":
                return "#22c55e"; // Green - Healthy
            case "recent":
                return "#eab308"; // Yellow - Degraded
            case "offline":
                return "#ef4444"; // Red - Offline
            default:
                return "#3b82f6";
        }
    };

    return (
        <MapContainer
            center={[20, 0]}
            zoom={2}
            className="h-full w-full"
            style={{ background: "#1f2937" }}
            minZoom={2}
            maxBounds={[
                [-90, -180],
                [90, 180],
            ]}
            maxBoundsViscosity={1.0}
        >
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />

            {pnodesWithLocation.map((node) => (
                <Marker
                    key={node.address}
                    position={[node.lat, node.lng]}
                    icon={createColoredIcon(getMarkerColor(node.status))}
                >
                    <Popup>
                        <div className="bg-black/95 backdrop-blur-lg border border-white/30 rounded-2xl p-6 min-w-[280px] shadow-2xl">
                            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/20">
                                <div
                                    className="w-5 h-5 rounded-full shadow-lg"
                                    style={{
                                        backgroundColor: getMarkerColor(node.status),
                                        boxShadow: `0 0 12px ${getMarkerColor(node.status)}AA`
                                    }}
                                />
                                <span className="font-bold text-base capitalize text-white">
                                    {node.status}
                                </span>
                            </div>

                            <div className="space-y-4 text-sm">
                                {node.city && node.country && (
                                    <div>
                                        <span className="text-gray-400 text-xs uppercase tracking-wide">Location</span>
                                        <p className="font-semibold text-white mt-1 text-base">
                                            📍 {node.city}, {node.country}
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <span className="text-gray-400 text-xs uppercase tracking-wide block mb-1">Address</span>
                                    <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg border border-white/10">
                                        <p className="font-mono text-white text-xs flex-1">{node.address}</p>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(node.address);
                                            }}
                                            className="text-white/60 hover:text-white transition-colors p-1"
                                            title="Copy address"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-gray-400 text-xs uppercase tracking-wide">Version</span>
                                    <p className="font-semibold text-white mt-1">{node.version}</p>
                                </div>

                                {node.pubkey && (
                                    <div>
                                        <span className="text-gray-400 text-xs uppercase tracking-wide block mb-1">Pubkey</span>
                                        <div className="flex items-start gap-2 bg-white/5 px-3 py-2 rounded-lg border border-white/10">
                                            <p className="font-mono text-xs break-all text-white/90 flex-1 leading-relaxed">{node.pubkey}</p>
                                            <button
                                                onClick={() => {
                                                    if (node.pubkey) navigator.clipboard.writeText(node.pubkey);
                                                }}
                                                className="text-white/60 hover:text-white transition-colors p-1 flex-shrink-0"
                                                title="Copy pubkey"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <span className="text-gray-400 text-xs uppercase tracking-wide">Last seen</span>
                                    <p className="text-white mt-1 font-medium">{formatTimeAgo(node.last_seen_timestamp)}</p>
                                </div>
                            </div>

                            <Link
                                href={`/pnode/${encodeURIComponent(node.address)}`}
                                className="block mt-5 text-center bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl text-sm font-bold transition-all duration-200 border border-white/30 shadow-lg"
                            >
                                View Details →
                            </Link>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}