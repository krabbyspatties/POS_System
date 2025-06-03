<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use DB;
use Illuminate\Http\Request;

class ChartController extends Controller
{
    public function bestSellingItems()
    {
        $data = DB::table('tbl_order_items')
            ->join('tbl_items', 'tbl_order_items.item_id', '=', 'tbl_items.item_id')
            ->select('tbl_items.item_name', DB::raw('SUM(tbl_order_items.quantity) as total_sold'))
            ->groupBy('tbl_order_items.item_id', 'tbl_items.item_name')
            ->orderByDesc('total_sold')
            ->limit(10)
            ->get();

        return response()->json($data);
    }

    public function topSpendingCustomers()
    {
        $topCustomers = DB::table('tbl_orders as o')
            ->join('tbl_order_items as oi', 'o.order_id', '=', 'oi.order_id')
            ->select(
                'o.customer_email',
                DB::raw('SUM(oi.price * oi.quantity) as total_spent')
            )
            ->groupBy('o.customer_email')
            ->orderByDesc('total_spent')
            ->limit(10)
            ->get();

        return response()->json($topCustomers);
    }

}
