import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../data/mock_data.dart';

class WalletScreen extends StatefulWidget {
  const WalletScreen({super.key});
  @override
  State<WalletScreen> createState() => _WalletScreenState();
}

class _WalletScreenState extends State<WalletScreen> {
  String _filter = 'all';

  @override
  Widget build(BuildContext context) {
    final tx = MockDB.walletTx.where((t) => _filter == 'all' || t.type == _filter).toList();
    return Scaffold(
      appBar: AppBar(title: const Text('المحفظة')),
      body: SafeArea(child: ListView(children: [
        Container(
          margin: const EdgeInsets.all(16),
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            gradient: const LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight, colors: [AppColors.primary, Color(0xFFFF0080)]),
            borderRadius: BorderRadius.circular(18),
          ),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            const Text('الرصيد المتاح', style: TextStyle(color: Colors.white70, fontSize: 13)),
            const SizedBox(height: 4),
            Text('🪙 ${MockDB.walletBalance}', style: const TextStyle(color: Colors.white, fontSize: 30, fontWeight: FontWeight.w800)),
            const SizedBox(height: 16),
            Row(children: [
              Expanded(child: ElevatedButton(style: ElevatedButton.styleFrom(backgroundColor: Colors.white24, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(999))), onPressed: () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('شاشة الشحن'))), child: const Text('شحن'))),
              const SizedBox(width: 8),
              Expanded(child: ElevatedButton(style: ElevatedButton.styleFrom(backgroundColor: Colors.white24, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(999))), onPressed: () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('شاشة السحب'))), child: const Text('سحب'))),
            ]),
          ]),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(children: [
            for (final f in [['all', 'الكل'], ['in', 'إيرادات'], ['out', 'صادر']])
              Padding(padding: const EdgeInsets.only(right: 6), child: ChoiceChip(
                label: Text(f[1]),
                selected: _filter == f[0],
                onSelected: (_) => setState(() => _filter = f[0]),
                selectedColor: AppColors.text,
                labelStyle: TextStyle(color: _filter == f[0] ? Colors.white : AppColors.muted, fontWeight: FontWeight.w600),
                backgroundColor: AppColors.bg2,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(999), side: BorderSide.none),
              )),
          ]),
        ),
        const SizedBox(height: 8),
        ...tx.map((t) => Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          decoration: const BoxDecoration(border: Border(bottom: BorderSide(color: AppColors.border))),
          child: Row(children: [
            Container(width: 40, height: 40, decoration: BoxDecoration(color: t.type == 'in' ? const Color(0xFFDCFCE7) : const Color(0xFFFEE2E2), shape: BoxShape.circle), child: Icon(t.type == 'in' ? Icons.arrow_downward : Icons.arrow_upward, color: t.type == 'in' ? AppColors.success : AppColors.danger, size: 20)),
            const SizedBox(width: 12),
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(t.title, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
              Text('${t.sub} · ${t.time}', style: const TextStyle(fontSize: 12, color: AppColors.muted)),
            ])),
            Text('${t.type == 'in' ? '+' : '-'}${t.amount} 🪙', style: TextStyle(color: t.type == 'in' ? AppColors.success : AppColors.danger, fontWeight: FontWeight.w800)),
          ]),
        )),
      ])),
    );
  }
}
