import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';

class ForgotScreen extends StatefulWidget {
  const ForgotScreen({super.key});
  @override
  State<ForgotScreen> createState() => _ForgotScreenState();
}

class _ForgotScreenState extends State<ForgotScreen> {
  final _id = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('استعادة كلمة المرور')),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
            const Text('نسيت كلمة المرور؟', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w800)),
            const SizedBox(height: 6),
            const Text('سنرسل لك رابط/رمز إعادة تعيين', style: TextStyle(color: AppColors.muted)),
            const SizedBox(height: 24),
            TextField(controller: _id, decoration: const InputDecoration(hintText: 'البريد الإلكتروني أو رقم الهاتف')),
            const SizedBox(height: 18),
            ElevatedButton(
              style: ElevatedButton.styleFrom(shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(999))),
              onPressed: () {
                if (_id.text.isEmpty) return;
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('تم إرسال الرمز')));
                context.go('/reset');
              },
              child: const Text('إرسال الرمز'),
            ),
          ]),
        ),
      ),
    );
  }
}
