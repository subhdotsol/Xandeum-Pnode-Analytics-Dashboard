import { NextResponse } from "next/server";
import { pnodeClient } from "@/lib/pnode-client";
import { analyzeNetwork } from "@/lib/network-analytics";

export const dynamic = "force-dynamic";
export const revalidate = 30;

export async function GET() {
  try {
    const pnodes = await pnodeClient.getAllPNodes();
    const analytics = analyzeNetwork(pnodes);

    return NextResponse.json({
      success: true,
      data: {
        ...analytics,
        lastUpdated: new Date().toISOString(),
        nodeCount: pnodes.length,
      },
    });
  } catch (error: any) {
    console.error("Error fetching network overview:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch network overview",
      },
      { status: 500 }
    );
  }
}
