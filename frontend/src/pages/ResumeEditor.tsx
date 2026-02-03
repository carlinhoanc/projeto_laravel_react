import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import ResumePreview from '../components/ResumePreview';
import PhotoCropModal from '../components/PhotoCropModal';
import { HTMLEditor } from '../components/HTMLEditor';
import { useReactToPrint } from 'react-to-print';
import MaskedInput from 'react-input-mask';
import * as resumesApi from '../api/resumes';
import { getCurrentUser, getUsers } from '../auth';

function appendFormData(formData: FormData, value: any, key?: string) {
  if (value === undefined || value === null || key === undefined) return;

  if (value instanceof Date) {
    formData.append(key, value.toISOString());
    return;
  }

  if (value instanceof Blob) {
    formData.append(key, value);
    return;
  }

  // Campos que devem ser enviados como JSON
  const jsonFields = ['personal_info', 'social_links', 'experience', 'education', 'licenses', 'skills', 'interests'];
  if (jsonFields.includes(key)) {
    const jsonStr = JSON.stringify(value);
    if (key === 'education' || key === 'experience') {
      console.log(`${key} field being serialized:`, value);
      console.log(`${key} JSON:`, jsonStr);
    }
    formData.append(key, jsonStr);
    return;
  }

  if (Array.isArray(value) || value instanceof FileList) {
    if (Array.from(value).length === 0) {
      formData.append(key, JSON.stringify([]));
      return;
    }
    formData.append(key, JSON.stringify(Array.from(value)));
    return;
  }

  if (typeof value === 'object') {
    formData.append(key, JSON.stringify(value));
    return;
  }

  formData.append(key, value as any);
}

