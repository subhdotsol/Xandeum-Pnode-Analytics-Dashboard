# Xandeum pNode Analytics Dashboard

<div align="center">

![Xandeum Analytics](https://img.shields.io/badge/Xandeum-Analytics-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15.1.5-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwind-css)

**Real-time monitoring and visualization of the Xandeum distributed storage network**

[Live Demo](#) • [Report Bug](https://github.com/subhdotsol/Xandeum-Pnode-Analytics-Dashboard/issues) • [Request Feature](https://github.com/subhdotsol/Xandeum-Pnode-Analytics-Dashboard/issues)

</div>

---

## 📋 About This Project

This project was built for the **[Superteam Bounty: Build Analytics Platform for Xandeum pNodes](https://earn.superteam.fun/listing/build-analytics-platform-for-xandeum-pnodes)**. 

We welcome all feedback and contributions! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

---

## 🌐 What are Xandeum pNodes?

**Xandeum** is a decentralized distributed storage network built on Solana that enables efficient data storage and retrieval across a network of participating nodes called **pNodes** (persistent nodes).

### Key Concepts:

- **pNodes (Persistent Nodes)**: Individual nodes in the Xandeum network that store and serve data chunks
- **Decentralized Discovery**: Peer-to-peer discovery mechanism where each pNode maintains knowledge of other active pNodes
- **Health Monitoring**: pNodes report their status through timestamps, version information, and availability metrics
- **No Central Authority**: Nodes discover each other through seed nodes and maintain a distributed registry

---

## ✨ Features

### 🎯 Dashboard Overview

- **Real-time Network Health Monitoring** - Live tracking of 250+ pNodes with health scoring (0-100)
- **Node Classification** - Automatic categorization:
  - 🟢 **Healthy**: Last seen < 5 minutes
  - 🟡 **Degraded**: Last seen < 1 hour
  - 🔴 **Offline**: Last seen > 1 hour
- **4 Key Metrics**: Total Nodes, Online Status, Version Count, Global Locations

### 📊 Analytics Cards

| Card | Metrics |
|------|---------|
| **Resources** | Total Storage, Total RAM |
| **Performance** | Average CPU, Average Uptime |
| **Throughput** | Data Processed, Pages Processed |
| **Activity Monitor** | Total Packets (with graph), Active Streams |

### 🗺️ Interactive Map

- **Progressive Loading** - 8-second spinner, then skeleton, then map
- **Batch Loading** - Loads 20 nodes at a time with progress toast
- **Geo-location** - Real-time node locations with city/country info
- **Node Popups** - Click markers to see node details

### 📊 Historical Analytics (NEW)

- **Time Range Filter** - 1H, 4H, 12H, 24H, 7D, 30D, All
- **5 Visualization Charts**:
  - **Node Population** - Total nodes over time (gradient area)
  - **Availability Rate** - Online percentage (dotted line)
  - **Resource Utilization** - CPU & RAM usage (dotted lines)
  - **Storage Capacity** - Aggregate storage (gradient area)
  - **Geographic Spread** - Countries & versions (dotted lines)
- **Supabase Backend** - Stores 7 days of 5-minute snapshots
- **Automated Collection** - GitHub Actions cron job every 5 minutes

### 🏆 Performance Leaderboard (NEW)

- **Node Rankings** by 4 categories:
  - **Overall** - Weighted score (40% uptime, 30% CPU, 30% storage)
  - **Uptime** - Longest running nodes
  - **CPU Efficiency** - Lowest CPU usage
  - **Storage** - Most storage contributed
- **Top 3 Podium** - Gold, silver, bronze cards with icons
- **Full Rankings Table** - Top 25 nodes with all stats
- **Click for Details** - Opens modal with full node info

### 📋 Node Registry

- **Pagination** - 10, 25, 50, or 100 items per page
- **Sortable Columns** - Address, Version, CPU, RAM, Last Seen
- **Filterable** - Search by address/pubkey, filter by status
- **Click-to-Copy** - Click address/pubkey for animated "Copied!" popup
- **Real-time Stats** - CPU, RAM, Storage, Uptime fetched on page load
- **10 Columns**: Status, Address, Version, CPU, RAM, Storage, Uptime, Last Seen, Public Key, Action

### 🎨 Design Features

- **Dark Mode** - Premium glassmorphism with blur effects
- **Light Mode** - Clean Notion-inspired aesthetic
- **Loading Skeletons** - Matching skeletons for all components
- **Responsive** - Mobile, tablet, and desktop optimized

---

## 🔌 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/pnodes` | Get all pNodes from the network |
| `GET /api/analytics` | Get network health analytics |
| `GET /api/stats` | Get aggregate stats from 8 seed nodes |
| `GET /api/pnodes/[address]` | Get individual node stats |
| `GET /api/geo?ip=` | Get geo-location for an IP |
| `GET /api/historical` | Get historical analytics data |
| `POST /api/historical/save` | Save a new snapshot |
| `GET /api/cron/collect-snapshot` | Trigger snapshot collection |

### Data Flow

```
Seed pNodes → JSON-RPC → Parallel Fetch → Deduplication → Analytics → UI
     ↓
/api/stats → 8 reliable seed nodes → Aggregate metrics
     ↓
/api/geo → ip-api.com → Location data
     ↓
/api/cron → Collect snapshot → Supabase → Historical charts
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/subhdotsol/Xandeum-Pnode-Analytics-Dashboard.git
cd Xandeum-Pnode-Analytics-Dashboard

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001) to view the dashboard.

### Build for Production

```bash
pnpm build
pnpm start
```

---

## 📁 Project Structure

```
pnode/
├── app/
│   ├── api/
│   │   ├── pnodes/           # Node list & individual stats
│   │   ├── analytics/        # Network analytics
│   │   ├── stats/            # Aggregate stats from seed nodes
│   │   ├── historical/       # Historical data endpoints
│   │   │   ├── route.ts      # GET historical data
│   │   │   └── save/route.ts # POST save snapshot
│   │   ├── cron/             # Cron job endpoint
│   │   │   └── collect-snapshot/route.ts
│   │   └── geo/              # Geo-location API
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx              # Main dashboard (client-side)
├── components/
│   ├── dashboard/
│   │   ├── main-dashboard.tsx      # Main layout with tabs
│   │   ├── historical-charts.tsx   # Analytics line charts
│   │   ├── leaderboard.tsx         # Performance leaderboard
│   │   ├── network-health-card.tsx # Health score display
│   │   ├── nodes-table.tsx         # Node Registry with pagination
│   │   ├── activity-graph.tsx      # Recharts area graph
│   │   ├── version-distribution.tsx # Pie chart
│   │   └── skeletons.tsx           # Loading skeletons
│   ├── MapComponent.tsx       # Leaflet map
│   └── ui/                    # shadcn/ui components
├── lib/
│   ├── supabase.ts            # Supabase client
│   ├── pnode-client.ts        # JSON-RPC client
│   ├── network-analytics.ts   # Health scoring engine
│   └── utils.ts               # Utility functions
├── .github/
│   └── workflows/
│       └── cron.yml           # GitHub Actions cron job
└── types/
    └── pnode.ts               # TypeScript definitions
```

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| **Framework** | Next.js 15.1.5 (App Router) |
| **Language** | TypeScript 5.0 |
| **Styling** | TailwindCSS 4.0 |
| **Database** | Supabase (PostgreSQL) |
| **UI Components** | shadcn/ui |
| **Charts** | Recharts |
| **Maps** | Leaflet + react-leaflet |
| **Icons** | Lucide React |
| **Automation** | GitHub Actions |

---

## 📊 Health Scoring Algorithm

```typescript
score = (healthy_nodes_pct × 60) + (up_to_date_versions_pct × 30) + (degraded_nodes_pct × 10)
```

### Node Classification

```typescript
const delta = now - last_seen_timestamp;

if (delta < 300) return "healthy";        // < 5 minutes (green)
else if (delta < 3600) return "degraded"; // < 1 hour (yellow)
else return "offline";                     // > 1 hour (red)
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
14. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the MIT License.

---

## 🙏 Acknowledgments

- **Xandeum Team** - For building the decentralized storage network
- **Superteam** - For hosting the bounty program
- **shadcn/ui** - For the excellent component library
- **Vercel** - For Next.js and deployment platform

---

<div align="center">

**Built with ❤️ for the Xandeum community**

[⬆ Back to Top](#xandeum-pnode-analytics-dashboard)

</div>
