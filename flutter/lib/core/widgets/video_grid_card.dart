import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import '../../data/mock_data.dart';

class VideoGridCard extends StatelessWidget {
  final String bg;
  final int likes;
  final VoidCallback? onTap;

  const VideoGridCard({super.key, required this.bg, required this.likes, this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AspectRatio(
        aspectRatio: 9 / 16,
        child: ClipRRect(
          borderRadius: BorderRadius.circular(4),
          child: Stack(
            fit: StackFit.expand,
            children: [
              CachedNetworkImage(imageUrl: bg, fit: BoxFit.cover, placeholder: (_, __) => Container(color: Colors.grey[300])),
              Positioned(
                left: 0, right: 0, bottom: 0,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter, colors: [Colors.transparent, Colors.black87]),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.play_arrow, size: 14, color: Colors.white),
                      const SizedBox(width: 4),
                      Text(MockDB.fmt(likes), style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w700)),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
