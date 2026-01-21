import React, { forwardRef } from 'react';

const ResumePreview = forwardRef(({ resume }: { resume?: any }, ref: any) => {
  const p = resume?.personal_info || {};
  const skills = resume?.skills || [];
  const education = resume?.education || [];
  const experience = resume?.experience || [];

  return (
    <div ref={ref} className="resume-preview max-w-4xl mx-auto flex gap-6">
      <aside className="w-1/3 bg-gray-100 p-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold">{p.name}</h2>
          <div className="text-sm text-gray-600">{p.city} {p.country && ", " + p.country}</div>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold">Contato</h3>
          <div className="text-sm text-gray-700">{p.email}</div>
          <div className="text-sm text-gray-700">{p.phone}</div>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold">Principais Competências</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {skills.map((s: string, i: number) => (
              <span key={i} className="text-sm bg-blue-100 px-2 py-1 rounded">{s}</span>
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
          <h3 className="text-lg font-semibold">Experiência Profissional</h3>
          <div className="space-y-3 mt-2">
            {experience.map((e: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between">
                  <div className="font-semibold">{e.company}</div>
                  <div className="text-sm text-gray-600">{e.period_start} - {e.period_end}</div>
                </div>
                <div className="text-sm text-gray-700">{e.description}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Formação</h3>
          <div className="mt-2 space-y-2">
            {education.map((ed: any, i: number) => (
              <div key={i}>
                <div className="font-semibold">{ed.institution}</div>
                <div className="text-sm text-gray-700">{ed.diploma} - {ed.period}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
});

export default ResumePreview;
