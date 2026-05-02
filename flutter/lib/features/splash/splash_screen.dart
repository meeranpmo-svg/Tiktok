import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';

class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter, colors: [AppColors.primary, Color(0xFF2A0A6C)]),
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              children: [
                const Spacer(),
                Container(
                  width: 110,
                  height: 110,
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(30),
                    border: Border.all(color: Colors.white.withValues(alpha: 0.2)),
                  ),
                  alignment: Alignment.center,
                  child: const Text('T', style: TextStyle(color: Colors.white, fontSize: 48, fontWeight: FontWeight.w800)),
                ),
                const SizedBox(height: 16),
                const Text('Tenth Tone', style: TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.w800)),
                const SizedBox(height: 4),
                const Text('شارك لحظتك مع العالم', style: TextStyle(color: Colors.white70)),
                const Spacer(),
                SizedBox(
                  width: double.infinity,
                  child: FilledButton(
                    style: FilledButton.styleFrom(backgroundColor: Colors.white, foregroundColor: AppColors.primary, padding: const EdgeInsets.symmetric(vertical: 16), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(999))),
                    onPressed: () => context.go('/login'),
                    child: const Text('تسجيل الدخول', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 15)),
                  ),
                ),
                const SizedBox(height: 10),
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton(
                    style: OutlinedButton.styleFrom(foregroundColor: Colors.white, side: BorderSide(color: Colors.white.withValues(alpha: 0.4)), padding: const EdgeInsets.symmetric(vertical: 16), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(999))),
                    onPressed: () => context.go('/register'),
                    child: const Text('إنشاء حساب جديد', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 15)),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
