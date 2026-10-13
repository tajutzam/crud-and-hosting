<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats()
    {
        $totalProducts = Product::count();
        $publishedProducts = Product::where('status', 'publish')->count();
        $hiddenProducts = Product::where('status', 'hide')->count();
        $totalCategories = Category::count();
        $totalOrders = Order::count();
        $totalRevenue = (int) Order::whereIn('status', ['completed', 'processing'])->sum('total_amount');
        $pendingOrders = Order::where('status', 'pending')->count();
        $totalCustomers = User::whereHas('role', function ($query) {
            $query->where('name', 'user');
        })->count();

        $recentProducts = Product::with(['category', 'productImages'])
            ->latest()
            ->take(5)
            ->get();

        $recentOrders = Order::with('user')
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'stats' => [
                'total_products' => $totalProducts,
                'published_products' => $publishedProducts,
                'hidden_products' => $hiddenProducts,
                'total_categories' => $totalCategories,
                'total_orders' => $totalOrders,
                'pending_orders' => $pendingOrders,
                'total_revenue' => $totalRevenue,
                'total_customers' => $totalCustomers ?: User::count(),
            ],
            'recent_products' => $recentProducts,
            'recent_orders' => $recentOrders,
        ]);
    }
}
