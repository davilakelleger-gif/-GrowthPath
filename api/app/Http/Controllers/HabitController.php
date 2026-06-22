<?php

namespace App\Http\Controllers;

use App\Models\Habit;
use App\Models\HabitLog;
use Illuminate\Http\Request;

class HabitController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(
            $request->user()->habits()->orderBy('sort_order')->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string',
            'target' => 'required|integer|min:1',
            'unit' => 'nullable|string',
            'color' => 'nullable|string',
            'reminder_time' => 'nullable|date_format:H:i',
        ]);

        $habit = $request->user()->habits()->create($validated);
        return response()->json($habit, 201);
    }

    public function show(Request $request, $id)
    {
        $habit = $request->user()->habits()->findOrFail($id);
        return response()->json($habit);
    }

    public function update(Request $request, $id)
    {
        $habit = $request->user()->habits()->findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'icon' => 'nullable|string',
            'target' => 'sometimes|integer|min:1',
            'unit' => 'nullable|string',
            'color' => 'nullable|string',
            'reminder_time' => 'nullable|date_format:H:i',
            'is_active' => 'sometimes|boolean',
        ]);
        $habit->update($validated);
        return response()->json($habit);
    }

    public function destroy(Request $request, $id)
    {
        $habit = $request->user()->habits()->findOrFail($id);
        $habit->logs()->delete();
        $habit->delete();
        return response()->json(null, 204);
    }

    public function log(Request $request, $id)
    {
        $habit = $request->user()->habits()->findOrFail($id);
        $validated = $request->validate([
            'value' => 'required|integer|min:0',
            'date' => 'nullable|date',
            'note' => 'nullable|string',
        ]);

        $date = $validated['date'] ?? now()->toDateString();
        $value = min($validated['value'], $habit->target);

        $log = HabitLog::updateOrCreate(
            [
                'habit_id' => $habit->id,
                'user_id' => $request->user()->id,
                'log_date' => $date,
            ],
            [
                'value' => $value,
                'note' => $validated['note'] ?? null,
            ]
        );

        // Update streak
        $this->updateStreak($request->user());

        return response()->json($log);
    }

    public function today(Request $request)
    {
        $habits = $request->user()->habits()->where('is_active', true)->get();
        $today = now()->toDateString();

        $data = $habits->map(function ($habit) use ($today) {
            $log = $habit->getLogForDate($today);
            return [
                'id' => $habit->id,
                'name' => $habit->name,
                'icon' => $habit->icon,
                'target' => $habit->target,
                'unit' => $habit->unit,
                'color' => $habit->color,
                'current' => $log ? $log->value : 0,
                'progress' => $habit->target > 0
                    ? min(100, round(($log ? $log->value : 0) / $habit->target * 100))
                    : 0,
            ];
        });

        return response()->json($data);
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
                ->get();

            foreach ($logs as $log) {
                $habit = $log->habit;
                if ($habit && $habit->target > 0) {
                    $total += min(100, ($log->value / $habit->target) * 100);
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

    private function updateStreak($user)
    {
        $today = now()->toDateString();
        $yesterday = now()->subDay()->toDateString();

        $hasTodayLog = HabitLog::where('user_id', $user->id)
            ->where('log_date', $today)
            ->where('value', '>', 0)
            ->exists();

        $hasYesterdayLog = HabitLog::where('user_id', $user->id)
            ->where('log_date', $yesterday)
            ->where('value', '>', 0)
            ->exists();

        if ($hasTodayLog) {
            if ($user->last_activity_date == $yesterday) {
                $user->increment('streak');
            } elseif ($user->last_activity_date != $today) {
                $user->streak = 1;
            }
            $user->last_activity_date = $today;
            $user->save();
        }
    }
}
