import 'package:flutter/material.dart';
import '../models/habit.dart';

class HabitProvider extends ChangeNotifier {
  List<Habit> _habits = [];
  List<Habit> get habits => _habits;

  HabitProvider() {
    _loadDefault();
  }

  void _loadDefault() {
    _habits = [
      Habit(id: 1, name: 'Drink Water', icon: '💧', target: 8, unit: 'glasses', color: ColorCode.blue),
      Habit(id: 2, name: 'Read', icon: '📚', target: 50, unit: 'pages', color: ColorCode.green),
      Habit(id: 3, name: 'Running', icon: '🏃', target: 30, unit: 'min', color: ColorCode.yellow),
      Habit(id: 4, name: 'Meditate', icon: '🧘', target: 15, unit: 'min', color: ColorCode.purple),
      Habit(id: 5, name: 'Code', icon: '💻', target: 60, unit: 'min', color: ColorCode.pink),
      Habit(id: 6, name: 'Journal', icon: '📝', target: 1, unit: 'entry', color: ColorCode.cyan),
    ];
    notifyListeners();
  }

  void toggleHabit(int id) {
    final index = _habits.indexWhere((h) => h.id == id);
    if (index == -1) return;
    final habit = _habits[index];
    final today = DateTime.now().toIso8601String().split('T')[0];
    final current = habit.logs[today] ?? 0;
    if (current >= habit.target) {
      habit.logs[today] = 0;
    } else {
      habit.logs[today] = habit.target;
    }
    notifyListeners();
  }

  void logHabit(int id, int value) {
    final index = _habits.indexWhere((h) => h.id == id);
    if (index == -1) return;
    final today = DateTime.now().toIso8601String().split('T')[0];
    _habits[index].logs[today] = value.clamp(0, _habits[index].target);
    notifyListeners();
  }

  int get habitsCompleted {
    return _habits.where((h) => h.isCompletedToday).length;
  }
}
