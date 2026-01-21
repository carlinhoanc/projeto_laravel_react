import React, { useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import ResumePreview from '../components/ResumePreview';
import { useReactToPrint } from 'react-to-print';

export default function ResumeEditor() {
  const { register, control, handleSubmit, watch } = useForm({
    defaultValues: {
      personal_info: { name: '', email: '', phone: '', city: '', country: '' },
      experience: [],
      education: [],
      skills: [''],
      summary: '',
    },
  });

  const { fields: expFields, append: expAppend, remove: expRemove } = useFieldArray({ control, name: 'experience' });
  const { fields: edFields, append: edAppend, remove: edRemove } = useFieldArray({ control, name: 'education' });

  const previewRef = useRef<HTMLDivElement>(null);
  const onPrint = useReactToPrint({ content: () => previewRef.current });

  const onSubmit = async (data: any) => {
    console.log('Submitting', data);
    // save via API
  };

  const formValues = watch();

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Editor de Currículo</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold mb-2">Dados Pessoais</h3>
          <div className="grid grid-cols-2 gap-4">
            <input {...register('personal_info.name')} placeholder="Nome" className="border p-2 rounded" />
            <input {...register('personal_info.email')} placeholder="Email" className="border p-2 rounded" />
            <input {...register('personal_info.phone')} placeholder="Telefone" className="border p-2 rounded" />
            <input {...register('personal_info.city')} placeholder="Cidade" className="border p-2 rounded" />
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">Experiência</h3>
          <div className="space-y-3">
            {expFields.map((f, idx) => (
              <div key={f.id} className="border p-3 rounded">
                <input {...register(`experience.${idx}.company` as const)} placeholder="Empresa" className="border p-2 rounded w-full mb-2" />
                <div className="grid grid-cols-2 gap-2">
                  <input {...register(`experience.${idx}.period_start` as const)} placeholder="Início" className="border p-2 rounded" />
                  <input {...register(`experience.${idx}.period_end` as const)} placeholder="Fim" className="border p-2 rounded" />
                </div>
                <textarea {...register(`experience.${idx}.description` as const)} placeholder="Descrição" className="border p-2 rounded w-full mt-2" />
                <button type="button" onClick={() => expRemove(idx)} className="mt-2 text-sm text-red-600">Remover</button>
              </div>
            ))}
            <button type="button" onClick={() => expAppend({ company: '', period_start: '', period_end: '', description: '' })} className="px-3 py-1 bg-gray-200 rounded">Adicionar Experiência</button>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">Formação</h3>
          <div className="space-y-3">
            {edFields.map((f, idx) => (
              <div key={f.id} className="border p-3 rounded">
                <input {...register(`education.${idx}.institution` as const)} placeholder="Instituição" className="border p-2 rounded w-full mb-2" />
                <input {...register(`education.${idx}.diploma` as const)} placeholder="Diploma" className="border p-2 rounded w-full mb-2" />
                <button type="button" onClick={() => edRemove(idx)} className="mt-2 text-sm text-red-600">Remover</button>
              </div>
            ))}
            <button type="button" onClick={() => edAppend({ institution: '', diploma: '', area: '' })} className="px-3 py-1 bg-gray-200 rounded">Adicionar Educação</button>
          </div>
        </section>

        <div className="flex items-center gap-3">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Salvar</button>
          <button type="button" onClick={() => onPrint?.()} className="px-4 py-2 bg-gray-800 text-white rounded">Baixar PDF</button>
        </div>
      </form>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Pré-visualização</h3>
        <div>
          <div ref={previewRef} className="bg-white p-4">
            <ResumePreview resume={formValues} />
          </div>
        </div>
      </div>
    </div>
  );
}
