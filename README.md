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

https://github.com/user-attachments/assets/d32fabd4-1faf-4fb1-8ee0-cfcc3d2b820e

## LIVE : [Xandeum-explorer](https://explorerxandeum.vercel.app/)
---

## ✨ Features

<table>
<tr>
<td width="50%">

### 📊 Dashboard
- Real-time monitoring of **250+ pNodes**
- **Pod Credits** scoring system (uptime + RPC + version)
- Smooth **sliding tab animation** with hover effects
- **Instant navigation** with smart caching
- Resource tracking: Storage, RAM, CPU, Uptime

</td>
<td width="50%">

### 🤖 AI Assistant (XandAI)
- **Natural language queries** about network stats
- Answers questions about top nodes and rankings
- Explains pod credits scoring system
- **Security-hardened** against malicious queries
- Access to live network data

</td>
</tr>
<tr>
<td width="50%">

### 🏆 Leaderboard  
- **Pod Credits** ranking (max 100 points)
  - Uptime: 40 pts
  - RPC Availability: 30 pts
  - Version Compliance: 30 pts
- Search & filter capabilities
- Sortable columns

</td>
<td width="50%">

### 📈 Historical Analytics
- Time range filters (1H → 90D)
- 5 interactive charts
- 5-minute snapshot collection
- 7-day data retention
- Network trend visualization

</td>
</tr>
</table>

### Modern Features

| Feature | Description |
|---------|-------------|
| ⌨️ **Keyboard Shortcuts** | ⌘K (sidebar), ⌘J (AI chat), ⌘D (theme) |
| 🌓 **Theme Toggle** | Animated circular theme transition with smooth animations |
| 🎨 **Sliding Tabs** | Beautiful cursor animation following hover |
| 🔄 **Smart Caching** | Zero-delay navigation between pages |
| 📱 **Responsive** | Optimized for mobile, tablet, and desktop |
| 🗺️ **Interactive Map** | Global node distribution with click details |
| 💱 **DeFi Integration** | Jupiter Swap + LAZ Staking |

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript 5.0 |
| **Styling** | TailwindCSS 4.0 |
| **UI Components** | shadcn/ui + Custom |
| **Animations** | Framer Motion |
| **Charts** | Recharts |
| **Maps** | Leaflet + react-leaflet |
| **AI** | Google Gemini 2.5 Flash |
| **Database** | Supabase (PostgreSQL) |
| **Deployment** | Vercel |
| **Automation** | GitHub Actions + cron-job.org |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Gemini API key (for AI assistant)

### Installation

```bash
# Clone the repository
git clone https://github.com/subhdotsol/Xandeum-Pnode-Analytics-Dashboard.git
cd Xandeum-Pnode-Analytics-Dashboard

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Add your GEMINI_API_KEY for AI features

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

Create `.env.local`:

```env
# Required for AI assistant
GEMINI_API_KEY=your_gemini_api_key

# Optional for historical analytics
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
CRON_SECRET=your_cron_secret

