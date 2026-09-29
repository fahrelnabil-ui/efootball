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

    if (!title || !price || !platform || !description) {
      return res.status(400).json({ success: false, message: 'Judul, harga, platform, dan deskripsi wajib diisi.' });
    }

    const listing = await prisma.listing.create({
      data: {
        userId: req.user.id,
        title,
        price: parseFloat(price),
        platform,
        stock: parseInt(stock || 1),
        playerCount: parseInt(playerCount || 0),
        epicCount: parseInt(epicCount || 0),
        bigTimeCount: parseInt(bigTimeCount || 0),
        gpAmount: parseInt(gpAmount || 0),
        coinAmount: parseInt(coinAmount || 0),
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

    const listing = await prisma.listing.update({
      where: { id: req.params.id },
      data: {
        title,
        price: price ? parseFloat(price) : undefined,
        platform,
        stock: stock !== undefined ? parseInt(stock) : undefined,
        playerCount: playerCount !== undefined ? parseInt(playerCount) : undefined,
        epicCount: epicCount !== undefined ? parseInt(epicCount) : undefined,
        bigTimeCount: bigTimeCount !== undefined ? parseInt(bigTimeCount) : undefined,
        gpAmount: gpAmount !== undefined ? parseInt(gpAmount) : undefined,
        coinAmount: coinAmount !== undefined ? parseInt(coinAmount) : undefined,
        squadInfo,
        description,
        status,
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
      message: 'Data stok & foto akun berhasil diperbarui!',
      data: listing,
    });
  } catch (error) {
    console.error('Admin update listing error:', error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui stok listing.' });
  }
});

// DELETE /api/admin/listings/:id - Admin Delete Listing
router.delete('/listings/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await prisma.listing.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Stok akun berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menghapus stok akun.' });
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
