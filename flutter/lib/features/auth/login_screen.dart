import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _id = TextEditingController();
  final _pass = TextEditingController();
  bool _showPass = false;
  String? _error;

  @override
  void dispose() {
    _id.dispose();
    _pass.dispose();
    super.dispose();
  }

  void _submit() {
    if (_id.text.isEmpty || _pass.text.isEmpty) {
      setState(() => _error = 'الرجاء إدخال جميع الحقول');
      return;
    }
    context.go('/home');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(24, 20, 24, 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 30),
              Container(
                width: 76, height: 76,
                decoration: BoxDecoration(
                  gradient: AppColors.brandGradient,
                  borderRadius: BorderRadius.circular(22),
                  boxShadow: [BoxShadow(color: AppColors.primary.withValues(alpha: 0.35), blurRadius: 30, offset: const Offset(0, 12))],
                ),
                alignment: Alignment.center,
                child: const Text('T', style: TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.w800)),
              ),
              const SizedBox(height: 16),
              const Text('مرحبًا بعودتك', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800), textAlign: TextAlign.center),
              const SizedBox(height: 6),
              const Text('سجّل دخولك للمتابعة', style: TextStyle(color: AppColors.muted), textAlign: TextAlign.center),
              const SizedBox(height: 24),
              if (_error != null) Container(
                padding: const EdgeInsets.all(12),
                margin: const EdgeInsets.only(bottom: 12),
                decoration: BoxDecoration(color: const Color(0xFFFEE2E2), borderRadius: BorderRadius.circular(8)),
                child: Text(_error!, style: const TextStyle(color: Color(0xFF991B1B), fontSize: 13)),
              ),
              TextField(controller: _id, decoration: const InputDecoration(hintText: 'البريد الإلكتروني أو رقم الهاتف')),
              const SizedBox(height: 12),
              TextField(
                controller: _pass,
                obscureText: !_showPass,
                decoration: InputDecoration(
                  hintText: 'كلمة المرور',
                  suffixIcon: IconButton(
                    icon: Icon(_showPass ? Icons.visibility_off : Icons.visibility, color: AppColors.muted),
                    onPressed: () => setState(() => _showPass = !_showPass),
                  ),
                ),
              ),
              const SizedBox(height: 6),
              Align(
                alignment: AlignmentDirectional.centerEnd,
                child: TextButton(onPressed: () => context.go('/forgot'), child: const Text('نسيت كلمة المرور؟')),
              ),
              const SizedBox(height: 14),
              ElevatedButton(
                style: ElevatedButton.styleFrom(shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(999))),
                onPressed: _submit,
                child: const Text('تسجيل الدخول'),
              ),
              const SizedBox(height: 24),
              Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                const Text('ليس لديك حساب؟ ', style: TextStyle(color: AppColors.muted)),
                GestureDetector(onTap: () => context.go('/register'), child: const Text('إنشاء حساب', style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.w700))),
              ]),
            ],
          ),
        ),
      ),
    );
  }
}
