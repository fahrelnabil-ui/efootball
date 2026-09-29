import express from 'express';
import prisma from '../db.js';
import { authenticateToken, requireAdmin } from '../middlewares/auth.js';

const router = express.Router();

function generateOrderNumber() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomHex = Math.floor(1000 + Math.random() * 9000);
  return `EFM-${dateStr}-${randomHex}`;
}

// POST /api/orders/checkout - Create new checkout order
router.post('/checkout', authenticateToken, async (req, res) => {
  try {
    const { listingId, paymentMethod } = req.body;

    if (!listingId || !paymentMethod) {
      return res.status(400).json({ success: false, message: 'ID Listing dan metode pembayaran wajib diisi.' });
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { user: true },
    });

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing akun tidak ditemukan.' });
    }

    if (listing.status !== 'approved' && listing.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Akun ini sedang tidak tersedia untuk dibeli.' });
    }

    if (listing.userId === req.user.id) {
      return res.status(400).json({ success: false, message: 'Anda tidak bisa membeli akun milik Anda sendiri.' });
    }

    const serviceFeePercent = 0.05;
    const serviceFee = listing.price * serviceFeePercent;
    const totalAmount = listing.price + serviceFee;
    const orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        listingId: listing.id,
        buyerId: req.user.id,
        sellerId: listing.userId,
        accountPrice: listing.price,
        serviceFee,
        totalAmount,
        paymentMethod,
        status: 'pending_payment',
      },
    });

    await prisma.listing.update({
      where: { id: listingId },
      data: { status: 'reserved' },
    });

    await prisma.notification.create({
      data: {
        userId: req.user.id,
        title: 'Order Dibuat',
        message: `Order #${orderNumber} berhasil dibuat. Silakan selesaikan pembayaran sebesar Rp ${totalAmount.toLocaleString('id-ID')}.`,
        type: 'order',
        linkUrl: `/dashboard/user/orders`,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Checkout berhasil dibuat. Silakan lakukan pembayaran.',
      data: order,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ success: false, message: 'Gagal memproses checkout.' });
  }
});

// POST /api/orders/:id/payment - Upload Payment Proof
router.post('/:id/payment', authenticateToken, async (req, res) => {
  try {
    const { paymentProofUrl } = req.body;

    if (!paymentProofUrl) {
      return res.status(400).json({ success: false, message: 'Bukti pembayaran wajib diunggah.' });
    }

    const order = await prisma.order.findUnique({ where: { id: req.params.id } });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    if (order.buyerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Anda tidak memiliki akses ke pesanan ini.' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: req.params.id },
      data: {
        paymentProof: paymentProofUrl,
        status: 'payment_review',
      },
    });

    await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        paymentProofUrl,
        status: 'review',
      },
    });

    const admins = await prisma.user.findMany({ where: { role: 'admin' } });
    for (const admin of admins) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          title: 'Pembayaran Baru Perlu Verifikasi',
          message: `Bukti bayar baru diunggah untuk order #${order.orderNumber}.`,
          type: 'payment',
          linkUrl: '/dashboard/admin/orders',
        },
      });
    }

    res.json({
      success: true,
      message: 'Bukti pembayaran berhasil diunggah! Admin akan segera memverifikasi.',
      data: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengunggah bukti pembayaran.' });
  }
});

// GET /api/orders/my - Get user orders
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { buyerId: req.user.id },
          { sellerId: req.user.id },
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        listing: {
          include: {
            images: true,
            gameAccountDetail: true,
          },
        },
        buyer: { select: { id: true, name: true, email: true } },
        seller: { select: { id: true, name: true, email: true } },
        reviews: true,
        disputes: true,
      },
    });

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil daftar pesanan.' });
  }
});

// GET /api/orders/:id - Get Order Detail
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        listing: {
          include: {
            images: true,
            gameAccountDetail: true,
          },
        },
        buyer: { select: { id: true, name: true, email: true, phone: true } },
        seller: { select: { id: true, name: true, email: true, phone: true } },
        payments: true,
        reviews: true,
        disputes: true,
      },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    if (order.buyerId !== req.user.id && order.sellerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Akses ditolak.' });
    }

    if (req.user.role !== 'admin' && (order.status !== 'handover' && order.status !== 'buyer_confirmation' && order.status !== 'completed')) {
      if (order.listing && order.listing.gameAccountDetail) {
        order.listing.gameAccountDetail.encryptedCredentials = '[TERKUNCI_HINGGA_SERAH_TERIMA]';
      }
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil detail pesanan.' });
  }
});

// PATCH /api/orders/:id/status - Update Order Status & Process Escrow Balance Release
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { listing: true },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    if (status === 'completed' || status === 'buyer_confirmation') {
      if (order.buyerId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Hanya pembeli atau admin yang dapat mengonfirmasi penyerahan.' });
      }
    } else {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Perubahan status ini membutuhkan otorisasi Admin.' });
      }
    }

    const updatedOrder = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
    });

    if (status === 'completed') {
      await prisma.listing.update({
        where: { id: order.listingId },
        data: { status: 'sold' },
      });

      await prisma.user.update({
        where: { id: order.sellerId },
        data: {
          balance: { increment: order.accountPrice },
        },
      });

      await prisma.transaction.create({
        data: {
          orderId: order.id,
          userId: order.sellerId,
          type: 'sale',
          amount: order.accountPrice,
          status: 'completed',
          notes: `Hasil penjualan akun eFootball #${order.orderNumber}`,
        },
      });

      await prisma.transaction.create({
        data: {
          orderId: order.id,
          userId: order.buyerId,
          type: 'fee',
          amount: order.serviceFee,
          status: 'completed',
          notes: `Biaya layanan escrow admin eFootMarket #${order.orderNumber}`,
        },
      });

      await prisma.notification.create({
        data: {
          userId: order.sellerId,
          title: 'Transaksi Selesai & Dana Ditransfer!',
          message: `Transaksi #${order.orderNumber} telah dikonfirmasi selesai. Dana sebesar Rp ${order.accountPrice.toLocaleString('id-ID')} telah masuk ke saldo Anda.`,
          type: 'success',
          linkUrl: '/dashboard/user/wallet',
        },
      });
    }

    res.json({
      success: true,
      message: `Status pesanan berhasil diperbarui ke '${status}'.`,
      data: updatedOrder,
    });
  } catch (error) {
    console.error('Order status update error:', error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui status pesanan.' });
  }
});

export default router;
