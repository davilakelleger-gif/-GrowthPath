<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(
            $request->user()->notifications()->orderByDesc('created_at')->get()
        );
    }

    public function markAsRead(Request $request, $id)
    {
        $notification = $request->user()->notifications()->findOrFail($id);
        $notification->update(['is_read' => true]);
        return response()->json($notification);
    }

    public function markAllAsRead(Request $request)
    {
        $request->user()->notifications()->where('is_read', false)->update(['is_read' => true]);
        return response()->json(['message' => 'All notifications marked as read']);
    }
}
