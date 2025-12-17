import { NextResponse } from "next/server";
import { pnodeClient } from "@/lib/pnode-client";
import { getNodeHealth } from "@/lib/network-analytics";

export const dynamic = "force-dynamic";
export const revalidate = 30;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    const decodedAddress = decodeURIComponent(address);

    // Get pNode stats
    const stats = await pnodeClient.getPNodeStats(decodedAddress);

    if (!stats) {
      return NextResponse.json(
        {
          success: false,
          error: "Node not found or unavailable",
        },
        { status: 404 }
      );
    }

    // Get health status
    const health = getNodeHealth(stats.last_updated);

    return NextResponse.json({
      success: true,
      data: {
        address: decodedAddress,
        stats,
        health,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Error fetching pNode stats:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch pNode stats",
      },
      { status: 500 }
    );
  }
}
