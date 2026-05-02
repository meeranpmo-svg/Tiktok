/* === Mock data store === */
window.DB = (function () {
  const NAMES = ['أحمد', 'محمد', 'سارة', 'فاطمة', 'علي', 'يوسف', 'خالد', 'نورة', 'ريم', 'عبدالله', 'مريم', 'سلمان', 'ليلى', 'هند', 'زياد', 'منى'];
  const HANDLES = ['ahmed.m', 'mhmd99', 'sarah_x', 'fatima.z', 'ali.k', 'yusuf', 'khaled', 'nora', 'reem', 'abdullah', 'maryam', 'salman', 'layla', 'hind', 'ziyad', 'mona'];
  const BIOS = [
    'صانع محتوى ✨ | الرياض',
    'كرة قدم ⚽ | شغف ال يتوقف',
    'مدونة طعام 🍰',
    'مصمم رسوميات • 🎨',
    'مهندس برمجيات 💻',
    'محبة للسفر 🌍',
    'الحياة جميلة 💫',
    'مغني وعازف عود 🎶',
  ];

  const users = NAMES.map((n, i) => ({
    id: 'u' + (i + 1),
    name: n,
    handle: '@' + HANDLES[i % HANDLES.length],
    avatar: `https://i.pravatar.cc/200?u=user-${i + 1}`,
    bio: BIOS[i % BIOS.length],
    followers: 1200 + i * 137,
    following: 80 + i * 9,
    likes: 4500 + i * 311,
    verified: i % 5 === 0,
  }));

  // Current user
  const me = {
    id: 'me',
    name: 'أنت',
    handle: '@me',
    avatar: 'https://i.pravatar.cc/200?u=me',
    bio: 'نبذة قصيرة عنك ✨',
    followers: 240,
    following: 318,
    likes: 1240,
  };

  const VIDEO_BG = [
    'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=900&q=70',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900&q=70',
    'https://images.unsplash.com/photo-1500336624523-d727130c3328?w=900&q=70',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900&q=70',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=900&q=70',
    'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=900&q=70',
    'https://images.unsplash.com/photo-1483721310020-03333e577078?w=900&q=70',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900&q=70',
    'https://images.unsplash.com/photo-1502323777036-f29e3972d82f?w=900&q=70',
    'https://images.unsplash.com/photo-1493612276216-ee3925520721?w=900&q=70',
    'https://images.unsplash.com/photo-1496337589254-7e19d01cec44?w=900&q=70',
    'https://images.unsplash.com/photo-1518050227004-c4cb7104d79a?w=900&q=70',
  ];

  const DESC = [
    'يوم جميل في الرياض 🌅 #حياتنا #الرياض',
    'وصفتي المفضلة 🍰 جربوها وأخبروني! #طبخ',
    'تدريب اليوم 💪 #كرة_قدم #هدف',
    'رحلة العمر 🌍 #سفر #ذكريات',
    'لحن جديد 🎶 #موسيقى',
    'تجربتي مع الكتب 📚 #قراءة',
    'ضحكة الصباح ☀️ #يوم_جديد',
    'أناقة بسيطة 👜 #موضة',
    'القهوة قبل أي شيء ☕',
    'مغامرة ال تُنسى ⛰️ #جبال',
    'تصوير ليلي ✨ #تصوير',
    'لحظة هادئة 🌊 #بحر',
  ];

  const MUSIC = [
    'الأصلي - ' + NAMES[0],
    'هزّة - ' + NAMES[1],
    'صوت من ذكرى - ' + NAMES[2],
    'خفقات - ' + NAMES[3],
  ];

  const videos = VIDEO_BG.map((bg, i) => ({
    id: 'v' + (i + 1),
    user: users[i % users.length],
    bg,
    desc: DESC[i % DESC.length],
    music: MUSIC[i % MUSIC.length],
    likes: 1200 + i * 230,
    comments: 80 + i * 17,
    shares: 30 + i * 5,
    saves: 60 + i * 9,
    liked: false,
    saved: false,
  }));

  const COMMENTS_SEED = [
    'شيء جميل! 🔥', 'محتوى رائع', 'تتابع؟', 'احب فيديوهاتك', 'أين هذا المكان؟',
    'شكراً للمشاركة', 'استمر 💪', 'خرافي', 'يا سلام!', 'أعجبني كثيراً',
  ];

  const comments = (videoId) => {
    const out = [];
    const n = 6 + (parseInt(videoId.replace('v', '')) % 5);
    for (let i = 0; i < n; i++) {
      out.push({
        id: videoId + '-c' + i,
        user: users[(i * 3) % users.length],
        text: COMMENTS_SEED[i % COMMENTS_SEED.length],
        likes: (i * 7) % 40,
        time: ['الآن', 'دقيقة', '5د', '17د', '1س', '3س', 'أمس', 'أسبوع'][i % 8],
      });
    }
    return out;
  };

  const chats = users.slice(0, 8).map((u, i) => ({
    id: 'chat-' + u.id,
    user: u,
    unread: i < 3 ? (i + 1) : 0,
    online: i % 3 === 0,
    last: ['شكراً!', 'تمام نلتقي بكره', 'هل تابعت الفيديو؟', '😂😂', 'ضحكتني والله', 'تمت العملية', 'إن شاء الله', 'وانت من اهله'][i % 8],
    time: ['10:24', 'أمس', 'أمس', 'الإثنين', 'الأحد', '5/3', '4/3', '1/3'][i % 8],
    messages: [
      { id: 'm1', from: u.id, text: 'هلا والله، كيفك؟', time: '10:14' },
      { id: 'm2', from: 'me', text: 'تمام والله، انت كيفك؟', time: '10:16' },
      { id: 'm3', from: u.id, text: 'الحمدلله بخير 😊', time: '10:18' },
      { id: 'm4', from: 'me', text: 'شفت آخر فيديو رفعته؟', time: '10:21' },
      { id: 'm5', from: u.id, text: 'إيه شفته! خرافي 🔥', time: '10:22', },
      { id: 'm6', from: u.id, text: 'تمام نلتقي بكره', time: '10:24' },
    ],
  }));

  const notifications = [
    { id: 'n1', type: 'like', user: users[0], text: 'أعجبه الفيديو الخاص بك', time: 'منذ 5 دقائق' },
    { id: 'n2', type: 'follow', user: users[1], text: 'بدأ بمتابعتك', time: 'منذ 12 دقيقة' },
    { id: 'n3', type: 'comment', user: users[2], text: 'علّق: "شيء جميل!"', time: 'منذ 30 دقيقة' },
    { id: 'n4', type: 'like', user: users[3], text: 'و 23 آخرون أعجبوا بالتعليق', time: 'منذ ساعة' },
    { id: 'n5', type: 'mention', user: users[4], text: 'ذكرك في تعليق', time: 'أمس' },
    { id: 'n6', type: 'follow', user: users[5], text: 'بدأ بمتابعتك', time: 'أمس' },
    { id: 'n7', type: 'system', user: { name: 'النظام', avatar: '' }, text: 'تم تحديث الشروط والأحكام', time: 'منذ 3 أيام' },
  ];

  const wallet = {
    balance: 1240,
    transactions: [
      { id: 't1', type: 'in', title: 'هدية من ' + users[0].name, sub: 'وردة 🌹', amount: 50, time: 'اليوم 11:24' },
      { id: 't2', type: 'in', title: 'هدية من ' + users[1].name, sub: 'قلب 💖', amount: 100, time: 'اليوم 09:12' },
      { id: 't3', type: 'out', title: 'إرسال هدية لـ ' + users[2].name, sub: 'تاج 👑', amount: 200, time: 'أمس' },
      { id: 't4', type: 'in', title: 'شحن محفظة', sub: 'بطاقة بنكية', amount: 500, time: 'الإثنين' },
      { id: 't5', type: 'in', title: 'هدية من ' + users[3].name, sub: 'نجمة ⭐', amount: 30, time: '5/4' },
      { id: 't6', type: 'out', title: 'سحب أرباح', sub: 'حساب بنكي', amount: 800, time: '1/4' },
    ],
  };

  const gifts = [
    { id: 'g1', name: 'وردة', emoji: '🌹', price: 1 },
    { id: 'g2', name: 'قلب', emoji: '💖', price: 5 },
    { id: 'g3', name: 'نجمة', emoji: '⭐', price: 10 },
    { id: 'g4', name: 'كأس', emoji: '🏆', price: 50 },
    { id: 'g5', name: 'تاج', emoji: '👑', price: 200 },
    { id: 'g6', name: 'صاروخ', emoji: '🚀', price: 500 },
    { id: 'g7', name: 'يخت', emoji: '🛥️', price: 1000 },
    { id: 'g8', name: 'سيارة', emoji: '🏎️', price: 2000 },
  ];

  const trending = [
    { tag: '#رمضان', meta: '12.4M فيديو' },
    { tag: '#الرياض', meta: '8.2M فيديو' },
    { tag: '#طبخات', meta: '5.6M فيديو' },
    { tag: '#كرة_قدم', meta: '3.1M فيديو' },
    { tag: '#قراءة', meta: '1.8M فيديو' },
  ];

  // Live streams (host avatars)
  const lives = users.slice(0, 6).map((u, i) => ({
    id: 'live-' + u.id,
    host: u,
    viewers: 200 + i * 137,
    title: ['دردشة سريعة', 'جلسة موسيقى 🎶', 'اسئلوني!', 'تجربة وصفة', 'جولة في الرياض', 'لعبة جماعية'][i % 6],
    bg: VIDEO_BG[i % VIDEO_BG.length],
  }));

  return { users, me, videos, comments, chats, notifications, wallet, gifts, trending, lives };
})();
