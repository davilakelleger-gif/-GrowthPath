import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final notifications = [
      {'icon': '💧', 'bg': const Color(0xFFDBEAFE), 'title': 'Drink Water Reminder', 'desc': 'Time to drink water! 6/8 completed', 'time': '2 min ago'},
      {'icon': '🏆', 'bg': const Color(0xFFFEF3C7), 'title': 'Achievement Unlocked!', 'desc': '7-day streak badge earned', 'time': '1 hour ago'},
      {'icon': '📊', 'bg': const Color(0xFFD1FAE5), 'title': 'Weekly Report Ready', 'desc': 'Great week! 15% improvement', 'time': '3 hours ago'},
      {'icon': '🎯', 'bg': const Color(0xFFEDE9FE), 'title': 'Goal Milestone', 'desc': 'Learn Flutter at 78%!', 'time': '1 day ago'},
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications'),
        actions: [
          TextButton(
            onPressed: () {},
            child: const Text('Mark all read'),
          ),
        ],
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: notifications.length,
        separatorBuilder: (_, __) => const SizedBox(height: 8),
        itemBuilder: (context, index) {
          final n = notifications[index];
          return Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Theme.of(context).cardColor,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.border.withOpacity(0.5)),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: n['bg'] as Color,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Center(
                    child: Text(n['icon'] as String,
                        style: const TextStyle(fontSize: 20)),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(n['title'] as String,
                          style: AppTheme.poppins(
                              size: 14, weight: FontWeight.w600)),
                      const SizedBox(height: 2),
                      Text(n['desc'] as String,
                          style: AppTheme.poppins(
                              size: 12, color: AppColors.textSecondary)),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                Text(n['time'] as String,
                    style: AppTheme.poppins(
                        size: 10, color: AppColors.textSecondary)),
              ],
            ),
          );
        },
      ),
    );
  }
}
