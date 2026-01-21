export async function listResumes(page: number | string = 1) {
  const res = await fetch(`/api/resumes?page=${page}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to load resumes');
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
