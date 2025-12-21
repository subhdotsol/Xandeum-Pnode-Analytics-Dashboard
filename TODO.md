# 📋 Future Features & TODO

This document tracks features we want to implement to improve the dashboard.

---

## 🔴 Missing Features 

| Feature | Description | Priority | Status |
|---------|-------------|----------|--------|
| **Historical Analytics** | 5-minute snapshots stored in Supabase | High | ⏳ Pending |
| **Historical Data Graphs** | Line charts showing trends over time | Medium | ⏳ Pending |
| **Supabase Integration** | Database for storing historical snapshots | Medium | ⏳ Pending |
| **GitHub Actions Cron Job** | Automated snapshot collection every 5 minutes | Medium | ⏳ Pending |
| **In-Memory Caching** | TTL-based caching for API responses | Low | ⏳ Pending |
| **30-second Auto-refresh** | Client-side polling (currently 60s) | Low | ⏳ Pending |
| **Historical API Endpoint** | `/api/historical` for querying past data | Medium | ⏳ Pending |

---

## 🚀 Unique Features to Add 

### 🔥 High Priority (Unique Differentiators)

| Feature | Description | Status |
|---------|-------------|--------|
| **Real-time WebSocket Updates** | Live updates without page refresh - instant updates instead of polling | ⭐ Good Idea |
| **Performance Leaderboard** | Rank nodes by uptime, CPU efficiency, storage - gamification | ⭐ Good Idea |
| **Alerts & Notifications** | Browser notifications when nodes go offline | ⭐ Good Idea |

### 💡 Medium Priority

| Feature | Description | Status |
|---------|-------------|--------|
| Node Comparison Tool | Compare 2-3 nodes side by side | ⏳ Pending |
| Export Data (CSV/JSON) | Download node data for analysis | ⏳ Pending |
| Network Topology Graph | D3.js force-directed graph showing node connections | ⏳ Pending |
| Node Uptime History | Sparkline showing 24h uptime for each node | ⏳ Pending |
| Search by Location | Filter nodes by country/city | ⏳ Pending |
| Bookmark Favorite Nodes | Pin nodes to watch (localStorage) | ⏳ Pending |
| Version Upgrade Recommendations | Show which nodes need updates | ⏳ Pending |
| API Documentation Page | Interactive Swagger-like docs at `/docs` | ⏳ Pending |
| PWA Support | Install as mobile app | ⏳ Pending |

### 🎨 Visual Polish

| Feature | Description | Status |
|---------|-------------|--------|
| Animated Network Stats | CountUp animations on page load | ⏳ Pending |
| Globe View | 3D rotating globe instead of flat map | ⏳ Pending |
| Heatmap Overlay | Show node density on map | ⏳ Pending |

---

## ✅ Completed Features

- [x] Real-time Network Health Monitoring
- [x] Interactive World Map with Leaflet
- [x] Progressive Loading (spinner → skeleton → content)
- [x] Batch Loading for Map (20 nodes at a time)
- [x] Node Registry with Pagination (10/25/50/100)
- [x] Node Details Popup with Copyable Fields
- [x] Activity Monitor with Gradient Graph
- [x] Status Badges (green/yellow/red)
- [x] Dark/Light Theme Toggle
- [x] Geo-location for Nodes
- [x] Network Health Score Card
- [x] Version Distribution Pie Chart
- [x] Aggregate Stats from Seed Nodes

---

## 📝 Notes

- WebSocket would require a separate server or using a service like Pusher/Ably
- Supabase integration needs a free account at supabase.com
- GitHub Actions cron needs CRON_SECRET environment variable

---

*Last updated: December 21, 2024*
