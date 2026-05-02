export 'user.dart';
export 'video.dart';
export 'chat.dart';

class AppNotification {
  final String id;
  final String type; // like, follow, comment, mention, system
  final String userName;
  final String avatar;
  final String text;
  final String time;

  const AppNotification({
    required this.id,
    required this.type,
    required this.userName,
    required this.avatar,
    required this.text,
    required this.time,
  });
}

class TxRow {
  final String id;
  final String type; // 'in' or 'out'
  final String title;
  final String sub;
  final int amount;
  final String time;

  const TxRow({
    required this.id,
    required this.type,
    required this.title,
    required this.sub,
    required this.amount,
    required this.time,
  });
}

class Gift {
  final String id;
  final String name;
  final String emoji;
  final int price;

  const Gift({required this.id, required this.name, required this.emoji, required this.price});
}

class TrendingTag {
  final String tag;
  final String meta;
  const TrendingTag({required this.tag, required this.meta});
}
