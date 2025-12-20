"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { useMemo, useState } from "react";
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

// Draggable Popup Component
function DraggablePopup({
    node,
    onClose,
    initialX = 100,
    initialY = 100
}: {
    node: PNodeWithLocation;
    onClose: () => void;
    initialX?: number;
    initialY?: number;
}) {
    const [position, setPosition] = useState({ x: initialX, y: initialY });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [copiedAddress, setCopiedAddress] = useState(false);
    const [copiedPubkey, setCopiedPubkey] = useState(false);

    const getMarkerColor = (status: string) => {
        switch (status) {
            case "online":
                return "#22c55e";
            case "recent":
                return "#eab308";
            case "offline":
                return "#ef4444";
            default:
                return "#3b82f6";
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('.no-drag')) return;
        setIsDragging(true);
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleCopyAddress = () => {
        navigator.clipboard.writeText(node.address);
        setCopiedAddress(true);
        setTimeout(() => setCopiedAddress(false), 2000);
    };

    const handleCopyPubkey = () => {
        if (node.pubkey) {
            navigator.clipboard.writeText(node.pubkey);
            setCopiedPubkey(true);
            setTimeout(() => setCopiedPubkey(false), 2000);
        }
    };

    return (
        <div
            className="absolute z-[1001] select-none"
            style={{
                left: `${Math.min(position.x, 400)}px`,
                top: `${Math.min(position.y, 300)}px`,
                cursor: isDragging ? 'grabbing' : 'grab'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <div className="bg-black/95 backdrop-blur-lg border border-white/30 rounded-2xl p-4 min-w-[280px] shadow-2xl">
                {/* Drag Handle */}
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/20">
                    <div className="flex items-center gap-2">
                        <div
                            className="w-4 h-4 rounded-full shadow-lg"
                            style={{
                                backgroundColor: getMarkerColor(node.status),
                                boxShadow: `0 0 12px ${getMarkerColor(node.status)}AA`
                            }}
                        />
                        <span className="font-bold text-sm capitalize text-white">
                            {node.status}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="no-drag text-white/60 hover:text-white transition-colors"
                        title="Close"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-2 text-xs">
                    {node.city && node.country && (
                        <div className="flex items-center gap-2">
                            <span className="text-gray-400 text-xs">Location:</span>
                            <p className="font-semibold text-white flex-1">
                                📍 {node.city}, {node.country}
                            </p>
                        </div>
                    )}

                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-gray-400 text-xs">Address:</span>
                        </div>
                        <div className="no-drag flex items-center gap-2 bg-white/5 px-2 py-1.5 rounded-lg border border-white/10">
                            <p className="font-mono text-white text-xs flex-1">{node.address}</p>
                            <button
                                onClick={handleCopyAddress}
                                className="text-white/60 hover:text-white transition-all p-0.5"
                                title={copiedAddress ? "Copied!" : "Copy address"}
                            >
                                {copiedAddress ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-xs">Version:</span>
                        <p className="font-semibold text-white">{node.version}</p>
                    </div>

                    {node.pubkey && (
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-gray-400 text-xs">Pubkey:</span>
                            </div>
                            <div className="no-drag flex items-start gap-2 bg-white/5 px-2 py-1.5 rounded-lg border border-white/10">
                                <p className="font-mono text-xs break-all text-white/90 flex-1 leading-relaxed">{node.pubkey}</p>
                                <button
                                    onClick={handleCopyPubkey}
                                    className="text-white/60 hover:text-white transition-all p-0.5 flex-shrink-0"
                                    title={copiedPubkey ? "Copied!" : "Copy pubkey"}
                                >
                                    {copiedPubkey ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-xs">Last seen:</span>
                        <p className="text-white font-medium text-xs">{formatTimeAgo(node.last_seen_timestamp)}</p>
                    </div>
                </div>

                <Link
                    href={`/pnode/${encodeURIComponent(node.address)}`}
                    className="no-drag block mt-3 text-center bg-white/10 hover:bg-white/20 active:bg-white/30 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 border border-white/30 shadow-lg hover:scale-105 active:scale-95"
                >
                    View Details →
                </Link>

                {/* Drag hint */}
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40">
                        <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20" />
                    </svg>
                    <span className="text-white/40 text-xs italic">Hold to drag</span>
                </div>
            </div>
        </div>
    );
}

// Map click handler component
function MapClickHandler({
    markers,
    onMarkerClick
}: {
    markers: PNodeWithLocation[];
    onMarkerClick: (node: PNodeWithLocation, event: L.LeafletMouseEvent) => void;
}) {
    useMapEvents({
        // We'll handle clicks on markers directly
    });

    return null;
}

export default function MapComponent({ pnodes }: { pnodes: PNode[] }) {
    const [selectedNode, setSelectedNode] = useState<PNodeWithLocation | null>(null);
    const [popupPosition, setPopupPosition] = useState({ x: 100, y: 100 });

    const pnodesWithLocation = useMemo(() => {
        return pnodes
            .filter((pnode) => pnode.lat && pnode.lng)
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
                return "#22c55e";
            case "recent":
                return "#eab308";
            case "offline":
                return "#ef4444";
            default:
                return "#3b82f6";
        }
    };

    const handleMarkerClick = (node: PNodeWithLocation, e: L.LeafletMouseEvent) => {
        // Position popup near the clicked marker
        const container = e.target._map.getContainer();
        const rect = container.getBoundingClientRect();
        const point = e.containerPoint;

        setPopupPosition({
            x: rect.left + point.x + 20,
            y: rect.top + point.y - 100
        });
        setSelectedNode(node);
    };

    return (
        <div className="relative h-full w-full">
            <MapContainer
                center={[20, 0]}
                zoom={2}
                className="h-full w-full"
                style={{ background: "#000000" }}
                minZoom={2}
                maxBounds={[
                    [-90, -180],
                    [90, 180],
                ]}
                scrollWheelZoom={true}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />

                <MapClickHandler
                    markers={pnodesWithLocation}
                    onMarkerClick={handleMarkerClick}
                />

                {pnodesWithLocation.map((node) => (
                    <Marker
                        key={node.address}
                        position={[node.lat, node.lng]}
                        icon={createColoredIcon(getMarkerColor(node.status))}
                        eventHandlers={{
                            click: (e) => handleMarkerClick(node, e)
                        }}
                    />
                ))}
            </MapContainer>

            {/* Draggable Popup Overlay */}
            {selectedNode && (
                <DraggablePopup
                    node={selectedNode}
                    onClose={() => setSelectedNode(null)}
                    initialX={popupPosition.x}
                    initialY={popupPosition.y}
                />
            )}
        </div>
    );
}

// NOTE : fixing map components 