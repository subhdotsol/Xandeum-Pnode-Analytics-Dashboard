// In-memory geolocation cache with TTL
// Reduces API calls to ip-api.com and avoids rate limiting

export interface GeoData {
  lat: number;
  lng: number;
  city?: string;
  country?: string;
  regionName?: string;
  isp?: string;
  org?: string;
}

interface CacheEntry {
  data: GeoData;
  timestamp: number;
}

class GeoCache {
  private cache = new Map<string, CacheEntry>();
  private readonly CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

  /**
   * Get cached geolocation data for an IP
   * Returns null if not cached or expired
   */
  get(ip: string): GeoData | null {
    const cached = this.cache.get(ip);

    if (cached) {
      // Check if cache is still valid
      if (Date.now() - cached.timestamp < this.CACHE_TTL) {
        console.log(`[GeoCache] ✓ Cache hit for ${ip}`);
        return cached.data;
      } else {
        // Expired, remove it
        this.cache.delete(ip);
        console.log(`[GeoCache] Cache expired for ${ip}`);
      }
    }

    console.log(`[GeoCache] Cache miss for ${ip}`);
    return null;
  }

  /**
   * Store geolocation data in cache
   */
  set(ip: string, data: GeoData): void {
    this.cache.set(ip, {
      data,
      timestamp: Date.now(),
    });
    console.log(`[GeoCache] Cached ${ip} (total: ${this.cache.size})`);
  }

  /**
   * Get current cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Clear all cached entries
   */
  clear(): void {
    this.cache.clear();
    console.log(`[GeoCache] Cache cleared`);
  }

  /**
   * Remove expired entries (optional cleanup)
   */
  cleanup(): number {
    const now = Date.now();
    let removed = 0;

    for (const [ip, entry] of this.cache.entries()) {
      if (now - entry.timestamp >= this.CACHE_TTL) {
        this.cache.delete(ip);
        removed++;
      }
    }

    if (removed > 0) {
      console.log(`[GeoCache] Cleaned up ${removed} expired entries`);
    }

    return removed;
  }
}

// Export singleton instance
export const geoCache = new GeoCache();
