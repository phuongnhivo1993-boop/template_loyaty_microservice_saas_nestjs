const API_BASE = '/api';

async function fetchAPI(path: string, options?: RequestInit) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
    ...options,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || `Error: ${res.status}`);
  return json.data ?? json;
}

export const api = {
  get: (path: string) => fetchAPI(path),
  post: (path: string, data?: any) =>
    fetchAPI(path, { method: 'POST', body: data ? JSON.stringify(data) : undefined }),
  patch: (path: string, data: any) =>
    fetchAPI(path, { method: 'PATCH', body: JSON.stringify(data) }),
};

// Auth
export const memberLogin = (email: string, password: string) =>
  api.post('/auth/member/login', { email, password });
export const memberRegister = (data: { email: string; fullName: string; phone?: string; password: string; tenantDomain?: string }) =>
  api.post('/members/register', data);
export const forgotPassword = (email: string) =>
  api.post('/auth/forgot-password', { email });
export const resetPassword = (token: string, newPassword: string) =>
  api.post('/auth/reset-password', { token, newPassword });

// Profile
export const getProfile = () => api.get('/me/profile');
export const updateProfile = (data: { fullName?: string; phone?: string }) =>
  api.patch('/me/profile', data);
export const changePassword = (oldPassword: string, newPassword: string) =>
  api.post('/me/change-password', { oldPassword, newPassword });

// Wallet
export const getWallet = () => api.get('/me/wallet');
export const getTransactions = (params?: { page?: number; limit?: number; type?: string }) => {
  const q = new URLSearchParams();
  if (params?.page) q.set('page', String(params.page));
  if (params?.limit) q.set('limit', String(params.limit));
  if (params?.type) q.set('type', params.type);
  const s = q.toString();
  return api.get(`/me/transactions${s ? `?${s}` : ''}`);
};

// Vouchers
export const getMyVouchers = () => api.get('/me/vouchers');
export const redeemVoucher = (id: string) => api.post(`/member-vouchers/${id}/redeem`);

// Orders
export const getMyOrders = (params?: { page?: number; limit?: number }) => {
  const q = new URLSearchParams();
  if (params?.page) q.set('page', String(params.page));
  if (params?.limit) q.set('limit', String(params.limit));
  const s = q.toString();
  return api.get(`/orders/member/me${s ? `?${s}` : ''}`);
};
export const cancelOrder = (id: string, reason?: string) => api.post(`/orders/${id}/cancel`, { reason });

// Check-in
export const getCheckinStatus = () => api.get('/checkin/stats');
export const doCheckin = () => api.post('/checkin');

// Referrals (returns { referralCode, referrals, stats })
export const getReferrals = () => api.get('/me/referrals');

// Tier Progress
export const getTierProgress = () => api.get('/me/tier-progress');

// Badges & Missions
export const getBadges = () => api.get('/me/badges');
export const getMissions = () => api.get('/me/missions');

// Notifications
export const getNotifications = () => api.get('/me/notifications');
export const markNotificationRead = (id: string) => api.patch(`/me/notifications/${id}/read`, {});

// Stores
export const getStores = (params?: any) => api.get('/stores');

// Feedback
export const getMyFeedback = () => api.get('/me/feedback');
export const submitFeedback = (data: { rating: number; comment?: string }) =>
  api.post('/me/feedback', data);

// Rewards
export const getRewards = () => api.get('/rewards');
export const getReward = (id: string) => api.get(`/rewards/${id}`);
export const redeemReward = (id: string, quantity?: number) =>
  api.post(`/rewards/${id}/redeem`, { quantity });

// Gift Cards
export const getMyGiftCards = () => api.get('/me/gift-cards');

// Cashback
export const getMyCashback = () => api.get('/me/cashback');
export const getCashbackTransactions = (params?: { page?: number; limit?: number; type?: string }) => {
  const q = new URLSearchParams();
  if (params?.page) q.set('page', String(params.page));
  if (params?.limit) q.set('limit', String(params.limit));
  if (params?.type) q.set('type', params.type);
  const s = q.toString();
  return api.get(`/me/cashback/transactions${s ? `?${s}` : ''}`);
};

// Upload
export const uploadFile = (file: File) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const formData = new FormData();
  formData.append('file', file);
  return fetch('/api/upload', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  }).then(async (res) => {
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || `Error: ${res.status}`);
    return json.data ?? json;
  });
};

// Products
export const getProducts = (params?: { page?: number; limit?: number; search?: string }) => {
  const q = new URLSearchParams();
  if (params?.page) q.set('page', String(params.page));
  if (params?.limit) q.set('limit', String(params.limit));
  if (params?.search) q.set('search', params.search);
  const s = q.toString();
  return api.get(`/products${s ? `?${s}` : ''}`);
};

export const createOrder = (data: { items: { productId: string; quantity: number }[]; note?: string }) =>
  api.post('/orders/member', data);
