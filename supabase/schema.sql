
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text,
  customer_email text,
  address text,
  basket_type text,
  fruits text[],
  vegetables text[],
  extras jsonb,
  gift boolean,
  coupon_code text,
  discount numeric(5,2),
  total numeric(10,2),
  delivery_km int,
  delivery_cost numeric(10,2),
  payment_status text,
  tracking_status text default 'in_preparazione',
  created_at timestamp with time zone default now()
);

create table if not exists public.orders_failed (
  id uuid primary key default gen_random_uuid(),
  customer_name text,
  reason text,
  payload jsonb,
  created_at timestamp with time zone default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  last_order_at timestamp,
  created_at timestamp default now()
);

create table if not exists public.coupons (
  code text primary key,
  discount numeric(5,2),
  is_active boolean default true,
  expires_at timestamp
);

alter table public.orders enable row level security;
create policy "Allow insert" on public.orders for insert using (true);
