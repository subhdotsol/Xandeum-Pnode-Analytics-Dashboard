# Database and Redis Environment Setup

## Local Development

Add these to your `.env.local` file:

```bash
# Database (Local Docker)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/pnode"

# Redis (Local Docker)  
REDIS_URL="redis://localhost:6379"

# Cron Secret (generate with command below)
CRON_SECRET="your-secret-here"
```

**Generate CRON_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Production (Vercel)

Add these environment variables in Vercel dashboard:

### 1. Supabase PostgreSQL

Sign up at: https://supabase.com

1. Create new project
2. Go to Settings → Database
3. Copy connection string (starts with `postgresql://`)
4. Add to Vercel:
   ```
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### 2. Upstash Redis

Sign up at: https://upstash.com

1. Create new database
2. Select "Global" for best performance
3. Copy REST URL and Token
4. Add to Vercel:
   ```
   UPSTASH_REDIS_REST_URL=https://[ENDPOINT].upstash.io
   UPSTASH_REDIS_REST_TOKEN=[YOUR-TOKEN]
   ```

### 3. Cron Secret

```bash
CRON_SECRET=[same-secret-from-local]
```

## Start Local Development

```bash
# Start Docker containers
docker-compose up -d

# Run Prisma migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Start dev server
npm run dev
```

## Production Deployment

```bash
# Push schema to Supabase
npx prisma db push

# Deploy to Vercel
vercel --prod
```
