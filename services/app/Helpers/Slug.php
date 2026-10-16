<?php

namespace App\Helpers;

use Illuminate\Support\Str;

class Slug
{
  public static function generate(string $text): string 
  {
    return Str::slug($text);
  }

  public static function generateUnique(string $text, string $modelClass, string $column = 'slug', $ignoreId = null): string
  {
    $baseSlug = Str::slug($text);
    if (empty($baseSlug)) {
      $baseSlug = 'item';
    }
    $slug = $baseSlug;
    $count = 1;

    while ($modelClass::where($column, $slug)
      ->when($ignoreId, function ($query) use ($ignoreId) {
        return $query->where('id', '!=', $ignoreId);
      })->exists()) {
      $slug = "{$baseSlug}-{$count}";
      $count++;
    }

    return $slug;
  }
}
