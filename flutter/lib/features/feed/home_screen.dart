import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/widgets/bottom_nav_scaffold.dart';
import '../../data/mock_data.dart';
import '../../data/models/models.dart';

class HomeScreen extends StatefulWidget {
  final String tab; // 'foryou' | 'following'
  const HomeScreen({super.key, this.tab = 'foryou'});
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late String _tab = widget.tab;
  late List<Video> _videos;

  @override
  void initState() {
    super.initState();
    _videos = MockDB.videos;
  }

  @override
  Widget build(BuildContext context) {
    return BottomNavScaffold(
      activeIndex: 0,
      dark: true,
      child: Stack(children: [
        // Vertical paged feed
        PageView.builder(
          scrollDirection: Axis.vertical,
          itemCount: _videos.length,
          itemBuilder: (context, i) => _VideoPage(video: _videos[i], onChanged: () => setState(() {})),
        ),
        // Top tabs
        Positioned(
          top: MediaQuery.of(context).padding.top + 14,
          left: 0, right: 0,
          child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
            _Tab('متابعون', _tab == 'following', () => setState(() => _tab = 'following')),
            const SizedBox(width: 22),
            _Tab('لك', _tab == 'foryou', () => setState(() => _tab = 'foryou')),
            const SizedBox(width: 22),
            _Tab('مباشر', false, () => context.go('/live/host-list')),
          ]),
        ),
        Positioned(
          top: MediaQuery.of(context).padding.top + 12,
          left: 12,
          child: IconButton(icon: const Icon(Icons.search, color: Colors.white), onPressed: () => context.go('/discover')),
        ),
      ]),
    );
  }
}

class _Tab extends StatelessWidget {
  final String label;
  final bool active;
  final VoidCallback onTap;
  const _Tab(this.label, this.active, this.onTap);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Column(children: [
        Text(label, style: TextStyle(color: active ? Colors.white : Colors.white70, fontSize: 16, fontWeight: FontWeight.w700)),
        const SizedBox(height: 4),
        Container(width: active ? 24 : 0, height: 3, decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(2))),
      ]),
    );
  }
}

class _VideoPage extends StatelessWidget {
  final Video video;
  final VoidCallback onChanged;
  const _VideoPage({required this.video, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    return Stack(fit: StackFit.expand, children: [
      CachedNetworkImage(imageUrl: video.bg, fit: BoxFit.cover, placeholder: (_, __) => Container(color: Colors.black)),
      // Gradient overlay
      Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(begin: Alignment.center, end: Alignment.bottomCenter, colors: [Colors.transparent, Colors.black87]),
        ),
      ),
      // Right info
      Positioned(
        right: 16, bottom: MediaQuery.of(context).padding.bottom + 110,
        left: 90,
        child: Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
          Text(video.user.handle, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 15), textDirection: TextDirection.ltr),
          const SizedBox(height: 4),
          Text(video.desc, style: const TextStyle(color: Colors.white, fontSize: 13.5, height: 1.45), maxLines: 2, overflow: TextOverflow.ellipsis, textAlign: TextAlign.right),
          const SizedBox(height: 8),
          Row(mainAxisSize: MainAxisSize.min, children: [
            Text(video.music, style: const TextStyle(color: Colors.white70, fontSize: 12.5)),
            const SizedBox(width: 6),
            const Icon(Icons.music_note, color: Colors.white70, size: 14),
          ]),
        ]),
      ),
      // Left action bar
      Positioned(
        left: 8, bottom: MediaQuery.of(context).padding.bottom + 90,
        child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.center, children: [
          _AvatarAction(url: video.user.avatar, onTap: () => context.go('/profile/${video.user.id}')),
          const SizedBox(height: 16),
          _Action(
            icon: Icons.favorite,
            count: MockDB.fmt(video.likes),
            color: video.liked ? AppColors.danger : Colors.white,
            onTap: () { video.liked = !video.liked; video.likes += video.liked ? 1 : -1; onChanged(); },
          ),
          const SizedBox(height: 16),
          _Action(icon: Icons.chat_bubble, count: MockDB.fmt(video.comments), onTap: () => context.go('/comments/${video.id}')),
          const SizedBox(height: 16),
          _Action(icon: Icons.bookmark, count: MockDB.fmt(video.saves), onTap: () { video.saved = !video.saved; onChanged(); ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(video.saved ? 'تم الحفظ' : 'تم إلغاء الحفظ'))); }),
          const SizedBox(height: 16),
          _Action(icon: Icons.share, count: MockDB.fmt(video.shares), onTap: () => context.go('/share/${video.id}')),
        ]),
      ),
    ]);
  }
}

class _AvatarAction extends StatelessWidget {
  final String url;
  final VoidCallback onTap;
  const _AvatarAction({required this.url, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: SizedBox(
        width: 50, height: 56,
        child: Stack(clipBehavior: Clip.none, alignment: Alignment.topCenter, children: [
          Container(
            width: 44, height: 44,
            decoration: BoxDecoration(border: Border.all(color: Colors.white, width: 2), borderRadius: BorderRadius.circular(50)),
            child: ClipOval(child: CachedNetworkImage(imageUrl: url, fit: BoxFit.cover)),
          ),
          Positioned(
            bottom: 0,
            child: Container(
              width: 18, height: 18,
              decoration: const BoxDecoration(color: AppColors.danger, shape: BoxShape.circle),
              alignment: Alignment.center,
              child: const Icon(Icons.add, color: Colors.white, size: 14),
            ),
          ),
        ]),
      ),
    );
  }
}

class _Action extends StatelessWidget {
  final IconData icon;
  final String count;
  final Color color;
  final VoidCallback onTap;
  const _Action({required this.icon, required this.count, this.color = Colors.white, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Column(children: [
        Icon(icon, color: color, size: 32, shadows: const [Shadow(color: Colors.black54, blurRadius: 6)]),
        const SizedBox(height: 2),
        Text(count, style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w700, shadows: [Shadow(color: Colors.black, blurRadius: 4)])),
      ]),
    );
  }
}
