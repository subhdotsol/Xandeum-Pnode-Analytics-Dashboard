# Xandeum pNode Analytics Dashboard - Complete Project Documentation

## Executive Summary

**Project Name:** Xandeum pNode Analytics Dashboard  
**Purpose:** Real-time monitoring and visualization of the Xandeum distributed storage network  
**Tech Stack:** Next.js 16 (App Router), TypeScript, React 19, TailwindCSS 4, D3.js, Three.js  
**Architecture:** Server-side rendered dashboard with JSON-RPC client for peer-to-peer network data collection

## What This Application Does

This is a **real-time network analytics dashboard** that monitors and visualizes the health, distribution, and performance of pNodes (storage nodes) in the Xandeum distributed storage network. The application:

1. **Discovers and tracks pNodes** across the network by querying seed nodes via JSON-RPC
2. **Analyzes network health** using sophisticated metrics (uptime, version distribution, geographic spread)
3. **Visualizes data** through multiple interfaces:
   - Interactive 3D rotating globe with geolocation
   - Statistical overview dashboard with health scoring
   - Filterable/sortable data tables
   - Geographic distribution maps
4. **Provides real-time insights** into network performance, storage utilization, and node status

---

## Core Concept & Architecture

### Network Discovery Flow
```
Seed pNodes → JSON-RPC "get-pods" → Aggregation → Deduplication → Analytics → UI
```

The application uses a **decentralized discovery pattern**:
- Queries multiple seed pNodes in parallel
- Each seed node returns its view of the network
- Results are merged and deduplicated by address
- The most recent `last_seen_timestamp` is kept for each node

### Health Classification System
Nodes are classified into 3 states based on `last_seen_timestamp`:
- **Healthy**: Seen within 5 minutes (300s) - ● at 100% opacity, teal
- **Degraded**: Seen within 1 hour (3600s) - ● at 50% opacity, teal  
- **Offline**: Not seen for >1 hour - ● at 20% opacity, teal

### Network Health Score Algorithm
The health score (0-100) is calculated as:
```
score = (healthy_nodes_pct × 60) + (up_to_date_versions_pct × 30) + (degraded_nodes_pct × 10)
```
This weights node availability (60%), version currency (30%), and partial uptime (10%).

---

## Project Structure

```
xandeum-analytics/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes (server-side)
│   │   ├── pnodes/
│   │   │   ├── route.ts          # GET /api/pnodes - fetch all nodes
│   │   │   └── [address]/
│   │   │       └── route.ts      # GET /api/pnodes/[address] - single node
│   │   └── network/
│   │       ├── overview/
│   │       │   └── route.ts      # GET /api/network/overview - full analytics
│   │       └── health/
│   │           └── route.ts      # GET /api/network/health - health metrics
│   ├── pnode/
│   │   └── [address]/
│   │       └── page.tsx          # Individual node detail page
│   ├── map/
│   │   └── page.tsx              # Full-screen map page
│   ├── page.tsx                  # Main dashboard (homepage)
│   ├── layout.tsx                # Root layout with metadata
│   └── globals.css               # Global styles + CSS variables
├── components/
│   ├── PNodesTable.tsx           # Filterable table with search/sort
│   ├── Globe3D.tsx               # D3.js orthographic globe with geolocation
│   ├── MapComponent.tsx          # Leaflet-based map (if used)
│   ├── NetworkDistributionMap.tsx # SVG dotted map visualization
│   └── AutoRefresh.tsx           # Client-side auto-refresh component
├── lib/
│   ├── pnode-client.ts           # JSON-RPC client for pNode communication
│   ├── network-analytics.ts      # Analytics/scoring algorithms
│   └── utils.ts                  # Utility functions
├── types/
│   └── pnode.ts                  # TypeScript interfaces
├── public/                       # Static assets
├── tailwind.config.js            # TailwindCSS theme configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies
```

---

## Detailed File & Component Breakdown

### 1. `types/pnode.ts` - Type Definitions

```typescript
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
```

### 2. `lib/pnode-client.ts` - Network Communication Layer

**Purpose:** Handles all JSON-RPC communication with pNodes over HTTP.

**Key Features:**
- **Seed Node Discovery**: Hardcoded list of reliable entry points
- **Parallel Querying**: Uses `Promise.all()` to query all seeds simultaneously
- **Timeout Handling**: 10-second timeout per request
- **Deduplication**: Merges results and keeps most recent data per address
- **Methods:**
  - `getAllPNodes()`: Queries all seeds for "get-pods" and merges
  - `getPNodeStats(address)`: Calls "get-stats" on specific node
  - `getPNodeVersion(address)`: Calls "get-version" on specific node

