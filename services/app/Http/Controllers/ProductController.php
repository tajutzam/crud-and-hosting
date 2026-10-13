<?php

namespace App\Http\Controllers;

use App\Helpers\Slug;
use App\Http\Requests\CreateProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    protected $productService;

    public function __construct() {
        $this->productService = new ProductService();
    }

    public function index(Request $request)
    {
        $categoryId = $request->query('category_id');
        $status = $request->query('status');
        $products = $this->productService->get([
            'category_id' => $categoryId,
            'status' => $status
        ]);
        return response()->json($products);
    }

    public function show($slug)
    {
        $product = $this->productService->getBySlug($slug);
        if (!$product) return response()->json(['message' => 'Not found'], 404);
        return response()->json($product);
    }

    public function store(CreateProductRequest $request)
    {
        $validated = $request->validated();
        $slug = !empty($validated['slug'])
            ? Slug::generateUnique($validated['slug'], Product::class)
            : Slug::generateUnique($validated['name'], Product::class);

        $data = [
            ...$validated,
            'slug' => $slug,
            'images' => $request->file('images', []),
        ];
        $product = $this->productService->create($data);
        
        return response()->json($product, 201);
    }

    public function update(UpdateProductRequest $request, $slug)
    {
        $validated = $request->validated();
        $product = $this->productService->update($slug, $validated, $request);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        return response()->json($product);
    }

    public function destroy($slug)
    {
        $deleted = $this->productService->delete($slug);
        if (!$deleted) return response()->json(['message' => 'Not found'], 404);
        return response()->json(['message' => 'Deleted']);
    }
}