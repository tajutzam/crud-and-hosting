<?php

namespace App\Repositories;

use App\Models\UserAddress;

class UserAddressRepository
{
    protected $model;

    public function __construct()
    {
        $this->model = new UserAddress();
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function getById(int $id)
    {
        return $this->model->find($id);
    }

    public function getByUserId(int $userId)
    {
        return $this->model->where('user_id', $userId)->get();
    }

    public function update(int $id, array $data)
    {
        $address = $this->model->find($id);

        if ($address) {
            $address->update($data);
        }

        return $address;
    }

    public function delete(int $id)
    {
        $address = $this->model->find($id);

        if ($address) {
            return $address->delete();
        }

        return false;
    }
}