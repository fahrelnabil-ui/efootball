import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiFetch } from '../../services/api';
import { FALLBACK_LISTINGS } from '../../services/fallbackData';
import AccountCard from '../../components/marketplace/AccountCard';
import AccountFilter from '../../components/marketplace/AccountFilter';
import { Gamepad2, SearchX, Sparkles, Server } from 'lucide-react';

export default function Marketplace() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [filters, setFilters] = useState({
    search: initialSearch,
    minPrice: '',
    maxPrice: '',
    epicMin: '',
    bigTimeMin: '',
    playerMin: '',
    gpMin: '',
    coinMin: '',
    platform: 'all',
    sort: 'newest',
  });

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const queryParts = [];
      if (filters.search) queryParts.push(`search=${encodeURIComponent(filters.search)}`);
      if (filters.minPrice) queryParts.push(`minPrice=${filters.minPrice}`);
      if (filters.maxPrice) queryParts.push(`maxPrice=${filters.maxPrice}`);
      if (filters.epicMin) queryParts.push(`epicMin=${filters.epicMin}`);
      if (filters.bigTimeMin) queryParts.push(`bigTimeMin=${filters.bigTimeMin}`);
      if (filters.platform && filters.platform !== 'all') queryParts.push(`platform=${filters.platform}`);
      if (filters.sort) queryParts.push(`sort=${filters.sort}`);
      queryParts.push('status=approved');

      const queryStr = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
      const res = await apiFetch(`/listings${queryStr}`);
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        let combined = [...res.data];
        try {
          const localListings = JSON.parse(localStorage.getItem('efootmarket_local_listings') || '[]');
          for (const localItem of localListings) {
            if (!combined.some(c => c.id === localItem.id || c.title === localItem.title)) {
              combined.unshift(localItem);
            }
          }
        } catch (_) {}
        setListings(combined);
        setIsOfflineMode(false);
      } else {
        throw new Error('Data server kosong atau belum aktif');
      }
    } catch (e) {
      setIsOfflineMode(true);
      let fallback = [...FALLBACK_LISTINGS];
      try {
        const localListings = JSON.parse(localStorage.getItem('efootmarket_local_listings') || '[]');
        for (const localItem of localListings) {
          if (!fallback.some(c => c.id === localItem.id || c.title === localItem.title)) {
            fallback.unshift(localItem);
          }
        }
      } catch (_) {}

      let filtered = fallback.filter(item => {
        if (filters.search) {
          const s = filters.search.toLowerCase();
          const matchTitle = item.title?.toLowerCase().includes(s);
          const matchDesc = item.description?.toLowerCase().includes(s);
          if (!matchTitle && !matchDesc) return false;
        }
        if (filters.minPrice && item.price < parseFloat(filters.minPrice)) return false;
        if (filters.maxPrice && item.price > parseFloat(filters.maxPrice)) return false;
        if (filters.epicMin && (item.epicCount || 0) < parseInt(filters.epicMin)) return false;
        if (filters.bigTimeMin && (item.bigTimeCount || 0) < parseInt(filters.bigTimeMin)) return false;
        if (filters.platform && filters.platform !== 'all' && item.platform !== filters.platform) return false;
        return true;
      });

      if (filters.sort === 'price_asc') filtered.sort((a, b) => a.price - b.price);
      if (filters.sort === 'price_desc') filtered.sort((a, b) => b.price - a.price);

      setListings(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      minPrice: '',
      maxPrice: '',
      epicMin: '',
      bigTimeMin: '',
      playerMin: '',
      gpMin: '',
      coinMin: '',
      platform: 'all',
      sort: 'newest',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-white">Marketplace Akun eFootball</h1>
        <p className="text-sm text-gray-400 mt-1">
          Pilih akun impianmu dari penjual terverifikasi. Seluruh transaksi 100% diproses melalui Admin Escrow.
        </p>
      </div>

      {/* Filter Component */}
      <AccountFilter
        filters={filters}
        setFilters={setFilters}
        onReset={handleResetFilters}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between text-sm text-gray-400">
        <div>
          Menampilkan <span className="font-bold text-emerald-400">{listings.length}</span> akun eFootball
        </div>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-96 bg-slate-900/60 rounded-2xl animate-pulse border border-gray-800" />
          ))}
        </div>
      ) : listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {listings.map(item => (
            <AccountCard key={item.id} listing={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 glass-card rounded-2xl border border-gray-800">
          <SearchX className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">Tidak Ada Akun Ditemukan</h3>
          <p className="text-xs text-gray-400 mb-4">Coba sesuaikan filter harga, device, atau kata kunci pencarian Anda.</p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-emerald-400 rounded-xl"
          >
            Reset Semua Filter
          </button>
        </div>
      )}
    </div>
  );
}
