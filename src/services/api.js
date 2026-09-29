export const API_BASE = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/+$/, '')
  : '/api';

export function getAuthToken() {
  return localStorage.getItem('efootmarket_token');
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('efootmarket_token', token);
  } else {
    localStorage.removeItem('efootmarket_token');
  }
}

export function getImageUrl(url) {
  if (!url) return 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  // If API_BASE is absolute (e.g. https://my-backend.onrender.com/api)
  if (API_BASE.startsWith('http://') || API_BASE.startsWith('https://')) {
    const host = API_BASE.replace(/\/api\/?$/, '');
    return `${host}${url.startsWith('/') ? '' : '/'}${url}`;
  }
  return url;
}

export async function apiFetch(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('Backend server belum terhubung atau tidak mengembalikan JSON.');
  }

  const data = await response.json();
  if (!response.ok && !data.message) {
    throw new Error('Terjadi kesalahan pada server.');
  }

  return data;
}

