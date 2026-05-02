/* === Mobile views === */
(function () {
  const { el, esc, fmt, go, back, toast, modal, icons, svg, bottomNav, hideNav, topBar, avatar } = window.H;
  const DB = window.DB;
  const V = window.Views = {};

  // ===== Splash =====
  V.splash = () => {
    hideNav();
    return el('section', { class: 'splash' }, [
      el('div', { class: 'mark' }, 'T'),
      el('h1', {}, 'Tenth Tone'),
      el('p', {}, 'شارك لحظتك مع العالم'),
      el('div', { class: 'actions' }, [
        el('button', { class: 'btn', onclick: () => go('/login') }, 'تسجيل الدخول'),
        el('button', { class: 'btn btn-outline', onclick: () => go('/register') }, 'إنشاء حساب جديد'),
      ]),
    ]);
  };

  // ===== Login =====
  V.login = () => {
    hideNav();
    let showPass = false;
    const root = el('section', { class: 'auth-screen' });
    const error = el('div', { class: 'error-box', hidden: true });
    root.appendChild(el('div', { class: 'auth-logo' }, [
      el('div', { class: 'mark' }, 'T'),
      el('h1', {}, 'مرحبًا بعودتك'),
      el('p', {}, 'سجّل دخولك للمتابعة'),
    ]));
    const idIn = el('input', { class: 'input', placeholder: 'البريد الإلكتروني أو رقم الهاتف' });
    const passIn = el('input', { class: 'input', type: 'password', placeholder: 'كلمة المرور' });
    const togglePass = el('button', { class: 'icon-btn', type: 'button', html: icons.eyeOff, style: { position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)' }, onclick: () => {
      showPass = !showPass;
      passIn.type = showPass ? 'text' : 'password';
      togglePass.innerHTML = showPass ? icons.eye : icons.eyeOff;
    } });
    const passWrap = el('div', { class: 'input-wrap' }, [
      el('div', { style: { position: 'relative' } }, [passIn, togglePass]),
    ]);
    root.appendChild(error);
    root.appendChild(el('div', { class: 'input-wrap' }, [idIn]));
    root.appendChild(passWrap);
    root.appendChild(el('div', { class: 'auth-row' }, [
      el('span'),
      el('a', { class: 'auth-link', onclick: () => go('/forgot') }, 'نسيت كلمة المرور؟'),
    ]));
    root.appendChild(el('button', { class: 'btn btn-pill', onclick: () => {
      if (!idIn.value || !passIn.value) {
        error.textContent = 'الرجاء إدخال جميع الحقول';
        error.hidden = false;
        return;
      }
      go('/home');
    } }, 'تسجيل الدخول'));
    root.appendChild(el('div', { class: 'auth-actions text-center' }, [
      el('p', { class: 'muted' }, [document.createTextNode('ليس لديك حساب؟ '), el('a', { class: 'auth-link', onclick: () => go('/register') }, 'إنشاء حساب')]),
    ]));
    return root;
  };

  // ===== Register =====
  V.register = () => {
    hideNav();
    const root = el('section', { class: 'auth-screen' });
    root.appendChild(topBar({ title: 'إنشاء حساب', onBack: () => go('/login') }));
    const wrap = el('div', { style: { padding: '8px 4px' } });
    const fields = {
      email: el('input', { class: 'input', type: 'email', placeholder: 'البريد الإلكتروني' }),
      phone: el('input', { class: 'input', type: 'tel', placeholder: 'رقم الهاتف' }),
      pass: el('input', { class: 'input', type: 'password', placeholder: 'كلمة المرور' }),
      confirm: el('input', { class: 'input', type: 'password', placeholder: 'تأكيد كلمة المرور' }),
    };
    const error = el('div', { class: 'error-box', hidden: true });
    wrap.appendChild(el('h2', { class: 'auth-title' }, 'انضم إلى Tenth Tone'));
    wrap.appendChild(el('p', { class: 'auth-subtitle' }, 'بإنشاء حساب أنت توافق على الشروط وسياسة الخصوصية.'));
    wrap.appendChild(error);
    Object.values(fields).forEach(f => wrap.appendChild(el('div', { class: 'input-wrap' }, [f])));
    wrap.appendChild(el('button', { class: 'btn btn-pill', onclick: () => {
      const errs = [];
      if (!/.+@.+\..+/.test(fields.email.value) && !/^[\d\s+()-]{8,}$/.test(fields.phone.value)) errs.push('أدخل بريدًا أو رقم هاتف صحيح');
      if (fields.pass.value.length < 8) errs.push('كلمة المرور 8 أحرف على الأقل');
      if (fields.pass.value !== fields.confirm.value) errs.push('كلمتا المرور غير متطابقتين');
      if (errs.length) { error.textContent = errs[0]; error.hidden = false; return; }
      go('/otp');
    } }, 'تسجيل'));
    root.appendChild(wrap);
    return root;
  };

  // ===== OTP =====
  V.otp = () => {
    hideNav();
    const root = el('section', { class: 'auth-screen' });
    root.appendChild(topBar({ title: 'التحقق' }));
    const wrap = el('div', { style: { padding: '14px 4px', textAlign: 'center' } });
    wrap.appendChild(el('div', { class: 'auth-logo' }, [el('div', { class: 'mark' }, '✓')]));
    wrap.appendChild(el('h2', { class: 'auth-title' }, 'أدخل رمز التحقق'));
    wrap.appendChild(el('p', { class: 'auth-subtitle' }, 'أرسلنا لك رمزًا مكونًا من 6 أرقام'));
    const inputs = [];
    const row = el('div', { class: 'otp-row' });
    for (let i = 0; i < 6; i++) {
      const inp = el('input', { class: 'otp-input', maxLength: 1, inputMode: 'numeric' });
      inp.addEventListener('input', e => {
        if (e.target.value && i < 5) inputs[i + 1].focus();
        if (inputs.every(x => x.value)) verifyBtn.disabled = false;
        else verifyBtn.disabled = true;
      });
      inp.addEventListener('keydown', e => {
        if (e.key === 'Backspace' && !e.target.value && i > 0) inputs[i - 1].focus();
      });
      inputs.push(inp);
      row.appendChild(inp);
    }
    wrap.appendChild(row);
    wrap.appendChild(el('div', { class: 'otp-resend' }, [
      document.createTextNode('لم يصلك الرمز؟ '),
      el('a', { class: 'auth-link', onclick: () => toast('تم إرسال الرمز مرة أخرى') }, 'إعادة الإرسال'),
    ]));
    const verifyBtn = el('button', { class: 'btn btn-pill', disabled: true, style: { marginTop: '24px' }, onclick: () => go('/home') }, 'تحقق ومتابعة');
    wrap.appendChild(verifyBtn);
    root.appendChild(wrap);
    return root;
  };

  // ===== Forgot password =====
  V.forgot = () => {
    hideNav();
    const root = el('section', { class: 'auth-screen' });
    root.appendChild(topBar({ title: 'استعادة كلمة المرور' }));
    const wrap = el('div', { style: { padding: '14px 4px' } });
    wrap.appendChild(el('h2', { class: 'auth-title' }, 'نسيت كلمة المرور؟'));
    wrap.appendChild(el('p', { class: 'auth-subtitle' }, 'سنرسل لك رابط/رمز إعادة تعيين'));
    const inp = el('input', { class: 'input', placeholder: 'البريد الإلكتروني أو رقم الهاتف' });
    wrap.appendChild(el('div', { class: 'input-wrap' }, [inp]));
    wrap.appendChild(el('button', { class: 'btn btn-pill', onclick: () => {
      if (!inp.value) return;
      toast('تم إرسال الرمز');
      go('/reset');
    } }, 'إرسال الرمز'));
    root.appendChild(wrap);
    return root;
  };

  // ===== Reset password =====
  V.reset = () => {
    hideNav();
    const root = el('section', { class: 'auth-screen' });
    root.appendChild(topBar({ title: 'كلمة مرور جديدة' }));
    const wrap = el('div', { style: { padding: '14px 4px' } });
    wrap.appendChild(el('h2', { class: 'auth-title' }, 'أدخل كلمة مرور جديدة'));
    wrap.appendChild(el('p', { class: 'auth-subtitle' }, '8 أحرف على الأقل، تشمل رقمًا ورمزًا.'));
    const p1 = el('input', { class: 'input', type: 'password', placeholder: 'كلمة المرور الجديدة' });
    const p2 = el('input', { class: 'input', type: 'password', placeholder: 'تأكيد كلمة المرور' });
    const err = el('div', { class: 'error-box', hidden: true });
    wrap.appendChild(err);
    wrap.appendChild(el('div', { class: 'input-wrap' }, [p1]));
    wrap.appendChild(el('div', { class: 'input-wrap' }, [p2]));
    wrap.appendChild(el('button', { class: 'btn btn-pill', onclick: () => {
      if (p1.value.length < 8) { err.textContent = 'كلمة المرور 8 أحرف على الأقل'; err.hidden = false; return; }
      if (p1.value !== p2.value) { err.textContent = 'كلمتا المرور غير متطابقتين'; err.hidden = false; return; }
      toast('تم تحديث كلمة المرور');
      go('/login');
    } }, 'حفظ كلمة المرور'));
    root.appendChild(wrap);
    return root;
  };

  // ===== Home Feed =====
  V.home = (params) => {
    bottomNav('home');
    const tab = (params && params.q && params.q.tab) || 'foryou';
    const root = el('section', { class: 'feed' });

    // Top: search + tabs
    root.appendChild(el('button', { class: 'icon-btn feed-search-btn', html: icons.search, onclick: () => go('/discover') }));
    const tabs = el('div', { class: 'feed-tabs' }, [
      el('button', { class: 'feed-tab' + (tab === 'following' ? ' active' : ''), onclick: () => go('/home?tab=following') }, 'متابعون'),
      el('button', { class: 'feed-tab' + (tab === 'foryou' ? ' active' : ''), onclick: () => go('/home?tab=foryou') }, 'لك'),
      el('button', { class: 'feed-tab', onclick: () => go('/live/host-list') }, 'مباشر'),
    ]);
    root.appendChild(tabs);

    const scroll = el('div', { class: 'feed-scroll' });
    root.appendChild(scroll);

    const list = tab === 'following' ? DB.videos.slice(0, 6) : DB.videos;

    if (tab === 'following' && false /* could be empty */) {
      scroll.appendChild(el('div', { class: 'feed-empty' }, [
        el('p', {}, 'لا توجد فيديوهات بعد'),
        el('button', { class: 'btn btn-outline', onclick: () => go('/discover') }, 'استكشف حسابات'),
      ]));
      return root;
    }

    list.forEach(v => {
      const item = el('div', { class: 'feed-item', style: { backgroundImage: `url(${v.bg})` } });

      // Right info
      const info = el('div', { class: 'feed-info' }, [
        el('p', { class: 'username' }, v.user.handle),
        el('p', { class: 'desc' }, v.desc),
        el('span', { class: 'music' }, [svg('music'), document.createTextNode(' ' + v.music)]),
      ]);
      item.appendChild(info);

      // Left action bar
      const actions = el('div', { class: 'feed-actions' });
      // Avatar with follow plus
      const avBtn = el('div', { class: 'feed-avatar-action' }, [
        avatar(v.user.avatar, v.user.name, 44),
        el('span', { class: 'follow-plus' }, '+'),
      ]);
      avBtn.onclick = () => go('/profile/' + v.user.id);
      actions.appendChild(avBtn);

      const likeBtn = el('button', { class: 'feed-action' + (v.liked ? ' liked' : ''), onclick: () => {
        v.liked = !v.liked;
        v.likes += v.liked ? 1 : -1;
        likeBtn.classList.toggle('liked', v.liked);
        likeBtn.querySelector('.feed-action-count').textContent = fmt(v.likes);
      } }, [
        el('span', { class: 'feed-action-icon no-bg', html: icons.heart }),
        el('span', { class: 'feed-action-count' }, fmt(v.likes)),
      ]);
      actions.appendChild(likeBtn);

      const commentBtn = el('button', { class: 'feed-action', onclick: () => go('/comments/' + v.id) }, [
        el('span', { class: 'feed-action-icon no-bg', html: icons.comment }),
        el('span', { class: 'feed-action-count' }, fmt(v.comments)),
      ]);
      actions.appendChild(commentBtn);

      const saveBtn = el('button', { class: 'feed-action', onclick: () => {
        v.saved = !v.saved;
        toast(v.saved ? 'تم الحفظ' : 'تم إلغاء الحفظ');
      } }, [
        el('span', { class: 'feed-action-icon no-bg', html: icons.bookmark }),
        el('span', { class: 'feed-action-count' }, fmt(v.saves)),
      ]);
      actions.appendChild(saveBtn);

      const shareBtn = el('button', { class: 'feed-action', onclick: () => go('/share/' + v.id) }, [
        el('span', { class: 'feed-action-icon no-bg', html: icons.share }),
        el('span', { class: 'feed-action-count' }, fmt(v.shares)),
      ]);
      actions.appendChild(shareBtn);

      item.appendChild(actions);
      scroll.appendChild(item);
    });
    return root;
  };

  // ===== Discover =====
  V.discover = () => {
    bottomNav('discover');
    const root = el('section', { class: 'discover' });
    root.appendChild(el('div', { class: 'discover-search' }, [
      el('div', { class: 'input-pill' }, [
        svg('search'),
        el('input', { type: 'search', placeholder: 'ابحث عن مستخدمين، فيديوهات، أو هاشتاجات' }),
      ]),
    ]));
    const tags = ['الكل', 'فيديوهات', 'حسابات', 'هاشتاجات', 'أصوات'];
    const tagRow = el('div', { class: 'tag-row' });
    tags.forEach((t, i) => tagRow.appendChild(el('button', { class: 'tag' + (i === 0 ? ' active' : ''), onclick: e => {
      tagRow.querySelectorAll('.tag').forEach(x => x.classList.remove('active'));
      e.currentTarget.classList.add('active');
    } }, t)));
    root.appendChild(tagRow);

    root.appendChild(el('h3', { class: 'section-title' }, 'هاشتاجات رائجة'));
    const trend = el('div', { class: 'trending-row' });
    DB.trending.forEach((t, i) => trend.appendChild(el('div', { class: 'trending-item', onclick: () => toast('فلترة بحسب ' + t.tag) }, [
      el('div', { class: 'trending-rank' }, '#' + (i + 1)),
      el('div', { class: 'trending-text' }, t.tag),
      el('div', { class: 'trending-meta' }, t.meta),
    ])));
    root.appendChild(trend);

    root.appendChild(el('h3', { class: 'section-title' }, 'فيديوهات شائعة'));
    const grid = el('div', { class: 'video-grid' });
    DB.videos.forEach(v => grid.appendChild(el('div', { class: 'video-card', onclick: () => go('/home') }, [
      el('img', { src: v.bg, alt: v.desc, loading: 'lazy' }),
      el('div', { class: 'vc-overlay' }, [svg('play'), document.createTextNode(' ' + fmt(v.likes))]),
    ])));
    root.appendChild(grid);
    return root;
  };

  // ===== Create entry =====
  V.create = () => {
    bottomNav('create');
    const root = el('section', { class: 'create-wrap' });
    root.appendChild(topBar({ title: 'إنشاء جديد', back: false, right: el('button', { class: 'icon-btn', html: icons.x, onclick: () => go('/home') }) }));
    [
      { icon: 'rec', label: 'تسجيل فيديو', desc: 'استخدم الكاميرا لتصوير فيديو قصير', go: '/camera' },
      { icon: 'up', label: 'رفع من الجهاز', desc: 'اختر فيديو من المعرض', go: '/upload' },
      { icon: 'live', label: 'بث مباشر', desc: 'تواصل مع جمهورك مباشرة', go: '/live/start' },
      { icon: 'template', label: 'قوالب جاهزة', desc: 'ابدأ من قالب وعدّله', go: '/camera' },
    ].forEach(item => {
      root.appendChild(el('div', { class: 'create-card', onclick: () => go(item.go) }, [
        el('div', { class: 'create-icon ' + item.icon, html: item.icon === 'rec' ? icons.camera : item.icon === 'up' ? icons.upload : item.icon === 'live' ? icons.video : icons.sparkle }),
        el('div', { style: { flex: 1 } }, [
          el('p', { class: 'create-card-title' }, item.label),
          el('p', { class: 'create-card-desc' }, item.desc),
        ]),
        el('span', { class: 'icon-btn', html: icons.chevL }),
      ]));
    });
    return root;
  };

  // ===== Camera =====
  V.camera = () => {
    hideNav();
    const root = el('section', { class: 'camera' });
    root.appendChild(el('div', { class: 'camera-preview' }, '🎥 معاينة الكاميرا (محاكاة)'));
    root.appendChild(el('div', { class: 'camera-top' }, [
      el('button', { class: 'icon-btn', html: icons.x, onclick: () => go('/create'), style: { color: '#fff' } }),
      el('button', { class: 'icon-btn', html: icons.flash, style: { color: '#fff' } }),
    ]));
    root.appendChild(el('div', { class: 'camera-side' }, [
      el('button', { class: 'camera-side-btn' }, [svg('flip'), el('span', {}, 'قلب')]),
      el('button', { class: 'camera-side-btn' }, [svg('timer'), el('span', {}, 'مؤقت')]),
      el('button', { class: 'camera-side-btn' }, [svg('filter'), el('span', {}, 'فلاتر')]),
      el('button', { class: 'camera-side-btn' }, [svg('music'), el('span', {}, 'موسيقى')]),
      el('button', { class: 'camera-side-btn' }, [svg('sparkle'), el('span', {}, 'مؤثرات')]),
    ]));
    let recording = false, secs = 0, timer = null;
    const dur = el('span', { class: 'camera-side-pill' }, '00:00');
    const recBtn = el('button', { class: 'record-btn', onclick: () => {
      recording = !recording;
      recBtn.classList.toggle('recording', recording);
      if (recording) {
        secs = 0;
        timer = setInterval(() => {
          secs++;
          dur.textContent = '00:' + String(secs).padStart(2, '0');
          if (secs >= 60) {
            clearInterval(timer);
            recording = false;
            recBtn.classList.remove('recording');
            go('/edit-video');
          }
        }, 1000);
      } else {
        clearInterval(timer);
        if (secs > 0) go('/edit-video');
      }
    } }, [el('div', { class: 'inner' })]);
    root.appendChild(el('div', { class: 'camera-bottom' }, [
      el('div', { class: 'camera-durations' }, [
        el('span', {}, '60 ث'),
        el('span', { class: 'active' }, '15 ث'),
        el('span', {}, 'صورة'),
      ]),
      el('div', { class: 'camera-record' }, [
        el('button', { class: 'icon-btn', html: icons.image, style: { color: '#fff' }, onclick: () => go('/edit-video') }),
        recBtn,
        el('button', { class: 'icon-btn', html: icons.flip, style: { color: '#fff' } }),
      ]),
      el('div', { class: 'text-center', style: { color: '#fff', marginTop: '6px' } }, [dur]),
    ]));
    return root;
  };

  // ===== Edit video =====
  V.editVideo = () => {
    hideNav();
    const root = el('section', { class: 'edit-video' });
    root.appendChild(el('header', { class: 'top-bar dark' }, [
      el('button', { class: 'icon-btn dark', html: icons.x, onclick: () => go('/create') }),
      el('h1', { class: 'title' }, 'تعديل الفيديو'),
      el('button', { class: 'btn btn-sm', style: { width: 'auto' }, onclick: () => go('/publish') }, 'التالي'),
    ]));
    root.appendChild(el('div', { class: 'edit-preview' }, '🎬 معاينة الفيديو'));
    const tools = el('div', { class: 'edit-tools' });
    [
      { i: 'music', l: 'صوت' },
      { i: 'filter', l: 'فلاتر' },
      { i: 'sparkle', l: 'مؤثرات' },
      { i: 'text', l: 'نص' },
      { i: 'sticker', l: 'ملصقات' },
      { i: 'timer', l: 'سرعة' },
      { i: 'image', l: 'غلاف' },
    ].forEach(t => tools.appendChild(el('button', { class: 'edit-tool' }, [
      el('span', { class: 'edit-tool-icon', html: icons[t.i] }),
      el('span', {}, t.l),
    ])));
    root.appendChild(tools);
    return root;
  };

  // ===== Publish =====
  V.publish = () => {
    hideNav();
    const root = el('section');
    root.appendChild(topBar({ title: 'نشر', onBack: () => go('/edit-video') }));
    const v = DB.videos[0];
    const wrap = el('div', { class: 'publish' });
    wrap.appendChild(el('div', { class: 'publish-row' }, [
      el('textarea', { placeholder: 'صف فيديوك، أضف وسومًا (#) أو ذكر مستخدمين (@)' }),
      el('div', { class: 'publish-thumb', style: { backgroundImage: `url(${v.bg})` } }),
    ]));
    wrap.appendChild(el('div', { class: 'publish-row-link', onclick: () => toast('قيد التطوير') }, [
      el('span', { class: 'left' }, [svg('user'), document.createTextNode(' الإشارة إلى أشخاص')]),
      el('span', { class: 'chev', html: icons.chevL }),
    ]));
    wrap.appendChild(el('div', { class: 'publish-row-link', onclick: () => toast('قيد التطوير') }, [
      el('span', { class: 'left' }, [svg('map'), document.createTextNode(' إضافة موقع')]),
      el('span', { class: 'chev', html: icons.chevL }),
    ]));
    wrap.appendChild(el('div', { class: 'publish-row-link' }, [
      el('span', { class: 'left' }, [svg('lock'), document.createTextNode(' من يستطيع المشاهدة')]),
      el('span', { class: 'privacy-pill' }, [svg('globe'), document.createTextNode(' عام')]),
    ]));
    wrap.appendChild(el('div', { class: 'publish-row-link' }, [
      el('span', { class: 'left' }, ['السماح بالتعليقات']),
      el('div', { class: 'toggle on', onclick: e => e.currentTarget.classList.toggle('on') }),
    ]));
    wrap.appendChild(el('div', { class: 'publish-row-link' }, [
      el('span', { class: 'left' }, ['السماح بالحفظ']),
      el('div', { class: 'toggle on', onclick: e => e.currentTarget.classList.toggle('on') }),
    ]));
    wrap.appendChild(el('div', { style: { display: 'flex', gap: '8px', marginTop: '20px' } }, [
      el('button', { class: 'btn btn-secondary btn-pill', onclick: () => { toast('تم الحفظ كمسودة'); go('/profile'); } }, 'حفظ كمسودة'),
      el('button', { class: 'btn btn-pill', onclick: () => { toast('تم النشر بنجاح'); go('/profile'); } }, 'نشر'),
    ]));
    root.appendChild(wrap);
    return root;
  };

  // ===== Inbox =====
  V.inbox = () => {
    bottomNav('inbox');
    const root = el('section', { class: 'inbox' });
    root.appendChild(topBar({ title: 'البريد', back: false, right: el('button', { class: 'icon-btn', html: icons.search, onclick: () => go('/discover') }) }));
    // Action quick row
    const actions = el('div', { class: 'inbox-actions-row' }, [
      el('button', { class: 'inbox-action', onclick: () => go('/notifications') }, [el('span', { class: 'inbox-action-icon iai-1', html: icons.heart }), el('span', {}, 'إعجابات')]),
      el('button', { class: 'inbox-action', onclick: () => go('/notifications') }, [el('span', { class: 'inbox-action-icon iai-2', html: icons.user }), el('span', {}, 'متابعون جدد')]),
      el('button', { class: 'inbox-action', onclick: () => go('/notifications') }, [el('span', { class: 'inbox-action-icon iai-3', html: icons.comment }), el('span', {}, 'تعليقات')]),
      el('button', { class: 'inbox-action', onclick: () => go('/notifications') }, [el('span', { class: 'inbox-action-icon iai-4', html: icons.bell }), el('span', {}, 'إشعارات')]),
    ]);
    root.appendChild(actions);
    // Chat list
    const list = el('div', { class: 'inbox-list' });
    DB.chats.forEach(c => list.appendChild(el('div', { class: 'inbox-row' + (c.unread ? ' unread' : ''), onclick: () => go('/chat/' + c.id) }, [
      el('div', { class: 'inbox-avatar' }, [
        Object.assign(document.createElement('img'), { src: c.user.avatar, alt: c.user.name, loading: 'lazy' }),
        c.online ? el('span', { class: 'online' }) : null,
      ].filter(Boolean)),
      el('div', { class: 'inbox-body' }, [
        el('div', { class: 'inbox-name' }, [
          el('span', {}, c.user.name),
          el('span', { class: 'time' }, c.time),
        ]),
        el('p', { class: 'inbox-msg' }, c.last),
      ]),
      c.unread ? el('span', { class: 'inbox-badge' }, String(c.unread)) : null,
    ].filter(Boolean))));
    root.appendChild(list);
    return root;
  };

  // ===== Chat =====
  V.chat = (params) => {
    hideNav();
    const id = params.id;
    const c = DB.chats.find(x => x.id === id) || DB.chats[0];
    const root = el('section', { class: 'chat' });
    root.appendChild(el('header', { class: 'chat-header' }, [
      el('button', { class: 'icon-btn', html: icons.chevR, onclick: () => go('/inbox') }),
      el('div', { class: 'inbox-avatar', style: { width: '36px', height: '36px' } }, [
        Object.assign(document.createElement('img'), { src: c.user.avatar }),
      ]),
      el('div', { style: { flex: 1, minWidth: 0 } }, [
        el('div', { class: 'name' }, c.user.name),
        el('div', { class: 'status' }, c.online ? 'متصل الآن' : 'آخر ظهور قريبًا'),
      ]),
      el('button', { class: 'icon-btn', html: icons.phone }),
      el('button', { class: 'icon-btn', html: icons.video }),
    ]));
    const msgs = el('div', { class: 'chat-msgs' });
    c.messages.forEach(m => {
      const mine = m.from === 'me';
      msgs.appendChild(el('div', { class: 'bubble ' + (mine ? 'me' : 'them') }, [
        document.createTextNode(m.text),
        el('div', { class: 't' }, m.time),
      ]));
    });
    root.appendChild(msgs);
    const inputBar = el('div', { class: 'chat-input' }, [
      el('button', { class: 'icon-btn', html: icons.paperclip }),
      el('input', { placeholder: 'اكتب رسالة...', id: 'chat-input-field' }),
      el('button', { class: 'icon-btn', html: icons.mic }),
      el('button', { class: 'icon-btn', html: icons.image }),
      el('button', { class: 'icon-btn', html: icons.arrowL, onclick: () => {
        const f = inputBar.querySelector('#chat-input-field');
        if (!f.value.trim()) return;
        const newMsg = { from: 'me', text: f.value.trim(), time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }) };
        c.messages.push(newMsg);
        msgs.appendChild(el('div', { class: 'bubble me' }, [document.createTextNode(newMsg.text), el('div', { class: 't' }, newMsg.time)]));
        f.value = '';
        msgs.scrollTop = msgs.scrollHeight;
      } }),
    ]);
    root.appendChild(inputBar);
    setTimeout(() => { msgs.scrollTop = msgs.scrollHeight; }, 0);
    return root;
  };

  // ===== Profile =====
  V.profile = () => {
    bottomNav('profile');
    const u = DB.me;
    return _renderProfile(u, true);
  };
  V.userProfile = (params) => {
    hideNav();
    const u = DB.users.find(x => x.id === params.id) || DB.users[0];
    return _renderProfile(u, false);
  };
  function _renderProfile(u, isMe) {
    const root = el('section', { class: 'profile-screen' });
    root.appendChild(el('div', { class: 'profile-header' }, [
      isMe ? el('button', { class: 'icon-btn', html: icons.menu, onclick: () => go('/settings') }) : el('button', { class: 'icon-btn', html: icons.chevR, onclick: () => back() }),
      el('h1', {}, [u.handle, svg('chevD', { style: { width: '14px', height: '14px' } })]),
      el('button', { class: 'icon-btn', html: icons.moreV }),
    ]));
    root.appendChild(el('div', { class: 'profile-top' }, [
      el('div', { class: 'profile-avatar' }, [Object.assign(document.createElement('img'), { src: u.avatar })]),
      el('p', { class: 'profile-name' }, u.name + (u.verified ? ' ✓' : '')),
      el('p', { class: 'profile-handle' }, u.handle),
      el('div', { class: 'profile-stats' }, [
        el('div', { class: 'profile-stat', onclick: () => go('/list/following') }, [el('div', { class: 'n' }, fmt(u.following || 0)), el('div', { class: 'l' }, 'متابَعين')]),
        el('div', { class: 'profile-stat', onclick: () => go('/list/followers') }, [el('div', { class: 'n' }, fmt(u.followers || 0)), el('div', { class: 'l' }, 'متابعون')]),
        el('div', { class: 'profile-stat' }, [el('div', { class: 'n' }, fmt(u.likes || 0)), el('div', { class: 'l' }, 'إعجابات')]),
      ]),
      el('p', { class: 'profile-bio' }, u.bio),
      isMe
        ? el('div', { class: 'profile-actions' }, [
            el('button', { class: 'btn btn-secondary', onclick: () => go('/profile/edit') }, 'تعديل البروفايل'),
            el('button', { class: 'btn btn-secondary', onclick: () => go('/wallet') }, 'المحفظة'),
          ])
        : el('div', { class: 'profile-actions' }, [
            el('button', { class: 'btn', onclick: e => { e.currentTarget.textContent = e.currentTarget.textContent === 'متابعة' ? 'تتم المتابعة' : 'متابعة'; } }, 'متابعة'),
            el('button', { class: 'btn btn-secondary', onclick: () => go('/chat/chat-' + u.id) }, 'مراسلة'),
          ]),
    ]));
    const tabs = el('div', { class: 'profile-tabs' }, [
      el('button', { class: 'profile-tab active' }, 'فيديوهات'),
      el('button', { class: 'profile-tab' }, 'معجَب بها'),
      isMe ? el('button', { class: 'profile-tab' }, 'محفوظ') : null,
    ].filter(Boolean));
    root.appendChild(tabs);
    const grid = el('div', { class: 'video-grid', style: { padding: '4px' } });
    DB.videos.forEach(v => grid.appendChild(el('div', { class: 'video-card', onclick: () => go('/home') }, [
      el('img', { src: v.bg, alt: v.desc, loading: 'lazy' }),
      el('div', { class: 'vc-overlay' }, [svg('play'), document.createTextNode(' ' + fmt(v.likes))]),
    ])));
    root.appendChild(grid);
    return root;
  }

  // ===== Edit profile =====
  V.editProfile = () => {
    hideNav();
    const u = DB.me;
    const root = el('section');
    root.appendChild(topBar({ title: 'تعديل البروفايل' }));
    const wrap = el('div', { style: { padding: '16px' } });
    wrap.appendChild(el('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '10px 0 18px' } }, [
      el('div', { class: 'profile-avatar' }, [Object.assign(document.createElement('img'), { src: u.avatar })]),
      el('button', { class: 'btn-ghost btn-sm' }, 'تغيير الصورة'),
    ]));
    [
      { l: 'الاسم', v: u.name },
      { l: 'اسم المستخدم', v: u.handle.replace('@', '') },
      { l: 'النبذة', v: u.bio, type: 'textarea' },
    ].forEach(f => {
      const wrap2 = el('div', { class: 'input-wrap' });
      wrap2.appendChild(el('label', { class: 'input-label' }, f.l));
      const input = f.type === 'textarea' ? el('textarea', { class: 'input', value: f.v, rows: 3, style: { resize: 'none' } }) : el('input', { class: 'input', value: f.v });
      wrap2.appendChild(input);
      wrap.appendChild(wrap2);
    });
    wrap.appendChild(el('button', { class: 'btn btn-pill', onclick: () => { toast('تم الحفظ'); go('/profile'); }, style: { marginTop: '14px' } }, 'حفظ التعديلات'));
    root.appendChild(wrap);
    return root;
  };

  // ===== Followers / Following list =====
  V.userList = (params) => {
    hideNav();
    const which = params.id;
    const root = el('section');
    root.appendChild(topBar({ title: which === 'followers' ? 'المتابعون' : 'المتابَعون' }));
    root.appendChild(el('div', { class: 'discover-search' }, [
      el('div', { class: 'input-pill' }, [svg('search'), el('input', { placeholder: 'بحث' })]),
    ]));
    const list = el('div', { class: 'list-screen' });
    DB.users.forEach(u => list.appendChild(el('div', { class: 'user-row' }, [
      el('div', { class: 'avatar' }, [Object.assign(document.createElement('img'), { src: u.avatar })]),
      el('div', { style: { flex: 1, minWidth: 0 }, onclick: () => go('/profile/' + u.id) }, [
        el('div', { class: 'name' }, u.name + (u.verified ? ' ✓' : '')),
        el('div', { class: 'handle' }, u.handle),
      ]),
      el('button', { class: 'btn btn-secondary' }, which === 'followers' ? 'متابعة' : 'متابَع'),
    ])));
    root.appendChild(list);
    return root;
  };

  // ===== Notifications =====
  V.notifications = () => {
    hideNav();
    const root = el('section', { class: 'notif' });
    root.appendChild(topBar({ title: 'الإشعارات' }));
    DB.notifications.forEach(n => {
      const av = n.user.avatar
        ? el('div', { class: 'avatar' }, [Object.assign(document.createElement('img'), { src: n.user.avatar })])
        : el('div', { class: 'avatar', style: { display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary-soft)', color: 'var(--primary)' } }, [svg('bell')]);
      root.appendChild(el('div', { class: 'notif-row' }, [
        av,
        el('div', { class: 'notif-text' }, [
          el('b', {}, n.user.name + ' '),
          document.createTextNode(n.text + ' '),
          el('span', { class: 'notif-time' }, '· ' + n.time),
        ]),
        n.type === 'follow' ? el('button', { class: 'btn btn-secondary btn-sm', style: { width: 'auto' } }, 'متابعة') : null,
      ].filter(Boolean)));
    });
    return root;
  };

  // ===== Comments overlay =====
  V.comments = (params) => {
    hideNav();
    const id = params.id;
    const list = DB.comments(id);
    // Render the underlying home in background
    const home = V.home({});
    home.style.position = 'absolute';
    home.style.inset = '0';
    const root = el('section', { style: { position: 'relative', height: '100%', overflow: 'hidden' } });
    root.appendChild(home);
    const sheet = el('div', { class: 'comments-sheet' });
    sheet.appendChild(el('div', { class: 'comments-header' }, [
      el('span'), el('strong', {}, list.length + ' تعليق'),
      el('button', { class: 'icon-btn', html: icons.x, onclick: () => go('/home') }),
    ]));
    const cl = el('div', { class: 'comments-list' });
    list.forEach(c => cl.appendChild(el('div', { class: 'comment-row' }, [
      el('div', { class: 'comment-avatar' }, [Object.assign(document.createElement('img'), { src: c.user.avatar })]),
      el('div', { class: 'comment-body' }, [
        el('div', { class: 'comment-name' }, c.user.name),
        el('div', { class: 'comment-text' }, c.text),
        el('div', { class: 'comment-meta' }, [
          el('span', {}, c.time),
          el('span', {}, c.likes + ' إعجاب'),
          el('a', {}, 'رد'),
        ]),
      ]),
      el('button', { class: 'icon-btn', html: icons.heart, style: { color: 'var(--muted)' } }),
    ])));
    sheet.appendChild(cl);
    sheet.appendChild(el('div', { class: 'comments-input' }, [
      el('input', { placeholder: 'أضف تعليقًا...' }),
      el('button', { class: 'icon-btn', html: icons.arrowL }),
    ]));
    root.appendChild(el('div', { class: 'backdrop', onclick: () => go('/home') }));
    root.appendChild(sheet);
    return root;
  };

  // ===== Share =====
  V.share = (params) => {
    hideNav();
    const root = el('section', { class: 'share-screen' });
    root.appendChild(el('header', { class: 'top-bar' }, [
      el('button', { class: 'icon-btn', html: icons.x, onclick: () => back() }),
      el('h1', { class: 'title' }, 'مشاركة'),
      el('span', { style: { width: '36px' } }),
    ]));
    const search = el('div', { class: 'search' }, [
      el('button', { class: 'icon-btn search-clear', html: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' }),
      el('input', { class: 'search-input-share', value: 'احمد', placeholder: 'بحث' }),
      el('span', { class: 'search-icon', html: icons.search }),
    ]);
    root.appendChild(search);
    const contacts = el('section', { class: 'contacts' });
    const selected = new Set(['c-3']);
    function renderContacts() {
      const q = search.querySelector('input').value.trim();
      const list = DB.users.map((u, i) => ({ id: 'c-' + i, name: 'أحمد', avatar: u.avatar }))
        .concat(DB.users.map((u, i) => ({ id: 'c2-' + i, name: 'أحمد', avatar: u.avatar })));
      const filtered = q ? list.filter(c => c.name.includes(q)) : list;
      contacts.innerHTML = '';
      filtered.forEach(c => {
        const item = el('div', { class: 'contact' + (selected.has(c.id) ? ' selected' : ''), onclick: () => {
          if (selected.has(c.id)) selected.delete(c.id); else selected.add(c.id);
          renderContacts();
          updateSend();
        } }, [
          el('div', { class: 'avatar-share' }, [Object.assign(document.createElement('img'), { src: c.avatar, alt: c.name, loading: 'lazy' })]),
          el('span', { class: 'contact-name' }, c.name),
        ]);
        contacts.appendChild(item);
      });
    }
    search.querySelector('input').addEventListener('input', renderContacts);
    search.querySelector('.search-clear').onclick = () => { search.querySelector('input').value = ''; renderContacts(); };
    root.appendChild(contacts);
    root.appendChild(el('div', { class: 'divider' }));
    const socials = [
      { k: 'snapchat', l: 'Snapchat' }, { k: 'facebook', l: 'Facebook' }, { k: 'whatsapp', l: 'WhatsApp' },
      { k: 'copy', l: 'نسخ الرابط' }, { k: 'download', l: 'تحميل' },
    ];
    const socialRow = el('section', { class: 'social-row' });
    socials.forEach(s => socialRow.appendChild(el('button', { class: 'social-item', onclick: () => {
      if (s.k === 'copy') { navigator.clipboard?.writeText(location.href).catch(() => {}); toast('تم النسخ'); }
      else toast('مشاركة عبر ' + s.l);
    } }, [
      el('span', { class: 'social-icon ' + (['snapchat', 'facebook', 'whatsapp'].includes(s.k) ? s.k : 'neutral'), html: s.k === 'copy' ? icons.link : s.k === 'download' ? icons.download : icons[s.k] || icons.share }),
      el('span', { class: 'social-label' }, s.l),
    ])));
    root.appendChild(socialRow);
    const sendBtn = el('button', { class: 'send-btn', onclick: () => {
      if (!selected.size) return;
      sendBtn.textContent = 'تم الإرسال ✓'; sendBtn.disabled = true;
      setTimeout(() => back(), 800);
    } }, 'إرسال');
    function updateSend() {
      sendBtn.textContent = selected.size ? `إرسال (${selected.size})` : 'إرسال';
      sendBtn.disabled = !selected.size;
    }
    root.appendChild(el('div', { class: 'cta-wrap' }, [sendBtn]));
    root.appendChild(el('div', { class: 'home-indicator' }));
    renderContacts();
    updateSend();
    return root;
  };

  // ===== Live: list/start/viewer =====
  V.liveStart = () => {
    hideNav();
    const root = el('section', { class: 'live-host' });
    root.appendChild(el('div', { class: 'live-bg', style: { backgroundImage: `url(${DB.videos[0].bg})` } }));
    const ov = el('div', { class: 'live-overlay' });
    ov.appendChild(el('div', { class: 'live-top', style: { justifyContent: 'space-between' } }, [
      el('button', { class: 'icon-btn', html: icons.x, style: { color: '#fff' }, onclick: () => go('/create') }),
      el('span'),
    ]));
    ov.appendChild(el('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '0 24px' } }, [
      el('h2', { style: { color: '#fff', margin: 0, textAlign: 'center' } }, 'ابدأ بثًا مباشرًا'),
      el('p', { style: { color: 'rgba(255,255,255,0.7)', textAlign: 'center', margin: 0 } }, 'تواصل مع جمهورك بفيديو حيّ'),
      el('input', { class: 'input', placeholder: 'عنوان البث (اختياري)', style: { background: 'rgba(0,0,0,0.4)', color: '#fff', maxWidth: '320px' } }),
    ]));
    ov.appendChild(el('div', { class: 'live-bottom' }, [
      el('button', { class: 'btn btn-pill', onclick: () => go('/live/v1'), style: { background: '#ef4444' } }, 'بدء البث'),
    ]));
    root.appendChild(ov);
    return root;
  };

  V.liveHostList = () => {
    bottomNav('home');
    const root = el('section', { class: 'discover' });
    root.appendChild(topBar({ title: 'بثوث مباشرة', dark: false, back: false, right: el('button', { class: 'icon-btn', html: icons.x, onclick: () => go('/home') }) }));
    const grid = el('div', { class: 'video-grid' });
    DB.lives.forEach(l => grid.appendChild(el('div', { class: 'video-card', onclick: () => go('/live/' + l.id) }, [
      el('img', { src: l.bg }),
      el('div', { class: 'vc-overlay', style: { background: 'linear-gradient(180deg, rgba(239,68,68,0.5), rgba(0,0,0,0.7))' } }, [
        el('span', { style: { background: '#ef4444', padding: '2px 6px', borderRadius: '4px', marginEnd: '6px', fontSize: '10px' } }, 'مباشر'),
        document.createTextNode(fmt(l.viewers) + ' 👁'),
      ]),
    ])));
    root.appendChild(grid);
    return root;
  };

  V.live = (params) => {
    hideNav();
    const live = DB.lives.find(l => l.id === params.id) || DB.lives[0];
    const root = el('section', { class: 'live-viewer' });
    root.appendChild(el('div', { class: 'live-bg', style: { backgroundImage: `url(${live.bg})` } }));
    const ov = el('div', { class: 'live-overlay' });
    ov.appendChild(el('div', { class: 'live-top' }, [
      el('div', { class: 'live-host-info' }, [
        el('div', { class: 'avatar' }, [Object.assign(document.createElement('img'), { src: live.host.avatar })]),
        el('div', {}, [
          el('div', { style: { fontSize: '12px', fontWeight: 700 } }, live.host.name),
          el('div', { style: { fontSize: '10px', opacity: 0.8 } }, '@' + live.host.handle.replace('@', '')),
        ]),
        el('button', { class: 'btn btn-sm', style: { width: 'auto', padding: '4px 10px', background: 'var(--danger)' } }, 'متابعة'),
      ]),
      el('span', { class: 'live-pill' }, 'مباشر'),
      el('span', { class: 'live-pill viewers' }, fmt(live.viewers) + ' 👁'),
      el('button', { class: 'icon-btn', html: icons.x, style: { color: '#fff' }, onclick: () => go('/home') }),
    ]));

    const cmts = el('div', { class: 'live-comments' });
    [
      { u: DB.users[0].name, t: 'جميل جدًا 🔥' },
      { u: DB.users[1].name, t: 'تابعتك من زمان' },
      { u: DB.users[2].name, t: '👏👏👏' },
      { u: DB.users[3].name, t: 'أرسلت لك هدية 🌹' },
      { u: DB.users[4].name, t: 'مرحبا الجميع' },
    ].forEach(c => cmts.appendChild(el('div', { class: 'live-cmt' }, [el('span', { class: 'u' }, c.u + ':'), document.createTextNode(' ' + c.t)])));
    ov.appendChild(cmts);

    ov.appendChild(el('div', { class: 'live-bottom' }, [
      el('input', { placeholder: 'أرسل تعليقًا...' }),
      el('button', { class: 'icon-btn', html: icons.gift, onclick: () => openGiftSheet() }),
      el('button', { class: 'icon-btn', html: icons.heart }),
      el('button', { class: 'icon-btn', html: icons.share, onclick: () => go('/share/' + live.id) }),
    ]));
    root.appendChild(ov);

    function openGiftSheet() {
      const sheet = el('div', { class: 'gift-sheet' });
      const close = () => { sheet.remove(); bd.remove(); };
      const bd = el('div', { class: 'backdrop', onclick: close });
      sheet.appendChild(el('div', { class: 'wallet-balance' }, [
        el('strong', {}, 'الهدايا'),
        el('span', { class: 'b' }, '🪙 ' + DB.wallet.balance),
      ]));
      const grid = el('div', { class: 'gift-grid' });
      DB.gifts.forEach(g => grid.appendChild(el('button', { class: 'gift-card', onclick: () => {
        if (DB.wallet.balance < g.price) { toast('رصيد غير كافٍ — اشحن المحفظة'); return; }
        DB.wallet.balance -= g.price;
        toast('تم إرسال ' + g.name + ' ' + g.emoji);
        close();
      } }, [
        el('div', { class: 'emoji' }, g.emoji),
        el('div', { style: { fontSize: '11px' } }, g.name),
        el('div', { class: 'price' }, '🪙 ' + g.price),
      ])));
      sheet.appendChild(grid);
      document.body.appendChild(bd);
      document.body.appendChild(sheet);
    }
    return root;
  };

  // ===== Map =====
  V.map = () => {
    hideNav();
    const root = el('section', { class: 'map-screen' });
    root.appendChild(el('div', { class: 'map-bg' }));
    root.appendChild(el('div', { class: 'map-overlay-bg' }));
    root.appendChild(el('div', { class: 'map-controls' }, [
      el('button', { class: 'icon-btn', style: { background: '#fff' }, html: icons.chevR, onclick: () => back() }),
      el('button', { class: 'icon-btn', style: { background: '#fff' }, html: icons.settings, onclick: () => go('/settings') }),
    ]));
    DB.users.slice(0, 6).forEach((u, i) => {
      const x = 15 + (i * 13) % 70;
      const y = 25 + (i * 17) % 55;
      root.appendChild(el('div', { class: 'map-pin', style: { left: x + '%', top: y + '%' }, onclick: () => go('/profile/' + u.id) }, [
        el('div', { class: 'avatar' }, [Object.assign(document.createElement('img'), { src: u.avatar })]),
        el('div', { class: 'arrow' }),
      ]));
    });
    root.appendChild(el('div', { class: 'map-bottom' }, [
      el('button', { class: 'map-fab' }, [svg('user'), document.createTextNode(' الأصدقاء')]),
      el('button', { class: 'map-fab' }, [svg('sparkle'), document.createTextNode(' الشائع')]),
    ]));
    return root;
  };

  // ===== Wallet =====
  V.wallet = () => {
    hideNav();
    const root = el('section', { class: 'wallet-screen' });
    root.appendChild(topBar({ title: 'المحفظة' }));
    root.appendChild(el('div', { class: 'wallet-card' }, [
      el('div', { class: 'label' }, 'الرصيد المتاح'),
      el('div', { class: 'amount' }, ['🪙 ', String(DB.wallet.balance)]),
      el('div', { class: 'wallet-actions' }, [
        el('button', { class: 'btn btn-pill', onclick: () => toast('فتح شاشة الشحن') }, 'شحن'),
        el('button', { class: 'btn btn-pill', onclick: () => toast('فتح شاشة السحب') }, 'سحب'),
      ]),
    ]));
    let active = 'all';
    const tabs = el('div', { class: 'wallet-tabs' });
    [['all', 'الكل'], ['in', 'إيرادات'], ['out', 'صادر']].forEach(([k, l]) => tabs.appendChild(el('button', { class: 'wallet-tab' + (k === active ? ' active' : ''), onclick: e => { active = k; tabs.querySelectorAll('.wallet-tab').forEach(x => x.classList.remove('active')); e.currentTarget.classList.add('active'); rebuild(); } }, l)));
    root.appendChild(tabs);
    const list = el('div', { class: 'tx-list' });
    function rebuild() {
      list.innerHTML = '';
      DB.wallet.transactions.filter(t => active === 'all' || t.type === active).forEach(t => list.appendChild(el('div', { class: 'tx-row' }, [
        el('div', { class: 'tx-icon ' + t.type, html: t.type === 'in' ? icons.download : icons.upload }),
        el('div', { class: 'tx-body' }, [el('div', { class: 'tx-title' }, t.title), el('div', { class: 'tx-sub' }, t.sub + ' · ' + t.time)]),
        el('div', { class: 'tx-amt ' + t.type }, (t.type === 'in' ? '+' : '-') + t.amount + ' 🪙'),
      ])));
    }
    rebuild();
    root.appendChild(list);
    return root;
  };

  // ===== Settings =====
  V.settings = () => {
    hideNav();
    const root = el('section', { class: 'settings' });
    root.appendChild(topBar({ title: 'الإعدادات والخصوصية' }));
    function section(title, items) {
      const s = el('div', { class: 'settings-section' });
      s.appendChild(el('h3', {}, title));
      items.forEach(it => s.appendChild(el('div', { class: 'settings-item', onclick: it.onclick || (() => toast('قريبًا')) }, [
        el('span', { class: 'si-icon', html: icons[it.icon] || icons.settings }),
        el('span', { class: 'si-text' }, it.label),
        it.right || el('span', { class: 'chev', html: icons.chevL }),
      ])));
      root.appendChild(s);
    }
    section('الحساب', [
      { icon: 'user', label: 'تعديل البروفايل', onclick: () => go('/profile/edit') },
      { icon: 'lock', label: 'الخصوصية' },
      { icon: 'wallet', label: 'المحفظة', onclick: () => go('/wallet') },
      { icon: 'bell', label: 'الإشعارات' },
    ]);
    section('المحتوى والعرض', [
      { icon: 'globe', label: 'اللغة', right: el('span', { class: 'muted' }, 'العربية') },
      { icon: 'eye', label: 'إعدادات النشاط' },
      { icon: 'map', label: 'مشاركة الموقع', right: el('div', { class: 'toggle on', onclick: e => { e.stopPropagation(); e.currentTarget.classList.toggle('on'); } }) },
    ]);
    section('الدعم والقانوني', [
      { icon: 'flag', label: 'الإبلاغ عن مشكلة' },
      { icon: 'mail', label: 'تواصل معنا' },
      { icon: 'globe', label: 'الشروط وسياسة الخصوصية' },
    ]);
    const logout = el('div', { class: 'settings-section' });
    logout.appendChild(el('div', { class: 'settings-item', onclick: () => { go('/login'); toast('تم تسجيل الخروج'); } }, [
      el('span', { class: 'si-text', style: { color: 'var(--danger)', textAlign: 'center', fontWeight: 700 } }, 'تسجيل الخروج'),
    ]));
    root.appendChild(logout);
    return root;
  };

  // Map view ID alias
  V.locationMap = V.map;
})();
