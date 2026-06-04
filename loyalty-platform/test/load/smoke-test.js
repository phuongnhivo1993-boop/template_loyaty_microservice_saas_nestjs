import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, CREDENTIALS, HEADERS } from './constants.js';

export const options = {
  vus: 1,
  iterations: 1,
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
  check(healthRes, { 'health endpoint ok': (r) => r.status === 200 });

  sleep(1);

  const membersRes = http.get(`${BASE_URL}/members`, { headers: authHeaders });
  check(membersRes, { 'list members ok': (r) => r.status === 200 });

  sleep(1);

  const campaignsRes = http.get(`${BASE_URL}/campaigns`, { headers: authHeaders });
  check(campaignsRes, { 'list campaigns ok': (r) => r.status === 200 });
}

export function teardown(data) {
  // no cleanup needed
}
