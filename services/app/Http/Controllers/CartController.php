<?php

namespace App\Http\Controllers;

use App\Helpers\Response;
use App\Http\Requests\CreateCartRequest;
use App\Services\CartService;
use Illuminate\Http\Request;

class CartController extends Controller
{
    protected $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    public function index(Request $request)
    {
        $userId = $request->user()->id;
        $cart = $this->cartService->getUserCart($userId);
        return response()->json($cart);
    }

    public function store(CreateCartRequest $request)
    {
        $data = $request->validated();
        $data["user_id"] = auth()->user()->id;
        $cartItem = $this->cartService->addToCart($data);
        return Response::success('berhasil menambahkan keranjang', $cartItem);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => ['required', 'integer', 'min:1']
        ]);
        $cartItem = $this->cartService->updateCartQuantity($id, $request->input('quantity'));
        return response()->json($cartItem);
    }

    public function destroy($id)
    {
        $result = $this->cartService->removeFromCart($id);
        return response()->json(['success' => $result]);
    }

    public function clear(Request $request)
    {
        $userId = $request->user()->id;
        $result = $this->cartService->clearUserCart($userId);
        return response()->json(['success' => $result]);
    }

    public function show($id)
    {
        $cartItem = $this->cartService->getCartItem($id);
        if (!$cartItem) {
            return response()->json(['error' => 'Cart item not found'], 404);
        }
        return response()->json($cartItem);
    }
}