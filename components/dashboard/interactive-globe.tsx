"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { PNodeInfo } from "@/types/pnode";

interface GeoLocation {
    address: string;
    lat: number;
    lon: number;
    city: string;
    country: string;
    health: "healthy" | "degraded" | "offline";
}

export function InteractiveGlobe({ pnodes }: { pnodes: PNodeInfo[] }) {
    const svgRef = useRef<SVGSVGElement>(null);
    const [geolocatedNodes, setGeolocatedNodes] = useState<GeoLocation[]>([]);
    const [rotation, setRotation] = useState<[number, number, number]>([0, -30, 0]);
    const [isDragging, setIsDragging] = useState(false);

    // Fetch geolocation for nodes
    useEffect(() => {
        const fetchGeolocations = async () => {
            const limit = 50; // Limit to avoid rate limiting
            const batch = pnodes.slice(0, limit);
            const results: GeoLocation[] = [];

            for (let i = 0; i < batch.length; i += 10) {
                const chunk = batch.slice(i, i + 10);
                const promises = chunk.map(async (node) => {
                    try {
                        const ip = node.address.split(":")[0];
                        const response = await fetch(
                            `http://ip-api.com/json/${ip}?fields=status,lat,lon,city,country`
                        );
                        const data = await response.json();

                        if (data.status === "success") {
                            const now = Math.floor(Date.now() / 1000);
                            const delta = now - node.last_seen_timestamp;
                            let health: "healthy" | "degraded" | "offline" = "healthy";
                            if (delta >= 3600) health = "offline";
                            else if (delta >= 300) health = "degraded";

                            return {
                                address: node.address,
                                lat: data.lat,
                                lon: data.lon,
                                city: data.city,
                                country: data.country,
                                health,
                            };
                        }
                    } catch (error) {
                        return null;
                    }
                    return null;
                });

                const chunkResults = await Promise.all(promises);
                results.push(...chunkResults.filter((r): r is GeoLocation => r !== null));

                if (i + 10 < batch.length) {
                    await new Promise((resolve) => setTimeout(resolve, 1500));
                }
            }

            setGeolocatedNodes(results);
        };

        fetchGeolocations();
    }, [pnodes]);

    // Render globe with D3
    useEffect(() => {
        if (!svgRef.current || geolocatedNodes.length === 0) return;

        const width = 800;
        const height = 800;
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const projection = d3
            .geoOrthographic()
            .scale(380)
            .translate([width / 2, height / 2])
            .rotate(rotation);

        const path = d3.geoPath().projection(projection);

        // Add ocean
        svg
            .append("circle")
            .attr("cx", width / 2)
            .attr("cy", height / 2)
            .attr("r", 380)
            .attr("fill", "#0a0e27")
            .attr("stroke", "#1e2a3e")
            .attr("stroke-width", 2);

        // Load world map
        fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
            .then((response) => response.json())
            .then((world: Topology) => {
                const countries = feature(
                    world,
                    world.objects.countries as GeometryCollection
                );

                // Draw countries
                svg
                    .append("g")
                    .selectAll("path")
                    .data(countries.features)
                    .enter()
                    .append("path")
                    .attr("d", path as any)
                    .attr("fill", "#1a2332")
                    .attr("stroke", "#2a3a4e")
                    .attr("stroke-width", 0.5);

                // Add graticule
                const graticule = d3.geoGraticule();
                svg
                    .append("path")
                    .datum(graticule)
                    .attr("d", path as any)
                    .attr("fill", "none")
                    .attr("stroke", "#2a3a4e")
                    .attr("stroke-width", 0.5)
                    .attr("opacity", 0.3);

                // Add glowing nodes
                const nodeGroup = svg.append("g").attr("class", "nodes");

                geolocatedNodes.forEach((node) => {
                    const coords = projection([node.lon, node.lat]);
                    if (!coords) return;

                    const [x, y] = coords;

                    // Color based on health
                    let color = "#14F1C6"; // healthy - cyan
                    let opacity = 1.0;
                    if (node.health === "degraded") {
                        color = "#FFA500"; // orange
                        opacity = 0.7;
                    } else if (node.health === "offline") {
                        color = "#FF4444"; // red
                        opacity = 0.4;
                    }

                    // Outer glow
                    nodeGroup
                        .append("circle")
                        .attr("cx", x)
                        .attr("cy", y)
                        .attr("r", 12)
                        .attr("fill", color)
                        .attr("opacity", opacity * 0.2)
                        .attr("class", "glow-pulse");

                    // Middle glow
                    nodeGroup
                        .append("circle")
                        .attr("cx", x)
                        .attr("cy", y)
                        .attr("r", 6)
                        .attr("fill", color)
                        .attr("opacity", opacity * 0.4);

                    // Core dot
                    nodeGroup
                        .append("circle")
                        .attr("cx", x)
                        .attr("cy", y)
                        .attr("r", 3)
                        .attr("fill", color)
                        .attr("opacity", opacity)
                        .style("filter", `drop-shadow(0 0 8px ${color})`);
                });

                // Add CSS animation for pulsing
                const style = document.createElement("style");
                style.textContent = `
          @keyframes glow-pulse {
            0%, 100% { opacity: 0.2; transform: scale(1); }
            50% { opacity: 0.4; transform: scale(1.2); }
          }
          .glow-pulse {
            animation: glow-pulse 2s ease-in-out infinite;
          }
        `;
                document.head.appendChild(style);
            });

        // Auto-rotation
        let autoRotateTimer: NodeJS.Timeout | null = null;
        if (!isDragging) {
            autoRotateTimer = setInterval(() => {
                setRotation(([lon, lat, roll]) => [(lon + 0.2) % 360, lat, roll]);
            }, 30);
        }

        return () => {
            if (autoRotateTimer) clearInterval(autoRotateTimer);
        };
    }, [geolocatedNodes, rotation, isDragging]);

    // Drag handlers
    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => {
        setIsDragging(false);
        setTimeout(() => setIsDragging(false), 1000);
    };

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!isDragging) return;
        const sensitivity = 0.5;
        setRotation(([lon, lat, roll]) => [
            (lon - e.movementX * sensitivity) % 360,
            Math.max(-90, Math.min(90, lat + e.movementY * sensitivity)),
            roll,
        ]);
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <svg
                ref={svgRef}
                width={800}
                height={800}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseUp}
                className="cursor-grab active:cursor-grabbing"
            />
            <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#14F1C6]" />
                    <span className="text-muted-foreground">Healthy</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FFA500]" />
                    <span className="text-muted-foreground">Degraded</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF4444]" />
                    <span className="text-muted-foreground">Offline</span>
                </div>
            </div>
            <p className="text-sm text-muted-foreground text-center max-w-md">
                Showing {geolocatedNodes.length} of {pnodes.length} nodes with geolocation data.
                Drag to rotate the globe.
            </p>
        </div>
    );
}
