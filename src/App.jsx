import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Public Pages
import Home from './pages/public/Home';
import Marketplace from './pages/public/Marketplace';
import AccountDetail from './pages/public/AccountDetail';
import Checkout from './pages/public/Checkout';
import HowItWorks from './pages/public/HowItWorks';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboard Pages
import UserDashboard from './pages/user/UserDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col justify-between">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/account/:id" element={<AccountDetail />} />
              <Route path="/checkout/:listingId" element={<Checkout />} />
              <Route path="/cara-kerja" element={<HowItWorks />} />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* User Dashboard Routes */}
              <Route path="/dashboard/user" element={<UserDashboard />} />
              <Route path="/dashboard/user/*" element={<UserDashboard />} />

              {/* Admin Dashboard Routes */}
              <Route path="/dashboard/admin" element={<AdminDashboard />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