**Seed Nodes:**
```typescript
const SEED_PNODES = [
  "173.212.203.145", "173.212.220.65", "161.97.97.41",
  "192.190.136.36", "192.190.136.37", "192.190.136.38",
  "192.190.136.28", "192.190.136.29", "207.244.255.1"
];
```

**RPC Call Format:**
```json
{
  "jsonrpc": "2.0",
  "method": "get-pods",
  "id": 1
}
```

### 3. `lib/network-analytics.ts` - Analytics Engine

**Purpose:** Transforms raw pNode data into actionable network insights.

**Key Exports:**
- `getNodeHealth(timestamp)`: Returns health status with color, text, icon, opacity
- `analyzeNetwork(pnodes, stats?)`: Returns comprehensive `NetworkAnalytics` object
- `formatBytes(bytes)`: Converts bytes to human-readable format
- `formatUptime(seconds)`: Converts seconds to "Xd Xh Xm" format

**Analytics Output Structure:**
```typescript
interface NetworkAnalytics {
  totals: { total, healthy, degraded, offline }
  health: { score, healthyPercentage, degradedPercentage, offlinePercentage }
  versions: { latest, distribution, outdatedCount, outdatedPercentage }
  storage: { totalCapacity, totalUsed, averagePerNode, utilizationPercentage }
  performance: { averageCPU, averageRAM, averageUptime }
  risks: { singleVersionDominance, lowHealthNodes, staleNodes }
}
```

### 4. `app/api/pnodes/route.ts` - pNode List API

**Endpoint:** `GET /api/pnodes`

**Behavior:**
1. Calls `pnodeClient.getAllPNodes()`
2. Returns JSON with success flag, data array, and total count
3. Cache revalidation: 30 seconds

**Response:**
```json
{
  "success": true,
  "data": [ /* PNodeInfo[] */ ],
  "total": 27
}
```

### 5. `app/api/network/overview/route.ts` - Analytics API

**Endpoint:** `GET /api/network/overview`

**Behavior:**
1. Fetches all pNodes
2. Runs `analyzeNetwork()` to compute metrics
3. Adds `lastUpdated` timestamp
4. Cache revalidation: 30 seconds

### 6. `app/api/network/health/route.ts` - Health API

**Endpoint:** `GET /api/network/health`

**Behavior:**
- Similar to overview but returns only health-related metrics
- Includes: score, totals, health percentages, risks

### 7. `app/page.tsx` - Main Dashboard

**Purpose:** Server-side rendered homepage that displays network overview.

**Data Fetching:**
```typescript
async function getNetworkStats() {
  const res = await fetch('http://localhost:3000/api/network/overview', {
    cache: 'no-store'
  });
  return res.json();
}

async function getPNodeList() {
  const res = await fetch('http://localhost:3000/api/pnodes', {
    cache: 'no-store'
  });
  return res.json();
}
```

**UI Sections:**
1. **Header**: Title, description, "Network Map" button
2. **Health Score Widget**: Large score display (0-100) with percentage breakdown
3. **3D Globe**: Shows geolocated nodes with blinking markers
4. **Stat Cards**: Total, Healthy, Degraded, Offline counts
5. **Version Intelligence**: Distribution chart, outdated node warnings
6. **Storage Overview**: Capacity, utilization, per-node averages
7. **Quick Actions Banner**: Link to interactive map
8. **pNodes Table**: Filterable/sortable data grid
9. **Footer**: Last updated timestamp

