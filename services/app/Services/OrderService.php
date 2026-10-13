<?php

namespace App\Services;

use App\Helpers\Transaction;
use App\Helpers\Upload;
use App\Repositories\CartRepository;
use App\Repositories\OrderItemRepository;
use App\Repositories\OrderRepository;
use App\Repositories\PaymentRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderService
{
  protected $orderRepo;
  protected $orderItemRepo;
  protected $paymentRepo;
  protected $cartRepo;

  public function __construct()
  {
    $this->orderRepo = new OrderRepository();
    $this->orderItemRepo = new OrderItemRepository();
    $this->paymentRepo = new PaymentRepository();
    $this->cartRepo = new CartRepository();
  }

  public function allOrders($status = null)
  {
    return $this->orderRepo->all($status);
  }

  public function createOrder(
    int $userId, 
    array $cartIds, 
    bool $isReseller, 
    $shippingCost,
    $paymentProof
  )
  {
    $cartIds = array_values(array_unique($cartIds));

    if (empty($cartIds)) {
      throw new \Exception('Cart items are required', 422);
    }

    return DB::transaction(function () use ($userId, $cartIds, $isReseller, $shippingCost, $paymentProof) {
      $cartItems = $this->cartRepo->findByUserAndIds($userId, $cartIds, true);

      if ($cartItems->isEmpty()) {
        throw new \Exception('Cart items not found', 404);
      }

      if ($cartItems->count() !== count($cartIds)) {
        throw new \Exception('Some cart items are invalid', 422);
      }
      
      $totalQuantity = $cartItems->sum(function ($item) {
        return $item->quantity;
      });
      
      if ($isReseller === true && $totalQuantity < 5) {
        throw new \Exception('Reseller wajib membeli minimal 5 item', 400);
      }

      $totalAmount = $cartItems->sum(function ($item) use ($isReseller) {
        if ($item->productVariant) {
          if ($isReseller) {
            return $item->productVariant->reseller_price * $item->quantity;
          } else {
            return $item->productVariant->price * $item->quantity;
          }
        } else {
          if ($isReseller) {
            return $item->product->reseller_price * $item->quantity;
          } else {
            return $item->product->base_price * $item->quantity;
          }
        }
      });

      $order = $this->orderRepo->create([
        'transaction_id' => Transaction::generateCode(),
        'user_id' => $userId,
        'total_amount' => $totalAmount,
        'shipping_cost' => $shippingCost,
        'status' => 'pending',
        'is_reseller' => $isReseller,
      ]);

      $this->orderItemRepo->createMany(
        $cartItems->map(function ($cartItem) use ($isReseller, $order) {
          $product = $cartItem->product ?? optional($cartItem->productVariant)->product;
          $variant = $cartItem->productVariant;
          $price = $isReseller ? $product->reseller_price : $product->base_price;

          if ($variant) {
            $price = $isReseller ? $variant->reseller_price : $variant->price;
          }

          return [
            'order_id' => $order->id,
            'product_id' => $cartItem->product_id,
            'product_variant_id' => $cartItem->product_variant_id,
            'product_name' => $product?->name ?? 'Unknown Product',
            'variant_name' => $variant?->variant_code,
            'quantity' => $cartItem->quantity,
            'price' => $price,
            'subtotal' => $cartItem->price * $cartItem->quantity,
          ];
        })->toArray()
      );

      // Handle store payment proof to storage
      $paymentProofUrl = Upload::upload($paymentProof, 'payment_proofs');

      $this->paymentRepo->create([
        'user_id' => $userId,
        'order_id' => $order->id,
        'amount' => $totalAmount,
        'payment_proof' => $paymentProofUrl,
      ]);

      $this->cartRepo->removeByIds($cartIds, $userId);

      return $order->load(['items', 'payment']);
    });
  }

  public function getHistory()
  {
    $userId = auth()->id();
    return $this->orderRepo->findByUser($userId)->load(['items.productVariant.product', 'payment']);
  }

  public function getByTransactionId($transactionId)
  {
    $order = $this->orderRepo->findByTransactionId($transactionId);
    if (!$order) {
        return null;
    }
    return $order->load(['items.product', 'items.productVariant', 'payment', 'user']);
  }

  public function update($id, $data)
  {
    return $this->orderRepo->update($id, $data);
  }

  public function delete($id)
  {
    return $this->orderRepo->delete($id);
  }
}