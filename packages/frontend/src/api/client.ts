type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

const TOKEN_STORAGE_KEY = 'token';

function buildUrl(path: string) {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? '';
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

async function request<T>(path: string, options: RequestOptions = {}) {
  const headers = new Headers(options.headers);
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(buildUrl(path), {
    ...options,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message ?? `Request failed with status ${response.status}`);
  }

  return data as T;
}

export function get<T>(path: string, options?: Omit<RequestOptions, 'body' | 'method'>) {
  return request<T>(path, { ...options, method: 'GET' });
}

export function post<T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'body' | 'method'>) {
  return request<T>(path, { ...options, method: 'POST', body });
}
