import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/widgets/bottom_nav_scaffold.dart';

class CreateScreen extends StatelessWidget {
  const CreateScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final items = [
      _CreateItem('تسجيل فيديو', 'استخدم الكاميرا لتصوير فيديو قصير', Icons.videocam, [const Color(0xFFFF0050), const Color(0xFFFF5C8D)], '/camera'),
      _CreateItem('رفع من الجهاز', 'اختر فيديو من المعرض', Icons.upload, [AppColors.primary, AppColors.primary2], '/edit-video'),
      _CreateItem('بث مباشر', 'تواصل مع جمهورك مباشرة', Icons.live_tv, [const Color(0xFFFB923C), AppColors.danger], '/live/start'),
      _CreateItem('قوالب جاهزة', 'ابدأ من قالب وعدّله', Icons.auto_awesome, [AppColors.success, const Color(0xFF22C55E)], '/camera'),
    ];
    return BottomNavScaffold(
      activeIndex: 2,
      child: Scaffold(
        backgroundColor: Colors.white,
        appBar: AppBar(
          title: const Text('إنشاء جديد'),
          automaticallyImplyLeading: false,
          actions: [IconButton(icon: const Icon(Icons.close), onPressed: () => context.go('/home'))],
        ),
        body: SafeArea(child: ListView(padding: const EdgeInsets.all(16), children: items.map((it) => Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: InkWell(
            onTap: () => context.go(it.path),
            borderRadius: BorderRadius.circular(16),
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: AppColors.bg2, borderRadius: BorderRadius.circular(16)),
              child: Row(children: [
                Container(
                  width: 50, height: 50,
                  decoration: BoxDecoration(gradient: LinearGradient(colors: it.colors), borderRadius: BorderRadius.circular(14)),
                  child: Icon(it.icon, color: Colors.white),
                ),
                const SizedBox(width: 14),
                Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(it.title, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15)),
                  Text(it.desc, style: const TextStyle(color: AppColors.muted, fontSize: 12.5)),
                ])),
                const Icon(Icons.chevron_left, color: AppColors.muted),
              ]),
            ),
          ),
        )).toList())),
      ),
    );
  }
}

class _CreateItem {
  final String title; final String desc; final IconData icon; final List<Color> colors; final String path;
  _CreateItem(this.title, this.desc, this.icon, this.colors, this.path);
}
