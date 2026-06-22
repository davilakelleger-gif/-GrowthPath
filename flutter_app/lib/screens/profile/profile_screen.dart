import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../providers/habit_provider.dart';
import '../../providers/goal_provider.dart';
import '../settings/settings_screen.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final habitProvider = Provider.of<HabitProvider>(context);
    final goalProvider = Provider.of<GoalProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings_rounded),
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => const SettingsScreen()),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Profile Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(32),
              decoration: BoxDecoration(
                color: Theme.of(context).cardColor,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: AppColors.border.withOpacity(0.5)),
              ),
              child: Column(
                children: [
                  Container(
                    width: 96,
                    height: 96,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [AppColors.primary, AppColors.accent],
                      ),
                      borderRadius: BorderRadius.circular(48),
                    ),
                    child: Center(
                      child: Text('K',
                          style: AppTheme.poppins(
                              size: 36,
                              weight: FontWeight.w700,
                              color: Colors.white)),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text('Kelleger',
                      style: AppTheme.poppins(
                          size: 22, weight: FontWeight.w700)),
                  const SizedBox(height: 4),
                  Text('kelleger@growthpath.app',
                      style: AppTheme.poppins(
                          size: 13, color: AppColors.textSecondary)),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: 160,
                    child: ElevatedButton.icon(
                      onPressed: () {},
                      icon: const Icon(Icons.edit_rounded, size: 18),
                      label: const Text('Edit Profile'),
                    ),
                  ),
                  const SizedBox(height: 24),
                  Row(
                    children: [
                      _ProfileStat(label: 'Level', value: '7'),
                      _ProfileStat(
                          label: 'Streak',
                          value: '12'),
                      _ProfileStat(
                          label: 'Achievements',
                          value: '3'),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            // XP Bar
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Theme.of(context).cardColor,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: AppColors.border.withOpacity(0.5)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Experience',
                          style: AppTheme.poppins(
                              size: 14, weight: FontWeight.w600)),
                      Text('2,450 / 3,000 XP',
                          style: AppTheme.poppins(
                              size: 12, color: AppColors.textSecondary)),
                    ],
                  ),
                  const SizedBox(height: 10),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(100),
                    child: LinearProgressIndicator(
                      value: 2450 / 3000,
                      backgroundColor: AppColors.border,
                      valueColor:
                          const AlwaysStoppedAnimation(AppColors.primary),
                      minHeight: 8,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ProfileStat extends StatelessWidget {
  final String label, value;

  const _ProfileStat({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Column(
        children: [
          Text(value,
              style: AppTheme.poppins(
                  size: 22, weight: FontWeight.w700, color: AppColors.primary)),
          const SizedBox(height: 2),
          Text(label,
              style: AppTheme.poppins(
                  size: 11, color: AppColors.textSecondary)),
        ],
      ),
    );
  }
}
