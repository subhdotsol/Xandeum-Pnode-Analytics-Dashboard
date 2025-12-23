import { createClient } from "@supabase/supabase-js";

// Supabase client for historical analytics
// This connects to a separate Supabase project dedicated to analytics data

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("[Supabase] Analytics not configured - SUPABASE_URL or SUPABASE_KEY missing");
}

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export interface HistoricalSnapshot {
  id?: number;
  timestamp: number;
  total_nodes: number;
  online_nodes: number;
  offline_nodes: number;
  avg_cpu: number;
  avg_ram: number;
  total_storage: number;
  unique_countries: number;
  unique_versions: number;
  created_at?: string;
}

/**
 * Save a snapshot to Supabase historical_snapshots table
 */
export async function saveSnapshot(snapshot: Omit<HistoricalSnapshot, 'id' | 'created_at'>): Promise<boolean> {
  if (!supabase) {
    console.error("[Supabase] Client not configured");
    return false;
  }

  const { error } = await supabase
    .from("historical_snapshots")
    .insert([snapshot]);

  if (error) {
    console.error("[Supabase] Error saving snapshot:", error.message);
    return false;
  }

  console.log("[Supabase] Snapshot saved successfully");
  return true;
}

/**
 * Get historical snapshots from Supabase
 */
export async function getSnapshots(limit: number = 100): Promise<HistoricalSnapshot[]> {
  if (!supabase) {
    console.error("[Supabase] Client not configured");
    return [];
  }

  const { data, error } = await supabase
    .from("historical_snapshots")
    .select("*")
    .order("timestamp", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("[Supabase] Error fetching snapshots:", error.message);
    return [];
  }

  return data || [];
}

/**
 * Get snapshots within a time range
 */
export async function getSnapshotsByRange(
  startTimestamp: number,
  endTimestamp: number = Math.floor(Date.now() / 1000)
): Promise<HistoricalSnapshot[]> {
  if (!supabase) {
    console.error("[Supabase] Client not configured");
    return [];
  }

  const { data, error } = await supabase
    .from("historical_snapshots")
    .select("*")
    .gte("timestamp", startTimestamp)
    .lte("timestamp", endTimestamp)
    .order("timestamp", { ascending: true });

  if (error) {
    console.error("[Supabase] Error fetching snapshots by range:", error.message);
    return [];
  }

  return data || [];
}

// =============================================================================
// PNODE STATS (Individual node performance metrics)
// =============================================================================

export interface PNodeStats {
  id?: number;
  ip: string;
  address: string;
  pubkey?: string | null;
  version?: string | null;
  
  // Liveness
  last_seen_timestamp?: number | null;
  
  // Performance stats
  cpu_percent?: number | null;
  ram_used?: number | null;
  ram_total?: number | null;
  uptime_seconds?: number | null;
  
  // Storage
  total_bytes?: number | null;
  file_size?: number | null;
  total_pages?: number | null;
  
  // Network
  packets_received?: number | null;
  packets_sent?: number | null;
  active_streams?: number | null;
  
  // Geolocation
  latitude?: number | null;
  longitude?: number | null;
  country?: string | null;
  city?: string | null;
  
  // Timestamps
  last_updated?: string;
  created_at?: string;
}

/**
 * Upsert multiple pNode stats (batch insert/update)
 */
export async function upsertPNodeStats(stats: Omit<PNodeStats, 'id' | 'created_at'>[]): Promise<{ success: number; failed: number }> {
  if (!supabase) {
    console.error("[Supabase] Client not configured");
    return { success: 0, failed: stats.length };
  }

  // Supabase upsert on conflict of 'ip'
  const { data, error } = await supabase
    .from("pnode_stats")
    .upsert(
      stats.map(s => ({
        ...s,
        last_updated: new Date().toISOString(),
      })),
      { onConflict: 'ip' }
    );

  if (error) {
    console.error("[Supabase] Error upserting pnode stats:", error.message);
    return { success: 0, failed: stats.length };
  }

  return { success: stats.length, failed: 0 };
}

/**
 * Get all pNode stats from database
 */
export async function getAllPNodeStats(): Promise<PNodeStats[]> {
  if (!supabase) {
    console.error("[Supabase] Client not configured");
    return [];
  }

  const { data, error } = await supabase
    .from("pnode_stats")
    .select("*")
    .order("last_seen_timestamp", { ascending: false });

  if (error) {
    console.error("[Supabase] Error fetching pnode stats:", error.message);
    return [];
  }

  return data || [];
}

/**
 * Get online pNode stats (seen within last 5 minutes)
 */
export async function getOnlinePNodeStats(): Promise<PNodeStats[]> {
  if (!supabase) {
    console.error("[Supabase] Client not configured");
    return [];
  }

  const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 300;

  const { data, error } = await supabase
    .from("pnode_stats")
    .select("*")
    .gte("last_seen_timestamp", fiveMinutesAgo)
    .order("cpu_percent", { ascending: false, nullsFirst: false });

  if (error) {
    console.error("[Supabase] Error fetching online pnode stats:", error.message);
    return [];
  }

  return data || [];
}

/**
 * Get pNode stats by IP
 */
export async function getPNodeStatsByIp(ip: string): Promise<PNodeStats | null> {
  if (!supabase) {
    console.error("[Supabase] Client not configured");
    return null;
  }

  const { data, error } = await supabase
    .from("pnode_stats")
    .select("*")
    .eq("ip", ip)
    .single();

  if (error) {
    if (error.code !== 'PGRST116') { // Ignore "no rows returned" error
      console.error("[Supabase] Error fetching pnode stats by IP:", error.message);
    }
    return null;
  }

  return data;
}
