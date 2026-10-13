import authService from './authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const cartService = {
  async getCart() {
    try {
      const token = authService.getToken();
      if (!token) return [];

      const response = await fetch(`${API_BASE_URL}/carts`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  },

  async addToCart({ product_id, quantity = 1, product_variant_id = null }) {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('Silakan login terlebih dahulu untuk menambahkan produk ke keranjang.');
      }

      const payload = {
        product_id: Number(product_id),
        quantity: Number(quantity),
      };
      if (product_variant_id) {
        payload.product_variant_id = Number(product_variant_id);
      }

      const response = await fetch(`${API_BASE_URL}/carts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
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
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  async updateQuantity(cartId, quantity) {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_BASE_URL}/carts/${cartId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: Number(quantity) }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      throw error;
    }
  },

  async removeFromCart(cartId) {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_BASE_URL}/carts/${cartId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  async clearCart() {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_BASE_URL}/carts/clear`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  },
};

export default cartService;
