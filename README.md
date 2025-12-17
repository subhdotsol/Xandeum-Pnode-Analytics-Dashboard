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

- **pNodes (Persistent Nodes)**: Individual nodes in the Xandeum network that store and serve data chunks. Each pNode maintains a portion of the distributed storage system.

- **Decentralized Discovery**: The network uses a peer-to-peer discovery mechanism where each pNode maintains knowledge of other active pNodes in the network.

- **Health Monitoring**: pNodes report their status through timestamps, version information, and availability metrics, allowing the network to self-organize and maintain reliability.

- **No Central Authority**: Unlike traditional storage systems, Xandeum operates without central coordinators. Nodes discover each other through seed nodes and maintain a distributed registry.

### How pNodes Work:

1. **Registration**: When a pNode comes online, it registers itself with seed nodes
2. **Discovery**: Nodes query seed pNodes to discover the full network topology
3. **Data Storage**: Files are chunked and distributed across multiple pNodes for redundancy
4. **Health Reporting**: Each pNode periodically updates its `last_seen_timestamp` to indicate it's active
5. **Version Management**: Nodes report their software version for compatibility checking

---

## ✨ Features

### 🎯 Core Analytics

- **Real-time Network Health Monitoring** - Live tracking of 215+ pNodes with health scoring (0-100)
- **Network Health Score** - Comprehensive scoring based on:
  - Healthy nodes percentage (60% weight)
  - Up-to-date software versions (30% weight)
  - Network stability (10% weight)
- **Node Classification** - Automatic categorization into:
  - 🟢 **Healthy**: Last seen < 5 minutes
  - 🟡 **Degraded**: Last seen < 1 hour
  - 🔴 **Offline**: Last seen > 1 hour

### 📊 Visualizations

- **3-Column Health Metrics Grid** - Visual breakdown of healthy, degraded, and offline nodes
- **Animated Progress Bar** - Real-time distribution visualization
- **Version Distribution Pie Chart** - Software version adoption across the network
- **Trend Indicators** - Network growth and stability metrics
- **Interactive Nodes Table** - Search, filter, and sort functionality

### 🎨 Design Features

- **Notion-Inspired Light Mode** - Clean, professional aesthetic with gradient text
- **Dark Mode with Glassmorphism** - Premium glass effects with 24px blur
- **Smooth Scroll Navigation** - Navbar links smoothly scroll to sections
- **Ubuntu Typography** - Modern, professional font system
- **Responsive Design** - Mobile, tablet, and desktop optimized
- **Click Effects** - Satisfying button interactions with scale animations

### 🔧 Technical Features

- **Parallel Data Fetching** - Queries 9 seed pNodes simultaneously
- **Automatic Deduplication** - Merges results and keeps most recent data
- **Error Handling** - Graceful degradation when seed nodes are unavailable
- **Auto-refresh** - 60-second intervals for live data updates
- **Type Safety** - Full TypeScript implementation with strict types

---

## 🏗️ Architecture

### Data Flow

```
Seed pNodes → JSON-RPC "get-pods" → Parallel Fetch → Deduplication → Analytics → UI
```

### Health Scoring Algorithm

```typescript
score = (healthy_nodes_pct × 60) + (up_to_date_versions_pct × 30) + (degraded_nodes_pct × 10)
```

### Node Classification Logic

```typescript
const delta = now - last_seen_timestamp;

if (delta < 300) return "healthy";        // < 5 minutes
else if (delta < 3600) return "degraded"; // < 1 hour
else return "offline";                     // > 1 hour
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
# or
npm install

# Run development server
pnpm dev
# or
npm run dev
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
│   ├── api/               # API routes for pNode data
│   │   ├── pnodes/        # Get all pNodes
│   │   └── network/       # Network analytics
│   ├── globals.css        # Global styles with glassmorphism
│   ├── layout.tsx         # Root layout with Ubuntu font
│   └── page.tsx           # Main dashboard page
├── components/
│   ├── dashboard/         # Dashboard-specific components
│   │   ├── network-health-card.tsx
│   │   ├── nodes-table.tsx
│   │   ├── version-distribution.tsx
│   │   └── auto-refresh.tsx
│   ├── sections/          # Page sections
│   │   ├── navbar.tsx
│   │   └── footer.tsx
│   └── ui/                # Reusable UI components
│       ├── card.tsx
│       ├── badge.tsx
│       ├── button-custom.tsx
│       ├── feature-card.tsx
│       ├── tag.tsx
│       └── theme-toggle.tsx
├── lib/
│   ├── pnode-client.ts    # JSON-RPC client for pNodes
│   ├── network-analytics.ts # Health scoring engine
│   └── utils.ts           # Utility functions
└── types/
    └── pnode.ts           # TypeScript type definitions
```

