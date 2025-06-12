<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    public function loadUsers()
    {
        try {
            $users = User::where('is_deleted', 0)->get();

            return response()->json([
                'users' => $users
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error loading users', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'An error occurred while loading users.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function storeUser(Request $request)
    {
        try {
            $validated = $request->validate([
                'first_name' => ['required', 'max:55'],
                'last_name' => ['required', 'max:55'],
                'user_name' => ['required', 'max:55'],
                'user_email' => ['required', 'email', 'max:255', Rule::unique('tbl_users', 'user_email')],
                'password' => ['required', 'confirmed', 'min:8', 'max:15'],
                'password_confirmation' => ['required', 'min:8', 'max:15'],
                'user_phone' => ['nullable', 'max:20'],
                'user_address' => ['nullable', 'max:255'],
                'user_image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg', 'max:2048'],
                'role' => ['required', Rule::in(['cashier', 'manager', 'administrator'])],
            ]);

            if ($request->hasFile('user_image')) {
                $validated['user_image'] = $request->file('user_image')->store('images', 'public');
            } else {
                $validated['user_image'] = 'images/profile.png';
            }

            User::create([
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'user_name' => $validated['user_name'],
                'user_email' => $validated['user_email'],
                'password' => bcrypt($validated['password']),
                'user_phone' => $validated['user_phone'] ?? null,
                'user_address' => $validated['user_address'] ?? null,
                'user_image' => $validated['user_image'],
                'role' => $validated['role'],
            ]);

            return response()->json([
                'message' => 'User Successfully Added.'
            ], 200);
        } catch (\Illuminate\Database\UniqueConstraintViolationException $e) {
            Log::warning('Duplicate email registration attempt', [
                'email' => $request->input('user_email')
            ]);

            return response()->json([
                'message' => 'A user with this email already exists.',
                'errors' => ['user_email' => ['The email address is already taken.']]
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error creating user', [
                'error' => $e->getMessage(),
                'data' => $request->except(['password', 'password_confirmation'])
            ]);

            return response()->json([
                'message' => 'An error occurred while creating the user.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateUser(Request $request, User $user)
    {
        try {
            $validated = $request->validate([
                'first_name' => ['required', 'max:55'],
                'last_name' => ['required', 'max:55'],
                'user_name' => ['required', 'max:55'],
                'user_email' => ['required', 'email', 'max:255', Rule::unique('tbl_users', 'user_email')->ignore($user->user_id, 'user_id')],
                'user_phone' => ['nullable', 'max:20'],
                'user_address' => ['nullable', 'max:255'],
                'user_image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg', 'max:2048'],
                'role' => ['required', Rule::in(['cashier', 'manager', 'administrator'])],
                'existing_image' => ['nullable', 'string'],
            ]);

            $imagePath = $user->user_image;

            if ($request->hasFile('user_image')) {
                if ($user->user_image && $user->user_image !== 'images/profile.png') {
                    Storage::disk('public')->delete($user->user_image);
                }
                $imagePath = $request->file('user_image')->store('images', 'public');
            } elseif ($request->filled('existing_image')) {
                $imagePath = $request->input('existing_image');
            }

            $user->update([
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'user_name' => $validated['user_name'],
                'user_email' => $validated['user_email'],
                'user_phone' => $validated['user_phone'] ?? null,
                'user_address' => $validated['user_address'] ?? null,
                'user_image' => $imagePath,
                'role' => $validated['role'],
            ]);

            return response()->json([
                'message' => 'User Successfully Updated.',
                'user' => $user->fresh()
            ], 200);
        } catch (\Illuminate\Database\UniqueConstraintViolationException $e) {
            Log::warning('Duplicate email update attempt', [
                'user_id' => $user->user_id,
                'email' => $request->input('user_email')
            ]);

            return response()->json([
                'message' => 'A user with this email already exists.',
                'errors' => ['user_email' => ['The email address is already taken.']]
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error updating user', [
                'user_id' => $user->user_id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'An error occurred while updating the user.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroyUser(User $user)
    {
        try {
            $user->update([
                'is_deleted' => 1
            ]);

            Log::info('User soft deleted', [
                'user_id' => $user->user_id
            ]);

            return response()->json([
                'message' => 'User Successfully Deleted.'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error deleting user', [
                'user_id' => $user->user_id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'An error occurred while deleting the user.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