# App URL (default: http://localhost:3000)
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action | Description |
|----------|--------|-------------|
| `⌘K` / `Ctrl+K` | Toggle Sidebar | Show/hide navigation sidebar |
| `⌘J` / `Ctrl+J` | AI Assistant | Open XandAI chat (auto-focuses input) |
| `⌘D` / `Ctrl+D` | Toggle Theme | Switch between dark/light mode |

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/pnodes` | List all pNodes in the network |
| `GET` | `/api/pnodes/[address]` | Get individual node stats |
| `GET` | `/api/analytics` | Network health analytics |
| `GET` | `/api/stats` | Aggregate stats from seed nodes |
| `GET` | `/api/geo?ip=` | Geo-location lookup |
| `POST` | `/api/chat` | AI assistant queries |
| `GET` | `/api/historical` | Historical analytics data |
| `POST` | `/api/historical/save` | Save snapshot (protected) |
| `GET` | `/api/cron/collect-snapshot` | Trigger collection (protected) |

---

## 🏆 Pod Credits Scoring

The Pod Credits system ranks nodes based on three key factors:

### Scoring Breakdown (100 points max)

#### 1. Uptime Score (40 points)
- **40 pts**: Last seen within 5 minutes
- **30 pts**: Last seen within 15 minutes
- **20 pts**: Last seen within 1 hour
- **10 pts**: Last seen within 6 hours
- **0 pts**: Last seen more than 6 hours ago

#### 2. RPC Availability (30 points)
- **30 pts**: Has public RPC endpoint available
- **0 pts**: No public RPC endpoint

#### 3. Version Compliance (30 points)
- **30 pts**: Running latest pNode software version
- **0 pts**: Running outdated version

### Example
```
Node: 12abc...xyz
- Uptime: 40 pts (last seen 2 minutes ago)
- RPC: 30 pts (has public RPC)
- Version: 30 pts (running v1.2.3)
= Total: 100 pts (Top Rank!)
```

---

## 🤖 AI Assistant (XandAI)

The AI assistant has full access to dashboard data and can answer:

### What You Can Ask

✅ **Network Statistics**
- "How many nodes are currently active?"
- "What's the network health percentage?"
- "How many nodes have RPC enabled?"

✅ **Node Rankings**
- "Who are the top 10 nodes?"
- "What's the best performing node?"
- "Show me the leaderboard"

✅ **Pod Credits**
- "How is pod credits calculated?"
- "How can I improve my ranking?"
- "What's the highest score?"

✅ **Version Info**
- "What's the latest pNode version?"
- "How many nodes are on latest version?"
- "Show me version distribution"

✅ **Dashboard Help**
- "What features does the dashboard have?"
- "What are the keyboard shortcuts?"
- "How do I stake XAND?"

### Security

The AI is protected against:
- API key/secret requests
- Database/SQL queries
- Admin/exploit attempts
- Malicious queries

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
│  /api/pnodes  │  /api/stats  │  /api/geo  │  /api/chat         │
└──────┬────────┴───────┬──────┴──────┬─────┴──────────┬──────────┘
       │                │             │                │
       ▼                ▼             ▼                ▼
┌──────────────┐ ┌────────────┐ ┌──────────┐ ┌─────────────────────┐
│  Seed pNodes │ │  8 Seed    │ │ ip-api   │ │   Google Gemini     │
│  (JSON-RPC)  │ │  Nodes     │ │ .com     │ │   2.5 Flash         │
│              │ │            │ │          │ │                     │
│   get-pods   │ │ get-stats  │ │ geo data │ │  AI Assistant       │
└──────────────┘ └────────────┘ └──────────┘ └─────────────────────┘
```

---

## 📁 Project Structure

```
├── app/
│   ├── api/                    # API routes
│   │   ├── pnodes/            # Node list & individual stats
│   │   ├── analytics/         # Network analytics
│   │   ├── stats/             # Aggregate stats
│   │   ├── geo/               # Geo-location
│   │   ├── chat/              # AI assistant
│   │   ├── historical/        # Historical data
│   │   └── cron/              # Snapshot collection
│   ├── docs/                  # Documentation pages
│   │   ├── page.tsx           # Docs home
│   │   ├── leaderboard/       # Pod credits docs
│   │   └── layout.tsx         # Docs navigation
│   ├── globals.css            # TailwindCSS styles
│   └── page.tsx               # Main dashboard
├── components/
│   ├── dashboard/             # Dashboard components
│   │   ├── main-dashboard.tsx
│   │   ├── leaderboard.tsx
│   │   ├── historical-charts.tsx
│   │   └── ...
│   ├── sidebar/               # Navigation components
│   │   └── app-sidebar.tsx    # Main sidebar
│   ├── ai-assistant.tsx       # AI chat component
│   └── ui/                    # shadcn/ui components
├── lib/
│   ├── pnode-client.ts        # JSON-RPC client
│   ├── network-analytics.ts   # Health scoring
│   └── utils.ts               # Utilities
└── types/
    └── pnode.ts               # TypeScript types
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

## 🔗 Links

- **Live Demo**: [explorerxandeum.vercel.app](https://explorerxandeum.vercel.app)
- **Documentation**: [/docs](https://explorerxandeum.vercel.app/docs)
- **Xandeum Website**: [xandeum.com](https://xandeum.com)
- **XAND Token**: [Solscan](https://solscan.io/token/XANDuUoVoUqniKkpcKhrxmvYJybpJvUxJLr21Gaj3Hx)
- **GitHub**: [Repository](https://github.com/subhdotsol/Xandeum-Pnode-Analytics-Dashboard)

---

<div align="center">

**Built with ❤️ for the Xandeum community**

</div>
