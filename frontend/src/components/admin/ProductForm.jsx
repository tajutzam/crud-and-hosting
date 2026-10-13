import { useState, useEffect } from 'react';
import PlaceholderProductCard from '../../assets/PlaceholderProductCard.png';

const BACKEND_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace(/\/api\/?$/, '');

function ProductForm({ categories = [], product = null, onSubmit, onCancel, loading = false }) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category_id: '',
    description: '',
    base_price: '',
    reseller_price: '',
    status: 'publish',
    images: [],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        category_id: product.category_id || '',
        description: product.description || '',
        base_price: product.base_price || '',
        reseller_price: product.reseller_price || '',
        status: product.status || 'publish',
        images: []
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        category_id: '',
        description: '',
        base_price: '',
        reseller_price: '',
        status: 'publish',
        images: [],
      });
    }
    setErrors({});
  }, [product]);

  const getExistingImageUrl = (img) => {
    const url = typeof img === 'string' ? img : img?.image_url;
    if (!url) return PlaceholderProductCard;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    const cleanPath = url.replace(/^\/?(storage\/)?/, '');
    return `${BACKEND_URL}/storage/${cleanPath}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = name === 'category_id' ? parseInt(value) || '' : value;
    let updatedFormData = {
      ...formData,
      [name]: updatedValue
    };

    // Auto-generate slug from name (for both add & update)
    if (name === 'name') {
      const slug = value
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      updatedFormData.slug = slug;
    }

    setFormData(updatedFormData);

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const numValue = value === '' ? '' : parseFloat(value);
    setFormData(prev => ({
      ...prev,
      [name]: numValue
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
      newErrors.name = 'Name is required';
    }
    
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    }
    
    if (!formData.category_id) {
      newErrors.category_id = 'Category is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.base_price || Number(formData.base_price) <= 0) {
      newErrors.base_price = 'Base price must be greater than 0';
    }
    
    if (!formData.reseller_price || Number(formData.reseller_price) <= 0) {
      newErrors.reseller_price = 'Reseller price must be greater than 0';
    }
    
    if (formData.base_price && formData.reseller_price && Number(formData.reseller_price) >= Number(formData.base_price)) {
      newErrors.reseller_price = 'Reseller price must be less than base price';
    }

    if (!product && (!formData.images || formData.images.length === 0)) {
      newErrors.images = 'Minimal pilih 1 gambar produk untuk produk baru';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        {/* NAME */}
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
          placeholder="Enter product name"
        />
        {errors.name && (
          <div className="invalid-feedback">{errors.name}</div>
        )}
      </div>

      <div className="mb-3">
        {/* SLUG */}
        <label htmlFor="slug" className="form-label">
          Slug <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.slug ? 'is-invalid' : ''}`}
          id="slug"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          disabled={loading}
          placeholder="product-slug"
        />
        {errors.slug && (
          <div className="invalid-feedback">{errors.slug}</div>
        )}
      </div>

      <div className="mb-3">
        {/* CATEGORY */}
        <label htmlFor="category_id" className="form-label">
          Category <span className="text-danger">*</span>
        </label>
        <select
          className={`form-select ${errors.category_id ? 'is-invalid' : ''}`}
          id="category_id"
          name="category_id"
          value={formData.category_id || ''}
          onChange={handleChange}
          disabled={loading}
        >
          <option value="">-- Select Category --</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.category_id && (
          <div className="invalid-feedback">{errors.category_id}</div>
        )}
      </div>

      <div className="mb-3">
        {/* DESCRIPTION */}
        <label htmlFor="description" className="form-label">
          Description <span className="text-danger">*</span>
        </label>
        <textarea
          className={`form-control ${errors.description ? 'is-invalid' : ''}`}
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          disabled={loading}
          placeholder="Enter product description"
          rows="4"
        />
        {errors.description && (
          <div className="invalid-feedback">{errors.description}</div>
        )}
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          {/* BASE PRICE */}
          <label htmlFor="base_price" className="form-label">
            Base Price <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            className={`form-control ${errors.base_price ? 'is-invalid' : ''}`}
            id="base_price"
            name="base_price"
            value={formData.base_price}
            onChange={handleNumberChange}
            disabled={loading}
            placeholder="0"
            min="0"
          />
          {errors.base_price && (
            <div className="invalid-feedback">{errors.base_price}</div>
          )}
        </div>

        <div className="col-md-6 mb-3">
          {/* RESELLER PRICE */}
          <label htmlFor="reseller_price" className="form-label">
            Reseller Price <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            className={`form-control ${errors.reseller_price ? 'is-invalid' : ''}`}
            id="reseller_price"
            name="reseller_price"
            value={formData.reseller_price}
            onChange={handleNumberChange}
            disabled={loading}
            placeholder="0"
            min="0"
          />
          {errors.reseller_price && (
            <div className="invalid-feedback">{errors.reseller_price}</div>
          )}
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="images" className="form-label">
          Images {product ? <span className="text-muted fs-7">(Opsional jika tidak diubah)</span> : <span className="text-danger">*</span>}
        </label>
        <input
          type="file"
          name="images"
          id="images"
          multiple
          accept="image/*"
          className={`form-control ${errors.images ? 'is-invalid' : ''}`}
          disabled={loading}
          onChange={e => {
            const files = Array.from(e.target.files);
            setFormData(prev => ({
              ...prev,
              images: files
            }));
            if (errors.images) {
              setErrors(prev => ({ ...prev, images: '' }));
            }
          }}
        />
        {errors.images && (
          <div className="invalid-feedback d-block">{errors.images}</div>
        )}

        {/* Preview new selected images */}
        {formData.images && formData.images.length > 0 && (
          <div className="mt-2">
            <small className="text-muted d-block mb-1">Gambar baru yang dipilih:</small>
            <div className="d-flex gap-2 flex-wrap">
              {formData.images.map((file, idx) => (
                <img
                  key={idx}
                  src={typeof file === 'string' ? file : URL.createObjectURL(file)}
                  alt={`new-${idx}`}
                  style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 4, border: '2px solid #198754' }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Preview existing images when editing */}
        {product && (!formData.images || formData.images.length === 0) && (product.product_images || product.productImages) && (
          <div className="mt-2">
            <small className="text-muted d-block mb-1">Gambar saat ini:</small>
            <div className="d-flex gap-2 flex-wrap">
              {(product.product_images || product.productImages || []).map((img, idx) => (
                <img
                  key={idx}
                  src={getExistingImageUrl(img)}
                  alt={`existing-${idx}`}
                  style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 4, border: '1px solid #ddd' }}
                  onError={(e) => {
                    e.target.src = '/src/assets/PlaceholderProductCard.png';
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>


      <div className="mb-3">
        <label htmlFor="status" className="form-label">
          Status <span className="text-danger">*</span>
        </label>
        <select
          className="form-select"
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          disabled={loading}
        >
          {/* Gunakan 'hide' sebagai pengganti draft */}
          <option value="hide">Hide</option>
          <option value="publish">Publish</option>
        </select>
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
              {product ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            product ? 'Update' : 'Create'
          )}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
