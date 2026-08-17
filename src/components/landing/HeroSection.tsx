import { Sparkles, Star } from 'lucide-react';
import { PhoneMockupTrio } from './PhoneMockupTrio';

export function HeroSection() {
  return (
    <section id="inicio" className="relative h-auto min-h-[calc(100vh-5rem)] lg:h-[calc(100vh-5rem)] pt-6 pb-0 overflow-hidden bg-[#f4f2e6] flex flex-col justify-between">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-between">
        
        {/* Hero Header Content */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-2">
          
          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#02562b] tracking-tight leading-[1.15]">
            Sua Plataforma All-in-One de Serviços & Gestão
          </h1>

          {/* Subtitle / Short Description */}
          <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed max-w-xl mx-auto">
            Encontre profissionais qualificados, agende serviços em segundos e controle o seu negócio na palma da mão.
          </p>

          {/* Store Download Buttons */}
          <div className="pt-2 flex flex-row items-center justify-center gap-3">
            
            {/* Google Play Button */}
            <a
              href="#download"
              className="bg-black hover:bg-slate-900 text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all active:scale-95 border border-slate-800"
            >
              <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
              </svg>
              <div className="text-left">
                <div className="text-[9px] uppercase font-semibold text-slate-300 leading-none">DISPONÍVEL NO</div>
                <div className="text-sm font-bold text-white leading-tight">Google Play</div>
              </div>
            </a>

            {/* App Store Button */}
            <a
              href="#download"
              className="bg-black hover:bg-slate-900 text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all active:scale-95 border border-slate-800"
            >
              <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.64 1.35-.57.66-1.07 1.73-.93 2.76 1.01.08 2.03-.51 2.65-1.26z" />
              </svg>
              <div className="text-left">
                <div className="text-[9px] uppercase font-semibold text-slate-300 leading-none">BAIXAR NA</div>
                <div className="text-sm font-bold text-white leading-tight">App Store</div>
              </div>
            </a>

          </div>

        </div>

        {/* Hero Visual: Smartphone Mockups positioning to bleed under the footer bar */}
        <div className="relative z-0 -mb-16 sm:-mb-24">
          <PhoneMockupTrio />
        </div>

      </div>

      {/* Ticker / Highlights Bar overlapping top of lower mockups */}
      <div className="relative z-10 w-full bg-[#02562b] text-white py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-around gap-4 text-sm sm:text-base font-semibold tracking-wide">
          <span className="flex items-center gap-2">
            <span className="text-amber-400">●</span> Conexão Direta
          </span>
          <span className="flex items-center gap-2">
            <span className="text-amber-400">●</span> Profissionais Verificados
          </span>
          <span className="flex items-center gap-2">
            <span className="text-amber-400">●</span> Agendamento Fácil
          </span>
          <span className="flex items-center gap-2">
            <span className="text-amber-400">●</span> Avaliações Reais
          </span>
          <span className="flex items-center gap-2">
            <span className="text-amber-400">●</span> Gestão Completa
          </span>
        </div>
      </div>
    </section>
  );
}
