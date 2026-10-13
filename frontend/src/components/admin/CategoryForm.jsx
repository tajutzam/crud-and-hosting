import { useState, useEffect } from 'react';

function CategoryForm({ categories = [], category = null, onSubmit, onCancel, loading = false }) {
  const [formData, setFormData] = useState({
    name: '',
    parent_id: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        parent_id: category.parent_id !== null && category.parent_id !== undefined ? String(category.parent_id) : '',
      });
    } else {
      setFormData({
        name: '',
        parent_id: '',
      });
    }
    setErrors({});
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nama kategori wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        name: formData.name.trim(),
        parent_id: formData.parent_id ? parseInt(formData.parent_id, 10) : null,
      });
    }
  };

  // Exclude current category and its children from parent dropdown to prevent circular reference
  const getExcludedIds = (cat) => {
    if (!cat) return new Set();
    const set = new Set([cat.id]);
    const addChildren = (children) => {
      if (!children) return;
      children.forEach(c => {
        set.add(c.id);
        if (c.children) addChildren(c.children);
      });
    };
    addChildren(cat.children);
    return set;
  };

  const excludedIds = getExcludedIds(category);

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Name <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          disabled={loading}
          placeholder="Masukkan nama kategori"
        />
        {errors.name && (
          <div className="invalid-feedback">{errors.name}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="parent" className="form-label">
          Parent Category
        </label>
        <select
          className={`form-select ${errors.parent_id ? 'is-invalid' : ''}`}
          id="parent"
          name="parent_id"
          value={formData.parent_id}
          onChange={handleChange}
          disabled={loading}
        >
          <option value="">-- None (Root Category) --</option>
          {categories && categories
            .filter(cat => !excludedIds.has(cat.id))
            .map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
        </select>
        {errors.parent_id && (
          <div className="invalid-feedback">{errors.parent_id}</div>
        )}
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {category ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            category ? 'Update' : 'Create'
          )}
        </button>
      </div>
    </form>
  );
}

export default CategoryForm;

