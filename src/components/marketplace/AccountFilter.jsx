import React, { useState } from 'react';
import {
  Search,
  Filter,
  RotateCcw,
  Trophy,
  Sparkles,
  ArrowUpDown,
  ShoppingCart,
  PlusCircle,
  Package,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function AccountFilter({ filters, setFilters, onReset }) {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const ADMIN_WA_NUMBER = '6285189441644';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleAction = (type) => {
    let msg = '';
    if (type === 'jual') {
      msg = 'Halo%20Admin%20REVE%20EFOOTBALL,%20saya%20ingin%20menjual%20akun%20eFootball%20saya.%20Mohon%20info%20prosedurnya.';
      window.open(`https://wa.me/${ADMIN_WA_NUMBER}?text=${msg}`, '_blank');
    } else if (type === 'titip') {
      msg = 'Halo%20Admin%20REVE%20EFOOTBALL,%20saya%20ingin%20menitipkan%20akun%20eFootball%20saya%20(Titip%20Akun).%20Mohon%20bantuannya.';
      window.open(`https://wa.me/${ADMIN_WA_NUMBER}?text=${msg}`, '_blank');
    } else if (type === 'rekber') {
      msg = 'Halo%20Admin%20REVE%20EFOOTBALL,%20saya%20ingin%20menggunakan%20jasa%20rekber%20escrow%20untuk%20transaksi%20akun%20eFootball.';
      window.open(`https://wa.me/${ADMIN_WA_NUMBER}?text=${msg}`, '_blank');
    } else if (type === 'beli') {
      onReset();
    }
  };

  return (
    <aside className="w-full lg:w-80 lg:shrink-0 space-y-4">
      {/* 1. Menu Navigasi Layanan: Jual, Beli, Titip, Rekber */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 border border-gray-800 bg-slate-900/90 shadow-xl space-y-3">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-gray-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Layanan eFootball
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Beli (Katalog) */}
          <button
            onClick={() => handleAction('beli')}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-bold text-xs hover:bg-emerald-500/25 transition-all text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
              <ShoppingCart className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <div className="text-white text-xs font-extrabold leading-none">Beli</div>
              <div className="text-[10px] text-gray-400 font-normal mt-0.5">Katalog Akun</div>
            </div>
          </button>

          {/* Jual */}
          <button
            onClick={() => handleAction('jual')}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/70 border border-gray-800 hover:border-cyan-500/40 text-gray-200 hover:text-cyan-400 font-bold text-xs hover:bg-slate-950 transition-all text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
              <PlusCircle className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <div className="text-white text-xs font-extrabold leading-none">Jual</div>
              <div className="text-[10px] text-gray-400 font-normal mt-0.5">Jual Cepat</div>
            </div>
          </button>

          {/* Titip */}
          <button
            onClick={() => handleAction('titip')}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/70 border border-gray-800 hover:border-amber-500/40 text-gray-200 hover:text-amber-400 font-bold text-xs hover:bg-slate-950 transition-all text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
              <Package className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <div className="text-white text-xs font-extrabold leading-none">Titip</div>
              <div className="text-[10px] text-gray-400 font-normal mt-0.5">Titip Jual</div>
            </div>
          </button>

          {/* Rekber */}
          <button
            onClick={() => handleAction('rekber')}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/70 border border-gray-800 hover:border-purple-500/40 text-gray-200 hover:text-purple-400 font-bold text-xs hover:bg-slate-950 transition-all text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <div className="text-white text-xs font-extrabold leading-none">Rekber</div>
              <div className="text-[10px] text-gray-400 font-normal mt-0.5">Escrow Aman</div>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Filter & Pencarian Akun Sidebar */}
      <div className="glass-card rounded-2xl p-5 border border-gray-800 bg-slate-900/90 shadow-xl space-y-4">
        {/* Header with Mobile Accordion Toggle */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-800">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Filter className="w-4 h-4 text-emerald-400" />
            <span>Filter & Pencarian</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="text-[11px] text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
              title="Reset Filter"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden p-1 text-gray-400 hover:text-white"
            >
              {mobileFilterOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Filter Body (Visible always on lg+, collapsible on mobile) */}
        <div className={`space-y-4 ${mobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
          {/* Search Input */}
          <div>
            <label className="text-xs font-semibold text-gray-300 mb-1.5 block">Cari Judul / Deskripsi</label>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleChange}
                placeholder="Contoh: Messi, Gullit, Big Time..."
                className="w-full bg-slate-950 border border-gray-800 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Device Platform */}
          <div>
            <label className="text-xs font-semibold text-gray-300 mb-1.5 block">Device Platform</label>
            <select
              name="platform"
              value={filters.platform}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">Semua Device</option>
              <option value="Android">Android</option>
              <option value="iOS">iOS</option>
              <option value="PC">PC (Steam)</option>
              <option value="Console">Console (PlayStation/Xbox)</option>
            </select>
          </div>

          {/* Sorting */}
          <div>
            <label className="text-xs font-semibold text-gray-300 mb-1.5 block flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3 text-emerald-400" /> Urutkan
            </label>
            <select
              name="sort"
              value={filters.sort}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="newest">Terbaru</option>
              <option value="price_asc">Harga Termurah</option>
              <option value="price_desc">Harga Tertinggi</option>
            </select>
          </div>

          {/* Status Ketersediaan Stok */}
          <div>
            <label className="text-xs font-semibold text-gray-300 mb-1.5 block">Ketersediaan Stok</label>
            <select
              name="status"
              value={filters.status || 'approved'}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="approved">Semua Akun (Tersedia & Terjual)</option>
              <option value="only_available">🟢 Hanya Akun Tersedia (Ready)</option>
              <option value="only_sold">🔴 Hanya Akun Terjual (SOLD)</option>
            </select>
          </div>

          {/* Rentang Harga (Min & Max) */}
          <div>
            <label className="text-xs font-semibold text-gray-300 mb-1.5 block">Rentang Harga (Rp)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleChange}
                placeholder="Min"
                className="w-full bg-slate-950 border border-gray-800 rounded-xl px-2.5 py-2 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleChange}
                placeholder="Max"
                className="w-full bg-slate-950 border border-gray-800 rounded-xl px-2.5 py-2 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Pemain Spesial (Epic & Big Time) */}
          <div>
            <label className="text-xs font-semibold text-gray-300 mb-1.5 block">Spesifikasi Kartu</label>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <Trophy className="w-3.5 h-3.5 text-amber-400 absolute left-2.5 top-2.5" />
                <input
                  type="number"
                  name="epicMin"
                  value={filters.epicMin}
                  onChange={handleChange}
                  placeholder="Min Epic"
                  className="w-full bg-slate-950 border border-gray-800 rounded-xl pl-8 pr-2 py-2 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="relative">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 absolute left-2.5 top-2.5" />
                <input
                  type="number"
                  name="bigTimeMin"
                  value={filters.bigTimeMin}
                  onChange={handleChange}
                  placeholder="Min Big Time"
                  className="w-full bg-slate-950 border border-gray-800 rounded-xl pl-8 pr-2 py-2 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
