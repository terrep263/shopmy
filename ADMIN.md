# Admin access

## Default admin user (from seed)

After running the database seed, an admin user is available:

- **Email:** `admin@shopmyneighborhood.com`
- **Password:** `changeme` (change after first login)

## Setup

1. **Environment:** Set `JWT_SECRET` in `.env` (and in production). Auth and admin protection depend on it. See `.env.production.example` for other variables.

2. **Create the admin user:** From the project root (e.g. `shopmyneighborhood`):
   ```bash
   npx prisma db seed
   ```
   This creates or updates the admin user with the credentials above.

## How admin access works

- **Login:** Use the navbar “SignUp or SignIn” → log in with the admin email and password. The app sets an HTTP-only cookie and stores your role in the session.
- **Navbar:** If you are logged in as admin, an **Admin** link appears in the navbar (desktop and mobile) and goes to `/admin/dashboard`.
- **Protection:** The middleware protects all `/admin` routes: no cookie or invalid token redirects to `/`, and a valid token with `role !== 'admin'` also redirects to `/`.
- **API:** Admin API routes under `/api/admin/*` use `requireAdmin()` and reject requests without a valid admin token.

## Admin routes

- `/admin/dashboard` – Platform control center (vendors, deals, vouchers counts)
- `/admin/vendors` – List vendors
- `/admin/businesses` – List businesses
- `/admin/deals` – List deals
- `/admin/vouchers` – List vouchers

## Changing the admin password

The seed does not change an existing admin password. To set a new password, use your app’s “forgot password” flow (if implemented) or update the user in the database (e.g. via Prisma Studio or a one-off script that hashes a new password and updates the admin user).
