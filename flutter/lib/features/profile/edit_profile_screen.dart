import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/widgets/avatar.dart';
import '../../data/mock_data.dart';

class EditProfileScreen extends StatelessWidget {
  const EditProfileScreen({super.key});
  @override
  Widget build(BuildContext context) {
    final u = MockDB.me;
    return Scaffold(
      appBar: AppBar(title: const Text('تعديل البروفايل')),
      body: SafeArea(child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          Center(child: Column(children: [
            Avatar(u.avatar, size: 92),
            TextButton(onPressed: () {}, child: const Text('تغيير الصورة')),
          ])),
          const SizedBox(height: 8),
          const Text('الاسم', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
          const SizedBox(height: 6),
          TextField(decoration: const InputDecoration(), controller: TextEditingController(text: u.name)),
          const SizedBox(height: 14),
          const Text('اسم المستخدم', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
          const SizedBox(height: 6),
          TextField(decoration: const InputDecoration(), controller: TextEditingController(text: u.handle.replaceFirst('@', ''))),
          const SizedBox(height: 14),
          const Text('النبذة', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
          const SizedBox(height: 6),
          TextField(maxLines: 3, decoration: const InputDecoration(), controller: TextEditingController(text: u.bio)),
          const SizedBox(height: 18),
          ElevatedButton(
            style: ElevatedButton.styleFrom(shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(999))),
            onPressed: () { ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('تم الحفظ'))); context.go('/profile'); },
            child: const Text('حفظ التعديلات'),
          ),
        ]),
      )),
    );
  }
}
