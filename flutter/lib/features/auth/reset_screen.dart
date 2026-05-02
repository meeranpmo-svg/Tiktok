import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class ResetScreen extends StatefulWidget {
  const ResetScreen({super.key});
  @override
  State<ResetScreen> createState() => _ResetScreenState();
}

class _ResetScreenState extends State<ResetScreen> {
  final _p1 = TextEditingController();
  final _p2 = TextEditingController();
  String? _error;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('كلمة مرور جديدة')),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
            const Text('أدخل كلمة مرور جديدة', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w800)),
            const SizedBox(height: 6),
            const Text('8 أحرف على الأقل، تشمل رقمًا ورمزًا.', style: TextStyle(color: Color(0xFF8A8A8A))),
            const SizedBox(height: 18),
            if (_error != null) Container(
              padding: const EdgeInsets.all(12),
              margin: const EdgeInsets.only(bottom: 12),
              decoration: BoxDecoration(color: const Color(0xFFFEE2E2), borderRadius: BorderRadius.circular(8)),
              child: Text(_error!, style: const TextStyle(color: Color(0xFF991B1B), fontSize: 13)),
            ),
            TextField(controller: _p1, obscureText: true, decoration: const InputDecoration(hintText: 'كلمة المرور الجديدة')),
            const SizedBox(height: 12),
            TextField(controller: _p2, obscureText: true, decoration: const InputDecoration(hintText: 'تأكيد كلمة المرور')),
            const SizedBox(height: 18),
            ElevatedButton(
              style: ElevatedButton.styleFrom(shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(999))),
              onPressed: () {
                if (_p1.text.length < 8) { setState(() => _error = 'كلمة المرور 8 أحرف على الأقل'); return; }
                if (_p1.text != _p2.text) { setState(() => _error = 'كلمتا المرور غير متطابقتين'); return; }
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('تم تحديث كلمة المرور')));
                context.go('/login');
              },
              child: const Text('حفظ كلمة المرور'),
            ),
          ]),
        ),
      ),
    );
  }
}
