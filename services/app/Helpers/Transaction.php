<?php

namespace App\Helpers;

class Transaction
{
  public static function generateCode(): string 
  {
    $random = substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 4);
    $now = date('dmyHis'); // DDMMYYhhmmss
    return $random . $now;
  }
}