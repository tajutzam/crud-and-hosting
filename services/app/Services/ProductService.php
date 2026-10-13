<?php

namespace App\Services;

use App\Helpers\Slug;
use App\Models\Product;
use App\Repositories\ProductImageRepository;
use App\Repositories\ProductRepository;

class ProductService
{
  protected $productRepo;
  protected $pImageService;
  
  public function __construct() {
    $this->productRepo = new ProductRepository();
    $this->pImageService = new ProductImageService();
  }

  public function get(array $filters = [])
  {
    return $this->productRepo->get($filters);
  }

  public function getBySlug(string $slug)
  {
    return $this->productRepo->getBySlug($slug);
  }

  public function create(array $data)
  {
    $newProduct = $this->productRepo->create($data);
    $images = $data['images'] ?? [];

    if (!empty($images)) {
      $this->pImageService->addImages($images, $newProduct->id);
    }

    return $newProduct->load(['category', 'productImages']);
  }

  public function update($slug, array $data, $request = null)
  {
    $product = Product::where('slug', $slug)->first();
    if (!$product) {
      return null;
    }

    // Handle slug adjustment if name is updated without explicit slug or if slug changed
    if (isset($data['name']) && empty($data['slug'])) {
      $data['slug'] = Slug::generateUnique($data['name'], Product::class, 'slug', $product->id);
    } elseif (!empty($data['slug']) && $data['slug'] !== $product->slug) {
      $data['slug'] = Slug::generateUnique($data['slug'], Product::class, 'slug', $product->id);
    }

    // Update text data
    $product->update($data);

    // Cek apakah ada file images baru yang diunggah
    if ($request && $request->hasFile('images')) {
      // Hapus relasi dan file gambar lama
      $this->pImageService->deleteByProductId($product->id);

      // Simpan file gambar baru menggunakan pImageService agar format URL konsisten
      $files = $request->file('images');
      if (!is_array($files)) {
        $files = [$files];
      }
      $this->pImageService->addImages($files, $product->id);
    }

    return $product->fresh(['category', 'productImages']);
  }

  public function delete($slug)
  {
    $product = $this->productRepo->getBySlug($slug);
    if (!$product) {
      return false;
    }

    // Hapus file fisik gambar terlebih dahulu sebelum menghapus data produk di database
    $this->pImageService->deleteByProductId($product->id);
    $this->productRepo->delete($slug);

    return true;
  }
}