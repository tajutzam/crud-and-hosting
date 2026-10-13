<?php

namespace App\Http\Controllers;

use App\Services\RajaOngkirService;
use Illuminate\Http\Request;

class ShippingController
{
  protected $rajaOngkir;

  public function __construct(RajaOngkirService $rajaOngkir)
  {
    $this->rajaOngkir = $rajaOngkir;
  }

  public function getProvinces()
  {
    try {
      $provinces = $this->rajaOngkir->getProvinces();
      return response()->json([
        'success' => true,
        'data' => $provinces
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => $e->getMessage()
      ], 500);
    }
  }

  public function getCities(Request $request, int $provinceId)
  {
    try {
      $cities = $this->rajaOngkir->getCities($provinceId);
      return response()->json([
        'success' => true,
        'data' => $cities
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => $e->getMessage()
      ], 500);
    }
  }

  public function getDistricts(Request $request, $cityId)
  {
    try {
      $districts = $this->rajaOngkir->getDistricts($cityId);
      return response()->json([
        'success' => true,
        'data' => $districts
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => $e->getMessage()
      ], 500);
    }
  }

  public function getSubDistricts(Request $request, $subDistrictId)
  {
    try {
      $subDistricts = $this->rajaOngkir->getSubDistricts($subDistrictId);
      return response()->json([
        'success' => true,
        'data' => $subDistricts
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => $e->getMessage()
      ], 500);
    }
  }

  public function calculateShipping(Request $request)
  {
    $request->validate([
      'destination' => 'required|integer',
      'weight' => 'required|integer|min:1',
      'courier' => 'required|in:jne,pos,tiki'
    ]);

    try {
      $origin = config('services.rajaongkir.origin_city', 63);
      $cost = $this->rajaOngkir->getCost(
        $origin,
        $request->destination,
        $request->weight,
        $request->courier,
      );
      return response()->json([
        'success' => true,
        'data' => $cost
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => $e->getMessage()
      ], 500);
    }
  }
}