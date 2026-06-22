<?php

namespace App\Http\Controllers;

use App\Models\Goal;
use App\Models\GoalLog;
use Illuminate\Http\Request;

class GoalController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(
            $request->user()->goals()->orderBy('sort_order')->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string',
            'deadline' => 'required|date|after:today',
        ]);

        $goal = $request->user()->goals()->create($validated);
        return response()->json($goal, 201);
    }

    public function show(Request $request, $id)
    {
        return response()->json(
            $request->user()->goals()->findOrFail($id)
        );
    }

    public function update(Request $request, $id)
    {
        $goal = $request->user()->goals()->findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'icon' => 'nullable|string',
            'deadline' => 'sometimes|date',
        ]);
        $goal->update($validated);
        return response()->json($goal);
    }

    public function destroy(Request $request, $id)
    {
        $goal = $request->user()->goals()->findOrFail($id);
        $goal->logs()->delete();
        $goal->delete();
        return response()->json(null, 204);
    }

    public function updateProgress(Request $request, $id)
    {
        $goal = $request->user()->goals()->findOrFail($id);
        $validated = $request->validate([
            'progress' => 'required|numeric|min:0|max:100',
            'note' => 'nullable|string',
        ]);

        $delta = $validated['progress'] - $goal->progress;
        $goal->update([
            'progress' => $validated['progress'],
            'is_completed' => $validated['progress'] >= 100,
        ]);

        $goal->logs()->create([
            'user_id' => $request->user()->id,
            'progress_delta' => $delta,
            'note' => $validated['note'] ?? null,
        ]);

        return response()->json($goal);
    }
}
