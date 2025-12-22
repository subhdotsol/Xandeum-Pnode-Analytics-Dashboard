import { NextResponse } from 'next/server';

const XAND_MINT = 'XANDuUoVoUqniKkpcKhrxmvYJybpJvUxJLr21Gaj3Hx';

// In-memory cache
let liquidityCache: {
    total_liquidity: number;
    main_pool_liquidity: number;
    pool_count: number;
    main_pool_address: string | null;
    timestamp: number;
} | null = null;
const CACHE_TTL = 60000; // 60 seconds

export async function GET() {
    // Check cache first
    if (liquidityCache && Date.now() - liquidityCache.timestamp < CACHE_TTL) {
        return NextResponse.json({
            total_liquidity: liquidityCache.total_liquidity,
            main_pool_liquidity: liquidityCache.main_pool_liquidity,
            pool_count: liquidityCache.pool_count,
            main_pool_address: liquidityCache.main_pool_address,
            last_updated: new Date(liquidityCache.timestamp).toISOString(),
            cached: true,
        });
    }

    try {
        // Fetch pool info from Raydium API
        const response = await fetch('https://api.raydium.io/v2/main/pairs', {
            next: { revalidate: 60 } // Next.js caching
        });
        const data = await response.json();
        
        // Find XAND pools
        const xandPools = data.filter((pool: any) => 
            pool.baseMint === XAND_MINT || pool.quoteMint === XAND_MINT
        );
        
        // Calculate total liquidity across all XAND pools
        const totalLiquidity = xandPools.reduce((sum: number, pool: any) => {
            return sum + (parseFloat(pool.liquidity) || 0);
        }, 0);
        
        // Get the main pool (usually the one with most liquidity)
        const mainPool = xandPools.reduce((prev: any, current: any) => {
            const prevLiq = parseFloat(prev?.liquidity || 0);
            const currLiq = parseFloat(current?.liquidity || 0);
            return currLiq > prevLiq ? current : prev;
        }, null);
        
        // Update cache
        liquidityCache = {
            total_liquidity: totalLiquidity,
            main_pool_liquidity: mainPool ? parseFloat(mainPool.liquidity) : 0,
            pool_count: xandPools.length,
            main_pool_address: mainPool?.ammId || null,
            timestamp: Date.now()
        };
        
        return NextResponse.json({
            total_liquidity: totalLiquidity,
            main_pool_liquidity: mainPool ? parseFloat(mainPool.liquidity) : 0,
            pool_count: xandPools.length,
            main_pool_address: mainPool?.ammId || null,
            last_updated: new Date().toISOString(),
            cached: false,
        });
    } catch (error) {
        console.error('Error fetching liquidity data:', error);
        
        // Return cached data if available, even if expired
        if (liquidityCache) {
            return NextResponse.json({
                total_liquidity: liquidityCache.total_liquidity,
                main_pool_liquidity: liquidityCache.main_pool_liquidity,
                pool_count: liquidityCache.pool_count,
                main_pool_address: liquidityCache.main_pool_address,
                last_updated: new Date(liquidityCache.timestamp).toISOString(),
                cached: true,
                error: 'Using cached data due to API error',
            });
        }
        
        // Fallback to demo data if API fails
        return NextResponse.json({
            total_liquidity: 1250000,
            main_pool_liquidity: 1250000,
            pool_count: 1,
            main_pool_address: null,
            last_updated: new Date().toISOString(),
            error: 'Using fallback data',
        });
    }
}
