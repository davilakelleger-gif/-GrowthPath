class Goal {
  final int id;
  final String name;
  final String icon;
  final double progress;
  final DateTime deadline;

  Goal({
    required this.id,
    required this.name,
    required this.icon,
    required this.progress,
    required this.deadline,
  });

  bool get isCompleted => progress >= 100;

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'icon': icon,
    'progress': progress,
    'deadline': deadline.toIso8601String(),
  };

  factory Goal.fromJson(Map<String, dynamic> json) => Goal(
    id: json['id'],
    name: json['name'],
    icon: json['icon'],
    progress: (json['progress'] as num).toDouble(),
    deadline: DateTime.parse(json['deadline']),
  );
}
