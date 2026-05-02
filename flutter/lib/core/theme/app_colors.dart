import 'package:flutter/material.dart';

class AppColors {
  AppColors._();

  static const primary = Color(0xFF6C2BD9);
  static const primary2 = Color(0xFF8B5BFF);
  static const primaryPressed = Color(0xFF5A23B8);
  static const primarySoft = Color(0xFFF1EBFF);

  static const bg = Color(0xFFFFFFFF);
  static const bg2 = Color(0xFFF5F5F7);
  static const bg3 = Color(0xFFECECEF);

  static const text = Color(0xFF111111);
  static const muted = Color(0xFF8A8A8A);
  static const muted2 = Color(0xFFB8B8BC);
  static const border = Color(0xFFECECEC);

  static const danger = Color(0xFFEF4444);
  static const warn = Color(0xFFF59E0B);
  static const success = Color(0xFF16A34A);

  static const tiktokDark = Color(0xFF000000);

  static const snapchat = Color(0xFFFFFC00);
  static const facebook = Color(0xFF1877F2);
  static const whatsapp = Color(0xFF25D366);

  // Selected tint over avatar in share sheet
  static const selectedOverlay = Color(0x8C6C2BD9);

  static LinearGradient get brandGradient => const LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: [primary, primary2],
      );

  static LinearGradient get tiktokGradient => const LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: [Color(0xFFFF0050), Color(0xFF00F2EA)],
      );
}
