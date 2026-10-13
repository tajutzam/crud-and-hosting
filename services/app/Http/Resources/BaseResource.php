<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BaseResource extends JsonResource
{
    public bool $success = true;
    public string $message = 'Success';

    public function with($request)
    {
        return [
            'success' => $this->success,
            'message' => $this->message
        ];
    }
}
