// =============================================================================
// SEED DATA CONSTANTS
// =============================================================================

export const HOSTS = [
  { email: 'admin@loyalty.vn', password: 'Admin@123', name: 'Super Admin' },
];

export const TENANTS: TenantSeed[] = [
  {
    name: 'Thương Hiệu Xanh',
    domain: 'thuonghieuxanh.loyalty.vn',
    subdomain: 'thuonghieuxanh',
    email: 'admin@thuonghieuxanh.vn',
    phone: '02838221234',
    address: '123 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    logo: '/logos/thuonghieuxanh.png',
    status: 'ACTIVE',
    subscription: {
      plan: 'FREE',
      status: 'ACTIVE',
      maxMembers: 100,
      maxCampaigns: 2,
      maxRewards: 5,
      maxTiers: 3,
      maxVouchers: 50,
      maxStores: 1,
      features: { referral: false, gamification: false, apiAccess: false, customDomain: false, whiteLabel: false, advancedAnalytics: false },
    },
    admin: { email: 'admin@thuonghieuxanh.vn', password: 'Admin@123', fullName: 'Nguyễn Thị Minh', phone: '0903123456', role: 'ADMIN' as const },
  },
  {
    name: 'Cafe Sài Gòn',
    domain: 'cafesaigon.loyalty.vn',
    subdomain: 'cafesaigon',
    email: 'admin@cafesaigon.vn',
    phone: '02838225678',
    address: '45 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    logo: '/logos/cafesaigon.png',
    status: 'ACTIVE',
    subscription: {
      plan: 'STARTER',
      status: 'ACTIVE',
      maxMembers: 500,
      maxCampaigns: 10,
      maxRewards: 20,
      maxTiers: 5,
      maxVouchers: 200,
      maxStores: 5,
      features: { referral: true, gamification: false, apiAccess: true, customDomain: false, whiteLabel: false, advancedAnalytics: false },
    },
    admin: { email: 'admin@cafesaigon.vn', password: 'Admin@123', fullName: 'Trần Văn Hùng', phone: '0909988776', role: 'ADMIN' as const },
  },
  {
    name: 'Fitness Pro',
    domain: 'fitnesspro.loyalty.vn',
    subdomain: 'fitnesspro',
    email: 'admin@fitnesspro.vn',
    phone: '02438229012',
    address: '88 Láng Hạ, Phường Thịnh Quang, Quận Đống Đa, Hà Nội',
    logo: '/logos/fitnesspro.png',
    status: 'ACTIVE',
    subscription: {
      plan: 'PROFESSIONAL',
      status: 'ACTIVE',
      maxMembers: 2000,
      maxCampaigns: 50,
      maxRewards: 100,
      maxTiers: 5,
      maxVouchers: 1000,
      maxStores: 20,
      features: { referral: true, gamification: true, apiAccess: true, customDomain: true, whiteLabel: false, advancedAnalytics: true },
    },
    admin: { email: 'admin@fitnesspro.vn', password: 'Admin@123', fullName: 'Lê Quốc Bảo', phone: '0912345678', role: 'ADMIN' as const },
  },
];

export const TIER_TEMPLATES: TierTemplate[] = [
  { name: 'Đồng', minPoints: 0, maxPoints: 999, pointsMultiplier: 1.0, benefits: 'Tích lũy điểm cơ bản', color: '#8B4513' },
  { name: 'Bạc', minPoints: 1000, maxPoints: 4999, pointsMultiplier: 1.2, benefits: 'Nhân điểm x1.2, Quà tặng sinh nhật', color: '#C0C0C0' },
  { name: 'Vàng', minPoints: 5000, maxPoints: 19999, pointsMultiplier: 1.5, benefits: 'Nhân điểm x1.5, Giảm giá 5%, Quà sinh nhật', color: '#FFD700' },
  { name: 'Bạch Kim', minPoints: 20000, maxPoints: 99999, pointsMultiplier: 2.0, benefits: 'Nhân điểm x2, Giảm giá 10%, Miễn phí vận chuyển, Ưu tiên hỗ trợ', color: '#E5E4E2' },
  { name: 'Kim Cương', minPoints: 100000, maxPoints: 999999, pointsMultiplier: 3.0, benefits: 'Nhân điểm x3, Giảm giá 15%, VIP Support, Sự kiện đặc biệt', color: '#00CED1' },
];

