<?php

namespace App\Http\Controllers;

use App\Services\ProductVariantImageService;
use Illuminate\Http\Request;

class ProductVariantImageController extends Controller
{
    protected $service;

    public function __construct() {
        $this->service = new ProductVariantImageService();
    }

    public function addImages(Request $request, $id)
    {
        $request->validate([
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $files = $request->file('images', []);
        $images = $this->service->addImages($files, $id);
        return response()->json($images, 201);
    }

    public function destroy($id)
    {
        $deleted = $this->service->delete($id);
        if (!$deleted) return response()->json(['message' => 'Not found'], 404);
        return response()->json(['message' => 'Deleted']);
    }
}


