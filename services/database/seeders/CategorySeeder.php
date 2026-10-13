<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        DB::table('categories')->insert([
            ['name' => 'Elektronik', 'parent_id' => null],
            ['name' => 'Handphone', 'parent_id' => 1],
            ['name' => 'Laptop', 'parent_id' => 1],
            ['name' => 'Fashion', 'parent_id' => null],
            ['name' => 'Pria', 'parent_id' => 4],
            ['name' => 'Wanita', 'parent_id' => 4],
            ['name' => 'Rumah Tangga', 'parent_id' => null],
        ]);
    }
}
