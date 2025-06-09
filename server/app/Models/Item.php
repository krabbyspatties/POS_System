<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Item extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'tbl_items';
    protected $primaryKey = 'item_id';

    protected $fillable = [
        'item_name',
        'item_description',
        'item_price',
        'item_discount',
        'item_quantity',
        'item_image',
        'stock_level',
        'category_id',
        'is_deleted',
    ];

    public function getIdAttribute()
    {
        return $this->item_id;
    }

    public function getNameAttribute()
    {
        return $this->item_name;
    }

    public function getStockAttribute()
    {
        return $this->item_quantity;
    }

    public function getCostPriceAttribute()
    {
        return $this->item_price;
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Item_Category::class, 'category_id', 'category_id');
    }
}
