<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserAddress extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'recipient_name' => 'string|max:255',
            'phone' => 'string|max:20',
            'label' => 'string|max:255',
            'address_line' => 'string|max:255',
            'city' => 'string|max:100',
            'city_id' => 'integer',
            'province' => 'string|max:100',
            'district' => 'string|max:100',
            'sub_district' => 'string|max:100',
            'postal_code' => 'integer',
        ];
    }
}
