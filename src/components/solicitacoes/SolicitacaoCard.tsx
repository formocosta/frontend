'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, MapPin, Calendar, Clock, User } from 'lucide-react';
import { Solicitacao } from '@/shared/types/backoffice/requests.types';
import { StatusBadge } from '@/components/common/ui/Badge';

interface SolicitacaoCardProps {
  solicitacao: Solicitacao;
}

export function SolicitacaoCard({ solicitacao }: SolicitacaoCardProps) {
  const localizacao = [solicitacao.provincia, solicitacao.municipio].filter(Boolean).join(', ');
  const dataFormatada = solicitacao.data_pretendida
    ? new Date(solicitacao.data_pretendida).toLocaleDateString('pt-AO', { day: '2-digit', month: 'short', year: 'numeric' })
    : null;

  return (
    <Link
      href={`/solicitacoes/${solicitacao.id}`}
      className="block bg-white rounded-xl border border-gray-100 hover:border-[#42b883]/30 hover:shadow-lg hover:shadow-[#42b883]/5 transition-all duration-300 group"
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Title & Status */}
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-[14px] font-bold text-gray-900 truncate group-hover:text-[#42b883] transition-colors">
                {solicitacao.servico?.titulo_servico || 'Solicitação'}
              </h3>
              <StatusBadge status={solicitacao.status_id} />
            </div>

            {/* Description */}
            {solicitacao.descricao_cliente && (
              <p className="text-[12px] text-gray-500 font-medium line-clamp-2 mb-2">
                {solicitacao.descricao_cliente}
              </p>
            )}

            {/* Info row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-gray-500 font-medium">
              {localizacao && (
                <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-0.5 rounded-md">
                  <MapPin size={11} className="text-gray-400" />
                  {localizacao}
                </span>
              )}

              {dataFormatada && (
                <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-0.5 rounded-md">
                  <Calendar size={11} className="text-gray-400" />
                  {dataFormatada}
                </span>
              )}

              {solicitacao.hora_pretendida && (
                <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-0.5 rounded-md">
                  <Clock size={11} className="text-gray-400" />
                  {solicitacao.hora_pretendida}
                </span>
              )}

              {solicitacao.preco_acordado != null && (
                <span className="flex items-center gap-1.5 bg-[#42b883]/10 text-[#42b883] px-2 py-0.5 rounded-md font-bold">
                  {Number(solicitacao.preco_acordado).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                </span>
              )}

              {solicitacao.prestador && (
                <span className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md">
                  <User size={11} />
                  {solicitacao.prestador.nome}
                </span>
              )}
            </div>

            {/* Date */}
            <p className="text-[10px] text-gray-400 font-medium mt-2">
              Criada em {new Date(solicitacao.created_at).toLocaleDateString('pt-AO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          {/* Arrow */}
          <div className="shrink-0 w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#42b883]/10 group-hover:text-[#42b883] transition-all">
            <ChevronRight size={16} />
          </div>
        </div>
      </div>
    </Link>
  );
}
