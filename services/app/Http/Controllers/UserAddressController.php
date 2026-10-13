<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateUserAddress;
use App\Http\Requests\UpdateUserAddress;
use App\Services\UserAddressService;

class UserAddressController
{
    protected $uAddressService;

    public function __construct(UserAddressService $uAddressService)
    {
        $this->uAddressService = $uAddressService;
    }

    public function index() {
      try {
        $address = $this->uAddressService->getByUserId(request()->user()->id);
        return response()->json([
          "message" => "User address fetched",
          "data" => $address,
        ]);
      } catch (\Throwable $th) {
        //throw $th;
        return response()->json(['message' => $th->getMessage()], 500);
      }
    }

    public function store(CreateUserAddress $request) {
      try {
        $data = [
          ...$request->validated(),
          "user_id" => request()->user()->id,
        ];
        $userAddress = $this->uAddressService->create($data);
        return response()->json([
          "message" => "User address created successfuly",
          "data" => $userAddress
        ]);
      } catch (\Throwable $th) {
        return response()->json(['message' => $th->getMessage()], 500);
      }
    }

    public function show($id) {
      try {
        $userAddress = $this->uAddressService->getById($id);
        if (!$userAddress) {
          return response()->json(['message' => 'User address not found'], 404);
        }
        // validate
        if ($userAddress->user_id !== request()->user()->id) {
          return response()->json(['message' => 'Unauthorized'], 403);
        }
        return response()->json([
          "message" => "User address fetched",
          "data" => $userAddress
        ]);
      } catch (\Throwable $th) {
        return response()->json(['message' => $th->getMessage()], 500);
      }
    }

    public function update(UpdateUserAddress $request, $id) {
      try {
        $userAddress = $this->uAddressService->getById($id);
        if (!$userAddress) {
          return response()->json(['message' => 'User address not found'], 404);
        }
        // Cek kepemilikan dulu
        if ($userAddress->user_id !== request()->user()->id) {
          return response()->json(['message' => 'Unauthorized'], 403);
        }
        $data = $request->validated();
        $updatedAddress = $this->uAddressService->update($id, $data);
        return response()->json([
          "message" => "User address updated successfully",
          "data" => $updatedAddress
        ]);
      } catch (\Throwable $th) {
        return response()->json(['message' => $th->getMessage()], 500);
      }
    }

    public function destroy($id) {
      try {
        $userAddress = $this->uAddressService->getById($id);
        if (!$userAddress) {
          return response()->json(['message' => 'User address not found'], 404);
        }
        // Hanya owner bisa hapus
        if ($userAddress->user_id !== request()->user()->id) {
          return response()->json(['message' => 'Unauthorized'], 403);
        }
        $this->uAddressService->delete($id);
        return response()->json([
          "message" => "User address deleted successfully"
        ]);
      } catch (\Throwable $th) {
        return response()->json(['message' => $th->getMessage()], 500);
      }
    }
}