<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\CategoryService;

class CategoryController extends Controller
{
  protected $categoryService;

  public function __construct()
  {
    $this->categoryService = new CategoryService();
  }

  public function index()
  {
    $categories = $this->categoryService->get();
    return response()->json($categories);
  }

  public function show($id)
  {
    $category = $this->categoryService->getById($id);
    if (!$category) {
        return response()->json(['message' => 'Category not found'], 404);
    }
    return response()->json($category);
  }

  public function store(Request $request)
  {
    $data = $request->validate([
        'name' => 'required|string|max:255',
        'parent_id' => 'nullable|integer|exists:categories,id',
    ]);

    $category = $this->categoryService->create($data);
    return response()->json($category, 201);
  }

  public function update(Request $request, $id)
  {
    $data = $request->validate([
        'name' => 'sometimes|required|string|max:255',
        'parent_id' => 'nullable|integer|exists:categories,id',
    ]);

    if (array_key_exists('parent_id', $data) && !empty($data['parent_id'])) {
        $parentId = (int) $data['parent_id'];
        if ($parentId === (int) $id) {
            return response()->json([
                'message' => 'Kategori tidak dapat menjadi induk bagi dirinya sendiri.'
            ], 422);
        }

        $descendantIds = $this->categoryService->getDescendantIds($id);
        if (in_array($parentId, $descendantIds, true)) {
            return response()->json([
                'message' => 'Kategori tidak dapat memilih subkategorinya sendiri sebagai induk.'
            ], 422);
        }
    }

    $category = $this->categoryService->update($id, $data);

    if (!$category) {
        return response()->json(['message' => 'Category not found'], 404);
    }

    return response()->json($category);
  }

  public function destroy($id)
  {
    $category = $this->categoryService->getById($id);
    if (!$category) {
        return response()->json(['message' => 'Category not found'], 404);
    }

    if ($category->products && $category->products->isNotEmpty()) {
        return response()->json([
            'message' => 'Kategori tidak dapat dihapus karena masih memiliki produk terkait.'
        ], 422);
    }

    $deleted = $this->categoryService->delete($id);
    if (!$deleted) {
        return response()->json(['message' => 'Category not found'], 404);
    }
    return response()->json(['message' => 'Category deleted successfully']);
  }

  public function getByParentId($parentId)
  {
    $categories = $this->categoryService->getByParentId($parentId);
    return response()->json($categories);
  }

  public function root()
  {
    $categories = $this->categoryService->getRootCategories();
    return response()->json($categories);
  }
}
