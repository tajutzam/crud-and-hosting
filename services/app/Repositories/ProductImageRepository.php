<?php

namespace App\Repositories;

use App\Models\ProductImage;

class ProductImageRepository
{
  protected $model;

  public function __construct() {
    $this->model = new ProductImage();
  }

  public function getById($id)
  {
    return $this->model->find($id);
  }

  public function getByIds(array $ids)
  {
    return $this->model->whereIn('id', $ids)->get();
  }

  public function getByProductId($productId)
  {
    return $this->model->where('product_id', $productId)->get();
  }
  
  public function addImages($productId, array $images)
  {
    $data = [];
    foreach ($images as $imageUrl) {
      $data[] = [
        'product_id' => $productId,
        'image_url' => $imageUrl,
      ];
    }
    $this->model->insert($data);
    return $this->model->where('product_id', $productId)
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

  public function deleteByProductId($productId)
  {
    return $this->model->where('product_id', $productId)->delete();
  }

  public function deleteImages(array $imageIds)
  {
    return $this->model->whereIn('id', $imageIds)->delete();
  }
}