import 'package:flutter_test/flutter_test.dart';
import 'package:tenth_tone/main.dart';

void main() {
  testWidgets('App boots without errors', (WidgetTester tester) async {
    await tester.pumpWidget(const TenthToneApp());
    await tester.pump();
    // Splash shows brand text
    expect(find.text('Tenth Tone'), findsOneWidget);
  });
}
