<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ItemController extends Controller
{
    public function loadItems()
    {
        $items = Item::with('category')->where('is_deleted', 0)->get();

        return response()->json([
            'items' => $items
        ], 200);
    }

    public function storeItem(Request $request)
    {
        $validated = $request->validate([
            'item_name' => ['required', 'max:55'],
            'item_description' => ['required', 'max:255'],
            'item_price' => ['required', 'numeric', 'min:0'],
            'item_quantity' => ['nullable', 'integer', 'min:0'],
            'item_image' => ['nullable', 'string', 'max:255'],
            'stock_level' => ['required', Rule::in(['available', 'unavailable', 'low_inventory'])],
            'category_id' => ['required', 'exists:tbl_item_category,category_id'],
        ]);

        Item::create([
            'item_name' => $validated['item_name'],
            'item_description' => $validated['item_description'],
            'item_price' => $validated['item_price'],
            'item_quantity' => $validated['item_quantity'] ?? 0,
            'item_image' => $validated['item_image'] ?? 'storage/images/placeholder.jpg',
            'stock_level' => $validated['stock_level'],
            'category_id' => $validated['category_id'],
            'is_deleted' => 0,
        ]);

        return response()->json([
            'message' => 'Item Successfully Added.'
        ], 200);
    }
    public function updateItem(Request $request, Item $item)
    {
        $validated = $request->validate([
            'item_name' => ['required', 'max:55'],
            'item_description' => ['required', 'max:255'],
            'item_price' => ['required', 'numeric', 'min:0'],
            'item_image' => ['nullable', 'string', 'max:255'],
            'stock_level' => ['required', Rule::in(['available', 'unavailable', 'low_inventory'])],
            'category_id' => ['required', 'exists:tbl_item_category,category_id'],
        ]);

        $item->update($validated);

        return response()->json([
            'message' => 'Item Successfully Updated'
        ], 200);
    }

    public function destroyItem(Item $item)
    {
        $item->update([
            'is_deleted' => 1
        ]);
        return response()->json([
            'message' => 'Item Sucessfully Deleted'
        ], 200);
    }
}
