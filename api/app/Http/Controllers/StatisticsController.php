<?php

namespace App\Http\Controllers;

use App\Models\HabitLog;
use App\Models\Goal;
use Illuminate\Http\Request;

class StatisticsController extends Controller
{
    public function summary(Request $request)
    {
        $user = $request->user();
        $today = now()->toDateString();

        $habitsTotal = $user->habits()->count();
        $habitsDone = HabitLog::where('user_id', $user->id)
            ->where('log_date', $today)
            ->whereRaw('value >= (SELECT target FROM habits WHERE habits.id = habit_logs.habit_id)')
            ->count();

        $goalsTotal = $user->goals()->count();
        $goalsDone = $user->goals()->where('is_completed', true)->count();

        $achievementsTotal = $user->achievements()->count();

        return response()->json([
            'streak' => $user->streak,
            'habits_progress' => $habitsTotal > 0 ? round(($habitsDone / $habitsTotal) * 100) : 0,
            'goals_progress' => $goalsTotal > 0 ? round(($goalsDone / $goalsTotal) * 100) : 0,
            'habits_done' => $habitsDone,
            'habits_total' => $habitsTotal,
            'goals_done' => $goalsDone,
            'goals_total' => $goalsTotal,
            'achievements' => $achievementsTotal,
            'level' => $user->level,
            'xp' => $user->xp,
            'xp_to_next' => $user->xp_to_next,
        ]);
    }

    public function weekly(Request $request)
    {
        $days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        $data = [];

        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->toDateString();
            $total = 0;
            $count = 0;

            $logs = HabitLog::where('user_id', $request->user()->id)
                ->where('log_date', $date)
                ->with('habit')
                ->get();

            foreach ($logs as $log) {
                if ($log->habit && $log->habit->target > 0) {
                    $total += min(100, ($log->value / $log->habit->target) * 100);
                    $count++;
                }
            }

            $data[] = [
                'label' => $days[now()->subDays($i)->dayOfWeek],
                'date' => $date,
                'value' => $count > 0 ? round($total / $count) : 0,
            ];
        }

        return response()->json($data);
    }

    public function monthly(Request $request)
    {
        $data = [];
        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        for ($m = 1; $m <= 12; $m++) {
            $total = 0;
            $count = 0;

            $logs = HabitLog::where('user_id', $request->user()->id)
                ->whereMonth('log_date', $m)
                ->whereYear('log_date', now()->year)
                ->with('habit')
                ->get();

            foreach ($logs as $log) {
                if ($log->habit && $log->habit->target > 0) {
                    $total += min(100, ($log->value / $log->habit->target) * 100);
                    $count++;
                }
            }

            $data[] = $count > 0 ? round($total / $count) : 0;
        }

        return response()->json([
            'labels' => $months,
            'values' => $data,
        ]);
    }

    public function streaks(Request $request)
    {
        $user = $request->user();
        return response()->json([
            'current_streak' => $user->streak,
            'longest_streak' => $user->streak, // Simplified; calculate from logs for accuracy
            'last_activity' => $user->last_activity_date,
        ]);
    }
}
