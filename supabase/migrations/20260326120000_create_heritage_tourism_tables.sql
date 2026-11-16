-- Heritage tourism platform tables (Smart Tourism Platform)
create table if not exists public.heritage_destinations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  site_type text not null check (site_type in ('monument', 'museum', 'heritage_site', 'fort')),
  city text not null,
  state text not null,
  country text not null default 'India',
  short_description text not null,
  history text not null,
  year_built text,
  unesco boolean not null default false,
  image_url text not null,
  gallery jsonb not null default '[]'::jsonb,
  open_time time not null,
  close_time time not null,
  closed_days text[] not null default '{}',
  latitude double precision,
  longitude double precision,
  daily_capacity integer not null default 10000,
  created_at timestamptz not null default now()
);

create table if not exists public.heritage_ticket_types (
  id uuid primary key default gen_random_uuid(),
  destination_id uuid not null references public.heritage_destinations(id) on delete cascade,
  name text not null,
  audience text not null check (audience in ('indian', 'foreign', 'student', 'child')),
  price_inr integer not null,
  description text not null,
  includes text[] not null default '{}',
  sort_order integer not null default 0
);

create table if not exists public.heritage_time_slots (
  id uuid primary key default gen_random_uuid(),
  destination_id uuid not null references public.heritage_destinations(id) on delete cascade,
  slot_date date not null,
  start_time time not null,
  end_time time not null,
  capacity integer not null,
  booked integer not null default 0,
  expected_crowd text not null check (expected_crowd in ('low', 'moderate', 'high', 'peak')),
  unique (destination_id, slot_date, start_time)
);

create table if not exists public.heritage_entry_stats (
  id uuid primary key default gen_random_uuid(),
  destination_id uuid not null references public.heritage_destinations(id) on delete cascade,
  recorded_at timestamptz not null default now(),
  entries_today integer not null default 0,
  exits_today integer not null default 0,
  current_inside integer not null default 0,
  queue_minutes integer not null default 0,
  crowd_level text not null check (crowd_level in ('low', 'moderate', 'high', 'peak'))
);

create index if not exists heritage_destinations_site_type_idx on public.heritage_destinations(site_type);
create index if not exists heritage_ticket_types_destination_idx on public.heritage_ticket_types(destination_id);
create index if not exists heritage_time_slots_destination_date_idx on public.heritage_time_slots(destination_id, slot_date);
create index if not exists heritage_entry_stats_destination_recorded_idx on public.heritage_entry_stats(destination_id, recorded_at desc);

alter table public.heritage_destinations enable row level security;
alter table public.heritage_ticket_types enable row level security;
alter table public.heritage_time_slots enable row level security;
alter table public.heritage_entry_stats enable row level security;

create policy "public can read heritage destinations"
  on public.heritage_destinations for select to anon, authenticated using (true);

create policy "public can read heritage ticket types"
  on public.heritage_ticket_types for select to anon, authenticated using (true);

create policy "public can read heritage time slots"
  on public.heritage_time_slots for select to anon, authenticated using (true);

create policy "public can read heritage entry stats"
  on public.heritage_entry_stats for select to anon, authenticated using (true);

grant select on public.heritage_destinations to anon, authenticated;
grant select on public.heritage_ticket_types to anon, authenticated;
grant select on public.heritage_time_slots to anon, authenticated;
grant select on public.heritage_entry_stats to anon, authenticated;
