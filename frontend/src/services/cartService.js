import { get, post, put, del } from './api';

const cartService = {
  async getCart() {
    try {
      const data = await get('/carts');
      return data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  },

  async addToCart(productId, quantity = 1) {
    try {
      const data = await post('/carts', { product_id: productId, quantity });
      return data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  async updateCartItem(cartId, quantity) {
    try {
      const data = await put(`/carts/${cartId}`, { quantity });
      return data;
    } catch (error) {
      console.error(`Error updating cart item ${cartId}:`, error);
      throw error;
    }
  },

  async removeFromCart(cartId) {
    try {
      const data = await del(`/carts/${cartId}`);
      return data;
    } catch (error) {
      console.error(`Error removing cart item ${cartId}:`, error);
      throw error;
    }
  },

  async clearCart() {
    try {
      const data = await post('/carts/clear', {});
      return data;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  },
};

export default cartService;