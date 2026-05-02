import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/widgets/avatar.dart';
import '../../data/mock_data.dart';

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('الإشعارات')),
      body: SafeArea(child: ListView.builder(
        itemCount: MockDB.notifications.length,
        itemBuilder: (context, i) {
          final n = MockDB.notifications[i];
          return Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: const BoxDecoration(border: Border(bottom: BorderSide(color: AppColors.border))),
            child: Row(children: [
              n.avatar.isEmpty
                  ? Container(width: 46, height: 46, decoration: const BoxDecoration(color: AppColors.primarySoft, shape: BoxShape.circle), child: const Icon(Icons.notifications, color: AppColors.primary))
                  : Avatar(n.avatar, size: 46),
              const SizedBox(width: 12),
              Expanded(child: RichText(text: TextSpan(style: const TextStyle(color: AppColors.text, fontSize: 13.5), children: [
                TextSpan(text: '${n.userName} ', style: const TextStyle(fontWeight: FontWeight.w700)),
                TextSpan(text: '${n.text} '),
                TextSpan(text: '· ${n.time}', style: const TextStyle(color: AppColors.muted, fontSize: 12)),
              ]))),
              if (n.type == 'follow') OutlinedButton(onPressed: () {}, style: OutlinedButton.styleFrom(minimumSize: const Size(0, 32), padding: const EdgeInsets.symmetric(horizontal: 14)), child: const Text('متابعة', style: TextStyle(fontSize: 12))),
            ]),
          );
        },
      )),
    );
  }
}
