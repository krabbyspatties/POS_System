<?php

use App\Http\Controllers\Api\ItemCategoryController;
use App\Http\Controllers\Api\ItemController;
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
    Route::controller(ItemCategoryController::class)->group(function () {
        Route::get('/loadCategory', 'loadCategory');
        Route::get('/getCategory/{category_id}', 'getCategory');
        Route::post('/storeCategory', 'storeCategory');
        Route::put('/updateCategory/{category}', 'updateCategory');
        Route::delete('/destroyCategory/{category_id}', 'destroyCategory');


    });
    Route::controller(UserController::class)->group(function () {
        Route::get('/loadUsers', 'loadUsers');
        Route::post('/storeUser', 'storeUser');
        Route::put('/updateUser/{user}', 'updateUser');
        Route::put('/destroyUser/{user}', 'destroyUser');
    });
    Route::controller(ItemController::class)->group(function () {
        Route::get('/loadItems', 'loadItems');
        Route::post('/storeItem', 'storeItem');
        Route::put('/updateItem/{item}', 'updateItem');
        Route::delete('/destroyItem/{item}', 'destroyItem');
    });
});
