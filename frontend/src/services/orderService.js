import authService from './authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const orderService = {
  async createOrder({ cart_ids, is_reseller = false, payment_proof, shipping_cost = 0 }) {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('Silakan login terlebih dahulu untuk melakukan checkout.');
      }

      const formData = new FormData();
      cart_ids.forEach((id) => {
        formData.append('cart_ids[]', id);
      });
      formData.append('is_reseller', is_reseller ? '1' : '0');
      if (shipping_cost !== undefined) {
        formData.append('shipping_cost', shipping_cost);
      }
      if (payment_proof) {
        formData.append('payment_proof', payment_proof);
      }

      const response = await fetch(`${API_BASE_URL}/order`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errMsg = errorData.message || errorData.error;
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
      console.error('Error creating order:', error);
      throw error;
    }
  },

  async getOrderHistory() {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_BASE_URL}/order`, {
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
      console.error('Error fetching order history:', error);
      throw error;
    }
  },

  async getAllOrders(status = null) {
    try {
      const token = authService.getToken();
      const url = new URL(`${API_BASE_URL}/order/all`);
      if (status && status !== 'all' && status !== 'semua') {
        url.searchParams.append('status', status);
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching all orders for admin:', error);
      throw error;
    }
  },

  async getOrderDetails(transactionId) {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_BASE_URL}/order/${transactionId}`, {
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
      console.error('Error fetching order details:', error);
      throw error;
    }
  },

  async updateOrderStatus(orderId, status) {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_BASE_URL}/order/${orderId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  async deleteOrder(orderId) {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_BASE_URL}/order/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  },
};

export default orderService;
