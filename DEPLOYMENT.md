# ShopMyNeighborhood – Vercel Production Deployment

## 1. Install Vercel CLI

```bash
npm install -g vercel
```

## 2. Log in to Vercel

```bash
vercel login
```

Complete browser authentication.

## 3. Create Production PostgreSQL Database

- **Recommended:** [Neon](https://neon.tech) or **Alternative:** [Supabase](https://supabase.com)
- Create a database named: **shopmyneighborhood**
- Copy the connection string (e.g. `postgresql://USER:PASSWORD@HOST:PORT/shopmyneighborhood?sslmode=require`)

## 4. Configure Production Environment Variables

Use the template in **.env.production.example**. Create **.env.production** locally with real values (do not commit). Then push each variable to Vercel:

```bash
vercel env add DATABASE_URL production
vercel env add JWT_SECRET production
vercel env add PAYMENT_CALLBACK_SECRET production
vercel env add OPENAI_API_KEY production
vercel env add GOOGLE_PLACES_API_KEY production
vercel env add NEXT_PUBLIC_BASE_URL production
```

Add **NEXT_PUBLIC_SUPABASE_URL** and **NEXT_PUBLIC_SUPABASE_ANON_KEY** if you use Supabase client.

For **NEXT_PUBLIC_BASE_URL**, use your Vercel URL after first deploy (e.g. `https://shopmyneighborhood.vercel.app`).

## 5. Prisma and Database URL

This project uses **Prisma 7**. The production database URL is read from **env** and configured in **prisma.config.ts** (not in `schema.prisma`). Ensure **DATABASE_URL** is set in Vercel and in your local env when running migrations.

## 6. Generate Prisma Client

```bash
npx prisma generate
```

(Run automatically during `npm run build` on Vercel.)

## 7. Run Production Database Migration

**One-time** (with production **DATABASE_URL** in env):

```bash
# Set DATABASE_URL to your production Postgres URL, then:
npx prisma migrate deploy
```

Or run this from a machine/env where **DATABASE_URL** points to the production database.

## 8. Deploy to Vercel

```bash
vercel
```

Choose **Deploy** and **Production** when prompted. On first run, link to a new or existing Vercel project.

## 9. Verify Deployment

Open: **https://your-vercel-domain.vercel.app**

Check:

- `/` – Home
- `/deals` – Public deals
- `/business` – Business listing / claim
- `/vendor/dashboard` – Vendor dashboard (requires vendor login)
- `/admin/dashboard` – Admin panel (requires admin login)

## 10. Verify Database

```bash
# With DATABASE_URL set to production:
npx prisma studio
```

Confirm tables: **User**, **Business**, **Vendor**, **Deal**, **Voucher**, **VoucherRedemption**, **Subscription**.

## 11. Set Final Production URL and Redeploy

In Vercel Dashboard (or CLI), set **NEXT_PUBLIC_BASE_URL** to your final domain (e.g. `https://shopmyneighborhood.vercel.app`). Then:

```bash
vercel --prod
```

---

## Expected Result

- Live app at **https://your-vercel-domain.vercel.app**
- Features working: business import, vendor claiming, DealGuard AI deals, voucher issue/PDF/QR redemption, public marketplace, admin panel
- Production database migrated and reachable via Prisma
