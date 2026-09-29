import express from 'express';
import prisma from '../db.js';
import { authenticateToken, requireAdmin } from '../middlewares/auth.js';

const router = express.Router();

// GET /api/withdrawals/my - User withdrawal history
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const withdrawals = await prisma.withdrawal.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: withdrawals });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil riwayat penarikan.' });
  }
});

// POST /api/withdrawals - Request Payout of Seller Balance
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { amount, bankName, accountNumber, accountHolder } = req.body;

    if (!amount || !bankName || !accountNumber || !accountHolder) {
      return res.status(400).json({ success: false, message: 'Semua kolom informasi bank wajib diisi.' });
    }

    const numAmount = parseFloat(amount);
    if (numAmount < 50000) {
      return res.status(400).json({ success: false, message: 'Penarikan minimum adalah Rp 50.000.' });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (user.balance < numAmount) {
      return res.status(400).json({ success: false, message: `Saldo Anda (Rp ${user.balance.toLocaleString('id-ID')}) tidak mencukupi.` });
    }

    await prisma.user.update({
      where: { id: req.user.id },
      data: { balance: { decrement: numAmount } },
    });

    const withdrawal = await prisma.withdrawal.create({
      data: {
        userId: req.user.id,
        amount: numAmount,
        bankName,
        accountNumber,
        accountHolder,
        status: 'pending',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Permintaan pencairan dana berhasil diajukan! Admin akan memproses transfer ke rekening Anda.',
      data: withdrawal,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengajukan penarikan dana.' });
  }
});

// PATCH /api/withdrawals/:id/process - Admin Process Payout
router.patch('/:id/process', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    const withdrawal = await prisma.withdrawal.findUnique({ where: { id: req.params.id } });
    if (!withdrawal) {
      return res.status(404).json({ success: false, message: 'Permintaan penarikan tidak ditemukan.' });
    }

    const updated = await prisma.withdrawal.update({
      where: { id: req.params.id },
      data: {
        status,
        processedBy: req.user.name,
      },
    });

    if (status === 'rejected') {
      await prisma.user.update({
        where: { id: withdrawal.userId },
        data: { balance: { increment: withdrawal.amount } },
      });
    }

    await prisma.notification.create({
      data: {
        userId: withdrawal.userId,
        title: status === 'completed' ? 'Pencairan Dana Berhasil!' : 'Penarikan Dana Ditolak',
        message: status === 'completed'
          ? `Dana sebesar Rp ${withdrawal.amount.toLocaleString('id-ID')} telah ditransfer ke rekening ${withdrawal.bankName} (${withdrawal.accountNumber}).`
          : `Penarikan dana sebesar Rp ${withdrawal.amount.toLocaleString('id-ID')} ditolak. Saldo telah dikembalikan ke akun Anda.`,
        type: 'payment',
        linkUrl: '/dashboard/user/wallet',
      },
    });

    res.json({ success: true, message: `Status penarikan diperbarui ke ${status}.`, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memproses penarikan.' });
  }
});

export default router;
