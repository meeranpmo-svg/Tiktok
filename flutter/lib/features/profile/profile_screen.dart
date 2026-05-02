import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/widgets/avatar.dart';
import '../../core/widgets/bottom_nav_scaffold.dart';
import '../../core/widgets/video_grid_card.dart';
import '../../data/mock_data.dart';
import '../../data/models/models.dart';

class ProfileScreen extends StatelessWidget {
  final String? userId; // null = me
  const ProfileScreen({super.key, this.userId});

  @override
  Widget build(BuildContext context) {
    final isMe = userId == null;
    final AppUser u = isMe ? MockDB.me : MockDB.users.firstWhere((x) => x.id == userId, orElse: () => MockDB.users.first);
    final body = CustomScrollView(slivers: [
      SliverAppBar(
        leading: isMe
            ? IconButton(icon: const Icon(Icons.menu), onPressed: () => context.go('/settings'))
            : IconButton(icon: const Icon(Icons.arrow_back), onPressed: () => context.pop()),
        title: Row(mainAxisSize: MainAxisSize.min, children: [
          Directionality(textDirection: TextDirection.ltr, child: Text(u.handle, style: const TextStyle(fontWeight: FontWeight.w700))),
          const SizedBox(width: 6),
          const Icon(Icons.keyboard_arrow_down, size: 18),
        ]),
        actions: [IconButton(icon: const Icon(Icons.more_vert), onPressed: () {})],
        pinned: true,
        backgroundColor: Colors.white,
        foregroundColor: AppColors.text,
        elevation: 0,
      ),
      SliverToBoxAdapter(child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(children: [
          Avatar(u.avatar, size: 92),
          const SizedBox(height: 8),
          Text(u.name + (u.verified ? ' ✓' : ''), style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800)),
          Directionality(textDirection: TextDirection.ltr, child: Text(u.handle, style: const TextStyle(color: AppColors.muted, fontSize: 13))),
          const SizedBox(height: 12),
          Row(mainAxisAlignment: MainAxisAlignment.center, children: [
            _Stat(MockDB.fmt(u.following), 'متابَعين', () => context.go('/list/following')),
            const SizedBox(width: 28),
            _Stat(MockDB.fmt(u.followers), 'متابعون', () => context.go('/list/followers')),
            const SizedBox(width: 28),
            _Stat(MockDB.fmt(u.likes), 'إعجابات', () {}),
          ]),
          const SizedBox(height: 12),
          Padding(padding: const EdgeInsets.symmetric(horizontal: 14), child: Text(u.bio, textAlign: TextAlign.center, style: const TextStyle(fontSize: 13.5))),
          const SizedBox(height: 14),
          ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 320),
            child: Row(children: isMe
                ? [
                    Expanded(child: OutlinedButton(onPressed: () => context.go('/profile/edit'), child: const Text('تعديل البروفايل'))),
                    const SizedBox(width: 8),
                    Expanded(child: OutlinedButton(onPressed: () => context.go('/wallet'), child: const Text('المحفظة'))),
                  ]
                : [
                    Expanded(child: ElevatedButton(onPressed: () {}, child: const Text('متابعة'))),
                    const SizedBox(width: 8),
                    Expanded(child: OutlinedButton(onPressed: () => context.go('/chat/chat-${u.id}'), child: const Text('مراسلة'))),
                  ]),
          ),
        ]),
      )),
      SliverPersistentHeader(
        delegate: _TabHeaderDelegate(isMe),
        pinned: true,
      ),
      SliverPadding(
        padding: const EdgeInsets.all(2),
        sliver: SliverGrid(
          gridDelegate: const SliverGridDelegate3Col(),
          delegate: SliverChildBuilderDelegate(
            (context, i) {
              final v = MockDB.videos[i % MockDB.videos.length];
              return Padding(
                padding: const EdgeInsets.all(2),
                child: VideoGridCard(bg: v.bg, likes: v.likes, onTap: () => context.go('/home')),
              );
            },
            childCount: MockDB.videos.length,
          ),
        ),
      ),
    ]);

    if (isMe) return BottomNavScaffold(activeIndex: 4, child: body);
    return Scaffold(body: body);
  }
}

class _Stat extends StatelessWidget {
  final String n; final String l; final VoidCallback onTap;
  const _Stat(this.n, this.l, this.onTap);
  @override
  Widget build(BuildContext context) {
    return GestureDetector(onTap: onTap, child: Column(children: [Text(n, style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w800)), Text(l, style: const TextStyle(fontSize: 12, color: AppColors.muted))]));
  }
}

class SliverGridDelegate3Col extends SliverGridDelegateWithFixedCrossAxisCount {
  const SliverGridDelegate3Col() : super(crossAxisCount: 3, childAspectRatio: 9 / 16);
}

class _TabHeaderDelegate extends SliverPersistentHeaderDelegate {
  final bool isMe;
  _TabHeaderDelegate(this.isMe);
  @override double get minExtent => 44;
  @override double get maxExtent => 44;
  @override bool shouldRebuild(_) => false;
  @override
  Widget build(BuildContext context, double shrinkOffset, bool overlapsContent) {
    return Container(
      color: Colors.white,
      decoration: const BoxDecoration(border: Border(bottom: BorderSide(color: AppColors.border))),
      child: Row(children: [
        _tab('فيديوهات', true),
        _tab('معجَب بها', false),
        if (isMe) _tab('محفوظ', false),
      ]),
    );
  }

  Widget _tab(String label, bool active) => Expanded(
    child: Container(
      alignment: Alignment.center,
      decoration: BoxDecoration(border: Border(bottom: BorderSide(color: active ? AppColors.text : Colors.transparent, width: 2))),
      child: Text(label, style: TextStyle(color: active ? AppColors.text : AppColors.muted, fontWeight: FontWeight.w600)),
    ),
  );
}
