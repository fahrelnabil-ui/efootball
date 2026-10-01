import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiFetch, API_BASE, getImageUrl } from '../../services/api';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  PlusCircle,
  RefreshCw,
  Wallet,
  AlertCircle,
  Star,
  Bell,
  User,
  LogOut,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Send,
  Upload,
  ArrowUpRight,
  TrendingUp,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react';

export default function UserDashboard() {
  const { user, logout, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const [orders, setOrders] = useState([]);
  const [listings, setListings] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form states
  const [sellForm, setSellForm] = useState({
    title: '',
    price: '',
    platform: 'Android',
    playerCount: '',
    epicCount: '',
    bigTimeCount: '',
    gpAmount: '',
    coinAmount: '',
    squadInfo: '',
    description: '',
    loginType: 'Konami ID',
    credentials: '',
    notes: '',
    imageUrl: '',
  });

  const [withdrawForm, setWithdrawForm] = useState({
    amount: '',
    bankName: 'BCA',
    accountNumber: '',
    accountHolder: '',
  });

  const [disputeForm, setDisputeForm] = useState({
    orderId: '',
    reason: 'Kredensial Login Tidak Sesuai',
    description: '',
  });

  const [reviewForm, setReviewForm] = useState({
    orderId: '',
    rating: 5,
    comment: '',
  });

  const [paymentProofUrl, setPaymentProofUrl] = useState('');
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState(null);

  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordRes, listRes, wdRes] = await Promise.all([
        apiFetch('/orders/my'),
        apiFetch('/listings?status=all'),
        apiFetch('/withdrawals/my'),
      ]);

      if (ordRes.success) setOrders(ordRes.data);
      if (listRes.success) {
        setListings(listRes.data.filter(l => l.userId === user?.id));
      }
      if (wdRes.success) setWithdrawals(wdRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Handle Photo File Upload with Base64 fallback
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    setStatusMsg({ type: '', text: '' });

    // Read as Base64 for instant preview and offline-safe fallback
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
            setSellForm(prev => ({ ...prev, imageUrl: data.url }));
            setStatusMsg({ type: 'success', text: 'Foto screenshot berhasil diunggah ke server!' });
            return;
          }
        }
        // Fallback to base64 if server upload endpoint failed or returned non-JSON
        setSellForm(prev => ({ ...prev, imageUrl: base64Data }));
        setStatusMsg({ type: 'success', text: 'Foto screenshot berhasil dimuat (Base64)!' });
      } catch (err) {
        // Fallback to base64
        setSellForm(prev => ({ ...prev, imageUrl: base64Data }));
        setStatusMsg({ type: 'success', text: 'Foto screenshot berhasil dimuat!' });
      } finally {
        setUploadingImage(false);
      }
    };
    reader.onerror = () => {
      setStatusMsg({ type: 'error', text: 'Gagal membaca file gambar.' });
      setUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateListing = async (isConsign = false) => {
    setStatusMsg({ type: '', text: '' });

    if (!sellForm.imageUrl) {
      setStatusMsg({ type: 'error', text: 'Anda wajib mengunggah file foto/screenshot akun terlebih dahulu.' });
      return;
    }

    try {
      const res = await apiFetch('/listings', {
        method: 'POST',
        body: JSON.stringify({
          ...sellForm,
          images: [sellForm.imageUrl],
          isConsignment: isConsign,
        }),
      });

      if (res.success) {
        setStatusMsg({ type: 'success', text: res.message });

        setSellForm({
          title: '',
          price: '',
          platform: 'Android',
          playerCount: '',
          epicCount: '',
          bigTimeCount: '',
          gpAmount: '',
          coinAmount: '',
          squadInfo: '',
          description: '',
          loginType: 'Konami ID',
          credentials: '',
          notes: '',
          imageUrl: '',
        });
        fetchData();
        setActiveTab('listings');
      } else {
        setStatusMsg({ type: 'error', text: res.message });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    }
  };

  const handleDeleteUserListing = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus akun ini?')) return;
    try {
      const res = await apiFetch(`/listings/${id}`, { method: 'DELETE' });
      if (res.success) {
        setStatusMsg({ type: 'success', text: res.message || 'Akun berhasil dihapus.' });
        try {
          const localListings = JSON.parse(localStorage.getItem('efootmarket_local_listings') || '[]');
          const filtered = localListings.filter(item => item.id !== id);
          localStorage.setItem('efootmarket_local_listings', JSON.stringify(filtered));
        } catch (_) {}
        fetchData();
      } else {
        setStatusMsg({ type: 'error', text: res.message });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    }
  };

  const handleUploadPaymentProof = async (e) => {
    e.preventDefault();
    if (!selectedOrderForPayment || !paymentProofUrl) return;

    try {
      const res = await apiFetch(`/orders/${selectedOrderForPayment.id}/payment`, {
        method: 'POST',
        body: JSON.stringify({ paymentProofUrl }),
      });

      if (res.success) {
        setStatusMsg({ type: 'success', text: res.message });
        setSelectedOrderForPayment(null);
        setPaymentProofUrl('');
        fetchData();
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    }
  };

  const handleConfirmBuyerReceipt = async (orderId) => {
    try {
      const res = await apiFetch(`/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'completed' }),
      });

      if (res.success) {
        setStatusMsg({ type: 'success', text: 'Konfirmasi serah-terima selesai! Transaksi ditutup.' });
        fetchData();
        refreshUser();
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    try {
      const res = await apiFetch('/withdrawals', {
        method: 'POST',
        body: JSON.stringify(withdrawForm),
      });

      if (res.success) {
        setStatusMsg({ type: 'success', text: res.message });
        setWithdrawForm({ amount: '', bankName: 'BCA', accountNumber: '', accountHolder: '' });
        fetchData();
        refreshUser();
      } else {
        setStatusMsg({ type: 'error', text: res.message });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    }
  };

  const handleSubmitDispute = async (e) => {
    e.preventDefault();
    try {
      const res = await apiFetch('/disputes', {
        method: 'POST',
        body: JSON.stringify(disputeForm),
      });

      if (res.success) {
        setStatusMsg({ type: 'success', text: res.message });
        setDisputeForm({ orderId: '', reason: 'Kredensial Login Tidak Sesuai', description: '' });
        fetchData();
      } else {
        setStatusMsg({ type: 'error', text: res.message });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const res = await apiFetch('/reviews', {
        method: 'POST',
        body: JSON.stringify(reviewForm),
      });

      if (res.success) {
        setStatusMsg({ type: 'success', text: res.message });
        setReviewForm({ orderId: '', rating: 5, comment: '' });
        fetchData();
      } else {
        setStatusMsg({ type: 'error', text: res.message });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-400 text-sm mb-4">Silakan login untuk mengakses Dashboard User.</p>
      </div>
    );
  }

  const totalBought = orders.filter(o => o.buyerId === user.id && o.status === 'completed').length;
  const totalSold = orders.filter(o => o.sellerId === user.id && o.status === 'completed').length;
  const activeListingsCount = listings.filter(l => l.status === 'approved' || l.status === 'active').length;
  const ongoingOrdersCount = orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-gray-800 bg-slate-900/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt=""
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400"
          />
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              Halo, {user.name ? user.name.replace(/eFootMarket/gi, 'REVE EFOOTBALL') : 'Admin REVE EFOOTBALL'}
              {user.isVerified && <ShieldCheck className="w-5 h-5 text-emerald-400" />}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">{user.email ? user.email.replace(/efootmarket\.com/gi, 'reveefootball.com') : 'admin@reveefootball.com'} • 1 Akun Universal (Pembeli & Penjual)</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3">
            <Wallet className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs text-gray-400">Saldo Penjualan</div>
              <div className="text-xl font-extrabold text-emerald-400">
                Rp {user.balance ? user.balance.toLocaleString('id-ID') : '0'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {statusMsg.text && (
        <div className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
          statusMsg.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}>
          <AlertCircle className="w-4 h-4 shrink-0" />
          {statusMsg.text}
        </div>
      )}

      {/* Main Dashboard Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="glass-card rounded-2xl p-4 border border-gray-800 bg-slate-900/80 space-y-1 h-fit">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'overview' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-gray-300 hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Overview Dashboard
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'orders' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-gray-300 hover:bg-slate-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> Pesanan Saya ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('listings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'listings' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-gray-300 hover:bg-slate-800'
            }`}
          >
            <Package className="w-4 h-4" /> Akun Saya ({listings.length})
          </button>

          <button
            onClick={() => setActiveTab('new_sell')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'new_sell' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-gray-300 hover:bg-slate-800'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-cyan-400" /> Jual Akun
          </button>

          <button
            onClick={() => setActiveTab('new_consign')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'new_consign' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-gray-300 hover:bg-slate-800'
            }`}
          >
            <RefreshCw className="w-4 h-4 text-amber-400" /> Titip Akun
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'wallet' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-gray-300 hover:bg-slate-800'
            }`}
          >
            <Wallet className="w-4 h-4 text-purple-400" /> Saldo & Pencairan
          </button>

          <button
            onClick={() => setActiveTab('disputes')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'disputes' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-gray-300 hover:bg-slate-800'
            }`}
          >
            <AlertCircle className="w-4 h-4 text-red-400" /> Komplain / Dispute
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'reviews' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-gray-300 hover:bg-slate-800'
            }`}
          >
            <Star className="w-4 h-4 text-amber-400" /> Review Transaksi
          </button>
        </div>

        {/* Content Tabs Area */}
        <div className="md:col-span-3 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="glass-card p-5 rounded-2xl border border-gray-800">
                  <div className="text-[10px] text-gray-400">Total Pembelian</div>
                  <div className="text-2xl font-bold text-white mt-1">{totalBought} Akun</div>
                </div>

                <div className="glass-card p-5 rounded-2xl border border-gray-800">
                  <div className="text-[10px] text-gray-400">Total Penjualan</div>
                  <div className="text-2xl font-bold text-white mt-1">{totalSold} Akun</div>
                </div>

                <div className="glass-card p-5 rounded-2xl border border-gray-800">
                  <div className="text-[10px] text-gray-400">Akun Aktif Live</div>
                  <div className="text-2xl font-bold text-emerald-400 mt-1">{activeListingsCount}</div>
                </div>

                <div className="glass-card p-5 rounded-2xl border border-gray-800">
                  <div className="text-[10px] text-gray-400">Transaksi Berjalan</div>
                  <div className="text-2xl font-bold text-cyan-400 mt-1">{ongoingOrdersCount}</div>
                </div>
              </div>

              {/* Recent Orders List */}
              <div className="glass-card rounded-2xl p-6 border border-gray-800 bg-slate-900/80 space-y-4">
                <h3 className="text-base font-bold text-white border-b border-gray-800 pb-3">Pesanan Terakhir</h3>
                {orders.length > 0 ? (
                  <div className="space-y-3">
                    {orders.slice(0, 3).map(ord => (
                      <div key={ord.id} className="bg-slate-950 p-4 rounded-xl border border-gray-800 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-white">{ord.orderNumber}</div>
                          <div className="text-gray-400 mt-0.5">{ord.listing?.title}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-emerald-400">Rp {ord.totalAmount.toLocaleString('id-ID')}</div>
                          <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-gray-300">
                            {ord.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">Belum ada pesanan aktif.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PESANAN SAYA (ORDERS) */}
          {activeTab === 'orders' && (
            <div className="glass-card rounded-2xl p-6 border border-gray-800 bg-slate-900/80 space-y-6">
              <h2 className="text-lg font-bold text-white border-b border-gray-800 pb-3">Daftar Pesanan & Status Escrow</h2>

              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map(ord => (
                    <div key={ord.id} className="bg-slate-950 p-5 rounded-2xl border border-gray-800 space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800 pb-3 gap-2">
                        <div>
                          <span className="text-xs text-gray-400">Order Number:</span>
                          <span className="text-sm font-bold text-white ml-2">{ord.orderNumber}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          ord.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          ord.status === 'handover' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                          ord.status === 'pending_payment' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          'bg-purple-500/20 text-purple-400'
                        }`}>
                          {ord.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div>
                          <div className="text-gray-400">Listing Akun:</div>
                          <div className="font-bold text-white">{ord.listing?.title}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Total Pembayaran:</div>
                          <div className="font-bold text-emerald-400 text-sm">Rp {ord.totalAmount.toLocaleString('id-ID')}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Metode Bayar:</div>
                          <div className="text-gray-200">{ord.paymentMethod}</div>
                        </div>
                      </div>

                      {ord.buyerId === user.id && (ord.status === 'handover' || ord.status === 'completed') && ord.listing?.gameAccountDetail && (
                        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 text-xs space-y-2">
                          <div className="font-bold text-cyan-400 flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4" /> Kredensial Login Akun Game (Resmi Escrow Admin)
                          </div>
                          <div className="text-gray-200 font-mono bg-slate-950 p-2.5 rounded-lg border border-gray-800">
                            {ord.listing.gameAccountDetail.encryptedCredentials}
                          </div>
                          <p className="text-[10px] text-gray-400">
                            Silakan periksa dan amankan email/password Konami ID akun di atas. Setelah aman, klik tombol konfirmasi di bawah.
                          </p>
                        </div>
                      )}

                      {ord.buyerId === user.id && ord.status === 'pending_payment' && (
                        <div className="pt-2">
                          <button
                            onClick={() => setSelectedOrderForPayment(ord)}
                            className="gradient-button px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2"
                          >
                            <Upload className="w-3.5 h-3.5" /> Upload Bukti Pembayaran
                          </button>
                        </div>
                      )}

                      {ord.buyerId === user.id && ord.status === 'handover' && (
                        <div className="pt-2">
                          <button
                            onClick={() => handleConfirmBuyerReceipt(ord.id)}
                            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Konfirmasi Akun Sesuai & Selesai
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">Belum ada transaksi pesanan.</p>
              )}
            </div>
          )}

          {/* TAB 3: AKUN SAYA (LISTINGS) */}
          {activeTab === 'listings' && (
            <div className="glass-card rounded-2xl p-6 border border-gray-800 bg-slate-900/80 space-y-6">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <h2 className="text-lg font-bold text-white">Akun eFootball Milik Saya</h2>
                <button
                  onClick={() => setActiveTab('new_sell')}
                  className="gradient-button px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Jual Akun Baru
                </button>
              </div>

              {listings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {listings.map(item => (
                    <div key={item.id} className="bg-slate-950 p-4 rounded-xl border border-gray-800 space-y-3">
                      <h4 className="text-sm font-bold text-white line-clamp-1">{item.title}</h4>
                      <div className="text-xs text-emerald-400 font-extrabold">Rp {item.price.toLocaleString('id-ID')}</div>
                      <div className="flex items-center justify-between text-[11px] text-gray-400 border-t border-gray-800 pt-2">
                        <span>Device: {item.platform}</span>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold px-2 py-0.5 rounded uppercase text-[10px] ${
                            item.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                            item.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {item.status}
                          </span>
                          <button
                            onClick={() => handleDeleteUserListing(item.id)}
                            className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-500/10 transition-colors cursor-pointer"
                            title="Hapus Akun Ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">Belum ada akun yang dijual.</p>
              )}
            </div>
          )}

          {/* TAB 4: FORM JUAL AKUN & TITIP AKUN */}
          {(activeTab === 'new_sell' || activeTab === 'new_consign') && (
            <div className="glass-card rounded-2xl p-6 border border-gray-800 bg-slate-900/80 space-y-6">
              <h2 className="text-lg font-bold text-white border-b border-gray-800 pb-3">
                {activeTab === 'new_consign' ? 'Formulir Titip Akun eFootball' : 'Formulir Jual Akun eFootball'}
              </h2>

              <form onSubmit={(e) => { e.preventDefault(); handleCreateListing(activeTab === 'new_consign'); }} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-gray-300 mb-1 block">Judul Listing</label>
                  <input
                    type="text"
                    required
                    value={sellForm.title}
                    onChange={(e) => setSellForm({ ...sellForm, title: e.target.value })}
                    placeholder="Contoh: Akun Sultan 25+ Epic Boosted (Messi 105, Gullit)"
                    className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-gray-300 mb-1 block">Harga (Rp)</label>
                    <input
                      type="number"
                      required
                      value={sellForm.price}
                      onChange={(e) => setSellForm({ ...sellForm, price: e.target.value })}
                      placeholder="1500000"
                      className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-300 mb-1 block">Device</label>
                    <select
                      value={sellForm.platform}
                      onChange={(e) => setSellForm({ ...sellForm, platform: e.target.value })}
                      className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Android">Android</option>
                      <option value="iOS">iOS</option>
                      <option value="PC">PC (Steam)</option>
                      <option value="Console">Console</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="font-semibold text-gray-300 mb-1 block">Jumlah Epic</label>
                    <input
                      type="number"
                      value={sellForm.epicCount}
                      onChange={(e) => setSellForm({ ...sellForm, epicCount: e.target.value })}
                      placeholder="15"
                      className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-300 mb-1 block">Jumlah Big Time</label>
                    <input
                      type="number"
                      value={sellForm.bigTimeCount}
                      onChange={(e) => setSellForm({ ...sellForm, bigTimeCount: e.target.value })}
                      placeholder="5"
                      className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-300 mb-1 block">eFootball Coins</label>
                    <input
                      type="number"
                      value={sellForm.coinAmount}
                      onChange={(e) => setSellForm({ ...sellForm, coinAmount: e.target.value })}
                      placeholder="2500"
                      className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-300 mb-1 block">Jumlah GP</label>
                    <input
                      type="number"
                      value={sellForm.gpAmount}
                      onChange={(e) => setSellForm({ ...sellForm, gpAmount: e.target.value })}
                      placeholder="3500000"
                      className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* UPLOAD FOTO FILE ONLY (No URL input) */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-gray-800 space-y-4">
                  <label className="font-bold text-emerald-400 block text-sm flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-emerald-400" />
                    Upload File Foto Screenshot Squad
                  </label>

                  <div className="border-2 border-dashed border-gray-700 hover:border-emerald-500 rounded-2xl p-6 text-center transition-colors bg-slate-900/50">
                    {sellForm.imageUrl ? (
                      <div className="space-y-3">
                        <div className="relative aspect-video max-w-sm mx-auto rounded-xl overflow-hidden border border-emerald-500/50 shadow-lg">
                          <img src={sellForm.imageUrl} alt="Preview Foto Akun" className="w-full h-full object-cover" />
                          <span className="absolute bottom-2 right-2 bg-emerald-500 text-slate-950 px-2.5 py-0.5 rounded font-extrabold text-[10px]">
                            Foto Ready
                          </span>
                        </div>
                        <label className="cursor-pointer inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold px-4 py-2 rounded-xl border border-gray-700 text-xs">
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
                      <label className="cursor-pointer space-y-2 block">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                          <Upload className="w-6 h-6" />
                        </div>
                        <div className="text-sm font-bold text-white">
                          {uploadingImage ? 'Sedang Mengunggah File...' : 'Klik Untuk Pilih File Foto Dari HP / Komputer'}
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
                  <label className="font-semibold text-gray-300 mb-1 block">Deskripsi Akun</label>
                  <textarea
                    rows="3"
                    required
                    value={sellForm.description}
                    onChange={(e) => setSellForm({ ...sellForm, description: e.target.value })}
                    placeholder="Jelaskan pemain kunci, manager, piala, dan status rawatan..."
                    className="w-full bg-slate-950 border border-gray-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-gray-800 space-y-3">
                  <div className="font-bold text-amber-400">Kredensial Akun Game (HANYA DIBACA OLEH ADMIN ESCROW)</div>
                  <div>
                    <label className="font-semibold text-gray-300 mb-1 block">Login ID / Email Konami & Password</label>
                    <input
                      type="text"
                      required
                      value={sellForm.credentials}
                      onChange={(e) => setSellForm({ ...sellForm, credentials: e.target.value })}
                      placeholder="Email: user@example.com | Pass: KonamiPass123"
                      className="w-full bg-slate-900 border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full gradient-button py-3 rounded-xl font-extrabold text-sm"
                >
                  Submit {activeTab === 'new_consign' ? 'Titip Akun' : 'Jual Akun'} Ke Admin
                </button>
              </form>
            </div>
          )}

          {/* TAB 5: SALDO & PENCAIRAN (WALLET) */}
          {activeTab === 'wallet' && (
            <div className="glass-card rounded-2xl p-6 border border-gray-800 bg-slate-900/80 space-y-6">
              <h2 className="text-lg font-bold text-white border-b border-gray-800 pb-3">Saldo & Pencairan Dana (Withdrawal)</h2>

              <div className="bg-slate-950 p-6 rounded-2xl border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-400">Saldo Tersedia</div>
                  <div className="text-3xl font-extrabold text-emerald-400 mt-1">
                    Rp {user.balance ? user.balance.toLocaleString('id-ID') : '0'}
                  </div>
                </div>
              </div>

              <form onSubmit={handleWithdraw} className="bg-slate-950 p-5 rounded-2xl border border-gray-800 space-y-4 text-xs">
                <h3 className="font-bold text-white text-sm">Tarik Dana Ke Rekening Bank / E-Wallet</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-gray-300 mb-1 block">Jumlah Penarikan (Min. 50k)</label>
                    <input
                      type="number"
                      required
                      value={withdrawForm.amount}
                      onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                      placeholder="500000"
                      className="w-full bg-slate-900 border border-gray-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-300 mb-1 block">Bank / E-Wallet</label>
                    <select
                      value={withdrawForm.bankName}
                      onChange={(e) => setWithdrawForm({ ...withdrawForm, bankName: e.target.value })}
                      className="w-full bg-slate-900 border border-gray-800 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="BCA">BCA</option>
                      <option value="Mandiri">Mandiri</option>
                      <option value="BRI">BRI</option>
                      <option value="BNI">BNI</option>
                      <option value="DANA">DANA</option>
                      <option value="GoPay">GoPay</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-gray-300 mb-1 block">Nomor Rekening / HP</label>
                    <input
                      type="text"
                      required
                      value={withdrawForm.accountNumber}
                      onChange={(e) => setWithdrawForm({ ...withdrawForm, accountNumber: e.target.value })}
                      placeholder="8830192837"
                      className="w-full bg-slate-900 border border-gray-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-300 mb-1 block">Atas Nama Pemilik</label>
                    <input
                      type="text"
                      required
                      value={withdrawForm.accountHolder}
                      onChange={(e) => setWithdrawForm({ ...withdrawForm, accountHolder: e.target.value })}
                      placeholder="Rizky eFootballer"
                      className="w-full bg-slate-900 border border-gray-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <button type="submit" className="gradient-button px-6 py-2.5 rounded-xl font-bold">
                  Ajukan Pencairan Dana
                </button>
              </form>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white">Riwayat Penarikan Dana</h4>
                {withdrawals.length > 0 ? (
                  withdrawals.map(w => (
                    <div key={w.id} className="bg-slate-950 p-3.5 rounded-xl border border-gray-800 flex justify-between text-xs">
                      <div>
                        <div className="font-bold text-white">Rp {w.amount.toLocaleString('id-ID')}</div>
                        <div className="text-gray-400">{w.bankName} - {w.accountNumber} ({w.accountHolder})</div>
                      </div>
                      <span className="font-bold text-emerald-400">{w.status}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400">Belum ada riwayat penarikan.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: DISPUTES / KOMPLAIN */}
          {activeTab === 'disputes' && (
            <div className="glass-card rounded-2xl p-6 border border-gray-800 bg-slate-900/80 space-y-6">
              <h2 className="text-lg font-bold text-white border-b border-gray-800 pb-3">Pengaduan & Dispute Transaksi</h2>

              <form onSubmit={handleSubmitDispute} className="bg-slate-950 p-4 rounded-xl border border-gray-800 space-y-3 text-xs">
                <h3 className="font-bold text-white">Ajukan Komplain Baru</h3>
                <div>
                  <label className="block text-gray-300 mb-1">Pilih Order</label>
                  <select
                    value={disputeForm.orderId}
                    onChange={(e) => setDisputeForm({ ...disputeForm, orderId: e.target.value })}
                    className="w-full bg-slate-900 border border-gray-800 rounded-xl p-2 text-white"
                  >
                    <option value="">-- Pilih Pesanan Bermasalah --</option>
                    {orders.map(o => (
                      <option key={o.id} value={o.id}>{o.orderNumber} - {o.listing?.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-1">Alasan Komplain</label>
                  <select
                    value={disputeForm.reason}
                    onChange={(e) => setDisputeForm({ ...disputeForm, reason: e.target.value })}
                    className="w-full bg-slate-900 border border-gray-800 rounded-xl p-2 text-white"
                  >
                    <option value="Kredensial Login Tidak Sesuai">Kredensial Login Tidak Sesuai</option>
                    <option value="Pemain Epic / Stats Kurang Dari Deskripsi">Pemain Epic / Stats Kurang Dari Deskripsi</option>
                    <option value="Akun Terkena Warning / Penalty">Akun Terkena Warning / Penalty</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-1">Jelaskan Masalah</label>
                  <textarea
                    rows="2"
                    value={disputeForm.description}
                    onChange={(e) => setDisputeForm({ ...disputeForm, description: e.target.value })}
                    placeholder="Tuliskan detail kronologi masalah..."
                    className="w-full bg-slate-900 border border-gray-800 rounded-xl p-2 text-white"
                  />
                </div>

                <button type="submit" className="bg-red-500 hover:bg-red-400 text-white font-bold px-4 py-2 rounded-xl">
                  Kirim Komplain Ke Admin
                </button>
              </form>
            </div>
          )}

          {/* TAB 7: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="glass-card rounded-2xl p-6 border border-gray-800 bg-slate-900/80 space-y-6">
              <h2 className="text-lg font-bold text-white border-b border-gray-800 pb-3">Beri Review Transaksi Selesai</h2>

              <form onSubmit={handleSubmitReview} className="bg-slate-950 p-4 rounded-xl border border-gray-800 space-y-3 text-xs">
                <div>
                  <label className="block text-gray-300 mb-1">Pilih Transaksi Selesai</label>
                  <select
                    value={reviewForm.orderId}
                    onChange={(e) => setReviewForm({ ...reviewForm, orderId: e.target.value })}
                    className="w-full bg-slate-900 border border-gray-800 rounded-xl p-2 text-white"
                  >
                    <option value="">-- Pilih Transaksi Completed --</option>
                    {orders.filter(o => o.status === 'completed' && o.buyerId === user.id).map(o => (
                      <option key={o.id} value={o.id}>{o.orderNumber} - {o.listing?.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-1">Rating (1 - 5 Bintang)</label>
                  <select
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                    className="w-full bg-slate-900 border border-gray-800 rounded-xl p-2 text-white"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5 - Sangat Puas)</option>
                    <option value="4">⭐⭐⭐⭐ (4 - Bagus)</option>
                    <option value="3">⭐⭐⭐ (3 - Cukup)</option>
                    <option value="2">⭐⭐ (2 - Kurang)</option>
                    <option value="1">⭐ (1 - Kecewa)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-1">Ulasan / Komentar</label>
                  <textarea
                    rows="2"
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    placeholder="Tuliskan pengalaman bertransaksi..."
                    className="w-full bg-slate-900 border border-gray-800 rounded-xl p-2 text-white"
                  />
                </div>

                <button type="submit" className="gradient-button px-4 py-2 rounded-xl font-bold">
                  Kirim Ulasan
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Modal Upload Payment Proof */}
      {selectedOrderForPayment && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-gray-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-white">Upload Bukti Bayar - {selectedOrderForPayment.orderNumber}</h3>
            <p className="text-xs text-gray-400">
              Transfer sebesar <span className="text-emerald-400 font-bold">Rp {selectedOrderForPayment.totalAmount.toLocaleString('id-ID')}</span> ke Rekening Admin BCA: <span className="text-white font-mono font-bold">8830192837</span> a.n PT REVE EFOOTBALL.
            </p>

            <form onSubmit={handleUploadPaymentProof} className="space-y-4">
              <div>
                <label className="text-xs text-gray-300 mb-1 block">File Bukti Transfer / Screenshot</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = async () => {
                      const base64Data = reader.result;
                      try {
                        const formData = new FormData();
                        formData.append('image', file);
                        const token = localStorage.getItem('efootmarket_token');
                        const uploadUrl = API_BASE.startsWith('http') ? `${API_BASE}/upload` : '/api/upload';
                        const res = await fetch(uploadUrl, {
                          method: 'POST',
                          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                          body: formData,
                        });
                        const contentType = res.headers.get('content-type') || '';
                        if (res.ok && contentType.includes('application/json')) {
                          const data = await res.json();
                          if (data.success && data.url) {
                            setPaymentProofUrl(data.url);
                            return;
                          }
                        }
                        setPaymentProofUrl(base64Data);
                      } catch {
                        setPaymentProofUrl(base64Data);
                      }
                    };
                    reader.readAsDataURL(file);
                  }}
                  className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForPayment(null)}
                  className="w-1/2 py-2 bg-slate-800 text-xs font-bold text-gray-300 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 gradient-button py-2 text-xs font-bold rounded-xl"
                >
                  Submit Bukti
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
