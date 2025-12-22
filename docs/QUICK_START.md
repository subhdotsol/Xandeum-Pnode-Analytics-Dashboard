# 🚀 Quick Start Guide: PostgreSQL + Redis Setup

## Prerequisites

- Node.js 18+ installed
- Docker installed (for local development)
- Vercel account
- Supabase account (free tier)
- Upstash account (free tier)
- cron-job.org account (free)

---

## Part 1: Local Development Setup

### 1. Install Dependencies

Already done! ✅ Dependencies installed:
- `@prisma/client` - Prisma ORM
- `@upstash/redis` - Redis client
- `prisma` - Prisma CLI

### 2. Start Docker Containers

```bash
# Start PostgreSQL and Redis
npm run docker:up

# Verify containers are running
docker ps
```

You should see:
- `pnode-postgres` on port 5432
- `pnode-redis` on port 6379

### 3. Configure Environment

Add to `.env.local`:

```bash
# Database (local Docker)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/pnode"

# Redis (local Docker - will use in-memory fallback automatically)
REDIS_URL="redis://localhost:6379"

# Generate CRON_SECRET
npm run generate-secret
# Copy the output and add it:
CRON_SECRET="paste-generated-secret-here"
```

### 4. Initialize Database

```bash
# Generate Prisma client
npm run db:generate

# Create database tables
npm run db:push

# (Optional) Open Prisma Studio to view database
npm run db:studio
```

### 5. Start Development Server

```bash
npm run dev
```

Your app is now running with local PostgreSQL + Redis! 🎉

### 6. Test Locally

1. **Manual snapshot collection:**
   ```bash
   curl -X GET http://localhost:3000/api/cron/collect-snapshot \
     -H "Authorization: Bearer YOUR_CRON_SECRET"
   ```

2. **Check pNodes list (should use cache):**
   ```
   http://localhost:3000/api/pnodes
   ```

3. **Check historical data:**
   ```
   http://localhost:3000/api/historical?range=1h
   ```

---

## Part 2: Production Deployment

### 1. Set Up Supabase (PostgreSQL)

1. Go to https://supabase.com
2. Create new project
3. Go to **Settings** → **Database**
4. Copy **Connection string** (URI mode)
5. Add to Vercel environment variables:
   ```
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### 2. Set Up Upstash (Redis)

1. Go to https://upstash.com
2. Create new database
3. Select **Global** region for best performance
4. Copy **REST URL** and **REST Token**
5. Add to Vercel environment variables:
   ```
   UPSTASH_REDIS_REST_URL=https://[ENDPOINT].upstash.io
   UPSTASH_REDIS_REST_TOKEN=[YOUR-TOKEN]
   ```

### 3. Deploy to Vercel

```bash
# Push schema to Supabase
npx prisma db push

# Deploy
vercel --prod
```

### 4. Add Environment Variables to Vercel

Go to Vercel dashboard → Settings → Environment Variables:

```bash
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
UPSTASH_REDIS_REST_URL=https://[ENDPOINT].upstash.io
UPSTASH_REDIS_REST_TOKEN=[YOUR-TOKEN]
CRON_SECRET=[same-as-local]
```

### 5. Set Up cron-job.org

See detailed guide: [docs/CRON_SETUP.md](file:///Users/subh/Desktop/code-playground/pnode/docs/CRON_SETUP.md)

**Quick setup:**
1. Create cron job at https://cron-job.org
2. URL: `https://your-app.vercel.app/api/cron/collect-snapshot`
3. Schedule: Every 5 minutes
4. Header: `Authorization: Bearer YOUR_CRON_SECRET`
5. Click "Save" and "Run now" to test

---

## Part 3: Verification

### Verify it's working:

1. **Check cron execution:**
   - Visit cron-job.org dashboard
   - Look for green checkmark ✅

2. **Check Supabase:**
   ```sql
   SELECT * FROM "Snapshot" ORDER BY timestamp DESC LIMIT 5;
   SELECT COUNT(*) FROM "PNode";
   ```

3. **Check API responses:**
   - `https://your-app.vercel.app/api/pnodes` → Should show `"cached": true` on second request
   - `https://your-app.vercel.app/api/historical?range=1h` → Should show snapshots

4. **Check Vercel logs:**
   - Look for `[Cron] Starting snapshot collection...`
   - Look for `[API] Returning cached pNodes list`

---

## Helper Commands

```bash
# Local Development
npm run docker:up          # Start PostgreSQL + Redis
npm run docker:down        # Stop containers
npm run docker:logs        # View container logs
npm run db:studio          # Open Prisma Studio
npm run generate-secret    # Generate new CRON_SECRET

# Database Management
npm run db:generate        # Generate Prisma client
npm run db:push           # Push schema to database
npm run db:migrate        # Create migration
```

---

## Troubleshooting

### "Cannot connect to database"
```bash
# Check Docker containers
docker ps

# Restart containers
npm run docker:down
npm run docker:up
```

### "Prisma Client not generated"
```bash
npm run db:generate
```

### "Redis connection failed"
Don't worry! The app automatically falls back to in-memory cache if Redis is unavailable.

### "Cron job failing"
1. Check CRON_SECRET matches everywhere
2. Verify Vercel deployment is live
3. Check Vercel function logs
4. Test manually: `curl -X GET https://your-app.vercel.app/api/cron/collect-snapshot -H "Authorization: Bearer YOUR_SECRET"`

---

## What's Next?

Your dashboard now has:
- ✅ **Redis caching** - 10-50x faster API responses
- ✅ **PostgreSQL storage** - Historical data capabilities  
- ✅ **Automated snapshots** - Every 5 minutes via cron-job.org
- ✅ **Zero cost** - All free tiers!

**Ready to add historical charts to your frontend?** 
Use the `/api/historical` endpoint to fetch time-series data! 📊
