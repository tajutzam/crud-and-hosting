import { useState, useEffect } from 'react';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import AddButton from '../../components/admin/AddButton';
import Modal from '../../components/admin/Modal';
import ProductForm from '../../components/admin/ProductForm';
import Loading from '../../components/Loading';
import PlaceholderProductCard from '../../assets/PlaceholderProductCard.png';

const BACKEND_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace(/\/api\/?$/, '');

const ProductAdmin = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getAllProducts();
      setProducts(Array.isArray(data) ? data : (data?.products || []));
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(Array.isArray(data) ? data : (data?.categories || []));
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleAdd = () => {
    setEditingProduct(null);
    setError(null);
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setError(null);
    setShowModal(true);
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      return;
    }

    try {
      await productService.deleteProduct(product.slug);
      await fetchProducts();
    } catch (err) {
      alert(err.message || 'Failed to delete product');
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setFormLoading(true);
      setError(null);

      if (editingProduct) {
        // Gunakan editingProduct.slug secara eksplisit
        await productService.updateProduct(editingProduct.slug, formData);
      } else {
        await productService.createProduct(formData);
      }

      setShowModal(false);
      setEditingProduct(null);
      await fetchProducts();
    } catch (err) {
      setError(err.message || 'Failed to save product');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCloseModal = () => {
    if (!formLoading) {
      setShowModal(false);
      setEditingProduct(null);
      setError(null);
    }
  };

  const getProductImage = (product) => {
    const images = product.product_images || product.productImages;
    if (images && images.length > 0) {
      const imageUrl = images[0]?.image_url;
      if (imageUrl) {
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
          return imageUrl;
        }
        const cleanPath = imageUrl.replace(/^\/?(storage\/)?/, '');
        return `${BACKEND_URL}/storage/${cleanPath}`;
      }
    }
    return PlaceholderProductCard;
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Products</h4>
        <AddButton onClick={handleAdd} label="Add Product" />
      </div>

      {error && !showModal && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <Loading message="Loading products..." />
      ) : products.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">No products found. Click 'Add Product' to add one.</p>
        </div>
      ) : (
        <div className="row g-4">
          {products.map((product) => (
            <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="card h-100 shadow-sm">
                <img
                  src={getProductImage(product)}
                  alt={product.name}
                  className="card-img-top"
                  style={{
                    height: '200px',
                    objectFit: 'cover',
                    backgroundColor: '#f8f9fa'
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = PlaceholderProductCard;
                  }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title mb-2" style={{ fontSize: '1rem', fontWeight: '600' }}>
                    {product.name}
                  </h5>
                  <p className="text-muted mb-2" style={{ fontSize: '0.875rem' }}>
                    <strong>Category:</strong> {product.category?.name || 'N/A'}
                  </p>
                  {product.description && (
                    <p className="card-text mb-2" style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                      {product.description.length > 50 
                        ? `${product.description.substring(0, 50)}...` 
                        : product.description}
                    </p>
                  )}
                  <div className="mb-2">
                    <div style={{ fontSize: '0.875rem' }}>
                      <strong>Base Price:</strong> Rp {product.base_price?.toLocaleString('id-ID') || '0'}
                    </div>
                    <div style={{ fontSize: '0.875rem' }}>
                      <strong>Reseller Price:</strong> Rp {product.reseller_price?.toLocaleString('id-ID') || '0'}
                    </div>
                  </div>
                  <div className="mb-3">
                    <span
                      className={`badge ${
                        product.status === 'publish' ? 'bg-success' : 'bg-secondary'
                      }`}
                    >
                      {product.status || 'draft'}
                    </span>
                  </div>
                  <div className="mt-auto d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-primary flex-fill"
                      onClick={() => handleEdit(product)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger flex-fill"
                      onClick={() => handleDelete(product)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        show={showModal}
        onClose={handleCloseModal}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        size="lg"
      >
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <ProductForm
          categories={categories}
          product={editingProduct}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          loading={formLoading}
        />
      </Modal>
    </div>
  );
}

export default ProductAdmin;
