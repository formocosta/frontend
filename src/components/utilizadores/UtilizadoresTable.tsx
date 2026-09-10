import React from 'react';
import { Mail, Phone, Shield, Edit, Trash2 } from 'lucide-react';
import { Utilizador } from '@/shared/types/backoffice/utilizadores.types';
import { StatusBadge } from '@/components/common/ui/Badge';
import { Button } from '@/components/common/form/Button';

interface UtilizadoresTableProps {
  utilizadores: Utilizador[];
  currentUserId?: string | number;
  isAdmin: boolean;
  onEdit: (utilizador: Utilizador) => void;
  onDelete: (utilizador: Utilizador) => void;
}

export function UtilizadoresTable({
  utilizadores,
  currentUserId,
  isAdmin,
  onEdit,
  onDelete,
}: UtilizadoresTableProps) {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
            <th className="px-5 py-4">Utilizador</th>
            <th className="px-5 py-4">Contactos</th>
            <th className="px-5 py-4">Função / Perfil</th>
            <th className="px-5 py-4">Status Conta</th>
            <th className="px-5 py-4">Data Cadastro</th>
            {isAdmin && <th className="px-5 py-4 text-right">Ações</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {utilizadores.map((u) => {
            const isSelf = String(currentUserId) === String(u.id);

            return (
              <tr key={u.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-5 py-4 align-top">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-gradient-to-br from-[#42b883] to-[#3aa374] flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
                      {u.nome_completo.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[13px] font-bold text-gray-900 group-hover:text-[#42b883] transition-colors">
                          {u.nome_completo}
                        </p>
                        {isSelf && (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                            Tu
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium block">
                        ID: {u.id.substring(0, 8)}...
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 align-top">
                  <div className="space-y-1.5 text-[12px] font-medium text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Mail size={12} className="text-gray-400" />
                      <span className="truncate max-w-[170px]" title={u.email}>{u.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone size={12} className="text-gray-400" />
                      <span>{u.telefone}</span>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 align-top">
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border ${
                    u.role === 'admin'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-purple-50 text-purple-700 border-purple-200'
                  }`}>
                    <Shield size={12} />
                    {u.role === 'admin' ? 'Administrador' : 'Operador'}
                  </span>
                </td>
                <td className="px-5 py-4 align-top">
                  <StatusBadge status={u.status} />
                </td>
                <td className="px-5 py-4 align-top text-[12px] text-gray-500 font-medium">
                  {new Date(u.created_at).toLocaleDateString('pt-AO', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </td>
                {isAdmin && (
                  <td className="px-5 py-4 align-top text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                        onClick={() => onEdit(u)}
                        title="Editar Utilizador"
                      >
                        <Edit size={15} />
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
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
