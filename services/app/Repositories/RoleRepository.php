<?php

namespace App\Repositories;

use App\Models\Role;

class RoleRepository
{
    protected $model;

    public function __construct() {
        $this->model = new Role();
    }

    public function getById($id)
    {
        return $this->model->find($id);
    }

    public function getBySlug($slug)
    {
        return $this->model->where('slug', $slug)->first();
    }
}