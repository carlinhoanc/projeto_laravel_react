import React, { useEffect, useState } from 'react';

export default function DashboardResumes({ user }: { user: any }) {
  const [resumes, setResumes] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      // fetch resumes
      const res = await fetch('/api/resumes', { credentials: 'include' });
      if (res.ok) setResumes(await res.json());
    })();
  }, []);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Currículos</h1>
        {!user?.isAdmin && <a href="/resumes/new" className="px-3 py-2 bg-green-600 text-white rounded">Criar Novo</a>}
      </div>

      <div className="grid gap-4">
        {resumes.data ? (
          resumes.data.map((r: any) => (
            <div key={r.id} className="p-4 border rounded bg-white shadow">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold">{r.personal_info?.name || 'Sem nome'}</div>
                  <div className="text-sm text-gray-600">{r.personal_info?.city || ''}</div>
                </div>
                <div className="space-x-2">
                  <a href={`/resumes/${r.id}`} className="px-2 py-1 bg-blue-600 text-white rounded">Abrir</a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>Carregando...</div>
        )}
      </div>
    </div>
  );
}
