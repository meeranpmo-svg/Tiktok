-- ============================================================
-- 0006_self_service.sql
-- Wires up the remaining user-facing stubs:
--   * profiles.is_private flag (toggle from Settings)
--   * self-service wallet topup / withdraw
--   * self-service account deletion
-- Apply this in Supabase SQL editor AFTER 0001..0005.
-- ============================================================

-- ── Private-account flag ──
alter table public.profiles
  add column if not exists is_private boolean not null default false;

-- ============================================================
-- self_topup(amount, package) → credits the caller's wallet
-- In production this would be called from a Stripe / Apple-IAP
-- webhook after payment confirmation. For now it's exposed to the
-- client so the demo "Top-up" sheet actually credits coins.
-- ============================================================
create or replace function public.self_topup(
  p_amount  integer,
  p_package text default null
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_me uuid := auth.uid();
  v_new_balance integer;
begin
  if v_me is null then raise exception 'must be signed in'; end if;
  if p_amount is null or p_amount <= 0 then raise exception 'amount must be positive'; end if;
  if p_amount > 100000 then raise exception 'amount too large for a single topup'; end if;

  insert into public.wallets (user_id, balance) values (v_me, p_amount)
    on conflict (user_id) do update
    set balance = public.wallets.balance + p_amount,
        updated_at = now();

  select balance into v_new_balance from public.wallets where user_id = v_me;

  insert into public.wallet_transactions (user_id, type, amount, description)
  values (v_me, 'topup', p_amount, coalesce('شحن — ' || p_package, 'شحن'));

  return v_new_balance;
end;
$$;

grant execute on function public.self_topup(integer, text) to authenticated;

-- ============================================================
-- self_withdraw(amount, method) → debits caller's wallet,
-- records a withdrawal ledger row. (Real payout happens off-system.)
-- ============================================================
create or replace function public.self_withdraw(
  p_amount integer,
  p_method text default null
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_me uuid := auth.uid();
  v_balance integer;
begin
  if v_me is null then raise exception 'must be signed in'; end if;
  if p_amount is null or p_amount <= 0 then raise exception 'amount must be positive'; end if;

  select balance into v_balance from public.wallets where user_id = v_me;
  if coalesce(v_balance, 0) < p_amount then raise exception 'الرصيد غير كافٍ'; end if;
  if p_amount < 100 then raise exception 'الحد الأدنى للسحب 100 عملة'; end if;

  update public.wallets set balance = balance - p_amount, updated_at = now() where user_id = v_me;
  select balance into v_balance from public.wallets where user_id = v_me;

  insert into public.wallet_transactions (user_id, type, amount, description)
  values (v_me, 'withdrawal', p_amount, coalesce('سحب — ' || p_method, 'سحب'));

  return v_balance;
end;
$$;

grant execute on function public.self_withdraw(integer, text) to authenticated;

-- ============================================================
-- self_delete_account() → permanently deletes the caller's profile
-- and everything that cascades from it (videos, comments, wallet, etc.)
-- The auth.users row is NOT deleted here — that requires the service-
-- role key. The user is effectively dead in-app, but their auth login
-- remains until an admin / Edge Function clears it. (Future work.)
-- ============================================================
create or replace function public.self_delete_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare v_me uuid := auth.uid();
begin
  if v_me is null then raise exception 'must be signed in'; end if;
  delete from public.profiles where id = v_me;
end;
$$;

grant execute on function public.self_delete_account() to authenticated;
