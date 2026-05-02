import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});
  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _email = TextEditingController();
  final _phone = TextEditingController();
  final _pass = TextEditingController();
  final _confirm = TextEditingController();
  String? _error;

  void _submit() {
    final emailOk = RegExp(r'^.+@.+\..+$').hasMatch(_email.text);
    final phoneOk = RegExp(r'^[\d\s+()-]{8,}$').hasMatch(_phone.text);
    if (!emailOk && !phoneOk) {
      setState(() => _error = 'أدخل بريدًا أو رقم هاتف صحيح');
      return;
    }
    if (_pass.text.length < 8) {
      setState(() => _error = 'كلمة المرور 8 أحرف على الأقل');
      return;
    }
    if (_pass.text != _confirm.text) {
      setState(() => _error = 'كلمتا المرور غير متطابقتين');
      return;
    }
    context.go('/otp');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('إنشاء حساب'), leading: IconButton(icon: const Icon(Icons.arrow_back), onPressed: () => context.go('/login'))),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
            const Text('انضم إلى Tenth Tone', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w800)),
            const SizedBox(height: 6),
            const Text('بإنشاء حساب أنت توافق على الشروط وسياسة الخصوصية.', style: TextStyle(color: Color(0xFF8A8A8A))),
            const SizedBox(height: 20),
            if (_error != null) Container(
              padding: const EdgeInsets.all(12),
              margin: const EdgeInsets.only(bottom: 12),
              decoration: BoxDecoration(color: const Color(0xFFFEE2E2), borderRadius: BorderRadius.circular(8)),
              child: Text(_error!, style: const TextStyle(color: Color(0xFF991B1B), fontSize: 13)),
            ),
            TextField(controller: _email, decoration: const InputDecoration(hintText: 'البريد الإلكتروني'), keyboardType: TextInputType.emailAddress),
            const SizedBox(height: 12),
            TextField(controller: _phone, decoration: const InputDecoration(hintText: 'رقم الهاتف'), keyboardType: TextInputType.phone),
            const SizedBox(height: 12),
            TextField(controller: _pass, obscureText: true, decoration: const InputDecoration(hintText: 'كلمة المرور')),
            const SizedBox(height: 12),
            TextField(controller: _confirm, obscureText: true, decoration: const InputDecoration(hintText: 'تأكيد كلمة المرور')),
            const SizedBox(height: 18),
            ElevatedButton(
              style: ElevatedButton.styleFrom(shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(999))),
              onPressed: _submit,
              child: const Text('تسجيل'),
            ),
          ]),
        ),
      ),
    );
  }
}
