import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

class Avatar extends StatelessWidget {
  final String url;
  final double size;
  final Color? bg;
  final Widget? badge;

  const Avatar(this.url, {super.key, this.size = 44, this.bg, this.badge});

  @override
  Widget build(BuildContext context) {
    final av = ClipOval(
      child: SizedBox(
        width: size,
        height: size,
        child: url.isEmpty
            ? Container(color: bg ?? Colors.grey[300])
            : CachedNetworkImage(
                imageUrl: url,
                fit: BoxFit.cover,
                placeholder: (_, __) => Container(color: Colors.grey[300]),
                errorWidget: (_, __, ___) => Container(color: Colors.grey[400]),
              ),
      ),
    );
    if (badge == null) return av;
    return Stack(clipBehavior: Clip.none, children: [av, Positioned(bottom: -4, left: 0, right: 0, child: Center(child: badge!))]);
  }
}
