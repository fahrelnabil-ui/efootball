import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../services/api';
import AccountCard from '../../components/marketplace/AccountCard';
import {
  Gamepad2,
  Search,
  ShieldCheck,
  PlusCircle,
  Sparkles,
  Zap,
  Lock,
  MessageSquare,
  ChevronRight,
  ArrowRight,
  UserCheck,
  PhoneCall,
} from 'lucide-react';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [recent, setRecent] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // User's WhatsApp Contact Person Number
  const ADMIN_WA_NUMBER = '62895370263740';

  useEffect(() => {
    async function fetchHomeData() {
      try {
        const res = await apiFetch('/listings?status=approved');
        if (res.success) {
          setFeatured(res.data.slice(0, 3));
          setRecent(res.data.slice(0, 6));
        }
      } catch (e) {
        console.error('Failed to load home listings:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchHomeData();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/marketplace');
    }
  };

  const handleConsignWA = () => {
    const textMsg = 'Halo%20Admin%20REVE%20EFOOTBALL,%20saya%20ingin%20menitipkan%2Fmenjual%20akun%20eFootball%20saya.%20Mohon%20bantu%20prosesnya.';
    window.open(`https://wa.me/${ADMIN_WA_NUMBER}?text=${textMsg}`, '_blank');
  };

  return (
    <div className="space-y-24 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Transaksi Langsung Via Contact Person Admin (+62 895-3702-63740)
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
              Temukan Akun <span className="gradient-text">eFootball</span> Impianmu
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-gray-300 font-normal leading-relaxed">
              Marketplace akun eFootball terpercaya. Tidak perlu daftar atau login! Cukup pilih akun dan hubungi Admin Contact Person via WhatsApp.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                to="/marketplace"
                className="w-full sm:w-auto gradient-button px-8 py-3.5 rounded-2xl text-base font-extrabold flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25"
              >
                <Search className="w-5 h-5" />
                Jelajahi Katalog Akun
              </Link>
              <button
                onClick={handleConsignWA}
                className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-400 hover:text-cyan-300 rounded-2xl text-base font-bold flex items-center justify-center gap-2 transition-all"
              >
                <MessageSquare className="w-5 h-5 text-cyan-400" />
                Titip / Jual Akun (Hubungi Admin)
              </button>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleHeroSearch} className="pt-6 max-w-xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari pemain spesifik: Messi 105, Gullit, Big Time, Coins..."
                  className="w-full bg-slate-900/90 border border-gray-700/80 rounded-2xl pl-12 pr-32 py-4 text-sm text-white placeholder-gray-500 shadow-2xl focus:outline-none focus:border-emerald-500"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-4" />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 px-5 gradient-button rounded-xl text-xs font-bold"
                >
                  Cari Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Contact Person Highlight Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-8 border border-emerald-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <PhoneCall className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Contact Person Official Admin (+62 895-3702-63740)</h3>
              <p className="text-xs text-gray-300 mt-1">
                Ingin jual, beli, atau konsultasi akun eFootball? Hubungi WhatsApp Admin resmi kami tanpa perlu ribet registrasi akun.
              </p>
            </div>
          </div>
          <button
            onClick={() => window.open(`https://wa.me/${ADMIN_WA_NUMBER}?text=Halo%20Admin%20REVE%20EFOOTBALL`, '_blank')}
            className="gradient-button px-6 py-3 rounded-xl text-sm font-extrabold flex items-center gap-2 shrink-0 shadow-lg"
          >
            <MessageSquare className="w-4 h-4" /> Chat Admin WhatsApp
          </button>
        </div>
      </section>

      {/* Featured Accounts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4" /> Pilihan Sultan
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Featured Accounts</h2>
          </div>
          <Link
            to="/marketplace"
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            Lihat Semua <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-80 bg-slate-900/50 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map(item => (
              <AccountCard key={item.id} listing={item} />
            ))}
          </div>
        )}
      </section>

      {/* Akun Terbaru Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest mb-1">
              <Zap className="w-4 h-4" /> Fresh Listing
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Akun Terbaru Diterbitkan</h2>
          </div>
          <Link
            to="/marketplace"
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            Jelajahi Katalog <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recent.map(item => (
            <AccountCard key={item.id} listing={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
