import React, { forwardRef } from 'react';

const ResumePreview = forwardRef(({ resume }: { resume?: any }, ref: any) => {
  const p = resume?.personal_info || {};
  const skills = resume?.skills || [];
  const education = resume?.education || [];
  const experience = resume?.experience || [];
  const photoUrl = resume?.photo_url;
  const sidebarBg = resume?.sidebar_bg_color || '#f3f4f6';
  const sidebarText = resume?.sidebar_text_color || '#111827';

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
    <div ref={ref} className="resume-preview max-w-4xl mx-auto flex gap-6">
      <aside className="w-1/3 p-4" style={{ backgroundColor: sidebarBg, color: sidebarText }}>
        {photoUrl && (
          <div className="mb-4">
            <img src={photoUrl} alt="Foto do perfil" className="w-32 h-32 object-cover rounded-full border" />
          </div>
        )}
        <div className="mb-4">
          <h2 className="text-xl font-bold">{p.name}</h2>
          <div className="text-sm" style={{ color: sidebarText }}>{p.city} {p.country && ", " + p.country}</div>
          {birthDateLabel && (
            <div className="text-sm" style={{ color: sidebarText }}>
              Nascido em {birthDateLabel}
            </div>
          )}
        </div>

        <div className="mb-4">
          <h3 className="font-semibold">Contato</h3>
          <div className="text-sm" style={{ color: sidebarText }}>{p.email}</div>
          <div className="text-sm" style={{ color: sidebarText }}>{p.phone}</div>
        </div>

        {resume?.social_links && resume.social_links.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold">Links</h3>
            <div className="text-sm mt-1" style={{ color: sidebarText }}>
              {resume.social_links.map((l: string, i: number) => (
                <div key={i}><a href={l} target="_blank" rel="noreferrer" className="underline" style={{ color: sidebarText }}>{l}</a></div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4">
          <h3 className="font-semibold">Principais Competencias</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {skills.map((s: string, i: number) => (
              <span key={i} className="text-sm px-2 py-1 rounded" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: sidebarText }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </aside>

      <main className="w-2/3 bg-white p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Resumo</h3>
          <p className="text-sm text-gray-800">{resume?.summary}</p>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold">Experiencia Profissional</h3>
          <div className="space-y-3 mt-2">
            {experience.map((e: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between">
                  <div className="font-semibold">{e.company}</div>
                  <div className="text-sm text-gray-600">{e.period_start} - {e.period_end}</div>
                </div>
                {e.location && <div className="text-sm text-gray-600">{e.location}</div>}
                <div className="text-sm text-gray-700">{e.description}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Formacao</h3>
          <div className="mt-2 space-y-2">
            {education.map((ed: any, i: number) => (
              <div key={i}>
                <div className="font-semibold">{ed.institution}</div>
                <div className="text-sm text-gray-600">
                  {ed.diploma}
                  {ed.period_start && ed.period_end && ` (${ed.period_start} - ${ed.period_end})`}
                  {ed.period && ` - ${ed.period}`}
                </div>
                {ed.location && <div className="text-sm text-gray-600">?? {ed.location}</div>}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
});

export default ResumePreview;
