# Holy Cross College Admission Survey App

A complete mobile-first admission survey web application built with Next.js, Tailwind CSS, Framer Motion, and Supabase.

## Tech Stack
- Frontend: Next.js 15 (App Router), Tailwind CSS v4, Framer Motion, Recharts
- Backend/Database: Supabase (PostgreSQL)
- Deployment: Ready for Vercel

## Project Structure
- `src/app/page.tsx` - Main Landing Page & Survey
- `src/app/admin/page.tsx` - Admin Dashboard
- `src/app/thank-you/page.tsx` - Thank You / Success Page
- `src/components/SurveyForm.tsx` - Multi-step animated survey logic
- `src/app/api/submit/route.ts` - Form submission API
- `src/app/api/admin/data/route.ts` - Admin data API
- `src/app/api/admin/login/route.ts` - Admin login API
- `database.sql` - Supabase Database Schema

## Setup Instructions

### 1. Environment Variables
Copy `.env.local.example` to `.env.local` or edit `.env.local` directly:
```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_majdebJTI4TiIwpkoRSXMQ_yi9DP943
ADMIN_PASSWORD=admin123
```

### 2. Supabase Setup
1. Create a new project on [Supabase](https://supabase.com).
2. Go to the SQL Editor and run the SQL code provided in `database.sql`.
3. Copy your project URL and Anon Key to `.env.local`.

### 3. Running Locally
```bash
npm install
npm run dev
```

### 4. Deployment to Vercel
1. Push the code to GitHub.
2. Import the repository in Vercel.
3. Add the Environment Variables in the Vercel dashboard.
4. Deploy!

## Features
- **Mobile-First Design:** Fully responsive, modern, and youthful UI.
- **Auto-Save:** Form progress is automatically saved to local storage so students don't lose their data if they accidentally close the tab.
- **Admin Dashboard:** Password-protected dashboard with charts and CSV export functionality.
- **WhatsApp Integration:** Floating contact button.
