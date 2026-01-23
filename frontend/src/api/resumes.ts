import { getAuthHeaders, getAuthToken } from '../auth';

// Simple in-memory cache with TTL (5 minutes)
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function isCacheValid(key: string): boolean {
  const entry = cache.get(key);
  if (!entry) return false;
  return Date.now() - entry.timestamp < CACHE_TTL;
}

function getFromCache(key: string): any | null {
  if (isCacheValid(key)) {
    console.debug('Cache hit:', key);
    return cache.get(key)?.data || null;
  }
  return null;
}

function setCache(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() });
}

function clearCache(pattern?: string): void {
  if (!pattern) {
    cache.clear();
    return;
  }
  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key);
    }
  }
}

export async function listResumes(page: number | string = 1) {
  const cacheKey = `list-resumes-${page}`;
  
  // Try cache first
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  console.debug('listResumes: fetching page', page);
  const res = await fetch(`/api/resumes?page=${page}`, {
    cache: 'no-store',
    headers: {
      ...getAuthHeaders(),
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
  });

  if (res.status === 401) throw new Error('Unauthenticated');
  if (!res.ok) throw new Error(`Failed to load resumes (status ${res.status})`);

  const data = await res.json();
  setCache(cacheKey, data);
  return data;
}

export async function getResume(id: number | string) {
  const cacheKey = `resume-${id}`;
  
  // Try cache first
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  const res = await fetch(`/api/resumes/${id}`, { 
    headers: { ...getAuthHeaders(), 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' } 
  });
  if (res.status === 401) throw new Error('Unauthenticated');
  if (!res.ok) throw new Error('Failed to load resume');
  
  const data = await res.json();
  setCache(cacheKey, data);
  return data;
}

export async function createResume(data: any) {
  const res = await fetch(`/api/resumes`, {
    method: 'POST',
    headers: { ...getAuthHeaders(), 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (res.status === 401) throw new Error('Unauthenticated');
  if (!res.ok) throw new Error('Failed to create resume');
  clearCache('resume');
  clearCache('list-resumes');
  return res.json();
}

export async function updateResume(id: number | string, data: any) {
  const res = await fetch(`/api/resumes/${id}`, {
    method: 'PUT',
    headers: { ...getAuthHeaders(), 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (res.status === 401) throw new Error('Unauthenticated');
  if (!res.ok) throw new Error('Failed to update resume');
  clearCache('resume');
  clearCache('list-resumes');
  return res.json();
}

export async function deleteResume(id: number | string) {
  const res = await fetch(`/api/resumes/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeaders(), 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
  });
  if (res.status === 401) throw new Error('Unauthenticated');
  if (!res.ok) throw new Error('Failed to delete resume');
  clearCache('resume');
  clearCache('list-resumes');
  return true;
}
