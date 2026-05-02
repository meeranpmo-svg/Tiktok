class AppUser {
  final String id;
  final String name;
  final String handle;
  final String avatar;
  final String bio;
  final int followers;
  final int following;
  final int likes;
  final bool verified;

  const AppUser({
    required this.id,
    required this.name,
    required this.handle,
    required this.avatar,
    required this.bio,
    this.followers = 0,
    this.following = 0,
    this.likes = 0,
    this.verified = false,
  });
}
