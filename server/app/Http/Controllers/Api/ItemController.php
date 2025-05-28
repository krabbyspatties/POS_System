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
            'item_image' => ['nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048'],
            'stock_level' => ['required', Rule::in(['available', 'unavailable', 'low_inventory'])],
            'category_id' => ['required', 'exists:tbl_item_category,category_id'],
        ]);

        if ($request->hasFile('item_image')) {
            $validated['item_image'] = $request->file('item_image')->store('pictures', 'public');
        } else {
            $validated['item_image'] = '/pictures/default1.png';
        }

        Item::create([
            'item_image' => $validated['item_image'],
        ]);

        return response()->json([
            'message' => 'Item Successfully Added.'
        ], 200);
    }
    public function updateItem(Request $request, $id)
    {
        $validated = $request->validate([
            'item_name' => ['required', 'max:55'],
            'item_description' => ['required', 'max:255'],
            'item_price' => ['required', 'numeric', 'min:0'],
            'item_image' => ['nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048'],
            'stock_level' => ['required', Rule::in(['available', 'unavailable', 'low_inventory'])],
            'category_id' => ['required', 'exists:tbl_item_category,category_id'],
        ]);

        if ($request->hasFile('item_image')) {
            $validatedData['item_image'] = $request->file('item_image')->store('pictures', 'public');
        }

        $item = Item::findOrFail($id);
        $item->update($validatedData);

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
