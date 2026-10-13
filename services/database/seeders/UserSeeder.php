<?php

namespace Database\Seeders;

use App\Models\User;
use App\Services\RoleService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    protected $roleService;

    public function __construct() {
        $this->roleService = new RoleService();
    }
    
    public function run(): void
    {
        $data = [
            [
                "name" => "Putra Setyonugroho",
                "email" => "putra@gmail.com",
                "password" => "putra123",
                "role" => "admin",
            ],
            [
                "name" => "Febryana Zumal",
                "email" => "zumal@gmail.com",
                "password" => "zumal123",
                "role" => "customer",
            ],
            [
                "name" => "Anonymous",
                "email" => "anon@gmail.com",
                "password" => "anon123",
                "role" => "customer",
            ],
        ];

        foreach ($data as $user) {
            $role = $this->roleService->getBySlug($user["role"]);
            $newUser = User::create([
                "name" => $user["name"],
                "email" => $user["email"],
                "password" => Hash::make($user["password"]),
                "role_id" => $role->id,
                "email_verified_at" => now(),
            ]);
        }
    }
}
