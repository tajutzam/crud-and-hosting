<?php
namespace App\Repositories\Interfaces;
interface IProductRepository
{
  /**
   * Mengambil semua data produk.
   * @return \Illuminate\Database\Eloquent\Collection
   */
  public function getAllProducts();


  /**
   * Mencari produk berdasarkan ID.
   * @param int $productId
   * @return \App\Models\Product|null
   */
  public function findProductById(int $productId);
}
