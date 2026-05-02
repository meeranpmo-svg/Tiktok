/* === Admin dashboard SPA === */
(function () {
  const { el, esc, fmt, toast, icons, svg } = window.H;
  const DB = window.DB;

  const root = document.getElementById('admin');

  const NAV = [
    { sec: 'الرئيسية', items: [
      { k: 'dashboard', l: 'الرئيسية', i: 'home', go: '#/dashboard' },
      { k: 'analytics', l: 'الإحصائيات', i: 'sparkle', go: '#/analytics' },
    ]},
    { sec: 'المحتوى', items: [
      { k: 'users', l: 'إدارة الحسابات', i: 'user', go: '#/users' },
      { k: 'videos', l: 'الفيديوهات', i: 'video', go: '#/videos' },
      { k: 'comments', l: 'التعليقات', i: 'comment', go: '#/comments' },
      { k: 'reports', l: 'البلاغات', i: 'flag', go: '#/reports' },
      { k: 'live', l: 'البث المباشر', i: 'eye', go: '#/live' },
    ]},
    { sec: 'النقدية', items: [
      { k: 'wallet', l: 'الهدايا والمحفظة', i: 'gift', go: '#/wallet' },
      { k: 'ads', l: 'الإعلانات', i: 'image', go: '#/ads' },
    ]},
    { sec: 'النظام', items: [
      { k: 'notif', l: 'الإشعارات', i: 'bell', go: '#/notifications' },
      { k: 'employees', l: 'الموظفون', i: 'user', go: '#/employees' },
      { k: 'roles', l: 'الأدوار والصلاحيات', i: 'lock', go: '#/roles' },
      { k: 'logs', l: 'سجل الأنشطة', i: 'eye', go: '#/logs' },
      { k: 'location', l: 'الموقع الجغرافي', i: 'map', go: '#/location' },
      { k: 'settings', l: 'الإعدادات', i: 'settings', go: '#/settings' },
    ]},
  ];

  const me = { name: 'المشرف الرئيسي', role: 'Super Admin', avatar: 'https://i.pravatar.cc/100?u=admin' };

  // ===== Login =====
  function viewLogin() {
    const r = el('div', { class: 'adm-login' });
    const card = el('div', { class: 'card' });
    card.appendChild(el('div', { class: 'mark' }, 'T'));
    card.appendChild(el('h1', {}, 'لوحة التحكم'));
    card.appendChild(el('p', {}, 'سجّل دخولك للوصول إلى لوحة الإدارة'));
    const u = el('input', { class: 'input', placeholder: 'البريد الإلكتروني', value: 'admin@tenthtone.com', style: { width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border)', marginBottom: '12px', fontSize: '14px', outline: 0 } });
    const p = el('input', { class: 'input', type: 'password', placeholder: 'كلمة المرور', value: '••••••••', style: { width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border)', marginBottom: '12px', fontSize: '14px', outline: 0 } });
    card.appendChild(u);
    card.appendChild(p);
    card.appendChild(el('button', { class: 'btn', style: { width: '100%' }, onclick: () => { location.hash = '#/dashboard'; } }, 'تسجيل الدخول'));
    r.appendChild(card);
    return r;
  }

  // ===== Shell =====
  function buildShell(active, content, breadcrumbs) {
    const shell = el('div', { class: 'adm-shell' });
    // sidebar
    const side = el('aside', { class: 'adm-sidebar' });
    side.appendChild(el('div', { class: 'adm-brand' }, [
      el('div', { class: 'mark' }, 'T'),
      el('div', {}, [el('div', { class: 'name' }, 'Tenth Tone'), el('div', { class: 'sub' }, 'Admin Panel')]),
    ]));
    NAV.forEach(g => {
      side.appendChild(el('div', { class: 'adm-section-title' }, g.sec));
      const nav = el('nav', { class: 'adm-nav' });
      g.items.forEach(it => {
        nav.appendChild(el('a', { href: it.go, class: 'adm-nav' + (it.k === active ? ' active' : ''), onclick: () => closeSidebar() }, [
          svg(it.i),
          el('span', {}, it.l),
        ]));
      });
      // re-class active
      nav.querySelectorAll('a').forEach((a, i) => {
        if (g.items[i].k === active) a.classList.add('active');
      });
      side.appendChild(nav);
    });
    shell.appendChild(side);

    // main
    const main = el('main', { class: 'adm-main' });
    const top = el('header', { class: 'adm-topbar' });
    top.appendChild(el('button', { class: 'icon-btn', html: icons.menu, onclick: toggleSidebar, style: { display: 'none' }, id: 'sidebar-toggle' }));
    top.appendChild(el('div', { class: 'search' }, [el('input', { placeholder: 'بحث سريع...' })]));
    top.appendChild(el('span', { class: 'spacer' }));
    top.appendChild(el('button', { class: 'icon-btn', html: icons.bell }, [el('span', { class: 'badge' }, '5')]));
    top.appendChild(el('button', { class: 'icon-btn', html: icons.settings, onclick: () => location.hash = '#/settings' }));
    top.appendChild(el('div', { class: 'adm-user' }, [
      el('div', { class: 'avatar' }, [Object.assign(document.createElement('img'), { src: me.avatar })]),
      el('div', {}, [el('div', { class: 'name' }, me.name), el('div', { class: 'role' }, me.role)]),
      svg('chevD', { style: { width: '14px', height: '14px' } }),
    ]));
    main.appendChild(top);
    main.appendChild(content);
    shell.appendChild(main);

    function toggleSidebar() { side.classList.toggle('open'); }
    function closeSidebar() { side.classList.remove('open'); }
    return shell;
  }

  // ===== Reusable bits =====
  function pageHeader(title, sub, actions) {
    return el('div', { class: 'adm-page-header' }, [
      el('div', {}, [el('h1', {}, title), sub ? el('div', { class: 'sub' }, sub) : null].filter(Boolean)),
      el('div', { class: 'actions' }, actions || []),
    ]);
  }
  function statCard({ label, value, delta, icon, tone = 'primary' }) {
    const tones = { primary: ['var(--primary-soft)', 'var(--primary)'], info: ['var(--info-soft)', 'var(--info)'], success: ['var(--success-soft)', 'var(--success)'], warn: ['var(--warn-soft)', 'var(--warn)'], danger: ['var(--danger-soft)', 'var(--danger)'] };
    const [bg, fg] = tones[tone];
    return el('div', { class: 'stat-card' }, [
      el('div', { class: 'icon-pill', style: { background: bg, color: fg }, html: icons[icon] || icons.sparkle }),
      el('div', { class: 'label' }, label),
      el('div', { class: 'value' }, value),
      delta ? el('span', { class: 'delta ' + (delta.startsWith('-') ? 'down' : 'up') }, delta) : null,
    ].filter(Boolean));
  }

  function chartBars(data) {
    const max = Math.max.apply(null, data.map(d => d.v)) || 1;
    const wrap = el('div', { class: 'chart-wrap' });
    const bars = el('div', { class: 'chart-bars' });
    data.forEach(d => bars.appendChild(el('div', { class: 'bar', style: { height: (d.v / max * 100) + '%' } }, [
      el('span', { class: 'v' }, fmt(d.v)),
      el('span', { class: 'l' }, d.l),
    ])));
    wrap.appendChild(bars);
    return wrap;
  }

  function chartLine(values, labels) {
    const max = Math.max.apply(null, values) * 1.1;
    const min = 0;
    const W = 600, H = 180;
    const xStep = W / (values.length - 1);
    const points = values.map((v, i) => [i * xStep, H - ((v - min) / (max - min)) * H]);
    const path = points.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
    const area = path + ` L${W},${H} L0,${H} Z`;
    const wrap = el('div', { class: 'chart-line' });
    wrap.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
      <defs><linearGradient id="grad-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#6c2bd9" stop-opacity="0.5"/><stop offset="100%" stop-color="#6c2bd9" stop-opacity="0"/></linearGradient></defs>
      <path class="area" d="${area}"/>
      <path class="line" d="${path}"/>
      ${points.map(p => `<circle class="dot" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3"/>`).join('')}
    </svg>`;
    return wrap;
  }

  function donut(parts) {
    const total = parts.reduce((s, p) => s + p.v, 0) || 1;
    let acc = 0;
    const r = 60, c = 80;
    const segs = parts.map(p => {
      const start = (acc / total) * 360;
      acc += p.v;
      const end = (acc / total) * 360;
      const large = end - start > 180 ? 1 : 0;
      const sx = c + r * Math.cos((start - 90) * Math.PI / 180);
      const sy = c + r * Math.sin((start - 90) * Math.PI / 180);
      const ex = c + r * Math.cos((end - 90) * Math.PI / 180);
      const ey = c + r * Math.sin((end - 90) * Math.PI / 180);
      return `<path d="M${c},${c} L${sx.toFixed(1)},${sy.toFixed(1)} A${r},${r} 0 ${large} 1 ${ex.toFixed(1)},${ey.toFixed(1)} Z" fill="${p.c}"/>`;
    }).join('');
    const w = el('div');
    w.innerHTML = `<svg class="donut" viewBox="0 0 160 160"><g>${segs}</g><circle cx="${c}" cy="${c}" r="40" fill="#fff"/></svg>`;
    return w;
  }

  function modalAdm(title, body, footer) {
    const bd = el('div', { class: 'adm-modal-bd', onclick: (e) => { if (e.target === bd) close(); } });
    const m = el('div', { class: 'adm-modal' });
    m.appendChild(el('div', { class: 'adm-modal-h' }, [
      el('h3', {}, title),
      el('button', { class: 'btn-icon btn-ghost', html: icons.x, onclick: () => close() }),
    ]));
    m.appendChild(el('div', { class: 'adm-modal-b' }, body));
    if (footer) m.appendChild(el('div', { class: 'adm-modal-f' }, footer));
    bd.appendChild(m);
    document.body.appendChild(bd);
    function close() { bd.remove(); }
    return close;
  }

  // ===== Pages =====
  function viewDashboard() {
    const page = el('div', { class: 'adm-page' });
    page.appendChild(pageHeader('لوحة التحكم', 'نظرة عامة على المنصة'));
    const stats = el('div', { class: 'stats-grid' });
    stats.appendChild(statCard({ label: 'مستخدمون نشطون اليوم', value: '12,480', delta: '+8.2%', icon: 'user', tone: 'primary' }));
    stats.appendChild(statCard({ label: 'فيديوهات اليوم', value: '3,217', delta: '+3.1%', icon: 'video', tone: 'info' }));
    stats.appendChild(statCard({ label: 'تفاعل (إعجاب/تعليق)', value: '1.4M', delta: '+12.6%', icon: 'heart', tone: 'success' }));
    stats.appendChild(statCard({ label: 'بلاغات قيد المراجعة', value: '47', delta: '-5%', icon: 'flag', tone: 'danger' }));
    page.appendChild(stats);

    // 2-col: line chart + donut
    const grid = el('div', { class: 'grid-2' });
    const left = el('div', { class: 'card' });
    left.appendChild(el('div', { class: 'card-h' }, [el('h3', {}, 'النشاط خلال الأسبوع'), el('div', { class: 'actions' }, [el('button', { class: 'btn btn-secondary btn-sm' }, '7 أيام'), el('button', { class: 'btn-ghost btn-sm' }, '30 يوم')])]));
    left.appendChild(chartLine([1200, 1800, 1400, 2100, 1700, 2500, 2200], ['س', 'أ', 'إ', 'ث', 'ر', 'خ', 'ج']));
    left.appendChild(el('div', { style: { display: 'flex', justifyContent: 'space-around', color: 'var(--muted)', fontSize: '12px' } },
      ['السبت','الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة'].map(d => el('span', {}, d))));
    grid.appendChild(left);

    const right = el('div', { class: 'card' });
    right.appendChild(el('div', { class: 'card-h' }, [el('h3', {}, 'توزيع المحتوى')]));
    right.appendChild(donut([
      { v: 45, c: '#6c2bd9' }, { v: 28, c: '#8b5bff' }, { v: 17, c: '#ec4899' }, { v: 10, c: '#f59e0b' }
    ]));
    right.appendChild(el('div', { style: { padding: '14px 4px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' } }, [
      el('div', { style: { display: 'flex', justifyContent: 'space-between' } }, [el('span', {}, [el('span', { style: { width: '10px', height: '10px', background: '#6c2bd9', display: 'inline-block', marginEnd: '6px', borderRadius: '50%' } }), document.createTextNode(' ترفيه')]), el('strong', {}, '45%')]),
      el('div', { style: { display: 'flex', justifyContent: 'space-between' } }, [el('span', {}, [el('span', { style: { width: '10px', height: '10px', background: '#8b5bff', display: 'inline-block', marginEnd: '6px', borderRadius: '50%' } }), document.createTextNode(' طبخ')]), el('strong', {}, '28%')]),
      el('div', { style: { display: 'flex', justifyContent: 'space-between' } }, [el('span', {}, [el('span', { style: { width: '10px', height: '10px', background: '#ec4899', display: 'inline-block', marginEnd: '6px', borderRadius: '50%' } }), document.createTextNode(' رياضة')]), el('strong', {}, '17%')]),
      el('div', { style: { display: 'flex', justifyContent: 'space-between' } }, [el('span', {}, [el('span', { style: { width: '10px', height: '10px', background: '#f59e0b', display: 'inline-block', marginEnd: '6px', borderRadius: '50%' } }), document.createTextNode(' أخرى')]), el('strong', {}, '10%')]),
    ]));
    grid.appendChild(right);
    page.appendChild(grid);

    // bottom: top users + activity
    const grid2 = el('div', { class: 'grid-2', style: { marginTop: '14px' } });
    const topU = el('div', { class: 'card' });
    topU.appendChild(el('div', { class: 'card-h' }, [el('h3', {}, 'أعلى المستخدمين تفاعلًا'), el('a', { class: 'btn-ghost btn-sm', href: '#/users' }, 'عرض الكل')]));
    const list = el('div', { class: 'top-list' });
    DB.users.slice(0, 6).forEach((u, i) => list.appendChild(el('div', { class: 'top-item' }, [
      el('div', { class: 'rank' }, '#' + (i + 1)),
      el('div', { class: 'av' }, [Object.assign(document.createElement('img'), { src: u.avatar })]),
      el('div', { class: 'body' }, [el('div', { class: 'ttl' }, u.name), el('div', { class: 'sub' }, u.handle)]),
      el('div', { class: 'num' }, fmt(u.followers) + ' متابع'),
    ])));
    topU.appendChild(list);
    grid2.appendChild(topU);

    const act = el('div', { class: 'card' });
    act.appendChild(el('div', { class: 'card-h' }, [el('h3', {}, 'آخر النشاطات'), el('a', { class: 'btn-ghost btn-sm', href: '#/logs' }, 'سجل كامل')]));
    const al = el('div', { class: 'activity-list' });
    [
      { i: 'flag', t: 'بلاغ جديد عن فيديو', u: 'سارة', tm: 'منذ 5د', tone: 'danger' },
      { i: 'user', t: 'تسجيل مستخدم جديد', u: 'يوسف', tm: 'منذ 12د', tone: 'success' },
      { i: 'gift', t: 'هدية بقيمة 500 من علي إلى ريم', u: '', tm: 'منذ 30د', tone: 'warn' },
      { i: 'video', t: 'حذف فيديو مخالف', u: 'المشرف', tm: 'منذ ساعة', tone: 'info' },
      { i: 'lock', t: 'تعديل صلاحيات الدور "مشرف محتوى"', u: 'أنت', tm: 'أمس', tone: 'primary' },
    ].forEach(a => al.appendChild(el('div', { class: 'activity-item' }, [
      el('div', { class: 'ai-icon', style: { background: `var(--${a.tone}-soft)`, color: `var(--${a.tone})` }, html: icons[a.i] }),
      el('div', { class: 'ai-text' }, [el('b', {}, a.u), document.createTextNode(' ' + a.t)]),
      el('div', { class: 'ai-time' }, a.tm),
    ])));
    act.appendChild(al);
    grid2.appendChild(act);
    page.appendChild(grid2);

    return page;
  }

  // ===== Users =====
  function viewUsers() {
    const page = el('div', { class: 'adm-page' });
    page.appendChild(pageHeader('إدارة الحسابات', 'عرض المستخدمين، البحث، الحظر، التعديل', [
      el('button', { class: 'btn btn-secondary' }, [svg('download'), document.createTextNode(' تصدير')]),
      el('button', { class: 'btn', onclick: () => openUserModal() }, [svg('plus'), document.createTextNode(' إضافة مستخدم')]),
    ]));
    const tableWrap = el('div', { class: 'table-wrap' });
    tableWrap.appendChild(el('div', { class: 'table-toolbar' }, [
      el('div', { class: 'search', style: { flex: 1 } }, [el('input', { placeholder: 'بحث بالاسم، البريد، أو رقم الهاتف' })]),
      el('select', {}, [el('option', {}, 'كل الحالات'), el('option', {}, 'نشط'), el('option', {}, 'محظور'), el('option', {}, 'موقوف')]),
      el('select', {}, [el('option', {}, 'كل الأدوار'), el('option', {}, 'مستخدم'), el('option', {}, 'مشرف')]),
    ]));
    const table = el('table', { class: 'table' });
    table.innerHTML = `<thead><tr>
      <th><input type="checkbox" class="checkbox"/></th>
      <th>المستخدم</th>
      <th>البريد</th>
      <th>المتابعون</th>
      <th>الفيديوهات</th>
      <th>الحالة</th>
      <th>تاريخ الانضمام</th>
      <th></th>
    </tr></thead>`;
    const tb = el('tbody');
    DB.users.forEach((u, i) => {
      const status = i === 2 ? { l: 'محظور', c: 'danger' } : i === 5 ? { l: 'موقوف', c: 'warn' } : { l: 'نشط', c: 'success' };
      const tr = el('tr');
      tr.innerHTML = `
        <td><input type="checkbox" class="checkbox"/></td>
        <td><div class="user-cell"><div class="av"><img src="${u.avatar}"></div><div><div class="nm">${u.name}${u.verified ? ' ✓' : ''}</div><div class="em">${u.handle}</div></div></div></td>
        <td>${u.handle.replace('@', '')}@example.com</td>
        <td>${fmt(u.followers)}</td>
        <td>${15 + i * 7}</td>
        <td><span class="badge ${status.c}">${status.l}</span></td>
        <td>2024/${String(((i % 12) + 1)).padStart(2, '0')}/${String(((i % 27) + 1)).padStart(2, '0')}</td>
        <td><div class="row-actions">
          <button class="btn-icon btn-ghost" title="تعديل" data-act="edit"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
          <button class="btn-icon btn-ghost" title="حظر" data-act="block"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg></button>
          <button class="btn-icon btn-ghost" title="إعادة تعيين كلمة المرور" data-act="reset"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg></button>
        </div></td>`;
      tr.querySelector('[data-act="edit"]').onclick = () => openUserModal(u);
      tr.querySelector('[data-act="block"]').onclick = () => {
        if (confirm('هل تريد حظر هذا الحساب؟')) toast('تم حظر ' + u.name);
      };
      tr.querySelector('[data-act="reset"]').onclick = () => toast('تم إرسال كلمة مرور جديدة لـ ' + u.name);
      tb.appendChild(tr);
    });
    table.appendChild(tb);
    tableWrap.appendChild(table);
    tableWrap.appendChild(pagination(DB.users.length, 10));
    page.appendChild(tableWrap);
    return page;

    function openUserModal(u) {
      const fields = el('div', {});
      fields.innerHTML = `
        <div class="field"><label>الاسم</label><input value="${u ? u.name : ''}"/></div>
        <div class="field"><label>اسم المستخدم</label><input value="${u ? u.handle.replace('@','') : ''}"/></div>
        <div class="field-row">
          <div class="field"><label>البريد الإلكتروني</label><input type="email" value="${u ? u.handle.replace('@','') + '@example.com' : ''}"/></div>
          <div class="field"><label>رقم الهاتف</label><input value="+9665${(Math.random()*1e8|0).toString().padStart(8,'0')}"/></div>
        </div>
        <div class="field"><label>الحالة</label><select><option>نشط</option><option>محظور</option><option>موقوف</option></select></div>
      `;
      const close = modalAdm(u ? 'تعديل المستخدم' : 'إضافة مستخدم', fields, [
        el('button', { class: 'btn btn-secondary', onclick: () => close() }, 'إلغاء'),
        el('button', { class: 'btn', onclick: () => { close(); toast('تم الحفظ'); } }, 'حفظ'),
      ]);
    }
  }

  function pagination(total, perPage = 10) {
    const pages = Math.max(1, Math.ceil(total / perPage));
    const wrap = el('div', { class: 'pagination' });
    wrap.appendChild(el('span', {}, `عرض 1-${Math.min(perPage, total)} من ${total}`));
    const pgs = el('div', { class: 'pages' });
    for (let i = 1; i <= Math.min(pages, 5); i++) {
      pgs.appendChild(el('button', { class: 'pg' + (i === 1 ? ' active' : '') }, String(i)));
    }
    if (pages > 5) pgs.appendChild(el('span', { class: 'muted', style: { padding: '4px' } }, '...'));
    wrap.appendChild(pgs);
    return wrap;
  }

  // ===== Videos =====
  function viewVideos() {
    const page = el('div', { class: 'adm-page' });
    page.appendChild(pageHeader('الفيديوهات', 'مراجعة المحتوى المنشور', [
      el('button', { class: 'btn btn-secondary' }, [svg('download'), document.createTextNode(' تصدير')]),
    ]));
    const tabs = el('div', { class: 'tabs' });
    ['الكل', 'منشور', 'قيد المراجعة', 'محذوف'].forEach((l, i) => tabs.appendChild(el('button', { class: 'tab' + (i === 0 ? ' active' : ''), onclick: e => { tabs.querySelectorAll('.tab').forEach(t => t.classList.remove('active')); e.currentTarget.classList.add('active'); } }, l)));
    page.appendChild(tabs);
    const tableWrap = el('div', { class: 'table-wrap' });
    tableWrap.appendChild(el('div', { class: 'table-toolbar' }, [
      el('div', { class: 'search', style: { flex: 1 } }, [el('input', { placeholder: 'بحث بالعنوان أو الناشر' })]),
      el('select', {}, [el('option', {}, 'الترتيب: الأحدث'), el('option', {}, 'الأكثر مشاهدة'), el('option', {}, 'الأعلى تفاعلًا')]),
    ]));
    const table = el('table', { class: 'table' });
    table.innerHTML = `<thead><tr>
      <th>الفيديو</th><th>الناشر</th><th>المشاهدات</th><th>الإعجابات</th><th>التعليقات</th><th>الحالة</th><th></th>
    </tr></thead>`;
    const tb = el('tbody');
    DB.videos.forEach((v, i) => {
      const status = i === 3 ? ['warn', 'قيد المراجعة'] : i === 7 ? ['danger', 'محذوف'] : ['success', 'منشور'];
      const tr = el('tr');
      tr.innerHTML = `
        <td><div style="display:flex;gap:10px;align-items:center"><div class="vthumb"><img src="${v.bg}"/></div><div><div style="font-weight:700;font-size:13px">${v.desc.slice(0, 40)}…</div><div class="muted" style="font-size:11.5px">${v.music}</div></div></div></td>
        <td>${v.user.name}</td>
        <td>${fmt(v.likes * 12)}</td>
        <td>${fmt(v.likes)}</td>
        <td>${v.comments}</td>
        <td><span class="badge ${status[0]}">${status[1]}</span></td>
        <td><div class="row-actions">
          <button class="btn-icon btn-ghost" title="عرض"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
          <button class="btn-icon btn-ghost" title="حذف" data-act="del"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"/></svg></button>
        </div></td>`;
      tr.querySelector('[data-act="del"]').onclick = () => { if (confirm('حذف هذا الفيديو؟')) toast('تم الحذف'); };
      tb.appendChild(tr);
    });
    table.appendChild(tb);
    tableWrap.appendChild(table);
    tableWrap.appendChild(pagination(DB.videos.length, 10));
    page.appendChild(tableWrap);
    return page;
  }

  // ===== Comments =====
  function viewComments() {
    const page = el('div', { class: 'adm-page' });
    page.appendChild(pageHeader('التعليقات', 'مراجعة وحذف التعليقات المخالفة'));
    const tableWrap = el('div', { class: 'table-wrap' });
    tableWrap.appendChild(el('div', { class: 'table-toolbar' }, [
      el('div', { class: 'search', style: { flex: 1 } }, [el('input', { placeholder: 'بحث في التعليقات' })]),
      el('select', {}, [el('option', {}, 'الكل'), el('option', {}, 'مبلَّغ عنها'), el('option', {}, 'محذوفة')]),
    ]));
    const table = el('table', { class: 'table' });
    table.innerHTML = `<thead><tr><th>المستخدم</th><th>التعليق</th><th>الفيديو</th><th>البلاغات</th><th>التاريخ</th><th></th></tr></thead>`;
    const tb = el('tbody');
    const sample = ['شيء جميل! 🔥', 'سلوك مخالف', 'تعليق إعلاني خارجي', 'كلام محرج', 'محتوى مكرر', 'محتوى مخالف للقانون', 'محبة لك يا صديقي', 'أعجبني!', 'أين هذا المكان؟', 'شكراً 🌹'];
    DB.users.slice(0, 10).forEach((u, i) => {
      const reps = i % 3 === 0 ? (i + 2) : 0;
      const tr = el('tr');
      tr.innerHTML = `
        <td><div class="user-cell"><div class="av"><img src="${u.avatar}"></div><div><div class="nm">${u.name}</div></div></div></td>
        <td>${sample[i]}</td>
        <td><a class="muted" href="#/videos">فيديو #${i + 1}</a></td>
        <td>${reps ? `<span class="badge danger">${reps}</span>` : '<span class="muted">-</span>'}</td>
        <td>منذ ${i + 2} ساعة</td>
        <td><div class="row-actions">
          <button class="btn-icon btn-ghost" title="حذف"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"/></svg></button>
          <button class="btn-icon btn-ghost" title="تجاهل"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></button>
        </div></td>`;
      tb.appendChild(tr);
    });
    table.appendChild(tb);
    tableWrap.appendChild(table);
    page.appendChild(tableWrap);
    return page;
  }

  // ===== Reports =====
  function viewReports() {
    const page = el('div', { class: 'adm-page' });
    page.appendChild(pageHeader('البلاغات', 'مراجعة البلاغات المقدمة من المستخدمين'));
    const stats = el('div', { class: 'stats-grid' });
    stats.appendChild(statCard({ label: 'قيد المراجعة', value: '47', icon: 'flag', tone: 'warn' }));
    stats.appendChild(statCard({ label: 'تم الحسم اليوم', value: '23', icon: 'sparkle', tone: 'success' }));
    stats.appendChild(statCard({ label: 'متوسط زمن المعالجة', value: '4 س', icon: 'timer', tone: 'info' }));
    stats.appendChild(statCard({ label: 'معدل الإجراء', value: '78%', icon: 'eye', tone: 'primary' }));
    page.appendChild(stats);

    const tabs = el('div', { class: 'tabs' });
    ['الكل', 'فيديوهات', 'تعليقات', 'حسابات'].forEach((l, i) => tabs.appendChild(el('button', { class: 'tab' + (i === 0 ? ' active' : '') }, l)));
    page.appendChild(tabs);

    const tableWrap = el('div', { class: 'table-wrap' });
    const table = el('table', { class: 'table' });
    table.innerHTML = `<thead><tr><th>النوع</th><th>المحتوى</th><th>المُبلِّغ</th><th>السبب</th><th>الحالة</th><th>التاريخ</th><th></th></tr></thead>`;
    const tb = el('tbody');
    const types = [
      { i: 'video', l: 'فيديو', c: 'video' },
      { i: 'comment', l: 'تعليق', c: 'comment' },
      { i: 'user', l: 'حساب', c: 'account' },
    ];
    const reasons = ['محتوى عنف', 'إيذاء أو كراهية', 'محتوى جنسي', 'مضايقة', 'محتوى مزيف', 'انتهاك حقوق', 'سبام/إعلان', 'احتيال'];
    for (let i = 0; i < 10; i++) {
      const tp = types[i % 3];
      const status = i % 4 === 0 ? ['success', 'تم الحسم'] : ['warn', 'قيد المراجعة'];
      const u = DB.users[i % DB.users.length];
      const tr = el('tr');
      tr.innerHTML = `
        <td><div style="display:flex;gap:10px;align-items:center"><div class="rep-icon ${tp.c}">${icons[tp.i]}</div><strong>${tp.l}</strong></div></td>
        <td>${tp.l === 'فيديو' ? 'فيديو #' + (i + 1) : tp.l === 'تعليق' ? '"' + ['مزعج', 'مخالف', 'سبام'][i % 3] + '..."' : '@' + u.handle.replace('@', '')}</td>
        <td>${u.name}</td>
        <td>${reasons[i % reasons.length]}</td>
        <td><span class="badge ${status[0]}">${status[1]}</span></td>
        <td>منذ ${i + 1} ساعة</td>
        <td><div class="row-actions">
          <button class="btn btn-secondary btn-sm" data-act="view">مراجعة</button>
          <button class="btn-icon btn-ghost" title="إجراء" data-act="action">${icons.moreV}</button>
        </div></td>`;
      tr.querySelector('[data-act="view"]').onclick = () => openReportModal(tp, reasons[i % reasons.length], u);
      tb.appendChild(tr);
    }
    table.appendChild(tb);
    tableWrap.appendChild(table);
    tableWrap.appendChild(pagination(47, 10));
    page.appendChild(tableWrap);

    function openReportModal(tp, reason, u) {
      const body = el('div', {});
      body.innerHTML = `
        <div style="display:flex;gap:12px;align-items:center;margin-bottom:14px">
          <div class="rep-icon ${tp.c}">${icons[tp.i]}</div>
          <div><div style="font-weight:700">${tp.l}</div><div class="muted" style="font-size:12px">${reason}</div></div>
        </div>
        <div class="field"><label>المُبلِّغ</label><div>${u.name} (${u.handle})</div></div>
        <div class="field"><label>تفاصيل البلاغ</label><div class="muted">المحتوى يحتوي على ما يخالف معايير المجتمع. تم الإبلاغ عنه ${(Math.random() * 8 | 0) + 1} مرات في اليوم الواحد.</div></div>
        <div class="field"><label>الإجراء المقترح</label>
          <select><option>تحذير المستخدم</option><option>حذف المحتوى</option><option>حذف وحظر مؤقت</option><option>حظر دائم</option><option>تجاهل البلاغ</option></select>
        </div>
        <div class="field"><label>ملاحظات (اختياري)</label><textarea placeholder="ملاحظات للسجل"></textarea></div>
      `;
      const close = modalAdm('مراجعة البلاغ', body, [
        el('button', { class: 'btn btn-secondary', onclick: () => close() }, 'إلغاء'),
        el('button', { class: 'btn btn-danger', onclick: () => { close(); toast('تم تنفيذ الإجراء'); } }, 'تنفيذ الإجراء'),
      ]);
    }

    return page;
  }

  // ===== Live =====
  function viewLive() {
    const page = el('div', { class: 'adm-page' });
    page.appendChild(pageHeader('البث المباشر', 'مراقبة الجلسات النشطة وإنهاء البثوث المخالفة'));
    const stats = el('div', { class: 'stats-grid' });
    stats.appendChild(statCard({ label: 'بثوث نشطة', value: '142', icon: 'video', tone: 'danger' }));
    stats.appendChild(statCard({ label: 'مشاهدون متزامنون', value: '38.2K', icon: 'eye', tone: 'info' }));
    stats.appendChild(statCard({ label: 'هدايا مُرسَلة (اليوم)', value: '12.4K', icon: 'gift', tone: 'warn' }));
    stats.appendChild(statCard({ label: 'بثوث منتهية اليوم', value: '847', icon: 'sparkle', tone: 'success' }));
    page.appendChild(stats);

    const tabs = el('div', { class: 'tabs' });
    ['نشط الآن', 'الأرشيف', 'مخالف'].forEach((l, i) => tabs.appendChild(el('button', { class: 'tab' + (i === 0 ? ' active' : '') }, l)));
    page.appendChild(tabs);

    const grid = el('div', { class: 'grid-3' });
    DB.lives.forEach(l => {
      const card = el('div', { class: 'card', style: { padding: 0, overflow: 'hidden' } });
      card.appendChild(el('div', { style: { aspectRatio: '16/9', backgroundImage: `url(${l.bg})`, backgroundSize: 'cover', position: 'relative' } }, [
        el('div', { style: { position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.6))' } }),
        el('div', { style: { position: 'absolute', top: '8px', insetInlineStart: '8px' } }, [el('span', { class: 'badge danger' }, '● مباشر')]),
        el('div', { style: { position: 'absolute', top: '8px', insetInlineEnd: '8px' } }, [el('span', { class: 'badge muted', style: { background: 'rgba(0,0,0,0.5)', color: '#fff' } }, fmt(l.viewers) + ' 👁')]),
        el('div', { style: { position: 'absolute', bottom: '8px', insetInlineStart: '8px', color: '#fff', fontWeight: 700 } }, l.title),
      ]));
      card.appendChild(el('div', { style: { padding: '12px' } }, [
        el('div', { style: { display: 'flex', gap: '10px', alignItems: 'center' } }, [
          el('div', { style: { width: '34px', height: '34px', borderRadius: '50%', overflow: 'hidden' } }, [Object.assign(document.createElement('img'), { src: l.host.avatar, style: 'width:100%;height:100%;object-fit:cover' })]),
          el('div', { style: { flex: 1 } }, [el('div', { style: { fontWeight: 700, fontSize: '13px' } }, l.host.name), el('div', { class: 'muted', style: { fontSize: '11.5px' } }, l.host.handle)]),
          el('button', { class: 'btn btn-secondary btn-sm', onclick: () => toast('فتح المراقبة...') }, 'مراقبة'),
          el('button', { class: 'btn btn-danger btn-sm', onclick: () => { if (confirm('إنهاء البث الآن؟')) toast('تم الإنهاء'); } }, 'إنهاء'),
        ]),
      ]));
      grid.appendChild(card);
    });
    page.appendChild(grid);
    return page;
  }

  // ===== Ads =====
  function viewAds() {
    const page = el('div', { class: 'adm-page' });
    page.appendChild(pageHeader('الإعلانات', 'إدارة الحملات الإعلانية وتتبع الأداء', [
      el('button', { class: 'btn', onclick: () => openAdModal() }, [svg('plus'), document.createTextNode(' حملة جديدة')]),
    ]));
    const stats = el('div', { class: 'stats-grid' });
    stats.appendChild(statCard({ label: 'حملات نشطة', value: '24', icon: 'sparkle', tone: 'success' }));
    stats.appendChild(statCard({ label: 'مشاهدات اليوم', value: '4.2M', icon: 'eye', tone: 'info' }));
    stats.appendChild(statCard({ label: 'نقرات', value: '128K', delta: '+5.2%', icon: 'arrowR', tone: 'primary' }));
    stats.appendChild(statCard({ label: 'CTR', value: '3.04%', delta: '+0.1%', icon: 'sparkle', tone: 'warn' }));
    page.appendChild(stats);

    const tableWrap = el('div', { class: 'table-wrap' });
    const table = el('table', { class: 'table' });
    table.innerHTML = `<thead><tr><th>الحملة</th><th>الفئة المستهدفة</th><th>المدة</th><th>المشاهدات</th><th>النقرات</th><th>CTR</th><th>الحالة</th><th></th></tr></thead>`;
    const tb = el('tbody');
    const camps = ['عرض رمضان الكبير', 'إطلاق الجيل الجديد', 'تخفيضات الموسم', 'مهرجان الطعام', 'دروس الطبخ المباشرة', 'بطاقات الهدايا', 'استبيان المنتج', 'باقة Premium'];
    camps.forEach((c, i) => {
      const status = i === 1 ? ['warn', 'متوقفة'] : i === 5 ? ['muted', 'منتهية'] : ['success', 'نشطة'];
      const tr = el('tr');
      tr.innerHTML = `
        <td><strong>${c}</strong><div class="muted" style="font-size:11.5px">#${1000 + i}</div></td>
        <td>${i % 2 === 0 ? '18-35 · الرياض' : '20-45 · جدة, الدمام'}</td>
        <td>${15 - i % 5} يوم متبقي</td>
        <td>${fmt(120000 + i * 50000)}</td>
        <td>${fmt(3000 + i * 1700)}</td>
        <td>${(2 + (i * 0.3) % 4).toFixed(2)}%</td>
        <td><span class="badge ${status[0]}">${status[1]}</span></td>
        <td><div class="row-actions">
          <button class="btn-icon btn-ghost" title="تحرير">${icons.settings}</button>
          <button class="btn-icon btn-ghost" title="إيقاف">${icons.x}</button>
        </div></td>`;
      tb.appendChild(tr);
    });
    table.appendChild(tb);
    tableWrap.appendChild(table);
    page.appendChild(tableWrap);

    function openAdModal() {
      const body = el('div', {});
      body.innerHTML = `
        <div class="field"><label>عنوان الحملة</label><input placeholder="عنوان الإعلان"/></div>
        <div class="field"><label>نص الإعلان</label><textarea placeholder="نص قصير وجذاب"></textarea></div>
        <div class="field"><label>الرابط (URL)</label><input placeholder="https://"/></div>
        <div class="field-row">
          <div class="field"><label>تاريخ البداية</label><input type="date"/></div>
          <div class="field"><label>تاريخ النهاية</label><input type="date"/></div>
        </div>
        <div class="field"><label>الفئة المستهدفة</label>
          <div class="checks">
            <label class="check"><input type="checkbox"/> 18-24</label>
            <label class="check"><input type="checkbox" checked/> 25-34</label>
            <label class="check"><input type="checkbox" checked/> 35-44</label>
            <label class="check"><input type="checkbox"/> 45+</label>
          </div>
        </div>
        <div class="field"><label>الموقع الجغرافي</label>
          <select><option>الرياض</option><option>جدة</option><option>الدمام</option><option>كل المملكة</option></select>
        </div>`;
      const close = modalAdm('إنشاء حملة إعلانية', body, [
        el('button', { class: 'btn btn-secondary', onclick: () => close() }, 'إلغاء'),
        el('button', { class: 'btn', onclick: () => { close(); toast('تم إنشاء الحملة'); } }, 'حفظ ونشر'),
      ]);
    }
    return page;
  }

  // ===== Notifications =====
  function viewNotifications() {
    const page = el('div', { class: 'adm-page' });
    page.appendChild(pageHeader('الإشعارات', 'إرسال إشعارات عامة أو موجهة لفئات محددة'));
    const grid = el('div', { class: 'grid-2' });
    const composer = el('div', { class: 'card' });
    composer.appendChild(el('div', { class: 'card-h' }, [el('h3', {}, 'إشعار جديد')]));
    const cb = el('div', {});
    cb.innerHTML = `
      <div class="field"><label>نوع الإشعار</label>
        <select><option>عام (لجميع المستخدمين)</option><option>موجه (فئة محددة)</option><option>مستخدمون نشطون اليوم</option></select>
      </div>
      <div class="field"><label>العنوان</label><input placeholder="عنوان الإشعار" maxlength="100"/></div>
      <div class="field"><label>المحتوى</label><textarea placeholder="نص الإشعار" maxlength="300"></textarea></div>
      <div class="field"><label>الفئة المستهدفة (اختياري)</label>
        <div class="checks">
          <label class="check"><input type="checkbox"/> الرياض</label>
          <label class="check"><input type="checkbox"/> جدة</label>
          <label class="check"><input type="checkbox"/> ذكور</label>
          <label class="check"><input type="checkbox"/> إناث</label>
          <label class="check"><input type="checkbox"/> 18-25</label>
        </div>
      </div>
      <div class="field"><label>الجدولة</label>
        <select><option>إرسال فوري</option><option>جدولة لوقت لاحق</option></select>
      </div>`;
    composer.appendChild(cb);
    composer.appendChild(el('div', { style: { display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '14px' } }, [
      el('button', { class: 'btn btn-secondary', onclick: () => toast('تم الحفظ كمسودة') }, 'حفظ كمسودة'),
      el('button', { class: 'btn', onclick: () => toast('تم إرسال الإشعار') }, 'إرسال'),
    ]));
    grid.appendChild(composer);

    const recent = el('div', { class: 'card' });
    recent.appendChild(el('div', { class: 'card-h' }, [el('h3', {}, 'الإشعارات السابقة')]));
    [
      { t: 'تحديث جديد متاح', s: 'لجميع المستخدمين', tm: 'منذ ساعة', users: 12480 },
      { t: 'تحديات الأسبوع 🎉', s: 'مستخدمون نشطون', tm: 'أمس', users: 4231 },
      { t: 'هدية ترحيبية', s: 'مستخدمون جدد', tm: 'منذ 3 أيام', users: 982 },
      { t: 'صيانة مجدولة الليلة', s: 'لجميع المستخدمين', tm: 'منذ أسبوع', users: 12000 },
    ].forEach(n => recent.appendChild(el('div', { style: { padding: '10px 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', gap: '8px' } }, [
      el('div', {}, [el('div', { style: { fontWeight: 700, fontSize: '13.5px' } }, n.t), el('div', { class: 'muted', style: { fontSize: '11.5px' } }, n.s + ' · وصل لـ ' + fmt(n.users))]),
      el('div', { class: 'muted', style: { fontSize: '11.5px' } }, n.tm),
    ])));
    grid.appendChild(recent);
    page.appendChild(grid);
    return page;
  }

  // ===== Analytics =====
  function viewAnalytics() {
    const page = el('div', { class: 'adm-page' });
    page.appendChild(pageHeader('الإحصائيات والتقارير', 'تتبع التفاعل واستخراج التقارير', [
      el('button', { class: 'btn btn-secondary' }, [svg('download'), document.createTextNode(' Excel')]),
      el('button', { class: 'btn btn-secondary' }, [svg('download'), document.createTextNode(' PDF')]),
      el('select', { style: { background: 'var(--surface)', border: '1px solid var(--border)', padding: '10px', borderRadius: '10px' } }, [el('option', {}, 'آخر 7 أيام'), el('option', {}, 'آخر 30 يوم'), el('option', {}, 'آخر 90 يوم')]),
    ]));
    const stats = el('div', { class: 'stats-grid' });
    stats.appendChild(statCard({ label: 'مستخدمون نشطون يوميًا', value: '128.4K', delta: '+12.3%', icon: 'user', tone: 'primary' }));
    stats.appendChild(statCard({ label: 'مستخدمون نشطون شهريًا', value: '2.8M', delta: '+8.1%', icon: 'sparkle', tone: 'info' }));
    stats.appendChild(statCard({ label: 'متوسط الجلسة', value: '24:38', delta: '+3min', icon: 'timer', tone: 'success' }));
    stats.appendChild(statCard({ label: 'معدل البقاء (DAY30)', value: '38.2%', delta: '+1.4%', icon: 'heart', tone: 'warn' }));
    page.appendChild(stats);

    const grid = el('div', { class: 'grid-2' });
    const a = el('div', { class: 'card' });
    a.appendChild(el('div', { class: 'card-h' }, [el('h3', {}, 'النمو خلال 30 يومًا')]));
    a.appendChild(chartLine([800, 900, 1100, 950, 1250, 1300, 1500, 1400, 1700, 1850, 1700, 1900, 2100, 2050, 2300, 2400, 2350, 2600, 2800, 2900, 3100, 3000, 3300, 3500, 3400, 3700, 3900, 4100, 4000, 4300]));
    grid.appendChild(a);

    const b = el('div', { class: 'card' });
    b.appendChild(el('div', { class: 'card-h' }, [el('h3', {}, 'التفاعل')]));
    b.appendChild(chartBars([
      { l: 'إعجاب', v: 4200000 }, { l: 'تعليق', v: 1800000 }, { l: 'مشاركة', v: 950000 }, { l: 'حفظ', v: 620000 }, { l: 'متابعة', v: 410000 },
    ]));
    grid.appendChild(b);
    page.appendChild(grid);

    const grid2 = el('div', { class: 'grid-2', style: { marginTop: '14px' } });
    const c = el('div', { class: 'card' });
    c.appendChild(el('div', { class: 'card-h' }, [el('h3', {}, 'أعلى الفيديوهات أداءً')]));
    const list = el('div', { class: 'top-list' });
    DB.videos.slice(0, 5).forEach((v, i) => list.appendChild(el('div', { class: 'top-item' }, [
      el('div', { class: 'rank' }, '#' + (i + 1)),
      el('div', { class: 'av', style: { width: '32px', height: '46px', borderRadius: '6px' } }, [Object.assign(document.createElement('img'), { src: v.bg })]),
      el('div', { class: 'body' }, [el('div', { class: 'ttl' }, v.desc.slice(0, 32)), el('div', { class: 'sub' }, v.user.name)]),
      el('div', { class: 'num' }, fmt(v.likes * 12) + ' 👁'),
    ])));
    c.appendChild(list);
    grid2.appendChild(c);

    const d = el('div', { class: 'card' });
    d.appendChild(el('div', { class: 'card-h' }, [el('h3', {}, 'التوزيع الجغرافي')]));
    [['الرياض', 38], ['جدة', 24], ['الدمام', 15], ['مكة', 11], ['المدينة', 7], ['أخرى', 5]].forEach(([l, v]) => d.appendChild(el('div', { style: { padding: '8px 0' } }, [
      el('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' } }, [el('span', {}, l), el('strong', {}, v + '%')]),
      el('div', { style: { height: '6px', background: 'var(--bg)', borderRadius: '3px', overflow: 'hidden' } }, [el('div', { style: { width: v + '%', height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--primary-2))' } })]),
    ])));
    grid2.appendChild(d);
    page.appendChild(grid2);

    return page;
  }

  // ===== Wallet/Gifts =====
  function viewWallet() {
    const page = el('div', { class: 'adm-page' });
    page.appendChild(pageHeader('الهدايا والمحفظة', 'تتبع الهدايا الافتراضية وتقارير الدخل'));
    const stats = el('div', { class: 'stats-grid' });
    stats.appendChild(statCard({ label: 'إيرادات اليوم', value: '$4,820', delta: '+18%', icon: 'gift', tone: 'success' }));
    stats.appendChild(statCard({ label: 'هدايا مرسلة (اليوم)', value: '12.4K', icon: 'sparkle', tone: 'primary' }));
    stats.appendChild(statCard({ label: 'مستخدمون يدفعون', value: '3,217', delta: '+4.5%', icon: 'user', tone: 'info' }));
    stats.appendChild(statCard({ label: 'متوسط قيمة الهدية', value: '🪙 38', icon: 'wallet', tone: 'warn' }));
    page.appendChild(stats);

    const tabs = el('div', { class: 'tabs' });
    ['كل الهدايا', 'مرسلة', 'مستلمة', 'إدارة الكتالوج'].forEach((l, i) => tabs.appendChild(el('button', { class: 'tab' + (i === 0 ? ' active' : ''), onclick: e => { tabs.querySelectorAll('.tab').forEach(t => t.classList.remove('active')); e.currentTarget.classList.add('active'); } }, l)));
    page.appendChild(tabs);

    const tableWrap = el('div', { class: 'table-wrap' });
    tableWrap.appendChild(el('div', { class: 'table-toolbar' }, [
      el('div', { class: 'search', style: { flex: 1 } }, [el('input', { placeholder: 'بحث' })]),
      el('input', { type: 'date' }),
    ]));
    const table = el('table', { class: 'table' });
    table.innerHTML = `<thead><tr><th>الهدية</th><th>المرسل</th><th>المستلم</th><th>القيمة</th><th>القناة</th><th>التاريخ</th></tr></thead>`;
    const tb = el('tbody');
    const giftRows = [];
    for (let i = 0; i < 12; i++) {
      const g = DB.gifts[i % DB.gifts.length];
      const sender = DB.users[i % DB.users.length];
      const receiver = DB.users[(i + 3) % DB.users.length];
      const tr = el('tr');
      tr.innerHTML = `
        <td><div style="display:flex;gap:8px;align-items:center"><span style="font-size:24px">${g.emoji}</span><span><div style="font-weight:700">${g.name}</div></span></div></td>
        <td><div class="user-cell"><div class="av"><img src="${sender.avatar}"></div><span>${sender.name}</span></div></td>
        <td><div class="user-cell"><div class="av"><img src="${receiver.avatar}"></div><span>${receiver.name}</span></div></td>
        <td><strong>🪙 ${g.price}</strong></td>
        <td><span class="badge primary">بث مباشر</span></td>
        <td>منذ ${i + 1} ساعة</td>`;
      tb.appendChild(tr);
    }
    table.appendChild(tb);
    tableWrap.appendChild(table);
    tableWrap.appendChild(pagination(847, 12));
    page.appendChild(tableWrap);

    return page;
  }

  // ===== Roles =====
  function viewRoles() {
    const page = el('div', { class: 'adm-page' });
    page.appendChild(pageHeader('الأدوار والصلاحيات', 'إدارة الأدوار وتحديد الصلاحيات لكل دور', [
      el('button', { class: 'btn', onclick: () => openRoleModal() }, [svg('plus'), document.createTextNode(' دور جديد')]),
    ]));
    const tableWrap = el('div', { class: 'table-wrap' });
    const table = el('table', { class: 'table' });
    table.innerHTML = `<thead><tr><th>الدور</th><th>الموظفون</th><th>الصلاحيات</th><th>تاريخ الإنشاء</th><th></th></tr></thead>`;
    const tb = el('tbody');
    const roles = [
      { n: 'Super Admin', e: 1, p: 'كل الصلاحيات', d: '2024/01/01', sys: true },
      { n: 'مشرف محتوى', e: 8, p: 'مراجعة، حذف، تحذير', d: '2024/02/12' },
      { n: 'محلل بيانات', e: 3, p: 'عرض الإحصائيات والتقارير', d: '2024/03/05' },
      { n: 'دعم فني', e: 6, p: 'الحسابات، البلاغات', d: '2024/04/19' },
      { n: 'مسوّق', e: 2, p: 'الإعلانات والإشعارات', d: '2024/05/22' },
    ];
    roles.forEach(r => {
      const tr = el('tr');
      tr.innerHTML = `
        <td><strong>${r.n}</strong>${r.sys ? '<span class="badge primary" style="margin-inline-start:6px">نظام</span>' : ''}</td>
        <td>${r.e} موظف</td>
        <td class="muted">${r.p}</td>
        <td>${r.d}</td>
        <td><div class="row-actions">
          <button class="btn-icon btn-ghost" title="تعديل" data-act="edit">${icons.settings}</button>
          <button class="btn-icon btn-ghost" title="حذف" data-act="del" ${r.sys ? 'disabled style="opacity:0.4"' : ''}>${icons.x}</button>
        </div></td>`;
      tr.querySelector('[data-act="edit"]').onclick = () => openRoleModal(r);
      tb.appendChild(tr);
    });
    table.appendChild(tb);
    tableWrap.appendChild(table);
    page.appendChild(tableWrap);

    function openRoleModal(r) {
      const body = el('div', {});
      body.innerHTML = `
        <div class="field"><label>اسم الدور</label><input value="${r ? r.n : ''}"/></div>
        <div class="field"><label>الوصف</label><textarea>${r ? r.p : ''}</textarea></div>
        <div class="field"><label>الصلاحيات</label>
          <div class="checks">
            ${['عرض المستخدمين','تعديل المستخدمين','حظر المستخدمين','عرض المحتوى','حذف المحتوى','مراجعة البلاغات','إنهاء البث','إدارة الإعلانات','إرسال إشعارات','عرض الإحصائيات','إدارة الموظفين','إدارة الأدوار','إدارة المحفظة','عرض السجل'].map((p, i) => `<label class="check"><input type="checkbox" ${i % 2 === 0 ? 'checked' : ''}/> ${p}</label>`).join('')}
          </div>
        </div>`;
      const close = modalAdm(r ? 'تعديل دور' : 'إنشاء دور جديد', body, [
        el('button', { class: 'btn btn-secondary', onclick: () => close() }, 'إلغاء'),
        el('button', { class: 'btn', onclick: () => { close(); toast('تم الحفظ'); } }, 'حفظ'),
      ]);
    }
    return page;
  }

  // ===== Employees =====
  function viewEmployees() {
    const page = el('div', { class: 'adm-page' });
    page.appendChild(pageHeader('الموظفون', 'إدارة موظفي لوحة التحكم وأدوارهم', [
      el('button', { class: 'btn', onclick: () => openEmpModal() }, [svg('plus'), document.createTextNode(' موظف جديد')]),
    ]));
    const tableWrap = el('div', { class: 'table-wrap' });
    tableWrap.appendChild(el('div', { class: 'table-toolbar' }, [
      el('div', { class: 'search', style: { flex: 1 } }, [el('input', { placeholder: 'بحث بالاسم أو البريد' })]),
      el('select', {}, [el('option', {}, 'كل الأدوار'), el('option', {}, 'Super Admin'), el('option', {}, 'مشرف محتوى'), el('option', {}, 'محلل بيانات'), el('option', {}, 'دعم فني')]),
      el('select', {}, [el('option', {}, 'كل الحالات'), el('option', {}, 'نشط'), el('option', {}, 'موقوف')]),
    ]));
    const table = el('table', { class: 'table' });
    table.innerHTML = `<thead><tr><th>الموظف</th><th>البريد</th><th>الدور</th><th>الحالة</th><th>آخر دخول</th><th></th></tr></thead>`;
    const tb = el('tbody');
    const empRoles = ['Super Admin', 'مشرف محتوى', 'مشرف محتوى', 'محلل بيانات', 'دعم فني', 'مسوّق', 'دعم فني', 'مشرف محتوى'];
    DB.users.slice(0, 8).forEach((u, i) => {
      const active = i !== 4;
      const tr = el('tr');
      tr.innerHTML = `
        <td><div class="user-cell"><div class="av"><img src="${u.avatar}"></div><div><div class="nm">${u.name}</div></div></div></td>
        <td>${u.handle.replace('@', '')}@tenthtone.com</td>
        <td><span class="badge primary">${empRoles[i]}</span></td>
        <td><div class="toggle ${active ? 'on' : ''}" data-i="${i}"></div></td>
        <td>منذ ${(i % 5) + 1} ساعة</td>
        <td><div class="row-actions">
          <button class="btn-icon btn-ghost" title="تعديل" data-act="edit">${icons.settings}</button>
          <button class="btn-icon btn-ghost" title="حذف" data-act="del">${icons.x}</button>
        </div></td>`;
      tr.querySelector('.toggle').onclick = e => { e.currentTarget.classList.toggle('on'); toast('تم تحديث الحالة'); };
      tr.querySelector('[data-act="edit"]').onclick = () => openEmpModal(u, empRoles[i]);
      tr.querySelector('[data-act="del"]').onclick = () => { if (confirm('حذف هذا الموظف؟')) toast('تم الحذف'); };
      tb.appendChild(tr);
    });
    table.appendChild(tb);
    tableWrap.appendChild(table);
    page.appendChild(tableWrap);

    function openEmpModal(u, role) {
      const body = el('div', {});
      body.innerHTML = `
        <div class="field"><label>الاسم الكامل</label><input value="${u ? u.name : ''}"/></div>
        <div class="field-row">
          <div class="field"><label>البريد الإلكتروني</label><input type="email" value="${u ? u.handle.replace('@','') + '@tenthtone.com' : ''}"/></div>
          <div class="field"><label>الهاتف</label><input/></div>
        </div>
        <div class="field"><label>الدور</label>
          <select><option>Super Admin</option><option ${role === 'مشرف محتوى' ? 'selected' : ''}>مشرف محتوى</option><option>محلل بيانات</option><option>دعم فني</option><option>مسوّق</option></select>
        </div>
        <div class="field"><label>كلمة المرور المؤقتة</label><input type="text" value="${u ? '' : 'TempP@ss123'}"/><div class="hint">سيُطلب من الموظف تغييرها عند أول دخول</div></div>`;
      const close = modalAdm(u ? 'تعديل بيانات الموظف' : 'إضافة موظف جديد', body, [
        el('button', { class: 'btn btn-secondary', onclick: () => close() }, 'إلغاء'),
        el('button', { class: 'btn', onclick: () => { close(); toast('تم الحفظ'); } }, 'حفظ'),
      ]);
    }
    return page;
  }

  // ===== Logs =====
  function viewLogs() {
    const page = el('div', { class: 'adm-page' });
    page.appendChild(pageHeader('سجل الأنشطة', 'مراجعة جميع الأنشطة التي قام بها الموظفون', [
      el('button', { class: 'btn btn-secondary' }, [svg('download'), document.createTextNode(' تصدير')]),
    ]));
    const tableWrap = el('div', { class: 'table-wrap' });
    tableWrap.appendChild(el('div', { class: 'table-toolbar' }, [
      el('div', { class: 'search', style: { flex: 1 } }, [el('input', { placeholder: 'بحث' })]),
      el('select', {}, [el('option', {}, 'كل الأنواع'), el('option', {}, 'تسجيل دخول'), el('option', {}, 'حذف'), el('option', {}, 'تعديل')]),
      el('input', { type: 'date' }),
    ]));
    const table = el('table', { class: 'table' });
    table.innerHTML = `<thead><tr><th>الموظف</th><th>الإجراء</th><th>الكيان</th><th>IP</th><th>الوقت</th></tr></thead>`;
    const tb = el('tbody');
    const acts = [
      { a: 'سجّل الدخول', e: '-', t: 'login' },
      { a: 'حذف فيديو', e: 'فيديو #' },
      { a: 'حظر مستخدم', e: 'مستخدم @' },
      { a: 'إنهاء بث مباشر', e: 'live #' },
      { a: 'تعديل صلاحيات دور', e: 'دور: مشرف محتوى' },
      { a: 'إضافة موظف', e: 'موظف جديد' },
      { a: 'إرسال إشعار عام', e: 'تحديث جديد متاح' },
      { a: 'تجاهل بلاغ', e: 'بلاغ #' },
      { a: 'إعادة تعيين كلمة مرور', e: 'مستخدم @' },
      { a: 'إنشاء حملة إعلانية', e: 'عرض رمضان' },
    ];
    for (let i = 0; i < 12; i++) {
      const u = DB.users[i % DB.users.length];
      const act = acts[i % acts.length];
      const tr = el('tr');
      tr.innerHTML = `
        <td><div class="user-cell"><div class="av"><img src="${u.avatar}"></div><span>${u.name}</span></div></td>
        <td><strong>${act.a}</strong></td>
        <td class="muted">${act.e}${typeof act.e === 'string' && act.e.endsWith('#') ? (1000 + i) : ''}</td>
        <td><code style="font-size:11px">192.168.1.${i + 12}</code></td>
        <td>${i === 0 ? 'الآن' : 'منذ ' + (i + 1) + ' دقيقة'}</td>`;
      tb.appendChild(tr);
    }
    table.appendChild(tb);
    tableWrap.appendChild(table);
    tableWrap.appendChild(pagination(1287, 12));
    page.appendChild(tableWrap);
    return page;
  }

  // ===== Location =====
  function viewLocation() {
    const page = el('div', { class: 'adm-page' });
    page.appendChild(pageHeader('الموقع الجغرافي', 'إدارة ميزة مشاركة الموقع ومتابعة المحتوى الشائع'));
    const grid = el('div', { class: 'grid-2' });
    const a = el('div', { class: 'card' });
    a.appendChild(el('div', { class: 'card-h' }, [el('h3', {}, 'إعدادات المشاركة')]));
    [
      { l: 'تفعيل ميزة مشاركة الموقع', d: 'السماح للمستخدمين بمشاركة موقعهم على الخريطة', on: true },
      { l: 'عرض الخريطة العامة', d: 'إظهار خريطة الأصدقاء داخل التطبيق', on: true },
      { l: 'المحتوى الشائع حسب الموقع', d: 'عرض الفيديوهات الرائجة حسب المنطقة', on: true },
      { l: 'مشاركة الموقع تلقائيًا', d: 'افتراضيًا للمستخدمين الجدد', on: false },
    ].forEach(s => a.appendChild(el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)', gap: '10px' } }, [
      el('div', {}, [el('div', { style: { fontWeight: 700, fontSize: '14px' } }, s.l), el('div', { class: 'muted', style: { fontSize: '12px', marginTop: '2px' } }, s.d)]),
      el('div', { class: 'toggle' + (s.on ? ' on' : ''), onclick: e => { e.currentTarget.classList.toggle('on'); toast('تم التحديث'); } }),
    ])));
    grid.appendChild(a);

    const b = el('div', { class: 'card' });
    b.appendChild(el('div', { class: 'card-h' }, [el('h3', {}, 'المحتوى الشائع حسب المنطقة')]));
    const sel = el('select', { style: { width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border)', marginBottom: '14px' } }, [el('option', {}, 'الرياض'), el('option', {}, 'جدة'), el('option', {}, 'الدمام'), el('option', {}, 'مكة'), el('option', {}, 'المدينة')]);
    b.appendChild(sel);
    const list = el('div', { class: 'top-list' });
    DB.videos.slice(0, 5).forEach((v, i) => list.appendChild(el('div', { class: 'top-item' }, [
      el('div', { class: 'rank' }, '#' + (i + 1)),
      el('div', { class: 'av', style: { width: '32px', height: '46px', borderRadius: '6px' } }, [Object.assign(document.createElement('img'), { src: v.bg })]),
      el('div', { class: 'body' }, [el('div', { class: 'ttl' }, v.desc.slice(0, 30)), el('div', { class: 'sub' }, v.user.name)]),
      el('div', { class: 'num' }, fmt(v.likes * 12)),
    ])));
    b.appendChild(list);
    grid.appendChild(b);

    page.appendChild(grid);
    return page;
  }

  // ===== Settings =====
  function viewSettings() {
    const page = el('div', { class: 'adm-page' });
    page.appendChild(pageHeader('الإعدادات', 'إعدادات المنصة العامة'));
    const grid = el('div', { class: 'grid-2' });

    const a = el('div', { class: 'card' });
    a.appendChild(el('div', { class: 'card-h' }, [el('h3', {}, 'عام')]));
    a.innerHTML += `
      <div class="field"><label>اسم المنصة</label><input value="Tenth Tone"/></div>
      <div class="field"><label>الوصف</label><textarea>منصة فيديو اجتماعي بالعربية</textarea></div>
      <div class="field-row">
        <div class="field"><label>اللغة الافتراضية</label><select><option>العربية</option><option>English</option></select></div>
        <div class="field"><label>المنطقة الزمنية</label><select><option>Asia/Riyadh (UTC+3)</option></select></div>
      </div>`;
    grid.appendChild(a);

    const b = el('div', { class: 'card' });
    b.appendChild(el('div', { class: 'card-h' }, [el('h3', {}, 'حدود الفيديو')]));
    b.innerHTML += `
      <div class="field-row">
        <div class="field"><label>الحد الأقصى للمدة (ث)</label><input type="number" value="60"/></div>
        <div class="field"><label>الحد الأقصى للحجم (MB)</label><input type="number" value="200"/></div>
      </div>
      <div class="field-row">
        <div class="field"><label>صيغ الفيديو المدعومة</label><input value="MP4, MOV"/></div>
        <div class="field"><label>صيغ الصور</label><input value="JPG, PNG"/></div>
      </div>`;
    grid.appendChild(b);

    const c = el('div', { class: 'card' });
    c.appendChild(el('div', { class: 'card-h' }, [el('h3', {}, 'البث المباشر')]));
    c.innerHTML += `
      <div class="field"><label>الحد الأدنى من المتابعين للبث</label><input type="number" value="100"/></div>
      <div class="field"><label>الحد الأدنى للعمر</label><input type="number" value="18"/></div>`;
    grid.appendChild(c);

    const d = el('div', { class: 'card' });
    d.appendChild(el('div', { class: 'card-h' }, [el('h3', {}, 'المحفظة والسحب')]));
    d.innerHTML += `
      <div class="field"><label>الحد الأدنى للسحب (🪙)</label><input type="number" value="1000"/></div>
      <div class="field"><label>نسبة العمولة (%)</label><input type="number" value="20"/></div>`;
    grid.appendChild(d);

    page.appendChild(grid);
    page.appendChild(el('div', { style: { marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'flex-end' } }, [
      el('button', { class: 'btn btn-secondary' }, 'إلغاء'),
      el('button', { class: 'btn', onclick: () => toast('تم حفظ الإعدادات') }, 'حفظ التغييرات'),
    ]));
    return page;
  }

  // ===== Router =====
  const routes = {
    '/login-admin': () => viewLogin(),
    '/dashboard': () => buildShell('dashboard', viewDashboard()),
    '/users': () => buildShell('users', viewUsers()),
    '/videos': () => buildShell('videos', viewVideos()),
    '/comments': () => buildShell('comments', viewComments()),
    '/reports': () => buildShell('reports', viewReports()),
    '/live': () => buildShell('live', viewLive()),
    '/ads': () => buildShell('ads', viewAds()),
    '/notifications': () => buildShell('notif', viewNotifications()),
    '/analytics': () => buildShell('analytics', viewAnalytics()),
    '/wallet': () => buildShell('wallet', viewWallet()),
    '/roles': () => buildShell('roles', viewRoles()),
    '/employees': () => buildShell('employees', viewEmployees()),
    '/logs': () => buildShell('logs', viewLogs()),
    '/location': () => buildShell('location', viewLocation()),
    '/settings': () => buildShell('settings', viewSettings()),
  };

  function render() {
    const path = (location.hash || '#/dashboard').slice(1) || '/dashboard';
    const fn = routes[path] || routes['/dashboard'];
    root.innerHTML = '';
    try {
      root.appendChild(fn());
      window.scrollTo(0, 0);
    } catch (e) {
      console.error(e);
      root.innerHTML = '<div style="padding:40px">خطأ: ' + e.message + '</div>';
    }
  }

  // override toast for admin
  window.H.toast = function (msg) {
    const t = el('div', { class: 'adm-toast', textContent: msg });
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2200);
  };

  window.addEventListener('hashchange', render);
  if (document.readyState !== 'loading') render();
  else window.addEventListener('DOMContentLoaded', render);
})();
