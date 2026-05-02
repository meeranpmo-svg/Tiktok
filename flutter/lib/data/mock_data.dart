import 'models/models.dart';

class MockDB {
  MockDB._();

  static const _names = ['أحمد', 'محمد', 'سارة', 'فاطمة', 'علي', 'يوسف', 'خالد', 'نورة', 'ريم', 'عبدالله', 'مريم', 'سلمان', 'ليلى', 'هند', 'زياد', 'منى'];
  static const _handles = ['ahmed.m', 'mhmd99', 'sarah_x', 'fatima.z', 'ali.k', 'yusuf', 'khaled', 'nora', 'reem', 'abdullah', 'maryam', 'salman', 'layla', 'hind', 'ziyad', 'mona'];
  static const _bios = [
    'صانع محتوى ✨ | الرياض',
    'كرة قدم ⚽ | شغف لا يتوقف',
    'مدونة طعام 🍰',
    'مصمم رسوميات • 🎨',
    'مهندس برمجيات 💻',
    'محبة للسفر 🌍',
    'الحياة جميلة 💫',
    'مغني وعازف عود 🎶',
  ];

  static final List<AppUser> users = List.generate(_names.length, (i) {
    return AppUser(
      id: 'u${i + 1}',
      name: _names[i],
      handle: '@${_handles[i % _handles.length]}',
      avatar: 'https://i.pravatar.cc/200?u=user-${i + 1}',
      bio: _bios[i % _bios.length],
      followers: 1200 + i * 137,
      following: 80 + i * 9,
      likes: 4500 + i * 311,
      verified: i % 5 == 0,
    );
  });

  static const me = AppUser(
    id: 'me',
    name: 'أنت',
    handle: '@me',
    avatar: 'https://i.pravatar.cc/200?u=me',
    bio: 'نبذة قصيرة عنك ✨',
    followers: 240,
    following: 318,
    likes: 1240,
  );

  static const _videoBg = [
    'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=900&q=70',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900&q=70',
    'https://images.unsplash.com/photo-1500336624523-d727130c3328?w=900&q=70',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900&q=70',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=900&q=70',
    'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=900&q=70',
    'https://images.unsplash.com/photo-1483721310020-03333e577078?w=900&q=70',
    'https://images.unsplash.com/photo-1502323777036-f29e3972d82f?w=900&q=70',
    'https://images.unsplash.com/photo-1493612276216-ee3925520721?w=900&q=70',
    'https://images.unsplash.com/photo-1496337589254-7e19d01cec44?w=900&q=70',
    'https://images.unsplash.com/photo-1518050227004-c4cb7104d79a?w=900&q=70',
  ];

  static const _desc = [
    'يوم جميل في الرياض 🌅 #حياتنا #الرياض',
    'وصفتي المفضلة 🍰 جربوها وأخبروني! #طبخ',
    'تدريب اليوم 💪 #كرة_قدم #هدف',
    'رحلة العمر 🌍 #سفر #ذكريات',
    'لحن جديد 🎶 #موسيقى',
    'تجربتي مع الكتب 📚 #قراءة',
    'ضحكة الصباح ☀️ #يوم_جديد',
    'أناقة بسيطة 👜 #موضة',
    'القهوة قبل أي شيء ☕',
    'مغامرة لا تُنسى ⛰️ #جبال',
    'تصوير ليلي ✨ #تصوير',
  ];

  static final List<String> _music = [
    'الأصلي - ${_names[0]}',
    'هزّة - ${_names[1]}',
    'صوت من ذكرى - ${_names[2]}',
    'خفقات - ${_names[3]}',
  ];

  static final List<Video> videos = List.generate(_videoBg.length, (i) {
    return Video(
      id: 'v${i + 1}',
      user: users[i % users.length],
      bg: _videoBg[i],
      desc: _desc[i % _desc.length],
      music: _music[i % _music.length],
      likes: 1200 + i * 230,
      comments: 80 + i * 17,
      shares: 30 + i * 5,
      saves: 60 + i * 9,
    );
  });

  static List<Map<String, dynamic>> commentsFor(String videoId) {
    final n = 6 + (int.tryParse(videoId.replaceFirst('v', '')) ?? 1) % 5;
    const seed = ['شيء جميل! 🔥', 'محتوى رائع', 'تتابع؟', 'احب فيديوهاتك', 'أين هذا المكان؟', 'شكراً للمشاركة', 'استمر 💪', 'خرافي', 'يا سلام!', 'أعجبني كثيراً'];
    const times = ['الآن', 'دقيقة', '5د', '17د', '1س', '3س', 'أمس', 'أسبوع'];
    return List.generate(n, (i) => {
          'id': '$videoId-c$i',
          'user': users[(i * 3) % users.length],
          'text': seed[i % seed.length],
          'likes': (i * 7) % 40,
          'time': times[i % times.length],
        });
  }

