<?php

namespace App\Services;

use App\Repositories\RoleRepository;

class RoleService
{
    protected $roleRepo;

    public function __construct() {
        $this->roleRepo = new RoleRepository();
    }

    public function getById($id)
    {
        return $this->roleRepo->getById($id);
    }

    public function getBySlug($slug)
    {
        return $this->roleRepo->getBySlug($slug);
    }
}