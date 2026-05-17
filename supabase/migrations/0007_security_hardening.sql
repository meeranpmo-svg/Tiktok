-- ============================================================
-- 0007_security_hardening.sql
-- Closes critical security gaps from the pre-App-Store review:
--   * Vuln 1: revoke self-topup / self-withdraw from authenticated
--   * Defense-in-depth: server-side regex check on profile name/handle
--     so HTML/control chars cannot reach the DB even if a client-side
--     escape is bypassed
-- Apply this in Supabase SQL editor AFTER 0001..0006.
-- ============================================================

-- ── 1. Lock down the placeholder payment RPCs ──
-- These functions were created in 0006 as a demo placeholder. Without
-- a payment-webhook signature check, granting EXECUTE to authenticated
-- lets any signed-up user mint coins and then withdraw real money.
-- We revoke the grants here. Demo top-ups should now go through the
-- admin panel (admin_adjust_wallet), which is gated by is_admin().
-- Production launch requires a Supabase Edge Function that verifies a
-- Stripe / Apple-IAP receipt and then calls self_topup with the
-- service-role key.
revoke execute on function public.self_topup(integer, text)      from authenticated;
revoke execute on function public.self_withdraw(integer, text)   from authenticated;
revoke execute on function public.self_topup(integer, text)      from anon;
revoke execute on function public.self_withdraw(integer, text)   from anon;

-- The functions remain SECURITY DEFINER for the service-role call path,
-- but no longer reachable from the client.

-- ── 2. Server-side regex check on profile name and handle ──
-- Belt-and-braces against stored XSS via the profiles table. Even if a
-- new client-side innerHTML template is added in the future, the DB
-- now refuses to store HTML/control characters in these fields.
-- Tolerant of Arabic, Latin, digits, and a small set of punctuation.

-- Drop any prior trigger from earlier runs of this migration so we can
-- recreate it idempotently.
drop trigger if exists tr_validate_profile on public.profiles;
drop function if exists public.validate_profile() cascade;

create or replace function public.validate_profile()
returns trigger
language plpgsql
as $$
begin
  -- Strip NULs and control chars from name / handle / bio
  if new.name is not null then
    new.name := regexp_replace(new.name, '[\x00-\x1F\x7F]', '', 'g');
    if length(new.name) > 60 then
      raise exception 'profile.name too long (max 60)';
    end if;
    -- Reject literal HTML tag delimiters in name
    if new.name ~ '[<>]' then
      raise exception 'profile.name contains illegal characters';
    end if;
  end if;

  if new.handle is not null then
    -- Handles: lowercase letters, digits, underscore, dot. 3-30 chars.
    new.handle := lower(new.handle);
    if not (new.handle ~ '^[a-z0-9._]{3,30}$') then
      raise exception 'profile.handle must be 3-30 chars of lowercase letters, digits, dot or underscore';
    end if;
  end if;

  if new.bio is not null then
    new.bio := regexp_replace(new.bio, '[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]', '', 'g');
    if length(new.bio) > 280 then
      raise exception 'profile.bio too long (max 280)';
    end if;
    if new.bio ~ '<\s*script' then
      raise exception 'profile.bio contains illegal markup';
    end if;
  end if;

  if new.avatar_url is not null and new.avatar_url <> '' then
    -- Only allow http(s) URLs. Block javascript:, data:, file:, etc.
    if not (new.avatar_url ~* '^https?://') then
      raise exception 'profile.avatar_url must be an http(s) URL';
    end if;
    if length(new.avatar_url) > 500 then
      raise exception 'profile.avatar_url too long';
    end if;
  end if;

  return new;
end;
$$;

create trigger tr_validate_profile
  before insert or update of name, handle, bio, avatar_url on public.profiles
  for each row execute function public.validate_profile();

-- ── 3. Clean up any pre-existing rows that would violate the new rules ──
-- (Don't fail the migration if these don't apply — just sanitize.)
update public.profiles
   set name = regexp_replace(coalesce(name, ''), '[<>\x00-\x1F\x7F]', '', 'g')
 where name is not null and (name ~ '[<>\x00-\x1F\x7F]' or length(name) > 60);

update public.profiles
   set bio = regexp_replace(coalesce(bio, ''), '[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]', '', 'g')
 where bio is not null and (bio ~ '<\s*script' or length(bio) > 280);

-- handles that don't match the strict regex get auto-quoted into a safe form
-- (this is a one-time fixup; users are prompted to set a real handle on next login)
update public.profiles
   set handle = regexp_replace(lower(coalesce(handle, '')), '[^a-z0-9._]', '', 'g')
 where handle is not null and not (lower(handle) ~ '^[a-z0-9._]{3,30}$');
