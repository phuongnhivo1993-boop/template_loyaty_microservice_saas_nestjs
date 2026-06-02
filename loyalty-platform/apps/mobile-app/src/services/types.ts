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

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Home: undefined;
  Wallet: undefined;
  Rewards: undefined;
  RewardDetail: { id: string };
  Referrals: undefined;
  Badges: undefined;
  Vouchers: undefined;
  Missions: undefined;
  Password: undefined;
  Profile: undefined;
  ResetPassword: undefined;
  Notifications: undefined;
  Checkin: undefined;
};
