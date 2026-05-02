import 'user.dart';

class ChatMessage {
  final String id;
  final String from; // user id or "me"
  final String text;
  final String time;
  final String type; // text, voice, image

  const ChatMessage({
    required this.id,
    required this.from,
    required this.text,
    required this.time,
    this.type = 'text',
  });
}

class Chat {
  final String id;
  final AppUser user;
  final int unread;
  final bool online;
  final String last;
  final String time;
  final List<ChatMessage> messages;

  const Chat({
    required this.id,
    required this.user,
    required this.unread,
    required this.online,
    required this.last,
    required this.time,
    required this.messages,
  });
}
