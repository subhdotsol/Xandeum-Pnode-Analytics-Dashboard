<div align="center">

# 🌐 Xandeum pNode Analytics

### Real-time monitoring dashboard for the Xandeum distributed storage network

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-explorerxandeum.vercel.app-blue?style=for-the-badge)](https://explorerxandeum.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)

</div>

---

## 🎬 Demo

https://github.com/user-attachments/assets/YOUR_VIDEO_ID_HERE

> *Click to watch the full demo video showcasing all dashboard features*

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 📊 Dashboard
- Real-time monitoring of **250+ pNodes**
- Network health scoring (0-100)
- 4 key metrics: Nodes, Status, Versions, Locations
- Resource tracking: Storage, RAM, CPU, Uptime

</td>
<td width="50%">

### 🗺️ Interactive Map
- Global node distribution visualization
- Progressive geo-location loading
- Click markers for node details
- Real-time city/country info

</td>
</tr>
<tr>
<td width="50%">

### 🏆 Leaderboard
- Node rankings by performance
- 4 categories: Overall, Uptime, CPU, Storage
- Top 3 podium with medals
- Detailed node statistics

</td>
<td width="50%">

### 📈 Historical Analytics
- Time range filters (1H → 30D)
- 5 interactive charts
- 5-minute snapshot collection
- 7-day data retention

</td>
</tr>
</table>

### Additional Features

| Feature | Description |
|---------|-------------|
| 🌓 **Dark/Light Mode** | Animated circular theme transition |
| 📋 **Node Registry** | Paginated table with sorting & filtering |
| 🔄 **Real-time Stats** | Live CPU, RAM, Storage, Uptime data |
| 📱 **Responsive** | Optimized for mobile, tablet, and desktop |

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript 5.0 |
| **Styling** | TailwindCSS 4.0 |
| **UI Components** | shadcn/ui |
| **Charts** | Recharts |
| **Maps** | Leaflet + react-leaflet |
| **Database** | Supabase (PostgreSQL) |
| **Deployment** | Vercel |
| **Automation** | GitHub Actions + cron-job.org |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/subhdotsol/Xandeum-Pnode-Analytics-Dashboard.git
cd Xandeum-Pnode-Analytics-Dashboard

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables (Optional)

For historical analytics, create `.env.local`:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
CRON_SECRET=your_cron_secret
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/pnodes` | List all pNodes in the network |
| `GET` | `/api/pnodes/[address]` | Get individual node stats |
| `GET` | `/api/analytics` | Network health analytics |
| `GET` | `/api/stats` | Aggregate stats from seed nodes |
| `GET` | `/api/geo?ip=` | Geo-location lookup |
| `GET` | `/api/historical` | Historical analytics data |
| `POST` | `/api/historical/save` | Save snapshot (protected) |
| `GET` | `/api/cron/collect-snapshot` | Trigger collection (protected) |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Next.js)                         │
├─────────────────────────────────────────────────────────────────┤
│  Dashboard  │  Leaderboard  │  Map  │  Analytics  │  Registry   │
└──────┬──────┴───────┬───────┴───┬───┴──────┬──────┴──────┬──────┘
       │              │           │          │             │
       ▼              ▼           ▼          ▼             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API LAYER                               │
├─────────────────────────────────────────────────────────────────┤
│  /api/pnodes  │  /api/stats  │  /api/geo  │  /api/historical    │
└──────┬────────┴───────┬──────┴──────┬─────┴──────────┬──────────┘
       │                │             │                │
       ▼                ▼             ▼                ▼
┌──────────────┐ ┌────────────┐ ┌──────────┐ ┌─────────────────────┐
│  Seed pNodes │ │  8 Seed    │ │ ip-api   │ │     Supabase        │
│  (JSON-RPC)  │ │  Nodes     │ │ .com     │ │   (PostgreSQL)      │
│              │ │            │ │          │ │                     │
│   get-pods   │ │ get-stats  │ │ geo data │ │ historical_snapshots│
└──────────────┘ └────────────┘ └──────────┘ └─────────────────────┘
                                                      ▲
                                                      │
                                            ┌─────────┴─────────┐
                                            │  Cron Job (5min)  │
                                            │  cron-job.org     │
                                            └───────────────────┘
```

### Data Flow

1. **Node Discovery**: Query 9 seed pNodes via JSON-RPC (`get-pods`)
2. **Deduplication**: Merge results, keep latest timestamps
3. **Stats Aggregation**: Parallel fetch from 8 reliable seed nodes
4. **Geo-location**: Batch lookup via ip-api.com with caching
5. **Historical Data**: Cron job saves snapshots every 5 minutes to Supabase

---

## 📁 Project Structure

```
├── app/
│   ├── api/                    # API routes
│   │   ├── pnodes/            # Node list & individual stats
│   │   ├── analytics/         # Network analytics
│   │   ├── stats/             # Aggregate stats
│   │   ├── geo/               # Geo-location
│   │   ├── historical/        # Historical data
│   │   └── cron/              # Snapshot collection
│   ├── globals.css            # TailwindCSS styles
│   └── page.tsx               # Main entry point
├── components/
│   ├── dashboard/             # Dashboard components
│   │   ├── main-dashboard.tsx
│   │   ├── leaderboard.tsx
│   │   ├── historical-charts.tsx
│   │   ├── nodes-table.tsx
│   │   └── ...
│   ├── MapComponent.tsx       # Leaflet map
│   └── ui/                    # shadcn/ui components
├── lib/
│   ├── pnode-client.ts        # JSON-RPC client
│   ├── network-analytics.ts   # Health scoring
│   ├── supabase.ts           # Database client
│   └── utils.ts              # Utilities
└── types/
    └── pnode.ts              # TypeScript types
```

---

## 📊 Health Scoring

```typescript
// Node Classification
if (lastSeen < 5 minutes)  → 🟢 Healthy
if (lastSeen < 1 hour)     → 🟡 Degraded  
if (lastSeen > 1 hour)     → 🔴 Offline

// Network Score Formula
score = (healthyNodes% × 60) + (upToDateVersions% × 30) + (degradedNodes% × 10)
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with ❤️ for the Xandeum community**

[⬆ Back to Top](#-xandeum-pnode-analytics)

</div>
