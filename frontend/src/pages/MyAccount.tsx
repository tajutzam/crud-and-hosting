import React, { useState, useEffect } from "react";
import { BiEdit, BiSave, BiX } from "react-icons/bi";
import "../styles/MyAccount.css";
import BootstrapModal from "../components/BootstrapModal";
import Guest from "../assets/Guest.png";

interface UserData {
  id?: number;
  name: string;
  email?: string;
  dateOfBirth?: string;
  imageUrl?: string;
  memberSince?: string;
  addresses?: Address[];
  transactions?: Transaction[];
}

interface Address {
  id?: number;
  street: string;
  city: string;
  postalCode: string;
  isPrimary?: boolean;
}

interface Transaction {
  id?: number;
  transactionId: string;
  amount: number;
  date: string;
  status: string;
}

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

function MyAccount() {
  const [userData, setUserData] = useState<UserData>({
    name: "Loading...",
    dateOfBirth: "Loading...",
    imageUrl: Guest,
    memberSince: "Loading...",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<Partial<UserData>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulasi fetching dari localStorage/API
      const token = localStorage.getItem("token");
      if (!token) {
        // User belum login, tampilkan data default
        const defaultData: UserData = {
          name: "Guest User",
          dateOfBirth: "20 November 2005",
          imageUrl: Guest,
          memberSince: "20 November 2025",
          addresses: [
            { street: "Jl. Contoh No. 123", city: "Jakarta", postalCode: "12345", isPrimary: true },
            { street: "Jl. Sample No. 456", city: "Bandung", postalCode: "67890", isPrimary: false },
          ],
          transactions: [
            { transactionId: "#TRX001", amount: 150000, date: "12 Okt 2025", status: "Completed" },
            { transactionId: "#TRX002", amount: 250000, date: "10 Okt 2025", status: "Processing" },
            { transactionId: "#TRX003", amount: 75000, date: "8 Okt 2025", status: "Completed" },
          ],
        };
        setUserData(defaultData);
        return;
      }

      // Jika ada token, fetch dari API
      const response = await fetch(`${API_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) throw new Error("Gagal mengambil data profil");
      
      const result = await response.json();
      const data = result.data;
      
      setUserData({
        name: data.name || "Guest User",
        email: data.email,
        dateOfBirth: data.dateOfBirth || "20 November 2005",
        imageUrl: data.profilePicture || Guest,
        memberSince: data.memberSince || "20 November 2025",
        addresses: data.addresses || [],
        transactions: data.transactions || [],
      });
    } catch (err: any) {
      console.error("Error fetching user data:", err);
      setError(err.message || "Gagal memuat data profil");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleOpenEditModal = () => {
    setEditingData({
      name: userData.name,
      phone: userData.phone,
      dateOfBirth: userData.dateOfBirth,
    });
    setSaveError(null);
    setSaveSuccess(false);
    setEditModalOpen(true);
  };

  const handleUpdateProfile = async () => {
    try {
      setSaving(true);
      setSaveError(null);
      
      const token = localStorage.getItem("token");
      if (!token) {
        setSaveError("Anda harus login terlebih dahulu");
        return;
      }

      const response = await fetch(`${API_URL}/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menyimpan data");
      }

      const result = await response.json();
      
      setUserData((prev) => ({
        ...prev,
        name: editingData.name || prev.name,
        phone: editingData.phone || prev.phone,
        dateOfBirth: editingData.dateOfBirth || prev.dateOfBirth,
      }));

      setSaveSuccess(true);
      setTimeout(() => {
        setEditModalOpen(false);
        setSaveSuccess(false);
      }, 1500);
    } catch (err: any) {
      setSaveError(err.message || "Gagal menyimpan data");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div>
        <div className="container-xl d-flex flex-column pt-5">
          <p className="fs-1 fw-bold text-light text-center mt-5">My Account</p>
          <div className="text-center py-5">
            <div className="spinner-border text-light" role="status"></div>
            <p className="mt-2 text-light">Memuat data profil...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="container-xl d-flex flex-column pt-5">
          <p className="fs-1 fw-bold text-light text-center mt-5">My Account</p>
          <div className="alert alert-danger m-4">
            <p>{error}</p>
            <button className="btn btn-sm btn-outline-danger" onClick={fetchUserData}>
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="container-xl d-flex flex-column pt-5">
        <p className="fs-1 fw-bold text-light text-center mt-5">My Account</p>
        
        {/* Profile Section */}
        <div className="profile m-auto mb-5 d-none d-md-flex position-relative">
          <button
            className="btn btn-sm btn-outline-secondary position-absolute top-0 end-0 m-2"
            onClick={handleOpenEditModal}
            title="Edit Profile"
          >
            <BiEdit size={14} />
            Edit
          </button>
          <div className="col-5">
            <div className="profile-picture p-0">
              <img src={userData.imageUrl} alt="profile picture" />
            </div>
          </div>
          <div className="col-7 d-flex flex-column p-2">
            <p className="fs-5 fw-bold mb-1">{userData.name}</p>
            {userData.email && <p className="text-muted mb-1">{userData.email}</p>}
            {userData.phone && <p className="text-muted mb-1">📞 {userData.phone}</p>}
            <p className="mb-2">
              <strong>Tanggal Lahir:</strong> {userData.dateOfBirth}
            </p>
            <p className="mt-auto text-muted">
              <small>Member Since: {userData.memberSince}</small>
            </p>
          </div>
        </div>
        
        {/* Mobile Profile Section */}
        <div className="profile-small m-auto mb-5 d-flex d-md-none position-relative">
          <button
            className="btn btn-sm btn-outline-secondary position-absolute top-0 end-0 m-2"
            onClick={handleOpenEditModal}
            title="Edit Profile"
          >
            <BiEdit size={14} />
            Edit
          </button>
          <div className="row">
            <div className="col-12 col-sm-5">
              <div className="profile-picture p-0 ps-5">
                <img src={userData.imageUrl} alt="profile picture" />
              </div>
            </div>
            <div className="col-12 col-sm-7 d-flex flex-column p-5 p-sm-1">
              <p className="fs-5 fw-bold mb-1">{userData.name}</p>
              {userData.email && <p className="text-muted mb-1">{userData.email}</p>}
              {userData.phone && <p className="text-muted mb-1">📞 {userData.phone}</p>}
              <p className="mb-2">
                <strong>Tanggal Lahir:</strong> {userData.dateOfBirth}
              </p>
              <p className="mt-auto text-muted">
                <small>Member Since: {userData.memberSince}</small>
              </p>
            </div>
          </div>
        </div>
        
        {/* Address and Transactions */}
        <div className="row">
          {/* Saved Addresses */}
          <div className="col-12 col-md-6 d-flex flex-column align-items-center">
            <p className="fs-4 fw-semibold text-light mb-2">Alamat Tersimpan</p>
            <div className="whitefield mb-5 p-3 w-100">
              {userData.addresses && userData.addresses.length > 0 ? (
                userData.addresses.map((address, index) => (
                  <div key={address.id || index} className="mb-3 p-3 bg-light rounded border">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <strong className="text-dark">
                        {address.name || `Alamat ${index + 1}`}
                        {address.isPrimary && <span className="badge bg-primary ms-2">Utama</span>}
                      </strong>
                    </div>
                    {address.phone && <div className="small text-muted mb-1">📞 {address.phone}</div>}
                    <div className="text-muted small">
                      {address.fullAddress || `${address.street}, ${address.city} - ${address.postalCode}`}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted text-center p-3">Belum ada alamat tersimpan</p>
              )}
            </div>
          </div>
          
          {/* Transaction History */}
          <div className="col-12 col-md-6 d-flex flex-column align-items-center">
            <p className="fs-4 fw-semibold text-light mb-2">Riwayat Transaksi</p>
            <div className="whitefield mb-5 p-3 w-100">
              {userData.transactions && userData.transactions.length > 0 ? (
                userData.transactions.map((transaction, index) => (
                  <div key={transaction.id || index} className="mb-3 p-3 bg-light rounded border">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <strong className="text-dark font-monospace">
                        #{transaction.transactionId}
                      </strong>
                      <span 
                        className={`badge ${
                          transaction.status === "Completed" 
                            ? "bg-success" 
                            : transaction.status === "Processing"
                            ? "bg-primary"
                            : transaction.status === "Cancelled"
                            ? "bg-danger"
                            : "bg-warning"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold text-primary">
                        {formatCurrency(transaction.amount)}
                      </span>
                      <small className="text-muted">{transaction.fullDate || transaction.date}</small>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted text-center p-3">Belum ada riwayat transaksi</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <BootstrapModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Profil"
        size="md"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setEditModalOpen(false)}
              disabled={saving}
            >
              Batal
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleUpdateProfile}
              disabled={saving}
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </>
        }
      >
        {saveSuccess && (
          <div className="alert alert-success mb-3">
            ✓ Profil berhasil diperbarui
          </div>
        )}
        {saveError && (
          <div className="alert alert-danger mb-3">
            ✗ {saveError}
          </div>
        )}
        
        <div className="mb-3">
          <label className="form-label fw-semibold">Nama</label>
          <input
            type="text"
            className="form-control"
            value={editingData.name || ""}
            onChange={(e) => setEditingData({ ...editingData, name: e.target.value })}
            placeholder="Nama lengkap"
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Email</label>
          <input
            type="email"
            className="form-control"
            value={userData.email || ""}
            disabled
            placeholder="Email tidak dapat diubah"
          />
          <small className="text-muted">Email tidak dapat diubah</small>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">No. Telepon</label>
          <input
            type="tel"
            className="form-control"
            value={editingData.phone || ""}
            onChange={(e) => setEditingData({ ...editingData, phone: e.target.value })}
            placeholder="08xx xxxx xxxx"
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Tanggal Lahir</label>
          <input
            type="date"
            className="form-control"
            value={editingData.dateOfBirth ? new Date(editingData.dateOfBirth).toISOString().split('T')[0] : ""}
            onChange={(e) => setEditingData({ ...editingData, dateOfBirth: e.target.value })}
          />
        </div>
      </BootstrapModal>
    </div>
  );
}

export default MyAccount;
