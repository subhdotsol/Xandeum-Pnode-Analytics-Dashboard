<div align="center">

# 🌐 Xandeum pNode Analytics Dashboard

### Real-time monitoring and DeFi integration platform for the Xandeum distributed storage network

[![Live Demo](https://img.shields.io/badge/demo-live-green)](https://explorerxandeum.vercel.app/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Getting Started](#-getting-started)
- [Architecture](#️-architecture)
- [DeFi Integration](#-defi-integration)
- [API Documentation](#-api-documentation)
- [Keyboard Shortcuts](#️-keyboard-shortcuts)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)

---

## 🎯 Overview

Xandeum pNode Analytics is a comprehensive real-time monitoring dashboard and DeFi platform for the Xandeum distributed storage network. It provides live insights into 250+ pNodes, integrates liquid staking functionality, and features an AI-powered assistant for network queries.

### Key Highlights

- **Real-time Monitoring**: Track 250+ pNodes with live updates every 30 seconds
- **DeFi Integration**: Liquid staking with real-time SOL/XAND price feeds via CoinGecko
- **AI Assistant (XandAI)**: Natural language queries powered by Google Gemini 2.5 Flash
- **Historical Analytics**: 7-day data retention with 5-minute snapshots
- **Performance Optimized**: In-memory caching with 60s TTL for instant responses

---

## 🎬 Live Demo

🔗 **[View Live Dashboard](https://explorerxandeum.vercel.app/)**

https://github.com/user-attachments/assets/b968007b-0c5f-4311-91f4-433c3b5ade17

---

## ✨ Features

### 📊 Real-Time Dashboard
- **250+ pNode Monitoring**: Live status tracking with 30-second refresh intervals
- **Pod Credits System**: Comprehensive scoring based on uptime (40pts), RPC availability (30pts), and version compliance (30pts)
- **Network Health**: Real-time aggregate statistics from 8 seed nodes
- **Responsive Design**: Optimized for mobile, tablet, and desktop with smooth animations

### 💰 DeFi & Trading
- **Trading Terminal**: Full-featured trading view with Birdeye charts and real-time prices
- **Jupiter Integration**: Buy/Sell XAND via Jupiter aggregator with one click
- **Liquid Staking**: Stake SOL and receive XANDsol tokens
- **Real-Time Pricing**: Live SOL and XAND prices from CoinGecko API
- **Dynamic Exchange Rate**: Calculated from live market prices (SOL_PRICE / XAND_PRICE)
- **DEX Liquidity**: Real-time pool data from Raydium
- **Wallet Integration**: Solana wallet adapter with Phantom, Solflare, and Coinbase support

### 🤖 AI Features
- **XandAI Chat**: Natural language queries powered by Google Gemini 2.0 Flash
- **AI Network Summary**: Real-time AI-generated insights about network health
- **Telegram Bot**: Network alerts and analytics via @XandeumPNodeBot
- **Live Data Access**: Real-time information about all pNodes and network health
- **Security Hardened**: Protected against malicious queries and API key requests
- **Keyboard Shortcut**: Quick AI access via `Cmd+I` / `Ctrl+I`

### 📈 Analytics & Insights
- **Historical Charts**: Time range filters from 1H to 90D
- **5 Interactive Visualizations**: Network trends, version distribution, and more
- **Automated Snapshots**: GitHub Actions cron job every 5 minutes
- **Redis Caching**: Upstash Redis for 10ms API responses (100x faster)
- **Supabase Storage**: PostgreSQL for unlimited historical data retention

### 🗺️ Geographic Distribution
- **Interactive World Map**: Leaflet-based visualization with clustered markers
- **Batch Loading**: Progressive loading of 20 nodes at a time
- **Click Details**: Node information popups with copyable wallet addresses
- **Geo-Caching**: 7-day TTL for IP-to-location lookups to reduce API calls

### ⌨️ Modern UX
- **Keyboard Shortcuts**: 
  - `Cmd+K` / `Ctrl+K` - Toggle Sidebar
  - `Cmd+J` / `Ctrl+J` - Spotlight Search
  - `Cmd+I` / `Ctrl+I` - AI Assistant
  - `Cmd+D` / `Ctrl+D` - Toggle Theme
- **Sliding Tab Animation**: Beautiful cursor following hover effects
- **Theme Toggle**: Circular animated transition between dark/light modes
- **Smart Navigation**: Instant page switching with prefetching and caching
- **Spotlight Search**: Quick navigation to any page with `Cmd+J`

### 📚 Comprehensive Documentation
- **[Infrastructure](/docs/infrastructure)**: Redis caching, Supabase storage, GitHub Actions setup
- **[Troubleshooting](/docs/troubleshooting)**: Common issues and solutions
- **[FAQ](/docs/faq)**: Frequently asked questions with expandable answers
- **[Contributing](/docs/contributing)**: Step-by-step guide for contributors
- **[Changelog](/docs/changelog)**: Version history with timeline view
- **[Keyboard Shortcuts](/docs/shortcuts)**: Complete reference with visual key badges
- **[API Reference](/docs/api)**: All endpoints with examples
- **Auto-scroll**: Seamless navigation between doc pages

---

## 🛠️ Tech Stack

### Frontend
| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | Next.js (App Router) | 15.0 |
| **Language** | TypeScript | 5.0 |
| **Styling** | TailwindCSS | 4.0 |
| **UI Components** | shadcn/ui | Latest |
| **Animations** | Framer Motion | 11.0 |
| **Charts** | Recharts | 2.0 |
| **Maps** | Leaflet + react-leaflet | Latest |

### Backend & APIs
| Category | Technology | Purpose |
|----------|-----------|---------|
| **AI** | Google Gemini 2.5 Flash | AI assistant |
| **Database** | Supabase (PostgreSQL) | Historical data |
| **RPC** | Alchemy | Solana blockchain access |
| **Price Feed** | CoinGecko API | Real-time token prices |
| **DEX Data** | Raydium API | Liquidity pool information |
| **Geo-location** | ip-api.com | Node location lookup |

### Infrastructure
- **Deployment**: Vercel (Edge Functions)
- **Automation**: GitHub Actions + cron-job.org
- **Package Manager**: pnpm
- **Testing**: Vitest (configured)

---

## 🚀 Getting Started

### Prerequisites

```bash
- Node.js 18+ 
- pnpm (recommended) or npm
- Solana wallet (Phantom, Solflare, or Coinbase)
- API keys (see Environment Variables)
```

### Installation

```bash
# Clone the repository
git clone https://github.com/subhdotsol/Xandeum-Pnode-Analytics-Dashboard.git
cd Xandeum-Pnode-Analytics-Dashboard

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

Create `.env.local`:

```env
# Required - Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Required - Solana RPC (Alchemy)
NEXT_PUBLIC_SOLANA_RPC_URL=https://solana-mainnet.g.alchemy.com/v2/YOUR_KEY

# Optional - Historical Analytics
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_role_key

# Optional - Cron Job Protection
CRON_SECRET=your_secret_for_cron_jobs

# Public - XAND Token Address
NEXT_PUBLIC_XAND_TOKEN_ADDRESS=XANDuUoVoUqniKkpcKhrxmvYJybpJvUxJLr21Gaj3Hx
```

**Getting API Keys:**
- **Gemini API**: [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Alchemy RPC**: [Alchemy Dashboard](https://dashboard.alchemy.com/)
- **Supabase**: [Supabase Dashboard](https://supabase.com/dashboard)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENT (Next.js 15)                          │
├─────────────────────────────────────────────────────────────────┤
│ Dashboard │ Analytics │ Leaderboard │ Map │ Staking │ Docs      │
└──────┬────┴─────┬─────┴──────┬──────┴──┬──┴────┬────┴───────┬──┘
       │          │            │         │       │            │
       ▼          ▼            ▼         ▼       ▼            ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API LAYER (Route Handlers)              │
├─────────────────────────────────────────────────────────────────┤
│ /api/pnodes │ /api/staking │ /api/dex │ /api/chat │ /api/geo   │
└──────┬──────┴────────┬──────┴────┬─────┴────┬──────┴─────┬─────┘
       │               │           │          │            │
       ▼               ▼           ▼          ▼            ▼
┌────────────┐  ┌───────────┐ ┌──────────┐ ┌─────┐ ┌──────────┐
│ Xandeum    │  │ CoinGecko │ │ Raydium  │ │Gemini│ │ ip-api   │
│ Seed Nodes │  │   API     │ │   API    │ │ AI   │ │   .com   │
│ (JSON-RPC) │  │ (Prices)  │ │ (Pools)  │ │      │ │ (Geo)    │
└────────────┘  └───────────┘ └──────────┘ └─────┘ └──────────┘
       │               │           │          │            │
       ▼               ▼           ▼          ▼            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CACHING LAYER (60s TTL)                      │
│  • In-memory cache for token prices                            │
│  • In-memory cache for DEX liquidity                           │
│  • Next.js fetch cache (revalidate: 60)                        │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Client Request**: User loads staking page
2. **API Call**: Frontend calls `/api/staking/pool-stats`
3. **Cache Check**: Server checks in-memory cache (60s TTL)
4. **External API**: If cache miss, fetches from CoinGecko
5. **Cache Update**: Stores new data in cache
6. **Response**: Returns data to client (5-10ms if cached, ~500ms if fresh)
7. **Auto-Refresh**: Client polls every 30s for updates

---

## 💱 DeFi Integration

### Liquid Staking Implementation

#### Features
- **Real-Time Exchange Rate**: Calculated from live SOL and XAND market prices
- **Dynamic APY**: Based on Solana network average (~7.2%)
- **Wallet Balance**: Live SOL balance from Alchemy RPC
- **Premium UI**: Animated liquid morphing button with Framer Motion

#### Data Sources

| Data Point | Source | Refresh Rate |
|------------|--------|--------------|
| SOL Price | CoinGecko API | 60s cached |
| XAND Price | CoinGecko API | 60s cached |
| Exchange Rate | Calculated (SOL/XAND) | Real-time |
| DEX Liquidity | Raydium API | 60s cached |
| Wallet Balance | Alchemy RPC | 10s (on-demand) |

#### Exchange Rate Calculation

```typescript
// Fetch live prices
const solPrice = 100;      // $100 (from CoinGecko)
const xandPrice = 0.0025;  // $0.0025 (from CoinGecko)

// Calculate exchange rate
const exchangeRate = solPrice / xandPrice;  // 40,000 XAND per SOL

// Example: Stake 10 SOL
const received = 10 * exchangeRate;  // 400,000 XAND tokens
```

#### Performance Optimizations

**In-Memory Caching** (60-second TTL):
- First request: ~500-1000ms (external API calls)
- Cached requests: ~5-10ms (instant from memory)
- Cache invalidation: Automatic after 60 seconds
- Fallback: Returns stale data if API fails

**Example Code**:
```typescript
let priceCache: { solPrice: number; xandPrice: number; timestamp: number } | null = null;
const CACHE_TTL = 60000; // 60 seconds

async function fetchTokenPrices() {
    // Check cache first
    if (priceCache && Date.now() - priceCache.timestamp < CACHE_TTL) {
        return { solPrice: priceCache.solPrice, xandPrice: priceCache.xandPrice };
    }
    
    // Fetch from CoinGecko and update cache
    // ...
}
```

---

## 🔌 API Documentation

### Endpoints

#### 1. **Node Management**
```http
GET /api/pnodes
```
Returns list of all pNodes with real-time status.

**Response**:
```json
[
  {
    "address": "12abc...xyz",
    "lastSeen": 1234567890,
    "uptime": 99.9,
    "hasRpc": true,
    "version": "1.2.3",
    "podCredits": 100
  }
]
```

#### 2. **Staking Pool Stats**
```http
GET /api/staking/pool-stats
```
Returns real-time token prices and exchange rates.

**Response**:
```json
{
  "apy": 7.2,
  "exchange_rate": 40000,
  "sol_price": 100,
  "xand_price": 0.0025,
  "total_staked": 1000000,
  "last_updated": "2025-12-22T15:00:00Z"
}
```

#### 3. **DEX Liquidity**
```http
GET /api/dex/liquidity
```
Returns Raydium pool liquidity for XAND.

**Response**:
```json
{
  "total_liquidity": 1250000,
  "main_pool_liquidity": 1250000,
  "pool_count": 2,
  "main_pool_address": "ABC123...",
  "cached": true
}
```

#### 4. **AI Chat**
```http
POST /api/chat
```
**Request**:
```json
{
  "message": "How many nodes are active?",
  "conversationHistory": []
}
```

**Response**:
```json
{
  "response": "There are currently 247 active pNodes in the network."
}
```

#### 5. **Geographic Lookup**
```http
GET /api/geo?ip=1.2.3.4
```
Returns geo-location data for an IP address (cached for 7 days).

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action | Description |
|----------|--------|-------------|
| `⌘K` / `Ctrl+K` | Toggle Sidebar | Show/hide navigation sidebar |
| `⌘J` / `Ctrl+J` | Spotlight Search | Quick page navigation |
| `⌘I` / `Ctrl+I` | AI Assistant | Open XandAI chat modal |
| `⌘D` / `Ctrl+D` | Toggle Theme | Switch dark/light mode |

**Auto-Focus**: All modals automatically focus the input field for immediate typing.

---

## 📁 Project Structure

```
xandeum-pnode-analytics/
├── app/
│   ├── api/                    # API route handlers
│   │   ├── pnodes/            # Node list & individual stats
│   │   ├── staking/           # Staking pool data
│   │   │   └── pool-stats/    # Real-time prices & rates
│   │   ├── dex/               # DEX liquidity data
│   │   │   └── liquidity/     # Raydium pool info
│   │   ├── network-summary/   # AI network insights
│   │   ├── compare-nodes/     # AI node comparison
│   │   ├── chat/              # AI assistant
│   │   ├── geo/               # Geo-location
│   │   ├── analytics/         # Network analytics
│   │   └── cron/              # Snapshot collection
│   ├── docs/                  # Documentation pages
│   │   ├── page.tsx           # Docs home
│   │   ├── trading/           # Trading terminal docs
│   │   ├── xandai/            # AI assistant docs
│   │   ├── leaderboard/       # Pod credits docs
│   │   └── layout.tsx         # Docs navigation
│   ├── globals.css            # Global styles
│   └── page.tsx               # Main dashboard
├── components/
│   ├── dashboard/             # Dashboard components
│   │   ├── main-dashboard.tsx # Main dashboard container
│   │   ├── leaderboard.tsx    # Pod credits leaderboard
│   │   ├── market-data-charts.tsx # XAND price & liquidity
│   │   └── historical-charts.tsx  # Historical analytics
│   ├── sidebar/               # Navigation
│   │   └── app-sidebar.tsx    # Collapsible sidebar
│   ├── staking-widget.tsx     # Liquid staking UI
│   ├── swap-widget.tsx        # Jupiter swap integration
│   ├── trading-terminal.tsx   # Full trading terminal
│   ├── ai-assistant.tsx       # AI chat modal
│   ├── spotlight-search.tsx   # Quick navigation
│   └── ui/                    # shadcn/ui + custom
│       ├── liquid-button.tsx  # Animated staking button
│       └── custom-wallet-button.tsx # Wallet connector
├── hooks/
│   └── use-staking-data.ts    # Staking data hooks
├── contexts/
│   └── wallet-provider.tsx    # Solana wallet provider
├── lib/
│   ├── pnode-client.ts        # JSON-RPC client
│   ├── network-analytics.ts   # Health calculations
│   ├── supabase.ts            # Supabase client
│   └── utils.ts               # Utility functions
├── types/
│   └── pnode.ts               # TypeScript interfaces
└── public/
    └── xandeum-logo.png       # App logo
```

---

## 🎨 UI/UX Features

### Liquid Button Animation
Multi-layered Framer Motion animation with:
- **Morphing Background**: Pulsing gradient effect
- **Animated Blobs**: 3 orbiting colored orbs
- **Shimmer Effect**: Horizontal light sweep on hover
- **Glow Effect**: Outer shadow animation
- **Content Scale**: Subtle zoom on hover
- **Ripple Effect**: Click feedback animation

### Theme System
- **Circular Transition**: Smooth radial animation
- **System Preference Detection**: Respects OS theme
- **Persistent State**: Saves to localStorage
- **Keyboard Toggle**: `Cmd+D` shortcut

### Spotlight Search
- **Fuzzy Matching**: Intelligent search algorithm
- **Instant Navigation**: Click or Enter to navigate
- **Prefetching**: All pages prefetched for instant loads
- **External Links**: Icon indicator for docs pages

---

## 🔒 Security

### API Protection
- **CRON_SECRET**: Protects snapshot collection endpoint
- **Rate Limiting**: Planned for production
- **Input Sanitization**: All user inputs validated

### AI Assistant Safeguards
- Blocks API key/secret requests
- Prevents database/SQL queries
- Filters malicious queries
- No access to environment variables

### Environment Variables
- `.env.local` gitignored (contains secrets)
- `.env` should only have public variables
- **Recommendation**: Move all secrets to `.env.local`

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables on Vercel
Add these in Project Settings → Environment Variables:
- `GEMINI_API_KEY`
- `NEXT_PUBLIC_SOLANA_RPC_URL`
- `SUPABASE_URL`
- `SUPABASE_KEY`
- `CRON_SECRET`
- `NEXT_PUBLIC_XAND_TOKEN_ADDRESS`

---

## 🧪 Testing

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use Prettier for code formatting
- Write meaningful commit messages
- Test changes before submitting PR
- Update documentation as needed

---

## 📊 Performance Benchmarks

### API Response Times
| Endpoint | Cold Start | Cached | Improvement |
|----------|-----------|--------|-------------|
| `/api/staking/pool-stats` | 800ms | 8ms | **100x faster** |
| `/api/dex/liquidity` | 1200ms | 10ms | **120x faster** |
| `/api/pnodes` | 2500ms | 50ms | **50x faster** |

### Page Load Times
| Page | First Load | Cached Navigation |
|------|-----------|-------------------|
| Dashboard | 1.2s | <100ms |
| Staking | 900ms | <100ms |
| Analytics | 1.5s | <100ms |

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
- **CoinGecko**: [XAND Market Data](https://www.coingecko.com/en/coins/xandeum)

---

## 🙏 Acknowledgments

- **Xandeum Team**: For the distributed storage network
- **Solana Foundation**: For blockchain infrastructure
- **Google AI**: For Gemini API access
- **Vercel**: For hosting and deployment
- **Community Contributors**: For feedback and suggestions

---

<div align="center">

**Built with ❤️ for the Xandeum community**

⭐ Star this repo if you find it useful!

</div>
