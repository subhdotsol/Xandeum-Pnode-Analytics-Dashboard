import { describe, it, expect, beforeEach } from "vitest";

// We'll test the cache logic directly since we can't easily import the singleton
// This file tests the cache behavior patterns

interface GeoData {
  lat: number;
  lng: number;
  city?: string;
  country?: string;
}

interface CacheEntry {
  data: GeoData;
  timestamp: number;
}

// Recreate the cache class for testing
class TestGeoCache {
  private cache = new Map<string, CacheEntry>();
  private readonly CACHE_TTL: number;

  constructor(ttlMs: number = 7 * 24 * 60 * 60 * 1000) {
    this.CACHE_TTL = ttlMs;
  }

  get(ip: string): GeoData | null {
    const cached = this.cache.get(ip);

    if (cached) {
      if (Date.now() - cached.timestamp < this.CACHE_TTL) {
        return cached.data;
      } else {
        this.cache.delete(ip);
      }
    }

    return null;
  }

  set(ip: string, data: GeoData): void {
    this.cache.set(ip, {
      data,
      timestamp: Date.now(),
    });
  }

  size(): number {
    return this.cache.size;
  }

  clear(): void {
    this.cache.clear();
  }

  // For testing: manually set timestamp
  setWithTimestamp(ip: string, data: GeoData, timestamp: number): void {
    this.cache.set(ip, { data, timestamp });
  }
}

describe("GeoCache", () => {
  let cache: TestGeoCache;

  beforeEach(() => {
    cache = new TestGeoCache();
  });

  describe("basic operations", () => {
    it("should store and retrieve geo data", () => {
      const testData: GeoData = {
        lat: 40.7128,
        lng: -74.006,
        city: "New York",
        country: "United States",
      };

      cache.set("192.168.1.1", testData);
      const result = cache.get("192.168.1.1");

      expect(result).not.toBeNull();
      expect(result?.lat).toBe(40.7128);
      expect(result?.lng).toBe(-74.006);
      expect(result?.city).toBe("New York");
    });

    it("should return null for missing entries", () => {
      const result = cache.get("192.168.1.1");
      expect(result).toBeNull();
    });

    it("should track cache size correctly", () => {
      expect(cache.size()).toBe(0);

      cache.set("192.168.1.1", { lat: 0, lng: 0 });
      expect(cache.size()).toBe(1);

      cache.set("192.168.1.2", { lat: 1, lng: 1 });
      expect(cache.size()).toBe(2);

      cache.set("192.168.1.1", { lat: 2, lng: 2 }); // Update existing
      expect(cache.size()).toBe(2);
    });

    it("should clear all entries", () => {
      cache.set("192.168.1.1", { lat: 0, lng: 0 });
      cache.set("192.168.1.2", { lat: 1, lng: 1 });

      expect(cache.size()).toBe(2);
      cache.clear();
      expect(cache.size()).toBe(0);
      expect(cache.get("192.168.1.1")).toBeNull();
    });
  });

  describe("TTL expiration", () => {
    it("should return cached data within TTL", () => {
      // Create a cache with 1 hour TTL
      const shortCache = new TestGeoCache(60 * 60 * 1000);
      const testData: GeoData = { lat: 40.7128, lng: -74.006 };

      shortCache.set("192.168.1.1", testData);
      const result = shortCache.get("192.168.1.1");

      expect(result).not.toBeNull();
    });

    it("should return null for expired entries", () => {
      // Create a cache with 1 second TTL for testing
      const shortCache = new TestGeoCache(1000);
      const testData: GeoData = { lat: 40.7128, lng: -74.006 };

      // Set with a timestamp 2 seconds in the past
      shortCache.setWithTimestamp("192.168.1.1", testData, Date.now() - 2000);
      const result = shortCache.get("192.168.1.1");

      expect(result).toBeNull();
    });

    it("should remove expired entries on access", () => {
      const shortCache = new TestGeoCache(1000);
      const testData: GeoData = { lat: 40.7128, lng: -74.006 };

      shortCache.setWithTimestamp("192.168.1.1", testData, Date.now() - 2000);

      // Before access, entry is still in map
      expect(shortCache.size()).toBe(1);

      // Access expired entry
      shortCache.get("192.168.1.1");

      // Entry should be removed
      expect(shortCache.size()).toBe(0);
    });
  });

  describe("multiple entries", () => {
    it("should handle multiple IPs independently", () => {
      const data1: GeoData = { lat: 40.7128, lng: -74.006, city: "NYC" };
      const data2: GeoData = { lat: 34.0522, lng: -118.2437, city: "LA" };
      const data3: GeoData = { lat: 51.5074, lng: -0.1278, city: "London" };

      cache.set("192.168.1.1", data1);
      cache.set("192.168.1.2", data2);
      cache.set("192.168.1.3", data3);

      expect(cache.get("192.168.1.1")?.city).toBe("NYC");
      expect(cache.get("192.168.1.2")?.city).toBe("LA");
      expect(cache.get("192.168.1.3")?.city).toBe("London");
    });

    it("should update existing entries", () => {
      cache.set("192.168.1.1", { lat: 0, lng: 0, city: "Original" });
      cache.set("192.168.1.1", { lat: 1, lng: 1, city: "Updated" });

      const result = cache.get("192.168.1.1");
      expect(result?.city).toBe("Updated");
      expect(result?.lat).toBe(1);
    });
  });

  describe("edge cases", () => {
    it("should handle IPv6 addresses", () => {
      const testData: GeoData = { lat: 40.7128, lng: -74.006 };
      cache.set("2001:0db8:85a3:0000:0000:8a2e:0370:7334", testData);

      const result = cache.get("2001:0db8:85a3:0000:0000:8a2e:0370:7334");
      expect(result).not.toBeNull();
    });

    it("should handle minimal geo data", () => {
      const minimalData: GeoData = { lat: 0, lng: 0 };
      cache.set("192.168.1.1", minimalData);

      const result = cache.get("192.168.1.1");
      expect(result).toEqual(minimalData);
      expect(result?.city).toBeUndefined();
    });
  });
});
