/* === Mobile router === */
(function () {
  const app = document.getElementById('app');

  const PUBLIC_PATHS = ['/', '/login', '/register', '/otp', '/forgot', '/reset'];

  const routes = [
    { p: /^\/?$/, v: () => Views.splash() },
    { p: /^\/login$/, v: () => Views.login() },
    { p: /^\/register$/, v: () => Views.register() },
    { p: /^\/otp$/, v: () => Views.otp() },
    { p: /^\/forgot$/, v: () => Views.forgot() },
    { p: /^\/reset$/, v: () => Views.reset() },
    { p: /^\/home$/, v: q => Views.home({ q }) },
    { p: /^\/discover$/, v: () => Views.discover() },
    { p: /^\/create$/, v: () => Views.create() },
    { p: /^\/camera$/, v: () => Views.camera() },
    { p: /^\/upload$/, v: () => Views.editVideo() },
    { p: /^\/edit-video$/, v: () => Views.editVideo() },
    { p: /^\/publish$/, v: () => Views.publish() },
    { p: /^\/inbox$/, v: () => Views.inbox() },
    { p: /^\/chat-new\/(group|dm)$/, v: (q, m) => Views.chatNew({ id: m[1] }) },
    { p: /^\/chat\/(.+)$/, v: (q, m) => Views.chat({ id: m[1] }) },
    { p: /^\/profile$/, v: () => Views.profile() },
    { p: /^\/profile\/edit$/, v: () => Views.editProfile() },
    { p: /^\/profile\/(.+)$/, v: (q, m) => Views.userProfile({ id: m[1] }) },
    { p: /^\/list\/(followers|following)$/, v: (q, m) => Views.userList({ id: m[1] }) },
    { p: /^\/notifications$/, v: () => Views.notifications() },
    { p: /^\/comments\/(.+)$/, v: (q, m) => Views.comments({ id: m[1] }) },
    { p: /^\/share(?:\/(.+))?$/, v: (q, m) => Views.share({ id: m[1] }) },
    { p: /^\/live\/start$/, v: () => Views.liveStart() },
    { p: /^\/live\/host-list$/, v: () => Views.liveHostList() },
    { p: /^\/live\/(.+)$/, v: (q, m) => Views.live({ id: m[1] }) },
    { p: /^\/map$/, v: q => Views.map({ q }) },
    { p: /^\/wallet$/, v: () => Views.wallet() },
    { p: /^\/settings$/, v: () => Views.settings() },
    { p: /^\/blocked$/, v: () => Views.blockedUsers() },
  ];

  // Restore the user's dark-mode preference from localStorage as early as possible
  try { if (localStorage.getItem('tt-theme') === 'dark') document.body.classList.add('dark'); } catch (e) {}

  function parseHash() {
    const raw = (location.hash || '#/').slice(1) || '/';
    const [path, qs] = raw.split('?');
    const q = {};
    if (qs) qs.split('&').forEach(pair => {
      const [k, v] = pair.split('=');
      if (k) q[decodeURIComponent(k)] = v ? decodeURIComponent(v) : '';
    });
    return { path, q };
  }

  let sessionChecked = false;
  let session = null;

  async function render() {
    const { path, q } = parseHash();

    // Auth guard: gate non-public paths until we know whether the user is signed in
    if (!sessionChecked) {
      try { session = await window.SB.getSession(); } catch (e) { session = null; }
      sessionChecked = true;
    }

    if (!session && !PUBLIC_PATHS.includes(path)) {
      location.hash = '#/login';
      return;
    }
    // If already signed-in and at the splash → skip straight to home
    if (session && path === '/') {
      location.hash = '#/home';
      return;
    }

    for (const r of routes) {
      const m = path.match(r.p);
      if (m) {
        try {
          app.innerHTML = '';
          const node = r.v(q, m);
          if (node) app.appendChild(node);
          // Translate the freshly-rendered view to English when that language is active
          try { if (window.I18N) window.I18N.apply(app); } catch (e) {}
          window.scrollTo(0, 0);
        } catch (e) {
          console.error('render error', e);
          app.innerHTML = '<div style="padding:24px">خطأ في التحميل: ' + e.message + '</div>';
        }
        return;
      }
    }
    location.hash = '#/';
  }

  // Listen for sign-in / sign-out events from Supabase to keep `session` fresh
  if (window.SB) {
    window.SB.onAuthChange((event, sess) => {
      session = sess;
      sessionChecked = true;
      if (event === 'SIGNED_OUT') location.hash = '#/login';
    });
  }

  window.addEventListener('hashchange', render);
  // Language switch re-renders the current view from its Arabic source
  window.addEventListener('tt-rerender', render);
  window.addEventListener('DOMContentLoaded', render);
  if (document.readyState !== 'loading') render();

  /* ── Floating Help button (visible on every screen, opens a support sheet) ── */
  const SUPPORT_EMAIL = 'support@tenthtone.app';
  const SUPPORT_WA = '966500000000'; // TODO: replace with the real WhatsApp support number

  function injectHelp() {
    if (!document.body || document.getElementById('tt-help-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'tt-help-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Help / مساعدة');
    btn.innerHTML = '<span style="font-size:16px;font-weight:800">؟</span><span>مساعدة</span>';
    btn.style.cssText = [
      'position:fixed', 'bottom:calc(env(safe-area-inset-bottom,0px) + 78px)', 'left:max(14px, calc(50% - 201px))',
      'z-index:2147483000', 'display:flex', 'align-items:center', 'gap:6px',
      'padding:9px 14px', 'border:none', 'border-radius:999px',
      'background:rgba(108,43,217,.95)', 'color:#fff',
      'font:700 13px/1 Cairo,system-ui,-apple-system,sans-serif',
      'box-shadow:0 4px 16px rgba(108,43,217,.45)', 'cursor:pointer',
    ].join(';');
    btn.addEventListener('click', openHelpSheet);
    document.body.appendChild(btn);
    try { if (window.I18N) window.I18N.apply(btn); } catch (e) {}
    updateHelpVisibility();
  }

  // Hide the floating button on the full-screen feed (it collides with the
  // video action rail there); the Profile header has a "؟" Help icon for those.
  function updateHelpVisibility() {
    const btn = document.getElementById('tt-help-btn');
    if (!btn) return;
    const p = parseHash().path;
    const hide = p === '/' || p === '/home' || p === '/camera' || p.indexOf('/live') === 0;
    btn.style.display = hide ? 'none' : 'flex';
  }
  window.addEventListener('hashchange', updateHelpVisibility);

  // Expose so other screens (e.g. Profile header) can open the support sheet.
  window.ttHelp = openHelpSheet;

  function openHelpSheet() {
    if (document.getElementById('tt-help-sheet')) return;
    const dir = document.documentElement.getAttribute('dir') || 'rtl';
    const ov = document.createElement('div');
    ov.id = 'tt-help-sheet';
    ov.style.cssText = 'position:fixed;inset:0;z-index:2147483600;background:rgba(0,0,0,.45);display:flex;align-items:flex-end;justify-content:center';
    const sheet = document.createElement('div');
    sheet.dir = dir;
    sheet.style.cssText = 'background:#fff;width:100%;max-width:480px;border-radius:18px 18px 0 0;padding:16px 16px calc(20px + env(safe-area-inset-bottom,0px));font-family:Cairo,system-ui,sans-serif';
    sheet.innerHTML = '<div style="width:42px;height:4px;background:#ddd;border-radius:2px;margin:0 auto 14px"></div>'
      + '<h3 style="margin:0 0 12px;font-size:16px;color:#1a1a2e">كيف يمكننا مساعدتك؟</h3>';
    const item = (label, onClick) => {
      const b = document.createElement('button');
      b.textContent = label;
      b.style.cssText = 'display:block;width:100%;text-align:start;padding:14px;margin:6px 0;border:1px solid #eee;border-radius:12px;background:#fafafa;font:600 14px Cairo,system-ui,sans-serif;color:#1a1a2e;cursor:pointer';
      b.onclick = () => { onClick(); close(); };
      return b;
    };
    sheet.appendChild(item('الدعم عبر واتساب', () => window.open('https://wa.me/' + SUPPORT_WA + '?text=' + encodeURIComponent('مرحبًا، أحتاج مساعدة في تطبيق Tenth Tone'), '_blank')));
    sheet.appendChild(item('تواصل معنا', () => { window.location.href = 'mailto:' + SUPPORT_EMAIL; }));
    sheet.appendChild(item('الإبلاغ عن مشكلة', () => { window.location.href = 'mailto:' + SUPPORT_EMAIL + '?subject=' + encodeURIComponent('بلاغ عن مشكلة — Tenth Tone'); }));
    ov.appendChild(sheet);
    document.body.appendChild(ov);
    try { if (window.I18N) window.I18N.apply(ov); } catch (e) {}
    function close() { ov.remove(); }
    ov.addEventListener('click', (e) => { if (e.target === ov) close(); });
  }

  if (document.body) injectHelp();
  else window.addEventListener('DOMContentLoaded', injectHelp);
})();
