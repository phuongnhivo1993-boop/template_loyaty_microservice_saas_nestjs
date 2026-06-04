import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';
import { BASE_URL, CREDENTIALS, HEADERS } from './constants.js';

const loginDuration = new Trend('login_duration');
const profileDuration = new Trend('profile_duration');
const txDuration = new Trend('transaction_duration');
const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '30s', target: 100 },
    { duration: '2m', target: 100 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.01'],
  },
};

export function setup() {
  const loginRes = http.post(
    `${BASE_URL}/auth/member/login`,
    JSON.stringify({
      email: CREDENTIALS.email,
      password: CREDENTIALS.password,
      tenantDomain: 'default',
    }),
    { headers: HEADERS },
  );
  check(loginRes, { 'login successful': (r) => r.status === 200 });
  const token = loginRes.json('accessToken') || loginRes.json('data')?.accessToken || '';
  return { token };
}

export default function (data) {
  const authHeaders = { ...HEADERS, Authorization: `Bearer ${data.token}` };

  const loginRes = http.post(
    `${BASE_URL}/auth/member/login`,
    JSON.stringify({
      email: CREDENTIALS.email,
      password: CREDENTIALS.password,
      tenantDomain: 'default',
    }),
    { headers: HEADERS },
  );
  loginDuration.add(loginRes.timings.duration);
  errorRate.add(loginRes.status !== 200);
  check(loginRes, { 'login ok': (r) => r.status === 200 });

  sleep(1);

  const profileRes = http.get(`${BASE_URL}/me/profile`, { headers: authHeaders });
  profileDuration.add(profileRes.timings.duration);
  errorRate.add(profileRes.status !== 200);
  check(profileRes, { 'profile ok': (r) => r.status === 200 });

  sleep(1);

  const txRes = http.get(`${BASE_URL}/me/transactions`, { headers: authHeaders });
  txDuration.add(txRes.timings.duration);
  errorRate.add(txRes.status !== 200);
  check(txRes, { 'transactions ok': (r) => r.status === 200 });

  sleep(1);
}

export function teardown(data) {
  // no cleanup needed
}
