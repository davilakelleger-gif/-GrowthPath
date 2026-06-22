<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user()->load(['achievements', 'settings']);
        return response()->json($user);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $request->user()->id,
        ]);

        $request->user()->update($validated);
        return response()->json($request->user());
    }

    public function updateAvatar(Request $request)
    {
        $validated = $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $path = $request->file('avatar')->store('avatars', 'public');
        $request->user()->update(['avatar' => $path]);

        return response()->json(['avatar_url' => asset('storage/' . $path)]);
    }
}
