-- ============================================================
-- PhytoNova-AI — Initial Schema Migration
-- Run this in the Supabase SQL Editor (or via Supabase CLI).
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------
-- Profiles
-- ----------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid unique not null references auth.users(id) on delete cascade,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz not null default now()
);

-- RLS
alter table public.profiles enable row level security;
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = user_id);
create policy "Users can upsert own profile"
  on public.profiles for insert with check (auth.uid() = user_id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = user_id);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------
-- Detections
-- ----------------------------------------------------------
create table if not exists public.detections (
  id          uuid not null default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade,
  image_url   text,
  disease     text,
  confidence  numeric,
  treatment   text,
  created_at  timestamptz not null default now()
);

-- RLS
alter table public.detections enable row level security;
create policy "Users can read own detections"
  on public.detections for select using (auth.uid() = user_id);
create policy "Users can insert own detections"
  on public.detections for insert with check (auth.uid() = user_id);
create policy "Users can delete own detections"
  on public.detections for delete using (auth.uid() = user_id);

-- ----------------------------------------------------------
-- Posts (Community)
-- ----------------------------------------------------------
create table if not exists public.posts (
  id          uuid not null default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade,
  title       text not null,
  content     text not null,
  image_url   text,
  created_at  timestamptz not null default now()
);

-- RLS
alter table public.posts enable row level security;
create policy "Anyone can read posts"
  on public.posts for select using (true);
create policy "Authenticated users can create posts"
  on public.posts for insert with check (auth.uid() = user_id);
create policy "Users can delete own posts"
  on public.posts for delete using (auth.uid() = user_id);

-- ----------------------------------------------------------
-- Comments
-- ----------------------------------------------------------
create table if not exists public.comments (
  id          uuid not null default gen_random_uuid() primary key,
  post_id     uuid references public.posts(id) on delete cascade,
  user_id     uuid references auth.users(id) on delete cascade,
  content     text not null,
  created_at  timestamptz not null default now()
);

-- RLS
alter table public.comments enable row level security;
create policy "Anyone can read comments"
  on public.comments for select using (true);
create policy "Authenticated users can create comments"
  on public.comments for insert with check (auth.uid() = user_id);
create policy "Users can delete own comments"
  on public.comments for delete using (auth.uid() = user_id);

-- ----------------------------------------------------------
-- Likes
-- ----------------------------------------------------------
create table if not exists public.likes (
  id          uuid not null default gen_random_uuid() primary key,
  post_id     uuid references public.posts(id) on delete cascade,
  user_id     uuid references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique(post_id, user_id)
);

-- RLS
alter table public.likes enable row level security;
create policy "Anyone can read likes"
  on public.likes for select using (true);
create policy "Authenticated users can like posts"
  on public.likes for insert with check (auth.uid() = user_id);
create policy "Users can unlike posts"
  on public.likes for delete using (auth.uid() = user_id);

-- ----------------------------------------------------------
-- Storage Bucket (images)
-- Note: You can also create this via the Supabase Dashboard
-- under Storage > New Bucket > name: "images", public: true.
-- ----------------------------------------------------------
-- Uncomment the line below if you prefer SQL-only setup:
-- insert into storage.buckets (id, name, public) values ('images', 'images', true)
-- on conflict (id) do nothing;