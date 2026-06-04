export const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001/api/v1';

export const CREDENTIALS = {
  email: __ENV.TEST_EMAIL || 'test@example.com',
  password: __ENV.TEST_PASSWORD || 'Test@123',
};

export const HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

export const ENDPOINTS = {
  health: `${BASE_URL}/health`,
  login: `${BASE_URL}/auth/member/login`,
  profile: `${BASE_URL}/me/profile`,
  wallet: `${BASE_URL}/me/wallet`,
  members: `${BASE_URL}/members`,
  campaigns: `${BASE_URL}/campaigns`,
  transactions: `${BASE_URL}/me/transactions`,
};