**Design System:**
- **Color Scheme**: Single-accent system with neo-teal (#14F1C6)
- **Backgrounds**: Deep space gradient (space-dark, space-card)
- **Effects**: Glassmorphism, backdrop blur, hover animations
- **Opacity Coding**: Uses opacity to indicate health state

### 8. `components/Globe3D.tsx` - Interactive 3D Visualization

**Purpose:** Real-time rotating 3D globe using D3.js orthographic projection.

**Key Features:**
1. **Geolocation**: Fetches lat/lng from ip-api.com (rate-limited)
2. **Batching**: Processes 10 nodes at a time with 1.5s delay
3. **Halftone Rendering**: Dots instead of solid fills for artistic effect
4. **Auto-rotation**: Spins at 0.3°/frame, pauses on drag
5. **Blinking Markers**: Animated glow effect with `Math.sin()` timing
6. **Mouse Interaction**: Drag to rotate, auto-resumes after 1s

**Rendering Pipeline:**
```
World GeoJSON → generateDotsInPolygon() → D3 projection → Canvas rendering
```

**Canvas Layers:**
1. Black globe background
2. Gray outline
3. Graticule (grid lines)
4. Land outlines
5. Halftone dots for land
6. Blinking node markers with triple-ring glow

**Health Color Mapping:**
- Healthy: #14F1C6 at opacity 1.0
- Degraded: #14F1C6 at opacity 0.5
- Offline: #14F1C6 at opacity 0.2

### 9. `components/PNodesTable.tsx` - Data Grid

**Purpose:** Client-side filterable and sortable table.

**Features:**
- **Search**: Filters by address or pubkey
- **Version Filter**: Dropdown with all detected versions
- **Status Filter**: Healthy/Degraded/Offline
- **Sorting**: By address, version, or lastSeen (asc/desc)
- **Actions**: "View Details →" links to `/pnode/[address]`

**Performance:**
- Uses `useMemo` for filtered/sorted results
- Recalculates only when dependencies change

### 10. `components/AutoRefresh.tsx` - Auto-Update Component

**Purpose:** Client-side page refresh on an interval.

```typescript
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function AutoRefresh({ interval }: { interval: number }) {
  const router = useRouter();
  useEffect(() => {
    const timer = setInterval(() => router.refresh(), interval);
    return () => clearInterval(timer);
  }, [interval, router]);
  return null;
}
```

Used on main page with 60-second interval.

### 11. `tailwind.config.js` - Theme Configuration

**Custom Colors:**
```javascript
colors: {
  "neo-teal": "#14F1C6",        // Primary accent
  "neo-teal-dim": "#14F1C680",   // 50% opacity
  "neo-teal-dark": "#0A9B7F",    // Darker variant
  "space-dark": "#0A0E27",       // Background
  "space-card": "#0D1B2A",       // Card backgrounds
  "space-border": "#1E2A3E",     // Borders
}
```

**Custom Animations:**
```javascript
animation: {
  "spin-slow": "spin 20s linear infinite",
  "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
  glow: "glow 2s ease-in-out infinite alternate"
}
```

### 12. `app/globals.css` - Global Styles

**CSS Variables:**
```css
:root {
  --background: 210 100% 6%;
  --foreground: 210 40% 98%;
  --card: 222 47% 11%;
  --primary: 172 89% 51%;
  --neo-teal: #14f1c6;
}
```

**Body Gradient:**
```css
body {
  background: linear-gradient(135deg, #0a0e27 0%, #0d1b2a 50%, #0a0e27 100%);
  background-attachment: fixed;
}
```

---

## Dependencies Explained

### Core Framework
- **next**: 16.0.7 - React framework with App Router
- **react**: 19.2.0 - UI library
- **react-dom**: 19.2.0 - React rendering

### Visualization Libraries
- **d3**: 7.9.0 - Data-driven globe rendering, projections
- **@react-three/fiber**: 9.4.2 - React wrapper for Three.js
- **@react-three/drei**: 10.7.7 - Three.js helpers
- **three**: 0.182.0 - 3D graphics engine
- **react-globe.gl**: 2.37.0 - Alternative globe component
- **leaflet**: 1.9.4 - Map library
- **react-leaflet**: 5.0.0 - React wrapper for Leaflet
- **svg-dotted-map**: 2.0.1 - SVG map visualizations

### Utilities
- **clsx**: 2.1.1 - Conditional className utility
- **tailwind-merge**: 3.4.0 - Merge TailwindCSS classes
- **date-fns**: 4.1.0 - Date formatting
- **undici**: 7.16.0 - HTTP client (fetch polyfill)

### Styling
- **tailwindcss**: 3 - Utility-first CSS framework
- **@tailwindcss/postcss**: 4 - TailwindCSS v4 PostCSS plugin
- **autoprefixer**: 10.4.23 - CSS vendor prefixes

### TypeScript & Tooling
- **typescript**: 5 - Type checking
- **@types/d3**: 7.4.3 - D3 type definitions
- **@types/leaflet**: 1.9.21 - Leaflet type definitions
- **eslint**: 9 - Code linting
- **eslint-config-next**: 16.0.7 - Next.js ESLint rules

---

## Step-by-Step Recreation Instructions for AI

### Phase 1: Project Initialization

**1. Create Next.js project with TypeScript:**
```bash
npx create-next-app@16.0.7 xandeum-analytics --typescript --tailwind --app --no-src-dir --import-alias "@/*"
cd xandeum-analytics
```

**2. Install all dependencies:**
```bash
npm install @react-three/drei@^10.7.7 @react-three/fiber@^9.4.2 clsx@^2.1.1 d3@^7.9.0 date-fns@^4.1.0 dynamic@^4.2.2 leaflet@^1.9.4 next@16.0.7 react@19.2.0 react-dom@19.2.0 react-globe.gl@^2.37.0 react-leaflet@^5.0.0 react-three-fiber@^6.0.13 svg-dotted-map@^2.0.1 tailwind@^4.0.0 tailwind-merge@^3.4.0 three@^0.182.0 undici@^7.16.0

npm install -D @tailwindcss/postcss@^4 @types/d3@^7.4.3 @types/leaflet@^1.9.21 @types/node@^20 @types/react@^19 @types/react-dom@^19 autoprefixer@^10.4.23 eslint@^9 eslint-config-next@16.0.7 postcss@^8.5.6 tailwindcss@3 typescript@^5
```

### Phase 2: Configuration Files

**3. Create/update `tailwind.config.js`:**
Copy the exact configuration from the project, including:
- Custom color system (neo-teal, space-dark, etc.)
- Custom animations (spin-slow, pulse-slow, glow)
- Keyframes for glow effect

**4. Create `app/globals.css`:**
- Add Tailwind directives
- Define CSS custom properties in `:root`
- Add body gradient background

**5. Create `tsconfig.json`:**
- Enable strict mode
- Set module resolution to "bundler"
- Configure path aliases (`@/*`)

### Phase 3: Type Definitions

**6. Create `types/pnode.ts`:**
Define three interfaces:
- `PNodeInfo`: address, last_seen_timestamp, pubkey, version
- `PNodeStats`: 11 metrics (cpu_percent, ram_used, uptime, etc.)
- `PNodeListResponse`: pods array + total_count

### Phase 4: Core Libraries

**7. Create `lib/pnode-client.ts`:**
Implement `PNodeClient` class with:
- `SEED_PNODES` array (9 hardcoded IPs)
- `callRpc<T>()` method using Node.js `http` module
- `getAllPNodes()` with parallel querying and deduplication
- `getPNodeStats()` and `getPNodeVersion()` methods
- Export singleton instance: `export const pnodeClient = new PNodeClient()`

**8. Create `lib/network-analytics.ts`:**
Implement:
- `getNodeHealth()` function with 3-tier classification
- `analyzeNetwork()` function with health score algorithm
- `formatBytes()` and `formatUptime()` utilities
- Export `NetworkAnalytics` interface

**9. Create `lib/utils.ts`:**
Add any utility functions (e.g., `cn()` for className merging)

### Phase 5: API Routes

**10. Create `app/api/pnodes/route.ts`:**
```typescript
export async function GET() {
  const pnodes = await pnodeClient.getAllPNodes();
  return NextResponse.json({ success: true, data: pnodes, total: pnodes.length });
}
export const revalidate = 30;
```

**11. Create `app/api/network/overview/route.ts`:**
```typescript
export async function GET() {
  const pnodes = await pnodeClient.getAllPNodes();
  const analytics = analyzeNetwork(pnodes);
  return NextResponse.json({
    success: true,
    data: { ...analytics, lastUpdated: new Date().toISOString() }
  });
}
export const revalidate = 30;
```

**12. Create `app/api/network/health/route.ts`:**
Similar to overview but returns only health-specific fields.

**13. Create `app/api/pnodes/[address]/route.ts`:**
Dynamic route to fetch single node stats using `getPNodeStats()`.

### Phase 6: UI Components

**14. Create `components/AutoRefresh.tsx`:**
Client component that calls `router.refresh()` on an interval.

**15. Create `components/Globe3D.tsx`:**
Complex D3.js component with:
- Geolocation fetching (batched, rate-limited)
- Orthographic projection with auto-rotation
- Canvas rendering with halftone dots
- Mouse drag interaction
- Blinking marker animations
- Uses `useRef` for canvas, `useEffect` for D3 setup

**16. Create `components/PNodesTable.tsx`:**
Client component with:
- `useState` for search, filters, sort state
- `useMemo` for filtered/sorted data
- Search input, version dropdown, status dropdown
- Sortable table headers with click handlers
- Link to `/pnode/[address]` for details

**17. Create `components/MapComponent.tsx` (optional):**
If using Leaflet, create React-Leaflet map component.

**18. Create `components/NetworkDistributionMap.tsx` (optional):**
If using SVG dotted map visualization.

### Phase 7: Pages

**19. Create `app/layout.tsx`:**
```typescript
export const metadata = {
  title: "Xandeum pNode Analytics",
  description: "Real-time monitoring of the Xandeum storage network"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

**20. Create `app/page.tsx`:**
Server component that:
- Fetches data from `/api/network/overview` and `/api/pnodes`
- Renders 9 sections (header, health widget, globe, cards, etc.)
- Uses `<AutoRefresh interval={60000} />`
- Uses `<Globe3D pnodes={pnodes} />`
- Uses `<PNodesTable initialPnodes={pnodes} />`
- Includes `StatCard` sub-component

**21. Create `app/map/page.tsx`:**
Full-screen map view (implementation depends on chosen library).

**22. Create `app/pnode/[address]/page.tsx`:**
Dynamic route for individual node details.

### Phase 8: Styling & Assets

**23. Add custom fonts (optional):**
Use `next/font` to load Google Fonts if desired.

**24. Create public assets:**
Add any SVG icons or images to `public/` directory.

### Phase 9: Testing & Debugging

**25. Test API endpoints:**
```bash
npm run dev
curl http://localhost:3000/api/pnodes
curl http://localhost:3000/api/network/overview
```

**26. Test UI:**
- Verify globe renders and rotates
- Test table filters and sorting
- Check health color coding
- Verify auto-refresh works

**27. Test error handling:**
- Kill pNode network to see offline states
- Test with no data

### Phase 10: Optimization

**28. Add loading states:**
Wrap server components with `<Suspense>` boundaries.

**29. Optimize geolocation:**
Consider caching IP → lat/lng results in localStorage.

**30. Add error boundaries:**
Wrap Globe3D with error boundary for geolocation failures.

---

## Critical Implementation Details

### JSON-RPC Protocol
The pNode network uses JSON-RPC 2.0 over HTTP:
- **Port**: 6000 (hardcoded in client)
- **Path**: `/rpc`
- **Methods**: "get-pods", "get-stats", "get-version"
- **Timeout**: 10 seconds per request

### Deduplication Strategy
When merging pNode lists from multiple seeds:
```typescript
const uniquePNodes = new Map<string, PNodeInfo>();
allPNodes.forEach(pnode => {
  const existing = uniquePNodes.get(pnode.address);
  if (!existing || pnode.last_seen_timestamp > existing.last_seen_timestamp) {
    uniquePNodes.set(pnode.address, pnode);
  }
});
```
This ensures the most recent data is kept.

### Health Classification Thresholds
```typescript
const delta = currentTime - lastSeenTimestamp;
if (delta < 300) return "healthy";      // 5 minutes
if (delta < 3600) return "degraded";    // 1 hour
return "offline";
```

### Globe Geolocation
Uses ip-api.com with:
- **Endpoint**: `http://ip-api.com/json/{ip}?fields=status,lat,lon,city,country`
- **Rate Limit**: 45 requests/minute (free tier)
- **Batching**: 10 nodes per batch with 1.5s delay
- **Limit**: Top 40 most recent nodes

### Canvas Rendering Loop
The globe uses D3.timer for animation:
```typescript
const rotate = () => {
  if (autoRotate) {
    rotation[0] += rotationSpeed;  // 0.3 degrees per frame
    projection.rotate(rotation);
    render();  // Redraw canvas
  }
};
const rotationTimer = d3.timer(rotate);
```

### Version Comparison
Custom semver parsing:
```typescript
function parseVersion(version: string): number[] {
  if (!version || version === "unknown") return [0, 0, 0];
  const parts = version.split(".").map(Number);
  return [parts[0] || 0, parts[1] || 0, parts[2] || 0];
}
```

### Cache Strategy
All API routes use Next.js revalidation:
```typescript
export const revalidate = 30;  // Cache for 30 seconds
```

Main page uses `cache: 'no-store'` to always fetch fresh data.

---

## Design Patterns Used

1. **Singleton Pattern**: `pnodeClient` is exported as singleton
2. **Observer Pattern**: Auto-refresh component triggers updates
3. **Facade Pattern**: `network-analytics.ts` abstracts complex calculations
4. **Map-Reduce Pattern**: Parallel seed queries → merge → deduplicate
5. **Server-Client Separation**: Data fetching on server, interactivity on client
6. **Graceful Degradation**: Show offline states, handle missing data

---

## Common Gotchas & Edge Cases

1. **Mixed SSR/CSR**: Must mark interactive components with `"use client"`
2. **Canvas DPI**: Must account for `devicePixelRatio` for crispy rendering
3. **D3 Memory Leaks**: Must call `timer.stop()` in cleanup
4. **Type Safety**: D3 GeoJSON types require careful casting
5. **Rate Limiting**: ip-api.com limits must be respected
6. **Port Conflicts**: pNode RPC port 6000 must be accessible
7. **Timeout Handling**: Network calls must have timeouts to avoid hanging

---

## Performance Characteristics

- **Initial Load**: ~2-3 seconds (seed queries in parallel)
- **Globe First Paint**: Progressive (renders as geolocations arrive)
- **Table Filtering**: Instant (client-side, memoized)
- **Auto-refresh**: Every 60 seconds
- **API Cache**: 30 seconds
- **Concurrent Connections**: 9 seed nodes in parallel

---

## Security Considerations

1. **No Authentication**: This is a read-only public dashboard
2. **HTTP Only**: Uses `http://` for local pNode RPC (not HTTPS)
3. **Client-side Secrets**: None required
4. **XSS Protection**: Next.js auto-escapes JSX
5. **CORS**: Not needed (same-origin API routes)

---

## Future Enhancement Ideas

1. **WebSocket Support**: Real-time updates instead of polling
2. **Historical Data**: Time-series graphing with database
3. **Alerts**: Notifications when nodes go offline
4. **Node Comparison**: Side-by-side performance metrics
5. **Export Features**: CSV/JSON export of pNode lists
6. **Dark/Light Mode**: Theme toggle
7. **Mobile Optimization**: Responsive globe rendering
8. **Accessibility**: ARIA labels, keyboard navigation

---

## Troubleshooting Guide

### Globe Not Rendering
- Check browser console for D3 errors
- Verify geolocation API is accessible
- Check `geolocatedNodes` state in React DevTools

### No Nodes Appearing
- Verify seed nodes are reachable on port 6000
- Check API response in Network tab
- Confirm JSON-RPC format matches expected structure

### High CPU Usage
- Reduce globe rotation speed
- Decrease halftone dot density
- Limit geolocation to fewer nodes

### Stale Data
- Check Next.js cache settings
- Verify `revalidate` is set correctly
- Use `cache: 'no-store'` for debugging

---

## Key Metrics to Monitor

1. **Network Health Score**: Should stay >80 for healthy network
2. **Version Distribution**: >80% on same version = centralization risk
3. **Geographic Distribution**: More countries = more resilience
4. **Uptime Trends**: Track degraded % over time
5. **Storage Utilization**: Alert if >90%

---

## Conclusion

This application is a **production-ready network monitoring dashboard** with:
- **Robust data collection** via parallel JSON-RPC queries
- **Sophisticated analytics** with health scoring and risk detection
- **Beautiful UI** using modern web technologies (D3, Three.js, TailwindCSS)
- **Real-time updates** with server-side rendering and client-side refresh
- **Scalable architecture** that can handle hundreds of nodes

The codebase is **well-structured**, **type-safe**, and **maintainable**. An AI recreating this should follow the phases in order, paying special attention to the JSON-RPC client implementation, health classification logic, and D3.js globe rendering.

**Total Lines of Code**: ~2500  
**Complexity Level**: Medium-High  
**Estimated Recreation Time**: 8-12 hours for experienced developer

---

## Quick Reference: Essential Constants

```typescript
// Health thresholds (seconds)
HEALTHY_THRESHOLD = 300     // 5 minutes
DEGRADED_THRESHOLD = 3600   // 1 hour

// Colors
PRIMARY_COLOR = "#14F1C6"   // Neo-teal
BACKGROUND = "#0A0E27"      // Space dark

// API cache
REVALIDATE_TIME = 30        // seconds

// Globe
GLOBE_NODES_LIMIT = 40
GEOLOCATION_BATCH_SIZE = 10
GEOLOCATION_DELAY = 1500    // ms

// Auto-refresh
REFRESH_INTERVAL = 60000    // ms (1 minute)

// pNode RPC
PNODE_PORT = 6000
RPC_TIMEOUT = 10000         // ms
```

This documentation provides everything needed to recreate the project from scratch with full understanding of design decisions and implementation details.
