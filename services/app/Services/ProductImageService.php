<?php

namespace App\Services;

use App\Helpers\Upload;
use App\Repositories\ProductImageRepository;
use Illuminate\Support\Facades\Storage;

class ProductImageService
{
    protected $pImageRepo;

    public function __construct()
    {
        $this->pImageRepo = new ProductImageRepository();
    }

    public function addImages(array $data, $productId)
    {
        $imageUrls = [];
        foreach ($data as $image) {
          $imageUrls[] = Upload::upload($image, 'products');
        }
        return $this->pImageRepo->addImages($productId, $imageUrls);
    }

    public function delete($id)
    {
        $image = $this->pImageRepo->getById($id);
        if ($image) {
            Upload::delete($image->image_url);
            return $this->pImageRepo->delete($id);
        }
        return false;
    }

    public function deleteByProductId($productId)
    {
        $images = $this->pImageRepo->getByProductId($productId);
        foreach ($images as $image) {
            Upload::delete($image->image_url);
            $this->pImageRepo->delete($image->id);
        }
    }
}