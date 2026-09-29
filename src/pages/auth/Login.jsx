import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Gamepad2, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard/user';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate(redirect);
      } else {
        setError(res.message || 'Login gagal.');
      }
    } catch (err) {
      setError(err.message || 'Gagal terhubung ke server.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="glass-card rounded-3xl p-8 border border-gray-800 bg-slate-900/90 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 via-cyan-400 to-yellow-400 p-0.5 mx-auto overflow-hidden shadow-xl shadow-emerald-500/20">
            <img
              src="/reve-logo.png"
              alt="REVE EFOOTBALL"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Selamat Datang Kembali</h1>
          <p className="text-xs text-gray-400">Masuk ke akun REVE EFOOTBALL Anda</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3.5 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-300 mb-1.5 block">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full bg-slate-950 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 mb-1.5 block">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Quick Demo Credentials Reminder */}
          <div className="bg-slate-950 p-3 rounded-xl border border-gray-800 text-[11px] text-gray-400 space-y-1">
            <div className="font-bold text-emerald-400">Akun Demo Cepat:</div>
            <div>User: buyer@reveefootball.com | Pass: password123</div>
            <div>Admin: admin@reveefootball.com | Pass: password123</div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full gradient-button py-3 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            {submitting ? 'Memproses...' : 'Masuk Akun'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-gray-400 pt-2">
          Belum punya akun?{' '}
          <Link to="/register" className="text-emerald-400 font-bold hover:underline">
            Daftar Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}
