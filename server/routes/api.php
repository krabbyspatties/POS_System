<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;

Route::controller(AuthController::class)->group(function () {
    Route::post('/login', 'login');
});

Route::middleware('auth:sanctum')->group(function () {
    Route::controller(AuthController::class)->group(function () {
        Route::get('/user', 'user');
        Route::post('/logout', 'logout');
    });

    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'loadUsers']);
        Route::post('/', [UserController::class, 'storeUser']);
        Route::put('/{user}', [UserController::class, 'updateUser']);
        Route::delete('/{user}', [UserController::class, 'destroyUser']);
    });
});