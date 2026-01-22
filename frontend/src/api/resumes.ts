export async function listResumes(page: number | string = 1) {
  // Force no-cache to avoid 304 Not Modified from intermediary caches or dev server
  const res = await fetch(`/api/resumes?page=${page}`, {
    credentials: 'include',
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
    },
  });

  // If a 304 is returned, retry once with explicit no-store
  if (res.status === 304) {
    console.warn('listResumes: received 304 Not Modified, retrying with no-store');
    const retry = await fetch(`/api/resumes?page=${page}`, { credentials: 'include', cache: 'no-store' });
    if (!retry.ok) throw new Error(`Failed to load resumes (status ${retry.status})`);
    return retry.json();
  }

  if (!res.ok) throw new Error(`Failed to load resumes (status ${res.status})`);

  // Helpful debug info
  try {
    console.debug('listResumes: response headers', {
      etag: res.headers.get('etag'),
      lastModified: res.headers.get('last-modified'),
      status: res.status,
    });
  } catch (e) {
    // ignore
  }

  return res.json();
}

export async function getResume(id: number | string) {
  const res = await fetch(`/api/resumes/${id}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to load resume');
  return res.json();
}

export async function createResume(data: any) {
  const res = await fetch(`/api/resumes`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create resume');
  return res.json();
}

export async function updateResume(id: number | string, data: any) {
  const res = await fetch(`/api/resumes/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update resume');
  return res.json();
}

export async function deleteResume(id: number | string) {
  const res = await fetch(`/api/resumes/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete resume');
  return true;
}
