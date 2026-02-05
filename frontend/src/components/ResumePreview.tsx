import React, { forwardRef } from 'react';

const ResumePreview = forwardRef(({ resume, view = 'view1' }: { resume?: any; view?: 'view1' | 'view2' }, ref: any) => {
  const p = resume?.personal_info || {};
  const skills = resume?.skills || [];
  const education = resume?.education || [];
  const experience = resume?.experience || [];
  const photoUrl = resume?.photo_url;
  const socialLinks = (resume?.social_links || [])
    .map((item: any) => {
      if (typeof item === 'string') {
        return { label: '', url: item };
      }
      return {
        label: item?.label || item?.name || item?.title || '',
        url: item?.url || item?.link || item?.href || '',
      };
    })
    .filter((item: any) => (item.label || '').trim() !== '' || (item.url || '').trim() !== '');
  const sidebarBg = resume?.sidebar_bg_color || '#f3f4f6';
  const sidebarText = resume?.sidebar_text_color || '#111827';
  const showSidebar = view === 'view1';

  const formatBirthDate = (value?: string) => {
    if (!value) return null;
    const str = String(value);
    if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
      const [year, month, day] = str.substring(0, 10).split('-');
      return `${day}/${month}/${year}`;
    }
    const date = new Date(str);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleDateString('pt-BR');
  };

  const birthDateLabel = formatBirthDate(resume?.birth_date || p?.birth_date);

  return (
    <div
      ref={ref}
      className={`resume-preview ${showSidebar ? '' : 'view2'} flex ${showSidebar ? 'gap-6 max-w-4xl mx-auto' : 'gap-0 w-full max-w-none'} print:w-full print:max-w-none print:m-0 print:block`}
    >
      {showSidebar && (
        <aside className="w-1/3 p-4 break-words print:hidden" style={{ backgroundColor: sidebarBg, color: sidebarText }}>
          {photoUrl && (
            <div className="mb-4">
              <img src={photoUrl} alt="Foto do perfil" className="w-32 h-32 object-cover rounded-full border" />
            </div>
          )}
          <div className="mb-4">
            <h2 className="text-xl font-bold break-words">{p.name}</h2>
            <div className="text-sm break-words" style={{ color: sidebarText }}>{p.city} {p.country && ", " + p.country}</div>
            {birthDateLabel && (
              <div className="text-sm break-words" style={{ color: sidebarText }}>
                Nascido em {birthDateLabel}
              </div>
            )}
          </div>

          <div className="mb-4">
            <h3 className="font-semibold">Contato</h3>
            <div className="text-sm break-words overflow-hidden" style={{ color: sidebarText }}>{p.email}</div>
            <div className="text-sm break-words overflow-hidden" style={{ color: sidebarText }}>{p.phone}</div>
          </div>

          {skills.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Habilidades</h3>
              <div className="text-sm space-y-1">
                {skills.map((s: string, i: number) => (
                  <div key={i} className="text-sm break-words">
                    • {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {socialLinks.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Redes / Links</h3>
              <div className="text-sm space-y-1">
                {socialLinks.map((l: any, i: number) => (
                  <div key={i} className="break-words overflow-hidden text-xs">
                    {l.label && l.url ? (
                      <>
                        <div className="font-medium">{l.label}</div>
                        <a href={l.url} target="_blank" rel="noreferrer" className="underline break-all">
                          {l.url}
                        </a>
                      </>
                    ) : l.url ? (
                      <a href={l.url} target="_blank" rel="noreferrer" className="underline break-words">
                        {l.url}
                      </a>
                    ) : (
                      <span className="break-words">{l.label}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      )}

      <main className={`${showSidebar ? 'w-2/3' : 'w-full'} bg-white p-4 print:w-full print:max-w-none`}>
        {!showSidebar && (
          <div className="mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50 print:w-full">
            <h2 className="text-2xl font-bold break-words">{p.name}</h2>
            <div className="text-sm text-gray-600 break-words">{p.city} {p.country && ", " + p.country}</div>
            {birthDateLabel && (
              <div className="text-sm text-gray-600 break-words">Nascido em {birthDateLabel}</div>
            )}
            <div className="mt-2 text-sm text-gray-600 break-words">{p.email} {p.phone && `• ${p.phone}`}</div>

          </div>
        )}
        <div className="mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50 print:w-full">
          <h3 className="text-lg font-semibold mb-3">Resumo</h3>
          <div
            className="text-sm text-gray-800 prose prose-sm max-w-none break-words overflow-hidden"
            dangerouslySetInnerHTML={{ __html: resume?.summary || '' }}
          />
        </div>

        <div className="mb-4 p-4 border border-gray-300 rounded-lg bg-gray-50 print:w-full">
          <h3 className="text-lg font-semibold mb-3">Experiência Profissional</h3>
          <div className="space-y-3 mt-2">
            {experience.map((e: any, i: number) => (
              <div key={i} className={i < experience.length - 1 ? 'pb-3 border-b border-gray-200' : ''}>
                <div className="flex justify-between">
                  <div className="font-semibold">{e.company}</div>
                  <div className="text-sm text-gray-600">{e.period_start} - {e.period_end}</div>
                </div>
                {e.location && <div className="text-sm text-gray-600">{e.location}</div>}
                <div
                  className="text-sm text-gray-700 prose prose-sm max-w-none break-words overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: e.description || '' }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border border-gray-300 rounded-lg bg-gray-50 print:w-full">
          <h3 className="text-lg font-semibold mb-3">Formação</h3>
          <div className="mt-2 space-y-2">
            {education.map((ed: any, i: number) => (
              <div
                key={i}
                className={i < education.length - 1 ? 'pb-3 border-b border-gray-200' : ''}
                style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
              >
                <div className="font-semibold">{ed.institution}</div>
                <div className="text-sm text-gray-600">
                  {ed.diploma}
                  {ed.period_start && ed.period_end && ` (${ed.period_start} - ${ed.period_end})`}
                  {ed.period && ` - ${ed.period}`}
                </div>
                {ed.location && <div className="text-sm text-gray-600">{ed.location}</div>}
              </div>
            ))}
          </div>

        </div>

        {!showSidebar && skills.length > 0 && (
          <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50 print:w-full">
            <h3 className="text-lg font-semibold mb-3">Habilidades</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((s: string, i: number) => (
                <span key={i} className="text-sm px-2 py-1 rounded break-words bg-blue-50 text-blue-900">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {!showSidebar && socialLinks.length > 0 && (
          <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50 print:w-full">
            <h3 className="text-lg font-semibold mb-3">Redes / Links</h3>
            <div className="text-sm text-gray-700 space-y-2">
              {socialLinks.map((l: any, i: number) => (
                <div key={i} className="break-words overflow-hidden">
                  {l.label && l.url ? (
                    <>
                      <div className="font-medium text-gray-800">{l.label}</div>
                      <a href={l.url} target="_blank" rel="noreferrer" className="underline break-all text-gray-700 text-xs">
                        {l.url}
                      </a>
                    </>
                  ) : l.url ? (
                    <a href={l.url} target="_blank" rel="noreferrer" className="underline break-words text-gray-700">
                      {l.url}
                    </a>
                  ) : (
                    <span className="break-words text-gray-700">{l.label}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
});

export default ResumePreview;
