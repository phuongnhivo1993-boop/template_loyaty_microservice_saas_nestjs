import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';
import { BASE_URL, CREDENTIALS, HEADERS } from './constants.js';

const healthDuration = new Trend('health_duration');
const membersDuration = new Trend('members_duration');
const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '10s', target: 200 },
    { duration: '30s', target: 200 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(99)<5000'],
    http_req_failed: ['rate<0.02'],
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

  const healthRes = http.get(`${BASE_URL}/health`);
  healthDuration.add(healthRes.timings.duration);
  errorRate.add(healthRes.status !== 200);
  check(healthRes, { 'health ok': (r) => r.status === 200 });

  sleep(1);

  const membersRes = http.get(`${BASE_URL}/members`, { headers: authHeaders });
  membersDuration.add(membersRes.timings.duration);
  errorRate.add(membersRes.status !== 200);
  check(membersRes, { 'members list ok': (r) => r.status === 200 });

  sleep(1);
}

export function teardown(data) {
  // no cleanup needed
}
