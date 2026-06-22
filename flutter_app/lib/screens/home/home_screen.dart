import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../providers/habit_provider.dart';
import '../../providers/goal_provider.dart';
import '../habits/habits_screen.dart';
import '../goals/goals_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = [
    const _HomeTab(),
    const HabitsScreen(),
    const GoalsScreen(),
    const _StatsTab(),
    const _ProfileTab(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_currentIndex],
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Theme.of(context).brightness == Brightness.light
              ? Colors.white
              : const Color(0xFF1E293B),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 20,
              offset: const Offset(0, -5),
            ),
          ],
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: BottomNavigationBar(
              currentIndex: _currentIndex,
              onTap: (index) => setState(() => _currentIndex = index),
              items: const [
                BottomNavigationBarItem(icon: Icon(Icons.home_rounded), label: 'Home'),
                BottomNavigationBarItem(icon: Icon(Icons.check_circle_rounded), label: 'Habits'),
                BottomNavigationBarItem(icon: Icon(Icons.flag_rounded), label: 'Goals'),
                BottomNavigationBarItem(icon: Icon(Icons.bar_chart_rounded), label: 'Stats'),
                BottomNavigationBarItem(icon: Icon(Icons.person_rounded), label: 'Profile'),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _HomeTab extends StatelessWidget {
  const _HomeTab();

  @override
  Widget build(BuildContext context) {
    final habitProvider = Provider.of<HabitProvider>(context);
    final goalProvider = Provider.of<GoalProvider>(context);
    final todayHabits = habitProvider.habits;
    final goals = goalProvider.goals;

    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Hello Kelleger 👋',
                style: AppTheme.poppins(size: 20, weight: FontWeight.w600)),
            Text('Keep Growing Today',
                style: AppTheme.poppins(
                    size: 13, color: AppColors.textSecondary)),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_rounded),
            onPressed: () => Navigator.pushNamed(context, '/notifications'),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Stats Grid
            Row(
              children: [
                _StatCard(
                  icon: Icons.local_fire_department_rounded,
                  iconColor: AppColors.primary,
                  bgColor: AppColors.primary.withOpacity(0.1),
                  value: '12',
                  label: 'Day Streak',
                  flex: 1,
                ),
                const SizedBox(width: 12),
                _StatCard(
                  icon: Icons.flag_rounded,
                  iconColor: AppColors.warning,
                  bgColor: AppColors.warning.withOpacity(0.1),
                  value: '${goals.where((g) => g.isCompleted).length}/${goals.length}',
                  label: 'Goals',
                  flex: 1,
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _StatCard(
                  icon: Icons.check_circle_rounded,
                  iconColor: AppColors.success,
                  bgColor: AppColors.success.withOpacity(0.1),
                  value: '${habitProvider.habitsCompleted}/${todayHabits.length}',
                  label: 'Habits Done',
                  flex: 1,
                ),
                const SizedBox(width: 12),
                _StatCard(
                  icon: Icons.emoji_events_rounded,
                  iconColor: const Color(0xFF8B5CF6),
                  bgColor: const Color(0xFF8B5CF6).withOpacity(0.1),
                  value: '3',
                  label: 'Achievements',
                  flex: 1,
                ),
              ],
            ),
            const SizedBox(height: 28),

            // Today's Habits
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text("Today's Habits",
                    style: AppTheme.poppins(
                        size: 18, weight: FontWeight.w600)),
                TextButton(
                  onPressed: () {},
                  child: const Text('View All'),
                ),
              ],
            ),
            ...todayHabits.take(4).map((h) => _HabitTile(habit: h)),

            const SizedBox(height: 20),

            // Active Goals
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Active Goals',
                    style: AppTheme.poppins(
                        size: 18, weight: FontWeight.w600)),
                TextButton(
                  onPressed: () {},
                  child: const Text('View All'),
                ),
              ],
            ),
            ...goals.take(2).map((g) => _GoalTile(goal: g)),
          ],
        ),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final IconData icon;
  final Color iconColor, bgColor;
  final String value, label;
  final int flex;

  const _StatCard({
    required this.icon,
    required this.iconColor,
    required this.bgColor,
    required this.value,
    required this.label,
    this.flex = 1,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      flex: flex,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Theme.of(context).cardColor,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.border.withOpacity(0.5)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 15,
              offset: const Offset(0, 5),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              width: 42,
              height: 42,
              decoration: BoxDecoration(
                color: bgColor,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: iconColor, size: 22),
            ),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(value,
                    style: AppTheme.poppins(
                        size: 18, weight: FontWeight.w700)),
                Text(label,
                    style: AppTheme.poppins(
                        size: 11, color: AppColors.textSecondary)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _HabitTile extends StatelessWidget {
  final dynamic habit;

  const _HabitTile({required this.habit});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border.withOpacity(0.5)),
      ),
      child: Row(
        children: [
          GestureDetector(
            onTap: () {
              context.read<HabitProvider>().toggleHabit(habit.id);
            },
            child: Container(
              width: 24,
              height: 24,
              decoration: BoxDecoration(
                color: habit.isCompletedToday
                    ? AppColors.success
                    : Colors.transparent,
                borderRadius: BorderRadius.circular(6),
                border: Border.all(
                  color: habit.isCompletedToday
                      ? AppColors.success
                      : AppColors.borderLight,
                  width: 2,
                ),
              ),
              child: habit.isCompletedToday
                  ? const Icon(Icons.check_rounded,
                      size: 16, color: Colors.white)
                  : null,
            ),
          ),
          const SizedBox(width: 12),
          Text('${habit.icon} ${habit.name}',
              style: AppTheme.poppins(size: 14, weight: FontWeight.w500)),
          const Spacer(),
          SizedBox(
            width: 80,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(100),
                  child: LinearProgressIndicator(
                    value: habit.todayProgress,
                    backgroundColor: AppColors.border,
                    valueColor: const AlwaysStoppedAnimation(AppColors.primary),
                    minHeight: 5,
                  ),
                ),
                const SizedBox(height: 2),
                Text('${(habit.todayProgress * 100).toInt()}%',
                    style: AppTheme.poppins(
                        size: 10, color: AppColors.textSecondary)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _GoalTile extends StatelessWidget {
  final dynamic goal;

  const _GoalTile({required this.goal});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border.withOpacity(0.5)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(goal.icon, style: const TextStyle(fontSize: 20)),
              const SizedBox(width: 8),
              Text(goal.name,
                  style: AppTheme.poppins(size: 14, weight: FontWeight.w600)),
            ],
          ),
          const SizedBox(height: 10),
          ClipRRect(
            borderRadius: BorderRadius.circular(100),
            child: LinearProgressIndicator(
              value: goal.progress / 100,
              backgroundColor: AppColors.border,
              valueColor: const AlwaysStoppedAnimation(AppColors.primary),
              minHeight: 6,
            ),
          ),
          const SizedBox(height: 6),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('${goal.progress.toInt()}% complete',
                  style: AppTheme.poppins(
                      size: 11, color: AppColors.textSecondary)),
              Text(
                  'Due: ${goal.deadline.month}/${goal.deadline.day}/${goal.deadline.year}',
                  style: AppTheme.poppins(
                      size: 11, color: AppColors.textSecondary)),
            ],
          ),
        ],
      ),
    );
  }
}

class _StatsTab extends StatelessWidget {
  const _StatsTab();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Statistics')),
      body: const Center(child: Text('Statistics Screen')),
    );
  }
}

class _ProfileTab extends StatelessWidget {
  const _ProfileTab();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: const Center(child: Text('Profile Screen')),
    );
  }
}
