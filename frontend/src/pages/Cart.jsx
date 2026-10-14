import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import "../styles/Cart.css";
import CartFAQ from "../components/CartFAQ";
import PlaceholderProductCard from "../assets/PlaceholderProductCard.png";
import { BiTrash, BiPlus, BiMinus, BiArrowBack } from "react-icons/bi";

const BACKEND_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace(/\/api\/?$/, '');

function Cart() {
  const { cartItems, cartTotal, loading, updateQuantity, removeFromCart } = useCart();

  const getItemImage = (item) => {
    const images = item.product?.product_images || item.product?.productImages;
    if (images && images.length > 0) {
      const img = images[0]?.image_url || images[0];
      if (typeof img === 'string') {
        if (img.startsWith('http://') || img.startsWith('https://')) return img;
        const cleanPath = img.replace(/^\/?(storage\/)?/, '');
        return `${BACKEND_URL}/storage/${cleanPath}`;
      }
    }
    return PlaceholderProductCard;
  };

  const formatRupiah = (number) => {
    return `Rp. ${Number(number || 0).toLocaleString('id-ID')}`;
  };

  return (
    <div className="pb-5">
      <div className="container-lg pt-5">
        <div className="mt-5">
          <div className="d-flex justify-content-between align-items-center pb-3 pt-4">
            <h3 className="text-dark fw-bold mb-0">Keranjang Belanja</h3>
            <Link to="/" className="text-decoration-none text-muted d-flex align-items-center gap-1">
              <BiArrowBack /> Lanjut Belanja
            </Link>
          </div>

          <div className="row mb-5 g-4">
            {/* Cart Items List */}
            <div className="col-12 col-lg-7">
              {cartItems.length === 0 ? (
                <div className="bg-white p-5 rounded-4 text-center shadow-sm">
                  <h5 className="fw-semibold text-muted mb-3">Keranjang Anda masih kosong</h5>
                  <p className="text-secondary mb-4">Yuk, temukan produk pakaian dan fashion menarik di koleksi kami!</p>
                  <Link to="/" className="btn btn-dark px-4 py-2 rounded-pill">
                    Mulai Belanja Sekarang
                  </Link>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {cartItems.map((item) => {
                    const product = item.product || {};
                    const unitPrice = Number(product.base_price) || 0;
                    const itemTotal = unitPrice * (Number(item.quantity) || 1);

                    return (
                      <div 
                        key={item.id} 
                        className="bg-white p-3 rounded-4 shadow-sm d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 border"
                      >
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={getItemImage(item)}
                            alt={product.name || "Product"}
                            style={{
                              width: '90px',
                              height: '90px',
                              objectFit: 'cover',
                              borderRadius: '12px',
                              backgroundColor: '#f8f9fa'
                            }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = PlaceholderProductCard;
                            }}
                          />
                          <div>
                            <h6 className="fw-bold mb-1 text-dark">{product.name || "Produk"}</h6>
                            {product.category?.name && (
                              <span className="badge bg-light text-secondary mb-2 border">
                                {product.category.name}
                              </span>
                            )}
                            <div className="text-muted small">
                              Harga: <span className="text-dark fw-semibold">{formatRupiah(unitPrice)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Controls & Subtotal */}
                        <div className="d-flex align-items-center justify-content-between justify-content-sm-end gap-3 mt-2 mt-sm-0">
                          {/* Quantity Selector */}
                          <div className="d-flex align-items-center border rounded-pill px-2 py-1 bg-light">
                            <button
                              type="button"
                              className="btn btn-sm btn-link text-dark p-0 border-0"
                              onClick={() => updateQuantity(item.id, Number(item.quantity) - 1)}
                              disabled={loading}
                              title="Kurangi"
                            >
                              <BiMinus size={16} />
                            </button>
                            <span className="px-3 fw-bold small">{item.quantity}</span>
                            <button
                              type="button"
                              className="btn btn-sm btn-link text-dark p-0 border-0"
                              onClick={() => updateQuantity(item.id, Number(item.quantity) + 1)}
                              disabled={loading}
                              title="Tambah"
                            >
                              <BiPlus size={16} />
                            </button>
                          </div>

                          {/* Item Subtotal */}
                          <div className="text-end" style={{ minWidth: '100px' }}>
                            <div className="fw-bold text-dark">{formatRupiah(itemTotal)}</div>
                          </div>

                          {/* Delete Button */}
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm rounded-circle p-2"
                            onClick={() => removeFromCart(item.id)}
                            disabled={loading}
                            title="Hapus dari keranjang"
                          >
                            <BiTrash size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Cart Summary */}
            <div className="col-12 col-lg-5">
              <div className="summary bg-white p-4 rounded-4 shadow-sm border">
                <h5 className="summary-dark pb-3 mb-3 border-bottom fw-bold text-dark">
                  Ringkasan Pesanan
                </h5>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Subtotal ({cartItems.length} Produk)</span>
                  <span className="fw-semibold">{formatRupiah(cartTotal)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">Diskon</span>
                  <span className="text-success fw-semibold">Rp. 0</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-4 fs-5">
                  <span className="fw-bold">Total Pembayaran</span>
                  <span className="fw-bold text-primary">{formatRupiah(cartTotal)}</span>
                </div>

                <NavLink
                  to="/Checkout"
                  className={`text-decoration-none w-100 ${cartItems.length === 0 ? 'pe-none' : ''}`}
                >
                  <button 
                    className="button btn btn-dark w-100 py-3 rounded-pill fw-semibold"
                    disabled={cartItems.length === 0}
                  >
                    Proceed To Checkout
                  </button>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-section pt-5 pb-4">
        <div className="container-xl">
          <div className="faq bg-white p-4 rounded-4 shadow-sm border">
            <h4 className="mb-4 pb-2 border-bottom fw-bold text-dark">
              Pertanyaan yang Sering Diajukan (FAQ)
            </h4>
            <CartFAQ
              title="Bagaimana cara melanjutkan pemesanan ke checkout?"
              content="Pastikan produk dan jumlah yang Anda pilih sudah sesuai, lalu klik tombol 'Proceed To Checkout' untuk memilih opsi pengiriman dan metode pembayaran."
            />
            <CartFAQ
              title="Apakah saya bisa memesan sebagai reseller?"
              content="Bisa! Pada halaman checkout, Anda dapat mencentang opsi reseller untuk mendapatkan potongan harga khusus jika memenuhi syarat kuantiti minimal."
            />
            <CartFAQ
              title="Berapa lama waktu konfirmasi pembayaran?"
              content="Setelah Anda mengunggah bukti transfer pada halaman checkout, pesanan Anda akan diverifikasi oleh tim kami dalam waktu maksimal 1x24 jam."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
