// Type definitions for Xandeum pNode network

export interface PNodeInfo {
  address: string;              // e.g., "173.212.203.145:9001"
  last_seen_timestamp: number;  // Unix timestamp (seconds)
  pubkey: string | null;        // Node's public key
  version: string;              // e.g., "0.1.0"
}

export interface PNodeStats {
  active_streams: number;
  cpu_percent: number;
  current_index: number;
  file_size: number;
  last_updated: number;
  packets_received: number;
  packets_sent: number;
  ram_total: number;
  ram_used: number;
  total_bytes: number;
  total_pages: number;
  uptime: number;
}

export interface PNodeListResponse {
  pods: PNodeInfo[];
  total_count: number;
}

export interface NodeHealth {
  status: "healthy" | "degraded" | "offline";
  color: string;
  text: string;
  icon: string;
  opacity: number;
}

export interface NetworkAnalytics {
  totals: {
    total: number;
    healthy: number;
    degraded: number;
    offline: number;
  };
  health: {
    score: number;              // 0-100
    healthyPercentage: number;
    degradedPercentage: number;
    offlinePercentage: number;
  };
  versions: {
    latest: string;
    distribution: Record<string, number>;
    outdatedCount: number;
    outdatedPercentage: number;
  };
  storage: {
    totalCapacity: number;
    totalUsed: number;
    averagePerNode: number;
    utilizationPercentage: number;
  };
  performance: {
    averageCPU: number;
    averageRAM: number;
    averageUptime: number;
  };
  risks: {
    singleVersionDominance: boolean;
    lowHealthNodes: number;
    staleNodes: number;
  };
}

export interface GeoLocation {
  address: string;
  lat: number;
  lon: number;
  city?: string;
  country?: string;
}
