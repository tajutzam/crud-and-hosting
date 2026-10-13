<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateUserAddress extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'recipient_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'label' => 'required|string|max:255',
            'address_line' => 'required|string|max:255',
            'province' => 'required|string|max:100',
            'city' => 'required|string|max:100',
            'city_id' => 'required|integer',
            'district' => 'required|string|max:100',
            'sub_district' => 'required|string|max:100',
            'postal_code' => 'required|integer',
        ];
    }
}
