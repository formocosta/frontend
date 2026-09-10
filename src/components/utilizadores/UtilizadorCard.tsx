import React from 'react';
import { Mail, Phone, Shield, Edit, Trash2 } from 'lucide-react';
import { Utilizador } from '@/shared/types/backoffice/utilizadores.types';
import { StatusBadge } from '@/components/common/ui/Badge';
import { Button } from '@/components/common/form/Button';

interface UtilizadorCardProps {
  utilizador: Utilizador;
  currentUserId?: string | number;
  isAdmin: boolean;
  onEdit: (utilizador: Utilizador) => void;
  onDelete: (utilizador: Utilizador) => void;
}

export function UtilizadorCard({
  utilizador: u,
  currentUserId,
  isAdmin,
  onEdit,
  onDelete,
}: UtilizadorCardProps) {
  const isSelf = String(currentUserId) === String(u.id);

  return (
    <div className="p-4 space-y-3 bg-white hover:bg-gray-50/50 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-md bg-gradient-to-br from-[#42b883] to-[#3aa374] flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
            {u.nome_completo.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-[14px] font-bold text-gray-900 truncate">{u.nome_completo}</p>
              {isSelf && (
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 shrink-0">
                  Tu
                </span>
              )}
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-gray-500 mt-0.5">
              <Shield size={10} className="text-[#42b883]" />
              {u.role === 'admin' ? 'Administrador' : 'Operador'}
            </span>
          </div>
        </div>
        <div className="shrink-0">
          <StatusBadge status={u.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px] bg-gray-50/80 p-3 rounded-md border border-gray-100">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-gray-600">
            <Mail size={12} className="text-gray-400 shrink-0" />
            <span className="truncate" title={u.email}>{u.email}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600">
            <Phone size={12} className="text-gray-400 shrink-0" />
            <span>{u.telefone}</span>
          </div>
        </div>
        <div className="space-y-1.5 border-t sm:border-t-0 border-gray-100 pt-1.5 sm:pt-0">
          <span className="text-[10px] text-gray-400 font-medium block">
            Cadastrado em {new Date(u.created_at).toLocaleDateString('pt-AO')}
          </span>
        </div>
      </div>

      {isAdmin && (
        <div className="flex items-center justify-end gap-2 pt-1">
          <Button
            variant="outline"
            className="h-8 text-[11px] font-bold px-2.5 rounded-md bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-blue-600"
            onClick={() => onEdit(u)}
            leftIcon={<Edit size={13} />}
          >
            Editar
          </Button>
          {!isSelf && (
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50"
              onClick={() => onDelete(u)}
              title="Remover Utilizador"
            >
              <Trash2 size={15} />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
