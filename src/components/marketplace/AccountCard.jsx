import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Trophy, Sparkles, Coins, WalletCards, ArrowRight, Smartphone, Monitor, Layers } from 'lucide-react';

export default function AccountCard({ listing }) {
  const primaryImg = listing.images && listing.images.length > 0
    ? listing.images.find(img => img.isPrimary)?.imageUrl || listing.images[0].imageUrl
    : 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800';

  return (
    <div className="glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col group border border-gray-800 bg-slate-900/80">
      {/* Image Container with Badges */}
      <div className="relative aspect-video overflow-hidden bg-slate-950">
        <img
          src={primaryImg}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

        {/* Device Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-gray-700/80 text-[11px] font-semibold text-gray-200 shadow-md">
          {listing.platform === 'PC' || listing.platform === 'Console' ? (
            <Monitor className="w-3.5 h-3.5 text-cyan-400" />
          ) : (
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
          )}
          {listing.platform}
        </div>

        {/* Stock Badge */}
        {listing.stock !== undefined && (
          <div className="absolute top-3 left-28 flex items-center gap-1 bg-slate-900/90 backdrop-blur-md px-2 py-1 rounded-lg border border-cyan-500/30 text-[10px] font-bold text-cyan-400 shadow-md">
            <Layers className="w-3 h-3" />
            Stok: {listing.stock}
          </div>
        )}

        {/* Verified Escrow Badge */}
        {listing.isVerified && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-emerald-500/90 text-slate-950 px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wider shadow-lg shadow-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified
          </div>
        )}

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 left-3">
          <div className="text-xs text-gray-400 font-medium">Harga Akun</div>
          <div className="text-xl font-extrabold text-white tracking-tight">
            Rp {listing.price.toLocaleString('id-ID')}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-100 group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
            {listing.title}
          </h3>

          {/* Stats Grid Pill Badges */}
          <div className="grid grid-cols-2 gap-2 my-4">
            <div className="bg-slate-950/70 border border-amber-500/20 rounded-xl px-2.5 py-1.5 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <div className="text-[10px] text-gray-400 leading-none">Epic Player</div>
                <div className="text-xs font-bold text-amber-300">{listing.epicCount || 0} Player</div>
              </div>
            </div>

            <div className="bg-slate-950/70 border border-cyan-500/20 rounded-xl px-2.5 py-1.5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <div className="text-[10px] text-gray-400 leading-none">Big Time</div>
                <div className="text-xs font-bold text-cyan-300">{listing.bigTimeCount || 0} Player</div>
              </div>
            </div>

            <div className="bg-slate-950/70 border border-emerald-500/20 rounded-xl px-2.5 py-1.5 flex items-center gap-2">
              <Coins className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="text-[10px] text-gray-400 leading-none">Coins</div>
                <div className="text-xs font-bold text-emerald-300">{listing.coinAmount?.toLocaleString('id-ID') || 0}</div>
              </div>
            </div>

            <div className="bg-slate-950/70 border border-purple-500/20 rounded-xl px-2.5 py-1.5 flex items-center gap-2">
              <WalletCards className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <div className="text-[10px] text-gray-400 leading-none">GP Amount</div>
                <div className="text-xs font-bold text-purple-300">
                  {listing.gpAmount >= 1000000
                    ? `${(listing.gpAmount / 1000000).toFixed(1)}M`
                    : `${(listing.gpAmount / 1000).toFixed(0)}K`}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={`/account/${listing.id}`}
          className="w-full mt-2 py-2.5 px-4 bg-slate-800 hover:bg-emerald-500/20 hover:border-emerald-500/40 border border-gray-700 text-sm font-bold text-emerald-400 hover:text-emerald-300 rounded-xl transition-all flex items-center justify-center gap-2 group/btn"
        >
          Lihat Detail Akun
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
