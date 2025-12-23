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

interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  hitRate: number;
}

class GeoCache {
  private cache = new Map<string, CacheEntry>();
  private readonly CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  
  // Stats tracking
  private hits = 0;
  private misses = 0;
  private silent = false; // Reduce log noise in production

  /**
   * Enable/disable logging
   */
  setSilent(silent: boolean): void {
    this.silent = silent;
  }

  /**
   * Get cached geolocation data for an IP
   * Returns null if not cached or expired
   */
  get(ip: string): GeoData | null {
    const cached = this.cache.get(ip);

    if (cached) {
      // Check if cache is still valid
      if (Date.now() - cached.timestamp < this.CACHE_TTL) {
        this.hits++;
        if (!this.silent) console.log(`[GeoCache] ✓ Cache hit for ${ip}`);
        return cached.data;
      } else {
        // Expired, remove it
        this.cache.delete(ip);
        if (!this.silent) console.log(`[GeoCache] Cache expired for ${ip}`);
      }
    }

    this.misses++;
    if (!this.silent) console.log(`[GeoCache] Cache miss for ${ip}`);
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
    if (!this.silent) console.log(`[GeoCache] Cached ${ip} (total: ${this.cache.size})`);
  }

  /**
   * Check if IP is cached (without counting as hit/miss)
   */
  has(ip: string): boolean {
    const cached = this.cache.get(ip);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.CACHE_TTL;
  }

  /**
   * Batch check - filter IPs that need to be fetched
   */
  filterUncached(ips: string[]): string[] {
    return ips.filter(ip => !this.has(ip));
  }

  /**
   * Batch get - returns map of IP -> GeoData for cached entries
   */
  batchGet(ips: string[]): Map<string, GeoData> {
    const results = new Map<string, GeoData>();
    for (const ip of ips) {
      const data = this.get(ip);
      if (data) results.set(ip, data);
    }
    return results;
  }

  /**
   * Get current cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      size: this.cache.size,
      hitRate: total > 0 ? (this.hits / total) * 100 : 0
    };
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.hits = 0;
    this.misses = 0;
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

  /**
   * Export cache data for persistence (e.g., to localStorage or file)
   */
  export(): Record<string, CacheEntry> {
    const data: Record<string, CacheEntry> = {};
    for (const [ip, entry] of this.cache.entries()) {
      // Only export non-expired entries
      if (Date.now() - entry.timestamp < this.CACHE_TTL) {
        data[ip] = entry;
      }
    }
    return data;
  }

  /**
   * Import cache data from persistence
   */
  import(data: Record<string, CacheEntry>): number {
    let imported = 0;
    const now = Date.now();
    
    for (const [ip, entry] of Object.entries(data)) {
      // Only import non-expired entries
      if (now - entry.timestamp < this.CACHE_TTL) {
        this.cache.set(ip, entry);
        imported++;
      }
    }
    
    console.log(`[GeoCache] Imported ${imported} entries`);
    return imported;
  }
}

// Export singleton instance
export const geoCache = new GeoCache();

