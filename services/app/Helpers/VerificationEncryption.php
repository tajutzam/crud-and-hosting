<?php

namespace App\Helpers;

use Carbon\Carbon;
use Illuminate\Support\Facades\Crypt;

class VerificationEncryption
{
    public static function encrypt($data)
    {
        $token = Crypt::encryptString(json_encode($data));
        $link = route('auth.verify', [
            'token' => urlencode($token),
        ]);
        return $link;
    }

    public static function decrypt($token)
    {
        $decrypted = Crypt::decryptString($token);
        $data = json_decode($decrypted, true);

        if (!isset($data['created_at'])) {
            throw new \Exception('Invalid token', 400);
        }

        $createdAt = Carbon::parse($data['created_at']);
        if ($createdAt->diffInMinutes(now()) > 60) {
            throw new \Exception('Token expired', 400);
        }

        return $data;
    }
}