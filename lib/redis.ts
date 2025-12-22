import { Redis } from "@upstash/redis";

// Upstash Redis client for serverless caching
// Falls back to in-memory cache if Redis not configured

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// In-memory fallback cache
const memoryCache = new Map<string, CacheEntry<any>>();

// Initialize Redis client (only in production/with credentials)
let redis: Redis | null = null;

if (
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
  console.log("[Redis] Connected to Upstash Redis");
} else {
  console.log("[Redis] Using in-memory cache (Redis not configured)");
}

// Cache TTL configurations (in seconds)
export const CACHE_TTL = {
  PNODES_LIST: 60, // 1 minute
  PNODE_STATS: 30, // 30 seconds
  NETWORK_OVERVIEW: 60, // 1 minute
  GEO_LOCATION: 604800, // 7 days
} as const;

/**
 * Get cached value with automatic fallback to memory cache
 */
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    if (redis) {
      const data = await redis.get<T>(key);
      return data;
    }

    // Fallback to memory cache
    const entry = memoryCache.get(key);
    if (entry) {
      const age = Date.now() - entry.timestamp;
      const ttl = getTTLForKey(key);

      if (age < ttl * 1000) {
        return entry.data as T;
      } else {
        memoryCache.delete(key);
      }
    }

    return null;
  } catch (error) {
    console.error(`[Redis] Error getting cache for key ${key}:`, error);
    return null;
  }
}

/**
 * Set cached value with TTL
 */
export async function setCache<T>(
  key: string,
  value: T,
  ttl?: number
): Promise<void> {
  try {
    const cacheTTL = ttl ?? getTTLForKey(key);

    if (redis) {
      await redis.set(key, value, { ex: cacheTTL });
    } else {
      // Store in memory cache
      memoryCache.set(key, {
        data: value,
        timestamp: Date.now(),
      });
    }
  } catch (error) {
    console.error(`[Redis] Error setting cache for key ${key}:`, error);
  }
}

/**
 * Delete cached value
 */
export async function deleteCache(key: string): Promise<void> {
  try {
    if (redis) {
      await redis.del(key);
    } else {
      memoryCache.delete(key);
    }
  } catch (error) {
    console.error(`[Redis] Error deleting cache for key ${key}:`, error);
  }
}

/**
 * Delete all keys matching a pattern
 */
export async function deleteCachePattern(pattern: string): Promise<void> {
  try {
    if (redis) {
      // Upstash doesn't support SCAN, so we'll use a manual approach
      // For now, just log a warning
      console.warn(
        `[Redis] Pattern deletion not supported in Upstash, key: ${pattern}`
      );
    } else {
      // Clear memory cache items matching pattern
      const regex = new RegExp(pattern.replace("*", ".*"));
      for (const key of memoryCache.keys()) {
        if (regex.test(key)) {
          memoryCache.delete(key);
        }
      }
    }
  } catch (error) {
    console.error(
      `[Redis] Error deleting cache pattern ${pattern}:`,
      error
    );
  }
}

/**
 * Get TTL for a cache key based on naming convention
 */
function getTTLForKey(key: string): number {
  if (key.startsWith("pnodes:list")) return CACHE_TTL.PNODES_LIST;
  if (key.startsWith("pnodes:stats:")) return CACHE_TTL.PNODE_STATS;
  if (key.startsWith("network:overview")) return CACHE_TTL.NETWORK_OVERVIEW;
  if (key.startsWith("geo:")) return CACHE_TTL.GEO_LOCATION;

  return 60; // Default 1 minute
}

/**
 * Clear all cache (use sparingly)
 */
export async function clearAllCache(): Promise<void> {
  try {
    if (redis) {
      await redis.flushdb();
    } else {
      memoryCache.clear();
    }
    console.log("[Redis] Cache cleared");
  } catch (error) {
    console.error("[Redis] Error clearing cache:", error);
  }
}
