<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\order;
use DB;
use Illuminate\Http\Request;
use App\Models\Item;

class OrderController extends Controller
{

    public function createOrder(Request $request)
    {
        $validated = $request->validate([
            'customer_email' => 'required|email|max:255',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|integer|exists:tbl_items,item_id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();

        try {
            $order = Order::create([
                'customer_email' => $validated['customer_email'],
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
            ]);


            foreach ($validated['items'] as $item) {
                $dbItem = Item::where('item_id', $item['item_id'])->lockForUpdate()->first();

                if ($dbItem->item_quantity < $item['quantity']) {
                    throw new \Exception("Insufficient stock for item: {$dbItem->item_name}");
                }

                $order->items()->attach($item['item_id'], [
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ]);

                $dbItem->item_quantity -= $item['quantity'];
                $dbItem->save();
            }

            DB::commit();

            return response()->json([
                'message' => 'Order created successfully',
                'order_id' => $order->order_id,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create order',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
