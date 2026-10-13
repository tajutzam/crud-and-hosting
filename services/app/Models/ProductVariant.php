<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    protected $fillable = [
        'product_id', 'variant_code', 'color', 'size', 'price', 'stock', 'reseller_price'
    ];

    // ====== RELATION METHOD ======
    public function product() 
    {
        return $this->belongsTo(Product::class);
    }

    public function productVariantImages()
    {
        return $this->hasMany(related: ProductVariantImage::class);
    }

    public function carts()
    {
        return $this->hasMany(Cart::class);
    }
}
