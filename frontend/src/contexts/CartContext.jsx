import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import cartService from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'danger', message: string }

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 3500);
  };

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      return;
    }
    try {
      setLoading(true);
      const items = await cartService.getCart();
      setCartItems(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error('Failed to load cart:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (product, quantity = 1, variantId = null) => {
    if (!isAuthenticated) {
      showFeedback('danger', 'Silakan login terlebih dahulu untuk menambahkan produk ke keranjang!');
      return false;
    }

    try {
      const productId = product?.id || product;
      await cartService.addToCart({
        product_id: productId,
        quantity,
        product_variant_id: variantId,
      });

      await refreshCart();
      showFeedback('success', `"${product?.name || 'Produk'}" berhasil ditambahkan ke keranjang!`);
      return true;
    } catch (err) {
      showFeedback('danger', err.message || 'Gagal menambahkan produk ke keranjang.');
      return false;
    }
  };

  const updateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) {
      return removeFromCart(cartId);
    }
    try {
      // Optimistic update
      setCartItems(prev =>
        prev.map(item =>
          item.id === cartId ? { ...item, quantity: newQuantity } : item
        )
      );
      await cartService.updateQuantity(cartId, newQuantity);
      await refreshCart();
    } catch (err) {
      console.error('Failed to update quantity:', err);
      showFeedback('danger', 'Gagal mengubah jumlah barang.');
      await refreshCart();
    }
  };

  const removeFromCart = async (cartId) => {
    try {
      setCartItems(prev => prev.filter(item => item.id !== cartId));
      await cartService.removeFromCart(cartId);
      showFeedback('success', 'Produk berhasil dihapus dari keranjang.');
      await refreshCart();
    } catch (err) {
      console.error('Failed to remove from cart:', err);
      showFeedback('danger', 'Gagal menghapus produk dari keranjang.');
      await refreshCart();
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
