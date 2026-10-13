<?php

namespace App\Helpers;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class Upload
{
    public static function upload(UploadedFile $file, string $directory = 'uploads', string $disk = 'public')
    {
        $path = $file->store($directory, $disk);
        return Storage::url($path);
    }

    public static function delete(string $url, string $disk = 'public')
    {
        $parsed = parse_url($url, PHP_URL_PATH);
        $storagePath = ltrim($parsed, '/storage/');
        if (Storage::disk($disk)->exists($storagePath)) {
            return Storage::disk($disk)->delete($storagePath);
        }
        return false;
    }
}