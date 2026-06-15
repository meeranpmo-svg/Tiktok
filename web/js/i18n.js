/* === Tenth Tone — bilingual (Arabic ⇄ English) layer ===
 *
 * The app is authored in Arabic. This module retrofits English on top
 * WITHOUT touching every view: after each render it walks the DOM and
 * swaps any text/placeholder/title whose EXACT value is a known UI
 * label. Exact-match only → user content (names, messages, video
 * captions) never matches a label key, so it is always left untouched.
 *
 * Language is persisted in localStorage('tt-lang'). Switching also flips
 * <html dir> between rtl/ltr and re-renders the current screen.
 */
(function () {
  'use strict';

  // ── AR → EN dictionary for every static UI string ──
  const DICT = {
    // Splash / auth
    'شارك لحظتك مع العالم': 'Share your moment with the world',
    'تسجيل الدخول': 'Log in',
    'إنشاء حساب جديد': 'Create new account',
    'إنشاء حساب': 'Sign up',
    'مرحبًا بعودتك': 'Welcome back',
    'سجّل دخولك للمتابعة': 'Sign in to continue',
    'البريد الإلكتروني أو رقم الهاتف': 'Email or phone number',
    'كلمة المرور': 'Password',
    'نسيت كلمة المرور؟': 'Forgot password?',
    'ليس لديك حساب؟': "Don't have an account?",
    'جاري تسجيل الدخول...': 'Signing in...',
    'بيانات الدخول غير صحيحة': 'Invalid login details',
    'البريد لم يُفعَّل بعد — تحقق من بريدك': 'Email not verified yet — check your inbox',
    'الرجاء إدخال جميع الحقول': 'Please fill in all fields',
    'البريد الإلكتروني': 'Email',
    'رقم الهاتف': 'Phone number',
    'تأكيد كلمة المرور': 'Confirm password',
    'كلمة المرور 8 أحرف على الأقل': 'Password must be at least 8 characters',
    'كلمتا المرور غير متطابقتين': 'Passwords do not match',
    'اسم المستخدم محجوز': 'Username is taken',
    'البريد مسجَّل مسبقًا': 'Email is already registered',
    'بإنشاء حساب أنت توافق على الشروط وسياسة الخصوصية.': 'By creating an account you agree to the Terms and Privacy Policy.',
    'جاري إنشاء الحساب...': 'Creating account...',
    'أدخل رمز التحقق': 'Enter verification code',
    'أرسلنا لك رمزًا مكونًا من 6 أرقام': 'We sent you a 6-digit code',
    'تم إرسال رمز التحقق': 'Verification code sent',
    'تم إرسال الرمز مرة أخرى': 'Code sent again',
    'لم يصلك الرمز؟': "Didn't get the code?",
    'إعادة الإرسال': 'Resend',
    'التحقق': 'Verify',
    'تحقق ومتابعة': 'Verify & continue',
    'جاري التحقق...': 'Verifying...',
    'استعادة كلمة المرور': 'Reset password',
    'سنرسل لك رابط/رمز إعادة تعيين': "We'll send you a reset link/code",
    'تم إرسال رابط إعادة التعيين إلى بريدك': 'A reset link was sent to your email',
    'أدخل بريدًا أو رقم هاتف صحيح': 'Enter a valid email or phone number',
    'كلمة مرور جديدة': 'New password',
    'أدخل كلمة مرور جديدة': 'Enter a new password',
    'كلمة المرور الجديدة': 'New password',
    '8 أحرف على الأقل، تشمل رقمًا ورمزًا.': 'At least 8 characters, including a number and a symbol.',
    'تم تحديث كلمة المرور': 'Password updated',
    'حفظ كلمة المرور': 'Save password',
    'محاولات كثيرة — حاول لاحقًا': 'Too many attempts — try again later',
    'حدث خطأ، حاول مجددًا': 'Something went wrong, try again',
    'تعذر الاتصال — تحقق من الإنترنت': 'Connection failed — check your internet',
    'انتهت الجلسة — أعد التسجيل': 'Session expired — sign in again',
    'التالي': 'Next',

    // Bottom nav / common
    'الرئيسية': 'Home',
    'استكشف': 'Discover',
    'إنشاء': 'Create',
    'صندوق الوارد': 'Inbox',
    'البروفايل': 'Profile',
    'بحث': 'Search',
    'إلغاء': 'Cancel',
    'حذف': 'Delete',
    'حفظ': 'Save',
    'إرسال': 'Send',
    'رد': 'Reply',
    'مشاركة': 'Share',
    'متابعة': 'Follow',
    'تتم المتابعة': 'Following',
    'مراسلة': 'Message',
    'تحميل': 'Loading',
    'جاري التحميل...': 'Loading...',
    'خطأ': 'Error',
    'خطأ في التحميل:': 'Load error:',
    'تم': 'Done',
    'تم الحفظ': 'Saved',
    'تم التحديث': 'Updated',
    'تم الإرسال': 'Sent',
    'تم الإلغاء': 'Cancelled',
    'تم النسخ': 'Copied',
    'تم الرفض': 'Rejected',
    'فشل': 'Failed',
    'قريبًا': 'Coming soon',
    'قيد التطوير': 'Under development',
    'غير متصل': 'Offline',

    // Home / feed
    'متصل الآن': 'Online now',
    'آخر ظهور قريبًا': 'Last seen recently',
    'إعجاب': 'Like',
    'إعجابات': 'Likes',
    'تعليق': 'Comment',
    'تعليقات': 'Comments',
    'صوت': 'Sound',
    'أصوات': 'Sounds',
    'الأصلي': 'Original',

    // Discover / search
    'استكشف حسابات': 'Discover accounts',
    'ابحث عن مستخدمين، فيديوهات، أو هاشتاجات': 'Search users, videos, or hashtags',
    'ابحث عن مستخدم بالاسم': 'Search for a user by name',
    'هاشتاجات': 'Hashtags',
    'هاشتاجات رائجة': 'Trending hashtags',
    'فيديوهات شائعة': 'Popular videos',
    'حسابات': 'Accounts',
    'فلترة بحسب': 'Filter by',
    'الكل': 'All',
    'لا يوجد مستخدمون': 'No users',

    // Create / camera / upload
    'استخدم الكاميرا لتصوير فيديو قصير': 'Use the camera to record a short video',
    'اختر فيديو أو صورة من المعرض': 'Pick a video or photo from the gallery',
    'تسجيل فيديو': 'Record video',
    'كاميرا': 'Camera',
    'رفع من المعرض بدلًا من ذلك': 'Upload from gallery instead',
    'رفع من الجهاز': 'Upload from device',
    'رفع من المعرض': 'Upload from gallery',
    'اختر ملف فيديو أو صورة أولاً': 'Pick a video or image file first',
    'المتصفح لا يدعم التسجيل': 'Browser does not support recording',
    'الرجاء السماح بالوصول إلى الكاميرا والميكروفون.': 'Please allow access to the camera and microphone.',
    'تعذر فتح الكاميرا': 'Could not open the camera',
    'معاينة الفيديو': 'Video preview',
    'تعديل الفيديو': 'Edit video',
    'صف فيديوك، أضف وسومًا (#) أو ذكر مستخدمين (@)': 'Describe your video, add hashtags (#) or mention users (@)',
    'إضافة موقع': 'Add location',
    'الإشارة إلى أشخاص': 'Tag people',
    'من يستطيع المشاهدة': 'Who can watch',
    'السماح بالتعليقات': 'Allow comments',
    'السماح بالحفظ': 'Allow saving',
    'نشر': 'Post',
    'جاري النشر...': 'Posting...',
    'تم النشر بنجاح': 'Posted successfully',
    'حفظ كمسودة': 'Save as draft',
    'تم الحفظ كمسودة': 'Saved as draft',
    'تعذر النشر': 'Could not post',
    'تعذر الرفع': 'Upload failed',
    'تعذر الحفظ': 'Could not save',
    'غلاف': 'Cover',
    'مؤثرات': 'Effects',
    'فلاتر': 'Filters',
    'سرعة': 'Speed',
    'مؤقت': 'Timer',
    'موسيقى': 'Music',
    'نص': 'Text',
    'ملصقات': 'Stickers',
    'قوالب جاهزة': 'Ready templates',
    'ابدأ من قالب وعدّله': 'Start from a template and edit it',

    // Inbox / chat
    'لا توجد محادثات بعد': 'No conversations yet',
    'ابدأ محادثة': 'Start a conversation',
    'محادثة جديدة': 'New chat',
    'مجموعة جديدة': 'New group',
    'إنشاء جديد': 'Create new',
    'اسم المجموعة': 'Group name',
    'أدخل اسم المجموعة': 'Enter a group name',
    'صورة المجموعة (اختياري)': 'Group photo (optional)',
    'إنشاء المجموعة': 'Create group',
    'اختر عضوًا واحدًا على الأقل': 'Pick at least one member',
    'اكتب رسالة...': 'Type a message...',
    'رسالة': 'Message',
    'أرسل رسالة': 'Send a message',
    'رسالة صوتية': 'Voice message',
    'إرفاق ملف': 'Attach file',
    'إرسال مقطع فيديو': 'Send a video clip',
    'إرسال الرابط': 'Send link',
    'اضغط مطولًا للتحدث': 'Hold to talk',
    'يتحدث الآن...': 'is talking now...',
    'تعذر إرسال المقطع': 'Could not send the clip',
    'تعذر فتح المحادثة': 'Could not open the conversation',
    'لا يمكنك مراسلة نفسك': "You can't message yourself",
    'تعذر الإرسال': 'Send failed',
    'مجموعة': 'Group',
    'محادثة': 'Chat',

    // Notifications
    'الإشعارات': 'Notifications',
    'إشعارات': 'Notifications',
    'لا توجد إشعارات بعد': 'No notifications yet',
    'أعجبه الفيديو الخاص بك': 'liked your video',
    'بدأ بمتابعتك': 'started following you',
    'ذكرك في تعليق': 'mentioned you in a comment',
    'أرسلت لك هدية': 'sent you a gift',
    'علّق:': 'commented:',
    'طلب تتبع موقعك': 'requested to track your location',
    'وافق على طلب تتبع موقعه': 'Approve their location-tracking request',
    'رفض طلب تتبع موقعه': 'Deny their location-tracking request',
    'وافقت على المشاركة': 'You approved sharing',
    'موافقة': 'Approve',
    'رفض': 'Deny',

    // Comments
    'أضف تعليقًا...': 'Add a comment...',
    'أرسل تعليقًا...': 'Send a comment...',
    'أرسل': 'Send',

    // Share
    'مشاركة عبر': 'Share via',
    'نسخ الرابط': 'Copy link',
    'إرسال الرابط': 'Send link',

    // Live
    'بث مباشر': 'Live',
    'مباشر': 'Live',
    'بثوث مباشرة': 'Live streams',
    'البثوث المباشرة': 'Live streams',
    'ابدأ بثًا مباشرًا': 'Start a live stream',
    'بدء البث': 'Start streaming',
    'بدء': 'Start',
    'جاري البدء...': 'Starting...',
    'عنوان البث (اختياري)': 'Stream title (optional)',
    'تواصل مع جمهورك مباشرة': 'Connect with your audience live',
    'تواصل مع جمهورك مباشرة': 'Connect with your audience live',
    'بث صوتي مع خلفية — لا يحتاج كاميرا': 'Audio stream with a background — no camera needed',
    'بث فيديو فعلي عبر الكاميرا والميكروفون': 'Real video stream via camera and microphone',
    'خلفية فقط': 'Background only',
    'غير مضبوط — البث بدون فيديو فعلي': 'Not configured — streaming without real video',
    'تعذر بدء البث': 'Could not start the stream',
    'لا توجد بثوث الآن': 'No live streams right now',

    // Map / location
    'خريطة الأصدقاء': 'Friends map',
    'الأصدقاء': 'Friends',
    'أنت هنا': 'You are here',
    'جاري تحميل الخريطة...': 'Loading map...',
    'اسحب للأعلى لعرض القائمة': 'Swipe up to view the list',
    'لا يوجد أصدقاء قريبين': 'No friends nearby',
    'الوضع الخفي': 'Ghost mode',
    'الوضع الخفي مُعطَّل': 'Ghost mode off',
    'الوضع الخفي مُفعَّل — موقعك مخفي': 'Ghost mode on — your location is hidden',
    'على الخريطة': 'on the map',
    'تتبع على الخريطة الآن': 'Track on the map now',
    'لم نعثر على هذا الصديق على الخريطة': "Couldn't find this friend on the map",
    'طلب تتبع الموقع': 'Request location tracking',
    'في انتظار الموافقة': 'Awaiting approval',
    'يتم التتبع — اضغط للإلغاء': 'Tracking — tap to cancel',
    'تم الرفض — أعد الطلب': 'Denied — request again',
    'تم إرسال طلب التتبع — بانتظار الموافقة': 'Tracking request sent — awaiting approval',
    'تم إلغاء التتبع': 'Tracking cancelled',
    'صديق': 'friend',
    'صديقان': 'friends',
    'أصدقاء': 'friends',

    // Wallet
    'المحفظة': 'Wallet',
    'الرصيد المتاح': 'Available balance',
    'شحن': 'Top up',
    'سحب': 'Withdraw',
    'شحن المحفظة': 'Top up wallet',
    'سحب الأرباح': 'Withdraw earnings',
    'الأكثر شعبية': 'Most popular',
    'أو أدخل عددًا مخصصًا': 'Or enter a custom amount',
    'شحن مبلغ مخصص': 'Top up a custom amount',
    'الدفع الفعلي عبر Stripe / Apple Pay سيتم تفعيله قبل الإطلاق الرسمي': 'Real payment via Stripe / Apple Pay will be enabled before the official launch',
    'الحد الأدنى: 100 عملة': 'Minimum: 100 coins',
    'الحد الأدنى للسحب 100 عملة': 'Minimum withdrawal is 100 coins',
    'العدد': 'Amount',
    'طريقة الاستلام': 'Payout method',
    'تحويل بنكي': 'Bank transfer',
    'تأكيد السحب': 'Confirm withdrawal',
    'جاري التحويل...': 'Processing...',
    'أدخل عددًا صحيحًا': 'Enter a valid number',
    'تم شحن': 'Topped up',
    'عملة': 'coins',
    'فشل الشحن': 'Top-up failed',
    'فشل السحب': 'Withdrawal failed',
    'تم تسجيل طلب السحب — سيصلك المبلغ خلال 3-5 أيام عمل': 'Withdrawal request submitted — funds arrive in 3-5 business days',
    'رصيد غير كافٍ — اشحن المحفظة': 'Insufficient balance — top up your wallet',
    'إيرادات': 'Income',
    'صادر': 'Outgoing',
    'لا توجد عمليات': 'No transactions',
    'تعذر إرسال الهدية': 'Could not send the gift',
    'الهدايا': 'Gifts',
    'ر.س': 'SAR',

    // Settings
    'الإعدادات والخصوصية': 'Settings & Privacy',
    'الحساب': 'Account',
    'تعديل البروفايل': 'Edit profile',
    'تغيير كلمة المرور': 'Change password',
    'كلمة المرور الجديدة (8 أحرف على الأقل):': 'New password (at least 8 characters):',
    'كلمة المرور قصيرة جدًا': 'Password is too short',
    'تغيير البريد الإلكتروني': 'Change email',
    'البريد الإلكتروني الجديد:': 'New email:',
    'تحقق من بريدك الجديد للتأكيد': 'Check your new inbox to confirm',
    'الخصوصية والأمان': 'Privacy & Security',
    'الحساب خاص': 'Private account',
    'حسابك أصبح خاصًا': 'Your account is now private',
    'حسابك أصبح عامًا': 'Your account is now public',
    'من يمكنه مراسلتي': 'Who can message me',
    'من يمكنه التعليق': 'Who can comment',
    'الجميع': 'Everyone',
    'المستخدمون المحظورون': 'Blocked users',
    'مراجعة طلبات تتبع موقعي': 'Review location-tracking requests',
    'لا توجد طلبات جديدة': 'No new requests',
    'طلب — راجعها من شاشة الإشعارات': 'request(s) — review them in Notifications',
    'المتابعون الجدد': 'New followers',
    'الرسائل': 'Messages',
    'المحتوى والعرض': 'Content & Display',
    'اللغة': 'Language',
    'العربية': 'Arabic',
    'الوضع الداكن': 'Dark mode',
    'تشغيل تلقائي للفيديو': 'Autoplay videos',
    'حفظ بيانات الإنترنت': 'Data saver',
    'الموقع الجغرافي': 'Location',
    'مشاركة موقعي مع': 'Share my location with',
    'تفعيل مشاركة الموقع': 'Enable location sharing',
    'تمت مشاركة موقعك': 'Your location is now shared',
    'تم إيقاف المشاركة': 'Sharing stopped',
    'الدعم والقانوني': 'Support & Legal',
    'الإبلاغ عن مشكلة': 'Report a problem',
    'تواصل معنا': 'Contact us',
    'الشروط وسياسة الخصوصية': 'Terms & Privacy Policy',
    'حول التطبيق': 'About',
    'الإصدار 1.0.0': 'Version 1.0.0',
    'منطقة الخطر': 'Danger zone',
    'حذف الحساب نهائيًا': 'Delete account permanently',
    'هل أنت متأكد من حذف حسابك؟\n\nسيتم حذف جميع الفيديوهات والمحفظة والمحادثات. لا يمكن التراجع عن هذا الإجراء.': 'Are you sure you want to delete your account?\n\nAll videos, wallet, and chats will be deleted. This action cannot be undone.',
    'للتأكيد، اكتب: حذف': 'To confirm, type: delete',
    'تم حذف حسابك': 'Your account was deleted',
    'فشل الحذف': 'Deletion failed',
    'الإدارة': 'Administration',
    'فتح لوحة التحكم الإدارية': 'Open admin dashboard',

    // Blocked users
    'لا يوجد مستخدمون محظورون': 'No blocked users',
    'يمكنك حظر أي شخص من بروفايله': 'You can block anyone from their profile',
    'إلغاء الحظر': 'Unblock',
    'إلغاء حظر': 'Unblock',
    'تم إلغاء الحظر': 'Unblocked',
    'هذا المستخدم': 'this user',

    // Profile
    'تعديل البروفايل': 'Edit profile',
    'الاسم': 'Name',
    'اسم المستخدم': 'Username',
    'النبذة': 'Bio',
    'تغيير الصورة': 'Change photo',
    'حفظ التعديلات': 'Save changes',
    'تم الحفظ': 'Saved',
    'المتابعون': 'Followers',
    'المتابَعون': 'Following',
    'متابعون': 'Followers',
    'متابَعين': 'Following',
    'متابَع': 'Following',
    'متابعون جدد': 'New followers',
    'فيديوهات': 'Videos',
    'معجَب بها': 'Liked',
    'محفوظ': 'Saved',
    'لا تتابع أي حساب بعد': "You're not following anyone yet",
    'لا يوجد مستخدمون آخرون بعد. ادعُ صديقاً للانضمام.': 'No other users yet. Invite a friend to join.',
    'تسجيل الخروج': 'Log out',
    'تم تسجيل الخروج': 'Logged out',
    'مستخدم': 'User',
    'خاص': 'Private',
    'عام': 'Public',
    'لك': 'You',
    'أنت': 'You',

    // Misc / toasts
    'جاري الإرسال...': 'Sending...',
    'جاري الإنشاء...': 'Creating...',
    'جاري الحفظ...': 'Saving...',
    'تعذر التحديث': 'Could not update',
    'الآن': 'Now',
    'منذ': 'ago',
    'يوم': 'day',
    'النظام': 'System',
    'تدرج': 'Gradient',
    'انضم إلى': 'Join',
    'سيتم تفعيله قبل الإطلاق الرسمي': 'Will be enabled before the official launch',
    'السحب يتطلب التحقق من الهوية — سيتم تفعيله قبل الإطلاق.': 'Withdrawal requires identity verification — coming before launch.',
    'سيتم تفعيل الدفع عبر Apple Pay / Stripe قبل الإطلاق الرسمي. للاختبار اطلب من المشرف شحن رصيدك.': 'Payment via Apple Pay / Stripe will be enabled before launch. For testing, ask an admin to top up your balance.',
    'السماح بالميكروفون مطلوب': 'Microphone permission is required',

    // Demo seed names (sample content – safe to localize)
    'مرحبا الجميع': 'Hello everyone',
    'جميل جدًا': 'Very nice',
    'شاطئ': 'Beach',
    'صحراء': 'Desert',
    'مدينة': 'City',
    'مسجد': 'Mosque',
    'قلب': 'Heart',
  };

  // ── Admin dashboard strings (shares DICT; merged here to keep the literal small) ──
  Object.assign(DICT, {
    // Login / shell
    'لوحة التحكم': 'Dashboard',
    'سجّل دخولك للوصول إلى لوحة الإدارة': 'Sign in to access the admin panel',
    'جاري الدخول...': 'Signing in...',
    'تعذر الدخول': 'Sign-in failed',
    'هذا الحساب ليس لديه صلاحيات إدارية': 'This account has no admin permissions',
    'هذا الحساب ليس لديه صلاحيات إدارية.': 'This account has no admin permissions.',
    'وصول غير مسموح': 'Access denied',
    'تسجيل الخروج والدخول كمشرف': 'Sign out and log in as admin',
    'المشرف الرئيسي': 'Super Admin',
    'العودة إلى التطبيق': 'Back to app',
    'بحث سريع...': 'Quick search...',
    // Nav sections
    'المحتوى': 'Content',
    'النقدية': 'Monetization',
    'النظام': 'System',
    // Nav items
    'الإحصائيات': 'Analytics',
    'إدارة الحسابات': 'User management',
    'الفيديوهات': 'Videos',
    'البلاغات': 'Reports',
    'الهدايا والمحفظة': 'Gifts & Wallet',
    'الموظفون': 'Staff',
    'الأدوار والصلاحيات': 'Roles & Permissions',
    'سجل الأنشطة': 'Activity log',
    'الإعدادات': 'Settings',
    // Dashboard
    'نظرة عامة على المنصة': 'Platform overview',
    'إجمالي المستخدمين': 'Total users',
    'إجمالي الفيديوهات': 'Total videos',
    'بثوث مباشرة الآن': 'Live streams now',
    'بلاغات قيد المراجعة': 'Reports pending review',
    'أعلى المستخدمين متابعةً': 'Most-followed users',
    'أعلى الفيديوهات أداءً': 'Top-performing videos',
    'آخر النشاطات': 'Recent activity',
    'النشاط خلال الأسبوع': 'Activity this week',
    'النمو خلال 30 يومًا': 'Growth over 30 days',
    'التوزيع الجغرافي': 'Geographic distribution',
    'توزيع المحتوى': 'Content distribution',
    'مستخدمون نشطون يوميًا': 'Daily active users',
    'مستخدمون نشطون شهريًا': 'Monthly active users',
    'مستخدمون نشطون': 'Active users',
    'مستخدمون جدد': 'New users',
    'مستخدمون يدفعون': 'Paying users',
    'متوسط الجلسة': 'Avg. session',
    'معدل البقاء (': 'Retention rate (',
    'إيرادات اليوم': "Today's revenue",
    'مشاهدات اليوم': "Today's views",
    'التفاعل': 'Engagement',
    // Analytics page
    'الإحصائيات والتقارير': 'Analytics & Reports',
    'تتبع التفاعل واستخراج التقارير': 'Track engagement and export reports',
    // Users page
    'بحث، تعديل البروفايل، المحفظة، التحقق، الحظر، الحذف': 'Search, edit profile, wallet, verify, ban, delete',
    'بحث بالاسم أو اسم المستخدم': 'Search by name or username',
    'كل الحالات': 'All statuses',
    'نشط': 'Active',
    'محظور': 'Banned',
    'مشرف': 'Admin',
    'المتابعون': 'Followers',
    'الحالة': 'Status',
    'تاريخ الانضمام': 'Join date',
    'إدارة': 'Manage',
    'حظر': 'Ban',
    'إلغاء الحظر': 'Unban',
    'تعيين مشرف': 'Make admin',
    'إزالة الإشراف': 'Remove admin',
    'عدد أيام الحظر (فارغ': 'Ban days (empty',
    'إدارة المستخدم': 'Manage user',
    'علامة موثَّق': 'Verified badge',
    'البروفايل': 'Profile',
    'إجراءات سريعة': 'Quick actions',
    'الرصيد الحالي': 'Current balance',
    'تعديل الرصيد (+ إيداع /': 'Adjust balance (+ deposit /',
    'العدد (سالب للخصم)': 'Amount (negative to deduct)',
    'السبب (اختياري)': 'Reason (optional)',
    'تطبيق': 'Apply',
    'تم تعديل الرصيد': 'Balance adjusted',
    'أدخل قيمة صحيحة': 'Enter a valid value',
    'أحدث الفيديوهات': 'Latest videos',
    'سجل الإجراءات الإدارية': 'Admin action log',
    'حفظ تعديلات البروفايل': 'Save profile changes',
    'تم حفظ البروفايل': 'Profile saved',
    'حظر مؤقت': 'Temporary ban',
    'حذف الحساب نهائيًا': 'Delete account permanently',
    'سيتم حذف جميع الفيديوهات والمحفظة والتعليقات.': 'All videos, wallet, and comments will be deleted.',
    'نهائيًا؟ هذا الإجراء غير قابل للتراجع.': 'permanently? This action cannot be undone.',
    'تم حذف الحساب': 'Account deleted',
    'دور المشرف لـ': 'admin role for',
    'تعيين': 'Assign',
    'إزالة': 'Remove',
    // Videos page
    'مراجعة المحتوى المنشور': 'Review published content',
    'بحث بالوصف': 'Search by description',
    'الناشر': 'Publisher',
    'المشاهدات': 'Views',
    'الإعجابات': 'Likes',
    'عرض': 'View',
    'بلا وصف)': 'No description)',
    'حذف هذا الفيديو نهائيًا؟': 'Delete this video permanently?',
    'تم الحذف': 'Deleted',
    'لا توجد فيديوهات': 'No videos',
    'منشور': 'Published',
    'مسودة': 'Draft',
    // Comments page
    'مراجعة وحذف التعليقات المخالفة': 'Review and delete violating comments',
    'بحث في التعليقات': 'Search comments',
    'مبلَّغ عنها': 'Reported',
    'محذوفة': 'Deleted',
    'التعليق': 'Comment',
    'الفيديو': 'Video',
    'البلاغات': 'Reports',
    'تجاهل': 'Dismiss',
    // Reports page
    'مراجعة البلاغات': 'Review reports',
    'مراجعة البلاغات المقدمة من المستخدمين': 'Review user-submitted reports',
    'كل الأنواع': 'All types',
    'النوع': 'Type',
    'الكيان': 'Entity',
    'المُبلِّغ': 'Reporter',
    'السبب': 'Reason',
    'التاريخ': 'Date',
    'قيد المراجعة': 'Under review',
    'مرفوضة': 'Dismissed',
    'لا توجد بلاغات': 'No reports',
    'حسم بإجراء': 'Resolve with action',
    'تم الحسم': 'Resolved',
    'حذف المحتوى': 'Delete content',
    'تحذير': 'Warn',
    'مراجعة، حذف، تحذير': 'Review, delete, warn',
    ' تم حذف المحتوى / تم تحذير المستخدم):': ' content deleted / user warned):',
    'تم تحديث الحالة': 'Status updated',
    // Live page
    'مراقبة الجلسات النشطة وإنهاء البثوث المخالفة': 'Monitor active sessions and end violating streams',
    'بثوث مباشرة الآن': 'Live streams now',
    'لا توجد بثوث نشطة الآن': 'No active streams right now',
    'إنهاء البث': 'End stream',
    'إنهاء هذا البث الآن؟': 'End this stream now?',
    'تم الإنهاء': 'Ended',
    'إنهاء': 'End',
    // Wallet/gifts page
    'المحفظة والسحب': 'Wallet & Withdrawals',
    'تتبع الهدايا الافتراضية وتقارير الدخل': 'Track virtual gifts and revenue reports',
    'إدارة الكتالوج': 'Manage catalog',
    'إدارة المحفظة': 'Manage wallet',
    'المرسل': 'Sender',
    'المستلم': 'Recipient',
    'القيمة': 'Value',
    'القناة': 'Channel',
    'الهدية': 'Gift',
    'كل الهدايا': 'All gifts',
    'هدايا مرسلة (اليوم)': 'Gifts sent (today)',
    'متوسط قيمة الهدية': 'Avg. gift value',
    'إيرادات اليوم': "Today's revenue",
    'مستخدمون يدفعون': 'Paying users',
    // Ads page
    'إدارة الإعلانات': 'Manage ads',
    'إدارة الحملات الإعلانية وتتبع الأداء': 'Manage ad campaigns and track performance',
    'إنشاء حملة إعلانية': 'Create ad campaign',
    'إنشاء حملة': 'Create campaign',
    'حملة جديدة': 'New campaign',
    'الحملة': 'Campaign',
    'حملات نشطة': 'Active campaigns',
    'الفئة المستهدفة': 'Target audience',
    'الفئة المستهدفة (اختياري)': 'Target audience (optional)',
    'المدة': 'Duration',
    'النقرات': 'Clicks',
    'عنوان الإعلان': 'Ad title',
    'عنوان الحملة': 'Campaign title',
    'نص الإعلان': 'Ad text',
    'نص قصير وجذاب': 'Short, catchy text',
    'الرابط (': 'Link (',
    'تاريخ البداية': 'Start date',
    'تاريخ النهاية': 'End date',
    'حفظ ونشر': 'Save & publish',
    'تم إنشاء الحملة': 'Campaign created',
    'نشطة': 'Active',
    'متوقفة': 'Paused',
    'منتهية': 'Ended',
    // Notifications page
    'إرسال إشعارات': 'Send notifications',
    'إرسال إشعارات عامة أو موجهة لفئات محددة': 'Send broadcast or targeted notifications',
    'إشعار جديد': 'New notification',
    'نوع الإشعار': 'Notification type',
    'عام (لجميع المستخدمين)': 'Broadcast (all users)',
    'موجه (فئة محددة)': 'Targeted (specific segment)',
    'مستخدمون نشطون اليوم': 'Users active today',
    'عنوان الإشعار': 'Notification title',
    'نص الإشعار': 'Notification text',
    'الجدولة': 'Scheduling',
    'إرسال فوري': 'Send now',
    'جدولة لوقت لاحق': 'Schedule for later',
    'الإشعارات السابقة': 'Past notifications',
    'تم إرسال الإشعار': 'Notification sent',
    'لجميع المستخدمين': 'To all users',
    'وصل لـ': 'Reached',
    // Employees / roles
    'إدارة الموظفين': 'Manage staff',
    'إدارة موظفي لوحة التحكم وأدوارهم': 'Manage dashboard staff and their roles',
    'إضافة موظف جديد': 'Add new employee',
    'موظف جديد': 'New employee',
    'تعديل بيانات الموظف': 'Edit employee details',
    'الموظف': 'Employee',
    'الدور': 'Role',
    'آخر دخول': 'Last login',
    'الاسم الكامل': 'Full name',
    'كلمة المرور المؤقتة': 'Temporary password',
    'سيُطلب من الموظف تغييرها عند أول دخول': 'The employee will be asked to change it on first login',
    'حذف هذا الموظف؟': 'Delete this employee?',
    'إدارة الأدوار': 'Manage roles',
    'إدارة الأدوار وتحديد الصلاحيات لكل دور': 'Manage roles and set permissions for each',
    'إنشاء دور جديد': 'Create new role',
    'دور جديد': 'New role',
    'تعديل دور': 'Edit role',
    'اسم الدور': 'Role name',
    'الصلاحيات': 'Permissions',
    'كل الصلاحيات': 'All permissions',
    'كل الأدوار': 'All roles',
    'تاريخ الإنشاء': 'Created on',
    'موقوف': 'Suspended',
    'مشرف محتوى': 'Content moderator',
    'محلل بيانات': 'Data analyst',
    'دعم فني': 'Support',
    'مسوّق': 'Marketer',
    // Logs page
    'مراجعة جميع الإجراءات الإدارية': 'Review all admin actions',
    'لم يتم تسجيل أي نشاط بعد': 'No activity logged yet',
    'سجل كامل': 'Full log',
    // Location page
    'إدارة ميزة مشاركة الموقع ومتابعة المحتوى الشائع': 'Manage location sharing and trending content',
    'المحتوى الشائع حسب المنطقة': 'Trending content by region',
    'المحتوى الشائع حسب الموقع': 'Trending content by location',
    'إظهار خريطة الأصدقاء داخل التطبيق': 'Show the friends map inside the app',
    'السماح للمستخدمين بمشاركة موقعهم على الخريطة': 'Allow users to share their location on the map',
    'عرض الخريطة العامة': 'Show public map',
    'عرض الفيديوهات الرائجة حسب المنطقة': 'Show trending videos by region',
    'تفعيل ميزة مشاركة الموقع': 'Enable location sharing',
    'مشاركة الموقع تلقائيًا': 'Share location automatically',
    'إعدادات المشاركة': 'Sharing settings',
    'كل المملكة': 'Whole kingdom',
    // Settings page
    'إعدادات المنصة العامة': 'General platform settings',
    'اسم المنصة': 'Platform name',
    'منصة فيديو اجتماعي بالعربية': 'An Arabic social video platform',
    'اللغة الافتراضية': 'Default language',
    'المنطقة الزمنية': 'Time zone',
    'الحد الأدنى للعمر': 'Minimum age',
    'الحد الأدنى من المتابعين للبث': 'Minimum followers to go live',
    'حدود الفيديو': 'Video limits',
    'الحد الأقصى للمدة (ث)': 'Max duration (s)',
    'الحد الأقصى للحجم (': 'Max size (',
    'صيغ الفيديو المدعومة': 'Supported video formats',
    'صيغ الصور': 'Image formats',
    'نسبة العمولة (%)': 'Commission rate (%)',
    'الحد الأدنى للسحب (': 'Minimum withdrawal (',
    'حفظ الإعدادات': 'Save settings',
    'تم حفظ الإعدادات': 'Settings saved',
    'افتراضيًا للمستخدمين الجدد': 'Default for new users',
    // Common table/page words
    'الكيان': 'Entity',
    'الوصف': 'Description',
    'العنوان': 'Title',
    'الوقت': 'Time',
    'العدد': 'Count',
    'تحرير': 'Edit',
    'تعديل': 'Edit',
    'عرض الكل': 'View all',
    'عرض السجل': 'View log',
    'عرض الإحصائيات': 'View analytics',
    'عرض المستخدمين': 'View users',
    'عرض المحتوى': 'View content',
    'لا توجد نتائج': 'No results',
    'لا توجد نشاطات بعد': 'No activity yet',
    'إناث': 'Female',
    'ذكور': 'Male',
    'أخرى': 'Other',
    'حساب': 'Account',
    'باقة': 'Package',
    'الهاتف': 'Phone',
    'المدينة': 'City',
    'من': 'From',
    // Cities (mock/demo)
    'الرياض': 'Riyadh',
    'جدة': 'Jeddah',
    'الدمام': 'Dammam',
    'مكة': 'Makkah',
    // Days (mock/demo charts)
    'الأحد': 'Sun',
    'الإثنين': 'Mon',
    'الثلاثاء': 'Tue',
    'الأربعاء': 'Wed',
    'الخميس': 'Thu',
    'الجمعة': 'Fri',
    'السبت': 'Sat',
    'أمس': 'Yesterday',
    'منذ ساعة': '1 hour ago',
    'منذ أسبوع': '1 week ago',
    'منذ 3 أيام': '3 days ago',
    'آخر 7 أيام': 'Last 7 days',
    'آخر 30 يوم': 'Last 30 days',
    'آخر 90 يوم': 'Last 90 days',
    // Categories (mock)
    'ترفيه': 'Entertainment',
    'رياضة': 'Sports',
    'طبخ': 'Cooking',
    // Sample campaign names (mock demo data)
    'عرض رمضان الكبير': 'Big Ramadan Offer',
    'إطلاق الجيل الجديد': 'Next-Gen Launch',
    'تخفيضات الموسم': 'Seasonal Sale',
    'مهرجان الطعام': 'Food Festival',
    'دروس الطبخ المباشرة': 'Live Cooking Classes',
    'بطاقات الهدايا': 'Gift Cards',
    'استبيان المنتج': 'Product Survey',
    // Sample comments / notifications (mock demo data)
    'شيء جميل!': 'Beautiful!',
    'سلوك مخالف': 'Violating behavior',
    'تعليق إعلاني خارجي': 'External ad comment',
    'كلام محرج': 'Embarrassing remark',
    'محتوى مكرر': 'Duplicate content',
    'محتوى مخالف للقانون': 'Unlawful content',
    'محبة لك يا صديقي': 'Love you, friend',
    'أعجبني!': 'I liked it!',
    'أين هذا المكان؟': 'Where is this place?',
    'شكراً': 'Thanks',
    'تحديث جديد متاح': 'A new update is available',
    'تحديات الأسبوع': "This week's challenges",
    'هدية ترحيبية': 'Welcome gift',
    'صيانة مجدولة الليلة': 'Scheduled maintenance tonight',

    // ── Admin dashboard labels (added 2026-06-15) ──
    'التعليقات': 'Comments',
    'البث المباشر': 'Live',
    'الإعلانات': 'Ads',
    'الإعلانات والإشعارات': 'Ads & Notifications',
    '← العودة إلى التطبيق': '← Back to app',
    '7 أيام': '7 days',
    '30 يوم': '30 days',
    '(مشرف)': '(Admin)',
    'متابع': 'Follower',
    'عدد أيام الحظر (فارغ = دائم):': 'Ban duration in days (empty = permanent):',
    'تعذر التحميل:': 'Failed to load:',
    'انضم:': 'Joined:',
    'علامة موثَّق ✓': 'Verified badge ✓',
    'فشل الحفظ': 'Save failed',
    'أدخل قيمة صحيحة ≠ 0': 'Enter a valid value ≠ 0',
    'تعديل الرصيد (+ إيداع / − خصم)': 'Adjust balance (+ credit / − debit)',
    'حذف حساب': 'Delete account',
    '🗑️ حذف الحساب نهائيًا': '🗑️ Delete account permanently',
    '(بلا وصف)': '(No description)',
    'فيديو': 'Video',
    'بث': 'Live',
    'الإجراء المتخذ (مثال: تم حذف المحتوى / تم تحذير المستخدم):': 'Action taken (e.g. content removed / user warned):',
    'تم حذف المحتوى': 'Content removed',
    '● مباشر': '● Live',
    'نقرات': 'Clicks',
    'باقة Premium': 'Premium plan',
    '18-35 · الرياض': '18-35 · Riyadh',
    '20-45 · جدة, الدمام': '20-45 · Jeddah, Dammam',
    'إيقاف': 'Stop',
    'تحديات الأسبوع 🎉': "This week's challenges 🎉",
    '· وصل لـ': '· reached',
    'معدل البقاء (DAY30)': 'Retention (DAY30)',
    'مرسلة': 'Sent',
    'مستلمة': 'Received',
    'عرض الإحصائيات والتقارير': 'View stats & reports',
    'الحسابات، البلاغات': 'Accounts, reports',
    'تعديل المستخدمين': 'Edit users',
    'حظر المستخدمين': 'Ban users',
    'بحث بالاسم أو البريد': 'Search by name or email',
    'حفظ التغييرات': 'Save changes',
    'شيء جميل! 🔥': 'Beautiful! 🔥',
    'شكراً 🌹': 'Thanks 🌹',

    // ── App views labels (added 2026-06-15) ──
    'انضم إلى Tenth Tone': 'Join Tenth Tone',
    'تسجيل': 'Sign up',
    'تم إلغاء الحفظ': 'Removed from saved',
    '⚠️ تعذر فتح الكاميرا': '⚠️ Could not open the camera',
    '🎬 معاينة الفيديو': '🎬 Video preview',
    'البريد': 'Email',
    '🎤 رسالة صوتية': '🎤 Voice message',
    '📷 صورة': '📷 Photo',
    '🎥 فيديو': '🎥 Video',
    'صورة': 'Photo',
    '🗺️ تتبع على الخريطة الآن': '🗺️ Track on the map now',
    '📍 طلب تتبع الموقع': '📍 Request location tracking',
    '⏳ في انتظار الموافقة': '⏳ Awaiting approval',
    '✅ يتم التتبع — اضغط للإلغاء': '✅ Tracking — tap to cancel',
    '❌ تم الرفض — أعد الطلب': '❌ Rejected — request again',
    '✓ موافقة': '✓ Approve',
    '✗ رفض': '✗ Reject',
    'تم الإرسال ✓': 'Sent ✓',
    'استوديو': 'Studio',
    '📷 كاميرا': '📷 Camera',
    '🖼️ خلفية فقط': '🖼️ Background only',
    '⚠️ Agora App ID غير مضبوط — البث بدون فيديو فعلي': '⚠️ Agora App ID not set — streaming without real video',
    '💬 رسالة': '💬 Message',
    '👤 البروفايل': '👤 Profile',
    'مخصص': 'Custom',
    'جميل جدًا 🔥': 'So beautiful 🔥',
    'تابعتك من زمان': "I've been following you for a while",
    'أرسلت لك هدية 🌹': 'Sent you a gift 🌹',
  });

  // ── Parametric rules: whole-text-node patterns with a number/word slot ──
  // Each entry: [regex on the FULL trimmed text, replacement function].
  const RULES = [
    [/^(\d+) تعليق$/, (m) => `${m[1]} comment${m[1] === '1' ? '' : 's'}`],
    [/^عرض (\d+)-(\d+) من (\d+)$/, (m) => `Showing ${m[1]}-${m[2]} of ${m[3]}`],
    [/^منذ (\d+) د$/, (m) => `${m[1]}m ago`],
    [/^منذ (\d+) س$/, (m) => `${m[1]}h ago`],
    [/^منذ (\d+) يوم$/, (m) => `${m[1]}d ago`],
    [/^(\d+)د$/, (m) => `${m[1]}m`],
    [/^(\d+)س$/, (m) => `${m[1]}h`],
    [/^(\d+)ي$/, (m) => `${m[1]}d`],
    [/^إرسال \((\d+)\)$/, (m) => `Send (${m[1]})`],
    [/^(\d+) (?:صديق|صديقان|أصدقاء) على الخريطة$/, (m) => `${m[1]} friend${m[1] === '1' ? '' : 's'} on the map`],
    [/^تم شحن (\d+) عملة$/, (m) => `Topped up ${m[1]} coins`],
    [/^🎙️ (.+) يتحدث الآن\.\.\.$/, (m) => `🎙️ ${m[1]} is talking now...`],
  ];

  function translate(str) {
    if (str == null) return str;
    const key = String(str).trim();
    if (!key) return str;
    if (Object.prototype.hasOwnProperty.call(DICT, key)) {
      // Preserve any surrounding whitespace the original text node had
      return String(str).replace(key, DICT[key]);
    }
    for (let i = 0; i < RULES.length; i++) {
      const m = key.match(RULES[i][0]);
      if (m) return String(str).replace(key, RULES[i][1](m));
    }
    return str;
  }

  // ── DOM walking ──
  const TRANSLATABLE_ATTRS = ['placeholder', 'title', 'aria-label', 'alt'];

  function translateElement(elm) {
    if (!elm || elm.nodeType !== 1) return;
    // attributes
    for (let i = 0; i < TRANSLATABLE_ATTRS.length; i++) {
      const a = TRANSLATABLE_ATTRS[i];
      if (elm.hasAttribute && elm.hasAttribute(a)) {
        const v = elm.getAttribute(a);
        const tv = translate(v);
        if (tv !== v) elm.setAttribute(a, tv);
      }
    }
    // <input type=button/submit> value
    if (elm.tagName === 'INPUT' && (elm.type === 'button' || elm.type === 'submit') && elm.value) {
      const tv = translate(elm.value);
      if (tv !== elm.value) elm.value = tv;
    }
  }

  function walk(node) {
    if (!node) return;
    if (node.nodeType === 3) { // text node
      const tv = translate(node.nodeValue);
      if (tv !== node.nodeValue) node.nodeValue = tv;
      return;
    }
    if (node.nodeType !== 1) return;
    // Skip elements we never want to touch
    if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE') return;
    translateElement(node);
    let child = node.firstChild;
    while (child) { walk(child); child = child.nextSibling; }
  }

  function apply(root) {
    if (getLang() !== 'en') return;
    walk(root || document.body);
  }

  // ── Language state ──
  function getLang() {
    try { return localStorage.getItem('tt-lang') === 'en' ? 'en' : 'ar'; }
    catch (e) { return 'ar'; }
  }

  function applyDir(lang) {
    const html = document.documentElement;
    html.setAttribute('lang', lang === 'en' ? 'en' : 'ar');
    html.setAttribute('dir', lang === 'en' ? 'ltr' : 'rtl');
    document.body.classList.toggle('lang-en', lang === 'en');
  }

  function setLang(lang) {
    lang = lang === 'en' ? 'en' : 'ar';
    try { localStorage.setItem('tt-lang', lang); } catch (e) {}
    applyDir(lang);
    // Re-render the current view from its Arabic source; the observer +
    // apply() pass then translates to English when needed.
    window.dispatchEvent(new Event('tt-rerender'));
  }

  function toggleLang() { setLang(getLang() === 'en' ? 'ar' : 'en'); }

  // ── MutationObserver: catch async DOM (feeds, modals, toasts) ──
  function startObserver() {
    const obs = new MutationObserver((mutations) => {
      if (getLang() !== 'en') return;
      for (let i = 0; i < mutations.length; i++) {
        const mut = mutations[i];
        if (mut.type === 'childList') {
          mut.addedNodes.forEach((n) => walk(n));
        } else if (mut.type === 'attributes' && mut.target) {
          translateElement(mut.target);
        } else if (mut.type === 'characterData' && mut.target) {
          const t = mut.target;
          const tv = translate(t.nodeValue);
          if (tv !== t.nodeValue) t.nodeValue = tv;
        }
      }
    });
    obs.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: TRANSLATABLE_ATTRS,
    });
  }

  // ── Patch native dialogs so confirm/prompt/alert show English too ──
  function patchDialogs() {
    ['alert', 'confirm', 'prompt'].forEach((fn) => {
      const orig = window[fn];
      if (typeof orig !== 'function' || orig.__ttPatched) return;
      const wrapped = function (msg) {
        if (getLang() === 'en' && typeof msg === 'string') {
          msg = translate(msg);
        }
        return orig.apply(window, [msg].concat([].slice.call(arguments, 1)));
      };
      wrapped.__ttPatched = true;
      try { window[fn] = wrapped; } catch (e) {}
    });
  }

  // ── Public API ──
  window.I18N = {
    t: translate,
    apply,
    getLang,
    setLang,
    toggleLang,
    DICT,
  };

  // Boot
  applyDir(getLang());
  patchDialogs();
  if (document.body) startObserver();
  else document.addEventListener('DOMContentLoaded', startObserver);
})();
