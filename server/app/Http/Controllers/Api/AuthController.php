<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use App\Services\SecurityAuditService;

class AuthController extends Controller
{
    /**
     * Authenticate user and issue access token
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        try {
            $credentials = $request->validate([
                'user_email' => ['required', 'email'],
                'password' => ['required', 'min:8', 'max:15'],
            ]);

            // Implement brute force protection - limit login attempts
            if ($this->hasTooManyLoginAttempts($request)) {
                Log::warning('Too many login attempts detected', [
                    'ip' => $request->ip(),
                    'email' => $request->input('user_email')
                ]);

                return response()->json([
                    'message' => 'Too many login attempts. Please try again later.'
                ], 429);
            }

            if (!Auth::attempt($credentials)) {
                // Increment failed login attempts
                $this->incrementLoginAttempts($request);

                Log::info('Failed login attempt', [
                    'ip' => $request->ip(),
                    'email' => $request->input('user_email')
                ]);

                return response()->json([
                    'message' => 'Invalid credentials, please try again.'
                ], 401);
            }

            // Reset login attempts on successful login
            $this->clearLoginAttempts($request);

            $user = Auth::user();

            // Revoke any existing tokens for security
            $user->tokens()->delete();

            // Create new token with expiration (8 hours)
            $token = $user->createToken('auth_token', ['*'], now()->addHours(8))->plainTextToken;

            Log::info('User logged in successfully', [
                'user_id' => $user->user_id,
                'ip' => $request->ip()
            ]);

            return response()->json([
                'message' => 'Login Successful',
                'token' => $token,
                'user' => $user,
                'expires_at' => now()->addHours(8)->toDateTimeString()
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Login error', [
                'message' => $e->getMessage(),
                'ip' => $request->ip()
            ]);

            return response()->json([
                'message' => 'An error occurred during authentication'
            ], 500);
        }
    }

    /**
     * Log out the user (revoke token)
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        try {
            $user = $request->user();
            $request->user()->currentAccessToken()->delete();

            Log::info('User logged out', [
                'user_id' => $user->user_id,
                'ip' => $request->ip()
            ]);

            return response()->json([
                'message' => 'Logout Successful'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Logout error', [
                'message' => $e->getMessage(),
                'ip' => $request->ip()
            ]);

            return response()->json([
                'message' => 'An error occurred during logout'
            ], 500);
        }
    }

    /**
     * Get authenticated user information
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function user(Request $request)
    {
        try {
            return response()->json($request->user());
        } catch (\Exception $e) {
            Log::error('Error retrieving user data', [
                'message' => $e->getMessage(),
                'ip' => $request->ip()
            ]);

            return response()->json([
                'message' => 'An error occurred while retrieving user data'
            ], 500);
        }
    }

    /**
     * Check if the user has too many login attempts
     *
     * @param Request $request
     * @return bool
     */
    protected function hasTooManyLoginAttempts(Request $request)
    {
        $key = 'login_attempts_' . $request->ip();
        $maxAttempts = 5; // Maximum number of attempts
        $decayMinutes = 5; // Lock time in minutes

        $attempts = cache()->get($key, 0);

        return $attempts >= $maxAttempts;
    }

    /**
     * Increment the login attempts for the user
     *
     * @param Request $request
     * @return void
     */
    protected function incrementLoginAttempts(Request $request)
    {
        $key = 'login_attempts_' . $request->ip();
        $decayMinutes = 5; // Lock time in minutes

        $attempts = cache()->get($key, 0);
        cache()->put($key, $attempts + 1, now()->addMinutes($decayMinutes));
    }

    /**
     * Clear the login attempts for the user
     *
     * @param Request $request
     * @return void
     */
    protected function clearLoginAttempts(Request $request)
    {
        $key = 'login_attempts_' . $request->ip();
        cache()->forget($key);
    }
}
