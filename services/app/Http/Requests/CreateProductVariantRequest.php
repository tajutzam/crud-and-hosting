<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class CreateProductVariantRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_id'   => 'required|exists:products,id',
            'variant_code' => ['required', 'string', 'max:255', 'unique:product_variants,variant_code'],
            'color'        => 'required|string|max:255',
            'size'         => 'required|string|max:255',
            'reseller_price'=> 'required|integer|min:0',
            'price'        => 'required|integer|min:0',
            'stock'        => 'required|integer|min:0',
        ];
    }
}


