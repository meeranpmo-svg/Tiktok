import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/widgets/avatar.dart';
import '../../data/mock_data.dart';
import '../../data/models/models.dart';

class ChatScreen extends StatefulWidget {
  final String chatId;
  const ChatScreen({super.key, required this.chatId});
  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  late Chat _chat;
  final _ctrl = TextEditingController();
  final _scroll = ScrollController();
  late List<ChatMessage> _msgs;

  @override
  void initState() {
    super.initState();
    _chat = MockDB.chats.firstWhere((c) => c.id == widget.chatId, orElse: () => MockDB.chats.first);
    _msgs = List.from(_chat.messages);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scroll.hasClients) _scroll.jumpTo(_scroll.position.maxScrollExtent);
    });
  }

  void _send() {
    final t = _ctrl.text.trim();
    if (t.isEmpty) return;
    final now = TimeOfDay.now();
    setState(() {
      _msgs.add(ChatMessage(id: 'm${_msgs.length}', from: 'me', text: t, time: '${now.hour.toString().padLeft(2, '0')}:${now.minute.toString().padLeft(2, '0')}'));
      _ctrl.clear();
    });
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scroll.hasClients) _scroll.animateTo(_scroll.position.maxScrollExtent, duration: const Duration(milliseconds: 200), curve: Curves.easeOut);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bg2,
      appBar: AppBar(
        backgroundColor: Colors.white,
        leading: IconButton(icon: const Icon(Icons.arrow_back), onPressed: () => context.go('/inbox')),
        titleSpacing: 0,
        title: Row(children: [
          Avatar(_chat.user.avatar, size: 36),
          const SizedBox(width: 10),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(_chat.user.name, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15)),
            Text(_chat.online ? 'متصل الآن' : 'آخر ظهور قريبًا', style: const TextStyle(fontSize: 11.5, color: AppColors.muted)),
          ])),
        ]),
        actions: [
          IconButton(icon: const Icon(Icons.call), onPressed: () {}),
          IconButton(icon: const Icon(Icons.videocam), onPressed: () {}),
        ],
      ),
      body: Column(children: [
        Expanded(child: ListView.builder(
          controller: _scroll,
          padding: const EdgeInsets.all(12),
          itemCount: _msgs.length,
          itemBuilder: (context, i) {
            final m = _msgs[i];
            final mine = m.from == 'me';
            return Align(
              alignment: mine ? Alignment.centerRight : Alignment.centerLeft,
              child: Container(
                constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.8),
                margin: const EdgeInsets.symmetric(vertical: 3),
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                decoration: BoxDecoration(
                  color: mine ? AppColors.primary : Colors.white,
                  borderRadius: BorderRadius.only(
                    topLeft: const Radius.circular(16),
                    topRight: const Radius.circular(16),
                    bottomLeft: Radius.circular(mine ? 16 : 4),
                    bottomRight: Radius.circular(mine ? 4 : 16),
                  ),
                  boxShadow: mine ? null : [const BoxShadow(color: Colors.black12, blurRadius: 2, offset: Offset(0, 1))],
                ),
                child: Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                  Text(m.text, style: TextStyle(color: mine ? Colors.white : AppColors.text, fontSize: 14.5, height: 1.4)),
                  Text(m.time, style: TextStyle(color: mine ? Colors.white70 : AppColors.muted, fontSize: 10.5)),
                ]),
              ),
            );
          },
        )),
        SafeArea(
          top: false,
          child: Container(
            color: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
            child: Row(children: [
              IconButton(icon: const Icon(Icons.attach_file, color: AppColors.primary), onPressed: () {}),
              Expanded(child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 14),
                decoration: BoxDecoration(color: AppColors.bg2, borderRadius: BorderRadius.circular(999)),
                child: TextField(controller: _ctrl, decoration: const InputDecoration(border: InputBorder.none, hintText: 'اكتب رسالة...', filled: false, contentPadding: EdgeInsets.symmetric(vertical: 10)), onSubmitted: (_) => _send()),
              )),
              IconButton(icon: const Icon(Icons.mic, color: AppColors.primary), onPressed: () {}),
              IconButton(icon: const Icon(Icons.send, color: AppColors.primary), onPressed: _send),
            ]),
          ),
        ),
      ]),
    );
  }
}
