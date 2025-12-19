import { NextRequest, NextResponse } from "next/server";
import { geoCache, type GeoData } from "@/lib/geo-cache";

// Retry helper with exponential backoff
async function fetchWithRetry(
    url: string,
    options: RequestInit,
    maxRetries = 3
): Promise<Response> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await fetch(url, options);
            return response;
        } catch (error) {
            lastError = error as Error;
            console.log(
                `[GEO API] Attempt ${attempt + 1}/${maxRetries} failed for ${url}, retrying...`
            );

            // Wait before retrying (exponential backoff: 500ms, 1000ms, 2000ms)
            if (attempt < maxRetries - 1) {
                await new Promise((resolve) =>
                    setTimeout(resolve, 500 * Math.pow(2, attempt))
                );
            }
        }
    }

    throw lastError || new Error("Max retries exceeded");
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const ip = searchParams.get("ip");

    if (!ip) {
        return NextResponse.json(
            { error: "IP address is required" },
            { status: 400 }
        );
    }

    // Check cache first
    const cached = geoCache.get(ip);
    if (cached) {
        return NextResponse.json({
            status: "success",
            lat: cached.lat,
            lon: cached.lng,
            city: cached.city,
            country: cached.country,
        });
    }

    try {
        // Server-side can make HTTP requests without mixed content issues
        const response = await fetchWithRetry(
            `http://ip-api.com/json/${ip}?fields=status,lat,lon,city,country,regionName,isp,org`,
            {
                headers: {
                    "User-Agent": "Pnode-Analytics-Dashboard",
                },
            },
            3 // Retry up to 3 times
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Cache successful responses
        if (data.status === "success" && data.lat && data.lon) {
            const geoData: GeoData = {
                lat: data.lat,
                lng: data.lon,
                city: data.city,
                country: data.country,
                regionName: data.regionName,
                isp: data.isp,
                org: data.org,
            };
            geoCache.set(ip, geoData);
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error(`[GEO API] Error fetching location for ${ip}:`, error);
        // Return a "failed" status instead of 500, so the map can still render other nodes
        return NextResponse.json(
            { status: "fail", error: "Failed to fetch geolocation" },
            { status: 200 } // Return 200 so it doesn't break the batch processing
        );
    }
}
