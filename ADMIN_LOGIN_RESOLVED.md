# Admin Login Issues - Complete Resolution Guide

## 🔴 Current Situation

The admin login system has been **configured correctly**, but there's a **database connectivity issue** preventing the admin user from being created.

### Issues Resolved ✅
1. ✅ JWT_SECRET updated to secure length
2. ✅ Middleware matcher configuration added
3. ✅ Seed password corrected to 'changeme'
4. ✅ Build succeeds without errors

### Current Blocker 🚫
- **Database Connection Failed** - Supabase credentials are invalid or inactive

## 🔧 Step-by-Step Resolution

### Option 1: Use Valid Supabase Project (Recommended)

If you have an active Supabase project:

1. **Get the correct connection string:**
   - Log in to [Supabase](https://supabase.com)
   - Navigate to your project
   - Go to **Settings → Database → Connection String**
   - Copy the `psql` connection string

2. **Update `.env` with valid credentials:**
   ```
   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres"
   ```

3. **Test the connection:**
   ```bash
   npx prisma db push
   ```

4. **Create the admin user:**
   ```bash
   npx prisma db seed
   ```

### Option 2: Use Local PostgreSQL

If you don't have Supabase, set up local PostgreSQL:

**On Windows:**
```bash
# Install PostgreSQL via chocolatey
choco install postgresql

# Or download from: https://www.postgresql.org/download/windows/

# Create database
createdb shopmyneighborhood

# Update .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/shopmyneighborhood"

# Test and seed
npx prisma db push
npx prisma db seed
```

**With Docker:**
```bash
docker run --name shopmyneighborhood-db \
  -e POSTGRES_DB=shopmyneighborhood \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:16

# Update .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/shopmyneighborhood"

# Then push schema and seed
npx prisma db push
npx prisma db seed
```

### Option 3: Create Admin User Manually

If you cannot run migrations, you can create the admin user directly in the database:

```bash
# Open Prisma Studio
npx prisma studio

# 1. Go to the "User" table
# 2. Click "Add record"
# 3. Fill in:
#    - id: (auto-generate UUID)
#    - email: admin@shopmyneighborhood.com
#    - password_hash: $2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lm (this is bcrypt hash of "changeme")
#    - role: admin
# 4. Save
```

## 📋 Admin Login Configuration Summary

### Authentication Flow

```
User Login → POST /api/auth/login
    ↓
Check credentials against database
    ↓
Create JWT token (signed with JWT_SECRET)
    ↓
Set HTTP-only cookie (token)
    ↓
Middleware protects /admin routes
    ↓
Access Admin Dashboard
```

### Required Variables

```env
# .env file must have:
DATABASE_URL=postgresql://...           # Valid database connection
JWT_SECRET=<32+ char secret>            # For token signing/verification
```

### Security Checklist

- [x] JWT_SECRET is 32+ characters
- [x] Middleware protects /admin routes
- [x] Cookies are HTTP-only (secure)
- [x] Tokens expire in 7 days
- [x] Admin role is checked
- [ ] Database is accessible
- [ ] Admin user exists in database

## 🚀 Complete Admin Setup Checklist

### Prerequisites
- [ ] Database is accessible (PostgreSQL)
- [ ] DATABASE_URL points to valid database
- [ ] JWT_SECRET is set in .env

### Setup Steps
1. [ ] Verify DATABASE_URL: `npx prisma db execute --stdin < /dev/null`
2. [ ] Push database schema: `npx prisma db push`
3. [ ] Seed admin user: `npx prisma db seed`
4. [ ] Start dev server: `npm run dev`
5. [ ] Test login at `http://localhost:3000`
6. [ ] Navigate to `/admin/dashboard`

### Admin Credentials
- **Email:** `admin@shopmyneighborhood.com`
- **Password:** `changeme`
- **Default Role:** `admin`

### After First Login
- ⚠️ **IMPORTANT:** Change the admin password
- Update JWT_SECRET for production
- Set up additional admin users if needed

## 🔐 Password Change Instructions

After logging in as admin, to change password:

1. Use app's "Forgot Password" flow (if implemented), OR
2. Update directly in database via Prisma Studio:
   ```bash
   npx prisma studio
   # Go to User table → Find admin@shopmyneighborhood.com
   # Click password_hash field
   # Use online bcrypt generator to create new hash
   # Paste hash into field and save
   ```

## 📚 Additional Resources

- **Admin Documentation:** [ADMIN.md](./ADMIN.md)
- **Database Setup:** [DATABASE_CONNECTION_FIX.md](./DATABASE_CONNECTION_FIX.md)
- **Deployment Guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🆘 Support

### Issue: "Authentication failed against database server"
→ Database credentials are invalid or server is unreachable
→ Solution: Update DATABASE_URL with valid credentials

### Issue: "Admin user not found in database"
→ Seed hasn't been run or failed
→ Solution: Run `npx prisma db seed` again

### Issue: "Login successful but Admin link doesn't appear"
→ User role is not set to 'admin' in database
→ Solution: Update user role via Prisma Studio

### Issue: "Admin Dashboard shows 'Unauthorized'"
→ JWT token is invalid or expired
→ Solution: Clear cookies and log in again
