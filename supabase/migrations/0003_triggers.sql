-- =============================================================
-- Triggers that make the app feel alive:
--   - Auto-maintain video likes/comments/shares counters
--   - Auto-create notifications when someone likes/comments/follows
--   - Auto-bump profile likes_count when their videos get liked
--   - Init wallet with 100 starter coins on signup
-- =============================================================

-- ── 1. videos.likes_count ↑↓ ──
create or replace function public.bump_video_likes()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (tg_op = 'INSERT') then
    update public.videos set likes_count = likes_count + 1 where id = new.video_id;
    -- Bump video owner's profile.likes_count
    update public.profiles
      set likes_count = likes_count + 1
      where id = (select user_id from public.videos where id = new.video_id);
  elsif (tg_op = 'DELETE') then
    update public.videos set likes_count = greatest(likes_count - 1, 0) where id = old.video_id;
    update public.profiles
      set likes_count = greatest(likes_count - 1, 0)
      where id = (select user_id from public.videos where id = old.video_id);
  end if;
  return null;
end; $$;

drop trigger if exists tr_likes_count on public.likes;
create trigger tr_likes_count after insert or delete on public.likes
  for each row execute function public.bump_video_likes();

-- ── 2. videos.comments_count ↑↓ ──
create or replace function public.bump_video_comments()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (tg_op = 'INSERT') then
    update public.videos set comments_count = comments_count + 1 where id = new.video_id;
  elsif (tg_op = 'DELETE') then
    update public.videos set comments_count = greatest(comments_count - 1, 0) where id = old.video_id;
  end if;
  return null;
end; $$;

drop trigger if exists tr_comments_count on public.comments;
create trigger tr_comments_count after insert or delete on public.comments
  for each row execute function public.bump_video_comments();

-- ── 3. Notification on LIKE — notify video owner ──
create or replace function public.notify_on_like()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  owner_id uuid;
begin
  select user_id into owner_id from public.videos where id = new.video_id;
  if owner_id is null or owner_id = new.user_id then return new; end if;
  insert into public.notifications (user_id, actor_id, type, payload)
  values (owner_id, new.user_id, 'like', jsonb_build_object('video_id', new.video_id));
  return new;
end; $$;

drop trigger if exists tr_notify_like on public.likes;
create trigger tr_notify_like after insert on public.likes
  for each row execute function public.notify_on_like();

-- ── 4. Notification on COMMENT — notify video owner ──
create or replace function public.notify_on_comment()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  owner_id uuid;
begin
  select user_id into owner_id from public.videos where id = new.video_id;
  if owner_id is null or owner_id = new.user_id then return new; end if;
  insert into public.notifications (user_id, actor_id, type, payload)
  values (owner_id, new.user_id, 'comment', jsonb_build_object('video_id', new.video_id, 'comment_id', new.id, 'text', left(new.text, 80)));
  return new;
end; $$;

drop trigger if exists tr_notify_comment on public.comments;
create trigger tr_notify_comment after insert on public.comments
  for each row execute function public.notify_on_comment();

-- ── 5. Notification on FOLLOW ──
create or replace function public.notify_on_follow()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.notifications (user_id, actor_id, type, payload)
  values (new.followed_id, new.follower_id, 'follow', '{}'::jsonb);
  return new;
end; $$;

drop trigger if exists tr_notify_follow on public.follows;
create trigger tr_notify_follow after insert on public.follows
  for each row execute function public.notify_on_follow();

-- ── 6. Notification on MESSAGE — notify other chat members ──
create or replace function public.notify_on_message()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.notifications (user_id, actor_id, type, payload)
  select cm.user_id, new.from_user_id, 'message',
    jsonb_build_object('chat_id', new.chat_id, 'message_id', new.id, 'text', left(coalesce(new.text, ''), 60))
  from public.chat_members cm
  where cm.chat_id = new.chat_id and cm.user_id <> new.from_user_id;
  return new;
end; $$;

drop trigger if exists tr_notify_message on public.messages;
create trigger tr_notify_message after insert on public.messages
  for each row execute function public.notify_on_message();

-- ── 7. Wallet init — 100 starter coins for new signups ──
create or replace function public.init_wallet()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.wallets (user_id, balance) values (new.id, 100)
  on conflict (user_id) do nothing;
  -- only add the welcome ledger entry if wallet was just created
  if found then
    insert into public.wallet_transactions (user_id, type, amount, description)
    values (new.id, 'topup', 100, 'هدية الترحيب');
  end if;
  return new;
end; $$;

drop trigger if exists tr_init_wallet on public.profiles;
create trigger tr_init_wallet after insert on public.profiles
  for each row execute function public.init_wallet();

-- ── 8. Backfill: existing users get a wallet too (run once) ──
insert into public.wallets (user_id, balance)
select id, 100 from public.profiles
where id not in (select user_id from public.wallets)
on conflict do nothing;

-- ── 9. Backfill: recompute video counts from existing likes/comments ──
update public.videos v
set likes_count = (select count(*) from public.likes l where l.video_id = v.id),
    comments_count = (select count(*) from public.comments c where c.video_id = v.id);

-- ── 10. Realtime publication — make sure key tables emit change events ──
-- (Run this if your replication settings don't already include them.)
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    -- Add tables idempotently
    perform 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'messages';
    if not found then
      execute 'alter publication supabase_realtime add table public.messages';
    end if;
    perform 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'user_locations';
    if not found then
      execute 'alter publication supabase_realtime add table public.user_locations';
    end if;
    perform 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'notifications';
    if not found then
      execute 'alter publication supabase_realtime add table public.notifications';
    end if;
    perform 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'live_streams';
    if not found then
      execute 'alter publication supabase_realtime add table public.live_streams';
    end if;
  end if;
end $$;
