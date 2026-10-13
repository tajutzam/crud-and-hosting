<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserAddress extends Model
{
    protected $fillable = [
        'user_id',
        'recipient_name',
        'phone', 
        'label', 
        'address_line', 
        'province', 
        'city', 
        'district', 
        'sub_district', 
        'postal_code',
        'city_id',
    ];
}
