import { useState, useEffect } from 'react';
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
  BiTimeFive
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

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: '#4F200D' }}>Dashboard Overview</h3>
          <p className="text-muted mb-0">Ringkasan performa katalog, kategori, dan pesanan terkini.</p>
        </div>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-secondary d-flex align-items-center gap-1 bg-white"
            onClick={fetchStats}
            title="Refresh Data"
          >
            <BiRefresh size={18} /> Refresh
          </button>
          <Link to="/admin/products" className="btn btn-primary d-flex align-items-center gap-1">
            <BiPlusCircle size={18} /> Kelola Produk
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Stats Cards Grid */}
      <div className="row g-3 mb-4">
        {/* Total Produk */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 h-100 p-3" style={{ borderLeft: '4px solid #0d6efd' }}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-muted small text-uppercase fw-semibold">Total Produk</span>
                <h3 className="fw-bold mt-2 mb-1">{stats.total_products}</h3>
                <div className="small text-muted">
                  <span className="badge bg-success-subtle text-success me-1">
                    {stats.published_products} Publish
                  </span>
                  <span className="badge bg-secondary-subtle text-secondary">
                    {stats.hidden_products} Hide
                  </span>
                </div>
              </div>
              <div 
                className="d-flex align-items-center justify-content-center rounded-circle"
                style={{ width: 44, height: 44, backgroundColor: '#e7f1ff', color: '#0d6efd' }}
              >
                <BiPackage size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Total Kategori */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 h-100 p-3" style={{ borderLeft: '4px solid #198754' }}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-muted small text-uppercase fw-semibold">Total Kategori</span>
                <h3 className="fw-bold mt-2 mb-1">{stats.total_categories}</h3>
                <div className="small text-muted">
                  Kategori & Sub-Kategori
                </div>
              </div>
              <div 
                className="d-flex align-items-center justify-content-center rounded-circle"
                style={{ width: 44, height: 44, backgroundColor: '#e8f5e9', color: '#198754' }}
              >
                <BiCategory size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Total Pesanan */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 h-100 p-3" style={{ borderLeft: '4px solid #ffc107' }}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-muted small text-uppercase fw-semibold">Total Pesanan</span>
                <h3 className="fw-bold mt-2 mb-1">{stats.total_orders}</h3>
                <div className="small text-muted">
                  {stats.pending_orders > 0 ? (
                    <span className="badge bg-warning-subtle text-warning-emphasis d-inline-flex align-items-center gap-1">
                      <BiTimeFive /> {stats.pending_orders} Menunggu
                    </span>
                  ) : (
                    <span className="badge bg-success-subtle text-success d-inline-flex align-items-center gap-1">
                      <BiCheckCircle /> Semua Terproses
                    </span>
                  )}
                </div>
              </div>
              <div 
                className="d-flex align-items-center justify-content-center rounded-circle"
                style={{ width: 44, height: 44, backgroundColor: '#fff9e6', color: '#d48806' }}
              >
                <BiCart size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Total Pendapatan */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 h-100 p-3" style={{ borderLeft: '4px solid #6f42c1' }}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-muted small text-uppercase fw-semibold">Total Pendapatan</span>
                <h4 className="fw-bold mt-2 mb-1 text-truncate" title={formatRupiah(stats.total_revenue)}>
                  {formatRupiah(stats.total_revenue)}
                </h4>
                <div className="small text-muted">
                  Dari transaksi selesai
                </div>
              </div>
              <div 
                className="d-flex align-items-center justify-content-center rounded-circle"
                style={{ width: 44, height: 44, backgroundColor: '#f3e8ff', color: '#6f42c1' }}
              >
                <BiMoney size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Columns: Recent Products & Recent Orders */}
      <div className="row g-4">
        {/* Produk Terbaru */}
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm rounded-3 h-100">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center border-0">
              <h5 className="fw-bold mb-0">Produk Terbaru</h5>
              <Link to="/admin/products" className="small text-decoration-none">
                Lihat Semua &rarr;
              </Link>
            </div>
            <div className="card-body p-0">
              {recentProducts.length === 0 ? (
                <div className="text-center py-4 text-muted">Belum ada produk</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light small">
                      <tr>
                        <th>Produk</th>
                        <th>Kategori</th>
                        <th>Harga</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentProducts.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <img
                                src={getProductImage(p)}
                                alt={p.name}
                                style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 6 }}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = PlaceholderProductCard;
                                }}
                              />
                              <span className="fw-semibold text-truncate" style={{ maxWidth: 160 }} title={p.name}>
                                {p.name}
                              </span>
                            </div>
                          </td>
                          <td className="small text-muted">{p.category?.name || '-'}</td>
                          <td className="small fw-semibold">Rp {p.base_price?.toLocaleString('id-ID')}</td>
                          <td>
                            <span className={`badge ${p.status === 'publish' ? 'bg-success' : 'bg-secondary'}`}>
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

        {/* Pesanan Terbaru */}
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm rounded-3 h-100">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center border-0">
              <h5 className="fw-bold mb-0">Pesanan Terbaru</h5>
              <Link to="/admin/orders" className="small text-decoration-none">
                Lihat Semua &rarr;
              </Link>
            </div>
            <div className="card-body p-0">
              {recentOrders.length === 0 ? (
                <div className="text-center py-4 text-muted">Belum ada pesanan terbaru</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light small">
                      <tr>
                        <th>ID Transaksi</th>
                        <th>Pelanggan</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((o) => (
                        <tr key={o.id}>
                          <td className="small fw-semibold">{o.transaction_id}</td>
                          <td className="small">{o.user?.name || 'Customer'}</td>
                          <td className="small fw-bold">Rp {o.total_amount?.toLocaleString('id-ID')}</td>
                          <td>
                            <span 
                              className={`badge ${
                                o.status === 'completed'
                                  ? 'bg-success'
                                  : o.status === 'pending'
                                  ? 'bg-warning text-dark'
                                  : o.status === 'cancelled'
                                  ? 'bg-danger'
                                  : 'bg-info'
                              }`}
                            >
                              {o.status}
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
  );
};

export default Dashboard;
