<?php

namespace App\Repositories;

use App\Models\Cart;

class CartRepository
{
    public function findByUser($userId)
    {
        return Cart::with(['product.productImages', 'productVariant.productVariantImages'])
            ->where('user_id', $userId)
            ->orderByDesc('created_at')
            ->get();
    }

    public function add($data)
    {
        $existing = Cart::where('user_id', $data['user_id'])
            ->where('product_id', $data['product_id'])
            ->where('product_variant_id', $data['product_variant_id'] ?? null)
            ->first();

        if ($existing) {
            $existing->quantity += ($data['quantity'] ?? 1);
            $existing->save();
            return $existing->load(['product.productImages', 'productVariant.productVariantImages']);
        }

        $cart = Cart::create($data);
        return $cart->load(['product.productImages', 'productVariant.productVariantImages']);
    }

    public function updateQuantity($cartId, $quantity)
    {
        $cart = Cart::findOrFail($cartId);
        $cart->quantity = $quantity;
        $cart->save();
        return $cart;
    }

    public function remove($cartId)
    {
        return Cart::destroy($cartId);
    }

    public function removeByIds(array $cartIds, int $userId)
    {
        return Cart::where('user_id', $userId)->whereIn('id', $cartIds)->delete();
    }

    public function find($cartId)
    {
        return Cart::with(['productVariant.product'])->find($cartId);
    }

    public function clearByUser($userId)
    {
        return Cart::where('user_id', $userId)->delete();
    }

    public function findByUserAndIds(int $userId, array $cartIds, bool $lockForUpdate = false)
    {
        $query = Cart::with(['productVariant.product', 'product'])
            ->where('user_id', $userId)
            ->whereIn('id', $cartIds);

        if ($lockForUpdate) {
            $query->lockForUpdate();
        }

        return $query->get();
    }
}
