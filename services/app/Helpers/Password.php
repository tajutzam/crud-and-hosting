<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Hash;

class Password
{
    public static function hash($password)
    {
        return Hash::make($password);
    }

    public static function check($password, $hash)
    {
        return Hash::check($password, $hash);
    }
}



