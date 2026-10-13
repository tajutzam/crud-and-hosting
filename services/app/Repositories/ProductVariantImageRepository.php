<?php

namespace App\Repositories;

use App\Models\ProductVariantImage;

class ProductVariantImageRepository
{
  protected $model;

  public function __construct() {
    $this->model = new ProductVariantImage();
  }

  public function getById($id)
  {
    return $this->model->find($id);
  }

  public function getByVariantId($variantId)
  {
    return $this->model->where('product_variant_id', $variantId)->get();
  }

  public function addImages($variantId, array $images)
  {
    $data = [];
    foreach ($images as $imageUrl) {
      $data[] = [
        'product_variant_id' => $variantId,
        'image_url' => $imageUrl,
      ];
    }
    $this->model->insert($data);
    return $this->model->where('product_variant_id', $variantId)
      ->whereIn('image_url', $images)
      ->get();
  }

  public function delete($id)
  {
    $image = $this->model->find($id);
    if ($image) {
      $image->delete();
      return true;
    }
    return false;
  }

  public function deleteByVariantId($variantId)
  {
    return $this->model->where('product_variant_id', $variantId)->delete();
  }
}


