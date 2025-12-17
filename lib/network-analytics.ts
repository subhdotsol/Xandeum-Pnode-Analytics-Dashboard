// Network analytics engine for health scoring and metrics calculation

import type {
  PNodeInfo,
  PNodeStats,
  NodeHealth,
  NetworkAnalytics,
} from "@/types/pnode";
import { compareVersions } from "./utils";

// Health thresholds (in seconds)
const HEALTHY_THRESHOLD = 300; // 5 minutes
const DEGRADED_THRESHOLD = 3600; // 1 hour

/**
 * Determine node health status based on last seen timestamp
 */
export function getNodeHealth(lastSeenTimestamp: number): NodeHealth {
  const now = Math.floor(Date.now() / 1000);
  const delta = now - lastSeenTimestamp;

  if (delta < HEALTHY_THRESHOLD) {
    return {
      status: "healthy",
      color: "#14F1C6",
      text: "Healthy",
      icon: "●",
      opacity: 1.0,
    };
  } else if (delta < DEGRADED_THRESHOLD) {
    return {
      status: "degraded",
      color: "#F59E0B",
      text: "Degraded",
      icon: "◐",
      opacity: 0.6,
    };
  } else {
    return {
      status: "offline",
      color: "#EF4444",
      text: "Offline",
      icon: "○",
      opacity: 0.3,
    };
  }
}

/**
 * Analyze the entire pNode network and calculate comprehensive metrics
 */
export function analyzeNetwork(
  pnodes: PNodeInfo[],
  stats?: Map<string, PNodeStats>
): NetworkAnalytics {
  const total = pnodes.length;

  // Calculate health distribution
  let healthy = 0;
  let degraded = 0;
  let offline = 0;

  pnodes.forEach((node) => {
    const health = getNodeHealth(node.last_seen_timestamp);
    if (health.status === "healthy") healthy++;
    else if (health.status === "degraded") degraded++;
    else offline++;
  });

  // Calculate health percentages
  const healthyPercentage = total > 0 ? (healthy / total) * 100 : 0;
  const degradedPercentage = total > 0 ? (degraded / total) * 100 : 0;
  const offlinePercentage = total > 0 ? (offline / total) * 100 : 0;

  // Calculate version distribution
  const versionCounts: Record<string, number> = {};
  pnodes.forEach((node) => {
    const version = node.version || "unknown";
    versionCounts[version] = (versionCounts[version] || 0) + 1;
  });

  // Find latest version
  const versions = Object.keys(versionCounts).filter((v) => v !== "unknown");
  const latestVersion =
    versions.length > 0
      ? versions.reduce((latest, current) =>
          compareVersions(current, latest) > 0 ? current : latest
        )
      : "unknown";

  // Count outdated nodes
  const outdatedCount = pnodes.filter(
    (node) =>
      node.version &&
      node.version !== "unknown" &&
      compareVersions(node.version, latestVersion) < 0
  ).length;

  const outdatedPercentage = total > 0 ? (outdatedCount / total) * 100 : 0;

  // Calculate storage metrics (if stats available)
  let totalCapacity = 0;
  let totalUsed = 0;
  let avgCPU = 0;
  let avgRAM = 0;
  let avgUptime = 0;

  if (stats && stats.size > 0) {
    const validStats = Array.from(stats.values());
    totalCapacity = validStats.reduce((sum, s) => sum + s.total_bytes, 0);
    totalUsed = validStats.reduce((sum, s) => sum + s.file_size, 0);
    avgCPU =
      validStats.reduce((sum, s) => sum + s.cpu_percent, 0) / validStats.length;
    avgRAM =
      validStats.reduce((sum, s) => sum + (s.ram_used / s.ram_total) * 100, 0) /
      validStats.length;
    avgUptime =
      validStats.reduce((sum, s) => sum + s.uptime, 0) / validStats.length;
  }

  const averagePerNode = total > 0 ? totalCapacity / total : 0;
  const utilizationPercentage =
    totalCapacity > 0 ? (totalUsed / totalCapacity) * 100 : 0;

  // Calculate health score (0-100)
  // Algorithm: healthy% × 60 + upToDate% × 30 + degraded% × 10
  const upToDatePercentage = total > 0 ? ((total - outdatedCount) / total) * 100 : 0;
  const healthScore =
    healthyPercentage * 0.6 + upToDatePercentage * 0.3 + degradedPercentage * 0.1;

  // Identify risks
  const singleVersionDominance = Object.values(versionCounts).some(
    (count) => total > 0 && (count / total) * 100 > 80
  );
  const lowHealthNodes = degraded + offline;
  const staleNodes = pnodes.filter((node) => {
    const delta = Math.floor(Date.now() / 1000) - node.last_seen_timestamp;
    return delta > 86400; // 24 hours
  }).length;

  return {
    totals: {
      total,
      healthy,
      degraded,
      offline,
    },
    health: {
      score: Math.round(healthScore),
      healthyPercentage: Math.round(healthyPercentage * 10) / 10,
      degradedPercentage: Math.round(degradedPercentage * 10) / 10,
      offlinePercentage: Math.round(offlinePercentage * 10) / 10,
    },
    versions: {
      latest: latestVersion,
      distribution: versionCounts,
      outdatedCount,
      outdatedPercentage: Math.round(outdatedPercentage * 10) / 10,
    },
    storage: {
      totalCapacity,
      totalUsed,
      averagePerNode,
      utilizationPercentage: Math.round(utilizationPercentage * 10) / 10,
    },
    performance: {
      averageCPU: Math.round(avgCPU * 10) / 10,
      averageRAM: Math.round(avgRAM * 10) / 10,
      averageUptime: Math.round(avgUptime),
    },
    risks: {
      singleVersionDominance,
      lowHealthNodes,
      staleNodes,
    },
  };
}
