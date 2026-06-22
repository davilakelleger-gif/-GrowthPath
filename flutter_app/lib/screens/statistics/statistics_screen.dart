import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../providers/habit_provider.dart';
import '../../providers/goal_provider.dart';

class StatisticsScreen extends StatelessWidget {
  const StatisticsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final habitProvider = Provider.of<HabitProvider>(context);
    final goalProvider = Provider.of<GoalProvider>(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Statistics')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Streak Card
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [AppColors.primary, Color(0xFF1D4ED8)],
                ),
                borderRadius: BorderRadius.circular(18),
              ),
              child: Row(
                children: [
                  Text('12',
                      style: AppTheme.poppins(
                          size: 48,
                          weight: FontWeight.w700,
                          color: Colors.white)),
                  const SizedBox(width: 16),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Day Streak',
                          style: AppTheme.poppins(
                              size: 18,
                              weight: FontWeight.w600,
                              color: Colors.white)),
                      Text("You're on fire! Keep going.",
                          style: AppTheme.poppins(
                              size: 13, color: Colors.white70)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Overview cards
            Row(
              children: [
                _OverviewCard(
                  title: 'Habits',
                  value: '${habitProvider.habitsCompleted}/${habitProvider.habits.length}',
                  color: AppColors.primary,
                ),
                const SizedBox(width: 12),
                _OverviewCard(
                  title: 'Goals',
                  value: '${goalProvider.goals.where((g) => g.isCompleted).length}/${goalProvider.goals.length}',
                  color: AppColors.warning,
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _OverviewCard(
                  title: 'Achievements',
                  value: '3/6',
                  color: const Color(0xFF8B5CF6),
                ),
                const SizedBox(width: 12),
                _OverviewCard(
                  title: 'Success Rate',
                  value: '78%',
                  color: AppColors.success,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _OverviewCard extends StatelessWidget {
  final String title, value;
  final Color color;

  const _OverviewCard({
    required this.title,
    required this.value,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Theme.of(context).cardColor,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.border.withOpacity(0.5)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title,
                style: AppTheme.poppins(
                    size: 12, color: AppColors.textSecondary)),
            const SizedBox(height: 4),
            Text(value,
                style: AppTheme.poppins(
                    size: 24, weight: FontWeight.w700, color: color)),
          ],
        ),
      ),
    );
  }
}
