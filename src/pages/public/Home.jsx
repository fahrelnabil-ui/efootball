import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Zap,
  Tag,
  Headphones,
  CheckCircle2,
  ShoppingCart,
  PlusCircle,
  Package,
  Handshake,
  ArrowRight,
  PhoneCall,
  MessageSquare,
  Award,
  Users,
  Sparkles,
} from 'lucide-react';

export default function Home() {
  const ADMIN_WA_NUMBER = '6285189441644';

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
    } else {
      msg = 'Halo%20Admin%20REVE%20EFOOTBALL,%20saya%20ingin%20konsultasi%20mengenai%20layanan%20eFootball.';
      window.open(`https://wa.me/${ADMIN_WA_NUMBER}?text=${msg}`, '_blank');
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO OFFICIAL BANNER SHOWCASE */}
      <section className="relative overflow-hidden pt-6 sm:pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Main Official Banner Card */}
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-cyan-500/30 shadow-2xl shadow-cyan-950/40 bg-slate-950 group">
            <img
              src="/reve-hero-banner.png"
              alt="REVE EFOOTBALL Official Banner - Buy & Sell eFootball Account"
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.01]"
            />
            {/* Subtle glow edge overlay */}
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl sm:rounded-3xl pointer-events-none" />
          </div>

          {/* Slogan & Action Ribbon Below Banner */}
          <div className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-800 bg-slate-900/90 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Official Platform
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                REVE <span className="text-cyan-400">EFOOTBALL</span> INDONESIA
              </h1>
              <p className="text-sm sm:text-base text-gray-300 max-w-2xl leading-relaxed">
                Platform pusat jual beli, titip jual, dan rekening bersama (escrow) akun eFootball nomor satu. <strong className="text-amber-300">Your Squad, Our Priority!</strong>
              </p>
            </div>

            {/* Quick CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
              <Link
                to="/marketplace"
                className="w-full sm:w-auto gradient-button px-7 py-3.5 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 hover:scale-[1.02] transition-transform"
              >
                <ShoppingCart className="w-4 h-4" />
                Buka Katalog Marketplace
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => handleAction('chat')}
                className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700 border border-cyan-500/40 text-cyan-400 hover:text-cyan-300 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                WhatsApp Admin
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE 4 PILLARS (DARI BANNER RESMI) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Keunggulan Layanan</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Kenapa Harus di REVE EFOOTBALL?</h2>
          <p className="text-xs sm:text-sm text-gray-400">
            Standar keamanan tertinggi dan pelayanan profesional untuk seluruh penggemar eFootball.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Pillar 1 */}
          <div className="glass-card rounded-2xl p-6 border border-gray-800 hover:border-cyan-500/40 bg-slate-900/80 transition-all hover:-translate-y-1 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-white">AKUN AMAN</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Garansi keamanan 100%. Akun diverifikasi secara menyeluruh, bebas isu hackback, dan data Konami ID diamankan secara tuntas.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-cyan-400 flex items-center gap-1 pt-2 border-t border-gray-800/80">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Proteksi Transaksi
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="glass-card rounded-2xl p-6 border border-gray-800 hover:border-amber-500/40 bg-slate-900/80 transition-all hover:-translate-y-1 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Zap className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-white">PROSES CEPAT</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Serah terima data akun dan verifikasi hanya memakan waktu beberapa menit langsung dipandu oleh admin resmi via WhatsApp.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-amber-400 flex items-center gap-1 pt-2 border-t border-gray-800/80">
              <CheckCircle2 className="w-3.5 h-3.5" /> Serah Terima Kilat
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="glass-card rounded-2xl p-6 border border-gray-800 hover:border-emerald-500/40 bg-slate-900/80 transition-all hover:-translate-y-1 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Tag className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-white">HARGA TERBAIK</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Penetapan harga yang kompetitif, realistis, dan ramah kantong baik untuk squad starter, Epic Big Time, hingga akun sultan koleksi.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 pt-2 border-t border-gray-800/80">
              <CheckCircle2 className="w-3.5 h-3.5" /> Transparan Tanpa Biaya Tersembunyi
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="glass-card rounded-2xl p-6 border border-gray-800 hover:border-purple-500/40 bg-slate-900/80 transition-all hover:-translate-y-1 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Headphones className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-white">SUPPORT 24/7</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Tim admin profesional selalu siap membantu menjawab konsultasi, pertanyaan spesifikasi squad, hingga panduan pergantian email.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-purple-400 flex items-center gap-1 pt-2 border-t border-gray-800/80">
              <CheckCircle2 className="w-3.5 h-3.5" /> Fast Response Contact Person
            </div>
          </div>
        </div>
      </section>

      {/* 3. TENTANG REVE EFOOTBALL & MISI KAMI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-gray-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            
            {/* Left Column: Text Story */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Award className="w-3.5 h-3.5" /> Tentang REVE EFOOTBALL
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Rumah Utama Pecinta & Komunitas eFootball
              </h2>

              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                <strong>REVE EFOOTBALL</strong> didirikan dengan satu tujuan utama: memberikan rasa tenang, aman, dan mudah bagi para gamer sepak bola eFootball dalam bertransaksi. Kami memahami betapa berharganya squad yang telah dibangun dengan waktu, usaha, dan biaya.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300">
                    <strong className="text-white">Tanpa Ribet Registrasi:</strong> Seluruh komunikasi transaksi dilakukan langsung melalui WhatsApp Official Admin sehingga pembeli dan penjual tidak perlu repot mengingat kata sandi tambahan.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300">
                    <strong className="text-white">Katalog Terpusat di Marketplace:</strong> Semua akun ready maupun riwayat akun terjual dikelompokkan rapi di halaman Marketplace dengan filter lengkap spesifikasi squad.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300">
                    <strong className="text-white">Jaminan Keamanan Escrow:</strong> Dana Anda hanya akan diteruskan setelah akun berhasil diamankan dengan data email pribadi Anda.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Highlight Box */}
            <div className="space-y-4">
              <div className="bg-slate-950 p-6 sm:p-8 rounded-2xl border border-gray-800 space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  Komitmen Pelayanan Kami
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-gray-800">
                    <div className="text-2xl sm:text-3xl font-black text-cyan-400">100%</div>
                    <div className="text-xs text-gray-400 mt-1">Garansi Perlindungan Akun</div>
                  </div>
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-gray-800">
                    <div className="text-2xl sm:text-3xl font-black text-emerald-400">&lt; 15 Menit</div>
                    <div className="text-xs text-gray-400 mt-1">Rata-Rata Waktu Proses</div>
                  </div>
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-gray-800">
                    <div className="text-2xl sm:text-3xl font-black text-amber-400">24 Jam</div>
                    <div className="text-xs text-gray-400 mt-1">Siap Melayani Tiap Hari</div>
                  </div>
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-gray-800">
                    <div className="text-2xl sm:text-3xl font-black text-purple-400">All Device</div>
                    <div className="text-xs text-gray-400 mt-1">Android, iOS, PC & Console</div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/marketplace"
                    className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20"
                  >
                    <span>Kunjungi Marketplace Akun Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. LAYANAN LENGKAP REVE EFOOTBALL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Semua Kebutuhanmu Ada Di REVE</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Layanan Lengkap REVE EFOOTBALL</h2>
          <p className="text-xs sm:text-sm text-gray-400">
            Dari beli akun impian hingga jasa rekber escrow, kami siap melayani setiap tahap transaksi Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card Layanan 1: Beli Akun */}
          <div className="glass-card rounded-2xl p-6 border border-gray-800 hover:border-emerald-500/40 bg-slate-900/80 transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Beli Akun (Marketplace)</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Temukan squad idaman dengan kartu Epic, Big Time, Showtime, Booster, serta coin dan GP melimpah di katalog kami.
                </p>
              </div>
            </div>
            <Link
              to="/marketplace"
              className="w-full py-2.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Buka Marketplace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card Layanan 2: Jual Akun */}
          <div className="glass-card rounded-2xl p-6 border border-gray-800 hover:border-cyan-500/40 bg-slate-900/80 transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <PlusCircle className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Jual Akun Cepat</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Ingin pensiun atau ganti akun? Jual akunmu ke kami dengan penaksiran harga yang adil dan pembayaran instan.
                </p>
              </div>
            </div>
            <button
              onClick={() => handleAction('jual')}
              className="w-full py-2.5 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-400 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Jual Akun (WhatsApp)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card Layanan 3: Titip Akun */}
          <div className="glass-card rounded-2xl p-6 border border-gray-800 hover:border-amber-500/40 bg-slate-900/80 transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Package className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Titip Jual (Konsinyasi)</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Titipkan akunmu di website REVE EFOOTBALL agar dilihat oleh ribuan calon pembeli aktif setiap harinya.
                </p>
              </div>
            </div>
            <button
              onClick={() => handleAction('titip')}
              className="w-full py-2.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Titip Akun (WhatsApp)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card Layanan 4: Rekber Escrow */}
          <div className="glass-card rounded-2xl p-6 border border-gray-800 hover:border-purple-500/40 bg-slate-900/80 transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Handshake className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Rekber / Escrow</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Sudah punya pembeli/penjual sendiri? Gunakan jasa Rekber REVE EFOOTBALL agar transaksi 100% aman anti tipu-tipu.
                </p>
              </div>
            </div>
            <button
              onClick={() => handleAction('rekber')}
              className="w-full py-2.5 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-400 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Jasa Rekber (WhatsApp)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. CONTACT PERSON OFFICIAL HIGHLIGHT BOX */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-8 sm:p-10 border border-emerald-500/40 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <PhoneCall className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Admin Online 24/7</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">Official Contact Person (+62 851-8944-1644)</h3>
              <p className="text-xs sm:text-sm text-gray-300">
                Punya pertanyaan seputar akun atau ingin memesan squad tertentu? Langsung kirim pesan ke WhatsApp kami.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleAction('chat')}
            className="w-full md:w-auto gradient-button px-8 py-4 rounded-xl text-base font-extrabold flex items-center justify-center gap-2 shrink-0 shadow-xl shadow-emerald-500/20 hover:scale-[1.02] transition-transform cursor-pointer"
          >
            <MessageSquare className="w-5 h-5" />
            Chat Admin WhatsApp Sekarang
          </button>
        </div>
      </section>
    </div>
  );
}
