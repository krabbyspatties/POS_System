<?php

use App\Http\Controllers\Api\ChartController;
use App\Http\Controllers\Api\FeedbackController;
use App\Http\Controllers\Api\ItemCategoryController;
use App\Http\Controllers\Api\ItemController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\RecieptController;
use App\Http\Controllers\Api\ReportController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Http;

Route::post('/saveReceipt', [RecieptController::class, 'store']);

Route::controller(AuthController::class)->group(function () {
    Route::post('/login', 'login');
});

Route::get('/test-make-webhook', function () {
    $makeWebhookUrl = env('MAKE_WEBHOOK_URL');

    if (!$makeWebhookUrl) {
        return response()->json(['error' => 'MAKE_WEBHOOK_URL not configured']);
    }

    try {
        $response = Http::withOptions([
            'verify' => false, // Disable SSL verification
            'timeout' => 30,
        ])->post($makeWebhookUrl, [
                    'pdf_url' => 'https://example.com/test.pdf',
                    'email' => 'test@example.com',
                    'first_name' => 'Test',
                    'last_name' => 'User',
                    'total' => 100.00,
                ]);

        return response()->json([
            'status' => $response->status(),
            'body' => $response->body(),
            'success' => $response->successful(),
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage(),
        ]);
    }
});
Route::middleware('auth:sanctum')->group(function () {
    Route::controller(AuthController::class)->group(function () {
        Route::get('/user', 'user');
        Route::post('/logout', 'logout');
    });

    Route::middleware('role:cashier,manager,administrator')->group(function () {
        Route::post('/createOrder', [OrderController::class, 'createOrder']);
        Route::get('/loadItems', [ItemController::class, 'loadItems']);
        Route::get('/loadCategory', [ItemCategoryController::class, 'loadCategory']);
        Route::get('/orders/{orderId}', [OrderController::class, 'getOrder']);
    });

    // ✅ ADMINISTRATOR — full access
    Route::middleware('role:administrator')->group(function () {
        Route::controller(UserController::class)->group(function () {
            Route::get('/loadUsers', 'loadUsers');
            Route::post('/storeUser', 'storeUser');
            Route::post('/updateUser/{user}', 'updateUser');
            Route::put('/destroyUser/{user}', 'destroyUser');
        });
    });

    // ✅ MANAGER & ADMINISTRATOR — full inventory/report access
    Route::middleware('role:manager,administrator')->group(function () {
        Route::controller(ItemCategoryController::class)->group(function () {
            Route::get('/getCategory/{category_id}', 'getCategory');
            Route::post('/storeCategory', 'storeCategory');
            Route::put('/updateCategory/{category}', 'updateCategory');
            Route::delete('/destroyCategory/{category_id}', 'destroyCategory');
        });

        Route::controller(ItemController::class)->group(function () {
            Route::post('/storeItem', 'storeItem');
            Route::post('/updateItem/{item}', 'updateItem');
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

        Route::get('/feedback/responses', [FeedbackController::class, 'getResponses']);
        Route::get('/feedback/questions', [FeedbackController::class, 'getSurveyQuestions']);
        Route::get('/feedback/summary', [FeedbackController::class, 'getAggregatedResponses']);
    });
});
