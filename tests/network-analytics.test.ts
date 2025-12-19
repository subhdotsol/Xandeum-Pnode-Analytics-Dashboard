import { describe, it, expect } from "vitest";
import { analyzeNetwork, getNodeHealth } from "@/lib/network-analytics";
import { compareVersions } from "@/lib/utils";
import type { PNodeInfo } from "@/types/pnode";

describe("getNodeHealth", () => {
  it("should return healthy for nodes seen within 5 minutes", () => {
    const now = Math.floor(Date.now() / 1000);
    const recentTimestamp = now - 60; // 1 minute ago

    const health = getNodeHealth(recentTimestamp);
    expect(health.status).toBe("healthy");
    expect(health.opacity).toBe(1.0);
  });

  it("should return degraded for nodes seen between 5 minutes and 1 hour", () => {
    const now = Math.floor(Date.now() / 1000);
    const timestamp = now - 1800; // 30 minutes ago

    const health = getNodeHealth(timestamp);
    expect(health.status).toBe("degraded");
    expect(health.opacity).toBe(0.6);
  });

  it("should return offline for nodes not seen for over 1 hour", () => {
    const now = Math.floor(Date.now() / 1000);
    const oldTimestamp = now - 7200; // 2 hours ago

    const health = getNodeHealth(oldTimestamp);
    expect(health.status).toBe("offline");
    expect(health.opacity).toBe(0.3);
  });

  it("should handle edge case at exactly 5 minutes", () => {
    const now = Math.floor(Date.now() / 1000);
    const timestamp = now - 300; // Exactly 5 minutes

    const health = getNodeHealth(timestamp);
    // At exactly 300 seconds, delta is not < 300, so it should be degraded
    expect(health.status).toBe("degraded");
  });
});

describe("compareVersions", () => {
  it("should return positive when first version is greater", () => {
    expect(compareVersions("1.2.0", "1.1.0")).toBeGreaterThan(0);
    expect(compareVersions("2.0.0", "1.9.9")).toBeGreaterThan(0);
    expect(compareVersions("1.0.1", "1.0.0")).toBeGreaterThan(0);
  });

  it("should return negative when first version is smaller", () => {
    expect(compareVersions("1.1.0", "1.2.0")).toBeLessThan(0);
    expect(compareVersions("1.9.9", "2.0.0")).toBeLessThan(0);
    expect(compareVersions("1.0.0", "1.0.1")).toBeLessThan(0);
  });

  it("should return 0 for equal versions", () => {
    expect(compareVersions("1.0.0", "1.0.0")).toBe(0);
    expect(compareVersions("2.5.3", "2.5.3")).toBe(0);
  });

  it("should handle versions with different segment counts", () => {
    expect(compareVersions("1.0", "1.0.0")).toBe(0);
    expect(compareVersions("1.0.0.1", "1.0.0")).toBeGreaterThan(0);
  });
});

describe("analyzeNetwork", () => {
  const mockNodes: PNodeInfo[] = [
    {
      address: "192.168.1.1:9001",
      last_seen_timestamp: Math.floor(Date.now() / 1000) - 60,
      pubkey: "pub1",
      version: "1.0.0",
    },
    {
      address: "192.168.1.2:9001",
      last_seen_timestamp: Math.floor(Date.now() / 1000) - 1800,
      pubkey: "pub2",
      version: "1.0.0",
    },
    {
      address: "192.168.1.3:9001",
      last_seen_timestamp: Math.floor(Date.now() / 1000) - 7200,
      pubkey: "pub3",
      version: "0.9.0",
    },
    {
      address: "192.168.1.4:9001",
      last_seen_timestamp: Math.floor(Date.now() / 1000) - 30,
      pubkey: "pub4",
      version: "1.0.0",
    },
  ];

  it("should calculate correct totals", () => {
    const analytics = analyzeNetwork(mockNodes);
    expect(analytics.totals.total).toBe(4);
  });

  it("should correctly identify health distribution", () => {
    const analytics = analyzeNetwork(mockNodes);
    expect(analytics.totals.healthy).toBe(2); // nodes 1 and 4
    expect(analytics.totals.degraded).toBe(1); // node 2
    expect(analytics.totals.offline).toBe(1); // node 3
  });

  it("should identify the latest version", () => {
    const analytics = analyzeNetwork(mockNodes);
    expect(analytics.versions.latest).toBe("1.0.0");
  });

  it("should count outdated nodes", () => {
    const analytics = analyzeNetwork(mockNodes);
    expect(analytics.versions.outdatedCount).toBe(1); // node 3 with 0.9.0
  });

  it("should calculate version distribution", () => {
    const analytics = analyzeNetwork(mockNodes);
    expect(analytics.versions.distribution["1.0.0"]).toBe(3);
    expect(analytics.versions.distribution["0.9.0"]).toBe(1);
  });

  it("should calculate health score", () => {
    const analytics = analyzeNetwork(mockNodes);
    expect(analytics.health.score).toBeGreaterThanOrEqual(0);
    expect(analytics.health.score).toBeLessThanOrEqual(100);
  });

  it("should detect single version dominance risk", () => {
    // Create nodes where 85% are same version
    const dominantNodes: PNodeInfo[] = Array(85)
      .fill(null)
      .map((_, i) => ({
        address: `192.168.1.${i}:9001`,
        last_seen_timestamp: Math.floor(Date.now() / 1000) - 60,
        pubkey: `pub${i}`,
        version: "1.0.0",
      }));

    const otherNodes: PNodeInfo[] = Array(15)
      .fill(null)
      .map((_, i) => ({
        address: `192.168.2.${i}:9001`,
        last_seen_timestamp: Math.floor(Date.now() / 1000) - 60,
        pubkey: `pub${100 + i}`,
        version: "0.9.0",
      }));

    const analytics = analyzeNetwork([...dominantNodes, ...otherNodes]);
    expect(analytics.risks.singleVersionDominance).toBe(true);
  });

  it("should identify stale nodes (24h+)", () => {
    const staleNode: PNodeInfo = {
      address: "192.168.1.100:9001",
      last_seen_timestamp: Math.floor(Date.now() / 1000) - 100000, // ~27 hours
      pubkey: "pubstale",
      version: "1.0.0",
    };

    const analytics = analyzeNetwork([...mockNodes, staleNode]);
    expect(analytics.risks.staleNodes).toBeGreaterThan(0);
  });
});
