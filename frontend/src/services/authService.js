import { post, get, del } from './api';

const authService = {
  async login(email, password) {
    try {
      const data = await post('/auth/login', { email, password });
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      }

      return data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  async register(userData) {
    try {
      const payload = typeof userData === 'object' ? userData : { email: arguments[0], password: arguments[1], name: arguments[2] };

      const data = await post('/auth/register', payload);
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      }

      return data;
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  },

  async logout() {
    try {
      await del('/auth/logout');
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      removeAuthData();
    }
  },

  async getCurrentUser() {
    try {
      const token = getToken();
      if (!token) {
        return null;
      }

      const data = await get('/auth/user');
      
      // The API returns the authenticated user directly, while login returns
      // it under a `user` property. Support both response shapes.
      const user = data.user || data;
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }

      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      logout();
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('token');
  },

  getUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};

export const getToken = () => localStorage.getItem('token');
export const removeAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
export const logout = () => removeAuthData();

export default authService;