export const MEMBERS: MemberSeed[] = [
  // Thương Hiệu Xanh (20 members)
  { fullName: 'Nguyễn Văn Anh', email: 'nguyenvan.anh@email.vn', phone: '0901000001', status: 'ACTIVE', totalPoints: 15000, tierName: 'Vàng', memberOf: 0 },
  { fullName: 'Trần Thị Bích', email: 'tranthi.bich@email.vn', phone: '0901000002', status: 'ACTIVE', totalPoints: 35000, tierName: 'Bạch Kim', memberOf: 0 },
  { fullName: 'Lê Văn Cường', email: 'levan.cuong@email.vn', phone: '0901000003', status: 'ACTIVE', totalPoints: 500, tierName: 'Đồng', memberOf: 0 },
  { fullName: 'Phạm Thị Dung', email: 'phamthi.dung@email.vn', phone: '0901000004', status: 'ACTIVE', totalPoints: 8000, tierName: 'Vàng', memberOf: 0 },
  { fullName: 'Hoàng Văn Đạt', email: 'hoangvan.dat@email.vn', phone: '0901000005', status: 'ACTIVE', totalPoints: 2000, tierName: 'Bạc', memberOf: 0 },
  { fullName: 'Huỳnh Thị Hà', email: 'huynhthi.ha@email.vn', phone: '0901000006', status: 'ACTIVE', totalPoints: 45000, tierName: 'Bạch Kim', memberOf: 0 },
  { fullName: 'Phan Văn Hải', email: 'phanvan.hai@email.vn', phone: '0901000007', status: 'INACTIVE', totalPoints: 100, tierName: 'Đồng', memberOf: 0 },
  { fullName: 'Vũ Thị Hằng', email: 'vuthi.hang@email.vn', phone: '0901000008', status: 'ACTIVE', totalPoints: 1200, tierName: 'Bạc', memberOf: 0 },
  { fullName: 'Võ Văn Hiếu', email: 'vovan.hieu@email.vn', phone: '0901000009', status: 'ACTIVE', totalPoints: 25000, tierName: 'Bạch Kim', memberOf: 0 },
  { fullName: 'Đặng Thị Hoa', email: 'dangthi.hoa@email.vn', phone: '0901000010', status: 'LOCKED', totalPoints: 0, tierName: 'Đồng', memberOf: 0 },
  { fullName: 'Bùi Văn Huy', email: 'buivan.huy@email.vn', phone: '0901000011', status: 'ACTIVE', totalPoints: 6200, tierName: 'Vàng', memberOf: 0 },
  { fullName: 'Đỗ Thị Hương', email: 'dothi.huong@email.vn', phone: '0901000012', status: 'ACTIVE', totalPoints: 850, tierName: 'Đồng', memberOf: 0 },
  { fullName: 'Hồ Văn Khang', email: 'hovan.khang@email.vn', phone: '0901000013', status: 'INACTIVE', totalPoints: 300, tierName: 'Đồng', memberOf: 0 },
  { fullName: 'Ngô Thị Lan', email: 'ngothi.lan@email.vn', phone: '0901000014', status: 'ACTIVE', totalPoints: 18000, tierName: 'Vàng', memberOf: 0 },
  { fullName: 'Dương Văn Long', email: 'duongvan.long@email.vn', phone: '0901000015', status: 'ACTIVE', totalPoints: 4200, tierName: 'Bạc', memberOf: 0 },
  { fullName: 'Lý Thị Mai', email: 'lythi.mai@email.vn', phone: '0901000016', status: 'ACTIVE', totalPoints: 75000, tierName: 'Bạch Kim', memberOf: 0 },
  { fullName: 'Nguyễn Thị Ngọc', email: 'nguyenthi.ngoc@email.vn', phone: '0901000017', status: 'ACTIVE', totalPoints: 780, tierName: 'Đồng', memberOf: 0 },
  { fullName: 'Trần Văn Nam', email: 'tranvan.nam@email.vn', phone: '0901000018', status: 'ACTIVE', totalPoints: 5500, tierName: 'Vàng', memberOf: 0 },
  { fullName: 'Lê Thị Phương', email: 'lethi.phuong@email.vn', phone: '0901000019', status: 'PENDING_KYC', totalPoints: 1100, tierName: 'Bạc', memberOf: 0 },
  { fullName: 'Phạm Văn Quân', email: 'phamvan.quan@email.vn', phone: '0901000020', status: 'ACTIVE', totalPoints: 32000, tierName: 'Bạch Kim', memberOf: 0 },

  // Cafe Sài Gòn (18 members)
  { fullName: 'Nguyễn Thị Quỳnh', email: 'nguyenthi.quynh@email.vn', phone: '0902000001', status: 'ACTIVE', totalPoints: 2800, tierName: 'Bạc', memberOf: 1 },
  { fullName: 'Trần Văn Sơn', email: 'tranvan.son@email.vn', phone: '0902000002', status: 'ACTIVE', totalPoints: 12000, tierName: 'Vàng', memberOf: 1 },
  { fullName: 'Lê Thị Thảo', email: 'lethi.thao@email.vn', phone: '0902000003', status: 'ACTIVE', totalPoints: 50000, tierName: 'Bạch Kim', memberOf: 1 },
  { fullName: 'Phạm Văn Thắng', email: 'phamvan.thang@email.vn', phone: '0902000004', status: 'ACTIVE', totalPoints: 600, tierName: 'Đồng', memberOf: 1 },
  { fullName: 'Hoàng Thị Thu', email: 'hoangthi.thu@email.vn', phone: '0902000005', status: 'ACTIVE', totalPoints: 9800, tierName: 'Vàng', memberOf: 1 },
  { fullName: 'Huỳnh Văn Trung', email: 'huynhvan.trung@email.vn', phone: '0902000006', status: 'INACTIVE', totalPoints: 150, tierName: 'Đồng', memberOf: 1 },
  { fullName: 'Phan Thị Thư', email: 'phanthi.thu@email.vn', phone: '0902000007', status: 'ACTIVE', totalPoints: 7500, tierName: 'Vàng', memberOf: 1 },
  { fullName: 'Vũ Văn Tuấn', email: 'vuvan.tuan@email.vn', phone: '0902000008', status: 'ACTIVE', totalPoints: 2200, tierName: 'Bạc', memberOf: 1 },
  { fullName: 'Võ Thị Trang', email: 'vothi.trang@email.vn', phone: '0902000009', status: 'LOCKED', totalPoints: 450, tierName: 'Đồng', memberOf: 1 },
  { fullName: 'Đặng Văn Tài', email: 'dangvan.tai@email.vn', phone: '0902000010', status: 'ACTIVE', totalPoints: 18500, tierName: 'Vàng', memberOf: 1 },
  { fullName: 'Bùi Thị Vân', email: 'buithi.van@email.vn', phone: '0902000011', status: 'ACTIVE', totalPoints: 62000, tierName: 'Bạch Kim', memberOf: 1 },
  { fullName: 'Đỗ Văn Việt', email: 'dovan.viet@email.vn', phone: '0902000012', status: 'ACTIVE', totalPoints: 3400, tierName: 'Bạc', memberOf: 1 },
  { fullName: 'Hồ Thị Xuân', email: 'hothi.xuan@email.vn', phone: '0902000013', status: 'ACTIVE', totalPoints: 15000, tierName: 'Vàng', memberOf: 1 },
  { fullName: 'Ngô Văn Ý', email: 'ngovan.y@email.vn', phone: '0902000014', status: 'ACTIVE', totalPoints: 800, tierName: 'Đồng', memberOf: 1 },
  { fullName: 'Dương Thị Yến', email: 'duongthi.yen@email.vn', phone: '0902000015', status: 'ACTIVE', totalPoints: 10500, tierName: 'Vàng', memberOf: 1 },
  { fullName: 'Lý Văn An', email: 'lyvan.an@email.vn', phone: '0902000016', status: 'INACTIVE', totalPoints: 0, tierName: 'Đồng', memberOf: 1 },
  { fullName: 'Nguyễn Thị Chi', email: 'nguyenthi.chi@email.vn', phone: '0902000017', status: 'ACTIVE', totalPoints: 42000, tierName: 'Bạch Kim', memberOf: 1 },
  { fullName: 'Trần Văn Dũng', email: 'tranvan.dung@email.vn', phone: '0902000018', status: 'ACTIVE', totalPoints: 1600, tierName: 'Bạc', memberOf: 1 },

  // Fitness Pro (17 members)
  { fullName: 'Nguyễn Văn Phong', email: 'nguyenvan.phong@email.vn', phone: '0903000001', status: 'ACTIVE', totalPoints: 5000, tierName: 'Vàng', memberOf: 2 },
  { fullName: 'Trần Thị Hồng', email: 'tranthi.hong@email.vn', phone: '0903000002', status: 'ACTIVE', totalPoints: 25000, tierName: 'Bạch Kim', memberOf: 2 },
  { fullName: 'Lê Văn Minh', email: 'levan.minh@email.vn', phone: '0903000003', status: 'ACTIVE', totalPoints: 30000, tierName: 'Bạch Kim', memberOf: 2 },
  { fullName: 'Phạm Thị Hà', email: 'phamthi.ha2@email.vn', phone: '0903000004', status: 'ACTIVE', totalPoints: 8500, tierName: 'Vàng', memberOf: 2 },
  { fullName: 'Hoàng Văn Khải', email: 'hoangvan.khai@email.vn', phone: '0903000005', status: 'ACTIVE', totalPoints: 1200, tierName: 'Bạc', memberOf: 2 },
  { fullName: 'Huỳnh Thị Nhung', email: 'huynhthi.nhung@email.vn', phone: '0903000006', status: 'ACTIVE', totalPoints: 18000, tierName: 'Vàng', memberOf: 2 },
  { fullName: 'Phan Văn Lộc', email: 'phanvan.loc@email.vn', phone: '0903000007', status: 'ACTIVE', totalPoints: 60000, tierName: 'Bạch Kim', memberOf: 2 },
  { fullName: 'Vũ Thị Kiều', email: 'vuthi.kieu@email.vn', phone: '0903000008', status: 'INACTIVE', totalPoints: 200, tierName: 'Đồng', memberOf: 2 },
  { fullName: 'Võ Văn Thành', email: 'vovan.thanh@email.vn', phone: '0903000009', status: 'ACTIVE', totalPoints: 4200, tierName: 'Bạc', memberOf: 2 },
  { fullName: 'Đặng Thị Tuyết', email: 'dangthi.tuyet@email.vn', phone: '0903000010', status: 'ACTIVE', totalPoints: 15000, tierName: 'Vàng', memberOf: 2 },
  { fullName: 'Bùi Văn Hoàng', email: 'buivan.hoang@email.vn', phone: '0903000011', status: 'ACTIVE', totalPoints: 75000, tierName: 'Bạch Kim', memberOf: 2 },
  { fullName: 'Đỗ Thị Lan Anh', email: 'dothi.lananh@email.vn', phone: '0903000012', status: 'ACTIVE', totalPoints: 3500, tierName: 'Bạc', memberOf: 2 },
  { fullName: 'Hồ Văn Quốc', email: 'hovan.quoc@email.vn', phone: '0903000013', status: 'PENDING_KYC', totalPoints: 900, tierName: 'Đồng', memberOf: 2 },
  { fullName: 'Ngô Thị Mỹ', email: 'ngothi.my@email.vn', phone: '0903000014', status: 'ACTIVE', totalPoints: 22000, tierName: 'Bạch Kim', memberOf: 2 },
  { fullName: 'Dương Văn Tùng', email: 'duongvan.tung@email.vn', phone: '0903000015', status: 'INACTIVE', totalPoints: 0, tierName: 'Đồng', memberOf: 2 },
  { fullName: 'Lý Thị Thúy', email: 'lythi.thuy@email.vn', phone: '0903000016', status: 'ACTIVE', totalPoints: 11000, tierName: 'Vàng', memberOf: 2 },
  { fullName: 'Nguyễn Văn Bình', email: 'nguyenvan.binh@email.vn', phone: '0903000017', status: 'ACTIVE', totalPoints: 48000, tierName: 'Bạch Kim', memberOf: 2 },
];

