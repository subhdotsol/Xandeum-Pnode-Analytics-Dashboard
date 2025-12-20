import { NextResponse } from "next/server";
import { pnodeClient } from "@/lib/pnode-client";
import { analyzeNetwork } from "@/lib/network-analytics";

export async function GET() {
    try {
        const pnodes = await pnodeClient.getAllPNodes();
        const analytics = analyzeNetwork(pnodes);
        return NextResponse.json(analytics);
    } catch (error) {
        console.error("Error fetching analytics:", error);
        return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
    }
}
