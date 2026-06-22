<?php
/**
 * GrowthPath API Routes
 * 
 * Place this file in routes/api.php of your Laravel project.
 * Register in RouteServiceProvider or bootstrap/app.php
 */

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\HabitController;
use App\Http\Controllers\GoalController;
use App\Http\Controllers\AchievementController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StatisticsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public Routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);

    // Profile
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::put('/profile/avatar', [ProfileController::class, 'updateAvatar']);

    // Habits
    Route::get('/habits', [HabitController::class, 'index']);
    Route::post('/habits', [HabitController::class, 'store']);
    Route::get('/habits/{id}', [HabitController::class, 'show']);
    Route::put('/habits/{id}', [HabitController::class, 'update']);
    Route::delete('/habits/{id}', [HabitController::class, 'destroy']);
    Route::post('/habits/{id}/log', [HabitController::class, 'log']);
    Route::get('/habits/today', [HabitController::class, 'today']);
    Route::get('/habits/weekly', [HabitController::class, 'weekly']);

    // Goals
    Route::get('/goals', [GoalController::class, 'index']);
    Route::post('/goals', [GoalController::class, 'store']);
    Route::get('/goals/{id}', [GoalController::class, 'show']);
    Route::put('/goals/{id}', [GoalController::class, 'update']);
    Route::delete('/goals/{id}', [GoalController::class, 'destroy']);
    Route::post('/goals/{id}/progress', [GoalController::class, 'updateProgress']);

    // Achievements
    Route::get('/achievements', [AchievementController::class, 'index']);
    Route::get('/achievements/{id}', [AchievementController::class, 'show']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);

    // Statistics
    Route::get('/statistics/summary', [StatisticsController::class, 'summary']);
    Route::get('/statistics/weekly', [StatisticsController::class, 'weekly']);
    Route::get('/statistics/monthly', [StatisticsController::class, 'monthly']);
    Route::get('/statistics/streaks', [StatisticsController::class, 'streaks']);

    // Settings
    Route::get('/settings', [SettingsController::class, 'index']);
    Route::put('/settings', [SettingsController::class, 'update']);
});