export const STORES: StoreSeed[] = [
  // Thương Hiệu Xanh (3 stores)
  { name: 'Thương Hiệu Xanh - Lê Lợi', code: 'THX-LL-001', address: '123 Lê Lợi, P. Bến Nghé, Q.1, TP.HCM', phone: '02838221231', email: 'levan@thuonghieuxanh.vn', status: 'ACTIVE', openingHours: { mon: '08:00-21:00', tue: '08:00-21:00', wed: '08:00-21:00', thu: '08:00-21:00', fri: '08:00-21:00', sat: '09:00-22:00', sun: '09:00-18:00' }, tenantIndex: 0 },
  { name: 'Thương Hiệu Xanh - Nguyễn Huệ', code: 'THX-NH-002', address: '250 Nguyễn Huệ, P. Bến Nghé, Q.1, TP.HCM', phone: '02838221232', email: 'nguyenhue@thuonghieuxanh.vn', status: 'ACTIVE', openingHours: { mon: '08:00-21:00', tue: '08:00-21:00', wed: '08:00-21:00', thu: '08:00-21:00', fri: '08:00-21:00', sat: '09:00-22:00', sun: '09:00-18:00' }, tenantIndex: 0 },
  { name: 'Thương Hiệu Xanh - Phú Nhuận', code: 'THX-PN-003', address: '88 Phan Đăng Lưu, P.7, Q. Phú Nhuận, TP.HCM', phone: '02838221233', email: 'phunhuan@thuonghieuxanh.vn', status: 'ACTIVE', openingHours: { mon: '09:00-21:00', tue: '09:00-21:00', wed: '09:00-21:00', thu: '09:00-21:00', fri: '09:00-21:00', sat: '09:00-22:00', sun: '09:00-18:00' }, tenantIndex: 0 },

  // Cafe Sài Gòn (5 stores)
  { name: 'Cafe Sài Gòn - Nguyễn Huệ', code: 'CSG-NH-001', address: '45 Nguyễn Huệ, P. Bến Nghé, Q.1, TP.HCM', phone: '02838225671', email: 'nguyenhue@cafesaigon.vn', status: 'ACTIVE', openingHours: { mon: '06:30-23:00', tue: '06:30-23:00', wed: '06:30-23:00', thu: '06:30-23:00', fri: '06:30-23:00', sat: '07:00-23:30', sun: '07:00-22:00' }, tenantIndex: 1 },
  { name: 'Cafe Sài Gòn - Lê Lợi', code: 'CSG-LL-002', address: '200 Lê Lợi, P. Bến Thành, Q.1, TP.HCM', phone: '02838225672', email: 'leloi@cafesaigon.vn', status: 'ACTIVE', openingHours: { mon: '06:30-23:00', tue: '06:30-23:00', wed: '06:30-23:00', thu: '06:30-23:00', fri: '06:30-23:00', sat: '07:00-23:30', sun: '07:00-22:00' }, tenantIndex: 1 },
  { name: 'Cafe Sài Gòn - Hai Bà Trưng', code: 'CSG-HBT-003', address: '150 Hai Bà Trưng, P. Đa Kao, Q.1, TP.HCM', phone: '02838225673', email: 'haibatrung@cafesaigon.vn', status: 'ACTIVE', openingHours: { mon: '06:30-22:30', tue: '06:30-22:30', wed: '06:30-22:30', thu: '06:30-22:30', fri: '06:30-22:30', sat: '07:00-23:00', sun: '07:00-22:00' }, tenantIndex: 1 },
  { name: 'Cafe Sài Gòn - Bình Thạnh', code: 'CSG-BT-004', address: '60 Xô Viết Nghệ Tĩnh, P.19, Q. Bình Thạnh, TP.HCM', phone: '02838225674', email: 'binhthanh@cafesaigon.vn', status: 'ACTIVE', openingHours: { mon: '07:00-22:30', tue: '07:00-22:30', wed: '07:00-22:30', thu: '07:00-22:30', fri: '07:00-22:30', sat: '07:00-23:00', sun: '07:00-22:00' }, tenantIndex: 1 },
  { name: 'Cafe Sài Gòn - Phú Mỹ Hưng', code: 'CSG-PMH-005', address: '12 Nguyễn Lương Bằng, P. Tân Phú, Q.7, TP.HCM', phone: '02838225675', email: 'phumyhung@cafesaigon.vn', status: 'ACTIVE', openingHours: { mon: '07:00-22:30', tue: '07:00-22:30', wed: '07:00-22:30', thu: '07:00-22:30', fri: '07:00-22:30', sat: '07:00-23:00', sun: '07:00-22:00' }, tenantIndex: 1 },

  // Fitness Pro (3 stores)
  { name: 'Fitness Pro - Láng Hạ', code: 'FP-LH-001', address: '88 Láng Hạ, P. Thịnh Quang, Q. Đống Đa, Hà Nội', phone: '02438229011', email: 'langha@fitnesspro.vn', status: 'ACTIVE', openingHours: { mon: '05:00-22:00', tue: '05:00-22:00', wed: '05:00-22:00', thu: '05:00-22:00', fri: '05:00-22:00', sat: '06:00-21:00', sun: '06:00-20:00' }, tenantIndex: 2 },
  { name: 'Fitness Pro - Hoàn Kiếm', code: 'FP-HK-002', address: '45 Tràng Thi, P. Hàng Trống, Q. Hoàn Kiếm, Hà Nội', phone: '02438229012', email: 'hoankiem@fitnesspro.vn', status: 'ACTIVE', openingHours: { mon: '06:00-22:00', tue: '06:00-22:00', wed: '06:00-22:00', thu: '06:00-22:00', fri: '06:00-22:00', sat: '07:00-21:00', sun: '07:00-20:00' }, tenantIndex: 2 },
  { name: 'Fitness Pro - Cầu Giấy', code: 'FP-CG-003', address: '120 Trần Duy Hưng, P. Trung Hòa, Q. Cầu Giấy, Hà Nội', phone: '02438229013', email: 'caugiay@fitnesspro.vn', status: 'ACTIVE', openingHours: { mon: '05:30-22:30', tue: '05:30-22:30', wed: '05:30-22:30', thu: '05:30-22:30', fri: '05:30-22:30', sat: '06:30-21:00', sun: '06:30-20:00' }, tenantIndex: 2 },

  // Additional stores to reach 15
  { name: 'Thương Hiệu Xanh - Tân Bình', code: 'THX-TB-004', address: '500 Cộng Hòa, P.13, Q. Tân Bình, TP.HCM', phone: '02838221234', email: 'tanbinh@thuonghieuxanh.vn', status: 'ACTIVE', openingHours: { mon: '08:00-21:00', tue: '08:00-21:00', wed: '08:00-21:00', thu: '08:00-21:00', fri: '08:00-21:00', sat: '09:00-22:00', sun: '09:00-18:00' }, tenantIndex: 0 },
  { name: 'Fitness Pro - Hà Đông', code: 'FP-HD-004', address: '25 Nguyễn Viết Xuân, P. La Khê, Q. Hà Đông, Hà Nội', phone: '02438229014', email: 'hadong@fitnesspro.vn', status: 'ACTIVE', openingHours: { mon: '06:00-22:00', tue: '06:00-22:00', wed: '06:00-22:00', thu: '06:00-22:00', fri: '06:00-22:00', sat: '07:00-21:00', sun: '07:00-20:00' }, tenantIndex: 2 },
  { name: 'Cafe Sài Gòn - Thảo Điền', code: 'CSG-TD-006', address: '88 Nguyễn Văn Hưởng, P. Thảo Điền, TP. Thủ Đức, TP.HCM', phone: '02838225676', email: 'thaodien@cafesaigon.vn', status: 'ACTIVE', openingHours: { mon: '06:30-22:30', tue: '06:30-22:30', wed: '06:30-22:30', thu: '06:30-22:30', fri: '06:30-22:30', sat: '07:00-23:00', sun: '07:00-22:00' }, tenantIndex: 1 },
];

export const CAMPAIGNS: CampaignSeed[] = [
  // Thương Hiệu Xanh (3 campaigns)
  { name: 'Mùa Hè Xanh 2026', description: 'Tích điểm nhân đôi cho tất cả sản phẩm xanh trong mùa hè', startDate: new Date('2026-06-01'), endDate: new Date('2026-08-31'), status: 'ACTIVE', budget: 50000000, tenantIndex: 0 },
  { name: 'Tết Nguyên Đán 2026', description: 'Chương trình khuyến mãi Tết - Nhận lộc đầu năm', startDate: new Date('2026-01-15'), endDate: new Date('2026-02-15'), status: 'ENDED', budget: 80000000, tenantIndex: 0 },
  { name: 'Khai trương chi nhánh mới', description: 'Sự kiện khai trương Thương Hiệu Xanh Tân Bình', startDate: new Date('2026-09-01'), endDate: new Date('2026-09-30'), status: 'SCHEDULED', budget: 30000000, tenantIndex: 0 },

  // Cafe Sài Gòn (4 campaigns)
  { name: 'Cà Phê Sáng - Năng Động Cả Ngày', description: 'Giảm giá 20% cho đơn hàng trước 9h sáng', startDate: new Date('2026-03-01'), endDate: new Date('2026-06-30'), status: 'ENDED', budget: 20000000, tenantIndex: 1 },
  { name: 'Mùa Hè Sảng Khoái', description: 'Mua 2 tặng 1 các thức uống mùa hè', startDate: new Date('2026-06-15'), endDate: new Date('2026-09-15'), status: 'SCHEDULED', budget: 35000000, tenantIndex: 1 },
  { name: 'Thành viên VIP - Ưu đãi đặc biệt', description: 'Dành riêng cho hội viên Vàng và Bạch Kim', startDate: new Date('2026-04-01'), endDate: new Date('2026-12-31'), status: 'ACTIVE', budget: 60000000, tenantIndex: 1 },
  { name: 'Giáng Sinh Ấm Áp', description: 'Combo quà tặng Giáng Sinh với điểm thưởng', startDate: new Date('2026-12-01'), endDate: new Date('2026-12-31'), status: 'SCHEDULED', budget: 25000000, tenantIndex: 1 },

  // Fitness Pro (3 campaigns)
  { name: 'Thử Thách 30 Ngày', description: 'Hoàn thành 30 ngày tập luyện nhận thưởng lớn', startDate: new Date('2026-05-01'), endDate: new Date('2026-12-31'), status: 'ACTIVE', budget: 100000000, tenantIndex: 2 },
  { name: 'Giới Thiệu Bạn Bè', description: 'Giới thiệu bạn đăng ký - Nhận ngay 5000 điểm', startDate: new Date('2026-01-01'), endDate: new Date('2026-06-30'), status: 'ENDED', budget: 40000000, tenantIndex: 2 },
  { name: 'Summer Body 2026', description: 'Giảm giá gói tập mùa hè cho hội viên thân thiết', startDate: new Date('2026-07-01'), endDate: new Date('2026-09-30'), status: 'SCHEDULED', budget: 50000000, tenantIndex: 2 },
];

