<?php

namespace App\Repositories;

use App\Models\Category;

class CategoryRepository
{
    protected $model;

    public function __construct()
    {
        $this->model = new Category();
    }

    public function get()
    {
        // Eager load products, parent and children relationships for all categories
        return $this->model->with(['products', 'parent', 'children'])->get();
    }

    public function getById($id)
    {
        // Eager load products, parent and children relationships for a single category
        return $this->model->with(['products', 'parent', 'children'])->find($id);
    }

    public function getByParentId($parentId)
    {
        // Get categories by a specific parent id, including their products and children
        return $this->model->where('parent_id', $parentId)->with(['products', 'parent', 'children'])->get();
    }

    public function getRootCategories()
    {
        // Get categories with no parent, eager load their products, children, and parent
        return $this->model->whereNull('parent_id')->with(['products', 'parent', 'children'])->get();
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        $category = $this->model->find($id);
        if ($category) {
            $category->update($data);
            // Reload relationships after update
            return $category->fresh(['products', 'parent', 'children']);
        }
        return null;
    }

    public function delete($id)
    {
        $category = $this->model->find($id);
        if ($category) {
            return $category->delete();
        }
        return false;
    }
}
