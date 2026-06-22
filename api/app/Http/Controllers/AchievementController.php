<?php

namespace App\Http\Controllers;

use App\Models\Achievement;
use Illuminate\Http\Request;

class AchievementController extends Controller
{
    public function index(Request $request)
    {
        $allAchievements = Achievement::all();
        $userAchievements = $request->user()->achievements;

        $data = $allAchievements->map(function ($achievement) use ($userAchievements) {
            $unlocked = $userAchievements->contains('id', $achievement->id);
            $pivot = $unlocked ? $userAchievements->find($achievement->id)->pivot : null;
            return [
                'id' => $achievement->id,
                'name' => $achievement->name,
                'icon' => $achievement->icon,
                'description' => $achievement->description,
                'category' => $achievement->category,
                'unlocked' => $unlocked,
                'achieved_at' => $pivot ? $pivot->achieved_at : null,
            ];
        });

        return response()->json($data);
    }

    public function show(Request $request, $id)
    {
        $achievement = Achievement::findOrFail($id);
        $unlocked = $request->user()->achievements()->where('achievement_id', $id)->exists();
        return response()->json([
            'achievement' => $achievement,
            'unlocked' => $unlocked,
        ]);
    }
}
