<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;

Route::get('/', function () {
    return response()->json(["message" => "hello there"]);
});

Route::resource('products', ProductController::class);
