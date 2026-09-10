import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus, UserCheck } from 'lucide-react';
import { Modal } from '@/components/common/ui/Modal';
import { Input } from '@/components/common/form/Input';
import { Select, SelectOption } from '@/components/common/form/Select';
import { Button } from '@/components/common/form/Button';
import { Utilizador } from '@/shared/types/backoffice/utilizadores.types';
import {
  criarUtilizadorSchema,
  actualizarUtilizadorSchema,
  CriarUtilizadorFormData,
  ActualizarUtilizadorFormData,
} from '@/shared/schemas/utilizadores.schema';

interface UtilizadorModalProps {
  isOpen: boolean;
  onClose: () => void;
  utilizadorToEdit: Utilizador | null;
  onSubmitCreate: (data: CriarUtilizadorFormData) => Promise<void>;
  onSubmitUpdate: (data: ActualizarUtilizadorFormData) => Promise<void>;
  isLoading: boolean;
}

const roleOptions: SelectOption[] = [
  { value: 'operador', label: 'Operador de Análise & Suporte' },
  { value: 'admin', label: 'Administrador da Plataforma' },
];

const statusOptions: SelectOption[] = [
  { value: 'activo', label: 'Ativo' },
  { value: 'inactivo', label: 'Inativo' },
  { value: 'suspenso', label: 'Suspenso' },
];

export function UtilizadorModal({
  isOpen,
  onClose,
  utilizadorToEdit,
  onSubmitCreate,
  onSubmitUpdate,
  isLoading,
}: UtilizadorModalProps) {
  const isEditing = !!utilizadorToEdit;

  const createForm = useForm<CriarUtilizadorFormData>({
    resolver: zodResolver(criarUtilizadorSchema),
    defaultValues: {
      nome_completo: '',
      email: '',
      telefone: '',
      password: '',
      role: 'operador',
      status: 'activo',
    },
  });

  const updateForm = useForm<ActualizarUtilizadorFormData>({
    resolver: zodResolver(actualizarUtilizadorSchema),
  });

  useEffect(() => {
    if (utilizadorToEdit && isOpen) {
      updateForm.reset({
        nome_completo: utilizadorToEdit.nome_completo,
        email: utilizadorToEdit.email,
        telefone: utilizadorToEdit.telefone,
        password: '',
        role: utilizadorToEdit.role,
        status: utilizadorToEdit.status,
      });
    } else if (!isOpen) {
      createForm.reset();
      updateForm.reset();
    }
  }, [utilizadorToEdit, isOpen, updateForm, createForm]);

  const handleFormSubmit = () => {
    if (isEditing) {
      updateForm.handleSubmit((data) => onSubmitUpdate(data as ActualizarUtilizadorFormData))();
    } else {
      createForm.handleSubmit((data) => onSubmitCreate(data as CriarUtilizadorFormData))();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Editar Utilizador "${utilizadorToEdit.nome_completo}"` : 'Criar Novo Utilizador do Backoffice'}
      size="md"
      footer={
        <>
          <Button variant="outline" className="rounded-md font-bold" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            className="rounded-md font-bold bg-[#42b883] hover:bg-[#3aa374]"
            onClick={handleFormSubmit}
            isLoading={isLoading}
            leftIcon={isEditing ? <UserCheck size={15} /> : <UserPlus size={15} />}
          >
            {isEditing ? 'Guardar Alterações' : 'Criar Utilizador'}
          </Button>
        </>
      }
    >
      <form className="space-y-4">
        {isEditing ? (
          <>
            <Input
              label="Nome Completo"
              placeholder="Ex: Manuel Silva"
              error={updateForm.formState.errors.nome_completo?.message}
              {...updateForm.register('nome_completo')}
              className="rounded-md"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="E-mail"
                placeholder="exemplo@formocosta.com"
                error={updateForm.formState.errors.email?.message}
                {...updateForm.register('email')}
                className="rounded-md"
              />
              <Input
                label="Telefone"
                placeholder="Ex: 923 456 789"
                error={updateForm.formState.errors.telefone?.message}
                {...updateForm.register('telefone')}
                className="rounded-md"
              />
            </div>
            <Input
              label="Nova Palavra-passe (Deixar em branco para manter a atual)"
              type="password"
              placeholder="••••••••"
              error={updateForm.formState.errors.password?.message}
              {...updateForm.register('password')}
              className="rounded-md"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Função no Backoffice"
                options={roleOptions}
                error={updateForm.formState.errors.role?.message}
                {...updateForm.register('role')}
              />
              <Select
                label="Status da Conta"
                options={statusOptions}
                error={updateForm.formState.errors.status?.message}
                {...updateForm.register('status')}
              />
            </div>
          </>
        ) : (
          <>
            <Input
              label="Nome Completo"
              placeholder="Ex: Manuel Silva"
              error={createForm.formState.errors.nome_completo?.message}
              {...createForm.register('nome_completo')}
              className="rounded-md"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="E-mail"
                placeholder="exemplo@formocosta.com"
                error={createForm.formState.errors.email?.message}
                {...createForm.register('email')}
                className="rounded-md"
              />
              <Input
                label="Telefone"
                placeholder="Ex: 923 456 789"
                error={createForm.formState.errors.telefone?.message}
                {...createForm.register('telefone')}
                className="rounded-md"
              />
            </div>
            <Input
              label="Palavra-passe"
              type="password"
              placeholder="Mínimo 6 caracteres"
              error={createForm.formState.errors.password?.message}
              {...createForm.register('password')}
              className="rounded-md"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Função no Backoffice"
                options={roleOptions}
                error={createForm.formState.errors.role?.message}
                {...createForm.register('role')}
              />
              <Select
                label="Status Inicial"
                options={statusOptions}
                error={createForm.formState.errors.status?.message}
                {...createForm.register('status')}
              />
            </div>
          </>
        )}
      </form>
    </Modal>
  );
}
