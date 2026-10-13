<?php

namespace App\Repositories;

use App\Models\ProductVariant;

class ProductVariantRepository
{
  protected $model;

  public function __construct() {
    $this->model = new ProductVariant();
  }

  public function get()
  {
    return $this->model->with('product')->get();
  }

  public function getById($id)
  {
    return $this->model->with('product')->find($id);
  }

  public function create(array $data)
  {
    return $this->model->create($data);
  }

  public function getByProductId($productId)
  {
    return $this->model->where('product_id', $productId)->get();
  }

  public function update($id, array $data)
  {
    $variant = $this->model->find($id);
    if ($variant) {
      $variant->update($data);
      return $variant;
    }
    return null;
  }

  public function delete($id)
  {
    $variant = $this->model->find($id);
    if ($variant) {
      return $variant->delete();
    }
    return false;
  }
}


