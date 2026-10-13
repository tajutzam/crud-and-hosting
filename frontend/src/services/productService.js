import authService from "./authService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const productService = {
  async getAllProducts() {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  async getProductById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Product with id ${id} not found`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching product with id ${id}:`, error);
      throw error;
    }
  },

  async getProductsByCategory(category) {
    try {
      const response = await fetch(`${API_BASE_URL}/products?category=${encodeURIComponent(category)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching products by category ${category}:`, error);
      throw error;
    }
  },

  async searchProducts(query) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error searching products with query "${query}":`, error);
      throw error;
    }
  },

  async createProduct(productData) {
    try {
      const token = authService.getToken();
      const formData = new FormData();

      Object.keys(productData).forEach((key) => {
        if (key === 'images') {
          // Loop setiap file yang ada di dalam array formData.images
          if (Array.isArray(productData.images)) {
            productData.images.forEach((file) => {
              if (file instanceof File) {
                formData.append('images[]', file); // Dikirim sebagai array 'images[]'
              }
            });
          }
        } else if (productData[key] !== null && productData[key] !== undefined) {
          formData.append(key, productData[key]);
        }
      });

      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // JANGAN isi Content-Type! Biarkan browser yang mengaturnya secara otomatis
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errMsg = errorData.message;
        if (errorData.errors && typeof errorData.errors === 'object') {
          const firstKey = Object.keys(errorData.errors)[0];
          if (firstKey && errorData.errors[firstKey].length > 0) {
            errMsg = errorData.errors[firstKey][0];
          }
        }
        throw new Error(errMsg || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  async updateProduct(slug, productData) {
    try {
      const token = authService.getToken();
      const formData = new FormData();

      formData.append('_method', 'PUT');

      Object.keys(productData).forEach((key) => {
        if (key !== 'images' && productData[key] !== null && productData[key] !== undefined) {
          formData.append(key, productData[key]);
        }
      });

      // Kirim berkas gambar baru jika ada
      if (Array.isArray(productData.images) && productData.images.length > 0) {
        productData.images.forEach((file) => {
          if (file instanceof File) {
            formData.append('images[]', file);
          }
        });
      }

      const response = await fetch(`${API_BASE_URL}/products/${slug}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errMsg = errorData.message;
        if (errorData.errors && typeof errorData.errors === 'object') {
          const firstKey = Object.keys(errorData.errors)[0];
          if (firstKey && errorData.errors[firstKey].length > 0) {
            errMsg = errorData.errors[firstKey][0];
          }
        }
        throw new Error(errMsg || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  async deleteProduct(slug) {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_BASE_URL}/products/${slug}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error(`Error deleting product with slug ${slug}:`, error);
      throw error;
    }
  },
};

export default productService;

