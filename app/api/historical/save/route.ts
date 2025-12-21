import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: Request) {
    try {
        if (!isSupabaseConfigured() || !supabase) {
            return NextResponse.json(
                { error: "Supabase not configured" },
                { status: 503 }
            );
        }

        const data = await request.json();

        const {
            timestamp,
            totalNodes,
            onlineNodes,
            offlineNodes,
            avgCpu,
            avgRam,
            totalStorage,
            uniqueCountries,
            uniqueVersions,
        } = data;

        if (
            typeof timestamp !== "number" ||
            typeof totalNodes !== "number" ||
            typeof onlineNodes !== "number"
        ) {
            return NextResponse.json(
                { error: "Invalid data format" },
                { status: 400 }
            );
        }

        const { error: insertError } = await supabase
            .from('historical_snapshots')
            .insert([
                {
                    timestamp,
                    total_nodes: totalNodes,
                    online_nodes: onlineNodes,
                    offline_nodes: offlineNodes,
                    avg_cpu: avgCpu || 0,
                    avg_ram: avgRam || 0,
                    total_storage: totalStorage || 0,
                    unique_countries: uniqueCountries || 0,
                    unique_versions: uniqueVersions || 0,
                }
            ]);

        if (insertError) {
            console.error('Supabase insert error:', insertError);
            return NextResponse.json(
                { error: 'Failed to save snapshot' },
                { status: 500 }
            );
        }

        // Clean up old data (older than 7 days)
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        await supabase
            .from('historical_snapshots')
            .delete()
            .lt('timestamp', sevenDaysAgo);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error saving historical snapshot:", error);
        return NextResponse.json(
            { error: "Failed to save snapshot" },
            { status: 500 }
        );
    }
}
