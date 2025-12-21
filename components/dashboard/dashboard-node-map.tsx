"use client";

import { MapContainer, TileLayer, CircleMarker, useMap } from "react-leaflet";
import L from "leaflet";
import { useMemo, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Minus, Plus, RotateCcw } from "lucide-react";

interface PNodeWithGeo {
    address: string;
    version: string;
    pubkey: string | null;
    last_seen_timestamp: number;
    lat?: number;
    lng?: number;
    city?: string;
    country?: string;
}

interface LocationGroup {
    lat: number;
    lng: number;
    nodes: PNodeWithGeo[];
    onlineCount: number;
    offlineCount: number;
}

function getNodeStatus(lastSeenTimestamp: number): "online" | "recent" | "offline" {
    const now = Date.now() / 1000;
    const diff = now - lastSeenTimestamp;
    if (diff < 300) return "online";
    if (diff < 3600) return "recent";
    return "offline";
}

function getStatusColor(status: string): string {
    switch (status) {
        case "online": return "#22c55e";
        case "recent": return "#eab308";
        case "offline": return "#ef4444";
        default: return "#3b82f6";
    }
}

function formatTimeAgo(timestamp: number): string {
    const now = Date.now() / 1000;
    const diff = now - timestamp;
    if (diff < 60) return `${Math.floor(diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

// Zoom control component
function ZoomControls({ onZoomIn, onZoomOut, onReset, zoom }: {
    onZoomIn: () => void;
    onZoomOut: () => void;
    onReset: () => void;
    zoom: number;
}) {
    return (
        <div className="absolute top-3 right-3 z-[1000] flex items-center gap-1 bg-card/95 dark:bg-zinc-900/95 backdrop-blur-sm border border-border rounded-lg p-1">
            <button
                onClick={onZoomOut}
                className="h-7 w-7 flex items-center justify-center rounded hover:bg-muted transition-colors text-foreground"
                title="Zoom out"
            >
                <Minus className="w-4 h-4" />
            </button>
            <span className="text-xs text-muted-foreground w-12 text-center font-mono">
                {Math.round(zoom * 50)}%
            </span>
            <button
                onClick={onZoomIn}
                className="h-7 w-7 flex items-center justify-center rounded hover:bg-muted transition-colors text-foreground"
                title="Zoom in"
            >
                <Plus className="w-4 h-4" />
            </button>
            <button
                onClick={onReset}
                className="h-7 px-2 flex items-center gap-1 text-xs rounded hover:bg-muted transition-colors text-foreground"
                title="Reset view"
            >
                <RotateCcw className="w-3 h-3" />
                Reset
            </button>
        </div>
    );
}

// Fixed popup in bottom-left corner
function HoverPopup({ group, markerColor }: { group: LocationGroup | null; markerColor: string }) {
    if (!group) return null;

    const primaryNode = group.nodes[0];
    const primaryStatus = getNodeStatus(primaryNode.last_seen_timestamp);

    return (
        <div className="absolute bottom-3 left-3 z-[1000] min-w-[200px] max-w-[220px] max-h-[300px] overflow-y-auto bg-card dark:bg-zinc-900 border border-border rounded-lg shadow-xl p-3 text-xs">
            {/* Location Header */}
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border">
                <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: markerColor }}
                />
                <span className="font-medium text-foreground">
                    {primaryNode.city && primaryNode.country
                        ? `${primaryNode.city}, ${primaryNode.country}`
                        : "Unknown Location"
                    }
                </span>
            </div>

            {/* Node Details */}
            <div className="space-y-1">
                <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">IP</span>
                    <span className="font-mono text-foreground">{primaryNode.address.split(':')[0]}</span>
                </div>
                <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Status</span>
                    <span className="capitalize text-foreground">{primaryStatus}</span>
                </div>
                <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Version</span>
                    <span className="text-foreground">{primaryNode.version || "—"}</span>
                </div>
                <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Last Seen</span>
                    <span className="text-foreground">{formatTimeAgo(primaryNode.last_seen_timestamp)}</span>
                </div>

                {/* Cluster info */}
                {group.nodes.length > 1 && (
                    <>
                        <div className="h-px bg-border my-1.5" />
                        <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">Total at Location</span>
                            <span className="font-medium text-foreground">{group.nodes.length} nodes</span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">Online / Offline</span>
                            <span>
                                <span className="text-green-500">{group.onlineCount}</span>
                                <span className="text-muted-foreground"> / </span>
                                <span className="text-red-500">{group.offlineCount}</span>
                            </span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

// Map controller for zoom
function MapController({ zoom, center, onMapReady }: {
    zoom: number;
    center: [number, number];
    onMapReady: (map: L.Map) => void;
}) {
    const map = useMap();

    useEffect(() => {
        onMapReady(map);
    }, [map, onMapReady]);

    useEffect(() => {
        map.setView(center, zoom);
    }, [map, zoom, center]);

    return null;
}

interface DashboardNodeMapProps {
    nodes: PNodeWithGeo[];
    isLoading?: boolean;
    loadedCount?: number;
    totalCount?: number;
}

export function DashboardNodeMap({ nodes, isLoading, loadedCount = 0, totalCount = 0 }: DashboardNodeMapProps) {
    const [zoom, setZoom] = useState(2);
    const [center, setCenter] = useState<[number, number]>([30, 10]);
    const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
    const [hoveredGroup, setHoveredGroup] = useState<LocationGroup | null>(null);
    const [hoveredColor, setHoveredColor] = useState<string>("#22c55e");

    // Group nodes by location for clustering
    const locationGroups = useMemo(() => {
        const groups = new Map<string, LocationGroup>();

        nodes.filter(n => n.lat && n.lng).forEach(node => {
            // Round to 1 decimal for clustering nearby nodes
            const key = `${node.lat!.toFixed(1)},${node.lng!.toFixed(1)}`;
            const status = getNodeStatus(node.last_seen_timestamp);
            const isOnline = status === "online" || status === "recent";

            if (groups.has(key)) {
                const group = groups.get(key)!;
                group.nodes.push(node);
                if (isOnline) group.onlineCount++;
                else group.offlineCount++;
            } else {
                groups.set(key, {
                    lat: node.lat!,
                    lng: node.lng!,
                    nodes: [node],
                    onlineCount: isOnline ? 1 : 0,
                    offlineCount: isOnline ? 0 : 1,
                });
            }
        });

        return Array.from(groups.values());
    }, [nodes]);

    const handleZoomIn = () => {
        const newZoom = Math.min(zoom + 1, 8);
        setZoom(newZoom);
    };

    const handleZoomOut = () => {
        const newZoom = Math.max(zoom - 1, 1);
        setZoom(newZoom);
    };

    const handleReset = () => {
        setZoom(2);
        setCenter([30, 10]);
    };

    const nodesWithLocation = nodes.filter(n => n.lat && n.lng);

    return (
        <Card className="border border-border bg-card dark:bg-zinc-950 overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-medium text-foreground">Global Node Distribution</h3>
                {/* Legend */}
                <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-muted-foreground">Online</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-yellow-500" />
                        <span className="text-muted-foreground">Recent</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-muted-foreground">Offline</span>
                    </div>
                </div>
            </div>

            <div className="h-[350px] relative">
                {isLoading && nodesWithLocation.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted/50 dark:bg-zinc-900/50">
                        <div className="text-center">
                            <div className="animate-spin w-6 h-6 border-2 border-foreground/20 border-t-foreground rounded-full mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">Loading {loadedCount}/{totalCount} nodes...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <ZoomControls
                            zoom={zoom}
                            onZoomIn={handleZoomIn}
                            onZoomOut={handleZoomOut}
                            onReset={handleReset}
                        />

                        <HoverPopup group={hoveredGroup} markerColor={hoveredColor} />

                        <MapContainer
                            center={center}
                            zoom={zoom}
                            className="h-full w-full"
                            style={{ background: "#0a0a0a" }}
                            minZoom={1}
                            maxZoom={8}
                            scrollWheelZoom={true}
                            dragging={true}
                            zoomControl={false}
                            attributionControl={false}
                        >
                            <TileLayer
                                url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
                            />

                            <MapController
                                zoom={zoom}
                                center={center}
                                onMapReady={setMapInstance}
                            />

                            {locationGroups.map((group, idx) => {
                                const hasOnline = group.onlineCount > 0;
                                const markerColor = hasOnline ? getStatusColor("online") : getStatusColor("offline");

                                return (
                                    <CircleMarker
                                        key={`${group.lat}-${group.lng}-${idx}`}
                                        center={[group.lat, group.lng]}
                                        radius={group.nodes.length > 1 ? 7 : 5}
                                        fillColor={markerColor}
                                        fillOpacity={0.85}
                                        stroke={true}
                                        color="#000"
                                        weight={1}
                                        eventHandlers={{
                                            mouseover: () => {
                                                setHoveredGroup(group);
                                                setHoveredColor(markerColor);
                                            },
                                            mouseout: () => {
                                                setHoveredGroup(null);
                                            }
                                        }}
                                    />
                                );
                            })}
                        </MapContainer>
                    </>
                )}
            </div>
        </Card>
    );
}
