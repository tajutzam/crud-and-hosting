<?php

namespace App\Http\Controllers;

use App\Helpers\Response;
use App\Http\Requests\CreateOrderRequest;
use App\Services\OrderService;
use Illuminate\Http\Request;

class OrderController
{
  protected $orderService;

  public function __construct() {
    $this->orderService = new OrderService();
  }

  public function all(Request $request)
  {
    try {
      $status = $request->query('status');
      $orders = $this->orderService->allOrders($status);

      return response()->json([
        'message' => 'Orders retrieved successfully',
        'orders' => $orders,
      ]);
    } catch (\Exception $e) {
      $statusCode = $e->getCode();
      if (!is_int($statusCode) || $statusCode < 400 || $statusCode > 599) {
        $statusCode = 500;
      }

      return response()->json([
        'error' => $e->getMessage()
      ], $statusCode);
    }
  }

  public function show($transactionId)
  {
    $order = $this->orderService->getByTransactionId($transactionId);
    return Response::success("Get order by TransactionId", $order);
  }

  public function order(CreateOrderRequest $request)
  {
    try {
      $paymentProof = $request->file('payment_proof');
      $userId = $request->user()->id;
      $order = $this->orderService->createOrder(
        $userId,
        $request->input('cart_ids', []),
        $request->input('is_reseller'),
        $request->input('shipping_cost'),
        $paymentProof,
      );

      return response()->json([
        'order' => $order,
        'message' => 'Order created successfully',
      ], 201);
    } catch (\Exception $e) {
      $statusCode = $e->getCode();
      if (!is_int($statusCode) || $statusCode < 400 || $statusCode > 599) {
        $statusCode = 500;
      }

      return response()->json([
        'error' => $e->getMessage()
      ], $statusCode);
    }
  }

  public function history()
  {
    try {
      $orders = $this->orderService->getHistory();
      return response()->json([
        'orders' => $orders,
        'message' => 'Order history retrieved successfully',
      ]);
    } catch (\Exception $e) {
      $statusCode = $e->getCode();
      return response()->json([
        'error' => $e->getMessage()
      ], $statusCode);
    }
  }

  public function update(Request $request, $id)
  {
    try {
      $data = $request->all();
      $order = $this->orderService->update($id, $data);

      return response()->json([
        'order' => $order,
        'message' => 'Order updated successfully',
      ]);
    } catch (\Exception $e) {
      $statusCode = $e->getCode();
      if (!is_int($statusCode) || $statusCode < 400 || $statusCode > 599) {
        $statusCode = 500;
      }

      return response()->json([
        'error' => $e->getMessage()
      ], $statusCode);
    }
  }

  public function destroy($id)
  {
    try {
      $this->orderService->delete($id);

      return response()->json([
        'message' => 'Order deleted successfully',
      ]);
    } catch (\Exception $e) {
      $statusCode = $e->getCode();
      if (!is_int($statusCode) || $statusCode < 400 || $statusCode > 599) {
        $statusCode = 500;
      }

      return response()->json([
        'error' => $e->getMessage()
      ], $statusCode);
    }
  }
}