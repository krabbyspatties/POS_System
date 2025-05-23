<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;


Route::get('/', function () {
    return view('welcome');
});

Route::prefix('users')->group(function () {
    Route::get('/', [UserController::class, 'loadUsers']);
    Route::post('/', [UserController::class, 'storeUser']);
    Route::put('/{user}', [UserController::class, 'updateUser']);
    Route::delete('/{user}', [UserController::class, 'destroyUser']);
});
