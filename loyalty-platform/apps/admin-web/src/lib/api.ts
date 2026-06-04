const API_BASE = '/api';

function buildQuery(params?: Record<string, string | number | boolean | undefined | null>) {
  if (!params) return '';
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') q.set(k, String(v));
  });
  const s = q.toString();
  return s ? `?${s}` : '';
}

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
  if (!res.ok) throw new Error(json.message || `API error: ${res.status}`);
  return json;
}

function unwrapResponse<T>(response: any): T {
  if (response && typeof response === 'object' && 'success' in response) {
    return response.data ?? response;
  }
  return response;
}

function unwrapPagination(response: any) {
  const data = unwrapResponse(response);
  const pagination = response?.pagination || {};
  return {
    data: Array.isArray(data) ? data : [],
    total: pagination.totalItems ?? 0,
    totalPages: pagination.totalPages ?? 1,
    page: pagination.page ?? 1,
  };
}

type ListParams = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  [key: string]: string | number | boolean | undefined | null;
};

function fetchList(endpoint: string, params?: ListParams) {
  return fetchAPI(`${endpoint}${buildQuery(params)}`).then(unwrapPagination);
}

// Auth
export const login = (email: string, password: string) =>
  fetchAPI('/auth/host/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const refreshToken = () =>
  fetchAPI('/auth/host/refresh', { method: 'POST' });

// Tenants
export const getTenants = (params?: ListParams) => fetchList('/tenants', params);
export const getTenant = (id: string) => fetchAPI(`/tenants/${id}`).then(unwrapResponse);
export const createTenant = (data: any) =>
  fetchAPI('/tenants', { method: 'POST', body: JSON.stringify(data) }).then(unwrapResponse);
export const updateTenant = (id: string, data: any) =>
  fetchAPI(`/tenants/${id}`, { method: 'PUT', body: JSON.stringify(data) }).then(unwrapResponse);
export const deleteTenant = (id: string) =>
  fetchAPI(`/tenants/${id}`, { method: 'DELETE' }).then(unwrapResponse);

export const api = {
  get: (path: string) => fetchAPI(path).then(unwrapResponse),
  getList: (path: string, params?: ListParams) => fetchList(path, params),
  create: (path: string, data: any) =>
    fetchAPI(path, { method: 'POST', body: JSON.stringify(data) }).then(unwrapResponse),
  update: (path: string, data: any) =>
    fetchAPI(path, { method: 'PUT', body: JSON.stringify(data) }).then(unwrapResponse),
  delete: (path: string) =>
    fetchAPI(path, { method: 'DELETE' }).then(unwrapResponse),
  post: (path: string, data?: any) =>
    fetchAPI(path, { method: 'POST', body: data ? JSON.stringify(data) : undefined }).then(unwrapResponse),
};

// Users
export const getUsers = (params?: ListParams) => api.getList('/users', params);
export const getUser = (id: string) => api.get(`/users/${id}`);
export const createUser = (data: any) => api.create('/users', data);
export const updateUser = (id: string, data: any) => api.update(`/users/${id}`, data);
export const deleteUser = (id: string) => api.delete(`/users/${id}`);

// Members
export const getMembers = (params?: ListParams) => api.getList('/members', params);
export const getMember = (id: string) => api.get(`/members/${id}`);
export const createMember = (data: any) => api.create('/members', data);
export const updateMember = (id: string, data: any) => api.update(`/members/${id}`, data);
export const deleteMember = (id: string) => api.delete(`/members/${id}`);
export const kycVerify = (id: string, data: any) => api.post(`/members/${id}/kyc`, data);
export const toggleStatus = (id: string) => api.post(`/members/${id}/toggle-status`);

// Tiers
export const getTiers = (params?: ListParams) => api.getList('/tiers', params);
export const getTier = (id: string) => api.get(`/tiers/${id}`);
export const createTier = (data: any) => api.create('/tiers', data);
export const updateTier = (id: string, data: any) => api.update(`/tiers/${id}`, data);
export const deleteTier = (id: string) => api.delete(`/tiers/${id}`);

// Campaigns
export const getCampaigns = (params?: ListParams) => api.getList('/campaigns', params);
export const getCampaign = (id: string) => api.get(`/campaigns/${id}`);
export const createCampaign = (data: any) => api.create('/campaigns', data);
export const updateCampaign = (id: string, data: any) => api.update(`/campaigns/${id}`, data);
export const deleteCampaign = (id: string) => api.delete(`/campaigns/${id}`);

// Rewards
export const getRewards = (params?: ListParams) => api.getList('/rewards', params);
export const getReward = (id: string) => api.get(`/rewards/${id}`);
export const createReward = (data: any) => api.create('/rewards', data);
export const updateReward = (id: string, data: any) => api.update(`/rewards/${id}`, data);
export const deleteReward = (id: string) => api.delete(`/rewards/${id}`);
export const redeemReward = (id: string, data: any) => api.post(`/rewards/${id}/redeem`, data);

// Vouchers
export const getVouchers = (params?: ListParams) => api.getList('/vouchers', params);
export const getVoucher = (id: string) => api.get(`/vouchers/${id}`);
export const createVoucher = (data: any) => api.create('/vouchers', data);
export const updateVoucher = (id: string, data: any) => api.update(`/vouchers/${id}`, data);
export const deleteVoucher = (id: string) => api.delete(`/vouchers/${id}`);
export const validateVoucher = (code: string) => api.post('/vouchers/validate', { code });
export const redeemVoucher = (id: string, data: any) => api.post(`/vouchers/${id}/redeem`, data);

// Promotions
export const getPromotions = (params?: ListParams) => api.getList('/promotions', params);
export const getPromotion = (id: string) => api.get(`/promotions/${id}`);
export const createPromotion = (data: any) => api.create('/promotions', data);
export const updatePromotion = (id: string, data: any) => api.update(`/promotions/${id}`, data);
export const deletePromotion = (id: string) => api.delete(`/promotions/${id}`);

// Referrals
export const getReferrals = (params?: ListParams) => api.getList('/referrals', params);
export const getReferral = (id: string) => api.get(`/referrals/${id}`);
export const createReferralLink = (data: any) => api.create('/referrals/links', data);
export const updateReferral = (id: string, data: any) => api.update(`/referrals/${id}`, data);
export const deleteReferral = (id: string) => api.delete(`/referrals/${id}`);
export const convertReferral = (id: string, data: any) => api.post(`/referrals/${id}/convert`, data);
export const getReferralStats = (params?: ListParams) => api.getList('/referrals/stats', params);

// Badges
export const getBadges = (params?: ListParams) => api.getList('/badges', params);
export const getBadge = (id: string) => api.get(`/badges/${id}`);
export const createBadge = (data: any) => api.create('/badges', data);
export const updateBadge = (id: string, data: any) => api.update(`/badges/${id}`, data);
export const deleteBadge = (id: string) => api.delete(`/badges/${id}`);

// Missions
export const getMissions = (params?: ListParams) => api.getList('/missions', params);
export const getMission = (id: string) => api.get(`/missions/${id}`);
export const createMission = (data: any) => api.create('/missions', data);
export const updateMission = (id: string, data: any) => api.update(`/missions/${id}`, data);
export const deleteMission = (id: string) => api.delete(`/missions/${id}`);

// Notifications
export const getNotificationTemplates = (params?: ListParams) =>
  api.getList('/notifications/templates', params);
export const createTemplate = (data: any) => api.create('/notifications/templates', data);
export const updateTemplate = (id: string, data: any) => api.update(`/notifications/templates/${id}`, data);
export const deleteTemplate = (id: string) => api.delete(`/notifications/templates/${id}`);
export const sendNotification = (data: any) => api.post('/notifications/send', data);
export const getNotificationLogs = (params?: ListParams) =>
  api.getList('/notifications/logs', params);

// Audit Logs
export const getAuditLogs = (params?: ListParams) => api.getList('/audit-logs', params);

// Member Vouchers
export const getMemberVouchers = (params?: ListParams) =>
  api.getList('/member-vouchers', params);
export const getMemberVoucher = (id: string) => api.get(`/member-vouchers/${id}`);
export const assignVoucher = (data: any) => api.create('/member-vouchers', data);
export const redeemMemberVoucher = (id: string, data: any) => api.post(`/member-vouchers/${id}/redeem`, data);
export const deleteMemberVoucher = (id: string) => api.delete(`/member-vouchers/${id}`);

// Earning Rules
export const getEarningRules = (params?: ListParams) => api.getList('/earning-rules', params);
export const getEarningRule = (id: string) => api.get(`/earning-rules/${id}`);
export const createEarningRule = (data: any) => api.create('/earning-rules', data);
export const updateEarningRule = (id: string, data: any) => api.update(`/earning-rules/${id}`, data);
export const deleteEarningRule = (id: string) => api.delete(`/earning-rules/${id}`);
export const calculateEarningRule = (data: any) => api.post('/earning-rules/calculate', data);

// Point Transactions
export const getPointTransactions = (params?: ListParams) => api.getList('/points/transactions', params);
export const getPointTransaction = (id: string) => api.get(`/points/transactions/${id}`);

// Campaign Performance
export const getCampaignPerf = (id: string) => api.get(`/campaigns/${id}/performance`);

// Member Extras
export const toggleMemberStatus = (id: string) => api.post(`/members/${id}/toggle-status`);
export const kycVerifyMember = (id: string) => api.post(`/members/${id}/kyc`);
export const getTierSuggestion = (id: string) => api.get(`/members/${id}/tier-suggestion`);
export const getMemberActivity = (id: string) => api.get(`/members/${id}/activity`);

// Redemption Queue
export const getRedemptions = (params?: ListParams) => api.getList('/rewards/redemptions', params);
export const approveRedemption = (id: string) => api.post(`/rewards/${id}/approve`);
export const rejectRedemption = (id: string) => api.post(`/rewards/${id}/reject`);

// Check-in Analytics
export const getCheckinAnalytics = (params?: ListParams) => api.getList('/checkin/analytics', params);

// Voucher Analytics
export const getVoucherAnalytics = (params?: ListParams) => api.getList('/analytics/voucher-stats', params);

// Dashboard
export const getDashboard = () => api.get('/analytics/dashboard');

// Analytics
export const getPointsTrend = (params?: ListParams) =>
  api.getList('/analytics/points-trend', params);
export const getMemberGrowth = (params?: ListParams) =>
  api.getList('/analytics/member-growth', params);
export const getCampaignPerformance = (params?: ListParams) =>
  api.getList('/analytics/campaign-performance', params);
export const getTopMembers = (params?: ListParams) =>
  api.getList('/analytics/top-members', params);
export const getVoucherStats = (params?: ListParams) =>
  api.getList('/analytics/voucher-stats', params);

// Import / Export
export const importCsv = (entity: string, csv: string, tenantId?: string) =>
  api.create(`/import/${entity}`, { csv, tenantId });

export const importExcel = (entity: string, fileBase64: string, tenantId?: string) =>
  api.create(`/import/${entity}/excel`, { file: fileBase64, tenantId });

// Tenant Settings / Branding
export const getTenantSettings = (tenantId: string) => api.get(`/settings/tenant/${tenantId}`);
export const updateTenantSettings = (tenantId: string, data: any) =>
  api.update(`/settings/tenant/${tenantId}`, data);

// Stores
export const getStores = (params?: ListParams) => api.getList('/stores', params);
export const getStore = (id: string) => api.get(`/stores/${id}`);
export const createStore = (data: any) => api.create('/stores', data);
export const updateStore = (id: string, data: any) => api.update(`/stores/${id}`, data);
export const deleteStore = (id: string) => api.delete(`/stores/${id}`);
export const getStoreStaff = (storeId: string) => api.get(`/stores/${storeId}/staff`);
export const addStoreStaff = (storeId: string, data: any) => api.create(`/stores/${storeId}/staff`, data);
export const updateStoreStaff = (staffId: string, data: any) => api.update(`/stores/staff/${staffId}`, data);
export const deleteStoreStaff = (staffId: string) => api.delete(`/stores/staff/${staffId}`);

// Cashback
export const getCashbackConfigs = (params?: ListParams) => api.getList('/cashback/configs', params);
export const getCashbackConfig = (id: string) => api.get(`/cashback/configs/${id}`);
export const createCashbackConfig = (data: any) => api.create('/cashback/configs', data);
export const updateCashbackConfig = (id: string, data: any) => api.update(`/cashback/configs/${id}`, data);
export const deleteCashbackConfig = (id: string) => api.delete(`/cashback/configs/${id}`);

// Partner Brands
export const getPartnerBrands = (params?: ListParams) => api.getList('/partnership/brands', params);
export const getPartnerBrand = (id: string) => api.get(`/partnership/brands/${id}`);
export const createPartnerBrand = (data: any) => api.create('/partnership/brands', data);
export const updatePartnerBrand = (id: string, data: any) => api.update(`/partnership/brands/${id}`, data);
export const deletePartnerBrand = (id: string) => api.delete(`/partnership/brands/${id}`);
export const getPartnerBrandRewards = (brandId: string) => api.get(`/partnership/brands/${brandId}/rewards`);
export const createPartnerReward = (brandId: string, data: any) => api.create(`/partnership/brands/${brandId}/rewards`, data);
export const updatePartnerReward = (id: string, data: any) => api.update(`/partnership/rewards/${id}`, data);
export const deletePartnerReward = (id: string) => api.delete(`/partnership/rewards/${id}`);

// Webhooks
export const getWebhookEndpoints = (params?: ListParams) => api.getList('/webhooks/endpoints', params);
export const getWebhookEndpoint = (id: string) => api.get(`/webhooks/endpoints/${id}`);
export const createWebhookEndpoint = (data: any) => api.create('/webhooks/endpoints', data);
export const updateWebhookEndpoint = (id: string, data: any) => api.update(`/webhooks/endpoints/${id}`, data);
export const deleteWebhookEndpoint = (id: string) => api.delete(`/webhooks/endpoints/${id}`);
export const testWebhookEndpoint = (id: string) => api.post(`/webhooks/endpoints/${id}/test`);
export const getWebhookLogs = (params?: ListParams) => api.getList('/webhooks/logs', params);
export const getWebhookLog = (id: string) => api.get(`/webhooks/logs/${id}`);

// Gift Cards
export const getGiftCards = (params?: ListParams) => api.getList('/gift-cards', params);
export const getGiftCard = (id: string) => api.get(`/gift-cards/${id}`);
export const createGiftCard = (data: any) => api.create('/gift-cards', data);
export const updateGiftCard = (id: string, data: any) => api.update(`/gift-cards/${id}`, data);
export const assignGiftCard = (id: string, memberId: string) => api.post(`/gift-cards/${id}/assign`, { memberId });

// Feedback
export const getFeedbackList = (params?: ListParams) => api.getList('/feedback', params);
export const getFeedback = (id: string) => api.get(`/feedback/${id}`);
export const createFeedback = (data: any) => api.create('/feedback', data);
export const updateFeedback = (id: string, data: any) => api.update(`/feedback/${id}`, data);
export const deleteFeedback = (id: string) => api.delete(`/feedback/${id}`);

// Products
export const getProducts = (params?: ListParams) => api.getList('/products', params);
export const getProduct = (id: string) => api.get(`/products/${id}`);
export const createProduct = (data: any) => api.create('/products', data);
export const updateProduct = (id: string, data: any) => api.update(`/products/${id}`, data);
export const deleteProduct = (id: string) => api.delete(`/products/${id}`);

// Product Categories
export const getProductCategories = (params?: ListParams) => api.getList('/product-categories', params);
export const getProductCategory = (id: string) => api.get(`/product-categories/${id}`);
export const createProductCategory = (data: any) => api.create('/product-categories', data);
export const updateProductCategory = (id: string, data: any) => api.update(`/product-categories/${id}`, data);
export const deleteProductCategory = (id: string) => api.delete(`/product-categories/${id}`);

// Orders
export const getOrders = (params?: ListParams) => api.getList('/orders', params);
export const getOrder = (id: string) => api.get(`/orders/${id}`);
export const createOrder = (data: any) => api.create('/orders', data);
export const updateOrderStatus = (id: string, data: any) => api.update(`/orders/${id}/status`, data);
export const getOrderTimeline = (id: string) => api.get(`/orders/${id}/timeline`);

// Member Segmentation
export const getMemberSegmentation = (params?: ListParams) => api.getList('/member-segmentation', params);
export const getSegmentationSummary = () => api.get('/member-segmentation/summary');
export const getMemberRFM = (memberId: string) => api.get(`/member-segmentation/${memberId}`);

// Coupons
export const getCoupons = (params?: ListParams) => api.getList('/coupons', params);
export const getCoupon = (id: string) => api.get(`/coupons/${id}`);
export const createCoupon = (data: any) => api.create('/coupons', data);
export const updateCoupon = (id: string, data: any) => api.update(`/coupons/${id}`, data);
export const deleteCoupon = (id: string) => api.delete(`/coupons/${id}`);
export const validateCoupon = (data: any) => api.post('/coupons/validate', data);
export const applyCoupon = (data: any) => api.post('/coupons/apply', data);

// Bulk operations - Members
export const bulkDeleteMembers = (ids: string[]) =>
  api.post('/members/bulk-delete', { ids });

export const bulkActivateMembers = (ids: string[]) =>
  api.post('/members/bulk-activate', { ids });

export const bulkDeactivateMembers = (ids: string[]) =>
  api.post('/members/bulk-deactivate', { ids });

// Bulk operations - Campaigns
export const bulkDeleteCampaigns = (ids: string[]) =>
  api.post('/campaigns/bulk-delete', { ids });

export const bulkActivateCampaigns = (ids: string[]) =>
  api.post('/campaigns/bulk-activate', { ids });

// Bulk operations - Vouchers
export const bulkDeleteVouchers = (ids: string[]) =>
  api.post('/vouchers/bulk-delete', { ids });

export const bulkVouchersExpire = (ids: string[]) =>
  api.post('/vouchers/bulk-expire', { ids });

export const exportCsv = (endpoint: string, params?: ListParams) => {
  const q = buildQuery(params);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return fetch(`${API_BASE}/${endpoint}/export/csv${q}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  }).then((r) => {
    if (!r.ok) throw new Error(`API error: ${r.status}`);
    return r.blob();
  });
};
