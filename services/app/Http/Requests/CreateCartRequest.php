<?php

namespace App\Http\Requests;

class CreateCartRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_variant_id' => ['nullable', 'integer', 'exists:product_variants,id'],
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'price' => ['nullable', 'numeric', 'min:0'],
            // 'as_reseller' => ['required', 'boolean'], // Jika as_reseller = true, maka min pembelian adalah 5 dan menggunakan harga reseller (lebih murah)
        ];
    }
}
