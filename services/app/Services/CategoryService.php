<?php

namespace App\Services;

use App\Repositories\CategoryRepository;

class CategoryService
{
    protected $categoryRepo;

    public function __construct()
    {
        $this->categoryRepo = new CategoryRepository();
    }

    public function get()
    {
        return $this->categoryRepo->get();
    }

    public function getById(int $id)
    {
        return $this->categoryRepo->getById($id);
    }

    public function getByParentId($parentId)
    {
        return $this->categoryRepo->getByParentId($parentId);
    }

    public function getRootCategories()
    {
        return $this->categoryRepo->getRootCategories();
    }

    public function create(array $data)
    {
        return $this->categoryRepo->create($data);
    }

    public function update($id, array $data)
    {
        $category = $this->categoryRepo->getById($id);
        if (!$category) {
            return null;
        }
        return $this->categoryRepo->update($id, $data);
    }

    public function delete($id)
    {
        $category = $this->categoryRepo->getById($id);
        if (!$category) {
            return false;
        }
        return $this->categoryRepo->delete($id);
    }

    public function getDescendantIds($id): array
    {
        $category = $this->categoryRepo->getById($id);
        if (!$category) {
            return [];
        }
        $ids = [];
        if ($category->children) {
            foreach ($category->children as $child) {
                $ids[] = $child->id;
                $ids = array_merge($ids, $this->getDescendantIds($child->id));
            }
        }
        return $ids;
    }
}

