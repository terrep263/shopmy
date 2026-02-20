# COPILOT RULES — READ BEFORE TOUCHING ANY FILE

## AUTH — DO NOT MODIFY
Authentication is handled ENTIRELY by `middleware.ts`.
- Do NOT add `requireAdmin()` to any route
- Do NOT add `requireAdminUser()` to any route  
- Do NOT import from `adminAuth.ts` or `adminAuth.service.ts`
- Do NOT add cookie checks to routes
- Routes get adminId via: `req.headers.get("x-admin-id")`

## DATABASE — DO NOT MODIFY SCHEMA
`prisma/schema.prisma` matches the live Supabase DB exactly.
- Do NOT add fields to schema that aren't in the DB
- Do NOT run `prisma migrate` — use `prisma generate` only
- Do NOT add `url` to the datasource block in schema.prisma
- The DB source of truth is the SQL schema in `/docs/db-schema.sql`

## BUSINESS MODEL — CONFIRMED FIELDS ONLY
Business table extended fields are documented in `/docs/db-schema.sql`
Do NOT invent fields. Only use what is in that file.

## STACK RULES
- Auth: single `admin_token` cookie, verified in middleware only
- DB: Prisma 7 + Supabase (no migrations, schema must match DB exactly)
- Admin routes: `/api/admin/*` are all protected by middleware matcher
- Tenant default: `tenant_lake_county`

## IF YOU ARE UNSURE
Do not guess. Ask or leave the file unchanged.
