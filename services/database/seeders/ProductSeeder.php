<?php

namespace Database\Seeders;

use App\Helpers\Slug;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // ====== PRODUCT ======
        $products = [
            [
                'name' => 'Thinking, Fast and Slow',
                'slug' => Slug::generate('Thinking, Fast and Slow'), 
                'category_id' => 1, 
                'description' => 'Learn how to thing', 
                'base_price' => 159000, 
                'reseller_price' => 140000,
                'status' => 'publish'
            ],
            [
                'name' => 'Surrounded by Idiots', 
                'slug' => Slug::generate('Surrounded by Idiots'),
                'category_id' => 3, 
                'description' => 'Learn how to be an idiots', 
                'base_price' => 140000, 
                'reseller_price' => 159000,
                'status' => 'publish'
            ],
            [
                'name' => 'How to Win Friends and Influence People', 
                'slug' => Slug::generate('How to Win Friends and Influence People'),
                'category_id' => 2, 
                'description' => 'Learn how to Win', 
                'base_price' => 138000, 
                'reseller_price' => 128000,
                'status' => 'hide'
            ],
        ];

        DB::table('products')->insert($products);

        // ====== PRODUCT VARIANTS ======
        $productVariants = [
            [
                'product_id' => 2, 
                'variant_code' => 'TFS01', 
                'color' => 'white', 
                'size' => 'XL', 
                'price' => 132000, 
                'reseller_price' => 128000,
                'stock' => 100,
            ],
        ];
        DB::table('product_variants')->insert($productVariants);
    }
}
