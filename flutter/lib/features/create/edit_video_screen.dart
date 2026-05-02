import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class EditVideoScreen extends StatelessWidget {
  const EditVideoScreen({super.key});
  @override
  Widget build(BuildContext context) {
    final tools = [
      [Icons.music_note, 'صوت'],
      [Icons.filter, 'فلاتر'],
      [Icons.auto_awesome, 'مؤثرات'],
      [Icons.text_fields, 'نص'],
      [Icons.emoji_emotions, 'ملصقات'],
      [Icons.timer, 'سرعة'],
      [Icons.image, 'غلاف'],
    ];
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        leading: IconButton(icon: const Icon(Icons.close, color: Colors.white), onPressed: () => context.go('/create')),
        title: const Text('تعديل الفيديو', style: TextStyle(color: Colors.white)),
        actions: [Padding(padding: const EdgeInsets.all(8), child: ElevatedButton(onPressed: () => context.go('/publish'), child: const Text('التالي')))],
      ),
      body: SafeArea(child: Column(children: [
        Expanded(child: Center(child: Text('🎬 معاينة الفيديو', style: TextStyle(color: Colors.white54)))),
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 12),
          child: Row(children: tools.map((t) => Padding(
            padding: const EdgeInsets.symmetric(horizontal: 6),
            child: SizedBox(width: 64, child: Column(children: [
              Container(width: 40, height: 40, decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.1), shape: BoxShape.circle), child: Icon(t[0] as IconData, color: Colors.white)),
              const SizedBox(height: 4),
              Text(t[1] as String, style: const TextStyle(color: Colors.white, fontSize: 11)),
            ])),
          )).toList()),
        ),
      ])),
    );
  }
}
