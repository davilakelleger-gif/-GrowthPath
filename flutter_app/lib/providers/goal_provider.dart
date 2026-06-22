import 'package:flutter/material.dart';
import '../models/goal.dart';

class GoalProvider extends ChangeNotifier {
  List<Goal> _goals = [];
  List<Goal> get goals => _goals;

  GoalProvider() {
    _loadDefault();
  }

  void _loadDefault() {
    _goals = [
      Goal(id: 1, name: 'Learn Flutter', icon: '🎯', progress: 78, deadline: DateTime(2026, 8, 15)),
      Goal(id: 2, name: 'Run 5KM', icon: '🏃', progress: 45, deadline: DateTime(2026, 7, 1)),
      Goal(id: 3, name: 'Read 12 Books', icon: '📚', progress: 33, deadline: DateTime(2026, 12, 31)),
      Goal(id: 4, name: 'Save \$5,000', icon: '💰', progress: 60, deadline: DateTime(2026, 11, 1)),
    ];
    notifyListeners();
  }
}
