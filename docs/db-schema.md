# Database Schema — Source of Truth
# Last updated: 2026-02-19
# Any code must match this schema exactly. Do not add DB fields without updating this file first.

## Business (public.Business)
Core fields (original):
- id text PK
- google_place_id text
- name text
- address text
- city text
- category text
- latitude double precision
- longitude double precision
- claimed boolean DEFAULT false
- created_at timestamp DEFAULT now()
- tenant_id text FK→Tenant
- categoryId text FK→Category
- cityId text FK→City

Extended fields (added via ALTER TABLE):
- primary_type text
- types jsonb
- business_status text
- street_number text
- route text
- state text
- postal_code text
- country text
- viewport_northeast_lat double precision
- viewport_northeast_lng double precision
- viewport_southwest_lat double precision
- viewport_southwest_lng double precision
- national_phone_number text
- international_phone_number text
- website_uri text
- google_maps_uri text
- rating numeric(2,1)
- user_rating_count integer
- price_level integer
- price_range text
- regular_opening_hours jsonb
- current_opening_hours jsonb
- utc_offset_minutes integer
- time_zone text
- photo_references jsonb
- icon_mask_base_uri text
- icon_background_color text
- is_verified boolean DEFAULT false
- claim_status text
- claim_date timestamp
- ai_summary text
- ai_quality_score integer
- ai_last_updated timestamp
- google_last_sync timestamp
- editorial_summary text
- parking_options jsonb
- payment_options jsonb
- accessibility_options jsonb
- delivery boolean
- takeout boolean
- dine_in boolean
- reservable boolean
- updated_at timestamp DEFAULT now()
- deleted_at timestamp

## User (public.User)
- id text PK
- email text UNIQUE
- password_hash text
- role enum(admin, vendor, customer)
- created_at timestamp DEFAULT now()
- tenant_id text (nullable)

## Vendor (public.Vendor)
- id text PK
- user_id text FK→User
- business_id text FK→Business
- subscription_status enum(active, inactive, expired)
- subscription_plan text (nullable)
- subscription_expires_at timestamp (nullable)
- created_at timestamp DEFAULT now()
- tenant_id text FK→Tenant

## Deal (public.Deal)
- id text PK
- vendor_id text FK→Vendor
- title text
- description text
- price double precision
- original_value double precision
- expiration_date timestamp
- status enum(draft, published, pending_review, rejected)
- quality_score integer
- created_at timestamp DEFAULT now()
- tenant_id text FK→Tenant

## Voucher (public.Voucher)
- id text PK
- deal_id text FK→Deal
- uuid text UNIQUE
- customer_email text
- status enum(issued, redeemed, expired)
- issued_at timestamp DEFAULT now()
- expires_at timestamp
- tenant_id text FK→Tenant

## VoucherRedemption (public.VoucherRedemption)
- id text PK
- voucher_id text UNIQUE FK→Voucher
- redeemed_by_vendor text
- redeemed_at timestamp DEFAULT now()
- tenant_id text (nullable)

## Subscription (public.Subscription)
- id text PK
- vendor_id text UNIQUE FK→Vendor
- plan text
- status enum(active, inactive, expired)
- expires_at timestamp
- tenant_id text (nullable)

## City (public.City)
- id text PK
- name text
- active boolean DEFAULT true
- last_imported_at timestamp (nullable)
- created_at timestamp DEFAULT now()
- tenant_id text FK→Tenant

## Category (public.Category)
- id text PK
- name text
- google_type text
- active boolean DEFAULT true
- created_at timestamp DEFAULT now()
- tenant_id text FK→Tenant

## AdminAction (public.AdminAction)
- id text PK
- admin_id text FK→User
- action_type text
- entity_type text
- entity_id text (nullable)
- metadata jsonb (nullable)
- created_at timestamp DEFAULT now()
- tenant_id text (nullable)

## BrandingSettings (public.BrandingSettings)
- id text PK
- primary_color text DEFAULT '#c71f37'
- logo_url text (nullable)
- logo_light_url text (nullable)
- site_name text DEFAULT 'Shop My Neighborhood'
- favicon_url text (nullable)
- updated_at timestamp
- created_at timestamp DEFAULT now()

## Tenant (public.Tenant)
- id text PK
- name text
- slug text UNIQUE
- domain text (nullable)
- created_at timestamp DEFAULT now()
