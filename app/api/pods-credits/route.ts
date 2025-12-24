import { NextResponse } from "next/server";

// Cache pod credits for 60 seconds
export const revalidate = 60;

interface PodCredit {
  credits: number;
  pod_id: string;
}

interface PodsCreditsResponse {
  pods_credits: PodCredit[];
  status: string;
}

export async function GET() {
  try {
    const response = await fetch(
      "https://podcredits.xandeum.network/api/pods-credits",
      {
        next: { revalidate: 60 },
        headers: {
          "Accept": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch pod credits: ${response.status}`);
    }

    const data: PodsCreditsResponse = await response.json();

    // Create a Map for quick lookups by pod_id
    const creditsMap: Record<string, number> = {};
    let totalCredits = 0;
    let maxCredits = 0;

    for (const pod of data.pods_credits) {
      creditsMap[pod.pod_id] = pod.credits;
      totalCredits += pod.credits;
      if (pod.credits > maxCredits) {
        maxCredits = pod.credits;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        credits: creditsMap,
        podsCredits: data.pods_credits,
        totalCredits,
        maxCredits,
        podCount: data.pods_credits.length,
      },
    });
  } catch (error) {
    console.error("Error fetching pod credits:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch pod credits",
      },
      { status: 500 }
    );
  }
}
