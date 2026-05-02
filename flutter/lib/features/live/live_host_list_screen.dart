import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../data/mock_data.dart';

class LiveHostListScreen extends StatelessWidget {
  const LiveHostListScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('بثوث مباشرة'),
        actions: [IconButton(icon: const Icon(Icons.close), onPressed: () => context.go('/home'))],
      ),
      body: GridView.builder(
        padding: const EdgeInsets.all(4),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 3, mainAxisSpacing: 4, crossAxisSpacing: 4, childAspectRatio: 9 / 16),
        itemCount: MockDB.videos.length,
        itemBuilder: (context, i) {
          final v = MockDB.videos[i];
          return GestureDetector(
            onTap: () => context.go('/live/${v.id}'),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: Stack(fit: StackFit.expand, children: [
                CachedNetworkImage(imageUrl: v.bg, fit: BoxFit.cover),
                Container(decoration: const BoxDecoration(gradient: LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter, colors: [Colors.transparent, Colors.black87]))),
                Positioned(top: 6, left: 6, child: Container(padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2), decoration: BoxDecoration(color: AppColors.danger, borderRadius: BorderRadius.circular(4)), child: const Text('● مباشر', style: TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.w800)))),
                Positioned(left: 6, bottom: 6, right: 6, child: Text('${MockDB.fmt(800 + i * 137)} 👁', style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w700))),
              ]),
            ),
          );
        },
      ),
    );
  }
}
