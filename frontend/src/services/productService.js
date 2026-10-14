import { get, put, del, postForm } from './api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const productService = {
  async getAllProducts() {
    try {
      const data = await get('/products');
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  async getProductById(id) {
    try {
      const data = await get(`/products/${id}`);
      return data;
    } catch (error) {
      console.error(`Error fetching product with id ${id}:`, error);
      throw error;
    }
  },

  async getProductsByCategory(category) {
    try {
      const data = await get(`/products?category=${encodeURIComponent(category)}`);
      return data;
    } catch (error) {
      console.error(`Error fetching products by category ${category}:`, error);
      throw error;
    }
  },

  async searchProducts(query) {
    try {
      const data = await get(`/products?q=${encodeURIComponent(query)}`);
      return data;
    } catch (error) {
      console.error(`Error searching products with query "${query}":`, error);
      throw error;
    }
  },

  async createProduct(productData) {
    try {
      const data = await postForm('/products', productData);
      return data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  async updateProduct(slug, productData) {
    try {
      // Remove images from productData for the main update, handle images separately
      const { images: _images, ...rest } = productData;

      const data = await put(`/products/${slug}`, rest);
      
      // Handle new image uploads
      if (Array.isArray(productData.images) && productData.images.length > 0) {
        await postForm(`/products/${slug}/images`, productData.images);
      }

      return data;
    } catch (error) {
      console.error(`Error updating product with slug ${slug}:`, error);
      throw error;
    }
  },

  async deleteProduct(slug) {
    try {
      await del(`/products/${slug}`);
      return true;
    } catch (error) {
      console.error(`Error deleting product with slug ${slug}:`, error);
      throw error;
    }
  },
};

export default productService;