import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import ResumePreview from '../components/ResumePreview';
import { useReactToPrint } from 'react-to-print';
import * as resumesApi from '../api/resumes';

export default function ResumeEditor() {
  const { register, control, handleSubmit, watch, reset, formState: { errors } } = useForm<any>({
    defaultValues: {
      personal_info: { name: '', email: '', phone: '', city: '', country: '' },
      experience: [],
      education: [],
      skills: [''],
      social_links: [''],
      summary: '',
      licenses: [],
      interests: [],
    },
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (params.id) {
        setLoading(true);
        setLoadError(null);
        try {
          console.log('ResumeEditor: loading resume with id', params.id);
          const data = await resumesApi.getResume(params.id);
          console.log('ResumeEditor: loaded data', data);
          const resume = data.data ? data.data : data;
          console.log('ResumeEditor: extracted resume', resume);
          reset(resume);
          console.log('ResumeEditor: form reset complete');
        } catch (e: any) {
          console.error('ResumeEditor: Failed to load resume', e);
          setLoadError(e.message || 'Erro ao carregar curriculo');
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [params.id, reset]);

  const { fields: expFields, append: expAppend, remove: expRemove } = useFieldArray({ control, name: 'experience' });
  const { fields: edFields, append: edAppend, remove: edRemove } = useFieldArray({ control, name: 'education' });
  const { fields: skillFields, append: skillAppend, remove: skillRemove } = useFieldArray({ control, name: 'skills' });
  const { fields: socialFields, append: socialAppend, remove: socialRemove } = useFieldArray({ control, name: 'social_links' });

  const previewRef = useRef<HTMLDivElement>(null);
  const onPrint = useReactToPrint({ content: () => previewRef.current });

  const onSubmit = useCallback(async (data: any) => {
    setSaving(true);
    try {
      const payload = { ...data };
      if (Array.isArray(payload.skills)) {
        payload.skills = payload.skills.filter((s: string) => !!s && s.trim() !== '');
      }
      if (Array.isArray(payload.social_links)) {
        payload.social_links = payload.social_links.filter((s: string) => !!s && s.trim() !== '');
      }

      if (params.id) {
        await resumesApi.updateResume(params.id, payload);
        alert('Curriculo atualizado');
      } else {
        await resumesApi.createResume(payload);
        alert('Curriculo criado');
      }
      navigate('/resumes');
    } catch (e: any) {
      console.error('Save failed', e);
      const msg = e?.message || 'Falha ao salvar curriculo';
      alert(msg);
    } finally {
      setSaving(false);
    }
  }, [params.id, navigate]);

  const formValues = watch();
  const memoizedPreview = useMemo(() => <ResumePreview resume={formValues} />, [formValues]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Editor de Curriculo</h2>

      {loadError && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
          <strong>Erro:</strong> {loadError}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Carregando curriculo...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <section>
                  <h3 className="text-lg font-semibold mb-3">Dados Pessoais</h3>
                  <div className="space-y-2">
                    <input
                      {...register('personal_info.name', { required: 'Nome obrigatorio' })}
                      placeholder="Nome completo"
                      className="border p-2 rounded w-full"
                    />
                    {(errors as any).personal_info?.name && (
                      <div className="text-sm text-red-600">{(errors as any).personal_info.name.message}</div>
                    )}

                    <input
                      {...register('personal_info.email', {
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email invalido' },
                      })}
                      placeholder="Email"
                      className="border p-2 rounded w-full"
                    />
                    {(errors as any).personal_info?.email && (
                      <div className="text-sm text-red-600">{(errors as any).personal_info.email.message}</div>
                    )}

                    <input {...register('personal_info.phone')} placeholder="Telefone" className="border p-2 rounded w-full" />
                    <input {...register('personal_info.city')} placeholder="Cidade" className="border p-2 rounded w-full" />
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">Resumo Profissional</h3>
                  <textarea
                    {...register('summary')}
                    placeholder="Resumo breve sobre voce"
                    rows={3}
                    className="border p-2 rounded w-full"
                  />
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">Experiencia Profissional</h3>
                  <div className="space-y-4">
                    {expFields.map((f, idx) => (
                      <div key={f.id} className="border p-3 rounded bg-gray-50">
                        <input
                          {...register(`experience.${idx}.company` as const)}
                          placeholder="Empresa"
                          className="border p-2 rounded w-full mb-2"
                        />
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <input {...register(`experience.${idx}.period_start` as const)} placeholder="Inicio" className="border p-2 rounded" />
                          <input {...register(`experience.${idx}.period_end` as const)} placeholder="Fim" className="border p-2 rounded" />
                        </div>
                        <textarea {...register(`experience.${idx}.description` as const)} placeholder="Descricao" className="border p-2 rounded w-full mb-2" />
                        <button
                          type="button"
                          onClick={() => expRemove(idx)}
                          className="text-red-600 text-sm hover:text-red-800"
                        >
                          Remover
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => expAppend({ company: '', period_start: '', period_end: '', description: '' })}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      + Adicionar Experiencia
                    </button>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">Educacao</h3>
                  <div className="space-y-4">
                    {edFields.map((f, idx) => (
                      <div key={f.id} className="border p-3 rounded bg-gray-50">
                        <input
                          {...register(`education.${idx}.institution` as const)}
                          placeholder="Instituicao"
                          className="border p-2 rounded w-full mb-2"
                        />
                        <input {...register(`education.${idx}.diploma` as const)} placeholder="Diploma" className="border p-2 rounded w-full mb-2" />
                        <button
                          type="button"
                          onClick={() => edRemove(idx)}
                          className="text-red-600 text-sm hover:text-red-800"
                        >
                          Remover
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => edAppend({ institution: '', diploma: '', area: '' })}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      + Adicionar Educacao
                    </button>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">Habilidades</h3>
                  <div className="space-y-2">
                    {skillFields.map((s, idx) => (
                      <div key={s.id} className="flex gap-2">
                        <input
                          {...register(`skills.${idx}` as const)}
                          placeholder={`Habilidade ${idx + 1}`}
                          className="border p-2 rounded flex-1"
                        />
                        <button type="button" onClick={() => skillRemove(idx)} className="text-red-600 hover:text-red-800">
                          x
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => skillAppend('')}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      + Habilidade
                    </button>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">Redes / Links</h3>
                  <div className="space-y-2">
                    {socialFields.map((s, idx) => (
                      <div key={s.id} className="flex gap-2">
                        <input
                          {...register(`social_links.${idx}` as const)}
                          placeholder="https://..."
                          className="border p-2 rounded flex-1"
                        />
                        <button type="button" onClick={() => socialRemove(idx)} className="text-red-600 hover:text-red-800">
                          x
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => socialAppend('')}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      + Link
                    </button>
                  </div>
                </section>

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" disabled={saving}>
                    {saving ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => onPrint?.()}
                    className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
                  >
                    Baixar PDF
                  </button>
                </div>
              </form>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Pre-visualizacao</h3>
              <div ref={previewRef} className="bg-white border rounded p-4">
                {memoizedPreview}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
