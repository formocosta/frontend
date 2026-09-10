'use client';

import { useEffect, useState, useCallback } from 'react';
import { UserPlus, ShieldCheck, Users } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/common/form/Button';
import { FilterBar } from '@/components/common/FilterBar';
import { SelectOption } from '@/components/common/form/Select';
import { ConfirmModal } from '@/components/common/ui/Modal';
import { useAuthStore } from '@/shared/store/auth.store';
import { useUtilizadores } from '@/hooks/users/utilizadores.hooks';
import { Utilizador } from '@/shared/types/backoffice/utilizadores.types';
import { CriarUtilizadorFormData, ActualizarUtilizadorFormData } from '@/shared/schemas/utilizadores.schema';
import { UtilizadoresStats } from '@/components/utilizadores/UtilizadoresStats';
import { UtilizadoresTable } from '@/components/utilizadores/UtilizadoresTable';
import { UtilizadorCard } from '@/components/utilizadores/UtilizadorCard';
import { UtilizadorModal } from '@/components/utilizadores/UtilizadorModal';

const roleFilterOptions: SelectOption[] = [
  { value: '', label: 'Todos os perfis' },
  { value: 'admin', label: 'Administrador' },
  { value: 'operador', label: 'Operador' },
];

export default function UtilizadoresPage() {
  const currentUser = useAuthStore((state) => state.user);
  const isAdmin = currentUser?.role === 'admin';

  const {
    utilizadores,
    meta,
    loading,
    actionLoading,
    error,
    fetchUtilizadores,
    criarUtilizador,
    actualizarUtilizador,
    eliminarUtilizador,
  } = useUtilizadores();

  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [selectedUtilizador, setSelectedUtilizador] = useState<Utilizador | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [utilizadorToDelete, setUtilizadorToDelete] = useState<Utilizador | null>(null);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadData = useCallback(() => {
    fetchUtilizadores({
      search,
      role: roleFilter,
      page,
      page_size: 10,
    });
  }, [search, roleFilter, page, fetchUtilizadores]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleRoleChange = (val: string) => {
    setRoleFilter(val);
    setPage(1);
  };

  const handleOpenCreate = () => {
    setSelectedUtilizador(null);
    setShowModal(true);
  };

  const handleOpenEdit = (user: Utilizador) => {
    setSelectedUtilizador(user);
    setShowModal(true);
  };

  const handleOpenDelete = (user: Utilizador) => {
    setUtilizadorToDelete(user);
    setShowDeleteModal(true);
  };

  const handleCreateSubmit = async (data: CriarUtilizadorFormData) => {
    const success = await criarUtilizador(data);
    if (success) {
      setShowModal(false);
      setSuccessMessage('Utilizador criado com sucesso!');
      setTimeout(() => setSuccessMessage(null), 4000);
      loadData();
    }
  };

  const handleUpdateSubmit = async (data: ActualizarUtilizadorFormData) => {
    if (!selectedUtilizador) return;
    const success = await actualizarUtilizador(selectedUtilizador.id, data);
    if (success) {
      setShowModal(false);
      setSelectedUtilizador(null);
      setSuccessMessage('Utilizador atualizado com sucesso!');
      setTimeout(() => setSuccessMessage(null), 4000);
      loadData();
    }
  };

  const handleDeleteConfirm = async () => {
    if (!utilizadorToDelete) return;
    const success = await eliminarUtilizador(utilizadorToDelete.id);
    if (success) {
      setShowDeleteModal(false);
      setUtilizadorToDelete(null);
      setSuccessMessage('Utilizador removido com sucesso!');
      setTimeout(() => setSuccessMessage(null), 4000);
      loadData();
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Gestão de Utilizadores"
        description="Gestão de perfis de administradores e operadores do backoffice"
        action={
          isAdmin ? (
            <Button
              variant="primary"
              className="rounded-md font-bold shadow-sm bg-[#42b883] hover:bg-[#3aa374]"
              onClick={handleOpenCreate}
              leftIcon={<UserPlus size={15} />}
            >
              Novo Utilizador
            </Button>
          ) : undefined
        }
      />

      {/* Stats */}
      <UtilizadoresStats total={meta?.total || utilizadores.length} utilizadores={utilizadores} />

      {/* Filters */}
      <FilterBar
        searchPlaceholder="Pesquisar por nome, email ou telefone..."
        searchValue={search}
        onSearchChange={handleSearchChange}
        selectOptions={roleFilterOptions}
        selectValue={roleFilter}
        onSelectChange={handleRoleChange}
      />

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-700 font-medium shadow-sm">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-md p-4 text-sm text-emerald-700 font-bold shadow-sm">
          {successMessage}
        </div>
      )}

      {/* Loading */}
      {loading && utilizadores.length === 0 && (
        <div className="bg-white rounded-md p-12 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-2 border-[#42b883] border-t-transparent rounded-md animate-spin" />
          <p className="text-sm text-gray-500 mt-4 font-medium">A carregar utilizadores...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && utilizadores.length === 0 && (
        <div className="bg-white rounded-md p-12 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-md bg-gray-50 flex items-center justify-center text-gray-400 mb-4">
            <Users size={28} />
          </div>
          <h3 className="text-base font-bold text-gray-900">Sem utilizadores encontrados</h3>
          <p className="text-xs text-gray-500 mt-1.5 max-w-sm font-medium">
            {search || roleFilter
              ? 'Nenhum utilizador corresponde aos filtros selecionados.'
              : 'Ainda não existem utilizadores de backoffice registados no sistema.'}
          </p>
        </div>
      )}

      {/* Content View */}
      {!loading && utilizadores.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-md shadow-sm overflow-hidden">
          {/* Desktop Table View */}
          <UtilizadoresTable
            utilizadores={utilizadores}
            currentUserId={currentUser?.id}
            isAdmin={isAdmin}
            onEdit={handleOpenEdit}
            onDelete={handleOpenDelete}
          />

          {/* Mobile Cards View */}
          <div className="block md:hidden divide-y divide-gray-100">
            {utilizadores.map((user) => (
              <UtilizadorCard
                key={user.id}
                utilizador={user}
                currentUserId={currentUser?.id}
                isAdmin={isAdmin}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
              />
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.last_page > 1 && (
            <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-[11px] text-gray-500 font-semibold">
                A mostrar {meta.from} a {meta.to} de {meta.total} utilizadores
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-3 py-1.5 text-[11px] font-bold bg-white border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Anterior
                </button>
                <span className="text-[11px] font-bold text-gray-700 px-2">
                  Página {meta.current_page} de {meta.last_page}
                </span>
                <button
                  disabled={page === meta.last_page}
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-1.5 text-[11px] font-bold bg-white border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Próxima
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal Criar / Editar */}
      <UtilizadorModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        utilizadorToEdit={selectedUtilizador}
        onSubmitCreate={handleCreateSubmit}
        onSubmitUpdate={handleUpdateSubmit}
        isLoading={actionLoading}
      />

      {/* Confirm Modal Eliminar */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Remover Utilizador do Backoffice"
        message={`Tem a certeza que deseja remover o utilizador "${utilizadorToDelete?.nome_completo}"? Esta acção irá revogar os acessos ao painel de gestão.`}
        confirmLabel="Remover Utilizador"
        variant="danger"
        loading={actionLoading}
      />
    </div>
  );
}
