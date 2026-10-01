import express from 'express';
import prisma from '../db.js';
import { authenticateToken, requireAdmin } from '../middlewares/auth.js';

const router = express.Router();

// GET /api/admin/dashboard - High-level Admin Statistics & Metrics
router.get('/dashboard', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalListings = await prisma.listing.count();
    const pendingListings = await prisma.listing.count({ where: { status: 'pending' } });
    const totalOrders = await prisma.order.count();
    const activeOrders = await prisma.order.count({
      where: {
        status: { in: ['pending_payment', 'payment_review', 'paid', 'processing', 'handover'] },
      },
    });
    const completedOrders = await prisma.order.count({ where: { status: 'completed' } });
    const openDisputes = await prisma.dispute.count({ where: { status: { in: ['open', 'investigating'] } } });
    const pendingWithdrawals = await prisma.withdrawal.count({ where: { status: 'pending' } });

    const feeSum = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { type: 'fee', status: 'completed' },
    });

    const totalRevenue = feeSum._sum.amount || 0;

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalListings,
        pendingListings,
        totalOrders,
        activeOrders,
        completedOrders,
        openDisputes,
        pendingWithdrawals,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error('Admin dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil statistik admin.' });
  }
});

// POST /api/admin/listings - Admin Tambah Stok Akun Baru & Upload Foto
router.post('/listings', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      title,
      price,
      platform,
      stock = 1,
      playerCount,
      epicCount,
      bigTimeCount,
      gpAmount,
      coinAmount,
      squadInfo,
      description,
      images = [],
      loginType = 'Konami ID',
      credentials = '',
      notes = '',
    } = req.body;

    const safeInt = (val, fallback = 0) => {
      if (val === undefined || val === null || val === '') return fallback;
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? fallback : parsed;
    };

    const safeFloat = (val, fallback = 0) => {
      if (val === undefined || val === null || val === '') return fallback;
      const parsed = parseFloat(val);
      return isNaN(parsed) ? fallback : parsed;
    };

    if (!title || !price || !platform || !description) {
      return res.status(400).json({ success: false, message: 'Judul, harga, platform, dan deskripsi wajib diisi.' });
    }

    const listing = await prisma.listing.create({
      data: {
        userId: req.user.id,
        title,
        price: safeFloat(price, 0),
        platform,
        stock: safeInt(stock, 1),
        playerCount: safeInt(playerCount, 0),
        epicCount: safeInt(epicCount, 0),
        bigTimeCount: safeInt(bigTimeCount, 0),
        gpAmount: safeInt(gpAmount, 0),
        coinAmount: safeInt(coinAmount, 0),
        squadInfo: squadInfo || '',
        description,
        status: 'approved', // Admin listings are immediately approved and live
        isVerified: true,
        images: {
          create: images.length > 0
            ? images.map((imgUrl, idx) => ({ imageUrl: imgUrl, isPrimary: idx === 0 }))
            : [{ imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800', isPrimary: true }],
        },
        gameAccountDetail: {
          create: {
            loginType,
            encryptedCredentials: credentials ? `ENC_${credentials}` : 'ENC_ADMIN_STOCK_CREDENTIALS',
            notes,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Stok akun eFootball berhasil ditambahkan & langsung tayang di marketplace!',
      data: listing,
    });
  } catch (error) {
    console.error('Admin create listing error:', error);
    res.status(500).json({ success: false, message: 'Gagal menambahkan stok akun.' });
  }
});

// PUT /api/admin/listings/:id - Admin Update Stok & Foto Listing
router.put('/listings/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      title,
      price,
      platform,
      stock,
      playerCount,
      epicCount,
      bigTimeCount,
      gpAmount,
      coinAmount,
      squadInfo,
      description,
      status,
      images = [],
      credentials,
    } = req.body;

    const safeInt = (val, fallback = 0) => {
      if (val === undefined || val === null || val === '') return fallback;
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? fallback : parsed;
    };

    const safeFloat = (val, fallback = 0) => {
      if (val === undefined || val === null || val === '') return fallback;
      const parsed = parseFloat(val);
      return isNaN(parsed) ? fallback : parsed;
    };

    const parsedStock = safeInt(stock, 1);
    let finalStatus = status;
    if (!finalStatus) {
      finalStatus = parsedStock <= 0 ? 'sold' : 'approved';
    } else if (parsedStock <= 0) {
      finalStatus = 'sold';
    }

    const listing = await prisma.listing.update({
      where: { id: req.params.id },
      data: {
        title: title || undefined,
        price: price !== undefined && price !== '' ? safeFloat(price, 0) : undefined,
        platform: platform || undefined,
        stock: finalStatus === 'sold' ? 0 : parsedStock,
        playerCount: safeInt(playerCount, 0),
        epicCount: safeInt(epicCount, 0),
        bigTimeCount: safeInt(bigTimeCount, 0),
        gpAmount: safeInt(gpAmount, 0),
        coinAmount: safeInt(coinAmount, 0),
        squadInfo: squadInfo !== undefined ? squadInfo : undefined,
        description: description !== undefined ? description : undefined,
        status: finalStatus,
      },
    });

    // Update images if provided
    if (images.length > 0) {
      await prisma.listingImage.deleteMany({ where: { listingId: req.params.id } });
      await prisma.listingImage.createMany({
        data: images.map((imgUrl, idx) => ({
          listingId: req.params.id,
          imageUrl: imgUrl,
          isPrimary: idx === 0,
        })),
      });
    }

    // Update credentials if provided
    if (credentials) {
      await prisma.gameAccountDetail.upsert({
        where: { listingId: req.params.id },
        update: { encryptedCredentials: `ENC_${credentials}` },
        create: {
          listingId: req.params.id,
          loginType: 'Konami ID',
          encryptedCredentials: `ENC_${credentials}`,
        },
      });
    }

    res.json({
      success: true,
      message: finalStatus === 'sold' 
        ? 'Stok berhasil diperbarui: Akun ditandai sebagai TERJUAL (SOLD)!' 
        : 'Data stok & foto akun berhasil diperbarui!',
      data: listing,
    });
  } catch (error) {
    console.error('Admin update listing error:', error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui stok listing: ' + (error.message || 'Server error') });
  }
});

