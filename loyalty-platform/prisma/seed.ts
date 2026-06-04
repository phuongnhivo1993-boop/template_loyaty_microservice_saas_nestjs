import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

async function main() {
  console.log('Seeding database...');

  const hostPass = await hashPassword('Host@123456');
  const adminPass = await hashPassword('Admin@123456');
  const memberPass = await hashPassword('Member@123456');

  const host = await prisma.host.upsert({
    where: { email: 'host@loyalty.vn' },
    update: {},
    create: {
      email: 'host@loyalty.vn',
      password: hostPass,
      name: 'Super Admin',
    },
  });
  console.log(`  ✓ Host created: ${host.email}`);

  const tenant = await prisma.tenant.upsert({
    where: { domain: 'sunshine.loyalty.vn' },
    update: {},
    create: {
      name: 'Sunshine Real Estate',
      domain: 'sunshine.loyalty.vn',
      subdomain: 'sunshine',
      email: 'admin@sunshine.vn',
      phone: '0909123456',
      address: '123 Nguyen Hue, Q1, HCMC',
      hostId: host.id,
    },
  });
  console.log(`  ✓ Tenant created: ${tenant.name}`);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@sunshine.vn' },
    update: {},
    create: {
      email: 'admin@sunshine.vn',
      password: adminPass,
      fullName: 'Tran Van Admin',
      role: 'ADMIN',
      tenantId: tenant.id,
    },
  });
  console.log(`  ✓ Tenant admin created: ${adminUser.email}`);

  const tiers = await Promise.all([
    prisma.tier.upsert({
      where: { id: 'tier-member' },
      update: {},
      create: { id: 'tier-member', name: 'Member', minPoints: 0, maxPoints: 999, color: '#94a3b8', tenantId: tenant.id },
    }),
    prisma.tier.upsert({
      where: { id: 'tier-silver' },
      update: {},
      create: { id: 'tier-silver', name: 'Silver', minPoints: 1000, maxPoints: 4999, benefits: '5% discount', color: '#c0c0c0', tenantId: tenant.id },
    }),
    prisma.tier.upsert({
      where: { id: 'tier-gold' },
      update: {},
      create: { id: 'tier-gold', name: 'Gold', minPoints: 5000, maxPoints: 19999, benefits: '10% discount, Priority support', color: '#f59e0b', tenantId: tenant.id },
    }),
    prisma.tier.upsert({
      where: { id: 'tier-platinum' },
      update: {},
      create: { id: 'tier-platinum', name: 'Platinum', minPoints: 20000, maxPoints: 99999, benefits: '15% discount, VIP support, Event access', color: '#6366f1', tenantId: tenant.id },
    }),
    prisma.tier.upsert({
      where: { id: 'tier-diamond' },
      update: {},
      create: { id: 'tier-diamond', name: 'Diamond', minPoints: 100000, maxPoints: 999999, benefits: '20% discount, Dedicated manager, All events', color: '#06b6d4', tenantId: tenant.id },
    }),
  ]);
  console.log(`  ✓ ${tiers.length} tiers created`);

  const member = await prisma.member.upsert({
    where: { email: 'nguyen.van.a@sunshine.vn' },
    update: { password: memberPass },
    create: {
      email: 'nguyen.van.a@sunshine.vn',
      password: memberPass,
      fullName: 'Nguyen Van A',
      phone: '0909000111',
      tenantId: tenant.id,
      tierId: 'tier-gold',
      totalPoints: 15000,
      availablePoints: 12000,
    },
  });
  console.log(`  ✓ Member created: ${member.fullName}`);

  await prisma.pointTransaction.create({
    data: {
      memberId: member.id,
      type: 'EARN',
      amount: 15000,
      balance: 15000,
      reason: 'Initial points from signup bonus and purchases',
    },
  });
  await prisma.pointTransaction.create({
    data: {
      memberId: member.id,
      type: 'BURN',
      amount: -3000,
      balance: 12000,
      reason: 'Redeemed voucher 100k',
    },
  });
  console.log('  ✓ Sample point transactions created');

  await prisma.campaign.create({
    data: {
      name: 'Summer Promotion 2026',
      description: 'Double points for summer season',
      startDate: new Date('2026-06-01'),
      endDate: new Date('2026-08-31'),
      status: 'ACTIVE',
      budget: 50000000,
      tenantId: tenant.id,
    },
  });
  console.log('  ✓ Sample campaign created');

  await prisma.reward.create({
    data: {
      name: 'Voucher 100k',
      description: '100,000 VND shopping voucher',
      type: 'voucher',
      pointsRequired: 2000,
      quantity: 100,
      tenantId: tenant.id,
    },
  });
  await prisma.reward.create({
    data: {
      name: 'Cashback 50k',
      description: '50,000 VND cashback',
      type: 'cashback',
      pointsRequired: 1000,
      quantity: 200,
      tenantId: tenant.id,
    },
  });
  console.log('  ✓ Sample rewards created');

  await prisma.voucher.upsert({
    where: { code: 'SUMMER2026' },
    update: {},
    create: {
      code: 'SUMMER2026',
      type: 'discount',
      value: 15,
      maxUsage: 1000,
      expiresAt: new Date('2026-12-31'),
      tenantId: tenant.id,
    },
  });
  console.log('  ✓ Sample voucher created');

  await prisma.promotion.create({
    data: {
      name: 'Gold Member Bonus',
      description: 'Gold members get 500 extra points on purchases over 1M',
      priority: 1,
      status: 'ACTIVE',
      conditions: {
        conditions: [
          { field: 'tier', operator: 'eq', value: 'Gold' },
          { field: 'purchaseAmount', operator: 'gte', value: 1000000 },
        ],
      },
      actions: [{ type: 'addPoints', value: 500 }],
      tenantId: tenant.id,
    },
  });
  console.log('  ✓ Sample promotion created');

  await prisma.badge.create({
    data: {
      name: 'Top Seller',
      description: 'Awarded to top selling agents',
      iconUrl: '/badges/top-seller.png',
      criteria: { salesCount: { gte: 10 } },
      tenantId: tenant.id,
    },
  });
  await prisma.badge.create({
    data: {
      name: 'VIP Customer',
      description: 'Awarded to VIP customers',
      iconUrl: '/badges/vip.png',
      criteria: { totalPoints: { gte: 50000 } },
      tenantId: tenant.id,
    },
  });
  console.log('  ✓ Sample badges created');

  const voucherRec = await prisma.voucher.findFirst({ where: { tenantId: tenant.id } });
  if (voucherRec) {
    const existing = await prisma.memberVoucher.findFirst({
      where: { memberId: member.id, voucherId: voucherRec.id },
    });
    if (!existing) {
      await prisma.memberVoucher.create({ data: { memberId: member.id, voucherId: voucherRec.id, qrCode: `QR-${member.id.slice(0, 8)}-${voucherRec.id.slice(0, 8)}` } });
    }
    console.log('  ✓ Member voucher assigned');
  }

  await prisma.notificationTemplate.create({
    data: {
      name: 'Welcome Email',
      type: 'email',
      subject: 'Welcome {{name}} to {{tenant}}!',
      content: 'Dear {{name}}, thank you for joining {{tenant}}. You have received {{points}} bonus points!',
      tenantId: tenant.id,
    },
  });
  console.log('  ✓ Sample notification template created');

  await prisma.notificationLog.create({
    data: {
      templateId: 'welcome-email',
      recipient: 'nguyen.van.a@sunshine.vn',
      channel: 'email',
      subject: 'Welcome to Sunshine Loyalty!',
      content: 'Thank you for joining our loyalty program. You received 15000 bonus points!',
      status: 'SENT',
      sentAt: new Date(),
      tenantId: tenant.id,
    },
  });
  console.log('  ✓ Sample notification log created');

  await prisma.mission.create({
    data: {
      name: 'Refer 5 customers',
      description: 'Refer 5 new customers this month',
      pointsReward: 2000,
      criteria: { referralCount: 5 },
      startDate: new Date('2026-06-01'),
      endDate: new Date('2026-06-30'),
      tenantId: tenant.id,
    },
  });
  console.log('  ✓ Sample mission created');

  const category = await prisma.productCategory.upsert({
    where: { slug_tenantId: { slug: 'thuc-pham-do-uong', tenantId: tenant.id } },
    update: {},
    create: { name: 'Thực phẩm & Đồ uống', slug: 'thuc-pham-do-uong', description: 'Đồ ăn, thức uống, snack', tenantId: tenant.id },
  });
  await prisma.productCategory.upsert({
    where: { slug_tenantId: { slug: 'thoi-trang', tenantId: tenant.id } },
    update: {},
    create: { name: 'Thời trang', slug: 'thoi-trang', description: 'Quần áo, phụ kiện', icon: '👕', tenantId: tenant.id },
  });
  await prisma.productCategory.upsert({
    where: { slug_tenantId: { slug: 'dien-tu', tenantId: tenant.id } },
    update: {},
    create: { name: 'Điện tử', slug: 'dien-tu', description: 'Điện thoại, laptop, phụ kiện', icon: '📱', tenantId: tenant.id },
  });
  console.log('  ✓ Product categories created');

  await prisma.product.createMany({
    data: [
      { name: 'Cà phê sữa đá', slug: 'ca-phe-sua-da', price: 35000, costPrice: 12000, unit: 'ly', stock: 200, sku: 'CF-001', categoryId: category.id, tenantId: tenant.id },
      { name: 'Bánh mì thịt nướng', slug: 'banh-mi-thit-nuong', price: 25000, costPrice: 10000, unit: 'cái', stock: 100, sku: 'BM-001', categoryId: category.id, tenantId: tenant.id },
      { name: 'Trà sữa trân châu', slug: 'tra-sua-tran-chau', price: 45000, compareAtPrice: 55000, costPrice: 15000, unit: 'ly', stock: 150, sku: 'TS-001', categoryId: category.id, tenantId: tenant.id },
      { name: 'Nước suối 500ml', slug: 'nuoc-suoi-500ml', price: 10000, costPrice: 4000, unit: 'chai', stock: 500, sku: 'NS-001', categoryId: category.id, tenantId: tenant.id },
      { name: 'Snack khoai tây', slug: 'snack-khoai-tay', price: 15000, costPrice: 7000, unit: 'gói', stock: 300, sku: 'SN-001', categoryId: category.id, tenantId: tenant.id },
    ],
  });
  console.log('  ✓ Sample products created');

  await prisma.pointEarningRule.create({
    data: {
      name: 'Mặc định 1%',
      description: '1 point cho mỗi 1,000 VND',
      pointsPerUnit: 0.001,
      minAmount: 0,
      status: 'ACTIVE',
      tenantId: tenant.id,
    },
  });
  console.log('  ✓ Default earning rule created');

  // Seed coupons
  const coupon1 = await prisma.coupon.upsert({
    where: { code_tenantId: { code: 'WELCOME10', tenantId: tenant.id } },
    update: {},
    create: {
      code: 'WELCOME10', type: 'PERCENTAGE', value: 10,
      minAmount: 50000, maxDiscount: 50000,
      maxUsage: 1000, maxUsagePerMember: 1,
      description: '10% off welcome discount (max 50,000 VND)',
      status: 'ACTIVE', tenantId: tenant.id,
    },
  });
  console.log('  ✓ Coupon created:', coupon1.code);

  const coupon2 = await prisma.coupon.upsert({
    where: { code_tenantId: { code: 'FLAT50K', tenantId: tenant.id } },
    update: {},
    create: {
      code: 'FLAT50K', type: 'FIXED', value: 50000,
      minAmount: 200000, maxUsage: 500, maxUsagePerMember: 2,
      description: '50,000 VND off for orders over 200,000 VND',
      status: 'ACTIVE', tenantId: tenant.id,
    },
  });
  console.log('  ✓ Coupon created:', coupon2.code);

  const coupon3 = await prisma.coupon.upsert({
    where: { code_tenantId: { code: 'SUMMER20', tenantId: tenant.id } },
    update: {},
    create: {
      code: 'SUMMER20', type: 'PERCENTAGE', value: 20,
      minAmount: 100000, maxDiscount: 100000,
      maxUsage: 200, maxUsagePerMember: 1,
      description: '20% off summer special (max 100,000 VND)',
      startDate: new Date('2026-06-01'), endDate: new Date('2026-08-31'),
      status: 'ACTIVE', tenantId: tenant.id,
    },
  });
  console.log('  ✓ Coupon created:', coupon3.code);

  console.log('\n✅ Seeding complete!');
  console.log('   Host: host@loyalty.vn / Host@123456');
  console.log('   Admin: admin@sunshine.vn / Admin@123456');
  console.log('   Member: nguyen.van.a@sunshine.vn / Member@123456');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
