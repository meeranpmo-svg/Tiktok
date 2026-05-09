# Setup Checklist — make every feature work

Follow this in order. Each step takes 30 seconds. After all checks ✅, the app is fully functional end-to-end.

## ⚙️ Step 1 — Run all 3 SQL migrations in Supabase

Go to https://supabase.com/dashboard/project/qnzgxihlrwanywndcmpf/sql/new and run each in order:

1. **Schema** (creates 18 tables, RLS, storage):
   ```
   https://raw.githubusercontent.com/meeranpmo-svg/Tiktok/main/supabase/migrations/0001_init.sql
   ```

2. **Admin layer** (is_admin flag, admin policies, ads table, admin_stats RPC):
   ```
   https://raw.githubusercontent.com/meeranpmo-svg/Tiktok/main/supabase/migrations/0002_admin.sql
   ```

3. **Triggers** (auto-counts, notifications, starter wallet, realtime publication):
   ```
   https://raw.githubusercontent.com/meeranpmo-svg/Tiktok/main/supabase/migrations/0003_triggers.sql
   ```

For each: open the URL → Ctrl+A → Ctrl+C → paste in SQL Editor → **Run**. Each should say "Success".

✅ **Verify:** in Table Editor you should see **18 tables** including `profiles`, `videos`, `chats`, `messages`, `wallets`, `gifts`, `gift_transactions`, `live_streams`, `reports`, `admin_logs`, `ads`.

---

## 🔑 Step 2 — Configure Supabase Auth

Go to **Authentication → Providers → Email** at https://supabase.com/dashboard/project/qnzgxihlrwanywndcmpf/auth/providers

- ✅ **"Confirm email" OFF** for fast testing (or ON for production)
- ✅ Email provider toggle: ON

Then **Authentication → URL Configuration** at https://supabase.com/dashboard/project/qnzgxihlrwanywndcmpf/auth/url-configuration

- ✅ **Site URL:** `https://tiktok-nu-eosin.vercel.app`
- ✅ **Redirect URLs:** add `https://tiktok-nu-eosin.vercel.app/**`

---

## 📡 Step 3 — Enable Realtime publication

Migration 0003 already adds these but verify:

Go to https://supabase.com/dashboard/project/qnzgxihlrwanywndcmpf/database/replication → **`supabase_realtime`** publication. Make sure these tables show ✅:

- `messages`
- `user_locations`
- `notifications`
- `live_streams`

If any are missing, click the publication → toggle them on → save.

---

## 👤 Step 4 — Sign up + make yourself admin

1. Go to https://tiktok-nu-eosin.vercel.app
2. **إنشاء حساب جديد** with a real email + password (8+ chars)
3. After landing in the home feed, **don't log out** — stay signed in
4. Run this in SQL Editor (replace `YOUR_EMAIL`):
   ```sql
   update public.profiles
   set is_admin = true
   where id = (select id from auth.users where email = 'YOUR_EMAIL');
   ```
5. Refresh the app

✅ **Verify:** profile → menu → Settings → scroll down, see purple **"الإدارة"** section.

---

## 🧪 Step 5 — End-to-end smoke test

Now everything should work. Quick checks:

| Try | Expected |
| --- | --- |
| **Edit profile** → change name + upload avatar | Saves, shows in profile |
| **Tap +** in bottom nav → record a video → publish | Video appears in your profile + home feed |
| **Like your video** from another browser/incognito as a 2nd user | Counter goes up; notifications panel of original user gets an entry |
| **Comment** | Same — notification appears |
| **Follow another user** | Their `followers_count` goes up + they get a notification |
| **Open Inbox → New DM** → search for the other user → message | Both windows see message instantly (realtime) |
| **Map** → allow location | Pin shows; if other user enabled location too you'll see them too |
| **Wallet** | Shows 100 coins (welcome bonus from migration 0003) |
| **Live → start** → another user watches → sends a gift | Gift transaction logged, sender wallet -X, receiver wallet +X |
| **Admin panel** (`/admin`) → Users tab | Real list of all users, ban/admin toggles work |

---

## What's still NOT in this app (and why)

| Feature | Status | What to add |
| --- | --- | --- |
| **Real video broadcast for Live** | ❌ | Needs paid Agora/MUX/LiveKit (~$3/1000 min). DB row creates but no actual streaming. |
| **Push notifications** | ❌ | Needs VAPID keys + service worker registration + iOS APNs. ~1 hour wiring. |
| **Recommendation algorithm** | ❌ Chronological only | Needs ML pipeline or simple "videos liked by users similar to you" SQL. |
| **Hashtag search** | ❌ | No hashtag table. Easy to add. |
| **Video transcoding / compression** | ❌ | Files uploaded as-is. Add Supabase Edge Function with ffmpeg or use Cloudinary/MUX. |
| **Content moderation (auto)** | ❌ | Manual reports work. Auto needs e.g. AWS Rekognition or Sightengine. |
| **SMS OTP** | ❌ | Needs Twilio. Email OTP works. |
| **Sign in with Apple / Google** | ❌ | Easy to add via Supabase Auth providers. |
| **App Store / Play Store** | ⚠️ Capacitor configs ready | Apple Developer ($99/yr) + 4 GitHub secrets. See `BUILD_IOS.md`. |

---

## URLs

| Where | Link |
| --- | --- |
| Mobile app | https://tiktok-nu-eosin.vercel.app |
| Admin dashboard | https://tiktok-nu-eosin.vercel.app/admin |
| Supabase | https://supabase.com/dashboard/project/qnzgxihlrwanywndcmpf |
| GitHub repo | https://github.com/meeranpmo-svg/Tiktok |
| Vercel | https://vercel.com/dashboard |
