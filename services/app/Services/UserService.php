<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Storage;

class UserService
{
    protected $userRepo;
    
    public function __construct() {
        $this->userRepo = new UserRepository();
    }

    public function getById(int $id)
    {
        return $this->userRepo->getById($id);
    }

    public function verifyEmail(array $data)
    {
        $user = $this->userRepo->getById($data['id']);
        if (!$user) {
            throw new \Exception('User not found', 404);
        }
        if ($user->email_verified_at) {
            throw new \Exception('Email already verified',  200);
        }
        $this->userRepo->verify($user);
        return $user;
    }

    public function updateAvatar($userId, $avatarFile)
    {
        $user = $this->userRepo->getById($userId);
        if (!$user) {
            throw new \Exception('User not found', 404);
        }

        $path = $avatarFile->store('avatars', 'public');
        if (!$path) {
            throw new \Exception('Failed to upload avatar', 500);
        }

        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        $data = ['avatar' => $path];
        $updatedUser = $this->userRepo->update($userId, $data);

        return $updatedUser;
    }
}