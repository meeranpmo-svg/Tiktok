import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/widgets/avatar.dart';
import '../../data/mock_data.dart';

class LiveViewerScreen extends StatelessWidget {
  final String liveId;
  const LiveViewerScreen({super.key, required this.liveId});

  @override
  Widget build(BuildContext context) {
    final video = MockDB.videos.first; // mock — pretend there's a live for any id
    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(children: [
        Positioned.fill(child: ColorFiltered(colorFilter: const ColorFilter.mode(Colors.black54, BlendMode.darken), child: CachedNetworkImage(imageUrl: video.bg, fit: BoxFit.cover))),
        SafeArea(child: Column(children: [
          Padding(padding: const EdgeInsets.all(14), child: Row(children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
              decoration: BoxDecoration(color: Colors.black54, borderRadius: BorderRadius.circular(999)),
              child: Row(mainAxisSize: MainAxisSize.min, children: [
                Avatar(MockDB.users.first.avatar, size: 30),
                const SizedBox(width: 8),
                Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisSize: MainAxisSize.min, children: [
                  Text(MockDB.users.first.name, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 12)),
                  Directionality(textDirection: TextDirection.ltr, child: Text(MockDB.users.first.handle, style: const TextStyle(color: Colors.white70, fontSize: 10))),
                ]),
                const SizedBox(width: 8),
                ElevatedButton(onPressed: () {}, style: ElevatedButton.styleFrom(backgroundColor: AppColors.danger, minimumSize: const Size(0, 28), padding: const EdgeInsets.symmetric(horizontal: 12)), child: const Text('متابعة', style: TextStyle(fontSize: 11))),
              ]),
            ),
            const SizedBox(width: 8),
            Container(padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4), decoration: BoxDecoration(color: AppColors.danger, borderRadius: BorderRadius.circular(6)), child: const Text('مباشر', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w800))),
            const SizedBox(width: 6),
            Container(padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4), decoration: BoxDecoration(color: Colors.black54, borderRadius: BorderRadius.circular(6)), child: const Text('1.2K 👁', style: TextStyle(color: Colors.white, fontSize: 11))),
            const Spacer(),
            IconButton(icon: const Icon(Icons.close, color: Colors.white), onPressed: () => context.go('/home')),
          ])),
          const Spacer(),
          Padding(padding: const EdgeInsets.symmetric(horizontal: 14), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            for (final c in [['أحمد', 'جميل جدًا 🔥'], ['سارة', '👏👏👏'], ['علي', 'أرسلت لك هدية 🌹']])
              Container(margin: const EdgeInsets.only(bottom: 6), padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6), decoration: BoxDecoration(color: Colors.black54, borderRadius: BorderRadius.circular(14)), child: Text.rich(TextSpan(text: '${c[0]}: ', style: const TextStyle(color: Colors.white70, fontWeight: FontWeight.w700, fontSize: 12), children: [TextSpan(text: c[1], style: const TextStyle(color: Colors.white))]))),
          ])),
          SafeArea(top: false, child: Padding(
            padding: const EdgeInsets.fromLTRB(12, 12, 12, 14),
            child: Row(children: [
              Expanded(child: Container(padding: const EdgeInsets.symmetric(horizontal: 14), decoration: BoxDecoration(color: Colors.black54, borderRadius: BorderRadius.circular(999)), child: const TextField(style: TextStyle(color: Colors.white), decoration: InputDecoration(hintText: 'أرسل تعليقًا...', hintStyle: TextStyle(color: Colors.white70), border: InputBorder.none, filled: false, contentPadding: EdgeInsets.symmetric(vertical: 10))))),
              IconButton(icon: const Icon(Icons.card_giftcard, color: Colors.white), onPressed: () => _showGiftSheet(context)),
              IconButton(icon: const Icon(Icons.favorite, color: Colors.white), onPressed: () {}),
              IconButton(icon: const Icon(Icons.share, color: Colors.white), onPressed: () => context.go('/share/$liveId')),
            ]),
          )),
        ])),
      ]),
    );
  }

  void _showGiftSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF1A1A1A),
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(18))),
      builder: (_) => Padding(
        padding: const EdgeInsets.fromLTRB(16, 14, 16, 24),
        child: Column(mainAxisSize: MainAxisSize.min, children: [
          Row(children: [
            const Text('الهدايا', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 16)),
            const Spacer(),
            Text('🪙 ${MockDB.walletBalance}', style: const TextStyle(color: Color(0xFFFBBF24), fontWeight: FontWeight.w800)),
          ]),
          const SizedBox(height: 14),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 4, mainAxisSpacing: 10, crossAxisSpacing: 10),
            itemCount: MockDB.gifts.length,
            itemBuilder: (context, i) {
              final g = MockDB.gifts[i];
              return InkWell(
                onTap: () {
                  if (MockDB.walletBalance < g.price) {
                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('رصيد غير كافٍ — اشحن المحفظة')));
                    return;
                  }
                  MockDB.walletBalance -= g.price;
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('تم إرسال ${g.name} ${g.emoji}')));
                },
                child: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(color: const Color(0xFF2A2A2A), borderRadius: BorderRadius.circular(12)),
                  child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                    Text(g.emoji, style: const TextStyle(fontSize: 28)),
                    const SizedBox(height: 4),
                    Text(g.name, style: const TextStyle(color: Colors.white, fontSize: 11)),
                    Text('🪙 ${g.price}', style: const TextStyle(color: Color(0xFFFBBF24), fontSize: 11, fontWeight: FontWeight.w700)),
                  ]),
                ),
              );
            },
          ),
        ]),
      ),
    );
  }
}
