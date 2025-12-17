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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGeolocations = async () => {
            const limit = 50;
            const batch = pnodes.slice(0, limit);
            const results: GeoLocation[] = [];

            for (let i = 0; i < batch.length; i += 5) {
                const chunk = batch.slice(i, i + 5);
                const promises = chunk.map(async (node) => {
                    try {
                        const ip = node.address.split(":")[0];
                        const response = await fetch(`https://ipapi.co/${ip}/json/`);

                        if (!response.ok) return null;

                        const data = await response.json();

                        if (data.latitude && data.longitude) {
                            const now = Math.floor(Date.now() / 1000);
                            const delta = now - node.last_seen_timestamp;
                            let health: "healthy" | "degraded" | "offline" = "healthy";
                            if (delta >= 3600) health = "offline";
                            else if (delta >= 300) health = "degraded";

                            return {
                                address: node.address,
                                lat: data.latitude,
                                lon: data.longitude,
                                city: data.city || "Unknown",
                                country: data.country_name || "Unknown",
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

                if (i + 5 < batch.length) {
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                }
            }

            setGeolocatedNodes(results);
            setLoading(false);
        };

        fetchGeolocations();
    }, [pnodes]);

    useEffect(() => {
        if (!svgRef.current) return;

        const width = window.innerWidth;
        const height = window.innerHeight;
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const radius = Math.min(width, height) / 2.5;

        const projection = d3
            .geoOrthographic()
            .scale(radius)
            .translate([width / 2, height / 2])
            .rotate(rotation);

        const path = d3.geoPath().projection(projection);

        svg
            .append("circle")
            .attr("cx", width / 2)
            .attr("cy", height / 2)
            .attr("r", radius)
            .attr("fill", "#0a0e27")
            .attr("stroke", "#14F1C6")
            .attr("stroke-width", 2)
            .attr("opacity", 0.3);

        fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
            .then((response) => response.json())
            .then((world: Topology) => {
                const countries = feature(
                    world,
                    world.objects.countries as GeometryCollection
                );

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

                const graticule = d3.geoGraticule();
                svg
                    .append("path")
                    .datum(graticule)
                    .attr("d", path as any)
                    .attr("fill", "none")
                    .attr("stroke", "#2a3a4e")
                    .attr("stroke-width", 0.5)
                    .attr("opacity", 0.3);
            });

        if (geolocatedNodes.length > 0) {
            const nodeGroup = svg.append("g").attr("class", "nodes");

            geolocatedNodes.forEach((node) => {
                const coords = projection([node.lon, node.lat]);
                if (!coords) return;

                const [x, y] = coords;

                let color = "#14F1C6";
                let opacity = 1.0;
                if (node.health === "degraded") {
                    color = "#FFA500";
                    opacity = 0.7;
                } else if (node.health === "offline") {
                    color = "#FF4444";
                    opacity = 0.4;
                }

                nodeGroup
                    .append("circle")
                    .attr("cx", x)
                    .attr("cy", y)
                    .attr("r", 20)
                    .attr("fill", color)
                    .attr("opacity", opacity * 0.15)
                    .attr("class", "glow-pulse");

                nodeGroup
                    .append("circle")
                    .attr("cx", x)
                    .attr("cy", y)
                    .attr("r", 10)
                    .attr("fill", color)
                    .attr("opacity", opacity * 0.3);

                nodeGroup
                    .append("circle")
                    .attr("cx", x)
                    .attr("cy", y)
                    .attr("r", 4)
                    .attr("fill", color)
                    .attr("opacity", opacity)
                    .style("filter", `drop-shadow(0 0 10px ${color})`);
            });
        }

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
        <div className="relative w-full h-screen">
            <style jsx>{`
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.3); }
        }
        .glow-pulse {
          animation: glow-pulse 2s ease-in-out infinite;
        }
      `}</style>

            <svg
                ref={svgRef}
                width="100%"
                height="100%"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseUp}
                className="cursor-grab active:cursor-grabbing"
                style={{ display: 'block' }}
            />

            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-lg text-muted-foreground">
                            Loading nodes... {geolocatedNodes.length} / {Math.min(50, pnodes.length)}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
