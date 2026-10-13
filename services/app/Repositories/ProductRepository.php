<?php

namespace App\Repositories;

use App\Models\Product;

class ProductRepository
{
  protected $model;

  public function __construct() {
    $this->model = new Product();
  }

  public function get(array $filters = [])
  {
    $query = $this->model->with(['category', 'productImages']);

    if (!empty($filters['category_id'])) {
      $query = $query->where('category_id', $filters['category_id']);
    }
    
    if (!empty($filters['status'])) {
      $query = $query->where('status', $filters['status']);
    }

    return $query->get();
  }

  public function getById($id)
  {
    return $this->model->with(['category', 'productImages', 'productVariants.productVariantImages'])->find($id);
  }

  public function getBySlug(string $slug)
  {
    return $this->model->with(['category', 'productImages', 'productVariants.productVariantImages'])->firstWhere('slug', $slug);
  }

  public function create(array $data)
  {
    return $this->model->create($data);
  }

  public function update($slug, array $data)
  {
    $product = $this->model->firstWhere('slug', $slug);
    if ($product) {
        $product->update($data);
        return $product;
    }
    return null;
  }

  public function delete($slug)
  {
    $product = $this->model->firstWhere('slug', $slug);
    if ($product) {
        return $product->delete();
    }
    return false;
  }
}