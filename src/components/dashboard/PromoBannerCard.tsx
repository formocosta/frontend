'use client';

import { Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PromoBannerCard() {
  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#059669] text-white p-5 shadow-2xs">
      {/* Background ambient pattern */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between h-full space-y-3.5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-200 mb-1 uppercase tracking-wider">
            <Users size={13} />
            <span>Expansão de Técnicos</span>
          </div>
          <h4 className="text-[15px] font-black text-white leading-tight tracking-tight">
            Indique novos Prestadores e ganhe <span className="text-amber-300">5.000 Kz</span> de bónus por activação
          </h4>
          <p className="text-[12px] text-emerald-100/90 font-normal mt-1 leading-snug">
            Traga mais profissionais qualificados para canalização, electricidade, climatização e obras.
          </p>
        </div>

        <div>
          <Link
            href="/prestadores"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-gray-950 text-[12px] font-extrabold rounded-md shadow-sm transition-all cursor-pointer hover:gap-2.5"
          >
            <span>Convidar Prestadores</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}