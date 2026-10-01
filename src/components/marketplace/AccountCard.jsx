import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Trophy, Sparkles, Coins, WalletCards, ArrowRight, Smartphone, Monitor, Layers } from 'lucide-react';
import { getImageUrl } from '../../services/api';

export default function AccountCard({ listing }) {
  const rawImg = listing.images && listing.images.length > 0
    ? listing.images.find(img => img.isPrimary)?.imageUrl || listing.images[0].imageUrl
    : 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800';
  const primaryImg = getImageUrl(rawImg);
  const isSold = listing.status === 'sold' || (listing.stock !== undefined && listing.stock <= 0);

  return (
    <div className={`glass-card glass-card-hover rounded-xl sm:rounded-2xl overflow-hidden flex flex-col group border bg-slate-900/80 transition-all ${isSold ? 'border-red-500/30 opacity-90' : 'border-gray-800'}`}>
      {/* Image Container with Badges */}
      <div className="relative aspect-video overflow-hidden bg-slate-950">
        <img
          src={primaryImg}
          alt={listing.title}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${isSold ? 'grayscale-[35%] contrast-90' : ''}`}
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-85" />

        {/* SOLD Overlay Stamp */}
        {isSold && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center pointer-events-none z-10">
            <div className="bg-red-600/95 text-white border-2 border-red-300 font-black text-xs sm:text-sm md:text-base tracking-widest uppercase px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg shadow-2xl shadow-red-600/70 transform -rotate-6 animate-pulse">
              TERJUAL / SOLD
            </div>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 flex items-center justify-between pointer-events-none z-10">
          <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-900/90 backdrop-blur-md px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg border border-gray-700/80 text-[9px] sm:text-[11px] font-semibold text-gray-200 shadow-md">
            {listing.platform === 'PC' || listing.platform === 'Console' ? (
              <Monitor className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-cyan-400" />
            ) : (
              <Smartphone className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-emerald-400" />
            )}
            <span>{listing.platform || 'Android'}</span>
          </div>

          <div className="flex items-center gap-1">
            {/* Stock / Sold Badge */}
            {isSold ? (
              <div className="flex items-center gap-1 bg-red-600/90 text-white px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider shadow-lg shadow-red-600/40">
                <span>🔴 SOLD OUT</span>
              </div>
            ) : listing.stock !== undefined ? (
              <div className="hidden xs:flex sm:flex items-center gap-1 bg-slate-900/90 backdrop-blur-md px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg border border-cyan-500/30 text-[9px] sm:text-[10px] font-bold text-cyan-400 shadow-md">
                <Layers className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                <span>Stok: {listing.stock}</span>
              </div>
            ) : null}

            {/* Verified Escrow Badge */}
            {listing.isVerified && (
              <div className="flex items-center gap-1 bg-emerald-500/90 text-slate-950 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg font-bold text-[9px] sm:text-[10px] uppercase tracking-wider shadow-lg shadow-emerald-500/30">
                <ShieldCheck className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                <span>Verified</span>
              </div>
            )}
          </div>
        </div>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 z-10">
          <div className="text-[9px] sm:text-xs text-gray-400 font-medium leading-none mb-0.5">
            {isSold ? 'Harga Terjual' : 'Harga Akun'}
          </div>
          <div className={`text-sm sm:text-xl font-extrabold tracking-tight ${isSold ? 'text-gray-300' : 'text-white'}`}>
            Rp {listing.price.toLocaleString('id-ID')}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xs sm:text-base font-bold text-gray-100 group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
            {listing.title}
          </h3>

          {/* Stats Grid Pill Badges (2 columns) */}
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2 my-2.5 sm:my-4">
            <div className="bg-slate-950/70 border border-amber-500/20 rounded-lg sm:rounded-xl px-1.5 sm:px-2.5 py-1 sm:py-1.5 flex items-center gap-1.5 sm:gap-2">
              <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[8px] sm:text-[10px] text-gray-400 leading-none truncate">Epic</div>
                <div className="text-[10px] sm:text-xs font-bold text-amber-300 leading-tight truncate">{listing.epicCount || 0} Player</div>
              </div>
            </div>

            <div className="bg-slate-950/70 border border-cyan-500/20 rounded-lg sm:rounded-xl px-1.5 sm:px-2.5 py-1 sm:py-1.5 flex items-center gap-1.5 sm:gap-2">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[8px] sm:text-[10px] text-gray-400 leading-none truncate">Big Time</div>
                <div className="text-[10px] sm:text-xs font-bold text-cyan-300 leading-tight truncate">{listing.bigTimeCount || 0} Player</div>
              </div>
            </div>

            <div className="bg-slate-950/70 border border-emerald-500/20 rounded-lg sm:rounded-xl px-1.5 sm:px-2.5 py-1 sm:py-1.5 flex items-center gap-1.5 sm:gap-2">
              <Coins className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[8px] sm:text-[10px] text-gray-400 leading-none truncate">Coins</div>
                <div className="text-[10px] sm:text-xs font-bold text-emerald-300 leading-tight truncate">{listing.coinAmount?.toLocaleString('id-ID') || 0}</div>
              </div>
            </div>

            <div className="bg-slate-950/70 border border-purple-500/20 rounded-lg sm:rounded-xl px-1.5 sm:px-2.5 py-1 sm:py-1.5 flex items-center gap-1.5 sm:gap-2">
              <WalletCards className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[8px] sm:text-[10px] text-gray-400 leading-none truncate">GP Amount</div>
                <div className="text-[10px] sm:text-xs font-bold text-purple-300 leading-tight truncate">
                  {listing.gpAmount >= 1000000
                    ? `${(listing.gpAmount / 1000000).toFixed(1)}M`
                    : `${((listing.gpAmount || 0) / 1000).toFixed(0)}K`}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {isSold ? (
          <Link
            to={`/account/${listing.id}`}
            className="w-full mt-1 sm:mt-2 py-1.5 sm:py-2.5 px-2 sm:px-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs sm:text-sm font-bold text-red-400 hover:text-red-300 rounded-lg sm:rounded-xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 group/btn"
          >
            <span>Detail (Akun Terjual)</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        ) : (
          <Link
            to={`/account/${listing.id}`}
            className="w-full mt-1 sm:mt-2 py-1.5 sm:py-2.5 px-2 sm:px-4 bg-slate-800 hover:bg-emerald-500/20 hover:border-emerald-500/40 border border-gray-700 text-xs sm:text-sm font-bold text-emerald-400 hover:text-emerald-300 rounded-lg sm:rounded-xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 group/btn"
          >
            <span>Lihat Detail</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>
    </div>
  );
}
