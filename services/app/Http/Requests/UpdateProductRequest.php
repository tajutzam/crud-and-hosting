<?php

namespace App\Http\Requests;

class UpdateProductRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'nullable|string|max:255',
            'slug' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'base_price' => 'nullable|integer|min:0',
            'reseller_price' => 'nullable|integer|min:0',
            'status' => 'nullable|in:publish,hide',
            'images' => 'nullable|array',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:4096',
        ];
    }
}
