import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../features/splash/splash_screen.dart';
import '../features/auth/login_screen.dart';
import '../features/auth/register_screen.dart';
import '../features/auth/otp_screen.dart';
import '../features/auth/forgot_screen.dart';
import '../features/auth/reset_screen.dart';
import '../features/feed/home_screen.dart';
import '../features/feed/comments_screen.dart';
import '../features/discover/discover_screen.dart';
import '../features/create/create_screen.dart';
import '../features/create/camera_screen.dart';
import '../features/create/edit_video_screen.dart';
import '../features/create/publish_screen.dart';
import '../features/profile/profile_screen.dart';
import '../features/profile/edit_profile_screen.dart';
import '../features/profile/user_list_screen.dart';
import '../features/chat/inbox_screen.dart';
import '../features/chat/chat_screen.dart';
import '../features/notifications/notifications_screen.dart';
import '../features/live/live_viewer_screen.dart';
import '../features/live/live_start_screen.dart';
import '../features/live/live_host_list_screen.dart';
import '../features/share/share_screen.dart';
import '../features/wallet/wallet_screen.dart';
import '../features/map/map_screen.dart';
import '../features/settings/settings_screen.dart';

final appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(path: '/', builder: (_, __) => const SplashScreen()),
    GoRoute(path: '/login', builder: (_, __) => const LoginScreen()),
    GoRoute(path: '/register', builder: (_, __) => const RegisterScreen()),
    GoRoute(path: '/otp', builder: (_, __) => const OtpScreen()),
    GoRoute(path: '/forgot', builder: (_, __) => const ForgotScreen()),
    GoRoute(path: '/reset', builder: (_, __) => const ResetScreen()),

    GoRoute(path: '/home', builder: (_, s) => HomeScreen(tab: s.uri.queryParameters['tab'] ?? 'foryou')),
    GoRoute(path: '/discover', builder: (_, __) => const DiscoverScreen()),

    GoRoute(path: '/create', builder: (_, __) => const CreateScreen()),
    GoRoute(path: '/camera', builder: (_, __) => const CameraScreen()),
    GoRoute(path: '/edit-video', builder: (_, __) => const EditVideoScreen()),
    GoRoute(path: '/publish', builder: (_, __) => const PublishScreen()),

    GoRoute(path: '/profile', builder: (_, __) => const ProfileScreen()),
    GoRoute(path: '/profile/edit', builder: (_, __) => const EditProfileScreen()),
    GoRoute(path: '/profile/:id', builder: (_, s) => ProfileScreen(userId: s.pathParameters['id'])),
    GoRoute(path: '/list/:which', builder: (_, s) => UserListScreen(which: s.pathParameters['which']!)),

    GoRoute(path: '/inbox', builder: (_, __) => const InboxScreen()),
    GoRoute(path: '/chat/:id', builder: (_, s) => ChatScreen(chatId: s.pathParameters['id']!)),
    GoRoute(path: '/notifications', builder: (_, __) => const NotificationsScreen()),

    GoRoute(
      path: '/comments/:id',
      pageBuilder: (_, s) => CustomTransitionPage(
        key: s.pageKey,
        opaque: false,
        barrierColor: Colors.transparent,
        transitionDuration: const Duration(milliseconds: 240),
        transitionsBuilder: (_, anim, __, child) => SlideTransition(position: Tween(begin: const Offset(0, 1), end: Offset.zero).animate(CurvedAnimation(parent: anim, curve: Curves.easeOut)), child: child),
        child: CommentsScreen(videoId: s.pathParameters['id']!),
      ),
    ),

    GoRoute(path: '/share', builder: (_, __) => const ShareScreen()),
    GoRoute(path: '/share/:id', builder: (_, s) => ShareScreen(videoId: s.pathParameters['id'])),

    GoRoute(path: '/live/start', builder: (_, __) => const LiveStartScreen()),
    GoRoute(path: '/live/host-list', builder: (_, __) => const LiveHostListScreen()),
    GoRoute(path: '/live/:id', builder: (_, s) => LiveViewerScreen(liveId: s.pathParameters['id']!)),

    GoRoute(path: '/map', builder: (_, __) => const MapScreen()),
    GoRoute(path: '/wallet', builder: (_, __) => const WalletScreen()),
    GoRoute(path: '/settings', builder: (_, __) => const SettingsScreen()),
  ],
);
