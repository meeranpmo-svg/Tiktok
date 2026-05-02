import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/widgets/avatar.dart';
import '../../core/widgets/bottom_nav_scaffold.dart';
import '../../data/mock_data.dart';

class InboxScreen extends StatelessWidget {
  const InboxScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BottomNavScaffold(
      activeIndex: 3,
      child: Scaffold(
        backgroundColor: Colors.white,
        appBar: AppBar(title: const Text('البريد'), actions: [IconButton(icon: const Icon(Icons.search), onPressed: () => context.go('/discover'))], automaticallyImplyLeading: false),
        body: ListView(children: [
          _ActionsRow(),
          ...MockDB.chats.map((c) => InkWell(
            onTap: () => context.go('/chat/${c.id}'),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: const BoxDecoration(border: Border(bottom: BorderSide(color: AppColors.border))),
              child: Row(children: [
                Stack(children: [
                  Avatar(c.user.avatar, size: 52),
                  if (c.online) Positioned(right: 0, bottom: 0, child: Container(width: 12, height: 12, decoration: BoxDecoration(color: AppColors.success, shape: BoxShape.circle, border: Border.all(color: Colors.white, width: 2)))),
                ]),
                const SizedBox(width: 12),
                Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Row(children: [Expanded(child: Text(c.user.name, style: const TextStyle(fontWeight: FontWeight.w700))), Text(c.time, style: const TextStyle(color: AppColors.muted, fontSize: 12))]),
                  const SizedBox(height: 2),
                  Text(c.last, style: TextStyle(color: c.unread > 0 ? AppColors.text : AppColors.muted, fontSize: 13, fontWeight: c.unread > 0 ? FontWeight.w600 : FontWeight.w400), overflow: TextOverflow.ellipsis),
                ])),
                if (c.unread > 0) Container(margin: const EdgeInsetsDirectional.only(start: 8), padding: const EdgeInsets.symmetric(horizontal: 6), constraints: const BoxConstraints(minWidth: 20, minHeight: 20), decoration: BoxDecoration(color: AppColors.primary, borderRadius: BorderRadius.circular(10)), alignment: Alignment.center, child: Text('${c.unread}', style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w700))),
              ]),
            ),
          )),
        ]),
      ),
    );
  }
}

class _ActionsRow extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final items = [
      [Icons.favorite, 'إعجابات', AppColors.danger],
      [Icons.person, 'متابعون جدد', AppColors.warn],
      [Icons.chat_bubble, 'تعليقات', AppColors.success],
      [Icons.notifications, 'إشعارات', AppColors.primary],
    ];
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12),
      decoration: const BoxDecoration(border: Border(bottom: BorderSide(color: AppColors.border))),
      child: Row(children: items.map((it) => Expanded(child: GestureDetector(
        onTap: () => context.go('/notifications'),
        child: Column(children: [
          Container(width: 46, height: 46, decoration: BoxDecoration(color: it[2] as Color, shape: BoxShape.circle), child: Icon(it[0] as IconData, color: Colors.white)),
          const SizedBox(height: 6),
          Text(it[1] as String, style: const TextStyle(fontSize: 12)),
        ]),
      ))).toList()),
    );
  }
}
