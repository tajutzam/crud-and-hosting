import { useState, useEffect } from 'react';
import categoryService from '../../services/categoryService';
import AddButton from '../../components/admin/AddButton';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import CategoryForm from '../../components/admin/CategoryForm';
import Loading from '../../components/Loading';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoryService.getAllCategories();
      setCategories(Array.isArray(data) ? data : data.categories || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = () => {
    setEditingCategory(null);
    setError(null);
    setShowModal(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setError(null);
    setShowModal(true);
  };

  const handleDelete = async (category) => {
    if (!window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
      return;
    }

    try {
      setError(null);
      await categoryService.deleteCategory(category.id);
      await fetchCategories();
    } catch (err) {
      setError(err.message || 'Failed to delete category');
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setFormLoading(true);
      setError(null);

      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, formData);
      } else {
        await categoryService.createCategory(formData);
      }

      setShowModal(false);
      setEditingCategory(null);
      await fetchCategories();
    } catch (err) {
      setError(err.message || 'Failed to save category');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCloseModal = () => {
    if (!formLoading) {
      setShowModal(false);
      setEditingCategory(null);
      setError(null);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Categories</h4>
        <AddButton onClick={handleAdd} label="Tambah Category" />
      </div>

      {error && !showModal && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Parent</th>
              <th scope="col">Children</th>
              <th scope="col" className="text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((row, rowIndex) => (
              <tr key={row.id || rowIndex}>
                <td>{row.name}</td>
                <td>{row.parent ? row.parent.name : '-'}</td>
                <td>
                  {row.children && row.children.length > 0 
                    ? row.children.map(child => child.name).join(', ')
                    : '-'
                  }
                </td>
                <td className="text-center">
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => handleEdit(row)}
                    title="Edit"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(row)}
                    title="Delete"
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        show={showModal}
        onClose={handleCloseModal}
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
        size="md"
      >
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <CategoryForm
          categories={categories}
          category={editingCategory}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          loading={formLoading}
        />
      </Modal>
    </div>
  );
}

export default Category;
