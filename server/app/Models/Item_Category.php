<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Item_Category extends Model
{
    use HasFactory, Notifiable;
    protected $table = 'tbl_item_category';
    protected $primaryKey = 'category_id';
    protected $fillable = [
        'category_name',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(Item::class, 'category_id', 'category_id');
    }
}
