import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../data/mock_data.dart';

class ShareScreen extends StatefulWidget {
  final String? videoId;
  const ShareScreen({super.key, this.videoId});
  @override
  State<ShareScreen> createState() => _ShareScreenState();
}

class _ShareScreenState extends State<ShareScreen> {
  final _ctrl = TextEditingController(text: 'احمد');
  final Set<String> _selected = {'c-3'};

  // 20 mock contacts (all named "أحمد" to mirror the Figma)
  late final List<Map<String, String>> _contacts = List.generate(20, (i) => {'id': 'c-$i', 'name': 'أحمد', 'avatar': MockDB.users[i % MockDB.users.length].avatar});

  @override
  Widget build(BuildContext context) {
    final filtered = _ctrl.text.trim().isEmpty
        ? _contacts
        : _contacts.where((c) => c['name']!.contains(_ctrl.text.trim())).toList();

    return Scaffold(
      appBar: AppBar(title: const Text('مشاركة'), leading: IconButton(icon: const Icon(Icons.close), onPressed: () => context.pop())),
      body: SafeArea(child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 4, 16, 12),
        child: Column(children: [
          Container(
            decoration: BoxDecoration(color: AppColors.bg2, borderRadius: BorderRadius.circular(999)),
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
            child: Row(children: [
              if (_ctrl.text.isNotEmpty) GestureDetector(onTap: () => setState(() => _ctrl.clear()), child: Container(width: 22, height: 22, decoration: const BoxDecoration(color: Color(0xFFD8D8DB), shape: BoxShape.circle), child: const Icon(Icons.close, size: 14, color: Colors.white))),
              Expanded(child: TextField(controller: _ctrl, textAlign: TextAlign.right, decoration: const InputDecoration(border: InputBorder.none, hintText: 'بحث', filled: false, contentPadding: EdgeInsets.symmetric(vertical: 10)), onChanged: (_) => setState(() {}))),
              const Icon(Icons.search, color: AppColors.muted, size: 20),
            ]),
          ),
          const SizedBox(height: 10),
          Expanded(child: GridView.builder(
            padding: const EdgeInsets.symmetric(vertical: 6),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 4, mainAxisSpacing: 14, crossAxisSpacing: 8),
            itemCount: filtered.length,
            itemBuilder: (context, i) {
              final c = filtered[i];
              final selected = _selected.contains(c['id']);
              return GestureDetector(
                onTap: () => setState(() => selected ? _selected.remove(c['id']) : _selected.add(c['id']!)),
                child: Column(children: [
                  Stack(alignment: Alignment.center, children: [
                    Container(
                      width: 64, height: 64,
                      decoration: const BoxDecoration(shape: BoxShape.circle, color: Color(0xFFDDDDDD)),
                      clipBehavior: Clip.antiAlias,
                      child: Image.network(c['avatar']!, fit: BoxFit.cover),
                    ),
                    if (selected) Container(width: 64, height: 64, decoration: const BoxDecoration(shape: BoxShape.circle, color: AppColors.selectedOverlay), child: const Icon(Icons.check, color: Colors.white, size: 28)),
                  ]),
                  const SizedBox(height: 6),
                  Text(c['name']!, style: const TextStyle(fontSize: 13)),
                ]),
              );
            },
          )),
          const Divider(),
          Padding(padding: const EdgeInsets.symmetric(vertical: 6), child: Row(mainAxisAlignment: MainAxisAlignment.spaceAround, children: [
            _social(Icons.camera_alt, 'Snapchat', const Color(0xFFFFFC00), const Color(0xFF111111)),
            _social(Icons.facebook, 'Facebook', const Color(0xFF1877F2), Colors.white),
            _social(Icons.chat, 'WhatsApp', const Color(0xFF25D366), Colors.white),
            _social(Icons.link, 'نسخ الرابط', AppColors.bg2, AppColors.muted),
            _social(Icons.download, 'تحميل', AppColors.bg2, AppColors.muted),
          ])),
          SizedBox(width: double.infinity, child: ElevatedButton(
            style: ElevatedButton.styleFrom(shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(999))),
            onPressed: _selected.isEmpty ? null : () { ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('تم الإرسال إلى ${_selected.length}'))); context.pop(); },
            child: Text(_selected.isEmpty ? 'إرسال' : 'إرسال (${_selected.length})'),
          )),
        ]),
      )),
    );
  }

  Widget _social(IconData icon, String label, Color bg, Color fg) {
    return Column(children: [
      Container(width: 40, height: 40, decoration: BoxDecoration(color: bg, shape: BoxShape.circle), child: Icon(icon, color: fg, size: 20)),
      const SizedBox(height: 6),
      Text(label, style: const TextStyle(fontSize: 10.5)),
    ]);
  }
}
