import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../theme/app_colors.dart';

/// Scaffold that wraps a tab body with the persistent bottom nav.
class BottomNavScaffold extends StatelessWidget {
  final Widget child;
  final int activeIndex; // 0=home, 1=discover, 2=create, 3=inbox, 4=profile
  final bool dark;

  const BottomNavScaffold({super.key, required this.child, required this.activeIndex, this.dark = false});

  static const _items = [
    _NavItem(icon: Icons.home_outlined, activeIcon: Icons.home, label: 'الرئيسية', path: '/home'),
    _NavItem(icon: Icons.search, activeIcon: Icons.search, label: 'استكشف', path: '/discover'),
    _NavItem(icon: Icons.add, activeIcon: Icons.add, label: '', path: '/create', special: true),
    _NavItem(icon: Icons.mail_outline, activeIcon: Icons.mail, label: 'البريد', path: '/inbox'),
    _NavItem(icon: Icons.person_outline, activeIcon: Icons.person, label: 'البروفايل', path: '/profile'),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBody: true,
      backgroundColor: dark ? Colors.black : Colors.white,
      body: child,
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: dark ? Colors.black : Colors.white,
          border: Border(top: BorderSide(color: dark ? const Color(0xFF1A1A1A) : AppColors.border)),
        ),
        child: SafeArea(
          top: false,
          child: SizedBox(
            height: 60,
            child: Row(
              children: List.generate(_items.length, (i) {
                final it = _items[i];
                final active = i == activeIndex;
                return Expanded(
                  child: InkWell(
                    onTap: () => context.go(it.path),
                    child: it.special
                        ? Center(
                            child: Container(
                              width: 44,
                              height: 32,
                              decoration: BoxDecoration(
                                gradient: AppColors.tiktokGradient,
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: const Icon(Icons.add, color: Colors.white, size: 22),
                            ),
                          )
                        : Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(active ? it.activeIcon : it.icon, size: 24, color: _color(active)),
                              const SizedBox(height: 3),
                              Text(it.label, style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.w600, color: _color(active))),
                            ],
                          ),
                  ),
                );
              }),
            ),
          ),
        ),
      ),
    );
  }

  Color _color(bool active) {
    if (dark) return active ? Colors.white : Colors.white60;
    return active ? AppColors.text : AppColors.muted;
  }
}

class _NavItem {
  final IconData icon;
  final IconData activeIcon;
  final String label;
  final String path;
  final bool special;
  const _NavItem({required this.icon, required this.activeIcon, required this.label, required this.path, this.special = false});
}
