import 'user.dart';

class Video {
  final String id;
  final AppUser user;
  final String bg;
  final String desc;
  final String music;
  int likes;
  int comments;
  int shares;
  int saves;
  bool liked;
  bool saved;

  Video({
    required this.id,
    required this.user,
    required this.bg,
    required this.desc,
    required this.music,
    this.likes = 0,
    this.comments = 0,
    this.shares = 0,
    this.saves = 0,
    this.liked = false,
    this.saved = false,
  });
}