// PATCH /api/admin/listings/:id/toggle-sold - Admin Quick Toggle Sold/Ready
router.patch('/listings/:id/toggle-sold', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const listing = await prisma.listing.findUnique({ where: { id: req.params.id } });
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing tidak ditemukan.' });
    }

    const isCurrentlySold = listing.status === 'sold' || listing.stock <= 0;
    const targetStatus = req.body.status || (isCurrentlySold ? 'approved' : 'sold');
    const newStock = targetStatus === 'sold' ? 0 : (listing.stock > 0 ? listing.stock : 1);

    const updated = await prisma.listing.update({
      where: { id: req.params.id },
      data: {
        status: targetStatus,
        stock: newStock,
      },
    });

    res.json({
      success: true,
      message: targetStatus === 'sold'
        ? 'Akun berhasil ditandai sebagai TERJUAL (SOLD).'
        : 'Akun berhasil ditandai kembali sebagai TERSEDIA (READY).',
      data: updated,
    });
  } catch (error) {
    console.error('Admin toggle sold error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengubah status terjual listing.' });
  }
});

// DELETE /api/admin/listings/:id - Admin Delete Listing
router.delete('/listings/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const listingId = req.params.id;

    // Check if listing exists
    const existing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Listing tidak ditemukan.' });
    }

    // Safely delete any associated child records in cascade order
    await prisma.listingImage.deleteMany({ where: { listingId } });
    await prisma.gameAccountDetail.deleteMany({ where: { listingId } });
    await prisma.consignment.deleteMany({ where: { listingId } });
    await prisma.review.deleteMany({ where: { listingId } });

    // Handle any orders linked to this listing (delete payments, disputes, transactions first)
    const orders = await prisma.order.findMany({ where: { listingId } });
    for (const order of orders) {
      await prisma.payment.deleteMany({ where: { orderId: order.id } });
      await prisma.dispute.deleteMany({ where: { orderId: order.id } });
      await prisma.transaction.deleteMany({ where: { orderId: order.id } });
    }
    await prisma.order.deleteMany({ where: { listingId } });

    // Finally delete the listing
    await prisma.listing.delete({ where: { id: listingId } });

    res.json({ success: true, message: 'Stok akun berhasil dihapus permanen dari sistem.' });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({ success: false, message: 'Gagal menghapus stok akun: ' + (error.message || 'Server error') });
  }
});

// GET /api/admin/users - Admin User Management
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        balance: true,
        phone: true,
        isVerified: true,
        createdAt: true,
      },
    });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data user.' });
  }
});

// PATCH /api/admin/users/:id/verify - Verify User
router.patch('/users/:id/verify', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { isVerified } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { isVerified: Boolean(isVerified) },
    });
    res.json({ success: true, message: 'Status verifikasi user diperbarui.', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui status user.' });
  }
});

// GET /api/admin/settings - Platform Settings
router.get('/settings', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const settings = await prisma.setting.findMany();
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil pengaturan.' });
  }
});

// POST /api/admin/settings - Update Setting
router.post('/settings', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { key, value } = req.body;
    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    res.json({ success: true, message: 'Pengaturan berhasil disimpan.', data: setting });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menyimpan pengaturan.' });
  }
});

export default router;
