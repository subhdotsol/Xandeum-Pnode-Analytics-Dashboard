import { NextResponse } from "next/server";
import { pnodeClient } from "@/lib/pnode-client";

export const dynamic = "force-dynamic";
export const revalidate = 30;

export async function GET() {
  try {
    const pnodes = await pnodeClient.getAllPNodes();

    return NextResponse.json({
      success: true,
      data: pnodes,
      total: pnodes.length,
    });
  } catch (error: any) {
    console.error("Error fetching pNodes:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch pNodes",
        data: [],
        total: 0,
      },
      { status: 500 }
    );
  }
}
