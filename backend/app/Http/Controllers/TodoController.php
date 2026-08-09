<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;

class TodoController extends Controller
{
    public function index(Request $request)
    {
        $query = auth()->user()->todos();

        // Search functionality
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', "%{$search}%")
                  ->orWhere('description', 'ilike', "%{$search}%");
            });
        }

        // Filter functionality (all, completed, pending)
        if ($request->has('filter')) {
            if ($request->filter === 'completed') {
                $query->where('is_completed', true);
            } elseif ($request->filter === 'pending') {
                $query->where('is_completed', false);
            }
        }

        return response()->json($query->latest()->get(), 200);
    }

    public function store(Request $request)
    {
        $fields = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);

        $todo = auth()->user()->todos()->create([
            'title' => $fields['title'],
            'description' => $fields['description'] ?? null,
            'is_completed' => false
        ]);

        return response()->json($todo, 201);
    }

    public function update(Request $request, Todo $todo)
    {
        $this->authorizeUser($todo);

        $fields = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'is_completed' => 'sometimes|boolean'
        ]);

        $todo->update($fields);

        return response()->json($todo, 200);
    }

    public function destroy(Todo $todo)
    {
        $this->authorizeUser($todo);

        $todo->delete();

        return response()->json(['message' => 'Todo deleted successfully'], 200);
    }

    private function authorizeUser(Todo $todo)
    {
        if ($todo->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }
    }
}