export const VOUCHER_TEMPLATES: VoucherTemplate[] = [
  { codePrefix: 'THX-DIS', type: 'discount', value: 10, maxUsage: 50, expiresInDays: 90, count: 15, tenantIndex: 0 },
  { codePrefix: 'THX-CASH', type: 'cashback', value: 50000, maxUsage: 30, expiresInDays: 60, count: 10, tenantIndex: 0 },
  { codePrefix: 'THX-GIFT', type: 'gift', value: 100000, maxUsage: 20, expiresInDays: 45, count: 8, tenantIndex: 0 },
  { codePrefix: 'THX-DIS-BIG', type: 'discount', value: 20, maxUsage: 25, expiresInDays: 120, count: 10, tenantIndex: 0 },
  { codePrefix: 'CSG-DIS', type: 'discount', value: 15, maxUsage: 100, expiresInDays: 30, count: 25, tenantIndex: 1 },
  { codePrefix: 'CSG-CASH', type: 'cashback', value: 20000, maxUsage: 80, expiresInDays: 45, count: 20, tenantIndex: 1 },
  { codePrefix: 'CSG-GIFT', type: 'gift', value: 50000, maxUsage: 40, expiresInDays: 60, count: 15, tenantIndex: 1 },
  { codePrefix: 'CSG-DIS-BUY2', type: 'discount', value: 25, maxUsage: 50, expiresInDays: 20, count: 15, tenantIndex: 1 },
  { codePrefix: 'FP-DIS', type: 'discount', value: 20, maxUsage: 60, expiresInDays: 60, count: 20, tenantIndex: 2 },
  { codePrefix: 'FP-CASH', type: 'cashback', value: 100000, maxUsage: 30, expiresInDays: 90, count: 12, tenantIndex: 2 },
  { codePrefix: 'FP-GIFT', type: 'gift', value: 200000, maxUsage: 15, expiresInDays: 120, count: 8, tenantIndex: 2 },
  { codePrefix: 'FP-DIS-VIP', type: 'discount', value: 30, maxUsage: 20, expiresInDays: 45, count: 10, tenantIndex: 2 },
  { codePrefix: 'THX-BDAY', type: 'discount', value: 15, maxUsage: 40, expiresInDays: 30, count: 12, tenantIndex: 0 },
  { codePrefix: 'CSG-BDAY', type: 'gift', value: 35000, maxUsage: 60, expiresInDays: 15, count: 12, tenantIndex: 1 },
  { codePrefix: 'FP-BDAY', type: 'discount', value: 25, maxUsage: 30, expiresInDays: 30, count: 8, tenantIndex: 2 },
  { codePrefix: 'THX-NEW', type: 'discount', value: 10, maxUsage: 100, expiresInDays: 14, count: 20, tenantIndex: 0 },
];

export const PROMOTIONS: PromotionSeed[] = [
  { name: 'Giảm giá thành viên Vàng', description: 'Giảm 10% cho hội viên Vàng trở lên', priority: 1, status: 'ACTIVE', conditions: { tier: { gte: 'Vàng' } }, actions: { discount: 10 }, tenantIndex: 0 },
  { name: 'Tích điểm x2 cuối tuần', description: 'Nhân đôi điểm tích lũy vào cuối tuần', priority: 2, status: 'ACTIVE', conditions: { dayOfWeek: [6, 7] }, actions: { pointsMultiplier: 2 }, tenantIndex: 0 },
  { name: 'Sinh nhật - Quà tặng đặc biệt', description: 'Tặng 500 điểm vào ngày sinh nhật', priority: 3, status: 'ACTIVE', conditions: { isBirthday: true }, actions: { bonusPoints: 500 }, tenantIndex: 1 },
  { name: 'Happy Hour - Giảm 15%', description: 'Giảm 15% cho đơn hàng trong khung giờ 14h-17h', priority: 1, status: 'ACTIVE', conditions: { hourRange: [14, 17] }, actions: { discount: 15 }, tenantIndex: 1 },
  { name: 'Điểm thưởng đăng ký mới', description: 'Tặng 2000 điểm cho thành viên mới', priority: 1, status: 'ACTIVE', conditions: { isNewMember: true }, actions: { bonusPoints: 2000 }, tenantIndex: 2 },
  { name: 'Giới thiệu bạn - Nhận thưởng', description: 'Nhận 1000 điểm khi giới thiệu bạn tập', priority: 2, status: 'ACTIVE', conditions: { referralCount: { gte: 1 } }, actions: { bonusPoints: 1000 }, tenantIndex: 2 },
  { name: 'Khách hàng thân thiết', description: 'Giảm 5% cho hội viên Bạc', priority: 2, status: 'PAUSED', conditions: { tier: { eq: 'Bạc' } }, actions: { discount: 5 }, tenantIndex: 1 },
  { name: 'Mùa hè năng động', description: 'Giảm 20% gói tập 3 tháng', priority: 3, status: 'SCHEDULED', conditions: { campaign: 'Summer Body 2026' }, actions: { discount: 20 }, tenantIndex: 2 },
];

export const BADGES: BadgeSeed[] = [
  { name: 'Chiến Binh Mua Sắm', description: 'Tích lũy trên 10,000 điểm', iconUrl: '/badges/shopping-warrior.png', criteria: { totalPoints: { gte: 10000 } }, tenantIndex: 0 },
  { name: 'Khách Hàng Thân Thiết', description: 'Là thành viên trên 1 năm', iconUrl: '/badges/loyal-customer.png', criteria: { membershipDays: { gte: 365 } }, tenantIndex: 0 },
  { name: 'Xanh - Sạch - Đẹp', description: 'Mua sản phẩm xanh 20 lần', iconUrl: '/badges/green-warrior.png', criteria: { greenPurchases: { gte: 20 } }, tenantIndex: 0 },
  { name: 'Thiên Thần Cà Phê', description: 'Ghé thăm quán 50 lần', iconUrl: '/badges/coffee-angel.png', criteria: { visitCount: { gte: 50 } }, tenantIndex: 1 },
  { name: 'Sành Điệu', description: 'Thử tất cả thức uống đặc biệt', iconUrl: '/badges/connoisseur.png', criteria: { uniqueDrinks: { gte: 10 } }, tenantIndex: 1 },
  { name: 'Bạn Đồng Hành', description: 'Giới thiệu 5 bạn bè', iconUrl: '/badges/friend-finder.png', criteria: { referralCount: { gte: 5 } }, tenantIndex: 1 },
  { name: 'Đại Sứ Thể Hình', description: 'Tham gia 100 buổi tập', iconUrl: '/badges/fitness-ambassador.png', criteria: { sessionsAttended: { gte: 100 } }, tenantIndex: 2 },
  { name: 'Sức Mạnh Bền Bỉ', description: 'Chuỗi tập luyện 30 ngày liên tục', iconUrl: '/badges/strength-endurance.png', criteria: { streakDays: { gte: 30 } }, tenantIndex: 2 },
  { name: 'Người Mới Năng Động', description: 'Hoàn thành thử thách 7 ngày đầu', iconUrl: '/badges/active-newbie.png', criteria: { firstWeekComplete: true }, tenantIndex: 2 },
  { name: 'VIP Đẳng Cấp', description: 'Đạt hạng Kim Cương', iconUrl: '/badges/vip-elite.png', criteria: { tier: 'Kim Cương' }, tenantIndex: 0 },
  { name: 'Người Yêu Thiên Nhiên', description: 'Mua sản phẩm tái chế 10 lần', iconUrl: '/badges/nature-lover.png', criteria: { recycledPurchases: { gte: 10 } }, tenantIndex: 0 },
  { name: 'Sáng Tạo Cùng Cà Phê', description: 'Viết 5 đánh giá cho sản phẩm mới', iconUrl: '/badges/coffee-creative.png', criteria: { reviewsWritten: { gte: 5 } }, tenantIndex: 1 },
  { name: 'Người Truyền Cảm Hứng', description: 'Đạt điểm danh tiếng 1000', iconUrl: '/badges/inspirer.png', criteria: { reputationPoints: { gte: 1000 } }, tenantIndex: 2 },
  { name: 'Siêu Sao Mùa Hè', description: 'Hoàn thành thử thách mùa hè', iconUrl: '/badges/summer-star.png', criteria: { summerChallenge: true }, tenantIndex: 2 },
  { name: 'Gương Mặt Thân Quen', description: 'Quay lại trong 3 tháng liên tiếp', iconUrl: '/badges/frequent-face.png', criteria: { monthlyVisits: { gte: 3 } }, tenantIndex: 1 },
];

