<?php

namespace App\Services;

use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class MailService
{
    public function send(string $to, Mailable $mailable): bool
    {
        try {
            Mail::to($to)->send($mailable);
            return true;
        } catch (\Exception $e) {
            Log::error('Mail sending failed: ' . $e->getMessage(), ['exception' => $e]);
            return false;
        }
    }
}