'use client';

import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PromoBannerCard() {
  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-[#1f1d1b] via-[#352c20] to-[#594218] text-white p-4.5 shadow-sm">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-[#faad14]/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between h-full space-y-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#fadb14] mb-1 uppercase tracking-wider">
            <Sparkles size={13} />
            <span>Programa de Parceiros</span>
          </div>
          <h4 className="text-[14px] font-extrabold text-white leading-tight tracking-tight">
            Convide prestadores e ganhe <span className="text-[#fadb14]">R$150</span> por cada indicação
          </h4>
        </div>

        <div>
          <Link
            href="/prestadores"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#fadb14] hover:bg-[#e8c70d] text-gray-950 text-[12px] font-bold rounded shadow-xs transition-colors cursor-pointer"
          >
            <span>Convidar agora</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
