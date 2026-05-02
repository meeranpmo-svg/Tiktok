import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/widgets/bottom_nav_scaffold.dart';
import '../../core/widgets/video_grid_card.dart';
import '../../data/mock_data.dart';

class DiscoverScreen extends StatefulWidget {
  const DiscoverScreen({super.key});
  @override
  State<DiscoverScreen> createState() => _DiscoverScreenState();
}

class _DiscoverScreenState extends State<DiscoverScreen> {
  String _tag = 'الكل';

  @override
  Widget build(BuildContext context) {
    return BottomNavScaffold(
      activeIndex: 1,
      child: Scaffold(
        backgroundColor: Colors.white,
        appBar: AppBar(
          automaticallyImplyLeading: false,
          title: Container(
            decoration: BoxDecoration(color: AppColors.bg2, borderRadius: BorderRadius.circular(999)),
            padding: const EdgeInsets.symmetric(horizontal: 14),
            child: const Row(children: [
              Icon(Icons.search, color: AppColors.muted, size: 20),
              SizedBox(width: 8),
              Expanded(child: TextField(decoration: InputDecoration(border: InputBorder.none, hintText: 'ابحث عن مستخدمين، فيديوهات، أو هاشتاجات', filled: false, contentPadding: EdgeInsets.symmetric(vertical: 10)))),
            ]),
          ),
        ),
        body: ListView(children: [
          SizedBox(height: 40, child: ListView(scrollDirection: Axis.horizontal, padding: const EdgeInsets.symmetric(horizontal: 16), children: [
            for (final t in ['الكل', 'فيديوهات', 'حسابات', 'هاشتاجات', 'أصوات'])
              Padding(padding: const EdgeInsets.only(right: 6), child: ChoiceChip(
                label: Text(t),
                selected: _tag == t,
                onSelected: (_) => setState(() => _tag = t),
                selectedColor: AppColors.text,
                labelStyle: TextStyle(color: _tag == t ? Colors.white : AppColors.text, fontWeight: FontWeight.w600),
                backgroundColor: AppColors.bg2,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(999), side: BorderSide.none),
              )),
          ])),
          const Padding(padding: EdgeInsets.fromLTRB(16, 14, 16, 6), child: Text('هاشتاجات رائجة', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800))),
          ...MockDB.trending.asMap().entries.map((e) => ListTile(
            leading: SizedBox(width: 24, child: Text('#${e.key + 1}', style: const TextStyle(fontWeight: FontWeight.w800, color: AppColors.muted))),
            title: Text(e.value.tag, style: const TextStyle(fontWeight: FontWeight.w600)),
            subtitle: Text(e.value.meta, style: const TextStyle(color: AppColors.muted, fontSize: 12)),
            onTap: () {},
          )),
          const Padding(padding: EdgeInsets.fromLTRB(16, 14, 16, 6), child: Text('فيديوهات شائعة', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800))),
          GridView.builder(
            physics: const NeverScrollableScrollPhysics(),
            shrinkWrap: true,
            padding: const EdgeInsets.all(2),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 3, mainAxisSpacing: 4, crossAxisSpacing: 4, childAspectRatio: 9 / 16),
            itemCount: MockDB.videos.length,
            itemBuilder: (context, i) {
              final v = MockDB.videos[i];
              return VideoGridCard(bg: v.bg, likes: v.likes, onTap: () => context.go('/home'));
            },
          ),
        ]),
      ),
    );
  }
}
