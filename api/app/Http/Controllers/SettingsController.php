<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function index(Request $request)
    {
        $settings = $request->user()->settings;
        if (!$settings) {
            $settings = $request->user()->settings()->create([]);
        }
        return response()->json($settings);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'dark_mode' => 'sometimes|boolean',
            'language' => 'sometimes|string|in:en,es',
            'notifications_enabled' => 'sometimes|boolean',
            'habit_reminders' => 'sometimes|boolean',
            'goal_reminders' => 'sometimes|boolean',
            'weekly_report' => 'sometimes|boolean',
        ]);

        $settings = $request->user()->settings;
        if (!$settings) {
            $settings = $request->user()->settings()->create($validated);
        } else {
            $settings->update($validated);
        }

        return response()->json($settings);
    }
}
