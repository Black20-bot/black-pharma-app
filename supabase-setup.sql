-- Run this in your Supabase SQL editor
-- Go to: supabase.com/dashboard/project/hgyykbhxedqnoxfgzawj/sql

create table if not exists purchases (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  email text,
  stripe_session_id text unique,
  amount integer,
  purchased_at timestamptz default now()
);

-- Allow the app to read/write purchases
alter table purchases enable row level security;

create policy "Users can read own purchases"
  on purchases for select
  using (auth.uid() = user_id or email = auth.email());

create policy "Service role can insert purchases"
  on purchases for insert
  with check (true);
