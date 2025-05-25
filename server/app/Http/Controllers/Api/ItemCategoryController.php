<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Item_Category;
use Illuminate\Http\Request;
use Log;

class ItemCategoryController extends Controller
{
    public function loadCategory()
    {
        $categories = Item_Category::where('is_deleted', 0)->get();

        return response()->json([
            'categories' => $categories
        ], 200);
    }

    public function getCategory($category_id)
    {
        $category = Item_Category::find($category_id);
        return response()->json([
            'category' => $category
        ], 200);
    }

    public function storeCategory(Request $request)
    {
        $validated = $request->
            validate([
                'category_name' => ['required', 'min:4', 'max:55']
            ]);

        Item_Category::create([
            'category_name' => $validated['category_name']
        ]);

        return response()->json([

            'message' => 'Category Successfully Added'
        ], 200);

    }

    public function updateCategory(Request $request, Item_Category $category)
    {

        $validated = $request->validate([
            'category_name' => ['required', 'min:4', 'max:55']
        ]);

        $category->update([
            'category_name' => $validated['category_name']
        ]);

        return response()->json([
            'message' => 'Category Successfully Updated'
        ], 200);
    }

    public function destroyCategory($category_id)
    {
        Log::info('Finding Category:', ['category_id' => $category_id]);

        $category = Item_Category::find($category_id);

        if (!$category) {
            Log::error('Category not found!', ['category_id' => $category_id]);
            return response()->json(['error' => 'Category not found'], 404);
        }

        $category->update(['is_deleted' => 1]);

        Log::info('Category Successfully Deleted:', ['category_id' => $category_id]);

        return response()->json(['message' => 'Category Successfully Deleted.'], 200);
    }


}
