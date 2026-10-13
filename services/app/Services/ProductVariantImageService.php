<?php

namespace App\Services;

use App\Helpers\Upload;
use App\Repositories\ProductVariantImageRepository;

class ProductVariantImageService
{
    protected $repo;

    public function __construct()
    {
        $this->repo = new ProductVariantImageRepository();
    }

    public function addImages(array $files, $variantId)
    {
        $imageUrls = [];
        foreach ($files as $file) {
            $imageUrls[] = Upload::upload($file, 'product-variants');
        }
        return $this->repo->addImages($variantId, $imageUrls);
    }

    public function delete($id)
    {
        $image = $this->repo->getById($id);
        if ($image) {
            Upload::delete($image->image_url);
            return $this->repo->delete($id);
        }
        return false;
    }

    public function deleteByVariantId($variantId)
    {
        $images = $this->repo->getByVariantId($variantId);
        foreach ($images as $image) {
            Upload::delete($image->image_url);
            $this->repo->delete($image->id);
        }
    }
}


