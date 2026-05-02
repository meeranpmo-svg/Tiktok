import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/widgets/avatar.dart';
import '../../data/mock_data.dart';

class MapScreen extends StatelessWidget {
  const MapScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFE6F0FF),
      body: Stack(children: [
        // Mock map background — gradient since we don't have a real map tile
        Positioned.fill(
          child: Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight, colors: [Color(0xFFD9E5F5), Color(0xFFA9C5E8)]),
            ),
            child: CustomPaint(painter: _RoadPainter()),
          ),
        ),
        // Pins
        ...List.generate(6, (i) {
          final u = MockDB.users[i];
          final x = 0.15 + ((i * 13) % 70) / 100;
          final y = 0.25 + ((i * 17) % 55) / 100;
          return Positioned(
            left: MediaQuery.of(context).size.width * x - 22,
            top: MediaQuery.of(context).size.height * y,
            child: GestureDetector(
              onTap: () => context.go('/profile/${u.id}'),
              child: Column(mainAxisSize: MainAxisSize.min, children: [
                Container(
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.white, width: 3),
                    borderRadius: BorderRadius.circular(50),
                    boxShadow: const [BoxShadow(color: Colors.black26, blurRadius: 12, offset: Offset(0, 4))],
                  ),
                  child: Avatar(u.avatar, size: 38),
                ),
                CustomPaint(size: const Size(12, 8), painter: _ArrowPainter()),
              ]),
            ),
          );
        }),
        // Top controls
        SafeArea(child: Padding(padding: const EdgeInsets.all(12), child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
          IconButton(icon: const Icon(Icons.arrow_back), onPressed: () => context.pop(), style: IconButton.styleFrom(backgroundColor: Colors.white)),
          IconButton(icon: const Icon(Icons.settings), onPressed: () => context.go('/settings'), style: IconButton.styleFrom(backgroundColor: Colors.white)),
        ]))),
        // Bottom buttons
        Positioned(left: 0, right: 0, bottom: 30, child: Center(child: Wrap(spacing: 10, children: [
          ElevatedButton.icon(onPressed: () {}, icon: const Icon(Icons.person), label: const Text('الأصدقاء'), style: ElevatedButton.styleFrom(backgroundColor: Colors.white, foregroundColor: AppColors.text, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(999)))),
          ElevatedButton.icon(onPressed: () {}, icon: const Icon(Icons.auto_awesome), label: const Text('الشائع'), style: ElevatedButton.styleFrom(backgroundColor: Colors.white, foregroundColor: AppColors.text, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(999)))),
        ]))),
      ]),
    );
  }
}

class _RoadPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = Colors.white..strokeWidth = 4..style = PaintingStyle.stroke;
    final path = Path()..moveTo(0, size.height * 0.3)..quadraticBezierTo(size.width * 0.5, size.height * 0.4, size.width, size.height * 0.2);
    final path2 = Path()..moveTo(size.width * 0.2, 0)..lineTo(size.width * 0.6, size.height);
    canvas.drawPath(path, paint);
    canvas.drawPath(path2, paint..color = Colors.white70);
  }
  @override bool shouldRepaint(_) => false;
}

class _ArrowPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final p = Path()..moveTo(0, 0)..lineTo(size.width / 2, size.height)..lineTo(size.width, 0)..close();
    canvas.drawPath(p, Paint()..color = Colors.white);
  }
  @override bool shouldRepaint(_) => false;
}
