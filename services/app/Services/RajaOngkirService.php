<?php

namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Cache;

class RajaOngkirService
{
  protected $client;
  protected $apiKey;
  protected $baseUrl;

  public function __construct() {
    $this->client = new Client();
    $this->apiKey = config('services.rajaongkir.api_key');
    $this->baseUrl = config('services.rajaongkir.base_url');
  }

  /**
   * Get all provinces
   */
  public function getProvinces()
  {
    return Cache::remember('rajaongkir_provinces', 86400, function () {
      $response = $this->client->get($this->baseUrl . "/destination/province", [
        'headers' => [
          'key' => $this->apiKey
        ],
      ]);
      $data = json_decode($response->getBody(), true);
      return $data['data'];
    });
  }

  /**
   * Get cities by province
   */
  public function getCities($provinceId)
  {
    $cacheKey = "rajaongkir_cities_{$provinceId}";
    return Cache::remember($cacheKey, 86400, function () use ($provinceId) {
      $url = $this->baseUrl . '/destination/city/' . $provinceId;
      $params = ['headers' => ['key' => $this->apiKey]];

      $response = $this->client->get($url, $params);
      $data = json_decode($response->getBody(), true);
      return $data['data'];
    });
  }

  /**
   * Get districts by city
   */
  public function getDistricts($cityId)
  {
    $cacheKey = "rajaongkir_districts_{$cityId}";
    return Cache::remember($cacheKey, 86400, function () use ($cityId) {
      $url = $this->baseUrl . '/destination/district/' . $cityId;
      $params = ['headers' => ['key' => $this->apiKey]];
      $response = $this->client->get($url, $params);
      $data = json_decode($response->getBody(), true);
      return $data['data'];
    });
  }

  /**
   * Get subdistricts by district
   */
  public function getSubDistricts($districtId)
  {
    $cacheKey = "rajaongkir_subdistricts_{$districtId}";
    return Cache::remember($cacheKey, 86400, function () use ($districtId) {
      $url = $this->baseUrl . '/destination/sub-district/' . $districtId;
      $params = ['headers' => ['key' => $this->apiKey]];
      $response = $this->client->get($url, $params);
      $data = json_decode($response->getBody(), true);
      return $data['data'];
    });
  }

  /**
   * Calculate shipping cost
   */
  public function getCost($origin, $destination, $weight, $courier)
  {
    $response = $this->client->post($this->baseUrl . '/calculate/domestic-cost', [
      'headers' => [
        'key' => $this->apiKey,
        'content-type' => 'application/x-www-form-urlencoded'
      ],
      'form_params' => [
        'origin' => $origin,           // ID kota asal
        'destination' => $destination, // ID kota tujuan
        'weight' => $weight,           // dalam gram
        'courier' => $courier          // jne, pos, tiki
      ],
    ]);

    $data = json_decode($response->getBody(), true);
    return $data['data'];
  }
}