export const MISSIONS: MissionSeed[] = [
  { name: 'Mua 5 lần trong tháng', description: 'Thực hiện 5 giao dịch trong tháng này', pointsReward: 2000, criteria: { purchaseCount: { gte: 5 } }, startOffsetDays: 0, endOffsetDays: 30, tenantIndex: 0 },
  { name: 'Giới thiệu bạn bè', description: 'Giới thiệu 3 người bạn đăng ký thành viên', pointsReward: 3000, criteria: { referralCount: { gte: 3 } }, startOffsetDays: 0, endOffsetDays: 60, tenantIndex: 0 },
  { name: 'Đánh giá sản phẩm', description: 'Viết 3 đánh giá cho sản phẩm đã mua', pointsReward: 1000, criteria: { reviewCount: { gte: 3 } }, startOffsetDays: -30, endOffsetDays: 60, tenantIndex: 0 },
  { name: 'Thử thức uống mới', description: 'Thử 3 thức uống mới trong tháng', pointsReward: 1500, criteria: { newDrinks: { gte: 3 } }, startOffsetDays: 0, endOffsetDays: 30, tenantIndex: 1 },
  { name: 'Rủ bạn cùng uống cà phê', description: 'Đưa 2 người bạn đến quán', pointsReward: 2000, criteria: { friendVisits: { gte: 2 } }, startOffsetDays: 0, endOffsetDays: 14, tenantIndex: 1 },
  { name: 'Tập 12 buổi mỗi tháng', description: 'Hoàn thành 12 buổi tập trong tháng', pointsReward: 5000, criteria: { sessionsPerMonth: { gte: 12 } }, startOffsetDays: 0, endOffsetDays: 30, tenantIndex: 2 },
  { name: 'Giảm 2kg trong tháng', description: 'Giảm 2kg với sự hỗ trợ từ PT', pointsReward: 8000, criteria: { weightLoss: { gte: 2 } }, startOffsetDays: -7, endOffsetDays: 30, tenantIndex: 2 },
  { name: 'Tham gia lớp học Yoga', description: 'Tham gia 4 lớp yoga trong tháng', pointsReward: 3000, criteria: { yogaClasses: { gte: 4 } }, startOffsetDays: 0, endOffsetDays: 30, tenantIndex: 2 },
  { name: 'Mua sắm tiết kiệm', description: 'Tiết kiệm 500k khi mua hàng khuyến mãi', pointsReward: 2500, criteria: { savingsAmount: { gte: 500000 } }, startOffsetDays: 0, endOffsetDays: 45, tenantIndex: 0 },
  { name: 'Check-in liên tục', description: 'Check-in 7 ngày liên tiếp', pointsReward: 500, criteria: { checkinStreak: { gte: 7 } }, startOffsetDays: 0, endOffsetDays: 14, tenantIndex: 1 },
];

export const FEEDBACK: FeedbackSeed[] = [
  { memberIndex: 0, entityType: 'store', rating: 5, content: 'Cửa hàng rất đẹp, nhân viên nhiệt tình! Sẽ quay lại thường xuyên.', status: 'PUBLISHED' },
  { memberIndex: 1, entityType: 'store', rating: 4, content: 'Sản phẩm đa dạng, giá cả hợp lý. Chỉ hơi đông vào cuối tuần.', status: 'PUBLISHED' },
  { memberIndex: 3, entityType: 'store', rating: 5, content: 'Chất lượng sản phẩm tuyệt vời, rất hài lòng!', status: 'PUBLISHED' },
  { memberIndex: 5, entityType: 'campaign', rating: 4, content: 'Chương trình khuyến mãi hấp dẫn, hy vọng có thêm nhiều đợt như này.', status: 'PUBLISHED' },
  { memberIndex: 8, entityType: 'voucher', rating: 5, content: 'Voucher giảm giá rất có ích, đã tiết kiệm được kha khá.', status: 'PUBLISHED' },
  { memberIndex: 11, entityType: 'store', rating: 3, content: 'Cần cải thiện thêm về thái độ nhân viên.', status: 'PUBLISHED' },
  { memberIndex: 14, entityType: 'reward', rating: 5, content: 'Quà tặng sinh nhật rất ý nghĩa, cảm ơn chương trình!', status: 'PUBLISHED' },
  { memberIndex: 15, entityType: 'campaign', rating: 5, content: 'Rất thích chương trình tích điểm, đã đổi được nhiều quà.', status: 'PUBLISHED' },
  { memberIndex: 20, entityType: 'store', rating: 4, content: 'Cà phê ngon, không gian đẹp, nhạc hay. Chỗ đậu xe hơi khó.', status: 'PUBLISHED' },
  { memberIndex: 21, entityType: 'store', rating: 5, content: 'Nhân viên pha chế rất chuyên nghiệp, cà phê đúng gu.', status: 'PUBLISHED' },
  { memberIndex: 23, entityType: 'campaign', rating: 4, content: 'Chương trình Mua 2 tặng 1 rất tuyệt, mong có thêm.', status: 'PUBLISHED' },
  { memberIndex: 25, entityType: 'store', rating: 2, content: 'Quán quá đông, phải chờ lâu. Cần cải thiện quy trình.', status: 'HIDDEN' },
  { memberIndex: 27, entityType: 'voucher', rating: 5, content: 'Voucher giảm giá rất ok, đã dùng được nhiều lần.', status: 'PUBLISHED' },
  { memberIndex: 29, entityType: 'campaign', rating: 4, content: 'Chương trình thành viên VIP tốt, nhiều ưu đãi hay.', status: 'PUBLISHED' },
  { memberIndex: 30, entityType: 'reward', rating: 5, content: 'Đổi quà dễ dàng, nhiều lựa chọn.', status: 'PUBLISHED' },
  { memberIndex: 34, entityType: 'store', rating: 5, content: 'Phòng gym sạch sẽ, máy móc mới, PT rất nhiệt tình!', status: 'PUBLISHED' },
  { memberIndex: 35, entityType: 'store', rating: 4, content: 'Cơ sở vật chất tốt, giá hơi cao nhưng xứng đáng.', status: 'PUBLISHED' },
  { memberIndex: 37, entityType: 'campaign', rating: 5, content: 'Thử thách 30 ngày rất hiệu quả, đã giảm được 5kg!', status: 'PUBLISHED' },
  { memberIndex: 40, entityType: 'voucher', rating: 4, content: 'Voucher tập thử buổi đầu free rất tiện.', status: 'PUBLISHED' },
  { memberIndex: 42, entityType: 'campaign', rating: 3, content: 'Chương trình giới thiệu bạn bè thưởng hơi thấp.', status: 'PUBLISHED' },
];

export const GIFT_CARDS: GiftCardSeed[] = [
  { code: 'THX-GC-001', initialValue: 100000, balance: 100000, type: 'digital', status: 'ACTIVE', expiresAt: new Date('2027-06-01'), tenantIndex: 0 },
  { code: 'THX-GC-002', initialValue: 200000, balance: 150000, type: 'digital', status: 'ACTIVE', expiresAt: new Date('2027-06-01'), tenantIndex: 0 },
  { code: 'THX-GC-003', initialValue: 500000, balance: 500000, type: 'physical', status: 'ACTIVE', expiresAt: new Date('2027-12-31'), tenantIndex: 0 },
  { code: 'THX-GC-004', initialValue: 300000, balance: 0, type: 'digital', status: 'REDEEMED', expiresAt: new Date('2026-01-01'), tenantIndex: 0 },
  { code: 'THX-GC-005', initialValue: 1000000, balance: 800000, type: 'physical', status: 'ACTIVE', expiresAt: new Date('2028-01-01'), tenantIndex: 0 },
  { code: 'THX-GC-006', initialValue: 50000, balance: 0, type: 'digital', status: 'EXPIRED', expiresAt: new Date('2025-01-01'), tenantIndex: 0 },
  { code: 'THX-GC-007', initialValue: 200000, balance: 200000, type: 'digital', status: 'ACTIVE', expiresAt: new Date('2027-09-01'), tenantIndex: 0 },
  { code: 'CSG-GC-001', initialValue: 50000, balance: 35000, type: 'digital', status: 'ACTIVE', expiresAt: new Date('2026-12-31'), tenantIndex: 1 },
  { code: 'CSG-GC-002', initialValue: 100000, balance: 100000, type: 'physical', status: 'ACTIVE', expiresAt: new Date('2026-12-31'), tenantIndex: 1 },
  { code: 'CSG-GC-003', initialValue: 200000, balance: 200000, type: 'physical', status: 'ACTIVE', expiresAt: new Date('2027-06-01'), tenantIndex: 1 },
  { code: 'CSG-GC-004', initialValue: 50000, balance: 0, type: 'digital', status: 'REDEEMED', expiresAt: new Date('2025-12-31'), tenantIndex: 1 },
  { code: 'CSG-GC-005', initialValue: 500000, balance: 500000, type: 'digital', status: 'DISABLED', expiresAt: new Date('2027-12-31'), tenantIndex: 1 },
  { code: 'CSG-GC-006', initialValue: 100000, balance: 80000, type: 'digital', status: 'ACTIVE', expiresAt: new Date('2026-09-01'), tenantIndex: 1 },
  { code: 'CSG-GC-007', initialValue: 300000, balance: 300000, type: 'physical', status: 'ACTIVE', expiresAt: new Date('2027-12-31'), tenantIndex: 1 },
  { code: 'CSG-GC-008', initialValue: 150000, balance: 0, type: 'digital', status: 'EXPIRED', expiresAt: new Date('2025-06-01'), tenantIndex: 1 },
  { code: 'FP-GC-001', initialValue: 500000, balance: 500000, type: 'physical', status: 'ACTIVE', expiresAt: new Date('2027-12-31'), tenantIndex: 2 },
  { code: 'FP-GC-002', initialValue: 1000000, balance: 600000, type: 'physical', status: 'ACTIVE', expiresAt: new Date('2028-06-01'), tenantIndex: 2 },
  { code: 'FP-GC-003', initialValue: 300000, balance: 300000, type: 'digital', status: 'ACTIVE', expiresAt: new Date('2027-03-01'), tenantIndex: 2 },
  { code: 'FP-GC-004', initialValue: 200000, balance: 0, type: 'digital', status: 'REDEEMED', expiresAt: new Date('2026-06-01'), tenantIndex: 2 },
  { code: 'FP-GC-005', initialValue: 2000000, balance: 2000000, type: 'physical', status: 'ACTIVE', expiresAt: new Date('2028-12-31'), tenantIndex: 2 },
  { code: 'FP-GC-006', initialValue: 500000, balance: 500000, type: 'digital', status: 'ACTIVE', expiresAt: new Date('2027-09-01'), tenantIndex: 2 },
  { code: 'FP-GC-007', initialValue: 750000, balance: 750000, type: 'physical', status: 'ACTIVE', expiresAt: new Date('2027-06-01'), tenantIndex: 2 },
  { code: 'THX-GC-008', initialValue: 150000, balance: 120000, type: 'digital', status: 'ACTIVE', expiresAt: new Date('2026-12-31'), tenantIndex: 0 },
  { code: 'FP-GC-008', initialValue: 250000, balance: 0, type: 'digital', status: 'EXPIRED', expiresAt: new Date('2025-12-31'), tenantIndex: 2 },
  { code: 'CSG-GC-009', initialValue: 80000, balance: 80000, type: 'digital', status: 'ACTIVE', expiresAt: new Date('2026-08-01'), tenantIndex: 1 },
];

