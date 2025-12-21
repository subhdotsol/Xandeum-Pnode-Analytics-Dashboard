import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
    try {
        // Verify authorization (skip for localhost testing)
        const url = new URL(request.url);
        const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
        const authHeader = request.headers.get("authorization");
        const cronSecret = process.env.CRON_SECRET;

        if (!isLocalhost && cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const baseUrl = `${url.protocol}//${url.host}`;

        // Fetch current data
        const [pnodesRes, analyticsRes, statsRes] = await Promise.all([
            fetch(`${baseUrl}/api/pnodes`, { cache: "no-store" }),
            fetch(`${baseUrl}/api/analytics`, { cache: "no-store" }),
            fetch(`${baseUrl}/api/stats`, { cache: "no-store" }),
        ]);

        if (!pnodesRes.ok) {
            throw new Error(`Failed to fetch pnodes: ${pnodesRes.status}`);
        }

        const pnodesData = await pnodesRes.json();
        const analyticsData = analyticsRes.ok ? await analyticsRes.json() : null;
        const statsData = statsRes.ok ? await statsRes.json() : null;

        // Calculate metrics
        const pnodes = pnodesData?.pnodes || [];
        const now = Date.now() / 1000;
        
        let onlineNodes = 0;
        pnodes.forEach((node: { last_seen_timestamp: number }) => {
            const diff = now - node.last_seen_timestamp;
            if (diff < 3600) onlineNodes++; // Online if seen in last hour
        });

        const uniqueVersions = new Set(
            pnodes.map((node: { version?: string }) => node.version).filter(Boolean)
        ).size;

        // Estimate unique countries from IP prefixes
        const uniqueIPs = new Set(
            pnodes.map((node: { address: string }) => node.address.split(':')[0])
        );
        const uniquePrefixes = new Set(
            Array.from(uniqueIPs).map((ip) => (ip as string).split('.').slice(0, 2).join('.'))
        );
        const uniqueCountries = Math.min(uniquePrefixes.size, 20);

        const snapshot = {
            timestamp: Date.now(),
            totalNodes: pnodes.length,
            onlineNodes,
            offlineNodes: pnodes.length - onlineNodes,
            avgCpu: statsData?.avgCpu || analyticsData?.resources?.avgCpu || 0,
            avgRam: statsData?.avgRam || analyticsData?.resources?.avgRam || 0,
            totalStorage: statsData?.totalStorage || analyticsData?.resources?.totalStorage || 0,
            uniqueCountries,
            uniqueVersions,
        };

        // Save snapshot
        const saveRes = await fetch(`${baseUrl}/api/historical/save`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(snapshot),
        });

        if (!saveRes.ok) {
            const errorText = await saveRes.text();
            throw new Error(`Failed to save snapshot: ${saveRes.status} - ${errorText}`);
        }

        return NextResponse.json({
            success: true,
            snapshot,
            message: "Snapshot collected and saved",
        });
    } catch (error) {
        console.error("Error in cron job:", error);
        return NextResponse.json(
            {
                error: "Failed to collect snapshot",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