---

## 🔌 API Endpoints

### Get All pNodes
```typescript
GET /api/pnodes
Response: PNodeInfo[]
```

### Get Network Overview
```typescript
GET /api/network/overview
Response: NetworkAnalytics
```

### Get Network Health
```typescript
GET /api/network/health
Response: NetworkHealth
```

### Get Individual pNode Stats
```typescript
GET /api/pnodes/[address]
Response: PNodeStats | null
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.1.5 (App Router)
- **Language**: TypeScript 5.0
- **Styling**: TailwindCSS 4.0
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Font**: Ubuntu (300, 400, 500, 700)

### Backend
- **Runtime**: Node.js (Next.js API Routes)
- **RPC Client**: Native Node.js HTTP module
- **Data Processing**: Custom analytics engine

### Design System
- **Light Mode**: Notion-inspired clean design
- **Dark Mode**: Glassmorphism with purple/peach/blue palette
- **Responsive**: Mobile-first approach
- **Accessibility**: ARIA labels and semantic HTML

---

## 📊 Technical Report

### Network Discovery Implementation

The dashboard implements a **parallel discovery pattern** to maximize data freshness and reliability:

1. **Seed Node Selection**: 9 geographically distributed seed pNodes
2. **Parallel Queries**: All seeds queried simultaneously using `Promise.all()`
3. **Timeout Handling**: 10-second timeout per request
4. **Result Merging**: Deduplication based on node address
5. **Timestamp Priority**: Most recent `last_seen_timestamp` wins

### Performance Optimizations

- **Parallel Fetching**: Reduces total query time to ~10 seconds (limited by slowest seed)
- **Static Generation**: Dashboard pre-rendered at build time
- **Auto-refresh**: Client-side updates every 60 seconds
- **Conditional Rendering**: Only show limited nodes initially (10 visible)
- **Code Splitting**: Dynamic imports for heavy components

### Analytics Engine

The `network-analytics.ts` module provides:

- **Health Classification**: Categorizes nodes into 3 states
- **Score Calculation**: Weighted algorithm for network health
- **Version Analysis**: Identifies outdated nodes
- **Risk Detection**: Flags single-version dominance, stale nodes

### Data Reliability

- **Error Handling**: Graceful degradation when seeds fail
- **Silent Failures**: Unreachable nodes don't block the UI
- **Data Freshness**: Prioritizes most recent timestamps
- **Consistency**: Deduplication ensures single source of truth

---

## 🎨 Design Philosophy

### Light Mode (Notion-Inspired)
- Clean white backgrounds
- Soft purple/peach/blue accents
- No shadows, minimal visual noise
- Black text for maximum readability

### Dark Mode (Premium Glassmorphism)
- Deep black gradient background
- 24px blur with 200% saturation
- Vibrant gradients (purple → pink → orange)
- Strong glass effects on cards

### Interaction Design
- **Smooth Scrolling**: Navbar links scroll to sections
- **Click Effects**: Scale-down animation on button press
- **Hover States**: Subtle transforms and glow effects
- **Loading States**: Skeleton screens during data fetch

---

## 📈 Metrics & Insights

The dashboard tracks:

- **Total Nodes**: Active pNodes in the network (~215)
- **Health Score**: 0-100 rating of network reliability
- **Version Distribution**: Software version adoption rates
- **Storage Metrics**: Total capacity and utilization
- **Performance**: Average CPU and RAM usage
- **Uptime**: Average node uptime across the network

---

## 🤝 Contributing

Contributions are welcome! This project was built for a bounty and we're open to improvements.

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Feedback

Found a bug or have a suggestion? Please:
- Open an issue on GitHub
- Provide detailed information about the problem
- Include screenshots if applicable

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

## 📞 Contact

- **GitHub**: [@subhdotsol](https://github.com/subhdotsol)
- **Project Link**: [Xandeum pNode Analytics Dashboard](https://github.com/subhdotsol/Xandeum-Pnode-Analytics-Dashboard)
- **Bounty Page**: [Superteam Earn](https://earn.superteam.fun/listing/build-analytics-platform-for-xandeum-pnodes)

---

<div align="center">

**Built with ❤️ for the Xandeum community**

[⬆ Back to Top](#xandeum-pnode-analytics-dashboard)

</div>
