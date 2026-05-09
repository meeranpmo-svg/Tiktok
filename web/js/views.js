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
    const loginBtn = el('button', { class: 'btn btn-pill', onclick: async () => {
      if (!idIn.value || !passIn.value) {
        error.textContent = 'الرجاء إدخال جميع الحقول';
        error.hidden = false;
        return;
      }
      error.hidden = true;
      loginBtn.disabled = true;
      loginBtn.textContent = 'جاري تسجيل الدخول...';
      try {
        const isEmail = /.+@.+\..+/.test(idIn.value);
        const params = { password: passIn.value };
        if (isEmail) params.email = idIn.value.trim();
        else params.phone = idIn.value.replace(/\s/g, '');
        await window.SB.signIn(params);
        go('/home');
      } catch (e) {
        error.textContent = mapAuthError(e);
        error.hidden = false;
        loginBtn.disabled = false;
        loginBtn.textContent = 'تسجيل الدخول';
      }
    } }, 'تسجيل الدخول');
    root.appendChild(loginBtn);
    root.appendChild(el('div', { class: 'auth-actions text-center' }, [
      el('p', { class: 'muted' }, [document.createTextNode('ليس لديك حساب؟ '), el('a', { class: 'auth-link', onclick: () => go('/register') }, 'إنشاء حساب')]),
    ]));
    return root;
  };

  // Map Supabase error messages to Arabic
  function mapAuthError(e) {
    const m = (e && e.message) || '';
    if (/Invalid login credentials/i.test(m)) return 'بيانات الدخول غير صحيحة';
    if (/Email not confirmed/i.test(m)) return 'البريد لم يُفعَّل بعد — تحقق من بريدك';
    if (/User already registered/i.test(m)) return 'البريد مسجَّل مسبقًا';
    if (/Password should be at least/i.test(m)) return 'كلمة المرور قصيرة جدًا';
    if (/rate limit|too many/i.test(m)) return 'محاولات كثيرة — حاول لاحقًا';
    if (/network|fetch/i.test(m)) return 'تعذر الاتصال — تحقق من الإنترنت';
    return m || 'حدث خطأ، حاول مجددًا';
  }

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
    const regBtn = el('button', { class: 'btn btn-pill', onclick: async () => {
      const errs = [];
      const hasEmail = /.+@.+\..+/.test(fields.email.value);
      const hasPhone = /^[\d\s+()-]{8,}$/.test(fields.phone.value);
      if (!hasEmail && !hasPhone) errs.push('أدخل بريدًا أو رقم هاتف صحيح');
      if (fields.pass.value.length < 8) errs.push('كلمة المرور 8 أحرف على الأقل');
      if (fields.pass.value !== fields.confirm.value) errs.push('كلمتا المرور غير متطابقتين');
      if (errs.length) { error.textContent = errs[0]; error.hidden = false; return; }
      error.hidden = true;
      regBtn.disabled = true;
      regBtn.textContent = 'جاري إنشاء الحساب...';
      try {
        const params = { password: fields.pass.value };
        if (hasEmail) params.email = fields.email.value.trim();
        if (hasPhone) params.phone = fields.phone.value.replace(/\s/g, '');
        await window.SB.signUp(params);
        sessionStorage.setItem('tt-pending-otp', JSON.stringify({ email: params.email, phone: params.phone }));
        toast('تم إرسال رمز التحقق');
        go('/otp');
      } catch (e) {
        error.textContent = mapAuthError(e);
        error.hidden = false;
        regBtn.disabled = false;
        regBtn.textContent = 'تسجيل';
      }
    } }, 'تسجيل');
    wrap.appendChild(regBtn);
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
    const otpError = el('div', { class: 'error-box', hidden: true, style: { marginTop: '12px' } });
    wrap.appendChild(otpError);
    const pending = JSON.parse(sessionStorage.getItem('tt-pending-otp') || '{}');
    wrap.appendChild(el('div', { class: 'otp-resend' }, [
      document.createTextNode('لم يصلك الرمز؟ '),
      el('a', { class: 'auth-link', onclick: async () => {
        try {
          if (pending.email) await window.SB.signInWithOtp({ email: pending.email });
          else if (pending.phone) await window.SB.signInWithOtp({ phone: pending.phone });
          toast('تم إرسال الرمز مرة أخرى');
        } catch (e) { otpError.textContent = mapAuthError(e); otpError.hidden = false; }
      } }, 'إعادة الإرسال'),
    ]));
    const verifyBtn = el('button', { class: 'btn btn-pill', disabled: true, style: { marginTop: '24px' }, onclick: async () => {
      const code = inputs.map(x => x.value).join('');
      if (code.length !== 6) return;
      verifyBtn.disabled = true;
      verifyBtn.textContent = 'جاري التحقق...';
      try {
        if (!pending.email && !pending.phone) {
          otpError.textContent = 'انتهت الجلسة — أعد التسجيل'; otpError.hidden = false;
          verifyBtn.disabled = false; verifyBtn.textContent = 'تحقق ومتابعة'; return;
        }
        // Try the right OTP type. For email signup confirmation it's 'signup';
        // for OTP login it's 'email'; for SMS it's 'sms'. Try in order.
        const isPhone = !!pending.phone;
        const tryTypes = isPhone ? ['sms'] : ['signup', 'email', 'magiclink'];
        let lastErr = null;
        for (const type of tryTypes) {
          try {
            const params = { token: code, type };
            if (pending.email) params.email = pending.email; else params.phone = pending.phone;
            await window.SB.verifyOtp(params);
            lastErr = null;
            break;
          } catch (e) { lastErr = e; }
        }
        if (lastErr) throw lastErr;
        sessionStorage.removeItem('tt-pending-otp');
        go('/home');
      } catch (e) {
        otpError.textContent = mapAuthError(e);
        otpError.hidden = false;
        verifyBtn.disabled = false;
        verifyBtn.textContent = 'تحقق ومتابعة';
      }
    } }, 'تحقق ومتابعة');
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
    const inp = el('input', { class: 'input', placeholder: 'البريد الإلكتروني' });
    const errBox = el('div', { class: 'error-box', hidden: true });
    wrap.appendChild(errBox);
    wrap.appendChild(el('div', { class: 'input-wrap' }, [inp]));
    const fbtn = el('button', { class: 'btn btn-pill', onclick: async () => {
      if (!inp.value) return;
      fbtn.disabled = true;
      fbtn.textContent = 'جاري الإرسال...';
      try {
        await window.SB.resetPassword(inp.value.trim());
        toast('تم إرسال رابط إعادة التعيين إلى بريدك');
        setTimeout(() => go('/login'), 1500);
      } catch (e) {
        errBox.textContent = mapAuthError(e);
        errBox.hidden = false;
        fbtn.disabled = false;
        fbtn.textContent = 'إرسال الرابط';
      }
    } }, 'إرسال الرابط');
    wrap.appendChild(fbtn);
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
    const resetBtn = el('button', { class: 'btn btn-pill', onclick: async () => {
      if (p1.value.length < 8) { err.textContent = 'كلمة المرور 8 أحرف على الأقل'; err.hidden = false; return; }
      if (p1.value !== p2.value) { err.textContent = 'كلمتا المرور غير متطابقتين'; err.hidden = false; return; }
      err.hidden = true;
      resetBtn.disabled = true;
      resetBtn.textContent = 'جاري الحفظ...';
      try {
        await window.SB.updatePassword(p1.value);
        toast('تم تحديث كلمة المرور');
        go('/home');
      } catch (e) {
        err.textContent = mapAuthError(e);
        err.hidden = false;
        resetBtn.disabled = false;
        resetBtn.textContent = 'حفظ كلمة المرور';
      }
    } }, 'حفظ كلمة المرور');
    wrap.appendChild(resetBtn);
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

    // Adapt DB row to the shape the renderer expects.
    // Prefer the actual video file URL so the feed plays real video.
    const adapt = v => ({
      id: v.id,
      bg: v.video_url || v.thumbnail || (DB.videos[0] && DB.videos[0].bg),
      poster: v.thumbnail || v.video_url || '',
      desc: v.description || '',
      music: v.music || 'الأصلي',
      likes: v.likes_count || 0,
      comments: v.comments_count || 0,
      shares: v.shares_count || 0,
      saves: 0,
      liked: !!v.liked,
      saved: !!v.saved,
      user: {
        id: v.user && v.user.id,
        handle: v.user && (v.user.handle ? '@' + v.user.handle : '@user'),
        name: (v.user && v.user.name) || 'مستخدم',
        avatar: (v.user && v.user.avatar_url) || '',
      },
    });

    let list = tab === 'following' ? DB.videos.slice(0, 6) : DB.videos;

    // Async fetch from Supabase, replace mock if real videos exist
    (async () => {
      try {
        if (!window.API) return;
        const real = await window.API.fetchFeed({ tab });
        if (real && real.length) {
          list = real.map(adapt);
          scroll.innerHTML = '';
          renderItems();
        } else if (tab === 'following' && (!real || !real.length)) {
          scroll.innerHTML = '';
          scroll.appendChild(el('div', { class: 'feed-empty' }, [
            el('p', {}, 'لا تتابع أي حساب بعد'),
            el('button', { class: 'btn btn-outline', onclick: () => go('/discover') }, 'استكشف حسابات'),
          ]));
        }
      } catch (e) { console.warn('feed fetch failed, showing mock:', e); }
    })();

    function renderItems() { list.forEach(v => renderItem(v)); }
    function isVideoUrl(u) { return typeof u === 'string' && /\.(mp4|mov|webm|m4v)(\?|$)/i.test(u); }
    function renderItem(v) {
      const isVideo = isVideoUrl(v.bg);
      const item = el('div', { class: 'feed-item', style: isVideo ? {} : { backgroundImage: `url(${v.bg})` } });
      if (isVideo) {
        const video = Object.assign(document.createElement('video'), {
          src: v.bg, autoplay: true, muted: true, loop: true, playsInline: true, preload: 'metadata',
        });
        video.setAttribute('playsinline', '');
        video.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#000';
        item.appendChild(video);
        // Tap to toggle play/pause + sound (first tap unmutes)
        item.addEventListener('click', (e) => {
          if (e.target.closest('.feed-actions') || e.target.closest('.feed-info')) return;
          if (video.muted) { video.muted = false; return; }
          video.paused ? video.play() : video.pause();
        });
        // Pause when scrolled away (basic IntersectionObserver)
        const io = new IntersectionObserver(entries => {
          entries.forEach(e => { if (e.isIntersecting) video.play().catch(() => {}); else video.pause(); });
        }, { threshold: 0.6 });
        io.observe(item);
      }

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

      const likeBtn = el('button', { class: 'feed-action' + (v.liked ? ' liked' : ''), onclick: async () => {
        const wasLiked = v.liked;
        v.liked = !wasLiked;
        v.likes += v.liked ? 1 : -1;
        likeBtn.classList.toggle('liked', v.liked);
        likeBtn.querySelector('.feed-action-count').textContent = fmt(v.likes);
        if (typeof v.id === 'string' && v.id.length > 10 && window.API) {
          try { wasLiked ? await window.API.unlike(v.id) : await window.API.like(v.id); }
          catch (e) { /* revert on error */ v.liked = wasLiked; v.likes += wasLiked ? 1 : -1; likeBtn.classList.toggle('liked', wasLiked); likeBtn.querySelector('.feed-action-count').textContent = fmt(v.likes); }
        }
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

      const saveBtn = el('button', { class: 'feed-action', onclick: async () => {
        v.saved = !v.saved;
        toast(v.saved ? 'تم الحفظ' : 'تم إلغاء الحفظ');
        if (typeof v.id === 'string' && v.id.length > 10 && window.API) {
          try { v.saved ? await window.API.save(v.id) : await window.API.unsave(v.id); } catch (e) {}
        }
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
    }
    renderItems();
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

    // Hidden file picker shared with the "upload" card
    const fileInput = el('input', { type: 'file', accept: 'video/*,image/*', style: { display: 'none' } });
    fileInput.addEventListener('change', e => {
      const f = e.target.files[0]; if (!f) return;
      window._ttPendingClip = f;
      go('/publish');
    });
    root.appendChild(fileInput);

    [
      { icon: 'rec', label: 'تسجيل فيديو', desc: 'استخدم الكاميرا لتصوير فيديو قصير', action: () => go('/camera') },
      { icon: 'up', label: 'رفع من الجهاز', desc: 'اختر فيديو أو صورة من المعرض', action: () => fileInput.click() },
      { icon: 'live', label: 'بث مباشر', desc: 'تواصل مع جمهورك مباشرة', action: () => go('/live/start') },
      { icon: 'template', label: 'قوالب جاهزة', desc: 'ابدأ من قالب وعدّله', action: () => go('/camera') },
    ].forEach(item => {
      root.appendChild(el('div', { class: 'create-card', onclick: item.action }, [
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

    // Live preview <video>
    const previewWrap = el('div', { class: 'camera-preview' });
    const previewVideo = Object.assign(document.createElement('video'), { autoplay: true, muted: true, playsInline: true });
    previewVideo.setAttribute('playsinline', '');
    previewVideo.style.cssText = 'width:100%;height:100%;object-fit:cover;background:#000';
    previewWrap.appendChild(previewVideo);
    root.appendChild(previewWrap);

    let stream = null;
    let recorder = null;
    let chunks = [];
    let facingMode = 'user'; // 'user' | 'environment'
    let secs = 0, timer = null;
    let maxSecs = 60;
    const dur = el('span', { class: 'camera-side-pill' }, '00:00');

    async function startCamera() {
      try {
        if (stream) stream.getTracks().forEach(t => t.stop());
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: true,
        });
        previewVideo.srcObject = stream;
      } catch (e) {
        previewWrap.innerHTML = '';
        previewWrap.appendChild(el('div', { style: { color: '#fff', padding: '20px', textAlign: 'center' } }, [
          el('p', {}, '⚠️ تعذر فتح الكاميرا'),
          el('p', { style: { fontSize: '12px', opacity: 0.7 } }, e.message || 'الرجاء السماح بالوصول إلى الكاميرا والميكروفون.'),
          el('button', { class: 'btn btn-pill', style: { marginTop: '12px' }, onclick: () => go('/upload') }, 'رفع من المعرض بدلًا من ذلك'),
        ]));
      }
    }
    startCamera();

    function stopAll() {
      if (timer) clearInterval(timer);
      try { if (recorder && recorder.state !== 'inactive') recorder.stop(); } catch (e) {}
      if (stream) stream.getTracks().forEach(t => t.stop());
    }
    window.addEventListener('hashchange', stopAll, { once: true });

    function pickMime() {
      const candidates = ['video/mp4;codecs=h264,aac', 'video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
      for (const m of candidates) if (window.MediaRecorder && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m)) return m;
      return '';
    }

    function startRec() {
      if (!stream) return;
      chunks = [];
      const mimeType = pickMime();
      try { recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined); }
      catch (e) { toast('المتصفح لا يدعم التسجيل'); return; }
      recorder.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
      recorder.onstop = () => {
        const ext = (recorder.mimeType || '').includes('mp4') ? 'mp4' : 'webm';
        const blob = new Blob(chunks, { type: recorder.mimeType || ('video/' + ext) });
        const file = new File([blob], `clip-${Date.now()}.${ext}`, { type: blob.type });
        // Park the file in a global so /publish picks it up
        window._ttPendingClip = file;
        stopAll();
        go('/publish');
      };
      recorder.start();
      recBtn.classList.add('recording');
      secs = 0;
      timer = setInterval(() => {
        secs++;
        dur.textContent = '00:' + String(secs).padStart(2, '0');
        if (secs >= maxSecs) stopRec();
      }, 1000);
    }
    function stopRec() {
      if (recorder && recorder.state !== 'inactive') recorder.stop();
      recBtn.classList.remove('recording');
      if (timer) { clearInterval(timer); timer = null; }
    }

    root.appendChild(el('div', { class: 'camera-top' }, [
      el('button', { class: 'icon-btn', html: icons.x, onclick: () => { stopAll(); go('/create'); }, style: { color: '#fff' } }),
      el('button', { class: 'icon-btn', html: icons.flash, style: { color: '#fff' } }),
    ]));
    root.appendChild(el('div', { class: 'camera-side' }, [
      el('button', { class: 'camera-side-btn', onclick: async () => { facingMode = facingMode === 'user' ? 'environment' : 'user'; await startCamera(); } }, [svg('flip'), el('span', {}, 'قلب')]),
      el('button', { class: 'camera-side-btn' }, [svg('timer'), el('span', {}, 'مؤقت')]),
      el('button', { class: 'camera-side-btn' }, [svg('filter'), el('span', {}, 'فلاتر')]),
      el('button', { class: 'camera-side-btn' }, [svg('music'), el('span', {}, 'موسيقى')]),
      el('button', { class: 'camera-side-btn' }, [svg('sparkle'), el('span', {}, 'مؤثرات')]),
    ]));

    const recBtn = el('button', { class: 'record-btn', onclick: () => {
      if (!recorder || recorder.state === 'inactive') startRec(); else stopRec();
    } }, [el('div', { class: 'inner' })]);

    const durations = el('div', { class: 'camera-durations' }, [
      el('span', { onclick: e => setMax(60, e) }, '60 ث'),
      el('span', { class: 'active', onclick: e => setMax(15, e) }, '15 ث'),
      el('span', { onclick: e => setMax(3, e) }, '3 ث'),
    ]);
    function setMax(n, e) { maxSecs = n; durations.querySelectorAll('span').forEach(s => s.classList.remove('active')); e.currentTarget.classList.add('active'); }

    root.appendChild(el('div', { class: 'camera-bottom' }, [
      durations,
      el('div', { class: 'camera-record' }, [
        el('button', { class: 'icon-btn', html: icons.image, style: { color: '#fff' }, onclick: () => { stopAll(); go('/upload'); } }),
        recBtn,
        el('button', { class: 'icon-btn', html: icons.flip, style: { color: '#fff' }, onclick: async () => { facingMode = facingMode === 'user' ? 'environment' : 'user'; await startCamera(); } }),
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
    const descInput = el('textarea', { placeholder: 'صف فيديوك، أضف وسومًا (#) أو ذكر مستخدمين (@)' });
    const fileInput = el('input', { type: 'file', accept: 'video/*,image/*', style: { display: 'none' } });
    const thumb = el('div', { class: 'publish-thumb', style: { backgroundImage: `url(${v.bg})`, position: 'relative' } });
    let chosenFile = null;

    // If we just came from the camera screen, pick up the recorded clip
    if (window._ttPendingClip) {
      chosenFile = window._ttPendingClip;
      window._ttPendingClip = null;
    }

    function showPreview(file) {
      if (!file) return;
      thumb.innerHTML = '';
      thumb.style.backgroundImage = '';
      if (file.type.startsWith('video/')) {
        const v = Object.assign(document.createElement('video'), { src: URL.createObjectURL(file), muted: true, autoplay: true, loop: true, playsInline: true });
        v.setAttribute('playsinline', '');
        v.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:8px;background:#000';
        thumb.appendChild(v);
      } else {
        thumb.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
      }
    }
    if (chosenFile) showPreview(chosenFile);

    fileInput.addEventListener('change', e => {
      chosenFile = e.target.files[0];
      showPreview(chosenFile);
    });
    thumb.style.cursor = 'pointer';
    thumb.onclick = () => fileInput.click();
    wrap.appendChild(el('div', { class: 'publish-row' }, [descInput, thumb, fileInput]));
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
    const errBox = el('div', { class: 'error-box', hidden: true, style: { marginTop: '12px' } });
    wrap.appendChild(errBox);
    const draftBtn = el('button', { class: 'btn btn-secondary btn-pill' }, 'حفظ كمسودة');
    const pubBtn = el('button', { class: 'btn btn-pill' }, 'نشر');
    async function publish(isDraft) {
      const btn = isDraft ? draftBtn : pubBtn;
      const desc = descInput.value.trim();
      if (!chosenFile && !isDraft) { errBox.textContent = 'اختر ملف فيديو أو صورة أولاً'; errBox.hidden = false; return; }
      errBox.hidden = true; btn.disabled = true; btn.textContent = isDraft ? 'جاري الحفظ...' : 'جاري النشر...';
      try {
        if (window.API) {
          await window.API.publishVideo({ file: chosenFile, description: desc, music: 'الأصلي', privacy: 'public', is_draft: isDraft });
        }
        toast(isDraft ? 'تم الحفظ كمسودة' : 'تم النشر بنجاح');
        go('/profile');
      } catch (e) {
        errBox.textContent = (e && e.message) || 'تعذر الرفع';
        errBox.hidden = false;
        btn.disabled = false;
        btn.textContent = isDraft ? 'حفظ كمسودة' : 'نشر';
      }
    }
    draftBtn.onclick = () => publish(true);
    pubBtn.onclick = () => publish(false);
    wrap.appendChild(el('div', { style: { display: 'flex', gap: '8px', marginTop: '20px' } }, [draftBtn, pubBtn]));
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
    // New group + new DM action
    const cta = el('div', { style: { padding: '8px 16px', display: 'flex', gap: '8px' } }, [
      el('button', { class: 'btn btn-secondary btn-sm', onclick: () => go('/chat-new/group') }, [svg('user'), document.createTextNode(' مجموعة جديدة')]),
      el('button', { class: 'btn btn-secondary btn-sm', onclick: () => go('/chat-new/dm') }, [svg('plus'), document.createTextNode(' محادثة جديدة')]),
    ]);
    root.appendChild(cta);

    const list = el('div', { class: 'inbox-list' });
    root.appendChild(list);

    // Render mock by default; replace with real chats async
    function renderChats(chats) {
      list.innerHTML = '';
      if (!chats.length) { list.appendChild(el('div', { class: 'empty-state', style: { padding: '40px', textAlign: 'center', color: 'var(--muted)' } }, 'لا توجد محادثات بعد')); return; }
      chats.forEach(c => list.appendChild(el('div', { class: 'inbox-row', onclick: () => go('/chat/' + c.id) }, [
        el('div', { class: 'inbox-avatar' }, [
          Object.assign(document.createElement('img'), { src: c.avatar || '', alt: c.title, loading: 'lazy' }),
        ]),
        el('div', { class: 'inbox-body' }, [
          el('div', { class: 'inbox-name' }, [
            el('span', {}, c.title),
            el('span', { class: 'time' }, _agoShort((c.last_message && c.last_message.created_at) || c.created_at)),
          ]),
          el('p', { class: 'inbox-msg' }, _msgPreview(c.last_message)),
        ]),
      ])));
    }
    function _agoShort(iso) { if (!iso) return ''; const t = Date.now() - new Date(iso).getTime(); const m = Math.floor(t / 60000); if (m < 1) return 'الآن'; if (m < 60) return m + 'د'; const h = Math.floor(m / 60); if (h < 24) return h + 'س'; const d = Math.floor(h / 24); return d + 'ي'; }
    function _msgPreview(m) { if (!m) return 'ابدأ محادثة'; if (m.type === 'voice') return '🎤 رسالة صوتية'; if (m.type === 'image') return '📷 صورة'; if (m.type === 'video') return '🎥 فيديو'; return (m.text || '').slice(0, 60); }

    renderChats(DB.chats.map(c => ({ id: c.id, title: c.user.name, avatar: c.user.avatar, last_message: { text: c.last, created_at: new Date().toISOString() }, created_at: new Date().toISOString() })));
    (async () => {
      try { if (window.API) renderChats(await window.API.fetchChats()); } catch (e) { console.warn('chats:', e); }
    })();

    return root;
  };

  // ===== New chat / new group =====
  V.chatNew = (params) => {
    hideNav();
    const isGroup = params.id === 'group';
    const root = el('section');
    root.appendChild(topBar({ title: isGroup ? 'مجموعة جديدة' : 'محادثة جديدة' }));
    const wrap = el('div', { style: { padding: '14px 16px' } });
    const groupName = isGroup ? el('input', { class: 'input', placeholder: 'اسم المجموعة', style: { marginBottom: '12px' } }) : null;
    const groupPhoto = isGroup ? el('input', { type: 'file', accept: 'image/*' }) : null;
    if (groupName) wrap.appendChild(groupName);
    if (groupPhoto) wrap.appendChild(el('div', { class: 'input-wrap' }, [el('label', { class: 'input-label' }, 'صورة المجموعة (اختياري)'), groupPhoto]));

    wrap.appendChild(el('div', { class: 'input-pill', style: { marginBottom: '10px' } }, [svg('search'), el('input', { id: 'search-users', placeholder: 'ابحث عن مستخدم بالاسم' })]));
    const userList = el('div', { class: 'list-screen' });
    wrap.appendChild(userList);
    const errBox = el('div', { class: 'error-box', hidden: true });
    wrap.appendChild(errBox);

    const selected = new Set();
    let allUsers = [];

    async function search(q) {
      try {
        if (window.API) allUsers = await window.API.searchProfiles(q || '');
      } catch (e) { allUsers = []; }
      renderUsers();
    }
    function renderUsers() {
      userList.innerHTML = '';
      allUsers.forEach(u => {
        const isSel = selected.has(u.id);
        userList.appendChild(el('div', { class: 'user-row', style: { background: isSel ? 'var(--primary-soft)' : '' }, onclick: () => {
          if (isGroup) { isSel ? selected.delete(u.id) : selected.add(u.id); renderUsers(); }
          else { goCreateDm(u.id); }
        } }, [
          el('div', { class: 'avatar' }, [Object.assign(document.createElement('img'), { src: u.avatar_url || '' })]),
          el('div', { style: { flex: 1, minWidth: 0 } }, [
            el('div', { class: 'name' }, u.name + (u.verified ? ' ✓' : '')),
            el('div', { class: 'handle' }, '@' + (u.handle || '')),
          ]),
          isGroup ? el('span', {}, isSel ? '✓' : '') : el('span', { class: 'btn btn-secondary btn-sm' }, 'بدء'),
        ]));
      });
    }
    async function goCreateDm(otherId) {
      try {
        const id = await window.API.openOrCreateDm(otherId);
        go('/chat/' + id);
      } catch (e) { errBox.textContent = e.message; errBox.hidden = false; }
    }
    if (isGroup) {
      const createBtn = el('button', { class: 'btn btn-pill', style: { marginTop: '14px' }, onclick: async () => {
        if (!groupName.value.trim()) { errBox.textContent = 'أدخل اسم المجموعة'; errBox.hidden = false; return; }
        if (selected.size < 1) { errBox.textContent = 'اختر عضوًا واحدًا على الأقل'; errBox.hidden = false; return; }
        createBtn.disabled = true; createBtn.textContent = 'جاري الإنشاء...';
        try {
          const id = await window.API.createGroup({ name: groupName.value.trim(), memberIds: [...selected], photoFile: groupPhoto.files[0] || null });
          go('/chat/' + id);
        } catch (e) { errBox.textContent = e.message; errBox.hidden = false; createBtn.disabled = false; createBtn.textContent = 'إنشاء المجموعة'; }
      } }, 'إنشاء المجموعة');
      wrap.appendChild(createBtn);
    }

    const input = wrap.querySelector('#search-users');
    let t; input && input.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => search(input.value), 250); });
    search('');
    root.appendChild(wrap);
    return root;
  };

  // ===== Chat =====
  V.chat = (params) => {
    hideNav();
    const id = params.id;
    const root = el('section', { class: 'chat' });
    const headerName = el('div', { class: 'name' }, '...');
    const headerStatus = el('div', { class: 'status' }, '');
    const headerImg = Object.assign(document.createElement('img'), { src: '' });
    root.appendChild(el('header', { class: 'chat-header' }, [
      el('button', { class: 'icon-btn', html: icons.chevR, onclick: () => go('/inbox') }),
      el('div', { class: 'inbox-avatar', style: { width: '36px', height: '36px' } }, [headerImg]),
      el('div', { style: { flex: 1, minWidth: 0 } }, [headerName, headerStatus]),
      el('button', { class: 'icon-btn', html: icons.phone }),
      el('button', { class: 'icon-btn', html: icons.video }),
    ]));
    const msgs = el('div', { class: 'chat-msgs' });
    root.appendChild(msgs);

    let myUserId = null;
    function fmtTime(iso) { try { return new Date(iso).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; } }
    function appendMessage(m) {
      const mine = m.from_user_id === myUserId;
      const bubble = el('div', { class: 'bubble ' + (mine ? 'me' : 'them') });
      if (m.attachment_url && (m.type === 'image' || m.type === 'video')) {
        const tag = m.type === 'image' ? Object.assign(document.createElement('img'), { src: m.attachment_url, style: 'max-width:220px;border-radius:8px' })
                                       : Object.assign(document.createElement('video'), { src: m.attachment_url, controls: true, style: 'max-width:220px;border-radius:8px' });
        bubble.appendChild(tag);
      } else if (m.attachment_url && m.type === 'voice') {
        bubble.appendChild(Object.assign(document.createElement('audio'), { src: m.attachment_url, controls: true }));
      }
      if (m.text) bubble.appendChild(document.createTextNode(m.text));
      bubble.appendChild(el('div', { class: 't' }, fmtTime(m.created_at)));
      msgs.appendChild(bubble);
    }

    // Render mock first, swap when API loads
    const mockChat = DB.chats.find(x => x.id === id) || DB.chats[0];
    headerName.textContent = mockChat.user.name; headerImg.src = mockChat.user.avatar; headerStatus.textContent = mockChat.online ? 'متصل الآن' : 'آخر ظهور قريبًا';
    mockChat.messages.forEach(m => appendMessage({ from_user_id: m.from === 'me' ? 'me' : 'them', text: m.text, created_at: new Date().toISOString() }));

    let unsub = null;
    (async () => {
      try {
        const user = await window.SB.getUser(); myUserId = user && user.id;
        if (!window.API) return;
        // Load DB messages — but only if id looks like a uuid
        if (typeof id !== 'string' || id.length < 30) return;
        const messages = await window.API.fetchMessages(id);
        msgs.innerHTML = '';
        messages.forEach(appendMessage);
        msgs.scrollTop = msgs.scrollHeight;

        // Subscribe realtime
        unsub = window.API.subscribeToMessages(id, (m) => {
          appendMessage(m);
          msgs.scrollTop = msgs.scrollHeight;
        });
      } catch (e) { console.warn('chat load:', e); }
    })();

    // Hidden file pickers — separate ones for video clips vs other attachments
    const fileInput = el('input', { type: 'file', accept: 'image/*,video/*,audio/*', style: { display: 'none' } });
    const videoInput = el('input', { type: 'file', accept: 'video/*', style: { display: 'none' } });
    videoInput.addEventListener('change', async () => {
      const f = videoInput.files[0]; if (!f) return;
      const tempMsg = { from_user_id: myUserId || 'me', text: '', created_at: new Date().toISOString(), type: 'video', attachment_url: URL.createObjectURL(f) };
      appendMessage(tempMsg); msgs.scrollTop = msgs.scrollHeight;
      if (window.API && typeof id === 'string' && id.length >= 30) {
        try { await window.API.sendMessage({ chatId: id, text: '', type: 'video', file: f }); }
        catch (e) { toast('تعذر إرسال المقطع'); }
      }
      videoInput.value = '';
    });

    const inputField = el('input', { placeholder: 'اكتب رسالة...', id: 'chat-input-field' });

    // ─── Push-to-talk button (hold to record + send as voice message) ───
    const pttBtn = el('button', { class: 'icon-btn', html: icons.mic, style: { transition: 'transform 120ms ease, background 120ms ease', borderRadius: '50%' } });
    let pttRecorder = null;
    let pttStream = null;
    let pttChunks = [];
    async function startPtt() {
      try {
        pttStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mime = MediaRecorder.isTypeSupported('audio/mp4') ? 'audio/mp4' : (MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : '');
        pttRecorder = new MediaRecorder(pttStream, mime ? { mimeType: mime } : undefined);
        pttChunks = [];
        pttRecorder.ondataavailable = e => { if (e.data && e.data.size) pttChunks.push(e.data); };
        pttRecorder.start();
        pttBtn.style.background = 'var(--danger)';
        pttBtn.style.color = '#fff';
        pttBtn.style.transform = 'scale(1.3)';
        toast('🎙️ يتم التسجيل... ارفع إصبعك للإرسال');
      } catch (e) { toast('السماح بالميكروفون مطلوب'); }
    }
    function stopPtt() {
      pttBtn.style.background = '';
      pttBtn.style.color = '';
      pttBtn.style.transform = '';
      if (!pttRecorder || pttRecorder.state === 'inactive') return;
      pttRecorder.onstop = async () => {
        if (pttStream) pttStream.getTracks().forEach(t => t.stop());
        if (!pttChunks.length) return;
        const ext = (pttRecorder.mimeType || '').includes('mp4') ? 'm4a' : 'webm';
        const blob = new Blob(pttChunks, { type: pttRecorder.mimeType || 'audio/' + ext });
        const file = new File([blob], `voice-${Date.now()}.${ext}`, { type: blob.type });
        const tempMsg = { from_user_id: myUserId || 'me', text: '🎤 رسالة صوتية', created_at: new Date().toISOString(), type: 'voice', attachment_url: URL.createObjectURL(blob) };
        appendMessage(tempMsg); msgs.scrollTop = msgs.scrollHeight;
        if (window.API && typeof id === 'string' && id.length >= 30) {
          try { await window.API.sendMessage({ chatId: id, text: '', type: 'voice', file }); }
          catch (e) { toast('تعذر إرسال الصوت'); }
        }
      };
      pttRecorder.stop();
    }
    // mouse + touch events for true hold-to-talk
    pttBtn.addEventListener('mousedown', startPtt);
    pttBtn.addEventListener('mouseup', stopPtt);
    pttBtn.addEventListener('mouseleave', stopPtt);
    pttBtn.addEventListener('touchstart', (e) => { e.preventDefault(); startPtt(); }, { passive: false });
    pttBtn.addEventListener('touchend', (e) => { e.preventDefault(); stopPtt(); });
    pttBtn.addEventListener('touchcancel', stopPtt);

    const inputBar = el('div', { class: 'chat-input' }, [
      el('button', { class: 'icon-btn', html: icons.paperclip, onclick: () => fileInput.click(), title: 'إرفاق ملف' }),
      fileInput, videoInput,
      inputField,
      pttBtn,                                                                                  // push-to-talk
      el('button', { class: 'icon-btn', html: icons.video, onclick: () => videoInput.click(), title: 'إرسال مقطع فيديو' }),
      el('button', { class: 'icon-btn', html: icons.image, onclick: () => fileInput.click(), title: 'صورة' }),
      el('button', { class: 'icon-btn', html: icons.arrowL, onclick: async () => {
        const text = inputField.value.trim();
        const file = fileInput.files[0];
        if (!text && !file) return;
        const tempMsg = { from_user_id: myUserId || 'me', text, created_at: new Date().toISOString(), type: file ? (file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'voice') : 'text' };
        appendMessage(tempMsg);
        inputField.value = '';
        msgs.scrollTop = msgs.scrollHeight;
        if (window.API && typeof id === 'string' && id.length >= 30) {
          try { await window.API.sendMessage({ chatId: id, text, type: tempMsg.type, file }); fileInput.value = ''; }
          catch (e) { toast('تعذر الإرسال'); }
        }
      } }),
    ]);
    root.appendChild(inputBar);

    // Stop subscription when leaving
    window.addEventListener('hashchange', () => { if (unsub) try { unsub(); } catch (e) {} }, { once: true });
    setTimeout(() => { msgs.scrollTop = msgs.scrollHeight; }, 0);
    return root;
  };

  // ===== Profile =====
  V.profile = () => {
    bottomNav('profile');
    const root = _renderProfile(DB.me, true);
    // Async: load real profile from Supabase, swap in
    (async () => {
      try {
        const user = await window.SB.getUser();
        if (!user) return;
        const p = await window.SB.getProfile(user.id);
        if (!p) return;
        const real = {
          id: 'me',
          name: p.name || 'أنت',
          handle: p.handle ? '@' + p.handle : '@me',
          avatar: p.avatar_url || DB.me.avatar,
          bio: p.bio || '',
          followers: p.followers_count || 0,
          following: p.following_count || 0,
          likes: p.likes_count || 0,
          verified: p.verified,
        };
        Object.assign(DB.me, real);
        // Re-render in place
        const fresh = _renderProfile(DB.me, true);
        // Load my real videos in the grid
        if (window.API) {
          const videos = await window.API.fetchUserVideos(user.id).catch(() => []);
          if (videos.length) {
            const grid = fresh.querySelector('.video-grid');
            if (grid) {
              grid.innerHTML = '';
              videos.forEach(v => grid.appendChild(el('div', { class: 'video-card' }, [
                el('img', { src: v.thumbnail || v.video_url || '', loading: 'lazy' }),
                el('div', { class: 'vc-overlay' }, [svg('play'), document.createTextNode(' ' + fmt(v.likes_count || 0))]),
              ])));
            }
          }
        }
        root.replaceWith(fresh);
      } catch (e) { console.warn('profile load:', e); }
    })();
    return root;
  };
  V.userProfile = (params) => {
    hideNav();
    const placeholder = DB.users.find(x => x.id === params.id) || DB.users[0];
    const root = _renderProfile(placeholder, false);
    (async () => {
      try {
        if (!window.API) return;
        const p = await window.API.fetchProfile(params.id);
        if (!p) return;
        const u = { id: p.id, name: p.name, handle: '@' + (p.handle || ''), avatar: p.avatar_url || '', bio: p.bio || '',
                    followers: p.followers_count, following: p.following_count, likes: p.likes_count, verified: p.verified };
        const fresh = _renderProfile(u, false);
        // Async: load real videos + follow state
        const [videos, isFollowing] = await Promise.all([
          window.API.fetchUserVideos(p.id).catch(() => []),
          window.API.isFollowing(p.id).catch(() => false),
        ]);
        const followBtn = fresh.querySelector('.profile-actions button:first-child');
        if (followBtn) {
          followBtn.textContent = isFollowing ? 'تتم المتابعة' : 'متابعة';
          followBtn.onclick = async () => {
            const wasFollowing = followBtn.textContent === 'تتم المتابعة';
            followBtn.textContent = wasFollowing ? 'متابعة' : 'تتم المتابعة';
            try { wasFollowing ? await window.API.unfollow(p.id) : await window.API.follow(p.id); }
            catch (e) { followBtn.textContent = wasFollowing ? 'تتم المتابعة' : 'متابعة'; }
          };
        }
        const messageBtn = fresh.querySelectorAll('.profile-actions button')[1];
        if (messageBtn) messageBtn.onclick = async () => {
          try { const id = await window.API.openOrCreateDm(p.id); go('/chat/' + id); } catch (e) { toast('تعذر فتح المحادثة'); }
        };

        // Add "Request to track location" button (3rd action)
        const actionsRow = fresh.querySelector('.profile-actions');
        if (actionsRow && p.id) {
          const trackBtn = el('button', { class: 'btn btn-secondary', style: { marginTop: '8px', width: '100%' } });
          let permitStatus = await window.API.fetchPermitStatus(p.id);
          function setLabel() {
            if (!permitStatus) trackBtn.textContent = '📍 طلب تتبع الموقع';
            else if (permitStatus.status === 'pending') trackBtn.textContent = '⏳ في انتظار الموافقة';
            else if (permitStatus.status === 'approved') trackBtn.textContent = '✅ يتم التتبع — اضغط للإلغاء';
            else if (permitStatus.status === 'denied') trackBtn.textContent = '❌ تم الرفض — أعد الطلب';
            else trackBtn.textContent = '📍 طلب تتبع الموقع';
          }
          setLabel();
          trackBtn.onclick = async () => {
            try {
              if (permitStatus && permitStatus.status === 'approved') {
                await window.API.revokeLocationPermit(p.id);
                toast('تم إلغاء التتبع');
              } else {
                await window.API.requestLocationPermit(p.id);
                toast('تم إرسال طلب التتبع — بانتظار الموافقة');
              }
              permitStatus = await window.API.fetchPermitStatus(p.id);
              setLabel();
            } catch (e) { toast(e.message || 'خطأ'); }
          };
          // wrap actionsRow + button in a flex column
          const wrap = el('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px', maxWidth: '320px', width: '100%', alignItems: 'center' } });
          actionsRow.parentNode.insertBefore(wrap, actionsRow);
          wrap.appendChild(actionsRow);
          wrap.appendChild(trackBtn);
        }
        const grid = fresh.querySelector('.video-grid');
        if (videos.length && grid) {
          grid.innerHTML = '';
          videos.forEach(v => grid.appendChild(el('div', { class: 'video-card' }, [
            el('img', { src: v.thumbnail || v.video_url || '', loading: 'lazy' }),
            el('div', { class: 'vc-overlay' }, [svg('play'), document.createTextNode(' ' + fmt(v.likes_count || 0))]),
          ])));
        }
        root.replaceWith(fresh);
      } catch (e) { console.warn('userProfile load:', e); }
    })();
    return root;
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
            el('button', { class: 'btn' }, 'متابعة'),
            el('button', { class: 'btn btn-secondary' }, 'مراسلة'),
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
    const avImg = Object.assign(document.createElement('img'), { src: u.avatar, style: 'width:100%;height:100%;object-fit:cover' });
    const fileInput = el('input', { type: 'file', accept: 'image/*', style: { display: 'none' } });
    let avatarFile = null;
    fileInput.addEventListener('change', (e) => {
      avatarFile = e.target.files[0];
      if (avatarFile) avImg.src = URL.createObjectURL(avatarFile);
    });
    wrap.appendChild(el('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '10px 0 18px' } }, [
      el('div', { class: 'profile-avatar' }, [avImg]),
      el('button', { class: 'btn-ghost btn-sm', onclick: () => fileInput.click() }, 'تغيير الصورة'),
      fileInput,
    ]));
    const inputs = {};
    [
      { k: 'name', l: 'الاسم', v: u.name },
      { k: 'handle', l: 'اسم المستخدم', v: u.handle.replace('@', '') },
      { k: 'bio', l: 'النبذة', v: u.bio, type: 'textarea' },
    ].forEach(f => {
      const wrap2 = el('div', { class: 'input-wrap' });
      wrap2.appendChild(el('label', { class: 'input-label' }, f.l));
      const input = f.type === 'textarea' ? el('textarea', { class: 'input', value: f.v, rows: 3, style: { resize: 'none' } }) : el('input', { class: 'input', value: f.v });
      wrap2.appendChild(input);
      wrap.appendChild(wrap2);
      inputs[f.k] = input;
    });
    const errBox = el('div', { class: 'error-box', hidden: true });
    wrap.appendChild(errBox);
    const saveBtn = el('button', { class: 'btn btn-pill', style: { marginTop: '14px' }, onclick: async () => {
      saveBtn.disabled = true;
      saveBtn.textContent = 'جاري الحفظ...';
      try {
        const user = await window.SB.getUser();
        if (!user) { go('/login'); return; }
        const fields = {
          name: inputs.name.value.trim().slice(0, 50),
          handle: inputs.handle.value.trim().replace(/^@/, '').slice(0, 30),
          bio: inputs.bio.value.trim().slice(0, 150),
        };
        if (avatarFile) {
          fields.avatar_url = await window.SB.uploadAvatar(user.id, avatarFile);
        }
        await window.SB.updateProfile(user.id, fields);
        toast('تم الحفظ');
        go('/profile');
      } catch (e) {
        errBox.textContent = (e.message && /duplicate|unique/i.test(e.message)) ? 'اسم المستخدم محجوز' : (e.message || 'تعذر الحفظ');
        errBox.hidden = false;
        saveBtn.disabled = false;
        saveBtn.textContent = 'حفظ التعديلات';
      }
    } }, 'حفظ التعديلات');
    wrap.appendChild(saveBtn);
    root.appendChild(wrap);
    return root;
  };

  // ===== Followers / Following list =====
  V.userList = (params) => {
    hideNav();
    const which = params.id;
    const root = el('section');
    root.appendChild(topBar({ title: which === 'followers' ? 'المتابعون' : 'المتابَعون' }));
    const searchInput = el('input', { placeholder: 'بحث' });
    root.appendChild(el('div', { class: 'discover-search' }, [
      el('div', { class: 'input-pill' }, [svg('search'), searchInput]),
    ]));
    const list = el('div', { class: 'list-screen' });
    root.appendChild(list);

    function render(users) {
      list.innerHTML = '';
      if (!users.length) { list.appendChild(el('div', { class: 'empty-state', style: { padding: '40px', textAlign: 'center', color: 'var(--muted)' } }, 'لا يوجد مستخدمون')); return; }
      users.forEach(u => list.appendChild(el('div', { class: 'user-row' }, [
        el('div', { class: 'avatar' }, [Object.assign(document.createElement('img'), { src: u.avatar_url || u.avatar || '' })]),
        el('div', { style: { flex: 1, minWidth: 0 }, onclick: () => go('/profile/' + u.id) }, [
          el('div', { class: 'name' }, u.name + (u.verified ? ' ✓' : '')),
          el('div', { class: 'handle' }, '@' + (u.handle || u.handle === '' ? u.handle : '').replace('@', '')),
        ]),
        el('button', { class: 'btn btn-secondary', onclick: async (e) => {
          const btn = e.currentTarget;
          if (!window.API) return;
          const isFollowing = btn.textContent === 'تتم المتابعة' || btn.textContent === 'متابَع';
          btn.textContent = isFollowing ? 'متابعة' : 'تتم المتابعة';
          try { isFollowing ? await window.API.unfollow(u.id) : await window.API.follow(u.id); }
          catch (e) { btn.textContent = isFollowing ? 'تتم المتابعة' : 'متابعة'; }
        } }, which === 'followers' ? 'متابعة' : 'تتم المتابعة'),
      ])));
    }

    render(DB.users);
    (async () => {
      try {
        if (!window.API) return;
        const me = await window.SB.getUser(); if (!me) return;
        const users = which === 'followers' ? await window.API.fetchFollowers(me.id) : await window.API.fetchFollowing(me.id);
        render(users);
      } catch (e) { console.warn('userList:', e); }
    })();

    let t; searchInput.addEventListener('input', async () => {
      clearTimeout(t); t = setTimeout(async () => {
        if (!window.API) return;
        if (searchInput.value.trim()) render(await window.API.searchProfiles(searchInput.value.trim()));
      }, 250);
    });
    return root;
  };

  // ===== Notifications =====
  V.notifications = () => {
    hideNav();
    const root = el('section', { class: 'notif' });
    root.appendChild(topBar({ title: 'الإشعارات' }));
    const wrap = el('div'); root.appendChild(wrap);

    function ago(iso) { if (!iso) return ''; const t = Date.now() - new Date(iso).getTime(); const m = Math.floor(t / 60000); if (m < 1) return 'الآن'; if (m < 60) return 'منذ ' + m + ' د'; const h = Math.floor(m / 60); if (h < 24) return 'منذ ' + h + ' س'; const d = Math.floor(h / 24); return 'منذ ' + d + ' يوم'; }
    function textFor(n) {
      if (n.type === 'like') return 'أعجبه الفيديو الخاص بك';
      if (n.type === 'follow') return 'بدأ بمتابعتك';
      if (n.type === 'comment') return 'علّق: "' + ((n.payload && n.payload.text) || '') + '"';
      if (n.type === 'mention') return 'ذكرك في تعليق';
      if (n.type === 'message') return 'أرسل رسالة';
      if (n.type === 'system' && n.payload && n.payload.kind === 'location_request') return 'طلب تتبع موقعك';
      if (n.type === 'system' && n.payload && n.payload.kind === 'location_approved') return 'وافق على طلب تتبع موقعه';
      if (n.type === 'system' && n.payload && n.payload.kind === 'location_denied') return 'رفض طلب تتبع موقعه';
      return (n.payload && n.payload.text) || '';
    }
    function render(items) {
      wrap.innerHTML = '';
      if (!items.length) { wrap.appendChild(el('div', { class: 'empty-state', style: { padding: '40px', textAlign: 'center', color: 'var(--muted)' } }, 'لا توجد إشعارات بعد')); return; }
      items.forEach(n => {
        const av = (n.actor && n.actor.avatar_url)
          ? el('div', { class: 'avatar' }, [Object.assign(document.createElement('img'), { src: n.actor.avatar_url })])
          : el('div', { class: 'avatar', style: { display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary-soft)', color: 'var(--primary)' } }, [svg('bell')]);
        wrap.appendChild(el('div', { class: 'notif-row' }, [
          av,
          el('div', { class: 'notif-text' }, [
            el('b', {}, ((n.actor && n.actor.name) || 'النظام') + ' '),
            document.createTextNode(textFor(n) + ' '),
            el('span', { class: 'notif-time' }, '· ' + ago(n.created_at)),
          ]),
          n.type === 'follow' ? el('button', { class: 'btn btn-secondary btn-sm', style: { width: 'auto' }, onclick: async () => {
            if (!window.API || !n.actor) return;
            try { await window.API.follow(n.actor.id); toast('تتم المتابعة'); } catch (e) {}
          } }, 'متابعة') : null,
          // For location_request — show approve/deny buttons inline
          (n.type === 'system' && n.payload && n.payload.kind === 'location_request' && n.payload.permit_id) ?
            el('div', { style: { display: 'flex', gap: '4px', flexShrink: 0 } }, [
              el('button', { class: 'btn btn-sm', style: { width: 'auto', background: 'var(--success)' }, onclick: async (e) => {
                try { await window.API.respondToLocationPermit(n.payload.permit_id, 'approved'); toast('وافقت على المشاركة'); e.currentTarget.parentElement.remove(); } catch (err) { toast('خطأ'); }
              } }, '✓ موافقة'),
              el('button', { class: 'btn btn-sm', style: { width: 'auto', background: 'var(--bg-2)', color: 'var(--text)' }, onclick: async (e) => {
                try { await window.API.respondToLocationPermit(n.payload.permit_id, 'denied'); toast('تم الرفض'); e.currentTarget.parentElement.remove(); } catch (err) { toast('خطأ'); }
              } }, '✗ رفض'),
            ]) : null,
        ].filter(Boolean)));
      });
    }
    // Fallback to mock + load real
    render(DB.notifications.map(n => ({ id: n.id, type: n.type, actor: { id: '_', name: n.user.name, avatar_url: n.user.avatar }, payload: { text: n.text }, created_at: new Date().toISOString() })));
    (async () => { try { if (window.API) render(await window.API.fetchNotifications()); } catch (e) {} })();
    return root;
  };

  // ===== Comments overlay =====
  V.comments = (params) => {
    hideNav();
    const id = params.id;

    // Render the underlying home in background
    const home = V.home({});
    home.style.position = 'absolute';
    home.style.inset = '0';
    const root = el('section', { style: { position: 'relative', height: '100%', overflow: 'hidden' } });
    root.appendChild(home);
    const sheet = el('div', { class: 'comments-sheet' });
    const counter = el('strong', {}, '0 تعليق');
    sheet.appendChild(el('div', { class: 'comments-header' }, [
      el('span'), counter,
      el('button', { class: 'icon-btn', html: icons.x, onclick: () => back() }),
    ]));
    const cl = el('div', { class: 'comments-list' });
    sheet.appendChild(cl);

    function ago(iso) { if (!iso) return ''; const t = Date.now() - new Date(iso).getTime(); const m = Math.floor(t / 60000); if (m < 1) return 'الآن'; if (m < 60) return m + 'د'; const h = Math.floor(m / 60); if (h < 24) return h + 'س'; return Math.floor(h / 24) + 'ي'; }

    function renderComment(c) {
      cl.appendChild(el('div', { class: 'comment-row' }, [
        el('div', { class: 'comment-avatar' }, [Object.assign(document.createElement('img'), { src: (c.user && c.user.avatar_url) || (c.user && c.user.avatar) || '' })]),
        el('div', { class: 'comment-body' }, [
          el('div', { class: 'comment-name' }, (c.user && c.user.name) || ''),
          el('div', { class: 'comment-text' }, c.text),
          el('div', { class: 'comment-meta' }, [
            el('span', {}, ago(c.created_at) || c.time || ''),
            el('span', {}, (c.likes_count || c.likes || 0) + ' إعجاب'),
            el('a', {}, 'رد'),
          ]),
        ]),
        el('button', { class: 'icon-btn', html: icons.heart, style: { color: 'var(--muted)' } }),
      ]));
    }

    // Default: load from mock
    let comments = (typeof id === 'string' && id.length < 30) ? DB.comments(id) : [];
    counter.textContent = comments.length + ' تعليق';
    comments.forEach(renderComment);

    // Load real if uuid
    (async () => {
      try {
        if (!window.API || typeof id !== 'string' || id.length < 30) return;
        const list = await window.API.fetchComments(id);
        cl.innerHTML = '';
        list.forEach(renderComment);
        counter.textContent = list.length + ' تعليق';
      } catch (e) {}
    })();

    const cInput = el('input', { placeholder: 'أضف تعليقًا...' });
    sheet.appendChild(el('div', { class: 'comments-input' }, [
      cInput,
      el('button', { class: 'icon-btn', html: icons.arrowL, onclick: async () => {
        const text = cInput.value.trim(); if (!text) return;
        cInput.value = '';
        if (window.API && typeof id === 'string' && id.length >= 30) {
          try {
            const c = await window.API.postComment(id, text);
            renderComment(c);
            counter.textContent = (parseInt(counter.textContent) + 1) + ' تعليق';
          } catch (e) { toast('تعذر النشر'); }
        } else {
          renderComment({ user: { name: DB.me.name, avatar: DB.me.avatar }, text, created_at: new Date().toISOString(), likes: 0 });
        }
      } }),
    ]));
    root.appendChild(el('div', { class: 'backdrop', onclick: () => back() }));
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
    const previewVideo = el('div', { id: 'agora-host-preview', style: { position: 'absolute', inset: 0, background: '#000' } });
    root.appendChild(previewVideo);

    // App-provided backgrounds (used in "background only" mode)
    const BG_PRESETS = [
      { id: 'studio', name: 'استوديو', url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=900' },
      { id: 'beach', name: 'شاطئ', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900' },
      { id: 'city', name: 'مدينة', url: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=900' },
      { id: 'gradient', name: 'تدرج', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=900' },
      { id: 'desert', name: 'صحراء', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=900' },
      { id: 'mosque', name: 'مسجد', url: 'https://images.unsplash.com/photo-1542379653-b204bcb555d4?w=900' },
    ];
    let mode = 'camera';            // 'camera' | 'background'
    let selectedBg = BG_PRESETS[0];
    let privacy = 'public';         // 'public' | 'friends' | 'private'

    const ov = el('div', { class: 'live-overlay' });
    ov.appendChild(el('div', { class: 'live-top', style: { justifyContent: 'space-between' } }, [
      el('button', { class: 'icon-btn', html: icons.x, style: { color: '#fff' }, onclick: () => go('/create') }),
      el('span'),
    ]));
    const titleInput = el('input', { class: 'input', placeholder: 'عنوان البث (اختياري)', style: { background: 'rgba(0,0,0,0.4)', color: '#fff', maxWidth: '320px', textAlign: 'center' } });

    // Mode selector — Camera vs Background-only
    const modeRow = el('div', { style: { display: 'flex', gap: '6px', justifyContent: 'center' } });
    function buildModeBtn(key, label) {
      const b = el('button', { class: 'btn btn-sm', style: { background: mode === key ? '#fff' : 'rgba(255,255,255,0.15)', color: mode === key ? '#000' : '#fff', borderRadius: '999px', padding: '6px 14px', fontSize: '12.5px' }, onclick: () => { mode = key; refreshUI(); } }, label);
      return b;
    }
    function refreshModeRow() {
      modeRow.innerHTML = '';
      modeRow.appendChild(buildModeBtn('camera', '📷 كاميرا'));
      modeRow.appendChild(buildModeBtn('background', '🖼️ خلفية فقط'));
    }
    refreshModeRow();

    // Background picker (only visible in 'background' mode)
    const bgPicker = el('div', { style: { display: 'flex', gap: '8px', overflowX: 'auto', padding: '8px 14px', maxWidth: '100%' } });
    BG_PRESETS.forEach(b => {
      const tile = el('div', { onclick: () => { selectedBg = b; refreshUI(); }, style: { width: '60px', height: '60px', borderRadius: '12px', backgroundImage: `url(${b.url})`, backgroundSize: 'cover', flexShrink: 0, border: selectedBg.id === b.id ? '3px solid #fff' : '3px solid transparent', cursor: 'pointer' } });
      bgPicker.appendChild(tile);
    });

    // Privacy chooser
    const privacyRow = el('div', { style: { display: 'flex', gap: '6px', justifyContent: 'center' } });
    function buildPrivacyBtn(key, label, icon) {
      return el('button', { class: 'btn btn-sm', style: { background: privacy === key ? '#fff' : 'rgba(255,255,255,0.15)', color: privacy === key ? '#000' : '#fff', borderRadius: '999px', padding: '6px 12px', fontSize: '12px' }, onclick: () => { privacy = key; refreshPrivacyRow(); } }, icon + ' ' + label);
    }
    function refreshPrivacyRow() {
      privacyRow.innerHTML = '';
      privacyRow.appendChild(buildPrivacyBtn('public', 'عام', '🌐'));
      privacyRow.appendChild(buildPrivacyBtn('friends', 'الأصدقاء', '👥'));
      privacyRow.appendChild(buildPrivacyBtn('private', 'خاص', '🔒'));
    }
    refreshPrivacyRow();

    // Help message
    const helpMsg = el('p', { style: { color: 'rgba(255,255,255,0.5)', textAlign: 'center', margin: 0, fontSize: '11.5px', maxWidth: '320px' } });
    function refreshHelp() {
      if (mode === 'background') {
        helpMsg.textContent = 'بث صوتي مع خلفية — لا يحتاج كاميرا';
      } else if (window.Agora && window.Agora.isConfigured()) {
        helpMsg.textContent = 'بث فيديو فعلي عبر الكاميرا والميكروفون';
      } else {
        helpMsg.innerHTML = '⚠️ Agora App ID غير مضبوط — البث بدون فيديو فعلي';
      }
    }

    function refreshUI() {
      // background preview if in background mode
      if (mode === 'background') {
        previewVideo.style.background = `#000 url(${selectedBg.url}) center/cover no-repeat`;
        bgPicker.style.display = 'flex';
      } else {
        previewVideo.style.background = '#000';
        bgPicker.style.display = 'none';
      }
      refreshModeRow();
      refreshHelp();
    }
    refreshUI();

    ov.appendChild(el('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '0 16px' } }, [
      el('h2', { style: { color: '#fff', margin: 0, textAlign: 'center' } }, 'ابدأ بثًا مباشرًا'),
      modeRow,
      bgPicker,
      titleInput,
      privacyRow,
      helpMsg,
    ]));
    const startBtn = el('button', { class: 'btn btn-pill', style: { background: '#ef4444' } }, 'بدء البث');
    let agoraSession = null;
    startBtn.onclick = async () => {
      startBtn.disabled = true; startBtn.textContent = 'جاري البدء...';
      try {
        if (!window.API) throw new Error('SDK not loaded');
        const live = await window.API.startLive({
          title: titleInput.value || null,
          thumbnail: mode === 'background' ? selectedBg.url : DB.videos[0].bg,
        });
        // Persist privacy + mode in payload (we'll hook this to RLS-based filtering in the live list)
        // For now stored in app state; full RLS filter is a 1-line policy update.
        window._ttLiveMeta = { id: live.id, mode, bg: selectedBg.url, privacy };
        if (mode === 'camera' && window.Agora && window.Agora.isConfigured()) {
          agoraSession = await window.Agora.startHost({
            channel: live.id,
            videoEl: previewVideo,
            onError: (e) => toast(e.message),
          });
          window._ttAgoraHostSession = agoraSession;
          window._ttAgoraHostLiveId = live.id;
        }
        go('/live/' + live.id);
      } catch (e) {
        toast(e.message || 'تعذر بدء البث');
        startBtn.disabled = false;
        startBtn.textContent = 'بدء البث';
        if (agoraSession) try { await agoraSession.stop(); } catch (_) {}
      }
    };
    ov.appendChild(el('div', { class: 'live-bottom' }, [startBtn]));
    root.appendChild(ov);
    return root;
  };

  V.liveHostList = () => {
    bottomNav('home');
    const root = el('section', { class: 'discover' });
    root.appendChild(topBar({ title: 'بثوث مباشرة', dark: false, back: false, right: el('button', { class: 'icon-btn', html: icons.x, onclick: () => go('/home') }) }));
    const grid = el('div', { class: 'video-grid' }); root.appendChild(grid);
    function render(lives) {
      grid.innerHTML = '';
      if (!lives.length) { grid.appendChild(el('div', { class: 'empty-state', style: { padding: '40px', gridColumn: '1/-1', textAlign: 'center', color: 'var(--muted)' } }, 'لا توجد بثوث الآن')); return; }
      lives.forEach(l => grid.appendChild(el('div', { class: 'video-card', onclick: () => go('/live/' + l.id) }, [
        el('img', { src: l.thumbnail || l.bg || (DB.videos[0] && DB.videos[0].bg) }),
        el('div', { class: 'vc-overlay', style: { background: 'linear-gradient(180deg, rgba(239,68,68,0.5), rgba(0,0,0,0.7))' } }, [
          el('span', { style: { background: '#ef4444', padding: '2px 6px', borderRadius: '4px', marginEnd: '6px', fontSize: '10px' } }, 'مباشر'),
          document.createTextNode(fmt(l.viewer_count || l.viewers || 0) + ' 👁'),
        ]),
      ])));
    }
    render(DB.lives);
    (async () => { try { if (window.API) render(await window.API.fetchLiveStreams()); } catch (e) {} })();
    return root;
  };

  V.live = (params) => {
    hideNav();
    const liveId = params.id;
    let live = DB.lives.find(l => l.id === liveId) || DB.lives[0];
    const root = el('section', { class: 'live-viewer' });

    // Real Agora video container — covers full screen behind everything else
    const videoContainer = el('div', { id: 'agora-viewer-video', style: { position: 'absolute', inset: 0, background: '#000', zIndex: 0 } });
    root.appendChild(videoContainer);

    // Fallback background image (shown until Agora video subscribes)
    root.appendChild(el('div', { class: 'live-bg', style: { backgroundImage: `url(${live.bg})`, zIndex: 1 } }));
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

    // Floating heart layer (TikTok-style)
    const floatLayer = el('div', { class: 'live-float-layer', style: { position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 5 } });
    ov.appendChild(floatLayer);

    function floatHeart(emoji = '❤️') {
      const h = el('div', { textContent: emoji, style: {
        position: 'absolute', bottom: '70px', insetInlineEnd: (40 + Math.random() * 40) + 'px',
        fontSize: '28px', opacity: '1', transition: 'transform 2.4s ease-out, opacity 2.4s ease-out',
        transform: 'translateY(0) scale(1)', filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.6))',
      } });
      floatLayer.appendChild(h);
      requestAnimationFrame(() => {
        h.style.transform = `translateY(-${300 + Math.random() * 200}px) translateX(${(Math.random() - 0.5) * 80}px) scale(${0.8 + Math.random() * 0.6})`;
        h.style.opacity = '0';
      });
      setTimeout(() => h.remove(), 2500);
    }

    function floatGift(emoji, name, fromName) {
      // Big animated banner that flies in from the bottom-end of the screen
      const banner = el('div', { style: {
        position: 'absolute', bottom: '100px', insetInlineEnd: '14px',
        background: 'linear-gradient(90deg, rgba(255,215,0,0.95), rgba(255,140,0,0.95))',
        color: '#000', padding: '8px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: 700,
        boxShadow: '0 6px 20px rgba(0,0,0,0.4)', display: 'flex', gap: '8px', alignItems: 'center',
        transform: 'translateX(120%)', transition: 'transform 360ms ease-out, opacity 320ms ease-in',
        zIndex: 6,
      } }, [
        el('span', { style: { fontSize: '24px' } }, emoji),
        el('div', { style: { display: 'flex', flexDirection: 'column', gap: '0' } }, [
          el('div', {}, fromName || 'مستخدم'),
          el('div', { style: { fontSize: '11px', fontWeight: 500, opacity: 0.85 } }, 'أرسل ' + name),
        ]),
      ]);
      floatLayer.appendChild(banner);
      requestAnimationFrame(() => { banner.style.transform = 'translateX(0)'; });
      setTimeout(() => { banner.style.opacity = '0'; }, 3500);
      setTimeout(() => banner.remove(), 4000);

      // Big emoji flying up the center
      const big = el('div', { textContent: emoji, style: {
        position: 'absolute', bottom: '40%', insetInlineStart: '50%', transform: 'translateX(-50%) scale(0.3)',
        fontSize: '120px', opacity: '0', transition: 'all 1.6s cubic-bezier(0.34, 1.56, 0.64, 1)', zIndex: 5,
        filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))',
      } });
      floatLayer.appendChild(big);
      requestAnimationFrame(() => {
        big.style.opacity = '1'; big.style.transform = 'translateX(-50%) scale(1.2)';
      });
      setTimeout(() => { big.style.opacity = '0'; big.style.transform = 'translateX(-50%) scale(1.6) translateY(-100px)'; }, 1100);
      setTimeout(() => big.remove(), 1700);
    }

    ov.appendChild(el('div', { class: 'live-bottom' }, [
      el('input', { placeholder: 'أرسل تعليقًا...' }),
      el('button', { class: 'icon-btn', html: icons.gift, onclick: () => openGiftSheet() }),
      el('button', { class: 'icon-btn', html: icons.heart, onclick: () => {
        // Emit a few hearts (TikTok rapid-tap feel)
        for (let i = 0; i < 4; i++) setTimeout(floatHeart, i * 80, ['❤️', '💖', '💕', '💗', '✨'][Math.floor(Math.random() * 5)]);
      } }),
      el('button', { class: 'icon-btn', html: icons.share, onclick: () => go('/share/' + live.id) }),
    ]));
    root.appendChild(ov);

    async function openGiftSheet() {
      const sheet = el('div', { class: 'gift-sheet' });
      const close = () => { sheet.remove(); bd.remove(); };
      const bd = el('div', { class: 'backdrop', onclick: close });
      // Live balance
      let balance = DB.wallet.balance;
      try { if (window.API) { const w = await window.API.fetchWallet(); balance = w.balance || 0; } } catch (e) {}
      const balLabel = el('span', { class: 'b' }, '🪙 ' + balance);
      sheet.appendChild(el('div', { class: 'wallet-balance' }, [
        el('strong', {}, 'الهدايا'),
        balLabel,
      ]));
      // Live gifts catalog
      let catalog = DB.gifts;
      try { if (window.API) { const c = await window.API.fetchGiftCatalog(); if (c.length) catalog = c.map(g => ({ id: g.id, name: g.name, emoji: g.emoji, price: g.price })); } } catch (e) {}
      const grid = el('div', { class: 'gift-grid' });
      catalog.forEach(g => grid.appendChild(el('button', { class: 'gift-card', onclick: async () => {
        if (balance < g.price) { toast('رصيد غير كافٍ — اشحن المحفظة'); return; }
        try {
          if (window.API && live.host && live.host.id) {
            await window.API.sendGift({ toUserId: live.host.id, giftId: g.id, liveStreamId: typeof live.id === 'string' && live.id.length > 30 ? live.id : null });
          }
          balance -= g.price; balLabel.textContent = '🪙 ' + balance;
          // Big TikTok-style gift animation
          const me = (window.SB && (await window.SB.getUser())) || null;
          floatGift(g.emoji, g.name, (me && me.user_metadata && me.user_metadata.name) || 'أنت');
          close();
        } catch (e) { toast(e.message || 'تعذر إرسال الهدية'); }
      } }, [
        el('div', { class: 'emoji' }, g.emoji),
        el('div', { style: { fontSize: '11px' } }, g.name),
        el('div', { class: 'price' }, '🪙 ' + g.price),
      ])));
      sheet.appendChild(grid);
      document.body.appendChild(bd);
      document.body.appendChild(sheet);
    }

    // ─── Agora viewer subscription ───
    let viewerSession = null;
    let hostSession = window._ttAgoraHostSession;
    let isHost = window._ttAgoraHostLiveId === liveId;

    (async () => {
      try {
        if (!window.Agora || !window.Agora.isConfigured()) return;
        if (isHost) {
          // We're the host — preview already running, just keep it alive
          return;
        }
        viewerSession = await window.Agora.startViewer({
          channel: liveId,
          videoEl: videoContainer,
          onPlayers: (users) => {
            // Hide background image once we have a host video
            if (users && users.length) {
              videoContainer.style.zIndex = '2';
            }
          },
        });
      } catch (e) { console.warn('agora viewer:', e); }
    })();

    // Stop on navigate away
    window.addEventListener('hashchange', async () => {
      if (viewerSession) try { await viewerSession.stop(); } catch (_) {}
      if (isHost && hostSession) {
        try {
          await hostSession.stop();
          if (window.API) await window.API.endLive(liveId).catch(() => {});
        } catch (_) {}
        window._ttAgoraHostSession = null;
        window._ttAgoraHostLiveId = null;
      }
    }, { once: true });

    return root;
  };

  // ===== Map (with live location) =====
  V.map = () => {
    hideNav();
    const root = el('section', { class: 'map-screen' });
    root.appendChild(el('div', { class: 'map-bg' }));
    root.appendChild(el('div', { class: 'map-overlay-bg' }));
    root.appendChild(el('div', { class: 'map-controls' }, [
      el('button', { class: 'icon-btn', style: { background: '#fff' }, html: icons.chevR, onclick: () => back() }),
      el('button', { class: 'icon-btn', style: { background: '#fff' }, html: icons.settings, onclick: () => go('/settings') }),
    ]));

    // Bounding box for projecting lat/lng to screen 0-100% (Saudi-Arabia centered fallback)
    const view = { minLat: 22, maxLat: 28, minLng: 42, maxLng: 50 };
    function project(lat, lng) {
      const x = Math.max(5, Math.min(95, ((lng - view.minLng) / (view.maxLng - view.minLng)) * 100));
      const y = Math.max(8, Math.min(92, 100 - ((lat - view.minLat) / (view.maxLat - view.minLat)) * 100));
      return { x, y };
    }

    function pinEl(profile, lat, lng) {
      const { x, y } = project(lat, lng);
      return el('div', { class: 'map-pin', style: { left: x + '%', top: y + '%' }, onclick: () => go('/profile/' + profile.id) }, [
        el('div', { class: 'avatar' }, [Object.assign(document.createElement('img'), { src: profile.avatar_url || profile.avatar || '' })]),
        el('div', { class: 'arrow' }),
      ]);
    }

    // Default mock pins (no real GPS yet)
    DB.users.slice(0, 6).forEach((u, i) => {
      root.appendChild(el('div', { class: 'map-pin', style: { left: (15 + (i * 13) % 70) + '%', top: (25 + (i * 17) % 55) + '%' }, onclick: () => go('/profile/' + u.id) }, [
        el('div', { class: 'avatar' }, [Object.assign(document.createElement('img'), { src: u.avatar })]),
        el('div', { class: 'arrow' }),
      ]));
    });

    root.appendChild(el('div', { class: 'map-bottom' }, [
      el('button', { class: 'map-fab' }, [svg('user'), document.createTextNode(' الأصدقاء')]),
      el('button', { class: 'map-fab' }, [svg('sparkle'), document.createTextNode(' الشائع')]),
    ]));

    // Real geolocation: ask permission, push every 30s, fetch friends
    let watchId = null;
    let unsub = null;
    (async () => {
      if (!navigator.geolocation || !window.API) return;
      try {
        // Push my location
        navigator.geolocation.getCurrentPosition(async pos => {
          try { await window.API.upsertLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy, sharing_enabled: true }); } catch (e) {}
        }, () => {}, { enableHighAccuracy: false, maximumAge: 30000, timeout: 10000 });
        watchId = navigator.geolocation.watchPosition(async pos => {
          try { await window.API.upsertLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy, sharing_enabled: true }); } catch (e) {}
        }, () => {}, { maximumAge: 30000 });

        // Render friends + approved-tracked users
        async function refresh() {
          try {
            const [friends, tracked] = await Promise.all([
              window.API.fetchFriendLocations(),
              window.API.fetchTrackedLocations(),
            ]);
            // remove existing pins (except controls)
            root.querySelectorAll('.map-pin').forEach(n => n.remove());
            const trackedIds = new Set(tracked.map(t => t.user_id));
            // Friends (green)
            friends.forEach(l => {
              if (l.lat == null || l.lng == null || trackedIds.has(l.user_id)) return;
              const pin = pinEl(l.profiles || { id: l.user_id }, l.lat, l.lng);
              root.appendChild(pin);
            });
            // Tracked-via-permit (purple border to distinguish)
            tracked.forEach(l => {
              if (l.lat == null || l.lng == null) return;
              const pin = pinEl(l.profiles || { id: l.user_id }, l.lat, l.lng);
              const av = pin.querySelector('.avatar');
              if (av) av.style.borderColor = 'var(--primary)';
              root.appendChild(pin);
            });
          } catch (e) {}
        }
        await refresh();
        unsub = window.API.subscribeToFriendLocations(() => refresh());
      } catch (e) { console.warn('location:', e); }
    })();

    window.addEventListener('hashchange', () => {
      try { if (watchId) navigator.geolocation.clearWatch(watchId); } catch (e) {}
      try { if (unsub) unsub(); } catch (e) {}
    }, { once: true });

    return root;
  };

  // ===== Wallet =====
  V.wallet = () => {
    hideNav();
    const root = el('section', { class: 'wallet-screen' });
    root.appendChild(topBar({ title: 'المحفظة' }));
    const balanceEl = el('div', { class: 'amount' }, ['🪙 ', String(DB.wallet.balance)]);
    root.appendChild(el('div', { class: 'wallet-card' }, [
      el('div', { class: 'label' }, 'الرصيد المتاح'),
      balanceEl,
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
      const items = DB.wallet.transactions.filter(t => active === 'all' || t.type === active);
      if (!items.length) { list.appendChild(el('div', { class: 'empty-state', style: { padding: '40px', textAlign: 'center', color: 'var(--muted)' } }, 'لا توجد عمليات')); return; }
      items.forEach(t => list.appendChild(el('div', { class: 'tx-row' }, [
        el('div', { class: 'tx-icon ' + (['in', 'gift_received', 'topup'].includes(t.type) ? 'in' : 'out'), html: ['in', 'gift_received', 'topup'].includes(t.type) ? icons.download : icons.upload }),
        el('div', { class: 'tx-body' }, [el('div', { class: 'tx-title' }, t.title || t.description), el('div', { class: 'tx-sub' }, (t.sub || '') + ' · ' + (t.time || ''))]),
        el('div', { class: 'tx-amt ' + (['in', 'gift_received', 'topup'].includes(t.type) ? 'in' : 'out') }, (['in', 'gift_received', 'topup'].includes(t.type) ? '+' : '-') + t.amount + ' 🪙'),
      ])));
    }
    rebuild();
    root.appendChild(list);

    // Async: real wallet
    (async () => {
      try {
        if (!window.API) return;
        const w = await window.API.fetchWallet();
        balanceEl.textContent = '🪙 ' + (w.balance || 0);
        const tx = await window.API.fetchWalletTx('all');
        DB.wallet.transactions = tx.map(t => ({
          id: t.id,
          type: t.type, // topup | gift_sent | gift_received | withdrawal
          title: t.description || t.type,
          sub: '',
          amount: t.amount,
          time: new Date(t.created_at).toLocaleString('ar-SA', { dateStyle: 'short', timeStyle: 'short' }),
        }));
        rebuild();
      } catch (e) { console.warn('wallet:', e); }
    })();
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
    function makeToggle(initialOn, onChange) {
      const t = el('div', { class: 'toggle' + (initialOn ? ' on' : ''), onclick: async e => {
        e.stopPropagation();
        t.classList.toggle('on');
        const on = t.classList.contains('on');
        try { await onChange(on); }
        catch (err) { t.classList.toggle('on'); toast(err.message || 'تعذر التحديث'); }
      } });
      return t;
    }

    // ── Account ──
    section('الحساب', [
      { icon: 'user', label: 'تعديل البروفايل', onclick: () => go('/profile/edit') },
      { icon: 'lock', label: 'تغيير كلمة المرور', onclick: async () => {
        const np = prompt('كلمة المرور الجديدة (8 أحرف على الأقل):');
        if (!np) return;
        if (np.length < 8) return toast('كلمة المرور قصيرة جدًا');
        try { await window.SB.updatePassword(np); toast('تم التحديث'); }
        catch (e) { toast(e.message); }
      } },
      { icon: 'mail', label: 'تغيير البريد الإلكتروني', onclick: async () => {
        const e = prompt('البريد الإلكتروني الجديد:');
        if (!e) return;
        try { const c = await window.SB.client(); await c.auth.updateUser({ email: e.trim() }); toast('تحقق من بريدك الجديد للتأكيد'); }
        catch (err) { toast(err.message); }
      } },
      { icon: 'wallet', label: 'المحفظة', onclick: () => go('/wallet') },
    ]);

    // ── Privacy ──
    section('الخصوصية والأمان', [
      { icon: 'eye', label: 'الحساب خاص', right: makeToggle(false, async () => toast('قريبًا — يحتاج عمود في profiles')) },
      { icon: 'user', label: 'من يمكنه مراسلتي', right: el('span', { class: 'muted' }, 'الجميع') },
      { icon: 'comment', label: 'من يمكنه التعليق', right: el('span', { class: 'muted' }, 'الجميع') },
      { icon: 'lock', label: 'المستخدمون المحظورون', onclick: () => toast('قريبًا — قائمة الحظر') },
      { icon: 'flag', label: 'مراجعة طلبات تتبع موقعي', onclick: async () => {
        try {
          const incoming = await window.API.fetchIncomingPermits();
          if (!incoming.length) return toast('لا توجد طلبات جديدة');
          toast(incoming.length + ' طلب — راجعها من شاشة الإشعارات');
        } catch (e) { toast(e.message); }
      } },
    ]);

    // ── Notifications ──
    section('الإشعارات', [
      { icon: 'heart', label: 'الإعجابات', right: makeToggle(true, async () => {}) },
      { icon: 'comment', label: 'التعليقات', right: makeToggle(true, async () => {}) },
      { icon: 'user', label: 'المتابعون الجدد', right: makeToggle(true, async () => {}) },
      { icon: 'mail', label: 'الرسائل', right: makeToggle(true, async () => {}) },
      { icon: 'video', label: 'البثوث المباشرة', right: makeToggle(true, async () => {}) },
      { icon: 'gift', label: 'الهدايا', right: makeToggle(true, async () => {}) },
    ]);

    // ── Content & Display ──
    section('المحتوى والعرض', [
      { icon: 'globe', label: 'اللغة', right: el('span', { class: 'muted' }, 'العربية') },
      { icon: 'sparkle', label: 'الوضع الداكن', right: makeToggle(true, async () => toast('قريبًا')) },
      { icon: 'video', label: 'تشغيل تلقائي للفيديو', right: makeToggle(true, async () => {}) },
      { icon: 'eye', label: 'حفظ بيانات الإنترنت', right: makeToggle(false, async () => {}) },
    ]);

    // ── Location ──
    section('الموقع الجغرافي', [
      { icon: 'map', label: 'خريطة الأصدقاء', onclick: () => go('/map') },
      { icon: 'map', label: 'مشاركة موقعي مع', right: el('span', { class: 'muted' }, 'الأصدقاء') },
      { icon: 'map', label: 'تفعيل مشاركة الموقع', right: makeToggle(false, async (on) => {
        if (!window.API) return;
        await window.API.setLocationVisibility(on ? 'friends' : 'none');
        toast(on ? 'تمت مشاركة موقعك' : 'تم إيقاف المشاركة');
      }) },
    ]);

    // ── Support & Legal ──
    section('الدعم والقانوني', [
      { icon: 'flag', label: 'الإبلاغ عن مشكلة' },
      { icon: 'mail', label: 'تواصل معنا', onclick: () => window.location.href = 'mailto:support@tenthtone.app' },
      { icon: 'globe', label: 'الشروط وسياسة الخصوصية', onclick: () => window.open('https://github.com/meeranpmo-svg/Tiktok/blob/main/PRIVACY.md', '_blank') },
      { icon: 'sparkle', label: 'حول التطبيق', right: el('span', { class: 'muted' }, 'الإصدار 1.0.0') },
    ]);

    // ── Danger ──
    section('منطقة الخطر', [
      { icon: 'x', label: 'حذف الحساب نهائيًا', onclick: async () => {
        if (!confirm('هل أنت متأكد من حذف حسابك؟ لا يمكن التراجع عن هذا الإجراء.')) return;
        toast('قريبًا — حذف الحساب يحتاج Edge Function');
      } },
    ]);

    // Admin section — only renders if the signed-in user has is_admin = true
    (async () => {
      try {
        if (!window.API) return;
        const isAdmin = await window.API.adminCheckIsAdmin();
        if (!isAdmin) return;
        const adminSec = el('div', { class: 'settings-section', style: { background: 'var(--primary-soft)' } });
        adminSec.appendChild(el('h3', { style: { color: 'var(--primary)' } }, 'الإدارة'));
        const item = el('div', { class: 'settings-item', onclick: () => { window.location.href = '/admin'; } }, [
          el('span', { class: 'si-icon', style: { background: 'var(--primary)', color: '#fff' }, html: icons.settings }),
          el('span', { class: 'si-text', style: { fontWeight: 700 } }, 'فتح لوحة التحكم الإدارية'),
          el('span', { class: 'chev', html: icons.chevL }),
        ]);
        adminSec.appendChild(item);
        // Insert before the logout section
        root.insertBefore(adminSec, root.lastElementChild);
      } catch (e) { /* not admin or API failed */ }
    })();

    const logout = el('div', { class: 'settings-section' });
    logout.appendChild(el('div', { class: 'settings-item', onclick: async () => { try { await window.SB.signOut(); } catch (e) {} go('/login'); toast('تم تسجيل الخروج'); } }, [
      el('span', { class: 'si-text', style: { color: 'var(--danger)', textAlign: 'center', fontWeight: 700 } }, 'تسجيل الخروج'),
    ]));
    root.appendChild(logout);
    return root;
  };

  // Map view ID alias
  V.locationMap = V.map;
})();
