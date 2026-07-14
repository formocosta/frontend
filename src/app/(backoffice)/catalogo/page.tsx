'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BookOpen, Plus, Edit, Trash2, ChevronDown, 
         ChevronRight, FolderOpen, LayoutGrid } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/common/form/Button';
import { Input } from '@/components/common/form/Input';
import { Textarea } from '@/components/common/form/Textarea';
import { Badge } from '@/components/common/ui/Badge';
import { Modal, ConfirmModal } from '@/components/common/ui/Modal';
import { FilterBar } from '@/components/common/FilterBar';
import { useCatalogo } from '@/hooks/finance/finance.hooks';
import { Categoria } from '@/shared/types/backoffice/finance.types';
import {
  criarCategoriaSchema,
  criarSubcategoriaSchema,
  CriarCategoriaFormData,
  CriarSubcategoriaFormData,
} from '@/shared/schemas/finance.schema';

export default function CatalogoPage() {
  const {
    categorias = [], loading, error, fetchCategorias,
    criarCategoria, actualizarCategoria, eliminarCategoria,
    criarSubcategoria, actualizarSubcategoria
  } = useCatalogo();

  const [search, setSearch] = useState('');
  const [showCriarModal, setShowCriarModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [showEliminarModal, setShowEliminarModal] = useState(false);
  
  const [showSubcategoriaModal, setShowSubcategoriaModal] = useState(false);
  const [showEditarSubcategoriaModal, setShowEditarSubcategoriaModal] = useState(false);
  
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);
  const [selectedSubcategoria, setSelectedSubcategoria] = useState<any | null>(null);
  
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
    defaultValues: { nome: '', descricao: '' },
  });
  
  const editarSubcategoriaForm = useForm({
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
  
  useEffect(() => {
    if (selectedSubcategoria && showEditarSubcategoriaModal) {
      editarSubcategoriaForm.reset({
        nome: selectedSubcategoria.nome,
        descricao: selectedSubcategoria.descricao || '',
      });
    }
  }, [selectedSubcategoria, showEditarSubcategoriaModal, editarSubcategoriaForm]);

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
      
      // Auto-expand the category after adding a subcategory so the user can see it
      setExpandedIds((prev) => {
        const next = new Set(prev);
        next.add(selectedCategoria.id);
        return next;
      });
    }
    setActionLoading(false);
  }
  
  async function handleEditarSubcategoria(data: any) {
    if (!selectedSubcategoria) return;
    setActionLoading(true);
    const success = await actualizarSubcategoria(selectedSubcategoria.id, data);
    if (success) {
      setShowEditarSubcategoriaModal(false);
      setSelectedSubcategoria(null);
    }
    setActionLoading(false);
  }

  // Filter localmente as categorias pelo nome
  const safeCategorias = Array.isArray(categorias) ? categorias : [];
  const filteredCategorias = safeCategorias.filter((cat) => 
    cat.nome.toLowerCase().includes(search.toLowerCase()) || 
    (cat.descricao && cat.descricao.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Catálogo de Serviços"
        description="Gestão estruturada de categorias e subcategorias oferecidas na plataforma."
        action={
          <Button 
            className="rounded-sm font-bold shadow-sm"
            onClick={() => setShowCriarModal(true)} 
            leftIcon={<Plus size={14} strokeWidth={2.5} />}
          >
            Nova Categoria
          </Button>
        }
      />

      <FilterBar
        searchPlaceholder="Pesquisar categoria pelo nome ou descrição..."
        searchValue={search}
        onSearchChange={setSearch}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-sm p-4 text-sm text-red-700 font-bold shadow-sm">
          {error}
        </div>
      )}

      {loading && safeCategorias.length === 0 && (
        <div className="bg-white rounded-sm p-12 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-2 border-[#42b883] border-t-transparent rounded-sm animate-spin" />
          <p className="text-sm text-gray-500 mt-4 font-black tracking-tight">A carregar catálogo...</p>
        </div>
      )}

      {!loading && safeCategorias.length === 0 && (
        <div className="bg-white rounded-sm p-12 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-sm bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 mb-4 shadow-inner">
            <BookOpen size={28} />
          </div>
          <h3 className="text-[15px] font-black text-gray-900 tracking-tight">Catálogo Vazio</h3>
          <p className="text-[12px] text-gray-500 mt-1.5 max-w-sm font-semibold">
            Crie a sua primeira categoria principal para começar a organizar os serviços oferecidos.
          </p>
        </div>
      )}
      
      {!loading && safeCategorias.length > 0 && filteredCategorias.length === 0 && (
         <div className="bg-white rounded-sm p-12 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col items-center justify-center text-center">
          <p className="text-[12px] text-gray-500 font-bold">Nenhum resultado encontrado para "{search}"</p>
        </div>
      )}

      {!loading && filteredCategorias.length > 0 && (
        <div className="space-y-4">
          {filteredCategorias.map((cat) => {
            const isExpanded = expandedIds.has(cat.id);
            return (
              <div key={cat.id} className="bg-white rounded-sm border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden transition-all hover:border-gray-200">
                <div className="flex items-center justify-between p-4 bg-white group">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <button
                      onClick={() => toggleExpand(cat.id)}
                      className={`w-9 h-9 rounded-sm flex items-center justify-center transition-colors shrink-0 ${isExpanded ? 'bg-gray-100 text-gray-600' : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
                    >
                      {isExpanded ? <ChevronDown size={18} strokeWidth={2.5} /> : <ChevronRight size={18} strokeWidth={2.5} />}
                    </button>
  
                    <div className="flex items-center gap-3 min-w-0">
                      {cat.icone_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={cat.icone_url} alt={cat.nome} className="w-10 h-10 rounded-sm object-cover border border-gray-100 shadow-sm shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-sm bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                           <LayoutGrid size={16} />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                           <h3 className="text-[14px] font-black text-gray-900 tracking-tight truncate group-hover:text-[#42b883] transition-colors">{cat.nome}</h3>
                           <Badge variant={cat.activa ? 'success' : 'danger'} size="sm">
                             {cat.activa ? 'Activa' : 'Inactiva'}
                           </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                           <span className="text-[11px] text-gray-500 font-bold bg-gray-50 px-1.5 py-0.5 rounded-sm border border-gray-100">
                             {cat.subcategorias?.length || 0} subcategorias
                           </span>
                           {cat.descricao && (
                             <p className="text-[11px] text-gray-500 font-medium truncate max-w-[300px]">{cat.descricao}</p>
                           )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      variant="outline"
                      className="h-8 rounded-sm bg-white border-gray-200 text-gray-600 font-bold hover:bg-gray-50 hover:text-gray-900 text-[11px] px-2.5"
                      onClick={() => {
                        setSelectedCategoria(cat);
                        setShowSubcategoriaModal(true);
                      }}
                      leftIcon={<Plus size={14} />}
                    >
                      Subcategoria
                    </Button>
                    <div className="w-px h-6 bg-gray-200 mx-1 hidden sm:block"></div>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 rounded-sm text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                      onClick={() => {
                        setSelectedCategoria(cat);
                        setShowEditarModal(true);
                      }}
                      title="Editar Categoria"
                    >
                      <Edit size={15} />
                    </Button>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 rounded-sm text-gray-400 hover:text-red-600 hover:bg-red-50"
                      onClick={() => {
                        setSelectedCategoria(cat);
                        setShowEliminarModal(true);
                      }}
                      title="Eliminar Categoria"
                    >
                      <Trash2 size={15} />
                    </Button>
                  </div>
                </div>

                {/* Subcategorias Expanded View */}
                {isExpanded && cat.subcategorias && cat.subcategorias.length > 0 && (
                  <div className="border-t border-gray-100 bg-gray-50/50 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {cat.subcategorias.map((sub) => (
                        <div key={sub.id} className="flex items-start justify-between p-3 bg-white rounded-sm border border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] group hover:border-[#42b883]/30 hover:shadow-md transition-all">
                          <div className="flex items-start gap-2.5 min-w-0 pr-2">
                            <div className="mt-0.5">
                              <FolderOpen size={14} className="text-[#42b883]" />
                            </div>
                            <div>
                               <div className="flex items-center gap-1.5 flex-wrap">
                                 <span className="text-[12px] font-black text-gray-700 tracking-tight truncate max-w-[150px]">{sub.nome}</span>
                                 <Badge variant={sub.activa ? 'success' : 'danger'} size="sm">
                                   {sub.activa ? 'Activa' : 'Inactiva'}
                                 </Badge>
                               </div>
                               {sub.descricao && (
                                 <p className="text-[10px] text-gray-500 font-medium mt-1 line-clamp-2">{sub.descricao}</p>
                               )}
                            </div>
                          </div>
                          
                          <Button
                             variant="ghost"
                             className="h-7 w-7 p-0 rounded-sm text-gray-300 opacity-0 group-hover:opacity-100 hover:text-blue-600 hover:bg-blue-50 transition-all shrink-0"
                             onClick={() => {
                               setSelectedSubcategoria(sub);
                               setShowEditarSubcategoriaModal(true);
                             }}
                             title="Editar Subcategoria"
                          >
                             <Edit size={13} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {isExpanded && (!cat.subcategorias || cat.subcategorias.length === 0) && (
                  <div className="border-t border-gray-100 bg-gray-50/50 p-6 text-center">
                    <p className="text-[12px] text-gray-500 font-bold bg-white inline-block px-4 py-1.5 rounded-sm border border-gray-200 shadow-sm">
                       Ainda não tem subcategorias registadas
                    </p>
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
        title="Nova Categoria Principal"
        footer={
          <>
            <Button variant="outline" className="rounded-sm font-bold" onClick={() => { setShowCriarModal(false); criarForm.reset(); }} disabled={actionLoading}>
              Cancelar
            </Button>
            <Button variant="primary" className="rounded-sm font-bold" onClick={criarForm.handleSubmit(handleCriar)} isLoading={actionLoading}>
              Criar Categoria
            </Button>
          </>
        }
      >
        <form className="space-y-5">
          <Input label="Nome da Categoria" placeholder="Ex: Construção Civil" error={criarForm.formState.errors.nome?.message} {...criarForm.register('nome')} className="rounded-sm" />
          <Textarea label="Descrição" placeholder="Detalhes opcionais..." error={criarForm.formState.errors.descricao?.message} rows={3} {...criarForm.register('descricao')} className="rounded-sm" />
          <Input type="file" label="Ícone da Categoria" accept="image/*" error={criarForm.formState.errors.icone?.message as string} {...criarForm.register('icone')} className="rounded-sm" />
        </form>
      </Modal>

      {/* Modal: Editar Categoria */}
      <Modal
        isOpen={showEditarModal}
        onClose={() => { setShowEditarModal(false); setSelectedCategoria(null); }}
        title="Editar Categoria Principal"
        footer={
          <>
            <Button variant="outline" className="rounded-sm font-bold" onClick={() => { setShowEditarModal(false); setSelectedCategoria(null); }} disabled={actionLoading}>
              Cancelar
            </Button>
            <Button variant="primary" className="rounded-sm font-bold" onClick={editarForm.handleSubmit(handleEditar)} isLoading={actionLoading}>
              Guardar Alterações
            </Button>
          </>
        }
      >
        <form className="space-y-5">
          <Input label="Nome da Categoria" error={editarForm.formState.errors.nome?.message} {...editarForm.register('nome')} className="rounded-sm" />
          <Textarea label="Descrição" error={editarForm.formState.errors.descricao?.message} rows={3} {...editarForm.register('descricao')} className="rounded-sm" />
          <div className="space-y-2 bg-gray-50/50 p-3 rounded-sm border border-gray-100">
            <Input type="file" label="Novo Ícone (Opcional)" accept="image/*" error={editarForm.formState.errors.icone?.message as string} {...editarForm.register('icone')} className="rounded-sm" />
            {selectedCategoria?.icone_url && (
              <div className="mt-3 text-[12px] text-gray-500 font-semibold flex items-center gap-2">
                <span>Ícone em vigor: </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selectedCategoria.icone_url} alt="Ícone atual" className="w-8 h-8 rounded-sm object-cover border border-gray-200 shadow-sm" />
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
        message={`Tem a certeza absoluta que deseja eliminar a categoria "${selectedCategoria?.nome}"? Esta acção irá desactivá-la no sistema e não afetará serviços passados.`}
        confirmLabel="Eliminar Definitivamente"
        variant="danger"
        loading={actionLoading}
      />

      {/* Modal: Criar Subcategoria */}
      <Modal
        isOpen={showSubcategoriaModal}
        onClose={() => { setShowSubcategoriaModal(false); setSelectedCategoria(null); subcategoriaForm.reset(); }}
        title={`Criar Subcategoria em ${selectedCategoria?.nome || ''}`}
        footer={
          <>
            <Button variant="outline" className="rounded-sm font-bold" onClick={() => { setShowSubcategoriaModal(false); setSelectedCategoria(null); subcategoriaForm.reset(); }} disabled={actionLoading}>
              Cancelar
            </Button>
            <Button variant="primary" className="rounded-sm font-bold" onClick={subcategoriaForm.handleSubmit(handleSubcategoria)} isLoading={actionLoading}>
              Adicionar Subcategoria
            </Button>
          </>
        }
      >
        <form className="space-y-5">
          <Input label="Nome da Subcategoria" placeholder="Ex: Reparação de canos" error={subcategoriaForm.formState.errors.nome?.message} {...subcategoriaForm.register('nome')} className="rounded-sm" />
          <Textarea label="Descrição (Opcional)" placeholder="Pequeno detalhe sobre este tipo de serviço..." error={subcategoriaForm.formState.errors.descricao?.message} rows={3} {...subcategoriaForm.register('descricao')} className="rounded-sm" />
        </form>
      </Modal>
      
      {/* Modal: Editar Subcategoria */}
      <Modal
        isOpen={showEditarSubcategoriaModal}
        onClose={() => { setShowEditarSubcategoriaModal(false); setSelectedSubcategoria(null); editarSubcategoriaForm.reset(); }}
        title={`Editar Subcategoria`}
        footer={
          <>
            <Button variant="outline" className="rounded-sm font-bold" onClick={() => { setShowEditarSubcategoriaModal(false); setSelectedSubcategoria(null); editarSubcategoriaForm.reset(); }} disabled={actionLoading}>
              Cancelar
            </Button>
            <Button variant="primary" className="rounded-sm font-bold" onClick={editarSubcategoriaForm.handleSubmit(handleEditarSubcategoria)} isLoading={actionLoading}>
              Guardar Subcategoria
            </Button>
          </>
        }
      >
        <form className="space-y-5">
          <Input label="Nome da Subcategoria" error={editarSubcategoriaForm.formState.errors.nome?.message} {...editarSubcategoriaForm.register('nome')} className="rounded-sm" />
          <Textarea label="Descrição (Opcional)" error={editarSubcategoriaForm.formState.errors.descricao?.message} rows={3} {...editarSubcategoriaForm.register('descricao')} className="rounded-sm" />
        </form>
      </Modal>
    </div>
  );
}
