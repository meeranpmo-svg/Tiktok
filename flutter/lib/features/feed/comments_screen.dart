import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/widgets/avatar.dart';
import '../../data/mock_data.dart';

class CommentsScreen extends StatelessWidget {
  final String videoId;
  const CommentsScreen({super.key, required this.videoId});

  @override
  Widget build(BuildContext context) {
    final list = MockDB.commentsFor(videoId);
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: GestureDetector(
        onTap: () => context.pop(),
        child: Container(
          color: Colors.black54,
          child: GestureDetector(
            onTap: () {},
            child: Column(children: [
              const Spacer(),
              ClipRRect(
                borderRadius: const BorderRadius.vertical(top: Radius.circular(18)),
                child: Container(
                  color: Colors.white,
                  height: MediaQuery.of(context).size.height * 0.75,
                  child: Column(children: [
                    // Handle
                    Container(margin: const EdgeInsets.only(top: 8, bottom: 4), width: 40, height: 4, decoration: BoxDecoration(color: AppColors.border, borderRadius: BorderRadius.circular(2))),
                    Padding(padding: const EdgeInsets.fromLTRB(16, 8, 16, 12), child: Row(children: [
                      const SizedBox(width: 28),
                      Expanded(child: Center(child: Text('${list.length} تعليق', style: const TextStyle(fontWeight: FontWeight.w800)))),
                      IconButton(icon: const Icon(Icons.close), onPressed: () => context.pop(), padding: EdgeInsets.zero, constraints: const BoxConstraints()),
                    ])),
                    const Divider(height: 1),
                    Expanded(child: ListView.builder(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      itemCount: list.length,
                      itemBuilder: (context, i) {
                        final c = list[i];
                        final u = c['user'];
                        return Padding(
                          padding: const EdgeInsets.symmetric(vertical: 8),
                          child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                            Avatar(u.avatar, size: 36),
                            const SizedBox(width: 10),
                            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                              Text(u.name, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 12.5, color: AppColors.muted)),
                              Padding(padding: const EdgeInsets.symmetric(vertical: 2), child: Text(c['text'], style: const TextStyle(fontSize: 14))),
                              Row(children: [
                                Text(c['time'], style: const TextStyle(fontSize: 11.5, color: AppColors.muted)),
                                const SizedBox(width: 12),
                                Text('${c['likes']} إعجاب', style: const TextStyle(fontSize: 11.5, color: AppColors.muted)),
                                const SizedBox(width: 12),
                                Text('رد', style: const TextStyle(fontSize: 11.5, color: AppColors.primary, fontWeight: FontWeight.w600)),
                              ]),
                            ])),
                            IconButton(icon: const Icon(Icons.favorite_border, size: 18, color: AppColors.muted), onPressed: () {}, padding: EdgeInsets.zero, constraints: const BoxConstraints()),
                          ]),
                        );
                      },
                    )),
                    SafeArea(top: false, child: Container(
                      padding: const EdgeInsets.all(10),
                      decoration: const BoxDecoration(border: Border(top: BorderSide(color: AppColors.border))),
                      child: Row(children: [
                        Expanded(child: Container(padding: const EdgeInsets.symmetric(horizontal: 14), decoration: BoxDecoration(color: AppColors.bg2, borderRadius: BorderRadius.circular(999)), child: const TextField(decoration: InputDecoration(border: InputBorder.none, hintText: 'أضف تعليقًا...', filled: false, contentPadding: EdgeInsets.symmetric(vertical: 10))))),
                        IconButton(icon: const Icon(Icons.send, color: AppColors.primary), onPressed: () {}),
                      ]),
                    )),
                  ]),
                ),
              ),
            ]),
          ),
        ),
      ),
    );
  }
}
