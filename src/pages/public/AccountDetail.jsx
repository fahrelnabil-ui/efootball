import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiFetch, getImageUrl } from '../../services/api';
import { FALLBACK_LISTINGS } from '../../services/fallbackData';
import {
  ShieldCheck,
  Trophy,
  Sparkles,
  Coins,
  WalletCards,
  Smartphone,
  Monitor,
  Info,
  ArrowLeft,
  MessageSquare,
  PhoneCall,
} from 'lucide-react';

export default function AccountDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [selectedImg, setSelectedImg] = useState('');
  const [loading, setLoading] = useState(true);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // User's WhatsApp Number
  const ADMIN_WA_NUMBER = '6285189441644';

  useEffect(() => {
    async function loadDetail() {
      try {
        const res = await apiFetch(`/listings/${id}`);
        if (res.success && res.data) {
          setListing(res.data);
          if (res.data.images && res.data.images.length > 0) {
            setSelectedImg(res.data.images[0].imageUrl);
          }
          return;
        }
      } catch (e) {
        let fallback = [...FALLBACK_LISTINGS];
        try {
          const localListings = JSON.parse(localStorage.getItem('efootmarket_local_listings') || '[]');
          fallback = [...localListings, ...fallback];
        } catch (_) {}
        const found = fallback.find(item => item.id === id);
        if (found) {
          setListing(found);
          if (found.images && found.images.length > 0) {
            setSelectedImg(found.images[0].imageUrl);
          }
        }
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [id]);

  const handleBuyViaWhatsApp = () => {
    if (!listing) return;
    const textMessage = `Halo%20Admin%20REVE%20EFOOTBALL,%20saya%20tertarik%20membeli%20akun%20eFootball%20berikut:%0A%0A📌%20*Judul*:%20${encodeURIComponent(listing.title)}%0A💰%20*Harga*:%20Rp%20${listing.price.toLocaleString('id-ID')}%0A🎮%20*Device*:%20${listing.platform}%0A%0AMohon%20bantu%20proses%20transaksi%20escrow%20/rekber.`;
    window.open(`https://wa.me/${ADMIN_WA_NUMBER}?text=${textMessage}`, '_blank');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm">Memuat detail akun eFootball...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Akun Tidak Ditemukan</h2>
        <Link to="/marketplace" className="text-emerald-400 text-sm hover:underline">
          Kembali ke Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <Link
        to="/marketplace"
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-emerald-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Gallery & Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Screenshot Gallery */}
          <div className="space-y-3">
            <div 
              onClick={() => setIsZoomOpen(true)}
              className="aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-gray-800 shadow-2xl relative cursor-zoom-in group"
            >
              <img
                src={getImageUrl(selectedImg)}
                alt={listing.title}
                className="w-full h-full object-contain bg-slate-950 transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                {listing.platform === 'PC' ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                {listing.platform}
              </div>
              <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-lg text-[11px] text-gray-300 font-medium border border-gray-700 opacity-80 group-hover:opacity-100 transition-opacity">
                🔍 Klik untuk Perbesar Foto Full
              </div>
            </div>

            {/* Thumbnails */}
            {listing.images && listing.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {listing.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImg(img.imageUrl)}
                    className={`w-24 aspect-video rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-slate-950 ${
                      selectedImg === img.imageUrl ? 'border-emerald-400 shadow-lg shadow-emerald-500/30' : 'border-gray-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={getImageUrl(img.imageUrl)} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Full-screen Lightbox Modal */}
          {isZoomOpen && (
            <div 
              className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
              onClick={() => setIsZoomOpen(false)}
            >
              <div className="relative max-w-6xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center">
                <button 
                  onClick={() => setIsZoomOpen(false)}
                  className="absolute -top-10 right-0 text-white hover:text-emerald-400 font-bold text-lg bg-slate-800/80 px-3 py-1 rounded-lg border border-gray-700"
                >
                  ✕ Tutup (ESC)
                </button>
                <img 
                  src={getImageUrl(selectedImg)} 
                  alt="Full View Squad" 
                  className="max-w-full max-h-full object-contain rounded-xl shadow-2xl border border-gray-800"
                />
              </div>
            </div>
          )}

          {/* Account Stats & Details */}
          <div className="glass-card rounded-2xl p-6 border border-gray-800 bg-slate-900/80 space-y-6">
            <h2 className="text-xl font-bold text-white border-b border-gray-800 pb-3">Statistik Akun eFootball</h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/20 text-center">
                <Trophy className="w-6 h-6 text-amber-400 mx-auto mb-1" />
                <div className="text-[10px] text-gray-400">Total Epic</div>
                <div className="text-lg font-bold text-amber-300">{listing.epicCount} Player</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-cyan-500/20 text-center">
                <Sparkles className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
                <div className="text-[10px] text-gray-400">Big Time</div>
                <div className="text-lg font-bold text-cyan-300">{listing.bigTimeCount} Player</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/20 text-center">
                <Coins className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                <div className="text-[10px] text-gray-400">Coins</div>
                <div className="text-lg font-bold text-emerald-300">{listing.coinAmount.toLocaleString('id-ID')}</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-purple-500/20 text-center">
                <WalletCards className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                <div className="text-[10px] text-gray-400">Total GP</div>
                <div className="text-lg font-bold text-purple-300">{listing.gpAmount.toLocaleString('id-ID')}</div>
              </div>
            </div>

            {/* Squad Info */}
            {listing.squadInfo && (
              <div className="bg-slate-950/60 p-4 rounded-xl border border-gray-800">
                <div className="text-xs font-semibold text-emerald-400 mb-1">Informasi Squad & Division</div>
                <p className="text-sm text-gray-200">{listing.squadInfo}</p>
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Deskripsi Akun</h3>
              <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">{listing.description}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Direct WhatsApp Contact Card */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-gray-800 bg-slate-900/90 shadow-2xl sticky top-28 space-y-6">
            <div>
              <h1 className="text-xl font-bold text-white leading-snug">{listing.title}</h1>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-3xl font-extrabold text-emerald-400">
                  Rp {listing.price.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Escrow Guarantee Box */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3.5 space-y-2 text-xs">
              <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Transaksi Tanpa Login / Registrasi
              </div>
              <p className="text-gray-300">
                Cukup hubungi Admin Escrow melalui WhatsApp. Admin akan langsung memandu proses serah-terima dan pembayaran secara aman.
              </p>
            </div>

            {/* Admin Contact Info Card */}
            <div className="border-t border-b border-gray-800 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">Contact Person Resmi</div>
                  <div className="text-sm font-bold text-white">+62 851-8944-1644</div>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-1 rounded-md border border-emerald-500/30">
                Online 24/7
              </span>
            </div>

            {/* Direct Buy WhatsApp Button */}
            <button
              onClick={handleBuyViaWhatsApp}
              className="w-full gradient-button py-4 rounded-xl text-base font-extrabold flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 hover:scale-[1.02] transition-all"
            >
              <MessageSquare className="w-5 h-5" />
              Beli Akun (Hubungi Admin WA)
            </button>

            <div className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1">
              <Info className="w-3.5 h-3.5 text-gray-400" />
              Tidak perlu registrasi/login! Langsung ke WhatsApp.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
