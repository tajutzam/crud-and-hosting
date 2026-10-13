<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class UpdateProductVariantRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_id'   => 'nullable|exists:products,id',
            'variant_code' => ['nullable', 'string', 'max:255', Rule::unique('product_variants', 'variant_code')->ignore(request()->route('id'))],
            'color'        => 'nullable|string|max:255',
            'size'         => 'nullable|string|max:255',
            'reseller_size'=> 'nullable|string|max:255',
            'price'        => 'nullable|integer|min:0',
            'stock'        => 'nullable|integer|min:0',
        ];
    }
}


