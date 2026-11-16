# Darshan (Smart Tourism Platform)

Next.js app for heritage destinations with history, ticket details, crowd levels, time slots, and live entry stats. Data lives in Supabase.

## Stack

- Next.js App Router
- Tailwind CSS
- Supabase Postgres

## Setup

```bash
npm install
cp .env.example .env.local
```

Fill `.env.local` with your Supabase URL and publishable key.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database

Migration SQL is in `supabase/migrations/`. Tables:

- `heritage_destinations`
- `heritage_ticket_types`
- `heritage_time_slots`
- `heritage_entry_stats`

## Scripts

- `npm run dev` local development
- `npm run build` production build
- `npm run start` production server
- `npm run lint` ESLint
