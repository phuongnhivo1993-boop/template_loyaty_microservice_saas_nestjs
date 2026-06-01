import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';
const API_URL = 'http://localhost:3001/api/v1';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const auth = {
  login: (data: { email: string; password: string; role: 'host' | 'tenant' | 'member' }) =>
    api.post(`/auth/${data.role}/login`, data),
  memberLogin: (data: { email: string; password: string; tenantDomain: string }) =>
    api.post('/auth/member/login', { email: data.email, password: data.password, tenantDomain: data.tenantDomain }),
};

export const members = {
  register: (data: { email: string; fullName: string; phone?: string; tenantDomain: string }) =>
    api.post('/members/register', data),
  getProfile: () => api.get('/me/profile'),
  getWallet: () => api.get('/me/wallet'),
  getBadges: () => api.get('/me/badges'),
  getVouchers: () => api.get('/me/vouchers'),
  getReferrals: () => api.get('/me/referrals'),
  setPassword: (data: { password: string; token: string }) => api.post('/me/set-password', data),
  changePassword: (data: { oldPassword: string; newPassword: string }) => api.post('/me/change-password', data),
};

export const rewards = {
  list: () => api.get('/rewards'),
  redeem: (rewardId: string, data: { memberId: string; quantity?: number }) =>
    api.post(`/rewards/${rewardId}/redeem`, data),
};

export default api;
