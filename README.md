# Black Pharma Career Playbook — Web App

Interactive course built with Next.js 14, Supabase, and Stripe.

## Setup

### 1. Create `.env.local` from the example
```
cp .env.local.example .env.local
```

Fill in these values:
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from Supabase dashboard → Settings → API
- `STRIPE_SECRET_KEY` — from Stripe dashboard → Developers → API keys (secret key, starts sk_test_)
- `STRIPE_WEBHOOK_SECRET` — from Stripe dashboard → Developers → Webhooks (after creating webhook)
- `NEXT_PUBLIC_SITE_URL` — your Vercel URL once deployed

### 2. Set up Supabase database
1. Go to supabase.com/dashboard/project/hgyykbhxedqnoxfgzawj/sql
2. Paste the contents of `supabase-setup.sql` and click Run

### 3. Set up Stripe webhook
1. Go to Stripe dashboard → Developers → Webhooks
2. Add endpoint: `https://your-app.vercel.app/api/webhook`
3. Select event: `checkout.session.completed`
4. Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`

### 4. Deploy to Vercel
1. Push this folder to your GitHub repo
2. Go to vercel.com → Import project → select your repo
3. Add all env variables in Vercel dashboard → Settings → Environment Variables
4. Deploy

### 5. Add the PDF
Place your `BlackPharma_Career_Playbook.pdf` in the `/public` folder so users can download it.

## Local development
```
npm install
npm run dev
```

Open http://localhost:3000
