import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'core/theme/app_theme.dart';
import 'providers/habit_provider.dart';
import 'providers/goal_provider.dart';
import 'providers/theme_provider.dart';
import 'screens/splash/splash_screen.dart';
import 'screens/home/home_screen.dart';
import 'screens/habits/habits_screen.dart';
import 'screens/goals/goals_screen.dart';
import 'screens/statistics/statistics_screen.dart';
import 'screens/achievements/achievements_screen.dart';
import 'screens/notifications/notifications_screen.dart';
import 'screens/profile/profile_screen.dart';
import 'screens/settings/settings_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
        ChangeNotifierProvider(create: (_) => HabitProvider()),
        ChangeNotifierProvider(create: (_) => GoalProvider()),
      ],
      child: const GrowthPathApp(),
    ),
  );
}

class GrowthPathApp extends StatelessWidget {
  const GrowthPathApp({super.key});

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    return MaterialApp(
      title: 'GrowthPath',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: themeProvider.themeMode,
      home: const SplashScreen(),
      routes: {
        '/home': (context) => const HomeScreen(),
        '/habits': (context) => const HabitsScreen(),
        '/goals': (context) => const GoalsScreen(),
        '/statistics': (context) => const StatisticsScreen(),
        '/achievements': (context) => const AchievementsScreen(),
        '/notifications': (context) => const NotificationsScreen(),
        '/profile': (context) => const ProfileScreen(),
        '/settings': (context) => const SettingsScreen(),
      },
    );
  }
}
