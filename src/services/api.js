const API_BASE = '/api';

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

  const data = await response.json();
  if (!response.ok && !data.message) {
    throw new Error('Terjadi kesalahan pada server.');
  }

  return data;
}
