<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order_Item extends Model
{
    protected $table = 'tbl_order_items';
    protected $primaryKey = 'id';
    public $timestamps = true;

    protected $fillable = [
        'order_id',
        'item_id',
        'item_name',
        'quantity',
        'price',
        'total_price',
        'original_price',
        'discount_percent',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'original_price' => 'decimal:2',
        'discount_percent' => 'integer',
        'quantity' => 'integer',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id', 'order_id');
    }

    public function item()
    {
        return $this->belongsTo(Item::class, 'item_id', 'item_id');
    }

    public function getLineTotalAttribute()
    {
        return $this->price * $this->quantity;
    }

    public function getSavingsAttribute()
    {
        if ($this->discount_percent > 0 && $this->original_price) {
            return ($this->original_price - $this->price) * $this->quantity;
        }
        return 0;
    }
}
