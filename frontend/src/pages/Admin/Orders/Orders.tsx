import React, { useState, useEffect } from "react";
import {
  BiSearch,
  BiSortAlt2,
  BiFilter,
  BiShow,
  BiPencil,
  BiTrash,
  BiRefresh,
  BiReceipt,
  BiCheckCircle,
  BiX,
} from "react-icons/bi";

import BootstrapModal from "../../../components/BootstrapModal";
import orderService from "../../../services/orderService";

const BACKEND_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace(/\/api\/?$/, '');

export interface OrderItem {
  id: number;
  order_id: number;
  product_id?: number | null;
  product_variant_id?: number | null;
  product_name: string;
  variant_name?: string | null;
  quantity: number;
  price: number;
  subtotal: number;
  product?: {
    id: number;
    name: string;
    image?: string;
  };
}

export interface Payment {
  id: number;
  user_id: number;
  order_id: number;
  amount: number;
  payment_proof?: string | null;
  created_at?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Order {
  id: number;
  transaction_id: string;
  user_id: number;
  total_amount: number;
  shipping_cost?: number;
  status: string;
  is_reseller: boolean | number;
  created_at: string;
  updated_at?: string;
  user?: User;
  payment?: Payment;
  items?: OrderItem[];
}

interface ProofImageProps {
  src: string;
  onClick: () => void;
}

const ProofImage: React.FC<ProofImageProps> = ({ src, onClick }) => {
  const [failed, setFailed] = useState<boolean>(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (failed) {
    return (
      <div className="alert alert-danger small mb-0 text-start">
        <div className="fw-semibold mb-1">Gambar gagal dimuat dari:</div>
        <a href={src} target="_blank" rel="noreferrer" className="text-break">
          {src}
        </a>
        <div className="mt-2">
          Buka link di atas. Jika 404, jalankan <code>php artisan storage:link</code> dan pastikan
          file ada di <code>storage/app/public/payment_proofs</code>.
        </div>
      </div>
    );
  }

  return (
    <>
      <img
        src={src}
        alt="Bukti Transfer"
        className="img-fluid rounded shadow-sm"
        style={{ maxHeight: "300px", objectFit: "contain", cursor: "pointer" }}
        onClick={onClick}
        onError={() => setFailed(true)}
      />
      <div className="small text-muted mt-2">Klik gambar untuk memperbesar</div>
    </>
  );
};

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false);
  const [statusModalOpen, setStatusModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [targetStatus, setTargetStatus] = useState<string>("pending");
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await orderService.getAllOrders(statusFilter);
      const data = res.orders || res;
      setOrders(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Failed to fetch orders:", err);
      setError(err.message || "Gagal memuat data pesanan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenStatusModal = (order: Order) => {
    setSelectedOrder(order);
    setTargetStatus(order.status);
    setStatusModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    try {
      setActionLoading(true);
      const res = await orderService.updateOrderStatus(selectedOrder.id, targetStatus);
      showToast(`Status pesanan #${selectedOrder.transaction_id} berhasil diperbarui!`);
      setStatusModalOpen(false);
      const updatedOrder = res.order;
      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? { ...o, ...updatedOrder, status: targetStatus } : o))
      );
    } catch (err: any) {
      alert(err.message || "Gagal mengubah status pesanan.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenDeleteModal = (order: Order) => {
    setSelectedOrder(order);
    setDeleteModalOpen(true);
  };

  const handleDeleteOrder = async () => {
    if (!selectedOrder) return;
    try {
      setActionLoading(true);
      await orderService.deleteOrder(selectedOrder.id);
      showToast(`Pesanan #${selectedOrder.transaction_id} berhasil dihapus.`);
      setDeleteModalOpen(false);
      setOrders((prev) => prev.filter((o) => o.id !== selectedOrder.id));
    } catch (err: any) {
      alert(err.message || "Gagal menghapus pesanan.");
    } finally {
      setActionLoading(false);
    }
  };

  const getProofUrl = (path?: string | null) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    const clean = path.replace(/^\/+/, "");
    if (clean.startsWith("storage/")) return `${BACKEND_URL}/${clean}`;
    return `${BACKEND_URL}/storage/${clean}`;
  };

