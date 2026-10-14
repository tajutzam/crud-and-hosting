/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from 'react';
import cartService from '../services/cartService';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const refreshCart = async () => {
    try {
      setLoading(true);
      const data = await cartService.getCart();
      setCartItems(data?.data || data || []);
    } catch (err) {
      console.error('Failed to refresh cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const addToCart = async (product, quantity = 1) => {
    try {
      setLoading(true);
      await cartService.addToCart(product.id, quantity);
      showFeedback('success', 'Produk berhasil ditambahkan ke keranjang.');
      await refreshCart();
    } catch (err) {
      console.error('Failed to add to cart:', err);
      showFeedback('danger', err.message || 'Gagal menambahkan ke keranjang.');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) {
      await removeFromCart(cartItemId);
      return;
    }
    try {
      setLoading(true);
      await cartService.updateCartItem(cartItemId, newQuantity);
      await refreshCart();
    } catch (err) {
      console.error('Failed to update quantity:', err);
      showFeedback('danger', 'Gagal memperbarui jumlah.');
      await refreshCart();
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      setLoading(true);
      await cartService.removeFromCart(cartItemId);
      showFeedback('success', 'Produk berhasil dihapus dari keranjang.');
      await refreshCart();
    } catch (err) {
      console.error('Failed to remove from cart:', err);
      showFeedback('danger', 'Gagal menghapus produk dari keranjang.');
      await refreshCart();
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setCartItems([]);
      await cartService.clearCart();
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0);
  const cartTotal = cartItems.reduce((acc, item) => {
    const price = Number(item.product?.base_price) || 0;
    const qty = Number(item.quantity) || 1;
    return acc + (price * qty);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        loading,
        feedback,
        showFeedback,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {/* Toast Notification Container */}
      {feedback && (
        <div 
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            minWidth: '280px',
            maxWidth: '420px',
            animation: 'fadeIn 0.3s ease-in-out'
          }}
        >
          <div className={`alert alert-${feedback.type} shadow-lg d-flex align-items-center justify-content-between mb-0 border-0`}>
            <span>{feedback.message}</span>
            <button 
              type="button" 
              className="btn-close ms-2" 
              onClick={() => setFeedback(null)} 
              aria-label="Close"
            />
          </div>
        </div>
      )}
      {children}
    </CartContext.Provider>
  );
};