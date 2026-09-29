import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gamepad2, ShieldAlert, Lock, HelpCircle } from 'lucide-react';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-slate-950 border-t border-gray-800/80 pt-16 pb-12 mt-20 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-gray-800/80">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 via-cyan-400 to-yellow-400 p-0.5 shadow-md shadow-emerald-500/20 overflow-hidden">
                <img
                  src="/reve-logo.png"
                  alt="REVE EFOOTBALL"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                REVE <span className="text-emerald-400">EFOOTBALL</span>
              </span>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed">
              Marketplace akun eFootball terpercaya dengan sistem perantara (escrow) terstruktur. Seluruh transaksi aman dijamin oleh Admin platform.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <Lock className="w-3.5 h-3.5" /> 100% Escrow Safe
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Navigasi Utama</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/marketplace" className="hover:text-emerald-400 transition-colors">
                  Jelajahi Akun eFootball
                </Link>
              </li>
              <li>
                <button
                  onClick={() => window.open('https://wa.me/62895370263740?text=Halo%20Admin%20REVE%20EFOOTBALL,%20saya%20ingin%20menitip/menjual%20akun.', '_blank')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Titip / Jual Akun (Hubungi Admin)
                </button>
              </li>
              <li>
                <Link to="/cara-kerja" className="hover:text-emerald-400 transition-colors">
                  Cara Kerja Escrow
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service & Help */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Bantuan & Komunitas</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors cursor-pointer">
                <HelpCircle className="w-3.5 h-3.5 text-emerald-400" /> FAQ / Pertanyaan Umum
              </li>
              <li className="hover:text-emerald-400 transition-colors cursor-pointer">Panduan Serah-Terima Akun</li>
              <li className="hover:text-emerald-400 transition-colors cursor-pointer">Hubungi Contact Person Admin (+62 895-3702-63740)</li>
            </ul>
          </div>

          {/* Policies & Compliance */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Kebijakan & Legal</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="hover:text-emerald-400 transition-colors cursor-pointer">Syarat & Ketentuan Layanan</li>
              <li className="hover:text-emerald-400 transition-colors cursor-pointer">Kebijakan Privasi</li>
              <li className="hover:text-emerald-400 transition-colors cursor-pointer">Aturan Pembayaran & Escrow</li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Banner */}
        <div className="mt-8 bg-slate-900/90 border border-amber-500/20 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center gap-3">
          <ShieldAlert className="w-6 h-6 text-amber-400 shrink-0 mt-0.5 md:mt-0" />
          <div className="text-xs text-gray-300 leading-relaxed">
            <span className="font-bold text-amber-400 mr-1">DISCLAIMER KEPEMILIKAN & KETENTUAN LAYANAN KONAMI:</span>
            REVE EFOOTBALL adalah platform marketplace perantara independen. Pengguna wajib memastikan seluruh transaksi dan aktivitas terkait akun eFootball mematuhi Ketentuan Layanan (*Terms of Service*) eFootball / Konami Digital Entertainment yang berlaku. Seluruh merek dagang dan aset game merupakan hak cipta Konami.
          </div>
        </div>

        {/* Bottom copyright (Discreet double click on copyright text to open secret Admin Login) */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p
            onDoubleClick={() => navigate('/login')}
            className="cursor-default select-none"
            title=""
          >
            © 2026 REVE EFOOTBALL. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span>Privasi</span>
            <span>Syarat Ketentuan</span>
            <span>Escrow Protection</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