export default function ResumeEditor() {
  const { register, control, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm<any>({
    defaultValues: {
      personal_info: { name: '', email: '', phone: '', city: '', country: '' },
      birth_date: '',
      experience: [],
      education: [],
      skills: [''],
      social_links: [''],
      summary: '',
      licenses: [],
      interests: [],
      sidebar_bg_color: '#f3f4f6',
      sidebar_text_color: '#111827',
    },
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
  const [croppedPhotoFile, setCroppedPhotoFile] = useState<File | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const params = useParams();
  const navigate = useNavigate();

  const normalizeDateInput = useCallback((value: unknown) => {
    if (!value) return '';
    const str = String(value);
    if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
      return str.substring(0, 10);
    }
    const date = new Date(str);
    if (Number.isNaN(date.getTime())) return '';
    return date.toISOString().substring(0, 10);
  }, []);

  const normalizeEducation = useCallback((education: any) => {
    if (!Array.isArray(education)) return [];
    return education.map(item => ({
      institution: item.institution || '',
      diploma: item.diploma || '',
      area: item.area || '',
      location: item.location || '',
      period_start: item.period_start || '',
      period_end: item.period_end || '',
    }));
  }, []);

  const normalizeExperience = useCallback((experience: any) => {
    if (!Array.isArray(experience)) return [];
    return experience.map(item => ({
      company: item.company || '',
      title: item.title || '',
      description: item.description || '',
      location: item.location || '',
      period_start: item.period_start || '',
      period_end: item.period_end || '',
    }));
  }, []);

  useEffect(() => {
    (async () => {
      // Carrega usuário atual e lista de usuários (se admin)
      try {
        const userData = await getCurrentUser();
        if (userData) {
          setCurrentUser(userData.user);
          if (userData.user.access_level === 'admin') {
            const users = await getUsers();
            setAvailableUsers(users);
          }
        }
      } catch (e) {
        console.error('Erro ao carregar usuário:', e);
      }

      if (params.id) {
        setLoading(true);
        setLoadError(null);
        try {
          console.log('ResumeEditor: loading resume with id', params.id);
          const data = await resumesApi.getResume(params.id);
          console.log('ResumeEditor: loaded data', data);
          const resume = data.data ? data.data : data;
          console.log('ResumeEditor: extracted resume', resume);
          reset({
            ...resume,
            user_id: resume.user_id || '',
            birth_date: normalizeDateInput(resume.birth_date),
            experience: normalizeExperience(resume.experience),
            education: normalizeEducation(resume.education),
            skills: resume.skills && resume.skills.length > 0 ? resume.skills : [''],
            social_links: resume.social_links && resume.social_links.length > 0 ? resume.social_links : [''],
            licenses: resume.licenses || [],
            interests: resume.interests || [],
          });
          setPhotoPreview(resume.photo_url || null);
          console.log('ResumeEditor: form reset complete');
        } catch (e: any) {
          console.error('ResumeEditor: Failed to load resume', e);
          setLoadError(e.message || 'Erro ao carregar currículo');
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [params.id, reset, normalizeEducation, normalizeExperience]);

  const { fields: expFields, append: expAppend, remove: expRemove } = useFieldArray({ control, name: 'experience' });
  const { fields: edFields, append: edAppend, remove: edRemove } = useFieldArray({ control, name: 'education' });
  const { fields: skillFields, append: skillAppend, remove: skillRemove } = useFieldArray({ control, name: 'skills' });
  const { fields: socialFields, append: socialAppend, remove: socialRemove } = useFieldArray({ control, name: 'social_links' });

  const previewRef = useRef<HTMLDivElement>(null);
  const onPrint = useReactToPrint({ content: () => previewRef.current });

  const watchedPhoto = watch('photo');

  const handlePhotoSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setCroppedPhotoFile(null);
      setSelectedPhotoFile(files[0]);
      setShowPhotoModal(true);
    }
  }, []);

  const handlePhotoModalClose = useCallback(() => {
    setShowPhotoModal(false);
  }, []);

  const handleCropComplete = useCallback((croppedBlob: Blob) => {
    console.log('handleCropComplete called with blob size:', croppedBlob.size);
    const croppedFile = new File([croppedBlob], 'photo.jpg', { type: 'image/jpeg' });
    console.log('Created cropped file:', croppedFile.name, croppedFile.size);
    setCroppedPhotoFile(croppedFile);
    
    const objectUrl = URL.createObjectURL(croppedBlob);
    setPhotoPreview(objectUrl);
    
    setShowPhotoModal(false);
  }, []);

  const onSubmit = useCallback(async (data: any) => {
    setSaving(true);
    try {
      const payload = { ...data };
      
      delete payload.id;
      delete payload.created_at;
      delete payload.updated_at;
      delete payload.user;
      
      console.log('Payload after cleanup:', payload);
      
      if (Array.isArray(payload.skills)) {
        payload.skills = payload.skills.filter((s: string) => !!s && s.trim() !== '');
      }
      if (Array.isArray(payload.social_links)) {
        payload.social_links = payload.social_links.filter((s: string) => !!s && s.trim() !== '');
      }

      const formData = new FormData();
      const { photo, photo_url, photo_path, ...rest } = payload as any;

      console.log('Rest data to append:', rest);
      Object.entries(rest).forEach(([key, value]) => appendFormData(formData, value, key));

      console.log('croppedPhotoFile:', croppedPhotoFile);
      if (croppedPhotoFile) {
        console.log('Appending cropped photo:', croppedPhotoFile.name, croppedPhotoFile.size);
        formData.append('photo', croppedPhotoFile);
      } else {
        console.log('No cropped photo file to append');
      }

      const formDataEntries = Array.from(formData.entries()).map(([k, v]) => [k, v instanceof File ? `[File: ${v.name}]` : v]);
      console.log('FormData entries:', formDataEntries);

      if (params.id) {
        const result = await resumesApi.updateResume(params.id, formData);
        console.log('Update response:', result);
        alert('Currículo atualizado');
      } else {
        const result = await resumesApi.createResume(formData);
        console.log('Create response:', result);
        alert('Currículo criado');
      }
      navigate('/resumes');
    } catch (e: any) {
      console.error('Save failed', e);
      const msg = e?.message || 'Falha ao salvar currículo';
      alert(msg);
    } finally {
      setSaving(false);
    }
  }, [params.id, navigate, croppedPhotoFile]);

  const formValues = watch();
  const resumeForPreview = useMemo(() => ({
    ...formValues,
    photo_url: photoPreview || (formValues as any)?.photo_url,
  }), [formValues, photoPreview]);
  const memoizedPreview = useMemo(() => <ResumePreview resume={resumeForPreview} />, [resumeForPreview]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Editor de Currículo</h2>
        <button
          type="button"
          onClick={() => setShowPreviewModal(true)}
          className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center gap-2"
        >
          <span>👁️</span>
          <span>Pré-visualizar</span>
        </button>
      </div>

      {loadError && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
          <strong>Erro:</strong> {loadError}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Carregando currículo...</p>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {currentUser?.access_level === 'admin' && availableUsers.length > 0 && (
                  <section className="bg-yellow-50 border border-yellow-300 rounded p-4">
                    <h3 className="text-lg font-semibold mb-3 text-yellow-800">Configuração Admin</h3>
                    <div>
                      <label className="block text-sm font-medium mb-1">Usuário Proprietário</label>
                      <select
                        {...register('user_id')}
                        className="border p-2 rounded w-full"
                      >
                        <option value="">Selecione um usuário</option>
                        {availableUsers.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.name} ({user.email})
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-600 mt-1">Como admin, você pode alterar o proprietário deste currículo</p>
                    </div>
                  </section>
                )}

                <section>
                  <h3 className="text-lg font-semibold mb-3">Dados Pessoais</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm font-medium mb-1">Foto</label>
                      <input
                        {...register('photo')}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoSelect}
                        className="border p-2 rounded w-full"
                      />
                      {photoPreview && (
                        <div className="mt-2">
                          <img src={photoPreview} alt="Preview da foto" className="w-24 h-24 object-cover rounded border" />
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Cor de fundo da coluna</label>
                        <input
                          {...register('sidebar_bg_color')}
                          type="color"
                          className="border p-2 rounded w-full h-12"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Cor da fonte da coluna</label>
                        <input
                          {...register('sidebar_text_color')}
                          type="color"
                          className="border p-2 rounded w-full h-12"
                        />
                      </div>
                    </div>
                    <input
                      {...register('personal_info.name', { required: 'Nome obrigatório' })}
                      placeholder="Nome completo"
                      className="border p-2 rounded w-full"
                    />
                    {(errors as any).personal_info?.name && (
                      <div className="text-sm text-red-600">{(errors as any).personal_info.name.message}</div>
                    )}

                    <input
                      {...register('personal_info.email', {
                        required: 'Email obrigatório',
                        pattern: { 
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 
                          message: 'Email inválido' 
                        },
                      })}
                      placeholder="Email"
                      className="border p-2 rounded w-full"
                    />
                    {(errors as any).personal_info?.email && (
                      <div className="text-sm text-red-600">{(errors as any).personal_info.email.message}</div>
                    )}

                    <MaskedInput
                      {...register('personal_info.phone')}
                      mask="(99) 99999-9999"
                      placeholder="Telefone"
                      className="border p-2 rounded w-full"
                    />
                    <input {...register('personal_info.city')} placeholder="Cidade" className="border p-2 rounded w-full" />
                    <input {...register('birth_date')} type="date" placeholder="Data de Nascimento" className="border p-2 rounded w-full" />
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">Resumo Profissional</h3>
                  <HTMLEditor
                    value={watch('summary')}
                    onChange={(val) => setValue('summary', val)}
                    placeholder="Resumo breve sobre você..."
                    height={200}
                  />
                </section>

                <section>
                    <h3 className="text-lg font-semibold mb-3">Experiência Profissional</h3>
                  <div className="space-y-4">
                    {expFields.map((f, idx) => (
                      <div key={f.id} className="border p-3 rounded bg-gray-50">
                        <input
                          {...register(`experience.${idx}.company` as const)}
                          placeholder="Empresa"
                          className="border p-2 rounded w-full mb-2"
                        />
                        <input
                          {...register(`experience.${idx}.title` as const)}
                          placeholder="Cargo"
                          className="border p-2 rounded w-full mb-2"
                        />
                        <input
                          {...register(`experience.${idx}.location` as const)}
                          placeholder="Local"
                          className="border p-2 rounded w-full mb-2"
                        />
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <MaskedInput
                            {...register(`experience.${idx}.period_start` as const)}
                            mask="99/9999"
                            placeholder="Início (MM/AAAA)"
                            className="border p-2 rounded"
                          />
                          <MaskedInput
                            {...register(`experience.${idx}.period_end` as const)}
                            mask="99/9999"
                            placeholder="Fim (MM/AAAA)"
                            className="border p-2 rounded"
                          />
                        </div>
                        <div className="mb-2">
                          <HTMLEditor
                            value={watch(`experience.${idx}.description` as const) || ''}
                            onChange={(val) => setValue(`experience.${idx}.description` as const, val)}
                            placeholder="Descrição da experiência..."
                            height={150}
                          />
                        </div>
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
                      onClick={() => expAppend({ company: '', title: '', location: '', period_start: '', period_end: '', description: '' })}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      + Adicionar Experiência
                    </button>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">Educação</h3>
                  <div className="space-y-4">
                    {edFields.map((f, idx) => (
                      <div key={f.id} className="border p-3 rounded bg-gray-50">
                        <input
                          {...register(`education.${idx}.institution` as const)}
                          placeholder="Instituição"
                          className="border p-2 rounded w-full mb-2"
                        />
                        <input {...register(`education.${idx}.diploma` as const)} placeholder="Diploma" className="border p-2 rounded w-full mb-2" />
                        <input {...register(`education.${idx}.area` as const)} placeholder="Área de Estudo" className="border p-2 rounded w-full mb-2" />
                        <input {...register(`education.${idx}.location` as const)} placeholder="Local" className="border p-2 rounded w-full mb-2" />
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <MaskedInput
                            {...register(`education.${idx}.period_start` as const)}
                            mask="99/9999"
                            placeholder="Início (MM/AAAA)"
                            className="border p-2 rounded"
                          />
                          <MaskedInput
                            {...register(`education.${idx}.period_end` as const)}
                            mask="99/9999"
                            placeholder="Fim (MM/AAAA)"
                            className="border p-2 rounded"
                          />
                        </div>
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
                      onClick={() => edAppend({ institution: '', diploma: '', area: '', location: '', period_start: '', period_end: '' })}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      + Adicionar Educação
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

                <div className="flex gap-3 pt-4 flex-wrap">
                  <button
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    disabled={saving}
                  >
                    {saving ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    disabled={saving}
                  >
                    {saving ? 'Salvando...' : 'Salvar e voltar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPreviewModal(true)}
                    className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                  >
                    👁️ Pré-visualizar
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
        </>
      )}

      <PhotoCropModal
        isOpen={showPhotoModal}
        imageFile={selectedPhotoFile}
        onClose={handlePhotoModalClose}
        onCropComplete={handleCropComplete}
      />

      {/* Modal de Pré-visualização */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4" onClick={() => setShowPreviewModal(false)}>
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center z-10">
              <h3 className="text-xl font-semibold">Pré-visualização do Currículo</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => onPrint?.()}
                  className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
                >
                  📄 Baixar PDF
                </button>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  ✕ Fechar
                </button>
              </div>
            </div>
            <div ref={previewRef} className="p-6">
              {memoizedPreview}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
