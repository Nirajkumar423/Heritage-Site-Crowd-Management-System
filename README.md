# Darshan — Heritage Site Crowd Management System

An intelligent smart-tourism platform designed to regulate tourist flow, prevent overcrowding, and enrich the visitor experience across historical monuments, museums, and heritage destinations in India.

---

## 🏛️ Project Details

1. **Real-Time Crowd Monitoring & Gate Pressure Tracking**: Monitors current visitor counts against defined daily capacities, displaying live gate pressure and real-time status indicators (low, moderate, high, peak) for destinations.
2. **Intelligent Time-Slot Allocation**: Prevents bottlenecks and sudden surges by distributing visitors across timed entry slots with capacity caps and expected crowd forecasting.
3. **Comprehensive Heritage Destination Profiles**: Provides historical context, architectural background, UNESCO recognition badges, visiting hours, closed days, and image galleries for cultural sites.
4. **Tiered Ticket Pricing & Audience Segmentation**: Organizes entry ticketing with custom tiers for Indian nationals, foreign tourists, students, and children, including itemized inclusions (e.g., mausoleum access, audio guides).
5. **Secure Tourist Authentication & Session Management**: Built-in user authentication supporting account creation, email confirmation, secure sessions, and personalized account management powered by Supabase Auth.
6. **Optimized Performance & Responsive Design**: Engineered with Next.js App Router, server-side caching, and Tailwind CSS for fast page loads and smooth mobile responsiveness for on-site tourists.

---

## 💻 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 16 (App Router, Server Components & Server Actions)
- **Frontend Library**: [React](https://react.dev/) 19
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL database, Row Level Security, Supabase Auth via `@supabase/ssr` & `@supabase/supabase-js`)
- **Code Quality & Formatting**: ESLint 9 & Prettier

---

## 🔐 Environment Variables (`.env.example`)

Create a `.env.local` (or `.env`) file in the root directory and provide your Supabase credentials.

```env
# Supabase Project URL (found in Project Settings -> API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

# Supabase Publishable / Anon API Key (found in Project Settings -> API)
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-or-anon-key
```

### Where to get these keys:
1. Log in to [Supabase](https://supabase.com/dashboard).
2. Create or select your project.
3. Navigate to **Project Settings** > **API**.
4. Copy the **Project URL** and the **anon / public** API key.

---

## 🚀 How to Install and Run Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.18.0 or v20+ recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js)
- A [Supabase](https://supabase.com/) project (hosted or local via Supabase CLI)

### Step-by-Step Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/Heritage-Site-Crowd-Management-System.git
   cd Heritage-Site-Crowd-Management-System
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and paste your Supabase URL and publishable key.

4. **Set up the database**:
   Run the schema migrations and seed data in your Supabase SQL Editor:
   - Run the migration file: `supabase/migrations/20260326120000_create_heritage_tourism_tables.sql`
   - (Optional) Seed initial heritage monuments and slots: `supabase/seed.sql`

5. **Start the development server**:
   ```bash
   npm run dev
   ```

6. **Open in browser**:
   Visit [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📦 Database Schema Overview

The database utilizes the following core tables:
- `heritage_destinations`: Site metadata, history, operational hours, UNESCO status, and daily capacity.
- `heritage_ticket_types`: Pricing, audience categories (Indian, foreign, student, child), and inclusions.
- `heritage_time_slots`: Capacity limits, booked tickets, and expected crowd density per time window.
- `heritage_entry_stats`: Real-time gate metrics and current visitor headcounts.

---

## 🛠️ Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server with Turbopack |
| `npm run build` | Builds the application for production |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs ESLint to check for code issues |
| `npm run format` | Formats the codebase using Prettier |
