'use client';

import { Users } from 'lucide-react';

export default function UtilizadoresPage() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100/80 min-h-[400px] flex flex-col justify-center items-center text-center">
      <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4 shadow-sm">
        <Users size={20} />
      </div>
      <h2 className="text-lg font-bold text-gray-900">Utilizadores Internos</h2>
      <p className="text-xs text-gray-400 mt-1.5 max-w-sm font-medium">
        Esta página está em desenvolvimento. Brevemente poderá criar, editar e desativar contas de utilizadores internos, atribuindo cargos e permissões.
      </p>
    </div>
  );
}
