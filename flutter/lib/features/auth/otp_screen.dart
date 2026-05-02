import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';

class OtpScreen extends StatefulWidget {
  const OtpScreen({super.key});
  @override
  State<OtpScreen> createState() => _OtpScreenState();
}

class _OtpScreenState extends State<OtpScreen> {
  final _ctrls = List.generate(6, (_) => TextEditingController());
  final _focus = List.generate(6, (_) => FocusNode());
  bool get _filled => _ctrls.every((c) => c.text.isNotEmpty);

  @override
  void dispose() {
    for (final c in _ctrls) c.dispose();
    for (final f in _focus) f.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('التحقق')),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
            const SizedBox(height: 16),
            Center(child: Container(
              width: 76, height: 76,
              decoration: BoxDecoration(gradient: AppColors.brandGradient, borderRadius: BorderRadius.circular(22)),
              alignment: Alignment.center,
              child: const Icon(Icons.check, color: Colors.white, size: 40),
            )),
            const SizedBox(height: 18),
            const Text('أدخل رمز التحقق', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w800), textAlign: TextAlign.center),
            const SizedBox(height: 6),
            const Text('أرسلنا لك رمزًا مكونًا من 6 أرقام', style: TextStyle(color: AppColors.muted), textAlign: TextAlign.center),
            const SizedBox(height: 24),
            Directionality(
              textDirection: TextDirection.ltr,
              child: Row(mainAxisAlignment: MainAxisAlignment.center, children: List.generate(6, (i) => Padding(
                padding: const EdgeInsets.symmetric(horizontal: 5),
                child: SizedBox(
                  width: 48, height: 56,
                  child: TextField(
                    controller: _ctrls[i],
                    focusNode: _focus[i],
                    textAlign: TextAlign.center,
                    keyboardType: TextInputType.number,
                    inputFormatters: [FilteringTextInputFormatter.digitsOnly, LengthLimitingTextInputFormatter(1)],
                    style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w700),
                    decoration: const InputDecoration(contentPadding: EdgeInsets.zero),
                    onChanged: (v) {
                      if (v.isNotEmpty && i < 5) _focus[i + 1].requestFocus();
                      if (v.isEmpty && i > 0) _focus[i - 1].requestFocus();
                      setState(() {});
                    },
                  ),
                ),
              ))),
            ),
            const SizedBox(height: 14),
            Center(child: GestureDetector(onTap: () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('تم إرسال الرمز مرة أخرى'))), child: const Text.rich(TextSpan(text: 'لم يصلك الرمز؟ ', style: TextStyle(color: AppColors.muted), children: [TextSpan(text: 'إعادة الإرسال', style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.w700))])))),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: _filled ? () => context.go('/home') : null,
              style: ElevatedButton.styleFrom(shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(999))),
              child: const Text('تحقق ومتابعة'),
            ),
          ]),
        ),
      ),
    );
  }
}
