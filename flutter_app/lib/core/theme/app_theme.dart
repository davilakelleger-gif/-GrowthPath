import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppColors {
  static const Color primary = Color(0xFF2563EB);
  static const Color primaryHover = Color(0xFF1D4ED8);
  static const Color primaryLight = Color(0xFF60A5FA);
  static const Color accent = Color(0xFF3B82F6);
  static const Color success = Color(0xFF22C55E);
  static const Color warning = Color(0xFFF59E0B);
  static const Color danger = Color(0xFFEF4444);
  static const Color background = Color(0xFFF8FAFC);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color card = Color(0xFFFFFFFF);
  static const Color textPrimary = Color(0xFF0F172A);
  static const Color textSecondary = Color(0xFF64748B);
  static const Color border = Color(0xFFE2E8F0);
  static const Color borderLight = Color(0xFFCBD5E1);
  static const Color darkBg = Color(0xFF0F172A);
  static const Color darkCard = Color(0xFF1E293B);
  static const Color darkText = Color(0xFFF8FAFC);
}

class AppTheme {
  static TextStyle poppins({
    double size = 16,
    FontWeight weight = FontWeight.w400,
    Color color = AppColors.textPrimary,
    double height = 1.3,
  }) {
    return GoogleFonts.poppins(
      fontSize: size,
      fontWeight: weight,
      color: color,
      height: height,
    );
  }

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      scaffoldBackgroundColor: AppColors.background,
      fontFamily: GoogleFonts.poppins().fontFamily,
      colorScheme: const ColorScheme.light(
        primary: AppColors.primary,
        secondary: AppColors.accent,
        surface: AppColors.surface,
        error: AppColors.danger,
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: AppColors.surface,
        foregroundColor: AppColors.textPrimary,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: poppins(size: 20, weight: FontWeight.w600),
      ),
      cardTheme: CardThemeData(
        color: AppColors.card,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(18),
          side: const BorderSide(color: AppColors.border),
        ),
        margin: const EdgeInsets.symmetric(horizontal: 4, vertical: 6),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          minimumSize: const Size(double.infinity, 50),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          elevation: 0,
          textStyle: poppins(size: 15, weight: FontWeight.w500, color: Colors.white),
          shadowColor: AppColors.primary.withOpacity(0.3),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.primary,
          minimumSize: const Size(double.infinity, 50),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          side: const BorderSide(color: AppColors.primary, width: 2),
          textStyle: poppins(size: 15, weight: FontWeight.w500),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.surface,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(15),
          borderSide: const BorderSide(color: AppColors.borderLight),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(15),
          borderSide: const BorderSide(color: AppColors.borderLight),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(15),
          borderSide: const BorderSide(color: AppColors.primary, width: 2),
        ),
        hintStyle: poppins(size: 14, color: AppColors.textSecondary),
        labelStyle: poppins(size: 14, color: AppColors.textSecondary),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: Colors.white,
        selectedItemColor: AppColors.primary,
        unselectedItemColor: AppColors.textSecondary,
        type: BottomNavigationBarType.fixed,
        elevation: 0,
      ),
      dividerTheme: const DividerThemeData(
        color: AppColors.border,
        thickness: 1,
      ),
    );
  }

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: AppColors.darkBg,
      fontFamily: GoogleFonts.poppins().fontFamily,
      colorScheme: const ColorScheme.dark(
        primary: AppColors.primary,
        secondary: AppColors.accent,
        surface: AppColors.darkCard,
        error: AppColors.danger,
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: AppColors.darkCard,
        foregroundColor: AppColors.darkText,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: poppins(size: 20, weight: FontWeight.w600, color: AppColors.darkText),
      ),
      cardTheme: CardThemeData(
        color: AppColors.darkCard,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(18),
          side: const BorderSide(color: Color(0xFF334155)),
        ),
        margin: const EdgeInsets.symmetric(horizontal: 4, vertical: 6),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          minimumSize: const Size(double.infinity, 50),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          elevation: 0,
          textStyle: poppins(size: 15, weight: FontWeight.w500, color: Colors.white),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.primaryLight,
          minimumSize: const Size(double.infinity, 50),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          side: const BorderSide(color: AppColors.primaryLight, width: 2),
          textStyle: poppins(size: 15, weight: FontWeight.w500),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.darkCard,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(15),
          borderSide: const BorderSide(color: Color(0xFF475569)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(15),
          borderSide: const BorderSide(color: Color(0xFF475569)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(15),
          borderSide: const BorderSide(color: AppColors.primary, width: 2),
        ),
        hintStyle: poppins(size: 14, color: const Color(0xFF94A3B8)),
        labelStyle: poppins(size: 14, color: const Color(0xFF94A3B8)),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: Color(0xFF1E293B),
        selectedItemColor: AppColors.primary,
        unselectedItemColor: Color(0xFF94A3B8),
        type: BottomNavigationBarType.fixed,
        elevation: 0,
      ),
      dividerTheme: const DividerThemeData(
        color: Color(0xFF334155),
        thickness: 1,
      ),
    );
  }
}
