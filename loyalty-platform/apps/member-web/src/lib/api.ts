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

// Orders
export const getMyOrders = (params?: { page?: number; limit?: number }) => {
  const q = new URLSearchParams();
  if (params?.page) q.set('page', String(params.page));
  if (params?.limit) q.set('limit', String(params.limit));
  const s = q.toString();
  return api.get(`/orders/member/me${s ? `?${s}` : ''}`);
};

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
