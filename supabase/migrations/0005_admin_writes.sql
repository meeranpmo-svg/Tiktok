-- ============================================================
-- 0005_admin_writes.sql
-- Lets admins edit other users' profiles, adjust wallet balances,
-- write wallet_transactions ledger entries, and soft-delete users.
-- Apply this in Supabase SQL editor *after* 0001..0004.
-- ============================================================

-- ── profiles: admins can update any row (name, handle, bio, verified, etc.) ──
drop policy if exists "admins update profiles" on public.profiles;
create policy "admins update profiles" on public.profiles
  for update to authenticated
  using (public.is_admin());

-- ── profiles: admins can delete (cascade removes videos, wallet, etc.) ──
drop policy if exists "admins delete profiles" on public.profiles;
create policy "admins delete profiles" on public.profiles
  for delete to authenticated
  using (public.is_admin());

-- ── wallets: admins can upsert/update any balance ──
drop policy if exists "admins update wallets" on public.wallets;
create policy "admins update wallets" on public.wallets
  for update to authenticated
  using (public.is_admin());

drop policy if exists "admins insert wallets" on public.wallets;
create policy "admins insert wallets" on public.wallets
  for insert to authenticated
  with check (public.is_admin());

-- ── wallet_transactions: admins can write ledger entries for any user ──
drop policy if exists "admins insert wallet_tx" on public.wallet_transactions;
create policy "admins insert wallet_tx" on public.wallet_transactions
  for insert to authenticated
  with check (public.is_admin());

-- ============================================================
-- admin_adjust_wallet(user_id, delta, reason)
-- One atomic call that:
--   1. upserts wallets.balance += delta  (clamped to 0)
--   2. writes a wallet_transactions ledger row
--   3. writes an admin_logs row
-- ============================================================
create or replace function public.admin_adjust_wallet(
  p_user_id uuid,
  p_delta   integer,
  p_reason  text default null
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin uuid := auth.uid();
  v_new_balance integer;
  v_type text;
begin
  if not public.is_admin() then
    raise exception 'forbidden: admin only';
  end if;

  -- Upsert wallet row & adjust balance (never below 0)
  insert into public.wallets (user_id, balance) values (p_user_id, greatest(0, p_delta))
    on conflict (user_id) do update
    set balance = greatest(0, public.wallets.balance + p_delta),
        updated_at = now();

  select balance into v_new_balance from public.wallets where user_id = p_user_id;

  -- Pick a ledger type that matches the existing check constraint
  v_type := case when p_delta >= 0 then 'topup' else 'withdrawal' end;

  insert into public.wallet_transactions (user_id, type, amount, description)
  values (p_user_id, v_type, abs(p_delta), coalesce(p_reason, 'تعديل من المشرف'));

  insert into public.admin_logs (admin_id, action, target_type, target_id, payload)
  values (v_admin, 'adjust_wallet', 'user', p_user_id,
          jsonb_build_object('delta', p_delta, 'reason', p_reason, 'new_balance', v_new_balance));

  return v_new_balance;
end;
$$;

grant execute on function public.admin_adjust_wallet(uuid, integer, text) to authenticated;

-- ============================================================
-- admin_user_detail(user_id) → single JSON blob with everything
-- the admin "edit user" modal needs (profile + wallet + counts).
-- ============================================================
create or replace function public.admin_user_detail(p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare v_result jsonb;
begin
  if not public.is_admin() then
    raise exception 'forbidden: admin only';
  end if;

  select jsonb_build_object(
    'profile', to_jsonb(p),
    'wallet',  (select to_jsonb(w) from public.wallets w where w.user_id = p.id),
    'video_count', (select count(*) from public.videos v where v.user_id = p.id),
    'recent_videos', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', v.id, 'thumbnail', v.thumbnail, 'video_url', v.video_url,
        'description', v.description, 'likes_count', v.likes_count,
        'views_count', v.views_count, 'created_at', v.created_at,
        'is_draft', v.is_draft
      ) order by v.created_at desc), '[]'::jsonb)
      from (select * from public.videos where user_id = p.id order by created_at desc limit 6) v
    ),
    'recent_logs', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'action', al.action, 'created_at', al.created_at, 'payload', al.payload,
        'admin', (select jsonb_build_object('name', ap.name, 'handle', ap.handle)
                  from public.profiles ap where ap.id = al.admin_id)
      ) order by al.created_at desc), '[]'::jsonb)
      from (select * from public.admin_logs where target_type='user' and target_id = p.id
            order by created_at desc limit 8) al
    )
  )
  into v_result
  from public.profiles p
  where p.id = p_user_id;

  return v_result;
end;
$$;

grant execute on function public.admin_user_detail(uuid) to authenticated;
