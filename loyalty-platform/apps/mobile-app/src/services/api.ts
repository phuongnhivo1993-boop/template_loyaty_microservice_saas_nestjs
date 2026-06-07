import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: any) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
        if (!refreshToken) throw new Error('No refresh token');
        const res = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        const { accessToken, refreshToken: newRefresh } = res.data;
        await SecureStore.setItemAsync(TOKEN_KEY, accessToken);
        if (newRefresh) await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, newRefresh);
        processQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

export const auth = {
  login: (data: { email: string; password: string; role: 'host' | 'tenant' | 'member' }) =>
    api.post(`/auth/${data.role}/login`, data),
  memberLogin: (data: { email: string; password: string; tenantDomain: string }) =>
    api.post('/auth/member/login', { email: data.email, password: data.password, tenantDomain: data.tenantDomain }),
  logout: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  },
  forgotPassword: (data: { email: string }) => api.post('/auth/forgot-password', data),
  resetPassword: (data: { token: string; newPassword: string }) => api.post('/auth/reset-password', data),
};

export const members = {
  register: (data: { email: string; fullName: string; phone?: string; tenantDomain: string }) =>
    api.post('/members/register', data),
  getProfile: () => api.get('/me/profile'),
  getWallet: () => api.get('/me/wallet'),
  getBadges: () => api.get('/me/badges'),
  getVouchers: () => api.get('/me/vouchers'),
  getReferrals: () => api.get('/me/referrals'),
  getMissions: () => api.get('/me/missions'),
  getTransactions: (params?: { page?: number; limit?: number; type?: string }) =>
    api.get('/me/transactions', { params }),
  setPassword: (data: { password: string; token: string }) => api.post('/me/set-password', data),
  changePassword: (data: { oldPassword: string; newPassword: string }) => api.post('/me/change-password', data),
  updateProfile: (data: { fullName?: string; phone?: string; avatar?: string }) =>
    api.patch('/me/profile', data),
};

export const rewards = {
  list: (params?: { type?: string }) => api.get('/rewards', { params }),
  getById: (id: string) => api.get(`/rewards/${id}`),
  redeem: (rewardId: string, data: { memberId: string; quantity?: number }) =>
    api.post(`/rewards/${rewardId}/redeem`, data),
};

export const vouchers = {
  redeemInStore: (id: string) => api.post(`/vouchers/${id}/redeem`),
  validate: (code: string) => api.post('/vouchers/validate', { code }),
};

export const notifications = {
  list: () => api.get('/me/notifications'),
};

export const checkin = {
  do: () => api.post('/checkin'),
  stats: () => api.get('/checkin/stats'),
  history: () => api.get('/checkin/history'),
};

export const cashback = {
  getBalance: (memberId: string) => api.get(`/cashback/balance/${memberId}`),
  getTransactions: (memberId: string) => api.get(`/cashback/transactions/${memberId}`),
};

export const giftCards = {
  list: (memberId: string) => api.get(`/gift-cards/${memberId}`),
};

export const stores = {
  list: () => api.get('/stores'),
};

export const feedback = {
  create: (data: { entityType?: string; entityId?: string; rating: number; comment?: string }) =>
    api.post('/feedback', data),
  list: () => api.get('/me/feedback'),
  getPublic: (entityType: string, entityId: string) => api.get(`/feedback/${entityType}/${entityId}`),
};

export const orders = {
  create: (data: { items: { productId: string; quantity: number }[]; storeId?: string; couponCode?: string; pointsUsed?: number }) =>
    api.post('/orders', data),
  list: (params?: { status?: string; page?: number; limit?: number }) =>
    api.get('/me/orders', { params }),
  getById: (id: string) => api.get(`/orders/${id}`),
  cancel: (id: string, data?: { cancelReason?: string }) =>
    api.put(`/orders/${id}/cancel`, data),
};

export const products = {
  list: (params?: { search?: string; categoryId?: string; page?: number; limit?: number }) =>
    api.get('/products', { params }),
  getById: (id: string) => api.get(`/products/${id}`),
};

export const analytics = {
  leaderboard: (limit = 10) => api.get('/analytics/leaderboard', { params: { limit } }),
};

export const cartRedeem = (items: { rewardId: string; quantity: number }[]) =>
  api.post('/me/cart-redeem', { items });

export default api;
