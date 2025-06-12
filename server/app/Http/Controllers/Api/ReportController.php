<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\Order;
use App\Models\Order_Item;
use Carbon\Carbon;
use DB;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function salesReport(Request $request)
    {
        try {
            $startDate = $request->query('start_date') ? Carbon::parse($request->query('start_date')) : now()->startOfMonth();
            $endDate = $request->query('end_date') ? Carbon::parse($request->query('end_date')) : now();

            $totalSales = DB::table('tbl_orders')
                ->join('tbl_order_items', 'tbl_orders.order_id', '=', 'tbl_order_items.order_id')
                ->whereBetween('tbl_orders.created_at', [$startDate, $endDate])
                ->select(DB::raw('SUM(tbl_order_items.quantity * tbl_order_items.price) as total_sales'))
                ->value('total_sales');

            $dailySalesSummary = DB::table('tbl_orders')
                ->join('tbl_order_items', 'tbl_orders.order_id', '=', 'tbl_order_items.order_id')
                ->whereBetween('tbl_orders.created_at', [$startDate, $endDate])
                ->select(DB::raw('DATE(tbl_orders.created_at) as sale_date'), DB::raw('SUM(tbl_order_items.quantity) as total_quantity'))
                ->groupBy('sale_date')
                ->orderBy('sale_date')
                ->get();

            $dailyItems = DB::table('tbl_orders')
                ->join('tbl_order_items', 'tbl_orders.order_id', '=', 'tbl_order_items.order_id')
                ->join('tbl_items', 'tbl_order_items.item_id', '=', 'tbl_items.item_id')
                ->whereBetween('tbl_orders.created_at', [$startDate, $endDate])
                ->select(
                    DB::raw('DATE(tbl_orders.created_at) as sale_date'),
                    'tbl_order_items.item_id',
                    'tbl_items.item_name',
                    DB::raw('SUM(tbl_order_items.quantity) as quantity_sold')
                )
                ->groupBy('sale_date', 'tbl_order_items.item_id', 'tbl_items.item_name')
                ->orderBy('sale_date')
                ->get();

            // Organize items by sale_date
            $itemsGroupedByDate = [];
            foreach ($dailyItems as $item) {
                $date = $item->sale_date;
                if (!isset($itemsGroupedByDate[$date])) {
                    $itemsGroupedByDate[$date] = [];
                }
                $itemsGroupedByDate[$date][] = [
                    'item_id' => $item->item_id,
                    'item_name' => $item->item_name,
                    'quantity_sold' => (int) $item->quantity_sold,
                ];
            }

            // Combine summary and items
            $dailySales = $dailySalesSummary->map(function ($day) use ($itemsGroupedByDate) {
                return [
                    'sale_date' => $day->sale_date,
                    'total_quantity' => (int) $day->total_quantity,
                    'items' => $itemsGroupedByDate[$day->sale_date] ?? [],
                ];
            });

            return response()->json([
                'totalSales' => $totalSales,
                'dailySales' => $dailySales,
            ]);
        } catch (\Exception $e) {
            \Log::error('Sales report error: ' . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }



    public function inventoryReport()
    {
        try {
            $items = Item::select('item_id', 'item_name', 'item_quantity', 'item_price')->get();

            $lowStockItems = $items->filter(fn($item) => $item->item_quantity < 100);

            $totalInventoryValue = $items->reduce(function ($carry, $item) {
                return $carry + ($item->item_quantity * $item->item_price);
            }, 0);

            return response()->json([
                'items' => $items,
                'lowStockItems' => $lowStockItems->values(),
                'totalInventoryValue' => $totalInventoryValue,
            ]);
        } catch (\Exception $e) {
            \Log::error('Inventory report error: ' . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }
}
