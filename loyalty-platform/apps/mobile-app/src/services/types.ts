export interface Member {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  status: string;
  kycVerified: boolean;
  totalPoints: number;
  availablePoints: number;
  tenantId: string;
  tierId?: string;
  tier?: Tier;
  createdAt: string;
  updatedAt: string;
}

export interface Tier {
  id: string;
  name: string;
  minPoints: number;
  maxPoints: number;
  benefits?: string;
  color?: string;
}

export interface Wallet {
  available: number;
  total: number;
  memberId: string;
}

export interface PointTransaction {
  id: string;
  memberId: string;
  type: 'EARN' | 'BURN' | 'EXPIRE' | 'ADJUST';
  amount: number;
  balance: number;
  reason?: string;
  createdAt: string;
}

export interface Reward {
  id: string;
  name: string;
  description?: string;
  type: string;
  pointsRequired: number;
  quantity: number;
  imageUrl?: string;
}

export interface Voucher {
  id: string;
  code: string;
  type: string;
  value: number;
  maxUsage?: number;
  usedCount: number;
  expiresAt?: string;
}

export interface MemberVoucher {
  id: string;
  memberId: string;
  voucherId: string;
  voucher: Voucher;
  redeemed: boolean;
  redeemedAt?: string;
  createdAt: string;
}

export interface Referral {
  id: string;
  code: string;
  referrerId: string;
  refereeId?: string;
  status: 'PENDING' | 'CONVERTED' | 'REWARDED';
  rewardGiven: boolean;
  createdAt: string;
  referrer?: Member;
  referee?: Member;
}

export interface ReferralStats {
  total: number;
  converted: number;
  rate: string;
}

export interface Badge {
  id: string;
  name: string;
  description?: string;
  iconUrl?: string;
  criteria?: any;
}

export interface Mission {
  id: string;
  name: string;
  description?: string;
  pointsReward: number;
  criteria?: any;
  startDate?: string;
  endDate?: string;
}

export interface DailyCheckin {
  id: string;
  memberId: string;
  date: string;
  streak: number;
  pointsAwarded: number;
}

export interface CheckinStats {
  currentStreak: number;
  totalCheckins: number;
  longestStreak: number;
  checkedInToday: boolean;
}

export interface AuthState {
  token: string | null;
  profile: Member | null;
  setToken: (token: string) => void;
  setProfile: (profile: Member) => void;
  logout: () => void;
}

export interface CashbackBalance {
  memberId: string;
  balance: number;
  currency: string;
}

export interface CashbackTransaction {
  id: string;
  memberId: string;
  type: 'EARN' | 'BURN';
  amount: number;
  balance: number;
  reason?: string;
  createdAt: string;
}

export interface GiftCard {
  id: string;
  name: string;
  code: string;
  type: 'PHYSICAL' | 'DIGITAL';
  balance: number;
  initialValue: number;
  currency: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REDEEMED' | 'DISABLED';
  expiresAt?: string;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  phone?: string;
  lat?: number;
  lng?: number;
  hours?: string;
}

export interface Feedback {
  id: string;
  memberId?: string;
  memberName?: string;
  entityType?: string;
  entityId?: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId?: string;
  categoryName?: string;
  imageUrl?: string;
  stock: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  orderCode: string;
  memberId: string;
  memberName?: string;
  items: OrderItem[];
  total: number;
  pointsEarned?: number;
  pointsUsed?: number;
  couponCode?: string;
  discount?: number;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  cancelReason?: string;
  storeId?: string;
  storeName?: string;
  createdAt: string;
  updatedAt: string;
}

export type WsConnectionStatus = 'connected' | 'reconnecting' | 'disconnected';

export interface WsState {
  socket: any | null;
  status: WsConnectionStatus;
  lastEvent: string | null;
  connect: (token: string) => void;
  disconnect: () => void;
}

export type RootStackParamList = {
  StoreDetail: { store: Store };
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Main: undefined;
  Home: undefined;
  Wallet: undefined;
  Rewards: undefined;
  RewardDetail: { id: string };
  Referrals: undefined;
  Badges: undefined;
  Vouchers: undefined;
  VoucherDetail: { voucher: MemberVoucher };
  Missions: undefined;
  Password: undefined;
  Profile: undefined;
  ResetPassword: undefined;
  Notifications: undefined;
  Checkin: undefined;
  PointsHistory: undefined;
  TransactionDetail: { transaction: PointTransaction };
  MembershipCard: undefined;
  TierProgress: undefined;
  KYCUpload: undefined;
  Settings: undefined;
  Cashback: undefined;
  Stores: undefined;
  Feedback: undefined;
  QRScanner: undefined;
  CreateOrder: undefined;
  CancelOrder: { orderId: string };
  Orders: undefined;
  OrderDetail: { orderId: string };
};
