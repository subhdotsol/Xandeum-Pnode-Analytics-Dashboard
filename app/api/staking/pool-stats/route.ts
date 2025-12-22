import { NextResponse } from 'next/server';

// In-memory cache
let priceCache: { solPrice: number; xandPrice: number; timestamp: number } | null = null;
const CACHE_TTL = 60000; // 60 seconds

async function fetchTokenPrices() {
    // Check cache first
    if (priceCache && Date.now() - priceCache.timestamp < CACHE_TTL) {
        return { solPrice: priceCache.solPrice, xandPrice: priceCache.xandPrice };
    }

    try {
        // Fetch both SOL and XAND prices from CoinGecko (free, no API key needed)
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana,xandeum&vs_currencies=usd', {
            next: { revalidate: 60 } // Next.js caching
        });
        const data = await response.json();
        
        const solPrice = data?.solana?.usd || 100; // Fallback to $100 if fetch fails
        const xandPrice = data?.xandeum?.usd || 0.0025; // Fallback to $0.0025 if fetch fails
        
        // Update cache
        priceCache = {
            solPrice,
            xandPrice,
            timestamp: Date.now()
        };
        
        return { solPrice, xandPrice };
    } catch (error) {
        console.error('Error fetching token prices:', error);
        
        // Return cached data if available, even if expired
        if (priceCache) {
            return { solPrice: priceCache.solPrice, xandPrice: priceCache.xandPrice };
        }
        
        // Fallback prices
        return { solPrice: 100, xandPrice: 0.0025 };
    }
}

export async function GET() {
    try {
        // Fetch real token prices (with caching)
        const { solPrice, xandPrice } = await fetchTokenPrices();
        
        // Calculate exchange rate: How many XAND you get for 1 SOL
        // Formula: 1 SOL = (SOL_PRICE / XAND_PRICE) XAND tokens
        const exchangeRate = solPrice / xandPrice;
        
        // Calculate realistic APY based on Solana network average (~7%)
        const apy = 7.2;
        
        const stakingData = {
            apy,
            exchange_rate: exchangeRate,
            sol_price: solPrice,
            xand_price: xandPrice,
            total_staked: 1000000,  // This would come from the staking pool program
            total_supply: 1000000 * exchangeRate,  // Total XANDsol minted
            last_updated: new Date().toISOString(),
        };

        return NextResponse.json(stakingData);
    } catch (error) {
        console.error('Error fetching staking pool stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch staking data' },
            { status: 500 }
        );
    }
}
