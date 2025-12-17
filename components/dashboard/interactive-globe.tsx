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
    health: "healthy" | "degraded" | "offline";
}

export function InteractiveGlobe({ pnodes }: { pnodes: PNodeInfo[] }) {
    const svgRef = useRef<SVGSVGElement>(null);
    const [geolocatedNodes, setGeolocatedNodes] = useState<GeoLocation[]>([]);
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

        // Use flat Mercator projection instead of Orthographic
        const projection = d3
            .geoMercator()
            .scale(200)
            .translate([width / 2, height / 1.5]);

        const path = d3.geoPath().projection(projection);

        // Add background
        svg
            .append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "#000000");

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
            });

        // Add glowing nodes
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
    }, [geolocatedNodes]);

    return (
        <div className="relative h-screen w-full">
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