  const renderStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <span className="badge bg-success text-white px-2 py-1 rounded-pill">Completed</span>;
      case "processing":
        return <span className="badge bg-primary text-white px-2 py-1 rounded-pill">Processing</span>;
      case "cancelled":
        return <span className="badge bg-danger text-white px-2 py-1 rounded-pill">Cancelled</span>;
      case "pending":
      default:
        return <span className="badge bg-warning text-dark px-2 py-1 rounded-pill">Pending</span>;
    }
  };

  const filteredOrders = orders
    .filter((order) => {
      const q = searchTerm.toLowerCase();
      const matchTrx = order.transaction_id?.toLowerCase().includes(q);
      const matchName = order.user?.name?.toLowerCase().includes(q);
      const matchEmail = order.user?.email?.toLowerCase().includes(q);
      return matchTrx || matchName || matchEmail;
    })
    .sort((a, b) => {
      if (sortOrder === "desc") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
    });

  return (
    <div className="container-fluid mt-4">
      <div className="container-xl py-5 mt-5">
        {toastMessage && (
          <div
            className="alert alert-success alert-dismissible fade show shadow-sm position-fixed top-0 end-0 m-4"
            style={{ zIndex: 1060 }}
            role="alert"
          >
            <BiCheckCircle className="me-2 fs-5" />
            {toastMessage}
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold text-dark mb-1">Manajemen Pesanan (Orders)</h4>
            <p className="text-muted small mb-0">Kelola dan pantau seluruh pesanan pelanggan secara realtime</p>
          </div>
          <button
            className="btn btn-outline-secondary d-flex align-items-center gap-2"
            onClick={fetchOrders}
            disabled={loading}
          >
            <BiRefresh className={loading ? "spin" : ""} size={18} />
            Muat Ulang
          </button>
        </div>

        <div className="bg-white p-4 rounded-3 shadow-sm">
          <div className="toolbar-container d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4 px-3 py-2">
            <div className="d-flex align-items-center flex-grow-1" style={{ minWidth: "220px" }}>
              <BiSearch className="text-muted me-2 fs-5" />
              <input
                type="text"
                className="form-control border-0 bg-transparent shadow-none"
                placeholder="Cari ID Transaksi / Nama Pelanggan / Email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="d-flex gap-2 align-items-center">
              <div className="d-flex align-items-center gap-1 text-muted">
                <BiFilter size={18} />
                <select
                  className="form-select form-select-sm border-0 bg-transparent shadow-none text-muted fw-semibold"
                  style={{ width: "auto", cursor: "pointer" }}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Semua Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <button
                className="icon-btn px-2 py-1"
                title={sortOrder === "desc" ? "Urutkan Terlama" : "Urutkan Terbaru"}
                onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
              >
                <BiSortAlt2 size={20} />
                <span className="small ms-1 text-muted">{sortOrder === "desc" ? "Terbaru" : "Terlama"}</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2 text-muted">Memuat data pesanan...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger my-3">
              <p className="mb-2">{error}</p>
              <button className="btn btn-sm btn-outline-danger" onClick={fetchOrders}>
                Coba Lagi
              </button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <BiReceipt size={48} className="text-secondary mb-2" />
              <h6 className="fw-bold">Tidak ada pesanan ditemukan</h6>
              <p className="small">
                {searchTerm || statusFilter !== "all"
                  ? "Coba ubah kata kunci pencarian atau filter status."
                  : "Belum ada pesanan yang masuk dari pelanggan."}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped align-middle custom-table">
                <thead>
                  <tr>
                    <th scope="col" className="ps-3">ID Transaksi</th>
                    <th scope="col">Pelanggan</th>
                    <th scope="col">Tanggal</th>
                    <th scope="col">Total</th>
                    <th scope="col">Bukti Bayar</th>
                    <th scope="col">Status</th>
                    <th scope="col" className="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const proofUrl = getProofUrl(order.payment?.payment_proof);
                    return (
                      <tr key={order.id}>
                        <td className="ps-3">
                          <span className="fw-bold text-dark font-monospace">#{order.transaction_id}</span>
                          {order.is_reseller && (
                            <span className="badge bg-info text-dark ms-2 small">Reseller</span>
                          )}
                        </td>
                        <td>
                          <div className="fw-semibold text-dark">{order.user?.name || "Pelanggan"}</div>
                          <div className="small text-muted">{order.user?.email || "-"}</div>
                        </td>
                        <td>
                          {order.created_at
                            ? new Date(order.created_at).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "-"}
                        </td>
                        <td>
                          <span className="fw-bold text-dark">
                            Rp {(order.total_amount ?? 0).toLocaleString("id-ID")}
                          </span>
                        </td>
                        <td>
                          {proofUrl ? (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary py-0 px-2 small"
                              onClick={() => setPreviewImage(proofUrl)}
                            >
                              Lihat Bukti
                            </button>
                          ) : (
                            <span className="text-muted small fst-italic">Belum upload</span>
                          )}
                        </td>
                        <td>{renderStatusBadge(order.status)}</td>
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <button
                              className="action-btn btn-view"
                              title="Lihat Detail Pesanan"
                              onClick={() => {
                                setSelectedOrder(order);
                                setDetailModalOpen(true);
                              }}
                            >
                              <BiShow size={16} />
                            </button>
                            <button
                              className="action-btn btn-edit"
                              title="Ubah Status Pesanan"
                              onClick={() => handleOpenStatusModal(order)}
                            >
                              <BiPencil size={16} />
                            </button>
                            <button
                              className="action-btn btn-delete"
                              title="Hapus Pesanan"
                              onClick={() => handleOpenDeleteModal(order)}
                            >
                              <BiTrash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <BootstrapModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title={`Detail Pesanan #${selectedOrder?.transaction_id}`}
        size="lg"
        footer={
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setDetailModalOpen(false)}
          >
            Tutup
          </button>
        }
      >
        {selectedOrder && (
          <>
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <div className="p-3 bg-light rounded">
                  <h6 className="fw-bold mb-2">Informasi Pembeli</h6>
                  <div><strong>Nama:</strong> {selectedOrder.user?.name || "-"}</div>
                  <div><strong>Email:</strong> {selectedOrder.user?.email || "-"}</div>
                  <div>
                    <strong>Tipe Akun:</strong>{" "}
                    {selectedOrder.is_reseller ? (
                      <span className="badge bg-info text-dark">Reseller</span>
                    ) : (
                      "Pelanggan Biasa"
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-3 bg-light rounded">
                  <h6 className="fw-bold mb-2">Status & Waktu</h6>
                  <div>
                    <strong>Status:</strong> {renderStatusBadge(selectedOrder.status)}
                  </div>
                  <div>
                    <strong>Waktu Pesan:</strong>{" "}
                    {selectedOrder.created_at
                      ? new Date(selectedOrder.created_at).toLocaleString("id-ID")
                      : "-"}
                  </div>
                  <div>
                    <strong>Total Pembayaran:</strong>{" "}
                    <span className="fw-bold text-danger">
                      Rp {(selectedOrder.total_amount ?? 0).toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <h6 className="fw-bold mb-3">Item yang Dipesan</h6>
            <div className="table-responsive border rounded mb-4">
              <table className="table table-sm align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Produk</th>
                    <th>Varian</th>
                    <th className="text-center">Jumlah</th>
                    <th className="text-end">Harga Satuan</th>
                    <th className="text-end">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item) => (
                      <tr key={item.id}>
                        <td className="fw-semibold">{item.product_name}</td>
                        <td>{item.variant_name || "-"}</td>
                        <td className="text-center">{item.quantity}</td>
                        <td className="text-end">
                          Rp {(item.price ?? 0).toLocaleString("id-ID")}
                        </td>
                        <td className="text-end fw-bold">
                          Rp {((item.price ?? 0) * item.quantity).toLocaleString("id-ID")}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-3 text-muted">
                        Tidak ada rincian item produk.
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="table-light">
                  {selectedOrder.shipping_cost ? (
                    <tr>
                      <td colSpan={4} className="text-end fw-semibold">Biaya Ongkir:</td>
                      <td className="text-end fw-bold">
                        Rp {(selectedOrder.shipping_cost ?? 0).toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ) : null}
                  <tr>
                    <td colSpan={4} className="text-end fw-bold fs-6">Grand Total:</td>
                    <td className="text-end fw-bold fs-6 text-danger">
                      Rp {(selectedOrder.total_amount ?? 0).toLocaleString("id-ID")}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <h6 className="fw-bold mb-2">Bukti Pembayaran</h6>
            {selectedOrder.payment?.payment_proof ? (
              <div className="text-center p-3 border rounded bg-light">
                <ProofImage
                  src={getProofUrl(selectedOrder.payment.payment_proof) || ""}
                  onClick={() => setPreviewImage(getProofUrl(selectedOrder.payment?.payment_proof) || null)}
                />
              </div>
            ) : (
              <div className="alert alert-warning py-2 small mb-0">
                Pelanggan belum mengunggah bukti pembayaran.
              </div>
            )}
          </>
        )}
      </BootstrapModal>

      {/* Status Modal */}
      <BootstrapModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title="Ubah Status Pesanan"
        size="md"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setStatusModalOpen(false)}
              disabled={actionLoading}
            >
              Batal
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleUpdateStatus}
              disabled={actionLoading}
            >
              {actionLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </>
        }
      >
        {selectedOrder && (
          <>
            <p className="mb-3">
              Pilih status baru untuk pesanan <strong>#{selectedOrder.transaction_id}</strong>:
            </p>
            <div className="mb-3">
              <label className="form-label fw-semibold">Status Pesanan</label>
              <select
                className="form-select"
                value={targetStatus}
                onChange={(e) => setTargetStatus(e.target.value)}
              >
                <option value="pending">Pending (Menunggu Verifikasi)</option>
                <option value="processing">Processing (Sedang Diproses)</option>
                <option value="completed">Completed (Selesai / Terkirim)</option>
                <option value="cancelled">Cancelled (Dibatalkan)</option>
              </select>
            </div>
          </>
        )}
      </BootstrapModal>

      {/* Delete Modal */}
      <BootstrapModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Konfirmasi Hapus Pesanan"
        size="md"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setDeleteModalOpen(false)}
              disabled={actionLoading}
            >
              Batal
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDeleteOrder}
              disabled={actionLoading}
            >
              {actionLoading ? "Menghapus..." : "Hapus Pesanan"}
            </button>
          </>
        }
      >
        {selectedOrder && (
          <>
            <p className="mb-0">
              Apakah Anda yakin ingin menghapus pesanan <strong>#{selectedOrder.transaction_id}</strong> milik{" "}
              <strong>{selectedOrder.user?.name || "Pelanggan"}</strong>?
            </p>
            <div className="alert alert-warning mt-3 mb-0 small">
              Tindakan ini akan menghapus data transaksi, bukti pembayaran, dan rincian item secara permanen.
            </div>
          </>
        )}
      </BootstrapModal>

      {/* Preview Image Modal */}
      <BootstrapModal
        isOpen={!!previewImage}
        onClose={() => setPreviewImage(null)}
        size="lg"
        title="Preview Bukti Pembayaran"
      >
        {previewImage && (
          <div className="text-center">
            <img
              src={previewImage}
              alt="Bukti Transfer Preview"
              className="img-fluid rounded mx-auto shadow"
              style={{ maxHeight: "70vh" }}
            />
          </div>
        )}
      </BootstrapModal>
    </div>
  );
};

export default Orders;
