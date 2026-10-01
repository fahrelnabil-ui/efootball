import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiFetch, API_BASE, getImageUrl } from '../../services/api';
import RevenueChart from '../../components/admin/RevenueChart';
import {
  ShieldAlert,
  Users,
  Package,
  ShoppingBag,
  CreditCard,
  AlertCircle,
  Wallet,
  Settings,
  CheckCircle2,
  XCircle,
  Eye,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Send,
  PlusCircle,
  Upload,
  Edit,
  Trash2,
  Image as ImageIcon,
  Gamepad2,
  ExternalLink,
  MessageSquare,
  Trophy,
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [rejectModalListing, setRejectModalListing] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form State for Adding / Editing Stock Listing
  const [stockForm, setStockForm] = useState({
    title: '',
    price: '',
    platform: 'Android',
    status: 'approved',
    stock: 1,
    playerCount: '',
    epicCount: '',
    bigTimeCount: '',
    gpAmount: '',
    coinAmount: '',
    squadInfo: '',
    description: '',
    loginType: 'Konami ID',
    credentials: '',
    imageUrl: '',
  });

  const [msg, setMsg] = useState({ type: '', text: '' });

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [dashRes, usrRes, listRes, ordRes] = await Promise.all([
        apiFetch('/admin/dashboard'),
        apiFetch('/admin/users'),
        apiFetch('/listings?status=all'),
        apiFetch('/orders/my'),
      ]);

      if (dashRes.success) setStats(dashRes.stats);
      if (usrRes.success) setUsersList(usrRes.data);
      if (listRes.success) setListings(listRes.data);
      if (ordRes.success) setOrders(ordRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Handle Photo File Upload ONLY
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    setMsg({ type: '', text: '' });

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result;
      try {
        const formData = new FormData();
        formData.append('image', file);
        const token = localStorage.getItem('efootmarket_token');
        const uploadUrl = API_BASE.startsWith('http') ? `${API_BASE}/upload` : '/api/upload';

        const response = await fetch(uploadUrl, {
          method: 'POST',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: formData,
        });

        const contentType = response.headers.get('content-type') || '';
        if (response.ok && contentType.includes('application/json')) {
          const data = await response.json();
          if (data.success && data.url) {
            setStockForm(prev => ({ ...prev, imageUrl: data.url }));
            setMsg({ type: 'success', text: 'Foto berhasil diunggah!' });
            return;
          }
        }
        setStockForm(prev => ({ ...prev, imageUrl: base64Data }));
        setMsg({ type: 'success', text: 'Foto berhasil dimuat (Base64)!' });
      } catch (err) {
        setStockForm(prev => ({ ...prev, imageUrl: base64Data }));
        setMsg({ type: 'success', text: 'Foto berhasil dimuat!' });
      } finally {
        setUploadingImage(false);
      }
    };
    reader.onerror = () => {
      setMsg({ type: 'error', text: 'Gagal membaca file gambar.' });
      setUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  // Submit Admin Stock (Create / Update)
  const handleSubmitStockForm = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });

    if (!stockForm.imageUrl) {
      setMsg({ type: 'error', text: 'Anda wajib mengunggah file foto/screenshot akun terlebih dahulu.' });
      return;
    }

    try {
      const payload = {
        ...stockForm,
        images: [stockForm.imageUrl],
      };

      let res;
      if (editingListing) {
        res = await apiFetch(`/admin/listings/${editingListing.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        res = await apiFetch('/admin/listings', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }

      if (res.success) {
        setMsg({ type: 'success', text: res.message });
        setShowAddStockModal(false);
        setEditingListing(null);
        resetStockForm();
        fetchAdminData();
      } else {
        setMsg({ type: 'error', text: res.message });
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    }
  };

  const resetStockForm = () => {
    setStockForm({
      title: '',
      price: '',
      platform: 'Android',
      status: 'approved',
      stock: 1,
      playerCount: '',
      epicCount: '',
      bigTimeCount: '',
      gpAmount: '',
      coinAmount: '',
      squadInfo: '',
      description: '',
      loginType: 'Konami ID',
      credentials: '',
      imageUrl: '',
    });
  };

  const handleOpenEdit = (item) => {
    setEditingListing(item);
    const primaryImg = item.images && item.images.length > 0 ? item.images[0].imageUrl : '';
    setStockForm({
      title: item.title,
      price: item.price,
      platform: item.platform,
      status: item.status || (item.stock <= 0 ? 'sold' : 'approved'),
      stock: item.stock !== undefined ? item.stock : 1,
      playerCount: item.playerCount ?? '',
      epicCount: item.epicCount ?? '',
      bigTimeCount: item.bigTimeCount ?? '',
      gpAmount: item.gpAmount ?? '',
      coinAmount: item.coinAmount ?? '',
      squadInfo: item.squadInfo || '',
      description: item.description || '',
      loginType: 'Konami ID',
      credentials: item.gameAccountDetail?.encryptedCredentials?.replace('ENC_', '') || '',
      imageUrl: primaryImg,
    });
    setShowAddStockModal(true);
  };

  const handleToggleSold = async (id, targetStatus) => {
    try {
      const res = await apiFetch(`/admin/listings/${id}/toggle-sold`, {
        method: 'PATCH',
        body: JSON.stringify({ status: targetStatus }),
      });
      if (res.success) {
        setMsg({ type: 'success', text: res.message });
        fetchAdminData();
      } else {
        setMsg({ type: 'error', text: res.message });
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    }
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus stok akun ini secara permanen?')) return;
    try {
      const res = await apiFetch(`/admin/listings/${id}`, { method: 'DELETE' });
      if (res.success) {
        setMsg({ type: 'success', text: res.message || 'Stok akun berhasil dihapus permanen.' });
        try {
          const localListings = JSON.parse(localStorage.getItem('efootmarket_local_listings') || '[]');
          const filtered = localListings.filter(item => item.id !== id);
          localStorage.setItem('efootmarket_local_listings', JSON.stringify(filtered));
        } catch (_) {}
        fetchAdminData();
      } else {
        setMsg({ type: 'error', text: res.message });
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    }
  };

  const handleApproveListing = async (listingId) => {
    try {
      const res = await apiFetch(`/listings/${listingId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'approved' }),
      });
      if (res.success) {
        setMsg({ type: 'success', text: 'Listing berhasil disetujui & tayang di marketplace.' });
        fetchAdminData();
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    }
  };

  const handleRejectListing = async () => {
    if (!rejectModalListing || !rejectionReason) return;

    try {
      const res = await apiFetch(`/listings/${rejectModalListing.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'rejected', rejectionReason }),
      });
      if (res.success) {
        setMsg({ type: 'success', text: 'Listing berhasil ditolak dengan alasan.' });
        setRejectModalListing(null);
        setRejectionReason('');
        fetchAdminData();
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    }
  };

  const handleAdminVerifyPayment = async (orderId) => {
    try {
      const res = await apiFetch(`/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'paid' }),
      });
      if (res.success) {
        setMsg({ type: 'success', text: 'Pembayaran diverifikasi! Lanjut ke proses penyerahan akun.' });
        fetchAdminData();
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    }
  };

  const handleAdminHandoverCredentials = async (orderId) => {
    try {
      const res = await apiFetch(`/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'handover' }),
      });
      if (res.success) {
        setMsg({ type: 'success', text: 'Kredensial diserahkan ke Pembeli! Status: Handover.' });
        fetchAdminData();
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    }
  };

  const handleToggleUserVerify = async (userId, currentVerified) => {
    try {
      const res = await apiFetch(`/admin/users/${userId}/verify`, {
        method: 'PATCH',
        body: JSON.stringify({ isVerified: !currentVerified }),
      });
      if (res.success) {
        setMsg({ type: 'success', text: 'Status verifikasi user diperbarui.' });
        fetchAdminData();
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-red-400">Akses Ditolak</h2>
        <p className="text-xs text-gray-400 mt-2">Area ini terbatas khusus untuk Admin REVE EFOOTBALL.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-amber-500/30 bg-slate-900/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4" /> Admin Control Panel
          </div>
          <h1 className="text-2xl font-black text-white">REVE EFOOTBALL Management System</h1>
          <p className="text-xs text-gray-400 mt-0.5">Kelola stok akun, upload foto file, verifikasi listing, & transaksi escrow.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEditingListing(null);
              resetStockForm();
              setShowAddStockModal(true);
            }}
            className="gradient-button px-5 py-3 rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-xl shadow-emerald-500/20"
          >
            <PlusCircle className="w-4 h-4" />
            Tambah Stok Akun Baru
          </button>
        </div>
      </div>

      {msg.text && (
        <div className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
          msg.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}>
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {msg.text}
        </div>
      )}

      {/* Main Admin Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-4 border border-gray-800 bg-slate-900/80 space-y-1 h-fit">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'overview' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-gray-300 hover:bg-slate-800'
              }`}
            >
              <ShieldAlert className="w-4 h-4" /> Overview System
            </button>

            <button
              onClick={() => setActiveTab('listings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'listings' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-gray-300 hover:bg-slate-800'
              }`}
            >
              <Package className="w-4 h-4" /> Kelola Stok Akun & Foto ({listings.length})
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'orders' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-gray-300 hover:bg-slate-800'
              }`}
            >
              <ShoppingBag className="w-4 h-4" /> Workflow Escrow Orders
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'users' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-gray-300 hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4" /> Kelola Users ({usersList.length})
            </button>
          </div>

          {/* eFootball Stadium Themed Background Banner Card */}
          <div className="relative rounded-2xl overflow-hidden border border-emerald-500/40 bg-slate-900 shadow-2xl group">
            {/* Background Stadium Image with Dark Gradient Overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:scale-105 transition-transform duration-500"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-900/60" />

            <div className="relative p-5 space-y-4 z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 via-cyan-400 to-yellow-400 p-0.5 shadow-lg shadow-emerald-500/30 shrink-0 overflow-hidden">
                  <img
                    src="/reve-logo.png"
                    alt="REVE EFOOTBALL"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div>
                  <div className="text-xs font-black text-white tracking-tight flex items-center gap-1">
                    REVE <span className="text-emerald-400">EFOOTBALL</span>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Admin Control Hub
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="bg-slate-950/80 border border-gray-800 rounded-xl p-2.5 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <div className="text-[10px] text-gray-400">Verifier Akun eFootball</div>
                    <div className="text-[11px] font-bold text-amber-300">Epic & Big Time Boosted</div>
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-gray-800 rounded-xl p-2.5 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-[10px] text-gray-400">Garansi Escrow</div>
                    <div className="text-[11px] font-bold text-emerald-300">100% Proteksi Konami ID</div>
                  </div>
                </div>
              </div>

              <div className="pt-1 space-y-2">
                <a
                  href="/marketplace"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 bg-slate-950 hover:bg-slate-800 border border-emerald-500/40 text-emerald-400 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Lihat Live Katalog
                </a>

                <button
                  onClick={() => window.open('https://wa.me/6285189441644?text=Halo%20Admin%20REVE%20EFOOTBALL', '_blank')}
                  className="w-full py-2 gradient-button rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Admin
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Panel */}
        <div className="md:col-span-3 space-y-6">
          {/* TAB 1: OVERVIEW METRICS & QUICK EDIT LISTINGS */}
          {activeTab === 'overview' && stats && (
            <div className="space-y-6">
              {/* Income & Revenue Analytics Chart */}
              <RevenueChart />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="glass-card p-5 rounded-2xl border border-gray-800">
                  <div className="text-[10px] text-gray-400">Total Users</div>
                  <div className="text-2xl font-bold text-white mt-1">{stats.totalUsers}</div>
                </div>

                <div className="glass-card p-5 rounded-2xl border border-gray-800">
                  <div className="text-[10px] text-gray-400">Stok Akun Total</div>
                  <div className="text-2xl font-bold text-emerald-400 mt-1">{stats.totalListings}</div>
                </div>

                <div className="glass-card p-5 rounded-2xl border border-gray-800">
                  <div className="text-[10px] text-gray-400">Pending Verification</div>
                  <div className="text-2xl font-bold text-amber-400 mt-1">{stats.pendingListings}</div>
                </div>

                <div className="glass-card p-5 rounded-2xl border border-gray-800">
                  <div className="text-[10px] text-gray-400">Transaksi Active</div>
                  <div className="text-2xl font-bold text-cyan-400 mt-1">{stats.activeOrders}</div>
                </div>
              </div>

              {/* Quick Listing Edit Section in Overview */}
              <div className="glass-card rounded-2xl p-6 border border-gray-800 bg-slate-900/80 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white">Kelola Stok & Edit Akun Cepat</h3>
                    <p className="text-xs text-gray-400">Klik tombol edit pada akun mana saja untuk mengubah harga, stok, atau screenshot foto.</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingListing(null);
                      resetStockForm();
                      setShowAddStockModal(true);
                    }}
                    className="gradient-button px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4" /> Tambah Stok Baru
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {listings.map(item => {
                    const primaryImg = item.images && item.images.length > 0
                      ? item.images[0].imageUrl
                      : 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800';

                    const isSold = item.status === 'sold' || (item.stock !== undefined && item.stock <= 0);

                    return (
                      <div key={item.id} className="bg-slate-950 p-4 rounded-2xl border border-gray-800 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:border-gray-700 transition-colors">
                        <div className="flex gap-4 items-center flex-1 min-w-0">
                          <div className="w-24 sm:w-28 h-20 rounded-xl overflow-hidden bg-slate-900 border border-gray-700 shrink-0 flex items-center justify-center p-1 relative">
                            <img
                              src={primaryImg}
                              alt=""
                              className={`w-full h-full object-contain rounded-lg ${isSold ? 'grayscale-[40%]' : ''}`}
                            />
                            {isSold && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl pointer-events-none">
                                <span className="bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow">SOLD</span>
                              </div>
                            )}
                          </div>
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-white leading-snug truncate sm:whitespace-normal">{item.title}</h4>
                              {isSold ? (
                                <span className="shrink-0 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-red-500/20 text-red-400 border border-red-500/30">
                                  🔴 TERJUAL
                                </span>
                              ) : (
                                <span className="shrink-0 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                  🟢 READY
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-emerald-400 font-extrabold flex flex-wrap items-center gap-x-3 gap-y-1">
                              <span>Rp {item.price.toLocaleString('id-ID')}</span>
                              <span className="text-gray-400 font-medium">Stok: <strong className={isSold ? 'text-red-400' : 'text-cyan-400'}>{item.stock ?? 1}</strong></span>
                              <span className="text-gray-400 font-medium">Device: {item.platform}</span>
                            </div>
                            <div className="text-[11px] text-gray-400 flex flex-wrap gap-2">
                              <span>Epic: {item.epicCount || 0}</span>
                              <span>|</span>
                              <span>Big Time: {item.bigTimeCount || 0}</span>
                              <span>|</span>
                              <span>Coins: {item.coinAmount?.toLocaleString('id-ID') || 0}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-800 shrink-0">
                          {isSold ? (
                            <button
                              onClick={() => handleToggleSold(item.id, 'approved')}
                              className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                              title="Tandai akun tersedia kembali"
                            >
                              Tandai Ready
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToggleSold(item.id, 'sold')}
                              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                              title="Tandai akun sebagai terjual (SOLD OUT)"
                            >
                              Tandai Terjual (SOLD)
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                          >
                            <Edit className="w-4 h-4" /> Edit Akun & Stok
                          </button>
                          <button
                            onClick={() => handleDeleteListing(item.id)}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2.5 rounded-xl text-xs border border-red-500/30 transition-colors"
                            title="Hapus Listing"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KELOLA STOK AKUN & UPLOAD FOTO */}
          {activeTab === 'listings' && (
            <div className="glass-card rounded-2xl p-6 border border-gray-800 bg-slate-900/80 space-y-6">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <h2 className="text-lg font-bold text-white">Katalog Stok Akun & Upload Foto</h2>
                <button
                  onClick={() => {
                    setEditingListing(null);
                    resetStockForm();
                    setShowAddStockModal(true);
                  }}
                  className="gradient-button px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" /> Tambah Stok Baru
                </button>
              </div>

              {listings.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {listings.map(item => {
                    const primaryImg = item.images && item.images.length > 0
                      ? item.images[0].imageUrl
                      : 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800';

                    const isSold = item.status === 'sold' || (item.stock !== undefined && item.stock <= 0);

                    return (
                      <div key={item.id} className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-gray-800 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:border-gray-700 transition-colors">
                        <div className="flex gap-4 items-center flex-1 min-w-0">
                          <div className="w-24 sm:w-28 h-20 rounded-xl overflow-hidden bg-slate-900 border border-gray-700 shrink-0 flex items-center justify-center p-1 relative">
                            <img
                              src={primaryImg}
                              alt=""
                              className={`w-full h-full object-contain rounded-lg ${isSold ? 'grayscale-[40%]' : ''}`}
                            />
                            {isSold && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl pointer-events-none">
                                <span className="bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow">SOLD</span>
                              </div>
                            )}
                          </div>
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-white leading-snug truncate sm:whitespace-normal">{item.title}</h4>
                              {isSold ? (
                                <span className="shrink-0 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-red-500/20 text-red-400 border border-red-500/30">
                                  🔴 TERJUAL
                                </span>
                              ) : (
                                <span className="shrink-0 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                  🟢 READY
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-emerald-400 font-extrabold flex flex-wrap items-center gap-x-3 gap-y-1">
                              <span>Rp {item.price.toLocaleString('id-ID')}</span>
                              <span className="text-gray-400 font-medium">Stok: <strong className={isSold ? 'text-red-400' : 'text-cyan-400'}>{item.stock ?? 1}</strong></span>
                              <span className="text-gray-400 font-medium">Device: {item.platform}</span>
                            </div>
                            <div className="text-[11px] text-gray-400 flex flex-wrap gap-2">
                              <span>Epic: {item.epicCount || 0}</span>
                              <span>|</span>
                              <span>Big Time: {item.bigTimeCount || 0}</span>
                              <span>|</span>
                              <span>Coins: {item.coinAmount?.toLocaleString('id-ID') || 0}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-800 shrink-0">
                          {item.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApproveListing(item.id)}
                                className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-2 rounded-xl text-xs font-bold"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => setRejectModalListing(item)}
                                className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-2 rounded-xl text-xs font-bold"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {isSold ? (
                            <button
                              onClick={() => handleToggleSold(item.id, 'approved')}
                              className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                              title="Tandai akun tersedia kembali"
                            >
                              Tandai Ready
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToggleSold(item.id, 'sold')}
                              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                              title="Tandai akun sebagai terjual (SOLD OUT)"
                            >
                              Tandai Terjual (SOLD)
                            </button>
                          )}

                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                          >
                            <Edit className="w-4 h-4" /> Edit Akun & Stok
                          </button>

                          <button
                            onClick={() => handleDeleteListing(item.id)}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2.5 rounded-xl text-xs border border-red-500/30 transition-colors"
                            title="Hapus Listing"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-gray-400">Belum ada stok akun.</p>
              )}
            </div>
          )}

          {/* TAB 3: WORKFLOW ESCROW ORDERS */}
          {activeTab === 'orders' && (
            <div className="glass-card rounded-2xl p-6 border border-gray-800 bg-slate-900/80 space-y-6">
              <h2 className="text-lg font-bold text-white border-b border-gray-800 pb-3">Kelola Workflow Transaksi Escrow</h2>

              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map(ord => (
                    <div key={ord.id} className="bg-slate-950 p-5 rounded-2xl border border-gray-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">{ord.orderNumber}</span>
                        <span className="text-xs font-bold text-cyan-400 uppercase">{ord.status}</span>
                      </div>

                      <div className="text-xs text-gray-300">
                        Total: <span className="font-bold text-emerald-400">Rp {ord.totalAmount.toLocaleString('id-ID')}</span> | Listing: {ord.listing?.title}
                      </div>

                      {ord.paymentProof && (
                        <div className="text-xs text-gray-400">
                          Bukti Bayar: <a href={ord.paymentProof} target="_blank" rel="noreferrer" className="text-emerald-400 underline">Lihat Screenshot Proof</a>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 pt-2">
                        {ord.status === 'payment_review' && (
                          <button
                            onClick={() => handleAdminVerifyPayment(ord.id)}
                            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-1.5 rounded-xl text-xs"
                          >
                            Verifikasi Pembayaran Diterima
                          </button>
                        )}

                        {(ord.status === 'paid' || ord.status === 'processing') && (
                          <button
                            onClick={() => handleAdminHandoverCredentials(ord.id)}
                            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-1.5 rounded-xl text-xs"
                          >
                            Serahkan Kredensial Akun Ke Pembeli
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">Tidak ada order aktif.</p>
              )}
            </div>
          )}

          {/* TAB 4: KELOLA USERS */}
          {activeTab === 'users' && (
            <div className="glass-card rounded-2xl p-6 border border-gray-800 bg-slate-900/80 space-y-6">
              <h2 className="text-lg font-bold text-white border-b border-gray-800 pb-3">Daftar Pengguna Terdaftar</h2>

              <div className="space-y-3">
                {usersList.map(usr => (
                  <div key={usr.id} className="bg-slate-950 p-4 rounded-xl border border-gray-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        {usr.name}
                        {usr.isVerified && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <div className="text-gray-400">{usr.email} • Role: {usr.role}</div>
                    </div>
                    <button
                      onClick={() => handleToggleUserVerify(usr.id, usr.isVerified)}
                      className={`px-3 py-1.5 rounded-xl font-bold ${
                        usr.isVerified ? 'bg-slate-800 text-gray-300' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {usr.isVerified ? 'Unverify' : 'Verify User'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: TAMBAH / EDIT STOK AKUN & UPLOAD FOTO FULL DISPLAY (RESPONSIVE NON-CUTOFF) */}
      {showAddStockModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md overflow-y-auto p-3 sm:p-6 flex items-start justify-center">
          <div className="relative max-w-3xl w-full max-h-[92vh] flex flex-col bg-slate-900 rounded-3xl border border-gray-800 shadow-2xl my-auto overflow-hidden">
            {/* Sticky Header - Always Visible at Top */}
            <div className="flex items-center justify-between p-5 border-b border-gray-800 bg-slate-900 shrink-0">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit className="w-5 h-5 text-emerald-400" />
                {editingListing ? 'Edit Stok Akun & Foto' : 'Tambah Stok Akun Baru'}
              </h3>
              <button
                onClick={() => setShowAddStockModal(false)}
                className="text-gray-400 hover:text-white p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form id="admin-stock-modal-form" onSubmit={handleSubmitStockForm} className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs">
              <div>
                <label className="font-semibold text-gray-300 mb-1 block">Judul Listing Stok Akun</label>
                <input
                  type="text"
                  required
                  value={stockForm.title}
                  onChange={(e) => setStockForm({ ...stockForm, title: e.target.value })}
                  placeholder="Contoh: Akun Starter Epic Messi 105 + Cruyff + 5000 Coins"
                  className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="font-semibold text-gray-300 mb-1 block">Harga (Rp)</label>
                  <input
                    type="number"
                    required
                    value={stockForm.price}
                    onChange={(e) => setStockForm({ ...stockForm, price: e.target.value })}
                    placeholder="1200000"
                    className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-300 mb-1 block">Device</label>
                  <select
                    value={stockForm.platform}
                    onChange={(e) => setStockForm({ ...stockForm, platform: e.target.value })}
                    className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Android">Android</option>
                    <option value="iOS">iOS</option>
                    <option value="PC">PC (Steam)</option>
                    <option value="Console">Console</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-gray-300 mb-1 block">Status Akun</label>
                  <select
                    value={stockForm.status || 'approved'}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      setStockForm(prev => ({
                        ...prev,
                        status: newStatus,
                        stock: newStatus === 'sold' ? 0 : (prev.stock > 0 ? prev.stock : 1),
                      }));
                    }}
                    className={`w-full bg-slate-950 border rounded-xl px-3.5 py-2.5 font-bold focus:outline-none ${
                      stockForm.status === 'sold'
                        ? 'border-red-500/50 text-red-400'
                        : 'border-emerald-500/50 text-emerald-400'
                    }`}
                  >
                    <option value="approved">🟢 Tersedia (Ready)</option>
                    <option value="sold">🔴 Terjual (SOLD OUT)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-gray-300 mb-1 block">Jumlah Stok</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={stockForm.stock}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setStockForm(prev => ({
                        ...prev,
                        stock: e.target.value,
                        status: val <= 0 ? 'sold' : (prev.status === 'sold' ? 'approved' : prev.status),
                      }));
                    }}
                    className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="font-semibold text-gray-300 mb-1 block">Jumlah Epic</label>
                  <input
                    type="number"
                    value={stockForm.epicCount}
                    onChange={(e) => setStockForm({ ...stockForm, epicCount: e.target.value })}
                    placeholder="18"
                    className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-300 mb-1 block">Jumlah Big Time</label>
                  <input
                    type="number"
                    value={stockForm.bigTimeCount}
                    onChange={(e) => setStockForm({ ...stockForm, bigTimeCount: e.target.value })}
                    placeholder="12"
                    className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-300 mb-1 block">Coins</label>
                  <input
                    type="number"
                    value={stockForm.coinAmount}
                    onChange={(e) => setStockForm({ ...stockForm, coinAmount: e.target.value })}
                    placeholder="1200"
                    className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-300 mb-1 block">GP Amount</label>
                  <input
                    type="number"
                    value={stockForm.gpAmount}
                    onChange={(e) => setStockForm({ ...stockForm, gpAmount: e.target.value })}
                    placeholder="2800000"
                    className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* UPLOAD FOTO FILE ONLY (FULL IMAGE DISPLAY NO CROPPING) */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-gray-800 space-y-4">
                <label className="font-bold text-emerald-400 block text-sm flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-emerald-400" />
                  Upload File Foto Screenshot Akun
                </label>

                <div className="border-2 border-dashed border-gray-700 hover:border-emerald-500 rounded-2xl p-5 text-center transition-colors bg-slate-900/50">
                  {stockForm.imageUrl ? (
                    <div className="space-y-4">
                      {/* FULL SCREENSHOT PREVIEW CONTAINER */}
                      <div className="relative w-full max-h-[420px] rounded-xl overflow-hidden border border-emerald-500/50 bg-slate-950 flex items-center justify-center p-1 shadow-2xl">
                        <img
                          src={stockForm.imageUrl}
                          alt="Preview Full Screenshot Squad"
                          className="w-full h-auto max-h-[400px] object-contain rounded-lg"
                        />
                        <span className="absolute bottom-2 right-2 bg-emerald-500 text-slate-950 px-3 py-1 rounded-md font-extrabold text-[10px] shadow-md">
                          Foto Full Ready
                        </span>
                      </div>
                      <label className="cursor-pointer inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold px-4 py-2.5 rounded-xl border border-gray-700 text-xs transition-colors">
                        <Upload className="w-4 h-4" />
                        Ganti Foto Lain
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="cursor-pointer space-y-2 block py-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div className="text-sm font-bold text-white">
                        {uploadingImage ? 'Sedang Mengunggah File...' : 'Klik Untuk Pilih File Foto Dari Komputer'}
                      </div>
                      <p className="text-xs text-gray-400">Format gambar: JPG, PNG, WEBP (Maksimal 10MB)</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-300 mb-1 block">Informasi Squad & Division</label>
                <input
                  type="text"
                  value={stockForm.squadInfo}
                  onChange={(e) => setStockForm({ ...stockForm, squadInfo: e.target.value })}
                  placeholder="Contoh: Division 1 Rank #420, Strength 3281, Manager Pep Guardiola 88"
                  className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-300 mb-1 block">Deskripsi Akun</label>
                <textarea
                  rows="3"
                  required
                  value={stockForm.description}
                  onChange={(e) => setStockForm({ ...stockForm, description: e.target.value })}
                  placeholder="Detail lengkap squad, piala, dan catatan tambahan..."
                  className="w-full bg-slate-950 border border-gray-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-gray-800 space-y-2">
                <label className="font-bold text-amber-400 block">Kredensial Login Akun Game (Disimpan Aman Terenkripsi)</label>
                <input
                  type="text"
                  value={stockForm.credentials}
                  onChange={(e) => setStockForm({ ...stockForm, credentials: e.target.value })}
                  placeholder="Konami ID / Email & Password"
                  className="w-full bg-slate-900 border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </form>

            {/* Sticky Action Footer */}
            <div className="p-4 sm:p-5 border-t border-gray-800 bg-slate-950 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowAddStockModal(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-300 hover:bg-slate-800 border border-gray-700 transition-colors"
              >
                Batal
              </button>
              <button
                form="admin-stock-modal-form"
                type="submit"
                className="gradient-button px-6 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                {editingListing ? 'Simpan Perubahan Stok & Foto' : 'Terbitkan Stok Akun Baru'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Rejection Reason */}
      {rejectModalListing && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-gray-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-white">Tolak Listing Akun</h3>
            <p className="text-xs text-gray-400">
              Admin wajib memberikan alasan penolakan yang jelas untuk listing "{rejectModalListing.title}".
            </p>

            <div>
              <label className="text-xs text-gray-300 mb-1 block">Alasan Penolakan (Wajib)</label>
              <textarea
                rows="3"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Contoh: Screenshot squad kurang jelas / Harga tidak masuk akal / Kredensial tidak valid."
                className="w-full bg-slate-950 border border-gray-800 rounded-xl p-3 text-xs text-white"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setRejectModalListing(null)}
                className="w-1/2 py-2 bg-slate-800 text-xs font-bold text-gray-300 rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={handleRejectListing}
                className="w-1/2 bg-red-500 text-xs font-bold text-white rounded-xl py-2"
              >
                Kirim Penolakan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
