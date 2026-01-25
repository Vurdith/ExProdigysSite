-- Create a table for leads (captured from forms)
create table public.leads (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  email text not null,
  name text,
  company text,
  status text default 'new'::text, -- 'new', 'abandoned', 'contacted'
  source text default 'website'::text,
  abandoned_at timestamp with time zone -- For exit-intent partial captures
);

-- Create a table for newsletter subscribers
create table public.subscribers (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  email text not null unique,
  status text default 'active'::text
);

-- Enable Row Level Security
alter table public.leads enable row level security;
alter table public.subscribers enable row level security;

-- Allow public inserts (anyone can submit a form)
create policy "Allow public inserts for leads"
  on public.leads for insert
  with check (true);

create policy "Allow public inserts for subscribers"
  on public.subscribers for insert
  with check (true);

-- Only service role (admin) can select/view data
-- No select policy implies only admins can read by default if RLS is enabled and no select policy exists.
