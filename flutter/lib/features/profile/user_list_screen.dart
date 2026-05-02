import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/widgets/avatar.dart';
import '../../data/mock_data.dart';

class UserListScreen extends StatelessWidget {
  final String which; // 'followers' or 'following'
  const UserListScreen({super.key, required this.which});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(which == 'followers' ? 'المتابعون' : 'المتابَعون')),
      body: SafeArea(child: Column(children: [
        const Padding(
          padding: EdgeInsets.all(12),
          child: TextField(decoration: InputDecoration(hintText: 'بحث', prefixIcon: Icon(Icons.search))),
        ),
        Expanded(child: ListView.builder(
          itemCount: MockDB.users.length,
          itemBuilder: (context, i) {
            final u = MockDB.users[i];
            return ListTile(
              leading: Avatar(u.avatar),
              title: Text(u.name + (u.verified ? ' ✓' : ''), style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
              subtitle: Directionality(textDirection: TextDirection.ltr, child: Text(u.handle, style: const TextStyle(color: AppColors.muted, fontSize: 12))),
              trailing: OutlinedButton(onPressed: () {}, style: OutlinedButton.styleFrom(minimumSize: const Size(0, 32), padding: const EdgeInsets.symmetric(horizontal: 14)), child: Text(which == 'followers' ? 'متابعة' : 'متابَع', style: const TextStyle(fontSize: 12))),
              onTap: () => context.go('/profile/${u.id}'),
            );
          },
        )),
      ])),
    );
  }
}
