import React, { useEffect, useState } from 'react';

export default function DashboardResumes({ user }: { user: any }) {
  const [resumes, setResumes] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const r = await import('../api/resumes');
        const data = await r.listResumes();
        setResumes(data);
      } catch (e) {
        console.error('Failed to load resumes', e);
      }
    })();
  }, []);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Currículos</h1>
        {!(user?.role === 'admin' || user?.access_level === 'admin') && (
          <a href="/resumes/new" className="px-3 py-2 bg-green-600 text-white rounded">Criar Novo</a>
        )}
      </div>

      <div className="grid gap-4">
        {resumes && resumes.data ? (
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

      {resumes && resumes.meta && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {resumes.meta.links?.map((l: any, idx: number) => (
            <button
              key={idx}
              disabled={!l.url}
              onClick={() => l.url && (async () => {
                try {
                  const url = new URL(l.url);
                  const page = url.searchParams.get('page') || '1';
                  const data = await (await import('../api/resumes')).listResumes(page);
                  setResumes(data);
                } catch (e) {
                  console.error(e);
                }
              })()}
              className={`px-3 py-1 rounded ${l.active ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
            >
              {l.label.replace(/<[^>]+>/g, '')}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
