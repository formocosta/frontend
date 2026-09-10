'use client';

import { Star, ThumbsUp } from 'lucide-react';
import { AvaliacoesData } from '@/shared/types/backoffice/dashboard.types';

interface AvaliacoesCardProps {
  data?: AvaliacoesData;
}

export default function AvaliacoesCard({ data }: AvaliacoesCardProps) {
  const score = data?.media ?? 4.8;
  const periodoTexto = data?.periodo_texto ?? 'De 01/08/2026 - 09/09/2026';
  const statusMsg = data?.mensagem_status ?? 'Todas as avaliações de clientes foram moderadas';

  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-5 shadow-2xs flex flex-col justify-between min-h-[220px]">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star size={14} className="fill-amber-500 text-amber-500" />
            </div>
            <h3 className="text-[15px] font-bold text-gray-900 tracking-tight">Avaliações & Satisfação</h3>
          </div>
          <span className="text-[11px] text-gray-400 font-medium">{data?.total_avaliacoes ?? 42} avaliações</span>
        </div>

        <div className="flex items-baseline gap-3">
          <span className="text-[32px] font-black text-gray-900 tracking-tight leading-none">
            {score.toFixed(1)}
          </span>
          <span className="text-[12px] text-gray-400 font-normal">
            {periodoTexto}
          </span>
        </div>

        {/* Estrelas */}
        <div className="flex items-center gap-1 mt-3">
          {stars.map((star) => {
            const isFilled = star <= Math.floor(score);
            const isHalf = !isFilled && star - 0.5 <= score;
            return (
              <div key={star} className="relative">
                <Star
                  size={18}
                  className={`${
                    isFilled
                      ? 'fill-amber-400 text-amber-400'
                      : isHalf
                      ? 'fill-amber-400/50 text-amber-400'
                      : 'text-gray-200 fill-gray-100'
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 flex items-center gap-2 text-[12px] text-gray-500 font-normal">
        <ThumbsUp size={13} className="text-emerald-500" />
        <span>{statusMsg}</span>
      </div>
    </div>
  );
}