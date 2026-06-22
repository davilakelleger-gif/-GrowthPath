import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';

class AchievementsScreen extends StatelessWidget {
  const AchievementsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final achievements = [
      {'name': 'Early Bird', 'icon': '🌅', 'desc': 'Complete 7 morning habits', 'unlocked': true},
      {'name': 'Consistent', 'icon': '🔥', 'desc': '7-day streak', 'unlocked': true},
      {'name': 'Marathon', 'icon': '🏃', 'desc': '30-day streak', 'unlocked': true},
      {'name': 'Bookworm', 'icon': '📖', 'desc': 'Read 500 pages', 'unlocked': true},
      {'name': 'Century', 'icon': '💯', 'desc': '100 habits completed', 'unlocked': false},
      {'name': 'Master', 'icon': '👑', 'desc': 'Complete all goals', 'unlocked': false},
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Achievements'),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16),
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(100),
            ),
            child: Text('4/6',
                style: AppTheme.poppins(
                    size: 13,
                    weight: FontWeight.w600,
                    color: AppColors.primary)),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Progress ring
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Theme.of(context).cardColor,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: AppColors.border.withOpacity(0.5)),
              ),
              child: Row(
                children: [
                  SizedBox(
                    width: 80,
                    height: 80,
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        SizedBox(
                          width: 80,
                          height: 80,
                          child: CircularProgressIndicator(
                            value: 4 / 6,
                            backgroundColor: AppColors.border,
                            valueColor: const AlwaysStoppedAnimation(AppColors.primary),
                            strokeWidth: 8,
                          ),
                        ),
                        Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text('4',
                                style: AppTheme.poppins(
                                    size: 22,
                                    weight: FontWeight.w700,
                                    color: AppColors.primary)),
                            Text('of 6',
                                style: AppTheme.poppins(
                                    size: 11, color: AppColors.textSecondary)),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 20),
                  Expanded(
                    child: Text(
                      'Keep going! Complete more habits and goals to unlock all achievements.',
                      style: AppTheme.poppins(
                          size: 13, color: AppColors.textSecondary),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            Expanded(
              child: GridView.builder(
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  childAspectRatio: 1.2,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                ),
                itemCount: achievements.length,
                itemBuilder: (context, index) {
                  final a = achievements[index];
                  final unlocked = a['unlocked'] as bool;
                  return Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Theme.of(context).cardColor,
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(
                        color: AppColors.border.withOpacity(0.5),
                      ),
                      opacity: unlocked ? 1 : 0.5,
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(unlocked ? a['icon'] as String : '🔒',
                            style: const TextStyle(fontSize: 32)),
                        const SizedBox(height: 8),
                        Text(a['name'] as String,
                            style: AppTheme.poppins(
                                size: 13, weight: FontWeight.w600),
                            textAlign: TextAlign.center),
                        const SizedBox(height: 4),
                        Text(a['desc'] as String,
                            style: AppTheme.poppins(
                                size: 10, color: AppColors.textSecondary),
                            textAlign: TextAlign.center),
                        if (unlocked)
                          Container(
                            margin: const EdgeInsets.only(top: 8),
                            padding: const EdgeInsets.symmetric(
                                horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: AppColors.success.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(100),
                            ),
                            child: Text('Unlocked',
                                style: AppTheme.poppins(
                                    size: 10,
                                    color: AppColors.success,
                                    weight: FontWeight.w500)),
                          ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
