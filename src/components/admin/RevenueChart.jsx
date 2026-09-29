import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  ShieldCheck,
  Zap,
  Calendar,
  ArrowUpRight,
  PlusCircle,
  Edit,
  RotateCcw,
  CheckCircle2,
  Clock,
  Smartphone,
  Layers,
  X,
  Trash2,
  Plus,
  Save,
  Check
} from 'lucide-react';

const DEFAULT_METRICS = {
  totalGross: 20350000,
  feePercent: 5,
  customFee: null, // null means auto calculated from totalGross * feePercent / 100
  pendingEscrow: 472500,
  avgTime: '12 Menit',
  growth: '+18.6%',
};

const DEFAULT_DATASETS = {
  weekly: {
    labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
    sales: [850000, 1200000, 950000, 1450000, 1900000, 2400000, 1850000],
  },
  monthly: {
    labels: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'],
    sales: [3850000, 4900000, 6200000, 5400000],
  },
  yearly: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep'],
    sales: [12000000, 14500000, 16800000, 15200000, 18900000, 21400000, 24000000, 22500000, 26800000],
  }
};

export default function RevenueChart() {
  const [timeframe, setTimeframe] = useState('monthly'); // 'weekly', 'monthly', 'yearly'
  const [metrics, setMetrics] = useState(() => {
    const saved = localStorage.getItem('reve_revenue_metrics');
    return saved ? JSON.parse(saved) : DEFAULT_METRICS;
  });

  const [chartData, setChartData] = useState(() => {
    const saved = localStorage.getItem('reve_revenue_chart_data');
    return saved ? JSON.parse(saved) : DEFAULT_DATASETS;
  });

  const [salesRecords, setSalesRecords] = useState(() => {
    const saved = localStorage.getItem('reve_sales_records');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Akun Sultan 25+ Epic (Messi 105)', amount: 1850000, fee: 92500, date: '2026-09-27', device: 'Android' },
      { id: 2, title: 'Squad Full Big Time Ronaldo 103', amount: 1200000, fee: 60000, date: '2026-09-26', device: 'iOS' },
      { id: 3, title: 'Starter Epic Messi + 5000 Coins', amount: 450000, fee: 22500, date: '2026-09-25', device: 'Android' },
    ];
  });

  // Modals state
  const [showEditMetricsModal, setShowEditMetricsModal] = useState(false);
  const [showAddSaleModal, setShowAddSaleModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Form states
  const [editForm, setEditForm] = useState({
    totalGross: metrics.totalGross,
    feePercent: metrics.feePercent,
    customFee: metrics.customFee !== null ? metrics.customFee : Math.round((metrics.totalGross * metrics.feePercent) / 100),
    pendingEscrow: metrics.pendingEscrow,
    avgTime: metrics.avgTime,
    growth: metrics.growth,
  });

  const [saleForm, setSaleForm] = useState({
    title: '',
    amount: '',
    feePercent: 5,
    device: 'Android',
    date: new Date().toISOString().split('T')[0],
  });

  // Save changes to localStorage whenever state updates
  useEffect(() => {
    localStorage.setItem('reve_revenue_metrics', JSON.stringify(metrics));
  }, [metrics]);

  useEffect(() => {
    localStorage.setItem('reve_revenue_chart_data', JSON.stringify(chartData));
  }, [chartData]);

  useEffect(() => {
    localStorage.setItem('reve_sales_records', JSON.stringify(salesRecords));
  }, [salesRecords]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Helper calculation for Admin Fee
  const calculatedFee = metrics.customFee !== null && metrics.customFee !== undefined
    ? metrics.customFee
    : Math.round((metrics.totalGross * (metrics.feePercent || 5)) / 100);

  // Handle Save Metrics Edit
  const handleSaveMetrics = (e) => {
    e.preventDefault();
    const newGross = parseFloat(editForm.totalGross) || 0;
    const newPercent = parseFloat(editForm.feePercent) || 5;
    const newCustomFee = editForm.customFee !== '' && editForm.customFee !== null ? parseFloat(editForm.customFee) : null;
    const newPending = parseFloat(editForm.pendingEscrow) || 0;

    setMetrics({
      totalGross: newGross,
      feePercent: newPercent,
      customFee: newCustomFee,
      pendingEscrow: newPending,
      avgTime: editForm.avgTime || '12 Menit',
      growth: editForm.growth || '+18.6%',
    });

    setShowEditMetricsModal(false);
    showToast('✅ Nominal omset & metrik keuangan berhasil diperbarui!');
  };

  // Handle Submit New Sale Transaction (Catat Penjualan Akun Baru)
  const handleAddSale = (e) => {
    e.preventDefault();
    const amountVal = parseFloat(saleForm.amount);
    if (!amountVal || amountVal <= 0) {
      alert('Silakan masukkan nominal angka omset penjualan yang valid.');
      return;
    }

    const feeAmount = Math.round((amountVal * (parseFloat(saleForm.feePercent) || 5)) / 100);

    const newRecord = {
      id: Date.now(),
      title: saleForm.title || `Penjualan Akun eFootball (${saleForm.device})`,
      amount: amountVal,
      fee: feeAmount,
      date: saleForm.date,
      device: saleForm.device,
    };

    // Update total gross and sales log
    const updatedGross = metrics.totalGross + amountVal;
    setMetrics(prev => ({
      ...prev,
      totalGross: updatedGross,
    }));

    setSalesRecords(prev => [newRecord, ...prev]);

    // Update active chart data by adding amount to latest column
    setChartData(prev => {
      const copy = { ...prev };
      const currentList = [...copy[timeframe].sales];
      currentList[currentList.length - 1] += amountVal;
      copy[timeframe] = {
        ...copy[timeframe],
        sales: currentList
      };
      return copy;
    });

    setShowAddSaleModal(false);
    setSaleForm({
      title: '',
      amount: '',
      feePercent: 5,
      device: 'Android',
      date: new Date().toISOString().split('T')[0],
    });
    showToast(`🎉 Penjualan baru Rp ${amountVal.toLocaleString('id-ID')} berhasil dicatat & ditambahkan ke omset!`);
  };

  // Delete sales record
  const handleDeleteRecord = (id) => {
    const target = salesRecords.find(r => r.id === id);
    if (!target) return;
    if (!window.confirm(`Hapus catatan penjualan "${target.title}" (Rp ${target.amount.toLocaleString('id-ID')})?`)) return;

    setSalesRecords(prev => prev.filter(r => r.id !== id));
    setMetrics(prev => ({
      ...prev,
      totalGross: Math.max(0, prev.totalGross - target.amount)
    }));
    showToast('Catatan penjualan berhasil dihapus.');
  };

  // Reset data to defaults
  const handleResetDefault = () => {
    if (window.confirm('Kembalikan seluruh data omset ke nilai standar bawaan?')) {
      setMetrics(DEFAULT_METRICS);
      setChartData(DEFAULT_DATASETS);
      localStorage.removeItem('reve_revenue_metrics');
      localStorage.removeItem('reve_revenue_chart_data');
      localStorage.removeItem('reve_sales_records');
      showToast('Data omset telah dikembalikan ke awal.');
    }
  };

  // Active dataset for chart bars calculation
  const activeSeries = chartData[timeframe] || DEFAULT_DATASETS.monthly;
  const maxSales = Math.max(...activeSeries.sales, 1);

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {toastMsg && (
        <div className="bg-emerald-500 text-slate-950 px-4 py-3 rounded-2xl font-extrabold text-xs flex items-center justify-between shadow-2xl animate-bounce">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> {toastMsg}
          </span>
          <button onClick={() => setToastMsg('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Control Action Toolbar */}
      <div className="glass-card p-4 rounded-2xl border border-gray-800 bg-slate-900/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-bold text-white">Kelola Manual Omset Penjualan REVE EFOOTBALL</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              setSaleForm({
                title: '',
                amount: '',
                feePercent: 5,
                device: 'Android',
                date: new Date().toISOString().split('T')[0],
              });
              setShowAddSaleModal(true);
            }}
            className="gradient-button px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            + Input Penjualan Akun Baru
          </button>

          <button
            onClick={() => {
              setEditForm({
                totalGross: metrics.totalGross,
                feePercent: metrics.feePercent,
                customFee: calculatedFee,
                pendingEscrow: metrics.pendingEscrow,
                avgTime: metrics.avgTime,
                growth: metrics.growth,
              });
              setShowEditMetricsModal(true);
            }}
            className="bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit Nominal Omset
          </button>

          <button
            onClick={handleResetDefault}
            className="bg-slate-950 hover:bg-slate-800 text-gray-400 hover:text-white border border-gray-800 p-2 rounded-xl text-xs transition-colors"
            title="Reset Data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Financial Metric Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Omset Penjualan */}
        <div className="glass-card p-5 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 relative overflow-hidden group shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">Total Omset Penjualan</span>
            <button
              onClick={() => setShowEditMetricsModal(true)}
              className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:scale-110 transition-transform"
              title="Edit Omset"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-white tracking-tight">
              Rp {metrics.totalGross.toLocaleString('id-ID')}
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                <ArrowUpRight className="w-3 h-3" /> {metrics.growth}
              </span>
              <span className="text-[10px] text-gray-400">vs periode lalu</span>
            </div>
          </div>
        </div>

        {/* Keuntungan Admin (Fee 5% Escrow) */}
        <div className="glass-card p-5 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 relative overflow-hidden group shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">Keuntungan Fee Admin ({metrics.feePercent}%)</span>
            <button
              onClick={() => setShowEditMetricsModal(true)}
              className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:scale-110 transition-transform"
              title="Edit Fee"
            >
              <DollarSign className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-amber-400 tracking-tight">
              Rp {calculatedFee.toLocaleString('id-ID')}
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                <CheckCircle2 className="w-3 h-3" /> Auto Fee Escrow
              </span>
              <span className="text-[10px] text-gray-400">Kas Masuk Direct</span>
            </div>
          </div>
        </div>

        {/* Dana Escrow Terkunci */}
        <div className="glass-card p-5 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/30 relative overflow-hidden group shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">Dana Escrow Dalam Proses</span>
            <button
              onClick={() => setShowEditMetricsModal(true)}
              className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:scale-110 transition-transform"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-cyan-400 tracking-tight">
              Rp {metrics.pendingEscrow.toLocaleString('id-ID')}
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                <Clock className="w-3 h-3 text-cyan-400 animate-spin" /> Pending Handover
              </span>
            </div>
          </div>
        </div>

        {/* Kecepatan Transaksi */}
        <div className="glass-card p-5 rounded-2xl border border-purple-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/30 relative overflow-hidden group shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">Rata-rata Waktu Escrow</span>
            <button
              onClick={() => setShowEditMetricsModal(true)}
              className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:scale-110 transition-transform"
            >
              <Zap className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-purple-300 tracking-tight">{metrics.avgTime}</div>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                ⚡ 99.4% SLA Fast Trade
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Revenue Graph Card */}
      <div className="glass-card rounded-3xl p-6 border border-gray-800 bg-slate-900/90 shadow-2xl space-y-6">
        {/* Graph Header with Timeframe Selectors */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-base font-extrabold text-white">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Grafik Penghasilan & Volume Transaksi
            </div>
            <p className="text-xs text-gray-400 mt-0.5">Visualisasi tren omset penjualan akun dan pendapatan komisi Admin REVE EFOOTBALL.</p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-gray-800 self-start sm:self-auto">
            <button
              onClick={() => setTimeframe('weekly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeframe === 'weekly' ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' : 'text-gray-400 hover:text-white'
              }`}
            >
              7 Hari
            </button>
            <button
              onClick={() => setTimeframe('monthly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeframe === 'monthly' ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' : 'text-gray-400 hover:text-white'
              }`}
            >
              Bulan Ini
            </button>
            <button
              onClick={() => setTimeframe('yearly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeframe === 'yearly' ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' : 'text-gray-400 hover:text-white'
              }`}
            >
              Tahun Ini
            </button>
          </div>
        </div>

        {/* Visual Custom SVG Bar Chart */}
        <div className="space-y-3">
          <div className="h-64 w-full pt-4 pb-2 px-2 flex items-end gap-3 sm:gap-6 justify-between bg-slate-950/60 rounded-2xl border border-gray-800/80 relative overflow-hidden">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none p-4 opacity-20">
              <div className="border-b border-gray-500 w-full" />
              <div className="border-b border-gray-500 w-full" />
              <div className="border-b border-gray-500 w-full" />
              <div className="border-b border-gray-500 w-full" />
            </div>

            {/* Bars for Each Data Point */}
            {activeSeries.sales.map((val, idx) => {
              const heightPercent = Math.max(15, Math.round((val / maxSales) * 100));
              const feeVal = Math.round((val * (metrics.feePercent || 5)) / 100);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group z-10 relative">
                  {/* Tooltip on Hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-14 bg-slate-900 border border-emerald-500/40 text-white text-[10px] p-2 rounded-xl shadow-2xl pointer-events-none whitespace-nowrap z-30">
                    <div className="font-bold text-emerald-400">Omset: Rp {val.toLocaleString('id-ID')}</div>
                    <div className="text-amber-400">Fee ({metrics.feePercent}%): Rp {feeVal.toLocaleString('id-ID')}</div>
                  </div>

                  {/* Gradient Bar Column */}
                  <div className="w-full max-w-[48px] bg-slate-900 rounded-t-xl overflow-hidden flex flex-col justify-end p-0.5 relative group-hover:border group-hover:border-emerald-500/50 transition-all">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full rounded-t-lg bg-gradient-to-t from-emerald-600 via-teal-400 to-emerald-300 transition-all duration-500 relative group-hover:brightness-125"
                    >
                      <div className="absolute top-1 left-0 right-0 h-1 bg-white/40 rounded-full mx-1" />
                    </div>
                  </div>

                  {/* Label */}
                  <span className="text-[11px] font-semibold text-gray-400 group-hover:text-emerald-400 transition-colors">
                    {activeSeries.labels[idx]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Chart Legend */}
          <div className="flex flex-wrap items-center justify-between text-xs text-gray-400 pt-2 px-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-gradient-to-r from-emerald-500 to-teal-400 inline-block" />
                <span>Volume Omset Penjualan</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-amber-400 inline-block" />
                <span>Pendapatan Komisi Admin ({metrics.feePercent}%)</span>
              </div>
            </div>
            <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> Dapat diinput manual oleh Admin
            </div>
          </div>
        </div>

        {/* Sales Log Table: Catatan Penjualan Baru Yang Diinput Admin */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-gray-800 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                Daftar Penjualan Akun Diinput Manual ({salesRecords.length})
              </h3>
              <p className="text-[11px] text-gray-400">Setiap ada akun terjual baru, data dapat diinput untuk otomatis menambah omset & grafik.</p>
            </div>
            <button
              onClick={() => {
                setSaleForm({
                  title: '',
                  amount: '',
                  feePercent: 5,
                  device: 'Android',
                  date: new Date().toISOString().split('T')[0],
                });
                setShowAddSaleModal(true);
              }}
              className="gradient-button px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-md shadow-emerald-500/20"
            >
              <Plus className="w-3.5 h-3.5" /> Input Penjualan Baru
            </button>
          </div>

          {salesRecords.length === 0 ? (
            <div className="text-center py-6 text-xs text-gray-500">Belum ada catatan penjualan manual yang ditambahkan.</div>
          ) : (
            <div className="divide-y divide-gray-800/60">
              {salesRecords.map(record => (
                <div key={record.id} className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-900/40 px-2 rounded-xl transition-colors">
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      {record.title}
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-gray-300 font-medium border border-gray-700">{record.device}</span>
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5">
                      Tanggal: <span className="text-gray-300">{record.date}</span> • Fee Komisi Admin: <span className="text-amber-400 font-bold">Rp {record.fee.toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="text-sm font-extrabold text-emerald-400">
                      + Rp {record.amount.toLocaleString('id-ID')}
                    </span>
                    <button
                      onClick={() => handleDeleteRecord(record.id)}
                      className="text-gray-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                      title="Hapus Penjualan Ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: Edit Metrics / Omset Manual */}
      {showEditMetricsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-gray-800 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2 text-base font-bold text-white">
                <Edit className="w-5 h-5 text-amber-400" />
                Edit Nominal Omset & Keuangan Admin
              </div>
              <button
                onClick={() => setShowEditMetricsModal(false)}
                className="p-1 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMetrics} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-300 mb-1 block">Total Omset Penjualan (Rp)</label>
                <input
                  type="number"
                  required
                  value={editForm.totalGross}
                  onChange={(e) => setEditForm({ ...editForm, totalGross: e.target.value })}
                  placeholder="Contoh: 20350000"
                  className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-bold placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-300 mb-1 block">Persentase Fee Admin (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editForm.feePercent}
                    onChange={(e) => setEditForm({ ...editForm, feePercent: e.target.value })}
                    placeholder="5"
                    className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3.5 py-2 text-sm text-white font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-300 mb-1 block">Nominal Fee Admin (Rp)</label>
                  <input
                    type="number"
                    value={editForm.customFee}
                    onChange={(e) => setEditForm({ ...editForm, customFee: e.target.value })}
                    placeholder="Otomatis atau isi manual"
                    className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3.5 py-2 text-sm text-amber-400 font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 mb-1 block">Dana Escrow Dalam Proses (Rp)</label>
                <input
                  type="number"
                  value={editForm.pendingEscrow}
                  onChange={(e) => setEditForm({ ...editForm, pendingEscrow: e.target.value })}
                  placeholder="472500"
                  className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3.5 py-2 text-sm text-cyan-400 font-bold focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-300 mb-1 block">Rata-rata Waktu SLA</label>
                  <input
                    type="text"
                    value={editForm.avgTime}
                    onChange={(e) => setEditForm({ ...editForm, avgTime: e.target.value })}
                    placeholder="12 Menit"
                    className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-300 mb-1 block">Pertumbuhan (%)</label>
                  <input
                    type="text"
                    value={editForm.growth}
                    onChange={(e) => setEditForm({ ...editForm, growth: e.target.value })}
                    placeholder="+18.6%"
                    className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3.5 py-2 text-sm text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditMetricsModal(false)}
                  className="w-1/2 py-2.5 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-xl text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 gradient-button rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
                >
                  <Save className="w-4 h-4" /> Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Input Transaksi Penjualan Akun Baru */}
      {showAddSaleModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-gray-800 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2 text-base font-bold text-white">
                <PlusCircle className="w-5 h-5 text-emerald-400" />
                Catat Penjualan Akun Terjual Baru
              </div>
              <button
                onClick={() => setShowAddSaleModal(false)}
                className="p-1 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSale} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-300 mb-1 block">Nominal Harga Terjual / Omset (Rp)</label>
                <input
                  type="number"
                  required
                  value={saleForm.amount}
                  onChange={(e) => setSaleForm({ ...saleForm, amount: e.target.value })}
                  placeholder="Contoh: 1500000"
                  className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-emerald-400 font-extrabold placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 mb-1 block">Keterangan / Nama Akun Terjual</label>
                <input
                  type="text"
                  value={saleForm.title}
                  onChange={(e) => setSaleForm({ ...saleForm, title: e.target.value })}
                  placeholder="Contoh: Akun Sultan Messi 105 + 3500 Coins"
                  className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-300 mb-1 block">Device Akun</label>
                  <select
                    value={saleForm.device}
                    onChange={(e) => setSaleForm({ ...saleForm, device: e.target.value })}
                    className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Android">Android</option>
                    <option value="iOS">iOS</option>
                    <option value="PC">PC (Steam)</option>
                    <option value="Console">Console</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 mb-1 block">Komisi Admin (%)</label>
                  <input
                    type="number"
                    value={saleForm.feePercent}
                    onChange={(e) => setSaleForm({ ...saleForm, feePercent: e.target.value })}
                    placeholder="5"
                    className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-amber-400 font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 mb-1 block">Tanggal Transaksi</label>
                <input
                  type="date"
                  value={saleForm.date}
                  onChange={(e) => setSaleForm({ ...saleForm, date: e.target.value })}
                  className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddSaleModal(false)}
                  className="w-1/2 py-2.5 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-xl text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 gradient-button rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
                >
                  <Check className="w-4 h-4" /> Simpan Omset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
