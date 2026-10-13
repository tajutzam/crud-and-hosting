<?php

namespace App\Repositories;

use App\Models\Order;

class OrderRepository
{
  public function create($data)
  {
    return Order::create($data);
  }

  public function findByUser($userId)
  {
    return Order::where('user_id', $userId)
      ->orderBy('created_at', 'desc')
      ->get();
  }

  public function all($status = null)
  {
    $query = Order::with(['user', 'payment', 'items.product'])->orderBy('created_at', 'desc');
    if ($status && $status !== 'semua' && $status !== 'all') {
      $query->where('status', $status);
    }
    return $query->get();
  }

  public function find($orderId)
  {
    return Order::find($orderId);
  }

  public function findByTransactionId($transactionId)
  {
    return Order::where('transaction_id', $transactionId)->first();
  }

  public function update($orderId, $data)
  {
    $order = Order::findOrFail($orderId);
    $order->update($data);
    return $order->load(['user', 'payment', 'items.product']);
  }

  public function delete($orderId)
  {
    $order = Order::findOrFail($orderId);
    if ($order->payment) {
      if ($order->payment->payment_proof) {
        \App\Helpers\Upload::delete($order->payment->payment_proof);
      }
      $order->payment->delete();
    }
    $order->items()->delete();
    return $order->delete();
  }
}