import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import dashboardService from '../../services/dashboardService';
import Loading from '../../components/Loading';
import PlaceholderProductCard from '../../assets/PlaceholderProductCard.png';
import { 
  BiPackage, 
  BiCategory, 
  BiCart, 
  BiMoney, 
  BiPlusCircle, 
  BiRefresh,
  BiCheckCircle,
  BiTimeFive,
  BiUser,
  BiTrendingUp,
  BiArrowToRight,
} from 'react-icons/bi';

const BACKEND_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace(/\/api\/?$/, '');

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await dashboardService.getStats();
      setData(res);
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
      setError(err.message || 'Gagal memuat statistik dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const getProductImage = (product) => {
    const images = product.product_images || product.productImages;
    if (images && images.length > 0) {
      const imageUrl = images[0]?.image_url;
      if (imageUrl) {
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
          return imageUrl;
        }
        const cleanPath = imageUrl.replace(/^\/?(storage\/)?/, '');
        return `${BACKEND_URL}/storage/${cleanPath}`;
      }
    }
    return PlaceholderProductCard;
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(number || 0);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'publish': return { bg: 'bg-success', text: 'text-success' };
      case 'draft': return { bg: 'bg-secondary', text: 'text-secondary' };
      case 'completed': return { bg: 'bg-success', text: 'text-success' };
      case 'processing': return { bg: 'bg-primary', text: 'text-primary' };
      case 'pending': return { bg: 'bg-warning', text: 'text-warning' };
      case 'cancelled': return { bg: 'bg-danger', text: 'text-danger' };
      default: return { bg: 'bg-secondary', text: 'text-secondary' };
    }
  };

  if (loading) {
    return <Loading message="Memuat informasi dashboard..." />;
  }

  const stats = data?.stats || {
    total_products: 0,
    published_products: 0,
    hidden_products: 0,
    total_categories: 0,
    total_orders: 0,
    pending_orders: 0,
    total_revenue: 0,
    total_customers: 0,
  };

  const recentProducts = data?.recent_products || [];
  const recentOrders = data?.recent_orders || [];

  // eslint-disable-next-line no-unused-vars
  const StatCard = ({ icon: StatIcon, title, value, subtitle, color, bgColor, items }) => (
    <div className="col-12 col-sm-6 col-xl-3">
      <div className="card border-0 rounded-4 shadow-sm h-100 overflow-hidden transition-all" 
        style={{ background: `linear-gradient(135deg, ${bgColor}1a 0%, ${bgColor}05 100%)` }}>
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="flex-grow-1">
              <p className="text-muted small fw-semibold text-uppercase mb-2">{title}</p>
              <h2 className="fw-bold mb-0">{value}</h2>
            </div>
            <div className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 ${color} text-white`} 
              style={{ width: 52, height: 52, fontSize: '24px' }}>
              <StatIcon />
            </div>
          </div>
          {subtitle && (
            <p className="text-muted small mb-0">{subtitle}</p>
          )}
          {items && (
            <div className="mt-3 pt-3 border-top">
              <div className="d-flex flex-wrap gap-2">
                {items.map((item, idx) => (
                  <span key={idx} className={`badge ${item.bg} text-dark small`}>
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="dash-root min-vh-100 w-100"
      style={{ backgroundColor: '#f8f9fa', textAlign: 'left', alignSelf: 'stretch' }}
    >
      <div className="container-xl py-4">
        {/* Header Section */}
        <div className="row align-items-center mb-5">
          <div className="col-md-6">
            <h1 className="fw-bold mb-2" style={{ fontSize: '32px' }}>Dashboard Overview</h1>
            <p className="text-muted mb-0">Ringkasan performa katalog, kategori, pesanan & pendapatan terkini</p>
          </div>
          <div className="col-md-6 text-md-end mt-3 mt-md-0">
            <button 
              className="btn btn-light border shadow-sm d-inline-flex align-items-center gap-2 me-2 fw-semibold"
              onClick={fetchStats}
              disabled={loading}
            >
              <BiRefresh size={18} className={loading ? 'spinner-border spinner-border-sm' : ''} />
              Refresh
            </button>
            <Link to="/admin/products" className="btn btn-primary d-inline-flex align-items-center gap-2 fw-semibold">
              <BiPlusCircle size={18} />
              Kelola Produk
            </Link>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger alert-dismissible fade show mb-4 border-0 rounded-3" role="alert">
            <div className="d-flex align-items-center">
              <span className="me-2">⚠️</span>
              <div>
                <strong>Error:</strong> {error}
              </div>
            </div>
            <button type="button" className="btn-close" onClick={() => setError(null)}></button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="row g-3 mb-5">
          <StatCard
            icon={BiPackage}
            title="Total Produk"
            value={stats.total_products}
            color="bg-primary"
            bgColor="#0d6efd"
            items={[
              { label: `${stats.published_products} Dipublikasi`, bg: 'bg-success-subtle text-success' },
              { label: `${stats.hidden_products} Tersembunyi`, bg: 'bg-secondary-subtle text-secondary' }
            ]}
          />
          <StatCard
            icon={BiCategory}
            title="Total Kategori"
            value={stats.total_categories}
            subtitle="Kategori & Sub-kategori"
            color="bg-success"
            bgColor="#198754"
          />
          <StatCard
            icon={BiCart}
            title="Total Pesanan"
            value={stats.total_orders}
            color="bg-warning"
            bgColor="#ffc107"
            items={stats.pending_orders > 0 ? [
              { label: `${stats.pending_orders} Menunggu`, bg: 'bg-warning-subtle text-warning' },
              { label: 'Perlu Aksi', bg: 'bg-danger-subtle text-danger' }
            ] : [
              { label: 'Semua Selesai', bg: 'bg-success-subtle text-success' }
            ]}
          />
          <StatCard
            icon={BiMoney}
            title="Total Pendapatan"
            value={formatRupiah(stats.total_revenue)}
            subtitle="Dari transaksi selesai"
            color="bg-danger"
            bgColor="#dc3545"
          />
        </div>

        {/* Tables Row */}
        <div className="row g-4">
          {/* Recent Products */}
          <div className="col-12 col-lg-6">
            <div className="card border-0 rounded-4 shadow-sm overflow-hidden h-100">
              <div className="card-header border-0 bg-white p-4 d-flex justify-content-between align-items-center gap-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 44, height: 44 }}>
                    <BiPackage size={20} className="text-primary" />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0">Produk Terbaru</h5>
                    <small className="text-muted">Diperbarui secara berkala</small>
                  </div>
                </div>
                <Link to="/admin/products" className="btn btn-sm btn-outline-primary rounded-3 flex-shrink-0 text-nowrap">
                  Lihat Semua <BiArrowToRight size={14} className="ms-1" />
                </Link>
              </div>
              <div className="card-body p-0">
                {recentProducts.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <BiPackage size={56} className="mb-3 opacity-25" />
                    <p className="mb-0 fw-semibold">Belum ada produk</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th className="ps-4 fw-semibold small text-muted text-uppercase">Produk</th>
                          <th className="fw-semibold small text-muted text-uppercase">Kategori</th>
                          <th className="fw-semibold small text-muted text-uppercase">Harga</th>
                          <th className="fw-semibold small text-muted text-uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentProducts.slice(0, 5).map((p) => (
                          <tr key={p.id} style={{ borderColor: '#f0f0f0' }}>
                            <td className="ps-4">
                              <div className="d-flex align-items-center gap-3">
                                <img
                                  src={getProductImage(p)}
                                  alt={p.name}
                                  className="rounded-2 flex-shrink-0"
                                  style={{ width: 44, height: 44, objectFit: 'cover' }}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = PlaceholderProductCard;
                                  }}
                                />
                                <span className="fw-semibold small text-truncate" title={p.name} style={{ maxWidth: '120px' }}>
                                  {p.name}
                                </span>
                              </div>
                            </td>
                            <td>
                              <small className="text-muted">{p.category?.name || '-'}</small>
                            </td>
                            <td>
                              <span className="fw-bold small text-primary">{formatRupiah(p.base_price)}</span>
                            </td>
                            <td>
                              <span className={`badge rounded-pill ${getStatusColor(p.status).bg} text-dark small`}>
                                {p.status || 'draft'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="col-12 col-lg-6">
            <div className="card border-0 rounded-4 shadow-sm overflow-hidden h-100">
              <div className="card-header border-0 bg-white p-4 d-flex justify-content-between align-items-center gap-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 44, height: 44 }}>
                    <BiCart size={20} className="text-success" />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0">Pesanan Terbaru</h5>
                    <small className="text-muted">Orderan masuk hari ini</small>
                  </div>
                </div>
                <Link to="/admin/orders" className="btn btn-sm btn-outline-success rounded-3 flex-shrink-0 text-nowrap">
                  Lihat Semua <BiArrowToRight size={14} className="ms-1" />
                </Link>
              </div>
              <div className="card-body p-0">
                {recentOrders.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <BiCart size={56} className="mb-3 opacity-25" />
                    <p className="mb-0 fw-semibold">Belum ada pesanan</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th className="ps-4 fw-semibold small text-muted text-uppercase">ID Transaksi</th>
                          <th className="fw-semibold small text-muted text-uppercase">Pelanggan</th>
                          <th className="fw-semibold small text-muted text-uppercase">Total</th>
                          <th className="fw-semibold small text-muted text-uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.slice(0, 5).map((o) => (
                          <tr key={o.id} style={{ borderColor: '#f0f0f0' }}>
                            <td className="ps-4">
                              <span className="font-monospace fw-semibold small text-dark">{o.transaction_id}</span>
                            </td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold small flex-shrink-0" style={{ width: 32, height: 32 }}>
                                  {o.user?.name?.charAt(0).toUpperCase() || '?'}
                                </div>
                                <span className="small fw-semibold">{o.user?.name || 'Customer'}</span>
                              </div>
                            </td>
                            <td>
                              <span className="fw-bold text-primary small">{formatRupiah(o.total_amount)}</span>
                            </td>
                            <td>
                              <span className={`badge rounded-pill ${
                                o.status === 'completed' ? 'bg-success' :
                                o.status === 'processing' ? 'bg-primary' :
                                o.status === 'pending' ? 'bg-warning text-dark' :
                                o.status === 'cancelled' ? 'bg-danger' : 'bg-secondary'
                              } text-white small`}>
                                {o.status || 'pending'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* ---- Reset terhadap CSS global (template Vite / App.css) ---- */
        .dash-root {
          width: 100% !important;
          max-width: 100% !important;
          text-align: left !important;
          box-sizing: border-box;
        }
        .dash-root .container-xl {
          width: 100% !important;
        }
        .dash-root .row > [class*="col-"] {
          min-width: 0;
        }
        .dash-root .card {
          width: 100% !important;
          max-width: none !important;
          padding: 0 !important;
        }
        .dash-root .table th,
        .dash-root .table td {
          text-align: left;
        }
        .dash-root .text-center { text-align: center !important; }
        .dash-root .text-end { text-align: right !important; }

        /* ---- Efek ---- */
        .dash-root .transition-all {
          transition: all 0.3s ease;
        }
        .dash-root .card:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
          transform: translateY(-2px);
        }
        .dash-root .spinner-border-sm {
          animation: dash-spin 1s linear infinite;
        }
        @keyframes dash-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;