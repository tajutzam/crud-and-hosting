<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class ProductResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug, 
            'category_id' => $this->category_id,  
            'description' => $this->description,  
            'base_price' => $this->base_price,  
            'reseller_price' => $this->reseller_price,  
            'status' => $this->status,
        ];
    }
}