export const CASHBACK_CONFIGS: CashbackConfigSeed[] = [
  { name: 'Hoàn tiền cơ bản', description: '1% hoàn tiền cho mọi giao dịch', rate: 0.01, minAmount: 0, maxAmount: 50000, status: 'ACTIVE', tenantIndex: 0 },
  { name: 'Hoàn tiền mùa hè', description: '3% hoàn tiền mùa hè', rate: 0.03, minAmount: 200000, maxAmount: 200000, startDate: new Date('2026-06-01'), endDate: new Date('2026-08-31'), status: 'ACTIVE', tenantIndex: 0 },
  { name: 'Hoàn tiền Cafe Sài Gòn', description: '2% hoàn tiền cho mọi hóa đơn', rate: 0.02, minAmount: 50000, maxAmount: 50000, minPointsBalance: 1000, status: 'ACTIVE', tenantIndex: 1 },
  { name: 'Hoàn tiền Fitness Pro', description: '5% hoàn tiền cho gói tập 12 tháng', rate: 0.05, minAmount: 5000000, maxAmount: 1000000, status: 'ACTIVE', tenantIndex: 2 },
  { name: 'VIP Cashback', description: '3% hoàn tiền cho hội viên VIP', rate: 0.03, minAmount: 100000, maxAmount: 300000, minPointsBalance: 5000, status: 'ACTIVE', tenantIndex: 0 },
];

export const PARTNER_BRANDS: PartnerBrandSeed[] = [
  { name: 'VinMart', code: 'VINMART', description: 'Siêu thị tiện lợi VinMart - Đối tác chính thức', website: 'https://vinmart.vn', contactEmail: 'partner@vinmart.vn', commissionRate: 0.08, tenantIndex: 0 },
  { name: 'GrabFood', code: 'GRABFOOD', description: 'Đối tác giao hàng GrabFood', website: 'https://grabfood.vn', contactEmail: 'partner@grabfood.vn', commissionRate: 0.12, tenantIndex: 1 },
  { name: 'Highlands Coffee', code: 'HIGHLANDS', description: 'Đối tác chiến lược chuỗi cà phê', website: 'https://highlandscoffee.vn', contactEmail: 'partner@highlands.vn', commissionRate: 0.1, tenantIndex: 1 },
  { name: 'MyProtein', code: 'MYPROTEIN', description: 'Đối tác thực phẩm bổ sung thể hình', website: 'https://myprotein.vn', contactEmail: 'partner@myprotein.vn', commissionRate: 0.15, tenantIndex: 2 },
  { name: 'Decathlon', code: 'DECATHLON', description: 'Đối tác đồ thể thao', website: 'https://decathlon.vn', contactEmail: 'partner@decathlon.vn', commissionRate: 0.1, tenantIndex: 2 },
];

export const PARTNER_REWARDS: PartnerRewardSeed[] = [
  { brandIndex: 0, name: 'Voucher 50k VinMart', description: 'Voucher mua hàng 50,000đ tại VinMart', type: 'voucher', value: 50000, pointsRequired: 2500, quantity: 100, tenantIndex: 0 },
  { brandIndex: 1, name: 'FreeShip GrabFood', description: 'Miễn phí vận chuyển đơn hàng GrabFood', type: 'discount', value: 20000, pointsRequired: 1000, quantity: 200, tenantIndex: 1 },
  { brandIndex: 2, name: 'Cà phê Highlands tặng kèm', description: '1 ly cà phê bất kỳ tại Highlands', type: 'gift', value: 55000, pointsRequired: 2000, quantity: 50, tenantIndex: 1 },
  { brandIndex: 3, name: 'Whey Protein 1kg', description: 'Whey Protein Isolate 1kg - MyProtein', type: 'gift', value: 850000, pointsRequired: 30000, quantity: 10, tenantIndex: 2 },
  { brandIndex: 4, name: 'Găng tay tập Gym', description: 'Găng tay tập gym cao cấp Decathlon', type: 'voucher', value: 300000, pointsRequired: 10000, quantity: 30, tenantIndex: 2 },
];

export const CATEGORIES: CategorySeed[] = [
  { name: 'Điện tử - Điện máy', slug: 'dien-tu-dien-may', description: 'Điện thoại, laptop, thiết bị điện tử', icon: '📱', sortOrder: 1, tenantIndex: 0 },
  { name: 'Thời trang - Phụ kiện', slug: 'thoi-trang-phu-kien', description: 'Quần áo, giày dép, túi xách', icon: '👕', sortOrder: 2, tenantIndex: 0 },
  { name: 'Thực phẩm - Đồ uống', slug: 'thuc-pham-do-uong', description: 'Đồ ăn, thức uống, thực phẩm sạch', icon: '🍎', sortOrder: 3, tenantIndex: 0 },
  { name: 'Đồ gia dụng', slug: 'do-gia-dung', description: 'Đồ dùng nhà bếp, trang trí nhà cửa', icon: '🏠', sortOrder: 4, tenantIndex: 0 },
  { name: 'Cà phê hạt', slug: 'ca-phe-hat', description: 'Cà phê hạt rang xay nguyên chất', icon: '🫘', sortOrder: 1, tenantIndex: 1 },
  { name: 'Đồ uống đặc biệt', slug: 'do-uong-dac-biet', description: 'Trà, sinh tố, thức uống theo mùa', icon: '🧋', sortOrder: 2, tenantIndex: 1 },
  { name: 'Bánh ngọt - Snack', slug: 'banh-ngot-snack', description: 'Bánh ngọt, bánh mì, snack đi kèm', icon: '🥐', sortOrder: 3, tenantIndex: 1 },
  { name: 'Dụng cụ tập Gym', slug: 'dung-cu-tap-gym', description: 'Tạ, dây kháng lực, thảm tập', icon: '🏋️', sortOrder: 1, tenantIndex: 2 },
  { name: 'Thực phẩm bổ sung', slug: 'thuc-pham-bo-sung', description: 'Whey, vitamin, amino acid', icon: '💊', sortOrder: 2, tenantIndex: 2 },
  { name: 'Dịch vụ tập luyện', slug: 'dich-vu-tap-luyen', description: 'PT cá nhân, lớp Yoga, GroupX', icon: '🧘', sortOrder: 3, tenantIndex: 2 },
];

