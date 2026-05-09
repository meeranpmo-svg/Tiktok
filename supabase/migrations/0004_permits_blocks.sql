-- =============================================================
-- Location-permit + blocks + live privacy RLS filter
-- =============================================================

-- ── 1. location_permits — A asks B for location; B approves/denies ──
create table if not exists public.location_permits (
  id              uuid primary key default uuid_generate_v4(),
  requester_id    uuid not null references public.profiles (id) on delete cascade,
  target_id       uuid not null references public.profiles (id) on delete cascade,
  status          text not null default 'pending' check (status in ('pending', 'approved', 'denied', 'revoked')),
  created_at      timestamptz not null default now(),
  responded_at    timestamptz,
  expires_at      timestamptz,
  unique (requester_id, target_id),
  check (requester_id <> target_id)
);
create index if not exists idx_location_permits_target on public.location_permits (target_id, status);
create index if not exists idx_location_permits_requester on public.location_permits (requester_id, status);

alter table public.location_permits enable row level security;

drop policy if exists "permits read involved" on public.location_permits;
create policy "permits read involved" on public.location_permits for select to authenticated using (
  auth.uid() = requester_id or auth.uid() = target_id
);

drop policy if exists "permits create as requester" on public.location_permits;
create policy "permits create as requester" on public.location_permits for insert to authenticated with check (
  auth.uid() = requester_id
);

drop policy if exists "permits update as target" on public.location_permits;
create policy "permits update as target" on public.location_permits for update to authenticated using (
  auth.uid() = target_id or auth.uid() = requester_id
);

-- Notification when a permit is created or status changes
create or replace function public.notify_on_permit()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (tg_op = 'INSERT') then
    -- Notify the target that someone wants their location
    insert into public.notifications (user_id, actor_id, type, payload)
    values (new.target_id, new.requester_id, 'system',
      jsonb_build_object('kind', 'location_request', 'permit_id', new.id));
  elsif (tg_op = 'UPDATE' and old.status <> new.status) then
    -- Notify the requester of the response
    insert into public.notifications (user_id, actor_id, type, payload)
    values (new.requester_id, new.target_id, 'system',
      jsonb_build_object('kind', 'location_' || new.status, 'permit_id', new.id));
  end if;
  return new;
end; $$;

drop trigger if exists tr_permit_notify on public.location_permits;
create trigger tr_permit_notify after insert or update of status on public.location_permits
  for each row execute function public.notify_on_permit();

-- Update user_locations RLS to ALSO allow approved permit holders
drop policy if exists "locations read" on public.user_locations;
create policy "locations read" on public.user_locations for select to authenticated using (
  visibility = 'public'
  or user_id = auth.uid()
  or (
    visibility = 'friends'
    and exists (select 1 from public.follows where follower_id = auth.uid() and followed_id = user_id)
  )
  or exists (
    select 1 from public.location_permits lp
    where lp.target_id = user_locations.user_id
      and lp.requester_id = auth.uid()
      and lp.status = 'approved'
      and (lp.expires_at is null or lp.expires_at > now())
  )
);

-- ── 2. blocks table (so users can block each other) ──
create table if not exists public.blocks (
  blocker_id uuid not null references public.profiles (id) on delete cascade,
  blocked_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);
alter table public.blocks enable row level security;

drop policy if exists "blocks read own" on public.blocks;
create policy "blocks read own" on public.blocks for select to authenticated using (auth.uid() = blocker_id);
drop policy if exists "blocks insert own" on public.blocks;
create policy "blocks insert own" on public.blocks for insert to authenticated with check (auth.uid() = blocker_id);
drop policy if exists "blocks delete own" on public.blocks;
create policy "blocks delete own" on public.blocks for delete to authenticated using (auth.uid() = blocker_id);

-- ── 3. Add privacy column to live_streams (matches video privacy concept) ──
alter table public.live_streams add column if not exists privacy text not null default 'public'
  check (privacy in ('public', 'friends', 'private'));

-- Update live_streams read policy to respect privacy
drop policy if exists "live read" on public.live_streams;
create policy "live read" on public.live_streams for select to authenticated, anon using (
  status <> 'banned' and (
    privacy = 'public'
    or host_id = auth.uid()
    or (
      privacy = 'friends'
      and exists (select 1 from public.follows where follower_id = auth.uid() and followed_id = live_streams.host_id)
    )
  )
);

-- ── 4. Add background_image to live_streams (for "background only" live mode) ──
alter table public.live_streams add column if not exists background_image text;
alter table public.live_streams add column if not exists mode text not null default 'camera'
  check (mode in ('camera', 'background', 'audio_only'));

-- ── 5. Push tokens for future push notifications ──
create table if not exists public.push_tokens (
  user_id     uuid references public.profiles (id) on delete cascade,
  token       text not null,
  platform    text not null check (platform in ('web', 'ios', 'android')),
  created_at  timestamptz not null default now(),
  primary key (user_id, token)
);
alter table public.push_tokens enable row level security;

drop policy if exists "push tokens own" on public.push_tokens;
create policy "push tokens own" on public.push_tokens for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
