import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../services/api';

export default function MarketplaceCard({ listing }) {
  const rawImg = listing.images && listing.images.length > 0
    ? listing.images.find(img => img.isPrimary)?.imageUrl || listing.images[0].imageUrl
    : '/uploads/squad-ibra.png';
  const primaryImg = getImageUrl(rawImg);

  const region = listing.region || 'Indonesia';
  const sisaLogin = listing.sisaLogin !== undefined ? listing.sisaLogin : 10;

  return (
    <Link
      to={`/account/${listing.id}`}
      className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-100 flex flex-col group relative"
    >
      {/* Squad Formation Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
        <img
          src={primaryImg}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = '/uploads/squad-ibra.png';
          }}
        />
      </div>

      {/* Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Badges: Yellow 'AKUN ADMIN' & Pink 'DISEMATKAN' (Stacked vertically) */}
          <div className="flex flex-col items-start gap-1.5">
            <span className="inline-flex items-center gap-1.5 bg-[#FACC15] text-slate-950 font-black text-[11px] sm:text-xs px-3.5 py-1 rounded-full shadow-xs tracking-tight">
              👑 AKUN ADMIN
            </span>
            <span className="inline-flex items-center gap-1.5 bg-[#F02A7E] text-white font-black text-[11px] sm:text-xs px-3.5 py-1 rounded-full shadow-xs tracking-tight">
              📌 DISEMATKAN
            </span>
          </div>

          {/* Title */}
          <h3 className="font-black text-slate-900 text-base sm:text-lg uppercase tracking-tight line-clamp-2 mt-3 group-hover:text-[#F02A7E] transition-colors leading-tight">
            {listing.title}
          </h3>

          {/* Details (Region & Sisa Login) */}
          <div className="mt-3 space-y-1 text-xs sm:text-sm text-slate-600">
            <div className="flex items-center gap-1.5">
              <span>🌍</span>
              <span>Region: <strong className="text-slate-800 font-bold">{region}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>🔑</span>
              <span>Sisa Login: <strong className="text-slate-800 font-bold">{sisaLogin}</strong></span>
            </div>
          </div>
        </div>

        {/* Price Tag (Big Vibrant Pink) */}
        <div className="mt-4 pt-1 flex items-baseline justify-between">
          <div className="text-xl sm:text-2xl font-black text-[#F02A7E] tracking-tight">
            Rp {listing.price.toLocaleString('id-ID')}
          </div>
        </div>
      </div>
    </Link>
  );
}