export const PRODUCTS: ProductSeed[] = [
  { name: 'Điện thoại thông minh XYZ', slug: 'dien-thoai-xyz', price: 5990000, compareAtPrice: 6990000, costPrice: 4500000, unit: 'cái', stock: 50, sku: 'DT-001', categorySlug: 'dien-tu-dien-may', tenantIndex: 0 },
  { name: 'Áo thun nam cao cấp', slug: 'ao-thun-nam', price: 299000, compareAtPrice: 399000, costPrice: 120000, unit: 'cái', stock: 200, sku: 'TT-001', categorySlug: 'thoi-trang-phu-kien', tenantIndex: 0 },
  { name: 'Túi xách nữ thời trang', slug: 'tui-xach-nu', price: 899000, costPrice: 350000, unit: 'cái', stock: 30, sku: 'PK-001', categorySlug: 'thoi-trang-phu-kien', tenantIndex: 0 },
  { name: 'Bộ chén sứ cao cấp', slug: 'bo-chen-su', price: 450000, costPrice: 180000, unit: 'bộ', stock: 80, sku: 'GD-001', categorySlug: 'do-gia-dung', tenantIndex: 0 },
  { name: 'Cà phê sữa đá', slug: 'ca-phe-sua-da', price: 35000, costPrice: 12000, unit: 'ly', stock: 999, sku: 'CF-001', categorySlug: 'do-uong-dac-biet', tenantIndex: 1 },
  { name: 'Bạc xỉu nóng', slug: 'bac-xiu-nong', price: 25000, costPrice: 8000, unit: 'ly', stock: 999, sku: 'CF-002', categorySlug: 'do-uong-dac-biet', tenantIndex: 1 },
  { name: 'Trà đào cam sả', slug: 'tra-dao-cam-sa', price: 45000, costPrice: 15000, unit: 'ly', stock: 999, sku: 'TS-001', categorySlug: 'do-uong-dac-biet', tenantIndex: 1 },
  { name: 'Bánh mì que pate', slug: 'banh-mi-que-pate', price: 15000, costPrice: 6000, unit: 'cái', stock: 100, sku: 'SN-001', categorySlug: 'banh-ngot-snack', tenantIndex: 1 },
  { name: 'Croissant bơ', slug: 'croissant-bo', price: 25000, costPrice: 10000, unit: 'cái', stock: 50, sku: 'SN-002', categorySlug: 'banh-ngot-snack', tenantIndex: 1 },
  { name: 'Cà phê hạt Robusta 500g', slug: 'ca-phe-robusta', price: 120000, costPrice: 70000, unit: 'gói', stock: 200, sku: 'CH-001', categorySlug: 'ca-phe-hat', tenantIndex: 1 },
  { name: 'Cà phê hạt Arabica 500g', slug: 'ca-phe-arabica', price: 180000, costPrice: 100000, unit: 'gói', stock: 150, sku: 'CH-002', categorySlug: 'ca-phe-hat', tenantIndex: 1 },
  { name: 'Bộ tạ tay 20kg', slug: 'bo-ta-tay-20kg', price: 1500000, compareAtPrice: 2000000, costPrice: 800000, unit: 'bộ', stock: 20, sku: 'GYM-001', categorySlug: 'dung-cu-tap-gym', tenantIndex: 2 },
  { name: 'Thảm tập Yoga cao cấp', slug: 'tham-tap-yoga', price: 450000, costPrice: 200000, unit: 'cái', stock: 50, sku: 'GYM-002', categorySlug: 'dung-cu-tap-gym', tenantIndex: 2 },
  { name: 'Whey Protein Vanilla 2kg', slug: 'whey-protein-vanilla', price: 1250000, compareAtPrice: 1500000, costPrice: 700000, unit: 'hũ', stock: 30, sku: 'BS-001', categorySlug: 'thuc-pham-bo-sung', tenantIndex: 2 },
  { name: 'BCAA viên 500mg', slug: 'bcaa-vien', price: 350000, costPrice: 150000, unit: 'lọ', stock: 100, sku: 'BS-002', categorySlug: 'thuc-pham-bo-sung', tenantIndex: 2 },
  { name: 'Gói tập Personal Training 10 buổi', slug: 'pt-10-buoi', price: 5000000, costPrice: 2000000, unit: 'gói', stock: 200, sku: 'DV-001', categorySlug: 'dich-vu-tap-luyen', tenantIndex: 2 },
  { name: 'Lớp Yoga Group 1 tháng', slug: 'yoga-group-1thang', price: 1200000, costPrice: 400000, unit: 'tháng', stock: 100, sku: 'DV-002', categorySlug: 'dich-vu-tap-luyen', tenantIndex: 2 },
  { name: 'Sữa rửa mặt hữu cơ', slug: 'sua-rua-mat-huu-co', price: 185000, costPrice: 80000, unit: 'chai', stock: 120, sku: 'SK-001', categorySlug: 'dien-tu-dien-may', tenantIndex: 0 },
  { name: 'Sinh tố bơ', slug: 'sinh-to-bo', price: 45000, costPrice: 18000, unit: 'ly', stock: 999, sku: 'TS-002', categorySlug: 'do-uong-dac-biet', tenantIndex: 1 },
  { name: 'Dây kháng lực', slug: 'day-khang-luc', price: 180000, costPrice: 70000, unit: 'bộ', stock: 60, sku: 'GYM-003', categorySlug: 'dung-cu-tap-gym', tenantIndex: 2 },
];

export const REWARDS: RewardSeed[] = [
  { name: 'Voucher 50,000đ', description: 'Voucher mua hàng giảm 50,000đ', type: 'voucher', pointsRequired: 2500, quantity: 200, imageUrl: '/rewards/voucher-50k.png', tenantIndex: 0 },
  { name: 'Voucher 100,000đ', description: 'Voucher mua hàng giảm 100,000đ', type: 'voucher', pointsRequired: 5000, quantity: 100, imageUrl: '/rewards/voucher-100k.png', tenantIndex: 0 },
  { name: 'Túi vải thân thiện', description: 'Túi vải canvas tái sử dụng', type: 'gift', pointsRequired: 1500, quantity: 300, imageUrl: '/rewards/tui-vai.png', tenantIndex: 0 },
  { name: 'Cà phê miễn phí', description: '1 ly cà phê bất kỳ', type: 'gift', pointsRequired: 1000, quantity: 500, imageUrl: '/rewards/cafe-free.png', tenantIndex: 1 },
  { name: 'Bánh ngọt tặng kèm', description: '1 phần bánh ngọt tự chọn', type: 'gift', pointsRequired: 2000, quantity: 200, imageUrl: '/rewards/banh-ngot.png', tenantIndex: 1 },
  { name: 'Áo tập Fitness Pro', description: 'Áo thun tập gym bản giới hạn', type: 'gift', pointsRequired: 8000, quantity: 100, imageUrl: '/rewards/ao-tap.png', tenantIndex: 2 },
  { name: 'Buổi tập PT miễn phí', description: '1 buổi tập với Personal Trainer', type: 'voucher', pointsRequired: 5000, quantity: 50, imageUrl: '/rewards/pt-free.png', tenantIndex: 2 },
  { name: 'Bình nước giữ nhiệt', description: 'Bình nữ giữ nhiệt cao cấp', type: 'gift', pointsRequired: 3000, quantity: 150, imageUrl: '/rewards/binh-nuoc.png', tenantIndex: 2 },
];

export const NOTIFICATION_TEMPLATES: NotificationTemplateSeed[] = [
  { name: 'Chào mừng thành viên mới', type: 'email', subject: 'Chào mừng {{name}} đến với {{tenant}}!', content: 'Chào {{name}},\n\nCảm ơn bạn đã đăng ký thành viên tại {{tenant}}!\nBạn đã được tặng {{points}} điểm thưởng chào mừng.\n\nHãy bắt đầu tích lũy điểm ngay hôm nay!\n\nTrân trọng,\nĐội ngũ {{tenant}}', variables: 'name,tenant,points', tenantIndex: 0 },
  { name: 'SMS thông báo điểm', type: 'sms', subject: null, content: '{{tenant}}: Bạn vừa tích lũy {{points}} điểm. Tổng điểm hiện tại: {{total}}.', variables: 'tenant,points,total', tenantIndex: 0 },
  { name: 'Khuyến mãi đặc biệt', type: 'email', subject: 'Ưu đãi đặc biệt dành riêng cho bạn!', content: 'Chào {{name}},\n\nChúng tôi có ưu đãi đặc biệt dành riêng cho thành viên thân thiết:\n{{promotion}}\n\nNhanh tay đổi ưu đãi trước khi hết hạn!\n\n{{tenant}}', variables: 'name,promotion,tenant', tenantIndex: 1 },
  { name: 'Thông báo tích điểm', type: 'push', subject: 'Điểm thưởng mới!', content: 'Bạn vừa nhận {{points}} điểm từ giao dịch tại {{store}}.', variables: 'points,store', tenantIndex: 2 },
  { name: 'Nhắc nhở điểm sắp hết hạn', type: 'email', subject: 'Điểm thưởng của bạn sắp hết hạn!', content: 'Chào {{name}},\n\nBạn có {{points}} điểm sắp hết hạn vào ngày {{expiryDate}}.\nHãy nhanh tay đổi quà trước khi mất điểm!\n\n{{tenant}}', variables: 'name,points,expiryDate,tenant', tenantIndex: 1 },
];

export const COUPONS: CouponSeed[] = [
  { code: 'WELCOME10', type: 'PERCENTAGE', value: 10, minAmount: 50000, maxDiscount: 50000, maxUsage: 1000, maxUsagePerMember: 1, description: 'Giảm 10% cho đơn hàng đầu tiên (tối đa 50,000đ)', status: 'ACTIVE', tenantIndex: 0 },
  { code: 'THX50K', type: 'FIXED', value: 50000, minAmount: 200000, maxUsage: 500, maxUsagePerMember: 2, description: 'Giảm 50,000đ cho đơn hàng từ 200,000đ', status: 'ACTIVE', tenantIndex: 0 },
  { code: 'CSG20', type: 'PERCENTAGE', value: 20, minAmount: 100000, maxDiscount: 100000, maxUsage: 300, maxUsagePerMember: 1, description: 'Giảm 20% tại Cafe Sài Gòn (tối đa 100,000đ)', status: 'ACTIVE', tenantIndex: 1 },
  { code: 'CSG-FREE', type: 'FIXED', value: 35000, minAmount: 100000, maxUsage: 200, maxUsagePerMember: 1, description: 'Tặng 1 ly cà phê bất kỳ', status: 'ACTIVE', tenantIndex: 1 },
  { code: 'FP-SUMMER', type: 'PERCENTAGE', value: 25, minAmount: 5000000, maxDiscount: 2000000, maxUsage: 100, maxUsagePerMember: 1, description: 'Giảm 25% gói tập mùa hè (tối đa 2,000,000đ)', startDate: new Date('2026-07-01'), endDate: new Date('2026-09-30'), status: 'ACTIVE', tenantIndex: 2 },
  { code: 'FP-FRIEND', type: 'PERCENTAGE', value: 15, minAmount: 1000000, maxDiscount: 500000, maxUsage: 200, maxUsagePerMember: 3, description: 'Giảm 15% cho bạn bè giới thiệu (tối đa 500,000đ)', status: 'ACTIVE', tenantIndex: 2 },
];

