import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, UserCheck, RefreshCw, FileText, CheckCircle2, Lock, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" /> Sistem Transaksi & Titip Akun
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Cara Kerja Transaksi di <span className="gradient-text">REVE EFOOTBALL</span>
        </h1>
        <p className="text-sm text-gray-300 leading-relaxed">
          Kami memprioritaskan keamanan penuh dalam setiap proses jual beli dan titip akun eFootball. Pembeli dan penjual tidak bertransaksi secara langsung, melainkan dikawal ketat oleh Admin Escrow.
        </p>
      </div>

      {/* Section 1: Alur Pembeli */}
      <div className="glass-card rounded-3xl p-8 border border-gray-800 bg-slate-900/80 space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
          <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 text-emerald-400">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">1. Alur Untuk Pembeli (Buyer Flow)</h2>
            <p className="text-xs text-gray-400">Beli akun eFootball impian tanpa takut kena scam atau ripper.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-300">
          <div className="bg-slate-950 p-5 rounded-2xl border border-gray-800 space-y-2">
            <span className="text-emerald-400 font-extrabold text-base">Step 1</span>
            <h3 className="font-bold text-white text-sm">Checkout & Transfer</h3>
            <p className="text-gray-400">Pilih akun di catalog marketplace, checkout, dan lakukan pembayaran ke Rekening Resmi Admin REVE EFOOTBALL.</p>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-gray-800 space-y-2">
            <span className="text-emerald-400 font-extrabold text-base">Step 2</span>
            <h3 className="font-bold text-white text-sm">Verifikasi & Serah Terima</h3>
            <p className="text-gray-400">Admin memverifikasi bukti bayar, mengambil kredensial game terenkripsi, lalu menyerahkan data akun kepada pembeli.</p>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-gray-800 space-y-2">
            <span className="text-emerald-400 font-extrabold text-base">Step 3</span>
            <h3 className="font-bold text-white text-sm">Konfirmasi & Review</h3>
            <p className="text-gray-400">Pembeli mengamankan email/password Konami ID, lalu mengonfirmasi transaksi selesai dan memberikan ulasan.</p>
          </div>
        </div>
      </div>

      {/* Section 2: Alur Titip Akun */}
      <div className="glass-card rounded-3xl p-8 border border-gray-800 bg-slate-900/80 space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
          <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/30 text-cyan-400">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">2. Alur Fitur "Titip Akun" (Consignment Flow)</h2>
            <p className="text-xs text-gray-400">Titipkan penjualan akun eFootball milikmu kepada tim REVE EFOOTBALL.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs text-gray-300">
          <div className="bg-slate-950 p-4 rounded-xl border border-gray-800 space-y-2">
            <span className="text-cyan-400 font-bold">1. Isi Data Akun</span>
            <p className="text-gray-400">Pemilik mengisi formulir spesifikasi Epic, Big Time, GP, Coins, dan upload screenshot squad.</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-gray-800 space-y-2">
            <span className="text-cyan-400 font-bold">2. Pemeriksaan Admin</span>
            <p className="text-gray-400">Admin memeriksa keabsahan data & harga (Status: Pending / Under Review).</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-gray-800 space-y-2">
            <span className="text-cyan-400 font-bold">3. Listing Dipublikasi</span>
            <p className="text-gray-400">Setelah disetujui (Approved), akun resmi tayang di marketplace publik.</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-gray-800 space-y-2">
            <span className="text-cyan-400 font-bold">4. Pencairan Hasil</span>
            <p className="text-gray-400">Setelah transaksi dengan pembeli selesai, dana penjualan dikirim ke saldo pemilik.</p>
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-2 gradient-button px-8 py-3.5 rounded-2xl text-sm font-extrabold shadow-xl shadow-emerald-500/20"
        >
          Mulai Jelajahi Marketplace Sekarang
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
