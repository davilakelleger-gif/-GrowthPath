import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../providers/theme_provider.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Settings')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _SettingsTile(
            icon: Icons.dark_mode_rounded,
            iconBg: const Color(0xFFDBEAFE),
            iconColor: AppColors.primary,
            title: 'Dark Mode',
            subtitle: 'Switch between light and dark themes',
            trailing: Switch.adaptive(
              value: themeProvider.isDark,
              activeColor: AppColors.primary,
              onChanged: (_) => themeProvider.toggleTheme(),
            ),
          ),
          _SettingsTile(
            icon: Icons.language_rounded,
            iconBg: const Color(0xFFFEF3C7),
            iconColor: AppColors.warning,
            title: 'Language',
            subtitle: 'English (US)',
            trailing: const Icon(Icons.chevron_right_rounded,
                color: AppColors.textSecondary),
          ),
          _SettingsTile(
            icon: Icons.notifications_rounded,
            iconBg: const Color(0xFFD1FAE5),
            iconColor: AppColors.success,
            title: 'Notifications',
            subtitle: 'Push notifications enabled',
            trailing: Switch.adaptive(
              value: true,
              activeColor: AppColors.primary,
              onChanged: (_) {},
            ),
          ),
          _SettingsTile(
            icon: Icons.lock_rounded,
            iconBg: const Color(0xFFEDE9FE),
            iconColor: const Color(0xFF8B5CF6),
            title: 'Security',
            subtitle: 'Face ID / PIN protection',
            trailing: const Icon(Icons.chevron_right_rounded,
                color: AppColors.textSecondary),
          ),
          const SizedBox(height: 16),
          _SettingsTile(
            icon: Icons.logout_rounded,
            iconBg: const Color(0xFFFEE2E2),
            iconColor: AppColors.danger,
            title: 'Sign Out',
            subtitle: 'Sign out of your account',
            textColor: AppColors.danger,
            onTap: () {
              showDialog(
                context: context,
                builder: (ctx) => AlertDialog(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(18),
                  ),
                  title: const Text('Sign Out'),
                  content: const Text(
                      'Are you sure you want to sign out?'),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.pop(ctx),
                      child: const Text('Cancel'),
                    ),
                    ElevatedButton(
                      onPressed: () {
                        Navigator.pop(ctx);
                        Navigator.of(context)
                            .pushNamedAndRemoveUntil('/', (route) => false);
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.danger,
                      ),
                      child: const Text('Sign Out'),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}

class _SettingsTile extends StatelessWidget {
  final IconData icon;
  final Color iconBg, iconColor;
  final String title, subtitle;
  final Widget? trailing;
  final Color? textColor;
  final VoidCallback? onTap;

  const _SettingsTile({
    required this.icon,
    required this.iconBg,
    required this.iconColor,
    required this.title,
    required this.subtitle,
    this.trailing,
    this.textColor,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          decoration: BoxDecoration(
            color: Theme.of(context).cardColor,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.border.withOpacity(0.5)),
          ),
          child: Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: iconBg,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, color: iconColor, size: 22),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title,
                        style: AppTheme.poppins(
                            size: 14,
                            weight: FontWeight.w600,
                            color: textColor)),
                    if (subtitle.isNotEmpty)
                      Text(subtitle,
                          style: AppTheme.poppins(
                              size: 11, color: AppColors.textSecondary)),
                  ],
                ),
              ),
              if (trailing != null) trailing!,
            ],
          ),
        ),
      ),
    );
  }
}