export const POINT_EARNING_RULES: PointEarningRuleSeed[] = [
  { name: 'Tích điểm tiêu chuẩn', description: '1 điểm cho mỗi 1,000đ', pointsPerUnit: 0.001, minAmount: 0, category: null, status: 'ACTIVE', tenantIndex: 0 },
  { name: 'Tích điểm sản phẩm xanh', description: '2 điểm cho mỗi 1,000đ sản phẩm xanh', pointsPerUnit: 0.002, minAmount: 0, category: 'san-pham-xanh', status: 'ACTIVE', tenantIndex: 0 },
  { name: 'Tích điểm Cafe Sài Gòn', description: '1 điểm cho mỗi 1,000đ', pointsPerUnit: 0.001, minAmount: 0, category: null, status: 'ACTIVE', tenantIndex: 1 },
  { name: 'Tích điểm gói tập', description: '10 điểm cho mỗi 1,000đ gói tập', pointsPerUnit: 0.01, minAmount: 1000000, category: 'goi-tap', status: 'ACTIVE', tenantIndex: 2 },
  { name: 'Tích điểm thực phẩm bổ sung', description: '3 điểm cho mỗi 1,000đ', pointsPerUnit: 0.003, minAmount: 0, category: null, status: 'ACTIVE', tenantIndex: 2 },
];

export const WEBHOOK_ENDPOINTS: WebhookEndpointSeed[] = [
  { name: 'Thương Hiệu Xanh Webhook', url: 'https://hook.thuonghieuxanh.vn/loyalty', events: ['point.earned', 'member.created'], active: true, tenantIndex: 0 },
  { name: 'Cafe Sài Gòn POS Sync', url: 'https://pos.cafesaigon.vn/webhook/loyalty', events: ['point.earned', 'point.burned', 'member.updated'], active: true, tenantIndex: 1 },
  { name: 'Fitness Pro Integration', url: 'https://api.fitnesspro.vn/webhooks/loyalty', events: ['point.earned', 'member.created', 'voucher.redeemed', 'member.tier.changed'], active: true, tenantIndex: 2 },
];

export const STAFF: StaffSeed[] = [
  { storeCode: 'THX-LL-001', name: 'Nguyễn Thị Mai', phone: '0909000111', pinCode: '1234' },
  { storeCode: 'THX-LL-001', name: 'Trần Văn Phúc', phone: '0909000112', pinCode: '5678' },
  { storeCode: 'THX-NH-002', name: 'Lê Thị Hồng', phone: '0909000113', pinCode: '9012' },
  { storeCode: 'THX-PN-003', name: 'Phạm Văn Tín', phone: '0909000114', pinCode: '3456' },
  { storeCode: 'THX-TB-004', name: 'Hoàng Thị Thúy', phone: '0909000115', pinCode: '7890' },
  { storeCode: 'CSG-NH-001', name: 'Nguyễn Văn Hoàng', phone: '0909000221', pinCode: '1111' },
  { storeCode: 'CSG-LL-002', name: 'Trần Thị Nga', phone: '0909000222', pinCode: '2222' },
  { storeCode: 'CSG-HBT-003', name: 'Lê Văn Phát', phone: '0909000223', pinCode: '3333' },
  { storeCode: 'CSG-BT-004', name: 'Phạm Thị Quyên', phone: '0909000224', pinCode: '4444' },
  { storeCode: 'CSG-PMH-005', name: 'Đặng Văn Sang', phone: '0909000225', pinCode: '5555' },
  { storeCode: 'CSG-TD-006', name: 'Bùi Thị An', phone: '0909000226', pinCode: '6666' },
  { storeCode: 'FP-LH-001', name: 'Nguyễn Văn Lực', phone: '0909000331', pinCode: '7101' },
  { storeCode: 'FP-HK-002', name: 'Trần Thị Khỏe', phone: '0909000332', pinCode: '7102' },
  { storeCode: 'FP-CG-003', name: 'Lê Văn Cường', phone: '0909000333', pinCode: '7103' },
  { storeCode: 'FP-HD-004', name: 'Phạm Thị Mạnh', phone: '0909000334', pinCode: '7104' },
];

// =============================================================================
// TYPES
// =============================================================================

export interface TenantSeed {
  name: string;
  domain: string;
  subdomain: string;
  email: string;
  phone: string;
  address: string;
  logo: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'DISABLED';
  subscription: {
    plan: 'FREE' | 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
    status: 'TRIAL' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'SUSPENDED';
    maxMembers: number;
    maxCampaigns: number;
    maxRewards: number;
    maxTiers: number;
    maxVouchers: number;
    maxStores: number;
    features: Record<string, boolean>;
  };
  admin: { email: string; password: string; fullName: string; phone: string; role: 'HOST' | 'ADMIN' | 'STAFF' | 'MEMBER' };
}

export interface TierTemplate {
  name: string;
  minPoints: number;
  maxPoints: number;
  pointsMultiplier: number;
  benefits: string;
  color: string;
}

export interface MemberSeed {
  fullName: string;
  email: string;
  phone: string;
  status: 'ACTIVE' | 'INACTIVE' | 'LOCKED' | 'PENDING_KYC';
  totalPoints: number;
  tierName: string;
  memberOf: number; // tenant index
}

export interface StoreSeed {
  name: string;
  code: string;
  address: string;
  phone: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE' | 'CLOSED';
  openingHours: Record<string, string>;
  tenantIndex: number;
}

export interface CampaignSeed {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ENDED';
  budget: number;
  tenantIndex: number;
}

export interface VoucherTemplate {
  codePrefix: string;
  type: 'discount' | 'cashback' | 'gift';
  value: number;
  maxUsage: number;
  expiresInDays: number;
  count: number;
  tenantIndex: number;
}

export interface PromotionSeed {
  name: string;
  description: string;
  priority: number;
  status: 'ACTIVE' | 'PAUSED' | 'ENDED' | 'SCHEDULED';
  conditions: Record<string, unknown>;
  actions: Record<string, unknown>;
  tenantIndex: number;
}

export interface BadgeSeed {
  name: string;
  description: string;
  iconUrl: string;
  criteria: Record<string, unknown>;
  tenantIndex: number;
}

export interface MissionSeed {
  name: string;
  description: string;
  pointsReward: number;
  criteria: Record<string, unknown>;
  startOffsetDays: number;
  endOffsetDays: number;
  tenantIndex: number;
}

export interface FeedbackSeed {
  memberIndex: number;
  entityType: string;
  rating: number;
  content: string;
  status: 'PUBLISHED' | 'PENDING' | 'HIDDEN';
}

export interface GiftCardSeed {
  code: string;
  initialValue: number;
  balance: number;
  type: 'physical' | 'digital';
  status: 'ACTIVE' | 'EXPIRED' | 'REDEEMED' | 'DISABLED';
  expiresAt: Date;
  tenantIndex: number;
}

export interface CashbackConfigSeed {
  name: string;
  description: string;
  rate: number;
  minAmount: number;
  maxAmount: number;
  minPointsBalance?: number;
  startDate?: Date;
  endDate?: Date;
  status: string;
  tenantIndex: number;
}

export interface PartnerBrandSeed {
  name: string;
  code: string;
  description: string;
  website: string;
  contactEmail: string;
  commissionRate: number;
  tenantIndex: number;
}

export interface PartnerRewardSeed {
  brandIndex: number;
  name: string;
  description: string;
  type: string;
  value: number;
  pointsRequired: number;
  quantity: number;
  tenantIndex: number;
}

export interface CategorySeed {
  name: string;
  slug: string;
  description: string;
  icon: string;
  sortOrder: number;
  tenantIndex: number;
}

export interface ProductSeed {
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  unit: string;
  stock: number;
  sku: string;
  categorySlug?: string;
  tenantIndex: number;
}

export interface RewardSeed {
  name: string;
  description: string;
  type: string;
  pointsRequired: number;
  quantity: number;
  imageUrl?: string;
  tenantIndex: number;
}

export interface NotificationTemplateSeed {
  name: string;
  type: string;
  subject: string | null;
  content: string;
  variables: string;
  tenantIndex: number;
}

export interface CouponSeed {
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  minAmount: number;
  maxDiscount?: number;
  maxUsage: number;
  maxUsagePerMember: number;
  description: string;
  startDate?: Date;
  endDate?: Date;
  status: 'ACTIVE' | 'DISABLED' | 'EXPIRED';
  tenantIndex: number;
}

export interface PointEarningRuleSeed {
  name: string;
  description: string;
  pointsPerUnit: number;
  minAmount: number;
  category: string | null;
  status: string;
  tenantIndex: number;
}

export interface WebhookEndpointSeed {
  name: string;
  url: string;
  events: string[];
  active: boolean;
  tenantIndex: number;
}

export interface StaffSeed {
  storeCode: string;
  name: string;
  phone: string;
  pinCode: string;
}
