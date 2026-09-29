import express from 'express';
import prisma from '../db.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// POST /api/reviews - Add Review
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { orderId, rating, comment } = req.body;

    if (!orderId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Order ID, rating, dan komentar wajib diisi.' });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    if (order.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Review hanya dapat diberikan pada transaksi yang sudah Selesai (Completed).' });
    }

    if (order.buyerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Hanya pembeli dari transaksi ini yang berhak memberikan ulasan.' });
    }

    const existingReview = await prisma.review.findUnique({ where: { orderId } });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'Anda telah memberikan ulasan untuk transaksi ini.' });
    }

    const review = await prisma.review.create({
      data: {
        orderId,
        listingId: order.listingId,
        reviewerId: req.user.id,
        rating: parseInt(rating),
        comment,
      },
    });

    res.status(201).json({ success: true, message: 'Ulasan berhasil dikirim! Terima kasih.', data: review });
  } catch (error) {
    console.error('Review error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengirim ulasan.' });
  }
});

export default router;
