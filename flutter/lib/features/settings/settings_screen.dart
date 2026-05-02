import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});
  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _shareLocation = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('الإعدادات والخصوصية')),
      body: SafeArea(child: ListView(children: [
        _section('الحساب', [
          _item(Icons.person, 'تعديل البروفايل', () => context.go('/profile/edit')),
          _item(Icons.lock, 'الخصوصية', null),
          _item(Icons.account_balance_wallet, 'المحفظة', () => context.go('/wallet')),
          _item(Icons.notifications, 'الإشعارات', null),
        ]),
        _section('المحتوى والعرض', [
          _item(Icons.language, 'اللغة', null, trailing: const Text('العربية', style: TextStyle(color: AppColors.muted))),
          _item(Icons.visibility, 'إعدادات النشاط', null),
          _item(Icons.map, 'مشاركة الموقع', null, trailing: Switch(value: _shareLocation, onChanged: (v) => setState(() => _shareLocation = v), activeColor: AppColors.primary)),
        ]),
        _section('الدعم والقانوني', [
          _item(Icons.flag, 'الإبلاغ عن مشكلة', null),
          _item(Icons.email, 'تواصل معنا', null),
          _item(Icons.public, 'الشروط وسياسة الخصوصية', null),
        ]),
        _section(null, [
          ListTile(
            title: const Text('تسجيل الخروج', style: TextStyle(color: AppColors.danger, fontWeight: FontWeight.w700), textAlign: TextAlign.center),
            onTap: () { context.go('/login'); ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('تم تسجيل الخروج'))); },
          ),
        ]),
      ])),
    );
  }

  Widget _item(IconData icon, String label, VoidCallback? onTap, {Widget? trailing}) {
    return Container(
      decoration: const BoxDecoration(border: Border(bottom: BorderSide(color: AppColors.border))),
      child: ListTile(
        leading: Container(
          width: 32, height: 32,
          decoration: BoxDecoration(color: AppColors.bg2, borderRadius: BorderRadius.circular(8)),
          child: Icon(icon, size: 18, color: AppColors.text),
        ),
        title: Text(label, style: const TextStyle(fontSize: 14.5)),
        trailing: trailing ?? const Icon(Icons.chevron_left, color: AppColors.muted),
        onTap: onTap ?? () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('قريبًا'))),
      ),
    );
  }

  Widget _section(String? title, List<Widget> children) {
    return Container(
      margin: const EdgeInsets.only(top: 14),
      color: Colors.white,
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        if (title != null) Padding(padding: const EdgeInsets.fromLTRB(16, 8, 16, 6), child: Text(title.toUpperCase(), style: const TextStyle(fontSize: 11, color: AppColors.muted, fontWeight: FontWeight.w700, letterSpacing: 0.6))),
        ...children,
      ]),
    );
  }
}
