import { NextResponse } from "next/server";
import { pnodeClient } from "@/lib/pnode-client";

export async function GET() {
    try {
        const pnodes = await pnodeClient.getAllPNodes();
        return NextResponse.json({ pnodes });
    } catch (error) {
        console.error("Error fetching pnodes:", error);
        return NextResponse.json({ error: "Failed to fetch pnodes", pnodes: [] }, { status: 500 });
    }
}
