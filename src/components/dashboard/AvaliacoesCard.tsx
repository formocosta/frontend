'use client';

import { Star } from 'lucide-react';
import { AvaliacoesData } from '@/shared/types/backoffice/dashboard.types';

interface AvaliacoesCardProps {
  data?: AvaliacoesData;
}

export default function AvaliacoesCard({ data }: AvaliacoesCardProps) {
  const score = data?.media ?? 4.3;
  const periodoTexto = data?.periodo_texto ?? 'De 11/06/2026- 08/09/2026';
  const statusMsg = data?.mensagem_status ?? 'Nenhuma avaliação aguardando resposta';

  // Generate 5 stars
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-5 shadow-2xs flex flex-col justify-between min-h-[220px]">
      <div>
        <h3 className="text-[16px] font-bold text-gray-900 tracking-tight mb-4">Avaliações</h3>

        <div className="flex items-baseline gap-3">
          <span className="text-[32px] font-black text-gray-900 tracking-tight leading-none">
            {score.toFixed(1)}
          </span>
          <span className="text-[12px] text-gray-400 font-normal">
            {periodoTexto}
          </span>
        </div>

        {/* Stars */}
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
                      ? 'fill-[#fa8c16] text-[#fa8c16]'
                      : isHalf
                      ? 'fill-[#fa8c16]/50 text-[#fa8c16]'
                      : 'text-gray-200 fill-gray-100'
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100/80 text-[13px] text-gray-500 font-normal">
        {statusMsg}
      </div>
    </div>
  );
}
