// Use a relative API base so Vite dev server proxy is used in development
export const API_URL = '/api';

// Store auth token in localStorage
export function setAuthToken(token: string): void {
  localStorage.setItem('auth_token', token);
}

export function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

export function removeAuthToken(): void {
  localStorage.removeItem('auth_token');
}

export function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  access_level: 'admin' | 'user';
  created_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export async function register(
  name: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Falha ao registrar');
  }

  return response.json();
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Falha ao fazer login');
  }

  return response.json();
}

export async function getCurrentUser(): Promise<{ user: User } | null> {
  try {
    const token = getAuthToken();
    console.log('[auth.getCurrentUser] token present:', !!token);
    
    if (!token) {
      console.log('[auth.getCurrentUser] no token, returning null');
      return null;
    }

    const headers = getAuthHeaders();
    console.log('[auth.getCurrentUser] headers:', { 'Authorization': headers.Authorization ? 'Bearer ...' : 'none' });
    
    const response = await fetch(`${API_URL}/me`, {
      headers,
    });

    console.log('[auth.getCurrentUser] response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[auth.getCurrentUser] error:', response.status, errorText);
      return null;
    }

    const data = await response.json();
    console.log('[auth.getCurrentUser] success, user:', data.user?.name);
    return data;
  } catch (e) {
    console.error('[auth.getCurrentUser] exception:', e);
    return null;
  }
}

export async function logout(): Promise<void> {
  await fetch(`${API_URL}/logout`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  removeAuthToken();
}

export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${API_URL}/users`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Acesso negado');
  }

  const data = await response.json();
  return data.users;
}

export async function updateUser(id: number, payload: Partial<{ name: string; email: string; password?: string; access_level?: 'admin'|'user' }>): Promise<User> {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Falha ao atualizar usuario');
  }

  const data = await response.json();
  return data.user;
}

export async function deleteUser(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Falha ao deletar usuario');
  }
}

export async function updateProfile(payload: Partial<{ name: string; email: string; password?: string }>): Promise<User> {
  const response = await fetch(`${API_URL}/profile`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Falha ao atualizar perfil');
  }

  const data = await response.json();
  return data.user;
}
