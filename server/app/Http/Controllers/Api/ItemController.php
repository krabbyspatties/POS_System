<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ItemController extends Controller
{
    public function loadItems(Request $request)
    {
        $perPage = $request->get('perPage', 10);
        $page = $request->get('page', 1);

        $items = Item::with('category')
            ->where('is_deleted', 0)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'items' => $items->items(),
            'current_page' => $items->currentPage(),
            'last_page' => $items->lastPage(),
            'total' => $items->total(),
        ], 200);
    }




    public function getItem($id)
    {
        $item = Item::with('category')->where('is_deleted', 0)->findOrFail($id);

        return response()->json([
            'item' => $item
        ], 200);
    }

    public function storeItem(Request $request)
    {
        $validated = $request->validate([
            'item_name' => ['required', 'max:55'],
            'item_description' => ['required', 'max:255'],
            'item_price' => ['required', 'numeric', 'min:0'],
            'item_discount' => ['nullable', 'integer', 'min:0', 'max:100'],
            'item_quantity' => ['nullable', 'integer', 'min:0'],
            'item_image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg', 'max:2048'],
            'stock_level' => ['required', Rule::in(['available', 'unavailable', 'low_inventory'])],
            'category_id' => ['required', 'exists:tbl_item_category,category_id'],
        ]);

        if ($request->hasFile('item_image')) {
            $validated['item_image'] = $request->file('item_image')->store('images', 'public');
        } else {
            $validated['item_image'] = 'images/item.png';
        }

        Item::create($validated);

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
            'item_discount' => ['nullable', 'integer', 'min:0', 'max:100'],
            'item_quantity' => ['nullable', 'integer', 'min:0'],
            'item_image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg', 'max:2048'],
            'stock_level' => ['required', Rule::in(['available', 'unavailable', 'low_inventory'])],
            'category_id' => ['required', 'exists:tbl_item_category,category_id'],
        ]);

        $item = Item::findOrFail($id);

        if ($request->hasFile('item_image')) {
            $validated['item_image'] = $request->file('item_image')->store('images', 'public');
        } else {
            unset($validated['item_image']);
        }

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
            'message' => 'Item Successfully Deleted'
        ], 200);
    }
}
