'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Phone, Mail, MapPin, Building, User } from 'lucide-react';
import { Candidatura } from '@/shared/types/backoffice/kyc.types';
import { StatusBadge } from '@/components/common/ui/Badge';

interface CandidaturaCardProps {
  candidatura: Candidatura;
}

const tipoLabels: Record<string, string> = {
  singular: 'Pessoa Singular',
  coletivo: 'Pessoa Coletiva',
};

export function CandidaturaCard({ candidatura }: CandidaturaCardProps) {
  const user = candidatura.user;
  const localizacao = [candidatura.provincia, candidatura.municipio, candidatura.bairro]
    .filter(Boolean)
    .join(', ');

  return (
    <Link
      href={`/kyc/${candidatura.id}`}
      className="block bg-white rounded-xl border border-gray-100 hover:border-[#42b883]/30 hover:shadow-lg hover:shadow-[#42b883]/5 transition-all duration-300 group"
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#42b883] to-[#3aa374] flex items-center justify-center text-white font-bold text-base shrink-0 shadow-sm">
            {user.nome_completo.charAt(0)}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1.5">
              <h3 className="text-[14px] font-bold text-gray-900 truncate group-hover:text-[#42b883] transition-colors">
                {user.nome_completo}
              </h3>
              <StatusBadge status={candidatura.status_verificacao} />
            </div>

            {/* Contact info */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-gray-500 font-medium">
              <span className="flex items-center gap-1.5">
                <Mail size={11} className="text-gray-400" />
                {user.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone size={11} className="text-gray-400" />
                {user.telefone}
              </span>
            </div>

            {/* Extra info row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[11px] text-gray-500 font-medium">
              <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-0.5 rounded-md">
                <User size={11} className="text-gray-400" />
                {tipoLabels[candidatura.tipo_prestador] || candidatura.tipo_prestador}
              </span>

              {localizacao && (
                <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-0.5 rounded-md">
                  <MapPin size={11} className="text-gray-400" />
                  {localizacao}
                </span>
              )}

              {candidatura.nome_comercial && (
                <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-0.5 rounded-md">
                  <Building size={11} className="text-gray-400" />
                  {candidatura.nome_comercial}
                </span>
              )}
            </div>

            {/* Date */}
            <p className="text-[10px] text-gray-400 font-medium mt-2">
              Candidatura submetida em {new Date(candidatura.created_at).toLocaleDateString('pt-AO', { day: '2-digit', month: 'short', year: 'numeric' })}
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
