import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../data/mock_data.dart';

class PublishScreen extends StatefulWidget {
  const PublishScreen({super.key});
  @override
  State<PublishScreen> createState() => _PublishScreenState();
}

class _PublishScreenState extends State<PublishScreen> {
  bool _allowComments = true;
  bool _allowSave = true;

  @override
  Widget build(BuildContext context) {
    final v = MockDB.videos[0];
    return Scaffold(
      appBar: AppBar(title: const Text('نشر')),
      body: SafeArea(child: ListView(padding: const EdgeInsets.all(16), children: [
        Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Expanded(child: TextField(maxLines: 4, decoration: const InputDecoration(hintText: 'صف فيديوك، أضف وسومًا (#) أو ذكر مستخدمين (@)', filled: false, border: InputBorder.none))),
          const SizedBox(width: 12),
          ClipRRect(borderRadius: BorderRadius.circular(8), child: SizedBox(width: 80, child: AspectRatio(aspectRatio: 9 / 16, child: CachedNetworkImage(imageUrl: v.bg, fit: BoxFit.cover)))),
        ]),
        const Divider(height: 24),
        _row('الإشارة إلى أشخاص', leading: const Icon(Icons.person, size: 20)),
        _row('إضافة موقع', leading: const Icon(Icons.location_on, size: 20)),
        _row('من يستطيع المشاهدة', leading: const Icon(Icons.lock, size: 20), trailing: Container(padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6), decoration: BoxDecoration(color: AppColors.bg2, borderRadius: BorderRadius.circular(999)), child: const Row(mainAxisSize: MainAxisSize.min, children: [Icon(Icons.public, size: 14), SizedBox(width: 4), Text('عام', style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.w600))]))),
        _row('السماح بالتعليقات', trailing: Switch(value: _allowComments, onChanged: (v) => setState(() => _allowComments = v), activeColor: AppColors.primary)),
        _row('السماح بالحفظ', trailing: Switch(value: _allowSave, onChanged: (v) => setState(() => _allowSave = v), activeColor: AppColors.primary)),
        const SizedBox(height: 24),
        Row(children: [
          Expanded(child: OutlinedButton(style: OutlinedButton.styleFrom(shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(999))), onPressed: () { ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('تم الحفظ كمسودة'))); context.go('/profile'); }, child: const Text('حفظ كمسودة'))),
          const SizedBox(width: 8),
          Expanded(child: ElevatedButton(style: ElevatedButton.styleFrom(shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(999))), onPressed: () { ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('تم النشر بنجاح'))); context.go('/profile'); }, child: const Text('نشر'))),
        ]),
      ])),
    );
  }

  Widget _row(String label, {Widget? leading, Widget? trailing}) {
    return Container(
      decoration: const BoxDecoration(border: Border(bottom: BorderSide(color: AppColors.border))),
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Row(children: [
        if (leading != null) ...[leading, const SizedBox(width: 10)],
        Expanded(child: Text(label, style: const TextStyle(fontSize: 14))),
        trailing ?? const Icon(Icons.chevron_left, color: AppColors.muted),
      ]),
    );
  }
}
