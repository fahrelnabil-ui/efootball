import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  await prisma.activityLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.withdrawal.deleteMany();
  await prisma.disputeMessage.deleteMany();
  await prisma.dispute.deleteMany();
  await prisma.review.deleteMany();
  await prisma.consignment.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.gameAccountDetail.deleteMany();
  await prisma.listingImage.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.user.deleteMany();
  await prisma.setting.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin REVE EFOOTBALL',
      email: 'admin@reveefootball.com',
      password: passwordHash,
      role: 'admin',
      balance: 125000.0,
      phone: '081234567890',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      isVerified: true,
    },
  });

  const sellerUser = await prisma.user.create({
    data: {
      name: 'Rizky ProSeller',
      email: 'seller@reveefootball.com',
      password: passwordHash,
      role: 'user',
      balance: 850000.0,
      phone: '089876543210',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      isVerified: true,
    },
  });

  const buyerUser = await prisma.user.create({
    data: {
      name: 'Budi Gaming',
      email: 'buyer@reveefootball.com',
      password: passwordHash,
      role: 'user',
      balance: 200000.0,
      phone: '085544332211',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      isVerified: true,
    },
  });

  console.log('✅ Users created successfully!');

  await prisma.setting.createMany({
    data: [
      { key: 'service_fee_percent', value: '5', description: 'Persentase biaya layanan admin per transaksi' },
      { key: 'bank_bca_number', value: '8830192837', description: 'Nomor Rekening BCA Admin eFootMarket' },
      { key: 'bank_bca_holder', value: 'PT EFOOTMARKET INDONESIA', description: 'Atas Nama Rekening BCA' },
      { key: 'ewallet_qris', value: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300', description: 'Gambar QRIS Resmi Escrow' },
      { key: 'platform_disclaimer', value: 'eFootMarket adalah platform perantara (escrow) independen. Seluruh aset eFootball merupakan hak cipta Konami Digital Entertainment.', description: 'Teks Disclaimer Compliance' }
    ]
  });

  const listing1 = await prisma.listing.create({
    data: {
      userId: sellerUser.id,
      title: 'Akun Sultan 25+ Epic Boosted (Messi 105, Gullit, Rummenigge) + 3500 Coins',
      price: 1850000,
      platform: 'Android',
      playerCount: 145,
      epicCount: 26,
      bigTimeCount: 8,
      gpAmount: 4500000,
      coinAmount: 3500,
      squadInfo: 'Division 1 Peak Rank #420, Team Strength 3150+, Manager Pep Guardiola Boost',
      description: 'Akun rawatan pribadi dari season 1! Punya Messi 105, Gullit Big Time, Rummenigge Epic, Vieira, Maldini, Cech. eFootball Coins melimpah 3500 siap gacha pack baru. Login Konami ID aman sentosa, siap bind email buyer.',
      isVerified: true,
      status: 'approved',
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800', isPrimary: true },
          { imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800', isPrimary: false },
          { imageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800', isPrimary: false },
        ]
      },
      gameAccountDetail: {
        create: {
          loginType: 'Konami ID',
          encryptedCredentials: 'ENC_USER1_PASS1_SECURE_TOKEN_XYZ',
          notes: 'Konami ID aktif, belum pernah kena penalty/warn.'
        }
      }
    }
  });

  const listing2 = await prisma.listing.create({
    data: {
      userId: sellerUser.id,
      title: 'Squad Full Big Time & Showtime (Ronaldo 103, Neymar, Beckham) Fast Trade',
      price: 1200000,
      platform: 'iOS',
      playerCount: 110,
      epicCount: 18,
      bigTimeCount: 12,
      gpAmount: 2800000,
      coinAmount: 1200,
      squadInfo: 'Squad Collective Strength 3120, Trainer Xavi 88 Manager',
      description: 'Spesial buat pecinta iOS! Akun wangi berisikan Ronaldo Big Time, Neymar Showtime Blitz Curler, Beckham 102. GP masih ada 2.8 Juta. Data bersih 100%.',
      isVerified: true,
      status: 'approved',
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800', isPrimary: true },
          { imageUrl: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800', isPrimary: false }
        ]
      },
      gameAccountDetail: {
        create: {
          loginType: 'Konami ID',
          encryptedCredentials: 'ENC_USER2_PASS2_SECURE_TOKEN_ABC',
          notes: 'Sudah diun-link dari Game Center.'
        }
      }
    }
  });

  const listing3 = await prisma.listing.create({
    data: {
      userId: sellerUser.id,
      title: 'Akun Starter Epic Messi 105 + Cruyff + 5000 Coins Melimpah',
      price: 450000,
      platform: 'Android',
      playerCount: 75,
      epicCount: 8,
      bigTimeCount: 3,
      gpAmount: 1200000,
      coinAmount: 5000,
      squadInfo: 'Division 3, Team Strength 2980',
      description: 'Akun starter sangat ekonomis tapi piala melimpah! Memiliki 5000 eFootball coins utuh yang bisa dipakai untuk menggulung pack event mendatang.',
      isVerified: true,
      status: 'approved',
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800', isPrimary: true }
        ]
      },
      gameAccountDetail: {
        create: {
          loginType: 'Konami ID',
          encryptedCredentials: 'ENC_USER3_PASS3_SECURE_TOKEN_DEF',
          notes: 'Konami ID polos tanpa sisa data bekas.'
        }
      }
    }
  });

  const listing4 = await prisma.listing.create({
    data: {
      userId: sellerUser.id,
      title: 'Endgame eFootball Account (Gullit, Vieira, Maldini, Cech) High Rank',
      price: 2750000,
      platform: 'PC',
      playerCount: 210,
      epicCount: 34,
      bigTimeCount: 16,
      gpAmount: 8900000,
      coinAmount: 2100,
      squadInfo: 'Top 100 Steam Leaderboard, Full Booster Managers & 3200+ Rating',
      description: 'Akun Steam eFootball PC kelas dewa. Seluruh pemain META defense & midfield lengkap (Gullit, Vieira 104, Maldini, Cech, Schmeichel, Cannavaro). Dijual cepat karena kesibukan kerja.',
      isVerified: true,
      status: 'approved',
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800', isPrimary: true }
        ]
      },
      gameAccountDetail: {
        create: {
          loginType: 'Konami ID',
          encryptedCredentials: 'ENC_USER4_PASS4_SECURE_TOKEN_GHI',
          notes: 'Konami ID + Email khusus Steam.'
        }
      }
    }
  });

  const listing5 = await prisma.listing.create({
    data: {
      userId: sellerUser.id,
      title: 'Akun Titipan Sultan Full Pack Japan & Argentina (Pengajuan Titip Akun)',
      price: 950000,
      platform: 'iOS',
      playerCount: 95,
      epicCount: 14,
      bigTimeCount: 6,
      gpAmount: 3100000,
      coinAmount: 1800,
      squadInfo: 'Full Pack Messi Argentina & Takefusa Kubo Japan',
      description: 'Titip jual akun eFootball iOS full pack nasional Argentina & Japan. Membutuhkan verifikasi admin eFootMarket.',
      isVerified: false,
      status: 'pending',
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800', isPrimary: true }
        ]
      },
      gameAccountDetail: {
        create: {
          loginType: 'Konami ID',
          encryptedCredentials: 'ENC_USER5_PASS5_PENDING',
          notes: 'Menunggu pemeriksaan admin.'
        }
      }
    }
  });

  await prisma.consignment.create({
    data: {
      listingId: listing5.id,
      userId: sellerUser.id,
      status: 'pending',
      agreedFeePercent: 5.0,
    }
  });

  const orderCompleted = await prisma.order.create({
    data: {
      orderNumber: 'EFM-20260927-0001',
      listingId: listing2.id,
      buyerId: buyerUser.id,
      sellerId: sellerUser.id,
      accountPrice: 1200000,
      serviceFee: 60000,
      totalAmount: 1260000,
      paymentMethod: 'Bank Transfer (BCA)',
      paymentProof: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500',
      status: 'completed',
    }
  });

  await prisma.review.create({
    data: {
      orderId: orderCompleted.id,
      listingId: listing2.id,
      reviewerId: buyerUser.id,
      rating: 5,
      comment: 'Proses serah terima cepat sekali melalui admin eFootMarket! Kredensial aman dan sesuai dengan deskripsi screenshot. Recommended marketplace!'
    }
  });

  const orderProcessing = await prisma.order.create({
    data: {
      orderNumber: 'EFM-20260927-0002',
      listingId: listing3.id,
      buyerId: buyerUser.id,
      sellerId: sellerUser.id,
      accountPrice: 450000,
      serviceFee: 22500,
      totalAmount: 472500,
      paymentMethod: 'QRIS Instant',
      paymentProof: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500',
      status: 'handover',
    }
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: buyerUser.id,
        title: 'Pembayaran Diverifikasi Admin',
        message: 'Pesanan EFM-20260927-0002 telah diverifikasi. Admin sedang memproses serah-terima akun eFootball Anda.',
        type: 'payment',
        linkUrl: '/dashboard/user/orders'
      },
      {
        userId: sellerUser.id,
        title: 'Akun Disetujui & Live!',
        message: 'Listing "Akun Sultan 25+ Epic Boosted" milik Anda telah disetujui admin dan resmi tampil di marketplace.',
        type: 'listing',
        linkUrl: '/account/' + listing1.id
      }
    ]
  });

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
