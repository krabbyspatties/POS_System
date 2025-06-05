<?php

use App\Http\Controllers\Api\ChartController;
use App\Http\Controllers\Api\ItemCategoryController;
use App\Http\Controllers\Api\ItemController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\RecieptController;
use App\Http\Controllers\Api\ReportController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;

Route::controller(AuthController::class)->group(function () {
    Route::post('/login', 'login');
});

Route::post('/saveReceipt', [RecieptController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::controller(AuthController::class)->group(function () {
        Route::get('/user', 'user');
        Route::post('/logout', 'logout');
    });

    // ✅ Routes shared by ALL ROLES (including cashier)
    Route::middleware('role:cashier,manager,administrator')->group(function () {
        Route::post('/createOrder', [OrderController::class, 'createOrder']);
        Route::get('/loadItems', [ItemController::class, 'loadItems']);
    });

    // ✅ ADMINISTRATOR — full access
    Route::middleware('role:administrator')->group(function () {
        Route::controller(UserController::class)->group(function () {
            Route::get('/loadUsers', 'loadUsers');
            Route::post('/storeUser', 'storeUser');
            Route::put('/updateUser/{user}', 'updateUser');
            Route::put('/destroyUser/{user}', 'destroyUser');
        });
    });

    // ✅ MANAGER & ADMINISTRATOR — full inventory/report access
    Route::middleware('role:manager,administrator')->group(function () {
        Route::controller(ItemCategoryController::class)->group(function () {
            Route::get('/loadCategory', 'loadCategory');
            Route::get('/getCategory/{category_id}', 'getCategory');
            Route::post('/storeCategory', 'storeCategory');
            Route::put('/updateCategory/{category}', 'updateCategory');
            Route::delete('/destroyCategory/{category_id}', 'destroyCategory');
        });

        Route::controller(ItemController::class)->group(function () {
            Route::post('/storeItem', 'storeItem');
            Route::put('/updateItem/{item}', 'updateItem');
            Route::delete('/destroyItem/{item}', 'destroyItem');
        });

        Route::controller(ChartController::class)->group(function () {
            Route::get('/BestItem', 'bestSellingItems');
            Route::get('/TopCustomers', 'topSpendingCustomers');
        });

        Route::controller(ReportController::class)->group(function () {
            Route::get('/salesReport', 'salesReport');
            Route::get('/inventoryReport', 'inventoryReport');
        });
    });
});


