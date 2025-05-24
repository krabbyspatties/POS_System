<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function loadUsers()
    {
        $users = User::where('is_deleted', false)->get();

        return response()->json([
            'users' => $users
        ], 200);
    }

    public function storeUser(Request $request)
    {
        $validated = $request->validate([
            'first_name' => ['required', 'max:55'],
            'last_name' => ['required', 'max:55'],
            'user_name' => ['required', 'max:55'],
            'user_email' => ['required', 'email', 'max:255', Rule::unique('tbl_users', 'user_email')],
            'password' => ['required', 'confirmed', 'min:8', 'max:15'],
            'password_confirmation' => ['required', 'min:8', 'max:15'],
            'user_phone' => ['nullable', 'max:20'],
            'user_address' => ['nullable', 'max:255'],
            'user_image' => ['nullable', 'max:255'],
            'role' => ['required', Rule::in(['cashier', 'manager', 'administrator'])],
        ]);

        User::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'user_name' => $validated['user_name'],
            'user_email' => $validated['user_email'],
            'password' => bcrypt($validated['password']),
            'user_phone' => $validated['user_phone'] ?? null,
            'user_address' => $validated['user_address'] ?? null,
            'user_image' => $validated['user_image'] ?? null,
            'role' => $validated['role'],
        ]);

        return response()->json([
            'message' => 'User Successfully Added.'
        ], 200);
    }

    public function updateUser(Request $request, User $user)
    {
        $validated = $request->validate([
            'first_name' => ['required', 'max:55'],
            'last_name' => ['required', 'max:55'],
            'user_name' => ['required', 'max:55'],
            'user_email' => ['required', 'email', 'max:255', Rule::unique('tbl_users', 'user_email')->ignore($user->user_id, 'user_id')],
            'user_phone' => ['nullable', 'max:20'],
            'user_address' => ['nullable', 'max:255'],
            'user_image' => ['nullable', 'max:255'],
            'role' => ['required', Rule::in(['cashier', 'manager', 'administrator'])],
        ]);

        $user->update([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'user_name' => $validated['user_name'],
            'user_email' => $validated['user_email'],
            'user_phone' => $validated['user_phone'] ?? null,
            'user_address' => $validated['user_address'] ?? null,
            'user_image' => $validated['user_image'] ?? null,
            'role' => $validated['role'],
        ]);

        return response()->json([
            'message' => 'User Successfully Updated.'
        ], 200);
    }

    public function destroyUser(User $user)
    {
        $user->update([
            'is_deleted' => true
        ]);

        return response()->json([
            'message' => 'User Successfully Deleted.'
        ], 200);
    }
}
