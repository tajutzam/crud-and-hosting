import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import orderService from "../../services/orderService";
import PlaceholderProductCard from "../../assets/PlaceholderProductCard.png";
import mail from "../../assets/mail.png";
import { BiCheckCircle, BiArrowBack, BiUpload, BiInfoCircle } from "react-icons/bi";
import "./Checkout.css";

const BACKEND_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace(/\/api\/?$/, '');

function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();

  const [paymentProof, setPaymentProof] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);
  const [isReseller, setIsReseller] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(null);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaymentProof(file);
      setProofPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!paymentProof) {
      setError("Silakan unggah bukti transfer pembayaran terlebih dahulu!");
      return;
    }

    if (cartItems.length === 0) {
      setError("Keranjang belanja Anda kosong.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const cartIds = cartItems.map((item) => item.id);
      const res = await orderService.createOrder({
        cart_ids: cartIds,
        is_reseller: isReseller,
        payment_proof: paymentProof,
        shipping_cost: 0,
      });

      // Clear the cart in context
      await clearCart();
      setOrderSuccess(res.order || res);
    } catch (err) {
      console.error("Checkout failed:", err);
      setError(err.message || "Gagal memproses pesanan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="container-lg pt-5 mt-5 pb-5">
        <div className="bg-white p-5 rounded-4 shadow-sm text-center border my-5 max-w-600 mx-auto" style={{ maxWidth: 600 }}>
          <div className="text-success mb-3">
            <BiCheckCircle size={72} />
          </div>
          <h3 className="fw-bold text-dark mb-2">Pesanan Berhasil Dibuat!</h3>
          <p className="text-muted mb-4">
            Terima kasih telah berbelanja di Dishine. Bukti pembayaran Anda sedang diverifikasi oleh admin.
          </p>
          {orderSuccess.transaction_id && (
            <div className="p-3 bg-light rounded-3 mb-4 text-start">
              <div className="small text-muted">Nomor Transaksi:</div>
              <div className="fw-bold fs-5 text-dark">{orderSuccess.transaction_id}</div>
              <div className="small text-muted mt-2">Total Pembayaran:</div>
              <div className="fw-bold fs-5 text-primary">{formatRupiah(orderSuccess.total_amount || cartTotal)}</div>
            </div>
          )}
          <div className="d-flex justify-content-center gap-3">
            <Link to="/" className="btn btn-dark px-4 py-2 rounded-pill">
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-5">
      <div className="container-lg pt-5">
        <div className="mt-5">
          <div className="d-flex justify-content-between align-items-center pb-3 pt-4">
            <h3 className="text-dark fw-bold mb-0">Ringkasan Pesanan & Checkout</h3>
            <Link to="/Cart" className="text-decoration-none text-muted d-flex align-items-center gap-1">
              <BiArrowBack /> Kembali ke Keranjang
            </Link>
          </div>

          {error && (
            <div className="alert alert-danger shadow-sm border-0 mb-4" role="alert">
              {error}
            </div>
          )}

          <div className="row mb-5 g-4">
            {/* Left Column: Real Cart Items */}
            <div className="col-12 col-lg-7">
              <h5 className="fw-bold text-dark mb-3">Daftar Produk ({cartItems.length})</h5>
              {cartItems.length === 0 ? (
                <div className="bg-white p-4 rounded-4 shadow-sm text-center border">
                  <p className="text-muted mb-3">Tidak ada produk untuk di-checkout.</p>
                  <Link to="/" className="btn btn-dark btn-sm rounded-pill">Belanja Sekarang</Link>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3 mb-4">
                  {cartItems.map((item) => {
                    const product = item.product || {};
                    const unitPrice = Number(product.base_price) || 0;
                    const itemTotal = unitPrice * (Number(item.quantity) || 1);

                    return (
                      <div key={item.id} className="bg-white p-3 rounded-4 shadow-sm border d-flex align-items-center justify-content-between gap-3">
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={getItemImage(item)}
                            alt={product.name || "Product"}
                            style={{
                              width: '70px',
                              height: '70px',
                              objectFit: 'cover',
                              borderRadius: '10px',
                              backgroundColor: '#f8f9fa'
                            }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = PlaceholderProductCard;
                            }}
                          />
                          <div>
                            <h6 className="fw-bold mb-1 text-dark">{product.name || "Produk"}</h6>
                            <div className="text-muted small">
                              {item.quantity} x <span className="text-dark fw-semibold">{formatRupiah(unitPrice)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-end">
                          <span className="fw-bold text-dark">{formatRupiah(itemTotal)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Payment Instructions */}
              <div className="bg-white p-4 rounded-4 shadow-sm border mb-4">
                <h5 className="fw-bold text-dark mb-3">Instruksi Pembayaran</h5>
                <p className="text-muted small mb-3">
                  Silakan lakukan transfer sesuai total tagihan ke salah satu rekening bank resmi kami:
                </p>
                <div className="p-3 bg-light rounded-3 mb-2 border">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong className="text-dark">BCA (Bank Central Asia)</strong>
                      <div className="text-muted small">a.n. PT Dishine Fashion Indonesia</div>
                    </div>
                    <span className="fs-6 fw-bold text-primary font-monospace">8820-1928-3921</span>
                  </div>
                </div>
                <div className="p-3 bg-light rounded-3 border">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong className="text-dark">Bank Mandiri</strong>
                      <div className="text-muted small">a.n. PT Dishine Fashion Indonesia</div>
                    </div>
                    <span className="fs-6 fw-bold text-primary font-monospace">1370-0019-2831</span>
                  </div>
                </div>
              </div>

              {/* Upload Proof */}
              <div className="bg-white p-4 rounded-4 shadow-sm border">
                <h5 className="fw-bold text-dark mb-2">Unggah Bukti Pembayaran <span className="text-danger">*</span></h5>
                <p className="text-muted small mb-3">
                  Foto struk transfer atau tangkapan layar (screenshot) mutasi transfer Anda.
                </p>

                <div className="d-flex flex-column align-items-center justify-content-center p-4 border border-2 border-dashed rounded-4 bg-light text-center">
                  {proofPreview ? (
                    <div className="mb-3 position-relative">
                      <img 
                        src={proofPreview} 
                        alt="Bukti Transfer" 
                        style={{ maxHeight: '220px', borderRadius: '12px', objectFit: 'contain' }} 
                      />
                      <div className="mt-2 text-success small fw-semibold">
                        <BiCheckCircle /> Berkas terpilih: {paymentProof?.name}
                      </div>
                    </div>
                  ) : (
                    <div className="mb-3 text-muted">
                      <img src={mail} alt="Upload" style={{ width: 64, opacity: 0.7 }} className="mb-2" />
                      <div className="small">Pilih gambar JPG, PNG, atau WEBP bukti transfer</div>
                    </div>
                  )}

                  <label className="btn btn-outline-dark btn-sm rounded-pill px-4 py-2 cursor-pointer">
                    <BiUpload size={18} className="me-1" /> {proofPreview ? "Ganti Gambar" : "Pilih Bukti Transfer"}
                    <input
                      type="file"
                      accept="image/*"
                      className="d-none"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Checkout Summary */}
            <div className="col-12 col-lg-5">
              <div className="summary bg-white p-4 rounded-4 shadow-sm border sticky-top" style={{ top: '100px' }}>
                <h5 className="pb-3 mb-3 border-bottom fw-bold text-dark">
                  Ringkasan Biaya
                </h5>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Subtotal Produk</span>
                  <span className="fw-semibold">{formatRupiah(cartTotal)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Biaya Pengiriman</span>
                  <span className="text-success fw-semibold">Gratis (Rp. 0)</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">Pajak (0%)</span>
                  <span className="fw-semibold">Rp. 0</span>
                </div>

                <div className="form-check p-3 bg-light rounded-3 mb-3 border">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="resellerCheck"
                    checked={isReseller}
                    onChange={(e) => setIsReseller(e.target.checked)}
                  />
                  <label className="form-check-label small ms-2" htmlFor="resellerCheck">
                    <strong>Beli sebagai Reseller</strong>
                    <div className="text-muted">Gunakan harga reseller jika syarat minimal kuantitas terpenuhi.</div>
                  </label>
                </div>

                <hr />

                <div className="d-flex justify-content-between mb-4 fs-5">
                  <span className="fw-bold">Total Pembayaran</span>
                  <span className="fw-bold text-primary">{formatRupiah(cartTotal)}</span>
                </div>

                <button
                  type="button"
                  className="btn btn-dark w-100 py-3 rounded-pill fw-semibold shadow-sm"
                  onClick={handleCheckout}
                  disabled={loading || cartItems.length === 0}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Memproses Pesanan...
                    </>
                  ) : (
                    "Konfirmasi & Bayar Pesanan"
                  )}
                </button>

                <div className="text-center mt-3 text-muted small d-flex align-items-center justify-content-center gap-1">
                  <BiInfoCircle /> Transaksi aman dan terverifikasi.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
