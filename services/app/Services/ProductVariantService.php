<?php

namespace App\Services;

use App\Repositories\ProductVariantRepository;

class ProductVariantService
{
  protected $variantRepo;
  protected $productService;

  public function __construct() {
    $this->variantRepo = new ProductVariantRepository();
    $this->productService = new ProductService();
  }

  public function get()
  {
    return $this->variantRepo->get();
  }

  public function getById($id)
  {
    return $this->variantRepo->getById($id);
  }

  public function create(array $data)
  {
    return $this->variantRepo->create($data);
  }

  public function getByProductSlug($slug)
  {
    $product = $this->productService->getBySlug($slug);
    if (!$product) {
      return null;
    }
    return $this->variantRepo->getByProductId($product->id);
  }

  public function update($id, array $data)
  {
    return $this->variantRepo->update($id, $data);
  }

  public function delete($id)
  {
    return $this->variantRepo->delete($id);
  }
}


