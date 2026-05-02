import 'dart:async';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';

class CameraScreen extends StatefulWidget {
  const CameraScreen({super.key});
  @override
  State<CameraScreen> createState() => _CameraScreenState();
}

class _CameraScreenState extends State<CameraScreen> {
  bool _recording = false;
  int _secs = 0;
  Timer? _timer;

  void _toggle() {
    setState(() {
      _recording = !_recording;
      if (_recording) {
        _secs = 0;
        _timer = Timer.periodic(const Duration(seconds: 1), (t) {
          setState(() => _secs++);
          if (_secs >= 60) { t.cancel(); _recording = false; if (mounted) context.go('/edit-video'); }
        });
      } else {
        _timer?.cancel();
        if (_secs > 0) context.go('/edit-video');
      }
    });
  }

  @override
  void dispose() { _timer?.cancel(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: SafeArea(
        child: Stack(children: [
          Positioned.fill(child: Container(color: const Color(0xFF1A1A1A), alignment: Alignment.center, child: const Text('🎥 معاينة الكاميرا (محاكاة)', style: TextStyle(color: Colors.white54)))),
          Positioned(top: 12, left: 14, right: 14, child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
            IconButton(icon: const Icon(Icons.close, color: Colors.white), onPressed: () => context.go('/create')),
            IconButton(icon: const Icon(Icons.flash_on, color: Colors.white), onPressed: () {}),
          ])),
          Positioned(right: 14, top: 70, child: Column(children: const [
            _SideBtn(Icons.flip_camera_ios, 'قلب'),
            SizedBox(height: 16),
            _SideBtn(Icons.timer, 'مؤقت'),
            SizedBox(height: 16),
            _SideBtn(Icons.filter, 'فلاتر'),
            SizedBox(height: 16),
            _SideBtn(Icons.music_note, 'موسيقى'),
            SizedBox(height: 16),
            _SideBtn(Icons.auto_awesome, 'مؤثرات'),
          ])),
          Positioned(left: 16, right: 16, bottom: 20, child: Column(children: [
            const Text('15 ث', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700)),
            const SizedBox(height: 14),
            Row(mainAxisAlignment: MainAxisAlignment.spaceEvenly, children: [
              IconButton(icon: const Icon(Icons.image, color: Colors.white), onPressed: () => context.go('/edit-video')),
              GestureDetector(onTap: _toggle, child: AnimatedContainer(
                duration: const Duration(milliseconds: 250),
                width: 76, height: 76,
                decoration: BoxDecoration(border: Border.all(color: Colors.white, width: 5), shape: BoxShape.circle),
                padding: const EdgeInsets.all(5),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 250),
                  decoration: BoxDecoration(color: AppColors.danger, borderRadius: BorderRadius.circular(_recording ? 8 : 50)),
                ),
              )),
              IconButton(icon: const Icon(Icons.flip_camera_android, color: Colors.white), onPressed: () {}),
            ]),
            const SizedBox(height: 8),
            Text('00:${_secs.toString().padLeft(2, '0')}', style: const TextStyle(color: Colors.white)),
          ])),
        ]),
      ),
    );
  }
}

class _SideBtn extends StatelessWidget {
  final IconData icon; final String label;
  const _SideBtn(this.icon, this.label);
  @override
  Widget build(BuildContext context) => Column(children: [Icon(icon, color: Colors.white), const SizedBox(height: 4), Text(label, style: const TextStyle(color: Colors.white, fontSize: 11))]);
}
