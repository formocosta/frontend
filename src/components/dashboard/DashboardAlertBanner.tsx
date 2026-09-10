'use client';

import Link from 'next/link';
import { DashboardAlerta } from '@/shared/types/backoffice/dashboard.types';

interface DashboardAlertBannerProps {
  alerta?: DashboardAlerta;
}

export default function DashboardAlertBanner({ alerta }: DashboardAlertBannerProps) {
  if (!alerta || !alerta.tem_loja_inativa) {
    return null;
  }

  return (
    <div className="bg-[#fffbe6] border border-[#ffe58f] rounded-lg p-4 px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm transition-all duration-200">
      <div className="space-y-1">
        <h4 className="text-[14px] font-bold text-gray-900 leading-snug tracking-tight">
          {alerta.titulo || 'Você tem uma loja inativa. Ative-a agora mesmo!'}
        </h4>
        <p className="text-[13px] text-gray-600 font-normal">
          {alerta.descricao || 'Clique no botão à direita para selecionar a loja a ser ativada'}
        </p>
      </div>

      <Link
        href={alerta.link_acao || '/kyc'}
        className="inline-flex items-center justify-center px-5 py-1.5 bg-[#fadb14] hover:bg-[#e8c70d] text-gray-900 text-[13px] font-bold rounded shadow-xs transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
      >
        {alerta.texto_botao || 'Ir'}
      </Link>
    </div>
  );
}
