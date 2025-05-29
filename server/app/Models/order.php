<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $table = 'tbl_orders';
    protected $primaryKey = 'order_id';
    public $timestamps = true;

    protected $fillable = [
        'customer_email',
    ];

    public function items()
    {
        return $this->belongsToMany(Item::class, 'tbl_order_items', 'order_id', 'item_id')
            ->withPivot('quantity', 'price')
            ->withTimestamps();
    }
}
