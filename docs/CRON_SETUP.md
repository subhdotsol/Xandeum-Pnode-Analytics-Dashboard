# Cron-job.org Setup Guide

## Step 1: Create cron-job.org account

1. Go to https://cron-job.org
2. Sign up for a free account
3. Verify your email

## Step 2: Create a cron job

1. Click "Create cronjob" in dashboard
2. Configure the job:

### Basic Settings
- **Title:** "pNode Snapshot Collection"
- **URL:** `https://your-app.vercel.app/api/cron/collect-snapshot`
- **Execution schedule:** Every 5 minutes
  - Minutes: `0,5,10,15,20,25,30,35,40,45,50,55`
  - Hours: `*`
  - Days: `*`
  - Months: `*`

### Headers
Click "Add header" and add:
```
Header: Authorization
Value: Bearer YOUR_CRON_SECRET
```

> [!IMPORTANT]
> Replace `YOUR_CRON_SECRET` with the value from your `.env.local` or Vercel environment variables.

### Advanced Settings
- **Request timeout:** 60 seconds
- **Request method:** GET
- **Save failed executions:** Yes (for debugging)

## Step 3: Test the cron job

1. Click "Save" to create the job
2. Click "Run now" to test immediately
3. Check the execution log for success/errors
4. View response in cron-job.org dashboard

## Step 4: Verify in your app

After the cron runs, verify:

1. **Database:** Check Supabase dashboard for new snapshots
   ```sql
   SELECT * FROM "Snapshot" ORDER BY timestamp DESC LIMIT 10;
   ```

2. **API Response:**
   Visit: `https://your-app.vercel.app/api/historical?range=1h`

3. **Logs:** Check Vercel logs for cron execution

## Troubleshooting

### Error: "Unauthorized"
- Check `CRON_SECRET` matches in both places
- Ensure Authorization header format: `Bearer YOUR_SECRET`

### Error: "Timeout"
- Increase timeout in cron-job.org to 60 seconds
- Check Vercel function timeout limits

### Error: "No pNodes found"
- Network might be temporarily down
- Check manually: `https://your-app.vercel.app/api/pnodes`

### Error: Database connection failed
- Verify `DATABASE_URL` in Vercel env vars
- Check Supabase connection pooling settings
- Run `npx prisma db push` to ensure schema is up to date

## Monitoring

Monitor cron execution in:
- **cron-job.org dashboard:** View execution history
- **Vercel logs:** Real-time function logs
- **Supabase dashboard:** Database records

## Optional: Email Notifications

Enable in cron-job.org:
- ✅ Notify on execution failure
- ❌ Do not notify on success (to avoid spam)
