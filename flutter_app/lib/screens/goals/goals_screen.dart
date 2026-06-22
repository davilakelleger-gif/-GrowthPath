import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../providers/goal_provider.dart';

class GoalsScreen extends StatelessWidget {
  const GoalsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final goalProvider = Provider.of<GoalProvider>(context);
    final goals = goalProvider.goals;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Your Goals'),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 12),
            child: IconButton(
              icon: const Icon(Icons.add_rounded),
              onPressed: () {},
            ),
          ),
        ],
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: goals.length,
        itemBuilder: (context, index) {
          final goal = goals[index];
          final pct = goal.progress;
          return Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Theme.of(context).cardColor,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: AppColors.border.withOpacity(0.5)),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.04),
                  blurRadius: 15,
                  offset: const Offset(0, 5),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(goal.icon, style: const TextStyle(fontSize: 24)),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(goal.name,
                          style: AppTheme.poppins(
                              size: 16, weight: FontWeight.w600)),
                    ),
                    Text('${pct.toInt()}%',
                        style: AppTheme.poppins(
                            size: 20,
                            weight: FontWeight.w700,
                            color: AppColors.primary)),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                    'Due ${goal.deadline.month}/${goal.deadline.day}/${goal.deadline.year}',
                    style: AppTheme.poppins(
                        size: 12, color: AppColors.textSecondary)),
                const SizedBox(height: 12),
                ClipRRect(
                  borderRadius: BorderRadius.circular(100),
                  child: LinearProgressIndicator(
                    value: pct / 100,
                    backgroundColor: AppColors.border,
                    valueColor: AlwaysStoppedAnimation(
                      pct >= 100
                          ? AppColors.success
                          : pct >= 50
                              ? AppColors.warning
                              : AppColors.primary,
                    ),
                    minHeight: 8,
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
