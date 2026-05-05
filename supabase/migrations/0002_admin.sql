-- =============================================================
-- Admin layer: is_admin flag, admin RLS policies, ads table
-- =============================================================

-- ── 1. is_admin flag on profiles ──
alter table public.profiles add column if not exists is_admin boolean not null default false;
alter table public.profiles add column if not exists banned_until timestamptz;
create index if not exists idx_profiles_admin on public.profiles (is_admin) where is_admin = true;

-- Helper function: is current user an admin?
create or replace function public.is_admin()
returns boolean language sql security definer set search_path = public stable as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

-- ── 2. Admin RLS policies — bypass owner-only restrictions ──

-- profiles: admins can update anyone (for ban / role change)
drop policy if exists "admins update any profile" on public.profiles;
create policy "admins update any profile" on public.profiles for update to authenticated using (public.is_admin());

drop policy if exists "admins delete any profile" on public.profiles;
create policy "admins delete any profile" on public.profiles for delete to authenticated using (public.is_admin());

-- videos: admins can read drafts + delete anyone's
drop policy if exists "admins read all videos" on public.videos;
create policy "admins read all videos" on public.videos for select to authenticated using (public.is_admin());
drop policy if exists "admins delete any video" on public.videos;
create policy "admins delete any video" on public.videos for delete to authenticated using (public.is_admin());
drop policy if exists "admins update any video" on public.videos;
create policy "admins update any video" on public.videos for update to authenticated using (public.is_admin());

-- comments: admins delete any
drop policy if exists "admins delete any comment" on public.comments;
create policy "admins delete any comment" on public.comments for delete to authenticated using (public.is_admin());

-- reports: admins read & resolve all
drop policy if exists "admins read all reports" on public.reports;
create policy "admins read all reports" on public.reports for select to authenticated using (public.is_admin());
drop policy if exists "admins update any report" on public.reports;
create policy "admins update any report" on public.reports for update to authenticated using (public.is_admin());

-- chats / chat_members / messages: admins read all (for moderation)
drop policy if exists "admins read all chats" on public.chats;
create policy "admins read all chats" on public.chats for select to authenticated using (public.is_admin());
drop policy if exists "admins read all members" on public.chat_members;
create policy "admins read all members" on public.chat_members for select to authenticated using (public.is_admin());
drop policy if exists "admins read all messages" on public.messages;
create policy "admins read all messages" on public.messages for select to authenticated using (public.is_admin());
drop policy if exists "admins delete any message" on public.messages;
create policy "admins delete any message" on public.messages for delete to authenticated using (public.is_admin());

-- live_streams: admins update / delete (force-end)
drop policy if exists "admins update any live" on public.live_streams;
create policy "admins update any live" on public.live_streams for update to authenticated using (public.is_admin());

-- admin_logs: admins read all + insert their own
drop policy if exists "admins read logs" on public.admin_logs;
create policy "admins read logs" on public.admin_logs for select to authenticated using (public.is_admin());
drop policy if exists "admins insert logs" on public.admin_logs;
create policy "admins insert logs" on public.admin_logs for insert to authenticated with check (public.is_admin() and auth.uid() = admin_id);

-- notifications: admins read all (for moderation insight)
drop policy if exists "admins read all notifs" on public.notifications;
create policy "admins read all notifs" on public.notifications for select to authenticated using (public.is_admin());
drop policy if exists "admins insert notifs" on public.notifications;
create policy "admins insert notifs" on public.notifications for insert to authenticated with check (public.is_admin() or auth.uid() = actor_id);

-- wallets / wallet_transactions / gift_transactions: admins read all
drop policy if exists "admins read all wallets" on public.wallets;
create policy "admins read all wallets" on public.wallets for select to authenticated using (public.is_admin());
drop policy if exists "admins read all wallet_tx" on public.wallet_transactions;
create policy "admins read all wallet_tx" on public.wallet_transactions for select to authenticated using (public.is_admin());
drop policy if exists "admins read all gift_tx" on public.gift_transactions;
create policy "admins read all gift_tx" on public.gift_transactions for select to authenticated using (public.is_admin());

-- ── 3. Ads table (campaigns) ──
create table if not exists public.ads (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  body          text,
  link          text,
  image_url     text,
  target        jsonb default '{}',          -- { ages, regions, gender }
  start_at      timestamptz,
  end_at        timestamptz,
  impressions   integer not null default 0,
  clicks        integer not null default 0,
  status        text not null default 'active' check (status in ('active', 'paused', 'ended')),
  created_by    uuid references public.profiles (id),
  created_at    timestamptz not null default now()
);
alter table public.ads enable row level security;

drop policy if exists "ads read public" on public.ads;
create policy "ads read public" on public.ads for select to authenticated, anon using (status = 'active' and (start_at is null or start_at <= now()) and (end_at is null or end_at >= now()));
drop policy if exists "ads admin all" on public.ads;
create policy "ads admin all" on public.ads for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ── 4. Auto-log admin actions trigger (best effort) ──
-- Whenever a row is updated by an admin, log it. Apps can also insert directly.
-- (Skipped for brevity; admin app inserts directly into admin_logs.)

-- ── 5. Make first signup an admin (optional convenience) ──
-- If you want the very first user to be an admin automatically, run this once:
--   update public.profiles set is_admin = true
--     where id = (select id from public.profiles order by created_at limit 1);
-- Or: update by handle/email:
--   update public.profiles set is_admin = true where handle = 'your_username';

-- ── 6. Stat helpers (for the dashboard) ──
create or replace function public.admin_stats()
returns json language sql security definer set search_path = public stable as $$
  select json_build_object(
    'total_users',     (select count(*) from public.profiles),
    'users_today',     (select count(*) from public.profiles where created_at::date = current_date),
    'total_videos',    (select count(*) from public.videos where is_draft = false),
    'videos_today',    (select count(*) from public.videos where is_draft = false and created_at::date = current_date),
    'pending_reports', (select count(*) from public.reports where status = 'pending'),
    'live_now',        (select count(*) from public.live_streams where status = 'live'),
    'gifts_today',     (select count(*) from public.gift_transactions where created_at::date = current_date),
    'gift_revenue_today', (select coalesce(sum(amount), 0) from public.gift_transactions where created_at::date = current_date)
  );
$$;
revoke all on function public.admin_stats from public, anon;
grant execute on function public.admin_stats to authenticated;
