import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../providers/habit_provider.dart';

class HabitsScreen extends StatelessWidget {
  const HabitsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final habitProvider = Provider.of<HabitProvider>(context);
    final habits = habitProvider.habits;
    final completed = habitProvider.habitsCompleted;

    return Scaffold(
      appBar: AppBar(
        title: const Text("Today's Habits"),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16),
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(100),
            ),
            child: Text('$completed/${habits.length}',
                style: AppTheme.poppins(
                    size: 13,
                    weight: FontWeight.w600,
                    color: AppColors.primary)),
          ),
        ],
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: habits.length + 1,
        itemBuilder: (context, index) {
          if (index == 0) {
            return Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: Text('Today',
                  style: AppTheme.poppins(
                      size: 14, weight: FontWeight.w600, color: AppColors.textSecondary)),
            );
          }
          final habit = habits[index - 1];
          return Container(
            margin: const EdgeInsets.only(bottom: 8),
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            decoration: BoxDecoration(
              color: Theme.of(context).cardColor,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.border.withOpacity(0.5)),
            ),
            child: Row(
              children: [
                GestureDetector(
                  onTap: () => habitProvider.toggleHabit(habit.id),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    width: 26,
                    height: 26,
                    decoration: BoxDecoration(
                      color: habit.isCompletedToday
                          ? AppColors.success
                          : Colors.transparent,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(
                        color: habit.isCompletedToday
                            ? AppColors.success
                            : AppColors.borderLight,
                        width: 2,
                      ),
                    ),
                    child: habit.isCompletedToday
                        ? const Icon(Icons.check_rounded,
                            size: 18, color: Colors.white)
                        : null,
                  ),
                ),
                const SizedBox(width: 14),
                Text('${habit.icon} ${habit.name}',
                    style: AppTheme.poppins(size: 15, weight: FontWeight.w500)),
                const Spacer(),
                SizedBox(
                  width: 100,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(100),
                        child: LinearProgressIndicator(
                          value: habit.todayProgress,
                          backgroundColor: AppColors.border,
                          valueColor: AlwaysStoppedAnimation(
                            habit.isCompletedToday
                                ? AppColors.success
                                : AppColors.primary,
                          ),
                          minHeight: 6,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text('${habit.todayLog} / ${habit.target} ${habit.unit}',
                          style: AppTheme.poppins(
                              size: 10, color: AppColors.textSecondary)),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
