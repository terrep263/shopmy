# Database Connection Troubleshooting

## Error: "Can't reach database server at db.dcqvoqpryrhjsnxkqvtt.supabase.co:5432"

**Status:** Database is unreachable from your machine

### Common Causes

1. **Supabase Project is Paused** ⏸️
   - Supabase pauses free-tier projects after 7 days of inactivity
   - Solution: Go to [Supabase Dashboard](https://supabase.com/dashboard) → Click your project name at top → Resume

2. **IP Whitelisting** 🔒
   - Supabase may require IP whitelisting for external connections
   - Solution: Go to Project Settings → Database → Connection IP Whitelist → Add your IP

3. **Network/Firewall Blocked** 🛡️
   - Your ISP or corporate firewall may block connections to external databases
   - Solution: Try from a different network or use local PostgreSQL

4. **Credentials Incorrect** ❌
   - Password or connection string is wrong
   - Solution: Verify credentials in Supabase Dashboard → Settings → Database

## Quick Solutions

### Solution 1: Resume Supabase Project (Most Likely)

1. Go to https://supabase.com/dashboard
2. Click your **project name** at the top
3. Look for a **Resume Project** button
4. Click to resume
5. Wait 1-2 minutes for it to start
6. Try again: `npx prisma db push`

### Solution 2: Set Up Local PostgreSQL Instead

If Supabase continues to have issues, use local PostgreSQL:

**Install PostgreSQL on Windows:**
```bash
# Via Chocolatey
choco install postgresql

# Or download from: https://www.postgresql.org/download/windows/
```

**Create database:**
```bash
createdb -U postgres -W shopmyneighborhood
# Enter password when prompted
```

**Update .env:**
```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/shopmyneighborhood"
```

**Then run:**
```bash
npx prisma db push
npx prisma db seed
npm run dev
```

### Solution 3: Use Docker PostgreSQL (No Installation)

```bash
# Start PostgreSQL in Docker
docker run --name shopmyneighborhood-db \
  -e POSTGRES_DB=shopmyneighborhood \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:16

# Update .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/shopmyneighborhood"

# Then run
npx prisma db push
npx prisma db seed
npm run dev
```

## Current Configuration

```
Database: db.dcqvoqpryrhjsnxkqvtt.supabase.co
User: postgres
Project ID: dcqvoqpryrhjsnxkqvtt
Region: (check Supabase dashboard)
```

## Next Steps

1. Try **Solution 1** first (Resume Supabase)
2. If that doesn't work, try **Solution 2 or 3** (Local PostgreSQL)
3. Once database is accessible, run:
   ```bash
   npx prisma db push      # Create tables
   npx prisma db seed      # Create admin user
   npm run dev             # Start dev server
   ```

## Testing Connection

To verify connection is working:
```bash
npx prisma db execute --stdin
```
Then type: `SELECT version();` and press Enter twice

Should return PostgreSQL version if connection succeeds.
