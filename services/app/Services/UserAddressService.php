<?php

namespace App\Services;

use App\Repositories\UserAddressRepository;

class UserAddressService
{
    protected $userAddressRepository;

    public function __construct()
    {
        $this->userAddressRepository = new UserAddressRepository();
    }

    public function create(array $data)
    {
        return $this->userAddressRepository->create($data);
    }

    public function getById(int $id)
    {
        return $this->userAddressRepository->getById($id);
    }

    public function getByUserId(int $userId)
    {
        return $this->userAddressRepository->getByUserId($userId);
    }

    public function update(int $id, array $data)
    {
        return $this->userAddressRepository->update($id, $data);
    }

    public function delete(int $id)
    {
        return $this->userAddressRepository->delete($id);
    }
}