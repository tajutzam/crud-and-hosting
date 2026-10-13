<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['name', 'slug', 'category_id', 'description', 'base_price', 'reseller_price', 'status'];

    // ====== RELATION METHOD ======
    public function category() 
    {
        return $this->belongsTo(Category::class);
    }

    public function productImages()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function productVariants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function carts()
    {
        return $this->hasMany(Cart::class);
    }
}
