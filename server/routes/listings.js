import express from 'express';
import prisma from '../db.js';
import { authenticateToken, requireAdmin } from '../middlewares/auth.js';

const router = express.Router();

// GET /api/listings - Public Marketplace Search, Filter & Sort
router.get('/', async (req, res) => {
  try {
    const {
      search,
      minPrice,
      maxPrice,
      epicMin,
      bigTimeMin,
      playerMin,
      gpMin,
      coinMin,
      platform,
      sort = 'newest',
      status = 'approved',
    } = req.query;

    const where = {
      status: status === 'all' ? undefined : status,
    };

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (epicMin) where.epicCount = { gte: parseInt(epicMin) };
    if (bigTimeMin) where.bigTimeCount = { gte: parseInt(bigTimeMin) };
    if (playerMin) where.playerCount = { gte: parseInt(playerMin) };
    if (gpMin) where.gpAmount = { gte: parseInt(gpMin) };
    if (coinMin) where.coinAmount = { gte: parseInt(coinMin) };
    if (platform && platform !== 'all') where.platform = platform;

    let orderBy = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };

    const listings = await prisma.listing.findMany({
      where,
      orderBy,
      include: {
        images: true,
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            isVerified: true,
            createdAt: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });

    res.json({ success: true, count: listings.length, data: listings });
  } catch (error) {
    console.error('Fetch listings error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data listing marketplace.' });
  }
});

// GET /api/listings/:id - Detail Akun Public (Aman: Tanpa kredensial game!)
router.get('/:id', async (req, res) => {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: req.params.id },
      include: {
        images: true,
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            isVerified: true,
            createdAt: true,
          },
        },
        reviews: {
          include: {
            reviewer: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Akun eFootball tidak ditemukan.' });
    }

    res.json({ success: true, data: listing });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil detail akun.' });
  }
});

// POST /api/listings - User Jual / Titip Akun eFootball
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      title,
      price,
      platform,
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
      isConsignment = false,
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
        playerCount: parseInt(playerCount || 0),
        epicCount: parseInt(epicCount || 0),
        bigTimeCount: parseInt(bigTimeCount || 0),
        gpAmount: parseInt(gpAmount || 0),
        coinAmount: parseInt(coinAmount || 0),
        squadInfo: squadInfo || '',
        description,
        status: 'approved',
        isVerified: true,
        images: {
          create: images.length > 0
            ? images.map((imgUrl, idx) => ({ imageUrl: imgUrl, isPrimary: idx === 0 }))
            : [{ imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800', isPrimary: true }],
        },
        gameAccountDetail: {
          create: {
            loginType,
            encryptedCredentials: credentials ? `ENC_${credentials}` : 'ENC_DEFAULT_CREDS',
            notes,
          },
        },
      },
    });

    if (isConsignment) {
      await prisma.consignment.create({
        data: {
          listingId: listing.id,
          userId: req.user.id,
          status: 'approved',
          agreedFeePercent: 5.0,
        },
      });
    }

    await prisma.notification.create({
      data: {
        userId: req.user.id,
        title: isConsignment ? 'Titip Akun Berhasil Ditayangkan!' : 'Jual Akun Berhasil Ditayangkan!',
        message: `Listing "${title}" berhasil diupload dan langsung tayang di Marketplace!`,
        type: 'listing',
        linkUrl: '/dashboard/user/listings',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Listing akun berhasil diupload dan langsung tayang di Marketplace!',
      data: listing,
    });
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ success: false, message: 'Gagal membuat listing akun.' });
  }
});

// PATCH /api/listings/:id/status - Admin Verification (Approve / Reject)
router.patch('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    if (status === 'rejected' && !rejectionReason) {
      return res.status(400).json({ success: false, message: 'Admin wajib memberikan alasan ketika menolak listing.' });
    }

    const listing = await prisma.listing.update({
      where: { id: req.params.id },
      data: {
        status,
        rejectionReason: status === 'rejected' ? rejectionReason : null,
        isVerified: status === 'approved',
      },
    });

    await prisma.notification.create({
      data: {
        userId: listing.userId,
        title: status === 'approved' ? 'Akun Disetujui & Live!' : 'Pengajuan Akun Ditolak',
        message: status === 'approved'
          ? `Listing "${listing.title}" telah disetujui Admin dan tayang di Marketplace eFootMarket.`
          : `Listing "${listing.title}" ditolak oleh Admin. Alasan: ${rejectionReason}`,
        type: 'listing',
        linkUrl: '/dashboard/user/listings',
      },
    });

    res.json({ success: true, message: `Status listing berhasil diubah menjadi ${status}`, data: listing });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui status listing.' });
  }
});

export default router;
