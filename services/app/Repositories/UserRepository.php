<?php

namespace App\Repositories;

use App\Models\User;

class UserRepository
{
    protected $model;

    public function __construct()
    {
        $this->model = new User();
    }

    public function get()
    {
        return $this->model->all();
    }

    public function getById($id)
    {
        return $this->model->with('role')->find($id);
    }

    public function getByEmail($email)
    {
        return $this->model->with('role')->where('email', $email)->first();
    }

    public function verify(User $user)
    {
        if ($user->email_verified_at === null) {
            $user->email_verified_at = now();
            $user->save();
        }
        return $user;
    }

    public function isVerified(User $user)
    {
        return $user->email_verified_at !== null;
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        $user = $this->model->find($id);
        if ($user) {
            $user->update($data);
            return $user;
        }
        return null;
    }

    public function delete($id)
    {
        $user = $this->model->find($id);
        if ($user) {
            return $user->delete();
        }
        return false;
    }
}