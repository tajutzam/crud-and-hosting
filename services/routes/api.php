<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ShippingController;
use App\Http\Controllers\UserAddressController;
use App\Http\Controllers\ProductImageController;
use App\Http\Controllers\VerificationController;
use App\Http\Controllers\ProductVariantController;
use App\Http\Controllers\ProductVariantImageController;
use App\Http\Controllers\DashboardController;

// Auth Routes
Route::prefix('auth')->group(function() {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::get('verify', [VerificationController::class, 'verify'])->name('auth.verify');
    Route::get('user', [AuthController::class, 'user'])->middleware('auth:sanctum');
    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
});

// User Routes
Route::middleware('auth:sanctum')->group(function() {
    Route::prefix('user')->group(function() {
        Route::post('avatar', [AuthController::class, 'updateAvatar']);
        Route::apiResource('address', UserAddressController::class);
    });
});

// Product Routes
Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']);
    Route::get('{slug}', [ProductController::class, 'show']);
    // Product Variants by product_id
    Route::get('{slug}/variants', [ProductVariantController::class, 'byProduct']);
    Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
        Route::post('/', [ProductController::class, 'store']);
        Route::put('{slug}', [ProductController::class, 'update']);
        Route::delete('{slug}', [ProductController::class, 'destroy']);
        Route::post('{slug}/images', [ProductImageController::class, 'addImages']);
        Route::delete('{slug}/images/{id}', [ProductImageController::class, 'destroy']);
    });
});

// Product Variant Routes
Route::prefix('product-variants')->group(function () {
    Route::get('/', [ProductVariantController::class, 'index']);
    Route::get('{id}', [ProductVariantController::class, 'show']);
    Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
        Route::post('/', [ProductVariantController::class, 'store']);
        Route::put('{id}', [ProductVariantController::class, 'update']);
        Route::delete('{id}', [ProductVariantController::class, 'destroy']);
        Route::post('{id}/images', [ProductVariantImageController::class, 'addImages']);
    });
});

// Variant Images delete
Route::delete('product-variant-images/{id}', [ProductVariantImageController::class, 'destroy'])->middleware(['auth:sanctum', 'role:admin']);

// Category Routes
Route::get('categories', [CategoryController::class, 'index']);
Route::get('categories/{id}', [CategoryController::class, 'show']);
Route::get('categories/parent/{parentId}', [CategoryController::class, 'getByParentId']);
Route::get('categories-root', [CategoryController::class, 'root']);

Route::middleware('auth:sanctum')->group(function () {
    // Carts
    Route::post('carts/clear', [CartController::class, 'clear']);
    Route::apiResource('carts', CartController::class);
    
    // Orders
    Route::post('order', [OrderController::class, 'order']);
    Route::get('order/all', [OrderController::class, 'all'])->middleware('role:admin');
    Route::get('order', [OrderController::class, 'history']);
    Route::get('order/{transactionId}', [OrderController::class, 'show']);
    Route::put('order/{id}', [OrderController::class, 'update']);
    Route::delete('order/{id}', [OrderController::class, 'destroy'])->middleware('role:admin');

    // Shipping
    Route::prefix('shipping')->group(function () {
        Route::get('/provinces', [ShippingController::class, 'getProvinces']);
        Route::get('/city/{provinceId}', [ShippingController::class, 'getCities']);
        Route::get('/district/{cityId}', [ShippingController::class, 'getDistricts']);
        Route::get('/subdistrict/{subDistrictId}', [ShippingController::class, 'getSubDistricts']);
        Route::post('/cost', [ShippingController::class, 'calculateShipping']);
    });

    // Category & Dashboard Admin
    Route::middleware(['role:admin'])->group(function () {
        Route::get('dashboard/stats', [DashboardController::class, 'stats']);
        Route::post('categories', [CategoryController::class, 'store']);
        Route::put('categories/{id}', [CategoryController::class, 'update']);
        Route::delete('categories/{id}', [CategoryController::class, 'destroy']);
    });
});