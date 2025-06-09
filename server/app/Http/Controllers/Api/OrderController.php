<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\order;
use DB;
use Illuminate\Http\Request;
use App\Models\Item;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function createOrder(Request $request)
    {
        try {
            $validated = $request->validate([
                'customer_email' => 'required|email|max:255',
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'total_price' => 'required|integer|min:0',
                'items' => 'required|array|min:1',
                'items.*.item_id' => 'required|integer|exists:tbl_items,item_id',
                'items.*.quantity' => 'required|integer|min:1',
                'items.*.price' => 'required|numeric|min:0',
                'items.*.item_discount' => 'nullable|integer|min:0|max:100',
            ]);

            Log::info('Creating order with validated data:', $validated);

            DB::beginTransaction();

            $order = Order::create([
                'customer_email' => $validated['customer_email'],
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
            ]);

            Log::info('Order created with ID: ' . $order->order_id);

            foreach ($validated['items'] as $item) {
                $dbItem = Item::where('item_id', $item['item_id'])->lockForUpdate()->first();

                if (!$dbItem) {
                    throw new \Exception("Item with ID {$item['item_id']} not found");
                }

                if ($dbItem->item_quantity < $item['quantity']) {
                    throw new \Exception("Insufficient stock for item: {$dbItem->item_name}. Available: {$dbItem->item_quantity}, Requested: {$item['quantity']}");
                }

                // Get the original price from the database
                $originalPrice = $dbItem->item_price;

                // Get the discount percentage (either from request or database)
                $discountPercent = isset($item['item_discount']) ? $item['item_discount'] : ($dbItem->item_discount ?? 0);

                // The final price is provided by the frontend
                $finalPrice = $item['price'];

                $order->items()->attach($item['item_id'], [
                    'quantity' => $item['quantity'],
                    'price' => $finalPrice,
                    'original_price' => $originalPrice,
                    'discount_percent' => $discountPercent,
                    'total_price' => $finalPrice * $item['quantity'],
                ]);


                $dbItem->item_quantity -= $item['quantity'];
                $dbItem->save();

                Log::info("Added item {$dbItem->item_name} to order. Quantity: {$item['quantity']}, Price: {$finalPrice}");
            }

            DB::commit();

            Log::info('Order created successfully with ID: ' . $order->order_id);

            return response()->json([
                'message' => 'Order created successfully',
                'order_id' => $order->order_id,
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::error('Validation error in createOrder:', $e->errors());

            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating order: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());

            return response()->json([
                'message' => 'Failed to create order',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function getOrder($orderId)
    {
        $order = Order::with(['items'])->findOrFail($orderId);

        return response()->json([
            'order_id' => $order->order_id,
            'customer_email' => $order->customer_email,
            'first_name' => $order->first_name,
            'last_name' => $order->last_name,
            'items' => $order->items->map(function ($item) {
                return [
                    'item_id' => $item->item_id,
                    'item' => [
                        'item_name' => $item->item_name,
                    ],
                    'quantity' => $item->pivot->quantity,
                    'price' => $item->pivot->price,
                    'original_price' => $item->pivot->original_price,
                    'discount_percent' => $item->pivot->discount_percent,
                    'total_price' => $item->pivot->total_price,
                ];
            }),
        ]);
    }
}
