<?php

namespace App\Http\Controllers;

use App\Services\ProductImageService;
use App\Services\ProductService;
use Illuminate\Http\Request;

class ProductImageController
{
  protected $productService;
  protected $pImageService;
  
  public function __construct() {
    $this->productService = new ProductService();
    $this->pImageService = new ProductImageService();
  }

  public function addImages(Request $request, $slug) 
  {
    $images = $request->file('images', []);
    $product = $this->productService->getBySlug($slug);
    $this->pImageService->addImages($images, $product->id);
    return response()->json([
      'success' => true,
      'message' => 'Images uploaded successfully.'
    ]);
  }

  public function destroy($slug, $id)
  {
    try {
      $deleted = $this->pImageService->delete($id);
      if ($deleted) {
        return response()->json([
          'success' => true,
          'message' => 'Image deleted successfully.'
        ]);
      } else {
        return response()->json([
          'success' => false,
          'message' => 'Image not found or could not be deleted.'
        ], 404);
      }
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'An error occurred while deleting the image.',
        'error' => $e->getMessage()
      ], 500);
    }
  }
}