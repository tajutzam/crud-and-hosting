<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateProductVariantRequest;
use App\Http\Requests\UpdateProductVariantRequest;
use App\Services\ProductVariantService;

class ProductVariantController extends Controller
{
    protected $service;

    public function __construct() {
        $this->service = new ProductVariantService();
    }

    public function index()
    {
        return response()->json($this->service->get());
    }

    public function show($id)
    {
        $variant = $this->service->getById($id);
        if (!$variant) return response()->json(['message' => 'Not found'], 404);
        return response()->json($variant);
    }

    public function store(CreateProductVariantRequest $request)
    {
        $data = $request->validated();
        $variant = $this->service->create($data);
        return response()->json($variant, 201);
    }

    public function byProduct($slug)
    {
        return response()->json($this->service->getByProductSlug($slug));
    }

    public function update(UpdateProductVariantRequest $request, $id)
    {
        $variant = $this->service->update($id, $request->validated());
        if (!$variant) return response()->json(['message' => 'Not found'], 404);
        return response()->json($variant);
    }

    public function destroy($id)
    {
        $deleted = $this->service->delete($id);
        if (!$deleted) return response()->json(['message' => 'Not found'], 404);
        return response()->json(['message' => 'Deleted']);
    }
}


