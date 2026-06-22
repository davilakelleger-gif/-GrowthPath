class Habit {
  final int id;
  final String name;
  final String icon;
  final int target;
  final String unit;
  final ColorCode color;
  final Map<String, int> logs;

  Habit({
    required this.id,
    required this.name,
    required this.icon,
    required this.target,
    this.unit = 'times',
    this.color = ColorCode.blue,
    Map<String, int>? logs,
  }) : logs = logs ?? {};

  int getLog(String date) => logs[date] ?? 0;

  int get todayLog => getLog(_today);

  double get todayProgress => target > 0 ? (todayLog / target) : 0;

  bool get isCompletedToday => todayLog >= target;

  String get _today => DateTime.now().toIso8601String().split('T')[0];

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'icon': icon,
    'target': target,
    'unit': unit,
    'color': color.name,
    'logs': logs,
  };

  factory Habit.fromJson(Map<String, dynamic> json) => Habit(
    id: json['id'],
    name: json['name'],
    icon: json['icon'],
    target: json['target'],
    unit: json['unit'] ?? 'times',
    color: ColorCode.values.firstWhere(
      (c) => c.name == json['color'],
      orElse: () => ColorCode.blue,
    ),
    logs: (json['logs'] as Map<String, dynamic>?)?.map(
      (k, v) => MapEntry(k, v as int),
    ) ?? {},
  );
}

enum ColorCode {
  blue, green, yellow, purple, pink, cyan
}
