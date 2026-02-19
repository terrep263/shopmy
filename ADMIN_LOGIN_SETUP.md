# Admin Login Setup Guide

## ✅ Issues Fixed

1. **JWT_SECRET Updated** - Changed to a proper 32+ character secret key
2. **Seed Password Corrected** - Updated to use `changeme` as documented
3. **Middleware Matcher Added** - Properly configured to protect `/admin` and `/vendor` routes
4. **Admin User Status** - Ready to be created/seeded

## 🔧 Setup Steps

### Step 1: Verify Environment Configuration

Check your `.env` file has:
```
DATABASE_URL=postgresql://...  # Must point to valid database
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-minimum-32-chars-long
```

### Step 2: Run Database Migrations

```bash
# From project root
npx prisma db push
```

This creates the database schema (User, Vendor, Business, Deal, Voucher tables).

### Step 3: Seed the Admin User

```bash
npx prisma db seed
```

This creates an admin user with:
- **Email:** `admin@shopmyneighborhood.com`
- **Password:** `changeme`

### Step 4: Update JWT_SECRET (IMPORTANT FOR PRODUCTION)

The current `JWT_SECRET` in `.env` is a placeholder. For production:

```bash
# Generate a strong secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then update `.env.production`:
```
JWT_SECRET=<your-generated-secret>
```

## 🚀 Admin Login Workflow

### 1. Start the Development Server
```bash
npm run dev
```

Open `http://localhost:3000`

### 2. Login as Admin

- Click **"SignUp or SignIn"** in the navbar
- Use credentials:
  - Email: `admin@shopmyneighborhood.com`
  - Password: `changeme`
- After login, an **Admin** link appears in the navbar

### 3. Access Admin Dashboard

Navigate to `/admin/dashboard` to access:
- **Admin Dashboard** - Statistics (vendors, deals, vouchers)
- **Vendors** - `/admin/vendors` - List all vendors
- **Businesses** - `/admin/businesses` - List all businesses
- **Deals** - `/admin/deals` - List all deals
- **Vouchers** - `/admin/vouchers` - List all vouchers

## 🔐 Security Notes

### Middleware Protection
The middleware in `middleware.ts` protects all `/admin/*` routes:
- **No token** → Redirects to `/`
- **Invalid token** → Redirects to `/`
- **Token with role != 'admin'** → Redirects to `/`

### API Protection
All `/api/admin/*` routes require a valid admin token via `requireAdmin()` function.

### Cookie-based Authentication
- Login sets an HTTP-only cookie: `token=<jwt>`
- Cookie valid for 7 days
- Automatically sent with all requests (`credentials: "include"`)
- Protected from CSRF with `SameSite=Lax`

## 🆘 Troubleshooting

### Issue: Login Fails with "Invalid credentials"
**Solution:**
1. Verify admin user exists: `npx prisma studio` → Check **User** table
2. If missing, run: `npx prisma db seed`
3. Verify email is exactly: `admin@shopmyneighborhood.com`
4. Verify password is exactly: `changeme`

### Issue: Admin Dashboard Shows "Unauthorized"
**Solution:**
1. Check JWT_SECRET in `.env` matches login/middleware
2. Clear browser cookies: Open DevTools → Application → Cookies → Delete `token`
3. Log out and log back in
4. Check network requests in DevTools for auth errors

### Issue: Admin Link Doesn't Appear After Login
**Solution:**
1. Verify user role in database: `npx prisma studio` → Check **User** table → `role` column = `"admin"`
2. If role is missing/wrong, update user:
   ```bash
   npx prisma studio
   # Navigate to User table, find admin@shopmyneighborhood.com, set role to "admin"
   ```
3. Refresh page or log out/in again

### Issue: Database Connection Error
**Solution:**
1. Verify `DATABASE_URL` in `.env` is valid and reachable
2. Test connection: `npx prisma db execute --stdin < /dev/null` (or use Prisma Studio)
3. If Supabase, verify credentials and IP whitelisting

## 📋 Files Modified

- `.env` - Updated JWT_SECRET
- `middleware.ts` - Added matcher config
- `prisma/seed.ts` - Updated password to 'changeme'

## 🔗 Related Files

- `src/lib/auth.ts` - JWT signing/verification
- `src/lib/adminGuard.ts` - Admin authorization check
- `src/app/api/auth/login/route.ts` - Login endpoint
- `src/app/admin/dashboard/page.tsx` - Admin dashboard page
- `ADMIN.md` - Admin documentation

## 📝 Next Steps

1. ✅ Verify database connection is working
2. ✅ Run migrations and seed
3. ✅ Test admin login
4. ✅ Explore admin dashboard
5. ⚠️ Change admin password after first login
6. ⚠️ Update JWT_SECRET for production
