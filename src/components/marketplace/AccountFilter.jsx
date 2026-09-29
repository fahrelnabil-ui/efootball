import React from 'react';
import { Search, Filter, RotateCcw, Trophy, Sparkles, ArrowUpDown } from 'lucide-react';

export default function AccountFilter({ filters, setFilters, onReset }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-gray-800 bg-slate-900/90 shadow-xl">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-800">
        <div className="flex items-center gap-2 text-base font-bold text-white">
          <Filter className="w-5 h-5 text-emerald-400" />
          Filter & Pencarian Akun
        </div>
        <button
          onClick={onReset}
          className="text-xs text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Filter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Bar */}
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-gray-300 mb-1.5 block">Cari Judul / Deskripsi</label>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Contoh: Messi 105, Gullit, Full Pack..."
              className="w-full bg-slate-950 border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Device */}
        <div>
          <label className="text-xs font-semibold text-gray-300 mb-1.5 block">Device</label>
          <select
            name="platform"
            value={filters.platform}
            onChange={handleChange}
            className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-emerald-500"
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
            <ArrowUpDown className="w-3.5 h-3.5 text-emerald-400" /> Urutkan
          </label>
          <select
            name="sort"
            value={filters.sort}
            onChange={handleChange}
            className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-emerald-500"
          >
            <option value="newest">Terbaru</option>
            <option value="price_asc">Harga Termurah</option>
            <option value="price_desc">Harga Tertinggi</option>
          </select>
        </div>

        {/* Min & Max Price */}
        <div>
          <label className="text-xs font-semibold text-gray-300 mb-1.5 block">Harga Min (Rp)</label>
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleChange}
            placeholder="0"
            className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-300 mb-1.5 block">Harga Max (Rp)</label>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleChange}
            placeholder="5000000"
            className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Epic Min */}
        <div>
          <label className="text-xs font-semibold text-gray-300 mb-1.5 block flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-amber-400" /> Min. Jumlah Epic
          </label>
          <input
            type="number"
            name="epicMin"
            value={filters.epicMin}
            onChange={handleChange}
            placeholder="0"
            className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Big Time Min */}
        <div>
          <label className="text-xs font-semibold text-gray-300 mb-1.5 block flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Min. Big Time
          </label>
          <input
            type="number"
            name="bigTimeMin"
            value={filters.bigTimeMin}
            onChange={handleChange}
            placeholder="0"
            className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>
    </div>
  );
}
