# Xandeum pNode Analytics Platform

A premium, real-time analytics dashboard for monitoring the Xandeum distributed storage network.

![Next.js](https://img.shields.io/badge/Next.js-15.1.5-black)
![React](https://img.shields.io/badge/React-19.2.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1.7-38bdf8)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.0.0-ff0055)

## ✨ Features

- **Real-time Network Monitoring** - Track pNode health, performance, and distribution
- **Premium UI Design** - Glassmorphism effects, gradient text, and smooth animations
- **Interactive Dashboard** - Search, filter, and sort network nodes
- **Health Scoring** - Sophisticated algorithm analyzing network status
- **Version Analytics** - Track version distribution and outdated nodes
- **Auto-Refresh** - Automatic data updates every 60 seconds

## 🎯 Tech Stack

**Core:**
- Next.js 15.1.5 (App Router)
- React 19.2.1
- TypeScript 5.7.3
- TailwindCSS 4.1.7

**UI & Animations:**
- shadcn/ui components
- Framer Motion 12.0.0
- Recharts 2.15.0
- Lucide Icons

**Data:**
- D3.js 7.9.0
- JSON-RPC client
- Custom analytics engine

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd pnode

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Build for Production

```bash
npm run build
npm run start
```

## 📁 Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── pnodes/       # Node endpoints
│   │   └── network/      # Network analytics
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main dashboard
├── components/
│   ├── ui/               # shadcn base components
│   └── dashboard/        # Custom dashboard components
├── lib/
│   ├── pnode-client.ts   # JSON-RPC client
│   ├── network-analytics.ts # Analytics engine
│   └── utils.ts          # Utilities
├── types/
│   └── pnode.ts          # TypeScript interfaces
└── tailwind.config.ts    # Tailwind configuration
```

## 🎨 Design Features

**Visual Excellence:**
- Dark theme with vibrant teal-blue gradients
- Glassmorphism card effects
- Smooth Framer Motion animations
- Animated circular health indicator
- Hover lift effects
- Custom scrollbar styling

**Responsive Design:**
- Desktop: 4-column grid layout
- Tablet: 2-column responsive grid
- Mobile: Single column, touch-optimized

## 📊 Dashboard Components

### Network Health Card
Large circular progress indicator showing overall network health score (0-100) with color-coded status and percentage breakdown.

### Stats Grid
Four key metrics:
- Total Nodes
- Network Storage
- Average CPU Usage
- Average Storage per Node

### Version Distribution
Pie chart visualization showing version distribution across the network with outdated node warnings.

### Nodes Table
Interactive table with:
- Real-time search
- Status filtering
- Multi-column sorting
- Health badges

## 🔧 API Endpoints

- `GET /api/pnodes` - Fetch all pNodes
- `GET /api/pnodes/[address]` - Get individual node stats
- `GET /api/network/overview` - Complete network analytics
- `GET /api/network/health` - Health metrics only

All endpoints cache for 30 seconds for optimal performance.

## 🏆 Bounty Submission

Built for the Xandeum pNode Analytics Platform bounty on Superteam Earn.

**Improvements over requirements:**
✅ Latest dependency versions (not outdated)  
✅ Premium UI with shadcn, Framer Motion, Recharts  
✅ Smooth animations and micro-interactions  
✅ Glassmorphism and modern design trends  
✅ Full TypeScript type safety  
✅ Production-ready build  

## 📄 License

MIT

## 🙏 Acknowledgments

- [Xandeum Labs](https://xandeum.com) for the bounty
- [shadcn/ui](https://ui.shadcn.com) for the component system
- [Framer Motion](https://www.framer.com/motion/) for animations
- [StakeWiz](https://stakewiz.com) for design inspiration
