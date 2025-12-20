import { NextResponse } from "next/server";
import { pnodeClient } from "@/lib/pnode-client";

// Best seed nodes that are most likely to have accessible stats
const SEED_IPS = [
    "173.212.203.145",
    "173.212.220.65",
    "161.97.97.41",
    "192.190.136.36",
    "192.190.136.38",
    "192.190.136.28",
    "192.190.136.29",
    "207.244.255.1",
];

export async function GET() {
    try {
        // Fetch stats from seed nodes (more reliable)
        const statsPromises = SEED_IPS.map(async (ip) => {
            const address = `${ip}:9001`;
            return pnodeClient.getPNodeStats(address);
        });

        const statsResults = await Promise.all(statsPromises);
        const validStats = statsResults.filter(s => s !== null);

        if (validStats.length === 0) {
            return NextResponse.json({
                totalStorage: 0,
                totalRam: 0,
                avgCpu: 0,
                avgUptime: 0,
                totalData: 0,
                totalPages: 0,
                nodeCount: 0,
            });
        }

        // Calculate aggregates
        const aggregateStats = {
            totalStorage: validStats.reduce((sum, s) => sum + (s?.total_bytes || 0), 0),
            totalRam: validStats.reduce((sum, s) => sum + (s?.ram_total || 0), 0),
            avgCpu: validStats.reduce((sum, s) => sum + (s?.cpu_percent || 0), 0) / validStats.length,
            avgUptime: validStats.reduce((sum, s) => sum + (s?.uptime || 0), 0) / validStats.length,
            totalData: validStats.reduce((sum, s) => sum + (s?.file_size || 0), 0),
            totalPages: validStats.reduce((sum, s) => sum + (s?.total_pages || 0), 0),
            nodeCount: validStats.length,
        };

        return NextResponse.json(aggregateStats);
    } catch (error) {
        console.error("Error fetching aggregate stats:", error);
        return NextResponse.json({
            totalStorage: 0,
            totalRam: 0,
            avgCpu: 0,
            avgUptime: 0,
            totalData: 0,
            totalPages: 0,
            nodeCount: 0,
        });
    }
}
