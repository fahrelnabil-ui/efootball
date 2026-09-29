import express from 'express';
import prisma from '../db.js';
import { authenticateToken, requireAdmin } from '../middlewares/auth.js';

const router = express.Router();

// POST /api/disputes - Submit new dispute / complaint
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { orderId, reason, description } = req.body;

    if (!orderId || !reason || !description) {
      return res.status(400).json({ success: false, message: 'Order ID, alasan, dan deskripsi wajib diisi.' });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'disputed' },
    });

    const dispute = await prisma.dispute.create({
      data: {
        orderId,
        reporterId: req.user.id,
        reason,
        description,
        status: 'open',
        messages: {
          create: {
            senderId: req.user.id,
            message: description,
          },
        },
      },
    });

    const admins = await prisma.user.findMany({ where: { role: 'admin' } });
    for (const admin of admins) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          title: 'Komplain Baru Berhasil Diajukan',
          message: `Komplain baru diajukan untuk Order #${order.orderNumber}. Alasan: ${reason}`,
          type: 'warning',
          linkUrl: '/dashboard/admin/disputes',
        },
      });
    }

    res.status(201).json({
      success: true,
      message: 'Komplain berhasil diajukan. Tim Admin eFootMarket akan segera menginvestigasi.',
      data: dispute,
    });
  } catch (error) {
    console.error('Dispute create error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengajukan komplain.' });
  }
});

// POST /api/disputes/:id/message - Add message to dispute ticket
router.post('/:id/message', authenticateToken, async (req, res) => {
  try {
    const { message, attachmentUrl } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Pesan wajib diisi.' });
    }

    const disputeMessage = await prisma.disputeMessage.create({
      data: {
        disputeId: req.params.id,
        senderId: req.user.id,
        message,
        attachmentUrl: attachmentUrl || null,
      },
    });

    res.status(201).json({ success: true, data: disputeMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengirim pesan komplain.' });
  }
});

// PATCH /api/disputes/:id/resolve - Admin Resolve Dispute
router.patch('/:id/resolve', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, resolutionNotes, action } = req.body;

    const dispute = await prisma.dispute.findUnique({
      where: { id: req.params.id },
      include: { order: true },
    });

    if (!dispute) {
      return res.status(404).json({ success: false, message: 'Tiket komplain tidak ditemukan.' });
    }

    const updatedDispute = await prisma.dispute.update({
      where: { id: req.params.id },
      data: {
        status: status || 'resolved',
        resolutionNotes,
        resolvedBy: req.user.name,
      },
    });

    if (action === 'refund_buyer') {
      await prisma.user.update({
        where: { id: dispute.order.buyerId },
        data: { balance: { increment: dispute.order.totalAmount } },
      });
      await prisma.order.update({
        where: { id: dispute.orderId },
        data: { status: 'cancelled' },
      });
      await prisma.listing.update({
        where: { id: dispute.order.listingId },
        data: { status: 'active' },
      });
    } else if (action === 'release_seller') {
      await prisma.order.update({
        where: { id: dispute.orderId },
        data: { status: 'completed' },
      });
      await prisma.user.update({
        where: { id: dispute.order.sellerId },
        data: { balance: { increment: dispute.order.accountPrice } },
      });
    }

    res.json({ success: true, message: 'Komplain berhasil diselesaikan!', data: updatedDispute });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menyelesaikan dispute.' });
  }
});

export default router;
