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
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// Auth
export const login = (email: string, password: string) =>
  fetchAPI('/auth/host/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

// Tenants
export const getTenants = () => fetchAPI('/tenants');
export const getTenant = (id: string) => fetchAPI(`/tenants/${id}`);
export const createTenant = (data: any) =>
  fetchAPI('/tenants', { method: 'POST', body: JSON.stringify(data) });
export const updateTenant = (id: string, data: any) =>
  fetchAPI(`/tenants/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteTenant = (id: string) =>
  fetchAPI(`/tenants/${id}`, { method: 'DELETE' });

// Members
export const getMembers = () => fetchAPI('/members');
export const getMember = (id: string) => fetchAPI(`/members/${id}`);

// Campaigns
export const getCampaigns = () => fetchAPI('/campaigns');

// Rewards
export const getRewards = () => fetchAPI('/rewards');

// Vouchers
export const getVouchers = () => fetchAPI('/vouchers');

// Promotions
export const getPromotions = () => fetchAPI('/promotions');

// Users
export const getUsers = () => fetchAPI('/users');

// Analytics
export const getDashboard = () => fetchAPI('/analytics/dashboard');
