'use client';

const TOKEN_KEY = 'token';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

function getHeaders(contentType = 'application/json'): Record<string, string> {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (contentType) headers['Content-Type'] = contentType;
  return headers;
}

async function request<T = any>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { ...getHeaders(), ...options?.headers },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || `Request failed: ${res.status}`);
  return json;
}

export function useApi() {
  function unwrap<T>(response: any): T {
    if (response && typeof response === 'object' && 'success' in response) {
      return response.data ?? response;
    }
    return response;
  }

  function getPagination(response: any) {
    const data = unwrap<any[]>(response);
    return {
      data: Array.isArray(data) ? data : [],
      total: response.pagination?.totalItems ?? 0,
      totalPages: response.pagination?.totalPages ?? 1,
      page: response.pagination?.page ?? 1,
    };
  }

  async function get<T = any>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
    const q = params ? '?' + Object.entries(params).filter(([_, v]) => v != null).map(([k, v]) => `${k}=${v}`).join('&') : '';
    const res = await request<any>(`/api${path}${q}`);
    return unwrap<T>(res);
  }

  async function getList<T = any>(path: string, params?: Record<string, string | number | undefined>) {
    const q = params ? '?' + Object.entries(params).filter(([_, v]) => v != null).map(([k, v]) => `${k}=${v}`).join('&') : '';
    const res = await request<any>(`/api${path}${q}`);
    return getPagination(res);
  }

  async function post<T = any>(path: string, body?: any): Promise<T> {
    const res = await request<any>(`/api${path}`, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
    return unwrap<T>(res);
  }

  async function put<T = any>(path: string, body: any): Promise<T> {
    const res = await request<any>(`/api${path}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    return unwrap<T>(res);
  }

  async function del<T = any>(path: string): Promise<T> {
    const res = await request<any>(`/api${path}`, { method: 'DELETE' });
    return unwrap<T>(res);
  }

  return { get, getList, post, put, del };
}
