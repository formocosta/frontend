'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BookOpen, Plus, Edit, Trash2, ChevronDown, ChevronRight, FolderOpen } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/common/form/Button';
import { Input } from '@/components/common/form/Input';
import { Textarea } from '@/components/common/form/Textarea';
import { Badge } from '@/components/common/ui/Badge';
import { Modal, ConfirmModal } from '@/components/common/ui/Modal';
import { useCatalogo } from '@/hooks/finance/finance.hooks';
import { Categoria } from '@/shared/types/backoffice/finance.types';
import {
  criarCategoriaSchema,
  CriarCategoriaFormData,
  criarSubcategoriaSchema,
  CriarSubcategoriaFormData,
} from '@/shared/schemas/finance.schema';

export default function CatalogoPage() {
  const {
    categorias, loading, error, fetchCategorias,
    criarCategoria, actualizarCategoria, eliminarCategoria,
    criarSubcategoria,
  } = useCatalogo();

  const [showCriarModal, setShowCriarModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [showEliminarModal, setShowEliminarModal] = useState(false);
  const [showSubcategoriaModal, setShowSubcategoriaModal] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const criarForm = useForm({
    resolver: zodResolver(criarCategoriaSchema),
    defaultValues: { nome: '', descricao: '', activa: true, ordem: 0 },
  });

  const editarForm = useForm({
    resolver: zodResolver(criarCategoriaSchema),
  });

  const subcategoriaForm = useForm({
    resolver: zodResolver(criarSubcategoriaSchema),
  });

  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  useEffect(() => {
    if (selectedCategoria && showEditarModal) {
      editarForm.reset({
        nome: selectedCategoria.nome,
        descricao: selectedCategoria.descricao || '',
        activa: selectedCategoria.activa,
        ordem: selectedCategoria.ordem,
      });
    }
  }, [selectedCategoria, showEditarModal, editarForm]);

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleCriar(data: CriarCategoriaFormData) {
    setActionLoading(true);
    const formData = new FormData();
    formData.append('nome', data.nome);
    if (data.descricao) formData.append('descricao', data.descricao);
    formData.append('activa', data.activa ? '1' : '0');
    formData.append('ordem', String(data.ordem));
    if (data.icone && data.icone.length > 0) {
      formData.append('icone', data.icone[0]);
    }

    const success = await criarCategoria(formData);
    if (success) {
      setShowCriarModal(false);
      criarForm.reset();
    }
    setActionLoading(false);
  }

  async function handleEditar(data: CriarCategoriaFormData) {
    if (!selectedCategoria) return;
    setActionLoading(true);
    const formData = new FormData();
    formData.append('nome', data.nome);
    if (data.descricao) formData.append('descricao', data.descricao);
    formData.append('activa', data.activa ? '1' : '0');
    formData.append('ordem', String(data.ordem));
    formData.append('_method', 'PATCH');
    if (data.icone && data.icone.length > 0) {
      formData.append('icone', data.icone[0]);
    }

    const success = await actualizarCategoria(selectedCategoria.id, formData);
    if (success) {
      setShowEditarModal(false);
      setSelectedCategoria(null);
    }
    setActionLoading(false);
  }

  async function handleEliminar() {
    if (!selectedCategoria) return;
    setActionLoading(true);
    const success = await eliminarCategoria(selectedCategoria.id);
    if (success) {
      setShowEliminarModal(false);
      setSelectedCategoria(null);
    }
    setActionLoading(false);
  }

  async function handleSubcategoria(data: CriarSubcategoriaFormData) {
    if (!selectedCategoria) return;
    setActionLoading(true);
    const success = await criarSubcategoria(selectedCategoria.id, data);
    if (success) {
      setShowSubcategoriaModal(false);
      subcategoriaForm.reset();
    }
    setActionLoading(false);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Catálogo"
        description="Gestão de categorias e subcategorias de serviços"
        action={
          <Button size="sm" onClick={() => setShowCriarModal(true)} leftIcon={<Plus size={14} />}>
            Nova Categoria
          </Button>
        }
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 font-medium">
          {error}
        </div>
      )}

      {loading && categorias.length === 0 && (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100/80 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-2 border-[#42b883] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 mt-4 font-medium">A carregar categorias...</p>
        </div>
      )}

      {!loading && categorias.length === 0 && (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100/80 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mb-4">
            <BookOpen size={28} />
          </div>
          <h3 className="text-base font-bold text-gray-900">Sem categorias</h3>
          <p className="text-xs text-gray-500 mt-1.5 max-w-sm font-medium">
            Crie a primeira categoria para organizar os serviços.
          </p>
        </div>
      )}

      {!loading && categorias.length > 0 && (
        <div className="space-y-3">
          {categorias.map((cat) => {
            const isExpanded = expandedIds.has(cat.id);
            return (
              <div key={cat.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="flex items-center gap-4 p-4">
                  <button
                    onClick={() => toggleExpand(cat.id)}
                    className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
                  >
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {cat.icone_url && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={cat.icone_url} alt={cat.nome} className="w-8 h-8 rounded-md object-cover border border-gray-100" />
                      )}
                      <h3 className="text-[13px] font-bold text-gray-900">{cat.nome}</h3>
                      <Badge variant={cat.activa ? 'success' : 'danger'} size="sm">
                        {cat.activa ? 'Activa' : 'Inactiva'}
                      </Badge>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {cat.subcategorias?.length || 0} subcategorias
                      </span>
                    </div>
                    {cat.descricao && (
                      <p className="text-[11px] text-gray-500 font-medium mt-0.5">{cat.descricao}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedCategoria(cat);
                        setShowSubcategoriaModal(true);
                      }}
                      leftIcon={<Plus size={14} />}
                    >
                      Sub
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedCategoria(cat);
                        setShowEditarModal(true);
                      }}
                      leftIcon={<Edit size={14} />}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedCategoria(cat);
                        setShowEliminarModal(true);
                      }}
                      leftIcon={<Trash2 size={14} />}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>

                {/* Subcategorias */}
                {isExpanded && cat.subcategorias && cat.subcategorias.length > 0 && (
                  <div className="border-t border-gray-50 bg-gray-50/50 px-4 py-3">
                    <div className="space-y-2">
                      {cat.subcategorias.map((sub) => (
                        <div key={sub.id} className="flex items-center justify-between py-2 px-3 bg-white rounded-lg border border-gray-100">
                          <div className="flex items-center gap-2">
                            <FolderOpen size={14} className="text-gray-400" />
                            <span className="text-[12px] font-semibold text-gray-700">{sub.nome}</span>
                            <Badge variant={sub.activa ? 'success' : 'danger'} size="sm">
                              {sub.activa ? 'Activa' : 'Inactiva'}
                            </Badge>
                          </div>
                          {sub.descricao && (
                            <span className="text-[11px] text-gray-500">{sub.descricao}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {isExpanded && (!cat.subcategorias || cat.subcategorias.length === 0) && (
                  <div className="border-t border-gray-50 bg-gray-50/50 px-4 py-4 text-center">
                    <p className="text-[11px] text-gray-400 font-medium">Sem subcategorias</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Criar Categoria */}
      <Modal
        isOpen={showCriarModal}
        onClose={() => { setShowCriarModal(false); criarForm.reset(); }}
        title="Nova Categoria"
        footer={
          <>
            <Button variant="outline" onClick={() => { setShowCriarModal(false); criarForm.reset(); }} disabled={actionLoading}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={criarForm.handleSubmit(handleCriar)} isLoading={actionLoading}>
              Criar
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Input label="Nome" placeholder="Ex: Canalização" error={criarForm.formState.errors.nome?.message} {...criarForm.register('nome')} />
          <Textarea label="Descrição" placeholder="Descrição opcional..." error={criarForm.formState.errors.descricao?.message} rows={2} {...criarForm.register('descricao')} />
          <Input type="file" label="Ícone" accept="image/*" error={criarForm.formState.errors.icone?.message as string} {...criarForm.register('icone')} />
        </form>
      </Modal>

      {/* Modal: Editar Categoria */}
      <Modal
        isOpen={showEditarModal}
        onClose={() => { setShowEditarModal(false); setSelectedCategoria(null); }}
        title="Editar Categoria"
        footer={
          <>
            <Button variant="outline" onClick={() => { setShowEditarModal(false); setSelectedCategoria(null); }} disabled={actionLoading}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={editarForm.handleSubmit(handleEditar)} isLoading={actionLoading}>
              Guardar
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Input label="Nome" error={editarForm.formState.errors.nome?.message} {...editarForm.register('nome')} />
          <Textarea label="Descrição" error={editarForm.formState.errors.descricao?.message} rows={2} {...editarForm.register('descricao')} />
          <div className="space-y-1">
            <Input type="file" label="Ícone (Deixe vazio para manter o atual)" accept="image/*" error={editarForm.formState.errors.icone?.message as string} {...editarForm.register('icone')} />
            {selectedCategoria?.icone_url && (
              <div className="mt-2 text-sm text-gray-500">
                <span>Ícone atual: </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selectedCategoria.icone_url} alt="Ícone atual" className="inline w-8 h-8 rounded-md object-cover border border-gray-100 ml-2" />
              </div>
            )}
          </div>
        </form>
      </Modal>

      {/* Modal: Eliminar */}
      <ConfirmModal
        isOpen={showEliminarModal}
        onClose={() => { setShowEliminarModal(false); setSelectedCategoria(null); }}
        onConfirm={handleEliminar}
        title="Eliminar Categoria"
        message={`Tem a certeza que deseja eliminar a categoria "${selectedCategoria?.nome}"? Esta acção irá desactivá-la.`}
        confirmLabel="Eliminar"
        variant="danger"
        loading={actionLoading}
      />

      {/* Modal: Criar Subcategoria */}
      <Modal
        isOpen={showSubcategoriaModal}
        onClose={() => { setShowSubcategoriaModal(false); setSelectedCategoria(null); subcategoriaForm.reset(); }}
        title={`Nova Subcategoria — ${selectedCategoria?.nome || ''}`}
        footer={
          <>
            <Button variant="outline" onClick={() => { setShowSubcategoriaModal(false); setSelectedCategoria(null); subcategoriaForm.reset(); }} disabled={actionLoading}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={subcategoriaForm.handleSubmit(handleSubcategoria)} isLoading={actionLoading}>
              Criar
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Input label="Nome" placeholder="Ex: Reparação de canos" error={subcategoriaForm.formState.errors.nome?.message} {...subcategoriaForm.register('nome')} />
          <Textarea label="Descrição" placeholder="Descrição opcional..." error={subcategoriaForm.formState.errors.descricao?.message} rows={2} {...subcategoriaForm.register('descricao')} />
        </form>
      </Modal>
    </div>
  );
}
