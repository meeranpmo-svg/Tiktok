import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../data/mock_data.dart';

class LiveStartScreen extends StatelessWidget {
  const LiveStartScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(children: [
        Positioned.fill(child: ColorFiltered(colorFilter: const ColorFilter.mode(Colors.black54, BlendMode.darken), child: CachedNetworkImage(imageUrl: MockDB.videos.first.bg, fit: BoxFit.cover))),
        SafeArea(child: Column(children: [
          Padding(padding: const EdgeInsets.all(14), child: Align(alignment: Alignment.topLeft, child: IconButton(icon: const Icon(Icons.close, color: Colors.white), onPressed: () => context.go('/create')))),
          const Spacer(),
          const Padding(padding: EdgeInsets.symmetric(horizontal: 24), child: Text('ابدأ بثًا مباشرًا', style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.w800), textAlign: TextAlign.center)),
          const SizedBox(height: 6),
          const Padding(padding: EdgeInsets.symmetric(horizontal: 24), child: Text('تواصل مع جمهورك بفيديو حيّ', style: TextStyle(color: Colors.white70), textAlign: TextAlign.center)),
          const SizedBox(height: 18),
          ConstrainedBox(constraints: const BoxConstraints(maxWidth: 320), child: Padding(padding: const EdgeInsets.symmetric(horizontal: 14), child: TextField(style: const TextStyle(color: Colors.white), decoration: InputDecoration(filled: true, fillColor: Colors.black54, hintText: 'عنوان البث (اختياري)', hintStyle: const TextStyle(color: Colors.white70))))),
          const Spacer(),
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 0, 20, 24),
            child: SizedBox(width: double.infinity, child: ElevatedButton(style: ElevatedButton.styleFrom(backgroundColor: AppColors.danger, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(999))), onPressed: () => context.go('/live/v1'), child: const Text('بدء البث'))),
          ),
        ])),
      ]),
    );
  }
}
