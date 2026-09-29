import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiFetch, getImageUrl } from '../../services/api';
import { FALLBACK_LISTINGS } from '../../services/fallbackData';
import { ShieldCheck, MessageSquare, ArrowLeft, PhoneCall, CheckCircle2, Lock } from 'lucide-react';

export default function Checkout() {
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  // User's WhatsApp Contact Person Number
  const ADMIN_WA_NUMBER = '62895370263740';

  useEffect(() => {
    async function loadListing() {
      try {
        const res = await apiFetch(`/listings/${listingId}`);
        if (res.success && res.data) {
          setListing(res.data);
          return;
        }
      } catch (e) {
        let fallback = [...FALLBACK_LISTINGS];
        try {
          const localListings = JSON.parse(localStorage.getItem('efootmarket_local_listings') || '[]');
          fallback = [...localListings, ...fallback];
        } catch (_) {}
        const found = fallback.find(item => item.id === listingId);
        if (found) {
          setListing(found);
        }
      } finally {
        setLoading(false);
      }
    }
    loadListing();
  }, [listingId]);

  const handleContactAdminWA = () => {
    if (!listing) return;
    const textMessage = `Halo%20Admin%20REVE%20EFOOTBALL,%20saya%20ingin%20membeli%20akun%20eFootball%20berikut:%0A%0A📌%20*Judul*:%20${encodeURIComponent(listing.title)}%0A💰%20*Harga*:%20Rp%20${listing.price.toLocaleString('id-ID')}%0A🎮%20*Device*:%20${listing.platform}%0A%0AMohon%20bantu%20proses%20transaksi%20escrow.`;
    window.open(`https://wa.me/${ADMIN_WA_NUMBER}?text=${textMessage}`, '_blank');
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-400 text-xs">Memuat data transaksi...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-lg font-bold text-white mb-2">Listing Tidak Ditemukan</h2>
        <Link to="/marketplace" className="text-emerald-400 text-xs">Kembali ke Marketplace</Link>
      </div>
    );
  }

  const serviceFee = listing.price * 0.05;
  const totalAmount = listing.price + serviceFee;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link to={`/account/${listingId}`} className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-emerald-400">
        <ArrowLeft className="w-4 h-4" /> Batal & Kembali ke Detail Akun
      </Link>

      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Transaksi Via Contact Person Admin</h1>
        <p className="text-xs text-gray-400">
          Tidak perlu membuat akun atau login. Seluruh transaksi jual beli langsung dipandu oleh Admin Escrow resmi.
        </p>
      </div>

      <div className="glass-card rounded-3xl p-8 border border-emerald-500/30 bg-slate-900/90 shadow-2xl space-y-6">
        {/* Listing Info */}
        <div className="flex gap-4 items-center border-b border-gray-800 pb-4">
          <img
            src={getImageUrl(listing.images && listing.images.length > 0 ? listing.images[0].imageUrl : '')}
            alt=""
            className="w-24 aspect-video rounded-xl object-cover border border-gray-700"
          />
          <div>
            <h4 className="text-base font-bold text-white leading-snug">{listing.title}</h4>
            <div className="text-xs text-gray-400 mt-1">Device: <span className="text-emerald-400 font-semibold">{listing.platform}</span></div>
            <div className="text-sm font-extrabold text-emerald-400 mt-1">Harga: Rp {listing.price.toLocaleString('id-ID')}</div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="bg-slate-950 p-4 rounded-xl border border-gray-800 space-y-2 text-xs">
          <div className="flex justify-between text-gray-300">
            <span>Harga Akun</span>
            <span>Rp {listing.price.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Estimasi Biaya Escrow (5%)</span>
            <span>Rp {serviceFee.toLocaleString('id-ID')}</span>
          </div>
          <div className="border-t border-gray-800 pt-2 flex justify-between font-extrabold text-sm text-emerald-400">
            <span>Estimasi Total</span>
            <span>Rp {totalAmount.toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* Contact Person Card */}
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-gray-400">Contact Person Resmi</div>
              <div className="text-sm font-bold text-white">+62 895-3702-63740</div>
            </div>
          </div>
          <p className="text-xs text-gray-300">
            Klik tombol di bawah untuk langsung membuka obrolan WhatsApp dengan Admin beserta rincian akun ini.
          </p>
        </div>

        <button
          onClick={handleContactAdminWA}
          className="w-full gradient-button py-4 rounded-2xl text-base font-extrabold flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25"
        >
          <MessageSquare className="w-5 h-5" />
          Hubungi Admin Sekarang Via WhatsApp
        </button>
      </div>
    </div>
  );
}
