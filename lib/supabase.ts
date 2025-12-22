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
  endTimestamp: number = Math.floor(Date.now() / 1000),
  limit: number = 100
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
    .order("timestamp", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("[Supabase] Error fetching snapshots by range:", error.message);
    return [];
  }

  return data || [];
}
