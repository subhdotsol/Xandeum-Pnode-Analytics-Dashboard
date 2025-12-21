import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface HistoricalDataPoint {
    timestamp: number;
    totalNodes: number;
    onlineNodes: number;
    offlineNodes: number;
    avgCpu: number;
    avgRam: number;
    totalStorage: number;
    uniqueCountries: number;
    uniqueVersions: number;
}

export async function GET() {
    try {
        if (!isSupabaseConfigured() || !supabase) {
            return NextResponse.json([]);
        }

        const { data, error } = await supabase
            .from('historical_snapshots')
            .select('*')
            .order('timestamp', { ascending: true })
            .limit(168); // Last 7 days of 5-minute snapshots

        if (error) {
            console.error('Supabase fetch error:', error);
            return NextResponse.json([]);
        }

        const formattedData: HistoricalDataPoint[] = (data || []).map((row: Record<string, unknown>) => ({
            timestamp: Number(row.timestamp),
            totalNodes: Number(row.total_nodes),
            onlineNodes: Number(row.online_nodes),
            offlineNodes: Number(row.offline_nodes),
            avgCpu: Number(row.avg_cpu),
            avgRam: Number(row.avg_ram),
            totalStorage: Number(row.total_storage),
            uniqueCountries: Number(row.unique_countries),
            uniqueVersions: Number(row.unique_versions),
        }));

        return NextResponse.json(formattedData);
    } catch (error) {
        console.error("Error fetching historical data:", error);
        return NextResponse.json([]);
    }
}
