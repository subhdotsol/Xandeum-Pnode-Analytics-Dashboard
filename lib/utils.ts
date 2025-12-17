// Utility function to merge class names
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format bytes to human-readable format
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

// Format uptime to human-readable format
export function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  const parts = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  
  return parts.length > 0 ? parts.join(" ") : "< 1m"
}

// Parse version string to numeric array for comparison
export function parseVersion(version: string): number[] {
  if (!version || version === "unknown") return [0, 0, 0]
  const parts = version.split(".").map(Number)
  return [parts[0] || 0, parts[1] || 0, parts[2] || 0]
}

// Compare two version strings
export function compareVersions(v1: string, v2: string): number {
  const parts1 = parseVersion(v1)
  const parts2 = parseVersion(v2)
  
  for (let i = 0; i < 3; i++) {
    if (parts1[i] > parts2[i]) return 1
    if (parts1[i] < parts2[i]) return -1
  }
  return 0
}
