'use client';

import Link from 'next/link';
import { UserCheck, ArrowRight } from 'lucide-react';
import { DashboardAlerta } from '@/shared/types/backoffice/dashboard.types';

interface DashboardAlertBannerProps {
  alerta?: DashboardAlerta;
}

export default function DashboardAlertBanner({ alerta }: DashboardAlertBannerProps) {
  if (!alerta || !alerta.tem_loja_inativa) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-[#fffbe6] to-[#fff8d6] border border-[#ffe58f] rounded-lg p-4 px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs transition-all duration-200">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-md bg-[#fadb14]/30 text-[#d48806] flex items-center justify-center shrink-0 mt-0.5">
          <UserCheck size={18} />
        </div>
        <div className="space-y-0.5">
          <h4 className="text-[14px] font-bold text-gray-900 leading-snug tracking-tight">
            {alerta.titulo || 'Você tem prestadores com candidaturas KYC ou perfis pendentes de activação!'}
          </h4>
          <p className="text-[12px] text-gray-600 font-normal">
            {alerta.descricao || 'Analise os documentos submetidos e aprove as candidaturas para habilitar novos técnicos na plataforma Formocosta.'}
          </p>
        </div>
      </div>

      <Link
        href={alerta.link_acao || '/kyc'}
        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#fadb14] hover:bg-[#e8c70d] text-gray-900 text-[12px] font-bold rounded shadow-2xs transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
      >
        <span>{alerta.texto_botao || 'Ver Candidaturas KYC'}</span>
        <ArrowRight size={13} />
      </Link>
    </div>
  );
}