  static final List<Chat> chats = List.generate(8, (i) {
    final u = users[i];
    return Chat(
      id: 'chat-${u.id}',
      user: u,
      unread: i < 3 ? i + 1 : 0,
      online: i % 3 == 0,
      last: ['شكراً!', 'تمام نلتقي بكره', 'هل تابعت الفيديو؟', '😂😂', 'ضحكتني والله', 'تمت العملية', 'إن شاء الله', 'وانت من اهله'][i % 8],
      time: ['10:24', 'أمس', 'أمس', 'الإثنين', 'الأحد', '5/3', '4/3', '1/3'][i % 8],
      messages: [
        ChatMessage(id: 'm1', from: u.id, text: 'هلا والله، كيفك؟', time: '10:14'),
        const ChatMessage(id: 'm2', from: 'me', text: 'تمام والله، انت كيفك؟', time: '10:16'),
        ChatMessage(id: 'm3', from: u.id, text: 'الحمدلله بخير 😊', time: '10:18'),
        const ChatMessage(id: 'm4', from: 'me', text: 'شفت آخر فيديو رفعته؟', time: '10:21'),
        ChatMessage(id: 'm5', from: u.id, text: 'إيه شفته! خرافي 🔥', time: '10:22'),
        ChatMessage(id: 'm6', from: u.id, text: 'تمام نلتقي بكره', time: '10:24'),
      ],
    );
  });

  static final List<AppNotification> notifications = [
    AppNotification(id: 'n1', type: 'like', userName: users[0].name, avatar: users[0].avatar, text: 'أعجبه الفيديو الخاص بك', time: 'منذ 5 دقائق'),
    AppNotification(id: 'n2', type: 'follow', userName: users[1].name, avatar: users[1].avatar, text: 'بدأ بمتابعتك', time: 'منذ 12 دقيقة'),
    AppNotification(id: 'n3', type: 'comment', userName: users[2].name, avatar: users[2].avatar, text: 'علّق: "شيء جميل!"', time: 'منذ 30 دقيقة'),
    AppNotification(id: 'n4', type: 'like', userName: users[3].name, avatar: users[3].avatar, text: 'و 23 آخرون أعجبوا بالتعليق', time: 'منذ ساعة'),
    AppNotification(id: 'n5', type: 'mention', userName: users[4].name, avatar: users[4].avatar, text: 'ذكرك في تعليق', time: 'أمس'),
    AppNotification(id: 'n6', type: 'follow', userName: users[5].name, avatar: users[5].avatar, text: 'بدأ بمتابعتك', time: 'أمس'),
    const AppNotification(id: 'n7', type: 'system', userName: 'النظام', avatar: '', text: 'تم تحديث الشروط والأحكام', time: 'منذ 3 أيام'),
  ];

  static int walletBalance = 1240;

  static List<TxRow> walletTx = [
    TxRow(id: 't1', type: 'in', title: 'هدية من ${users[0].name}', sub: 'وردة 🌹', amount: 50, time: 'اليوم 11:24'),
    TxRow(id: 't2', type: 'in', title: 'هدية من ${users[1].name}', sub: 'قلب 💖', amount: 100, time: 'اليوم 09:12'),
    TxRow(id: 't3', type: 'out', title: 'إرسال هدية لـ ${users[2].name}', sub: 'تاج 👑', amount: 200, time: 'أمس'),
    const TxRow(id: 't4', type: 'in', title: 'شحن محفظة', sub: 'بطاقة بنكية', amount: 500, time: 'الإثنين'),
    TxRow(id: 't5', type: 'in', title: 'هدية من ${users[3].name}', sub: 'نجمة ⭐', amount: 30, time: '5/4'),
    const TxRow(id: 't6', type: 'out', title: 'سحب أرباح', sub: 'حساب بنكي', amount: 800, time: '1/4'),
  ];

  static const List<Gift> gifts = [
    Gift(id: 'g1', name: 'وردة', emoji: '🌹', price: 1),
    Gift(id: 'g2', name: 'قلب', emoji: '💖', price: 5),
    Gift(id: 'g3', name: 'نجمة', emoji: '⭐', price: 10),
    Gift(id: 'g4', name: 'كأس', emoji: '🏆', price: 50),
    Gift(id: 'g5', name: 'تاج', emoji: '👑', price: 200),
    Gift(id: 'g6', name: 'صاروخ', emoji: '🚀', price: 500),
    Gift(id: 'g7', name: 'يخت', emoji: '🛥️', price: 1000),
    Gift(id: 'g8', name: 'سيارة', emoji: '🏎️', price: 2000),
  ];

  static const List<TrendingTag> trending = [
    TrendingTag(tag: '#رمضان', meta: '12.4M فيديو'),
    TrendingTag(tag: '#الرياض', meta: '8.2M فيديو'),
    TrendingTag(tag: '#طبخات', meta: '5.6M فيديو'),
    TrendingTag(tag: '#كرة_قدم', meta: '3.1M فيديو'),
    TrendingTag(tag: '#قراءة', meta: '1.8M فيديو'),
  ];

  static String fmt(int n) {
    if (n >= 1000000) return '${(n / 1000000).toStringAsFixed(1)}M';
    if (n >= 1000) return '${(n / 1000).toStringAsFixed(1)}K';
    return n.toString();
  }
}
