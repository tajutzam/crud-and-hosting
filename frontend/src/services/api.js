const getToken = () => localStorage.getItem('token');
const removeAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle token expiration
    if (response.status === 401) {
      removeAuthData();
      // Optionally redirect to login
      window.location.href = '/login';
      throw new Error('Session expired');
    }

    const data = await response.json();

    if (!response.ok) {
      // Backend validation errors
      if (data.errors && typeof data.errors === 'object') {
        const firstKey = Object.keys(data.errors)[0];
        if (firstKey && data.errors[firstKey].length > 0) {
          throw new Error(data.errors[firstKey][0]);
        }
      }
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    // Network error or thrown error
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
};

export const get = (endpoint) => api(endpoint, { method: 'GET' });
export const post = (endpoint, data) => api(endpoint, { method: 'POST', body: JSON.stringify(data) });
export const put = (endpoint, data) => api(endpoint, { method: 'PUT', body: JSON.stringify(data) });
export const del = (endpoint) => api(endpoint, { method: 'DELETE' });
export const postForm = async (endpoint, formData) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (response.status === 401) {
      removeAuthData();
      window.location.href = '/login';
      throw new Error('Session expired');
    }

    const data = await response.json();

    if (!response.ok) {
      if (data.errors && typeof data.errors === 'object') {
        const firstKey = Object.keys(data.errors)[0];
        if (firstKey && data.errors[firstKey].length > 0) {
          throw new Error(data.errors[firstKey][0]);
        }
      }
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
};