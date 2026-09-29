import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Gamepad2,
  ShieldCheck,
  Search,
  PlusCircle,
  MessageSquare,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  ShieldAlert,
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const ADMIN_WA_NUMBER = '62895370263740';

  // Secret Admin Shortcut: Ctrl + Shift + A or double-clicking Logo Icon
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        navigate('/login');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const handleContactAdmin = (type = 'general') => {
    let msg = 'Halo%20Admin%20REVE%20EFOOTBALL,%20saya%20ingin%20bertanya%20mengenai%20transaksi%20akun%20eFootball.';
    if (type === 'titip') {
      msg = 'Halo%20Admin%20REVE%20EFOOTBALL,%20saya%20ingin%20menitipkan%2Fmenjual%20akun%20eFootball%20saya.%20Mohon%20info%20prosedurnya.';
    }
    window.open(`https://wa.me/${ADMIN_WA_NUMBER}?text=${msg}`, '_blank');
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0b0f19]/90 backdrop-blur-md border-b border-gray-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo (Double-click logo icon for secret Admin Login trigger) */}
          <Link to="/" className="flex items-center gap-3 group">
            <div
              onDoubleClick={(e) => {
                e.preventDefault();
                navigate('/login');
              }}
              title="REVE EFOOTBALL Logo"
              className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 via-cyan-400 to-yellow-400 p-0.5 shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform cursor-pointer overflow-hidden"
            >
              <img
                src="/reve-logo.png"
                alt="REVE EFOOTBALL"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
                REVE <span className="text-emerald-400">EFOOTBALL</span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </span>
              <span className="text-[10px] text-gray-400 block font-medium -mt-1 tracking-wider uppercase">
                Direct Contact Escrow
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links for Buyers/Visitors */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/marketplace"
              className="text-sm font-medium text-gray-300 hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <Search className="w-4 h-4 text-emerald-400" />
              Katalog Akun
            </Link>
            <button
              onClick={() => handleContactAdmin('titip')}
              className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-cyan-400" />
              Titip / Jual Akun
            </button>
            <Link
              to="/cara-kerja"
              className="text-sm font-medium text-gray-300 hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Cara Kerja
            </Link>
          </div>

          {/* Right Section: 100% WhatsApp Contact Only (Zero Login Admin text/button visible to buyers) */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => handleContactAdmin('general')}
              className="gradient-button px-5 py-2.5 rounded-xl text-sm font-extrabold flex items-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <MessageSquare className="w-4 h-4" />
              Hubungi Admin (WhatsApp)
            </button>

            {/* Admin Dashboard Panel Menu (ONLY appears after Admin successfully logs in!) */}
            {user && user.role === 'admin' && (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-slate-900 border border-amber-500/40 rounded-xl px-3 py-2 text-xs font-bold text-amber-400"
                >
                  <ShieldAlert className="w-4 h-4" />
                  Admin Control Panel
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-gray-800 rounded-2xl shadow-2xl p-2 z-50">
                    <Link
                      to="/dashboard/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-amber-400 hover:bg-slate-800 rounded-xl"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard Admin
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-xl mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout Admin
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-gray-800 px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/marketplace"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-gray-200 hover:bg-slate-800 rounded-lg"
          >
            Katalog Akun
          </Link>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handleContactAdmin('titip');
            }}
            className="w-full text-left px-3 py-2 text-base font-medium text-cyan-400 hover:bg-slate-800 rounded-lg"
          >
            Titip / Jual Akun (Hubungi Admin)
          </button>
          <Link
            to="/cara-kerja"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-gray-200 hover:bg-slate-800 rounded-lg"
          >
            Cara Kerja
          </Link>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleContactAdmin('general');
              }}
              className="w-full text-center gradient-button py-3 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Hubungi Admin Escrow (WhatsApp)
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
