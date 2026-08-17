import { Sparkles, Star } from 'lucide-react';
import { PhoneMockupTrio } from './PhoneMockupTrio';

export function HeroSection() {
  return (
    <section id="inicio" className="relative pt-12 pb-20 lg:pt-16 lg:pb-32 overflow-hidden bg-gradient-to-b from-white via-primary-50/30 to-slate-50">
      {/* Background Decorative Elements */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none -z-10">
        <div className="absolute top-12 left-10 w-72 h-72 bg-primary-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Header Content */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100/80 border border-primary-200 text-primary-800 text-xs sm:text-sm font-bold tracking-wide shadow-sm">
            <Sparkles size={14} className="text-primary-700 animate-pulse" />
            <span>O SEU APP DE SERVIÇOS & GESTÃO DE NEGÓCIOS</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Conecte Clientes & Profissionais <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-700 via-primary-600 to-emerald-500">Qualificados</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed">
            Encontre especialistas verificados, agende serviços instantaneamente ou expanda o seu negócio com uma gestão completa na palma da sua mão.
          </p>

          {/* Store Download Buttons & CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            
            {/* Google Play Button */}
            <a
              href="#download"
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-2xl flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all group active:scale-95 border border-slate-800"
            >
              <svg className="w-7 h-7 fill-current text-white" viewBox="0 0 24 24">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
              </svg>
              <div className="text-left">
                <div className="text-[10px] uppercase font-semibold text-slate-400 leading-none">Disponível no</div>
                <div className="text-base font-bold text-white leading-tight">Google Play</div>
              </div>
            </a>

            {/* App Store Button */}
            <a
              href="#download"
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-2xl flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all group active:scale-95 border border-slate-800"
            >
              <svg className="w-7 h-7 fill-current text-white" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.64 1.35-.57.66-1.07 1.73-.93 2.76 1.01.08 2.03-.51 2.65-1.26z" />
              </svg>
              <div className="text-left">
                <div className="text-[10px] uppercase font-semibold text-slate-400 leading-none">Descarregar na</div>
                <div className="text-base font-bold text-white leading-tight">App Store</div>
              </div>
            </a>

          </div>

          {/* Quick Ratings & Trust Indicator */}
          <div className="pt-2 flex items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-current" />
                ))}
              </div>
              <span className="font-bold text-slate-800 ml-1">4.9/5</span>
            </div>
            <span className="text-slate-300">•</span>
            <span>+10.000 Downloads</span>
            <span className="text-slate-300">•</span>
            <span>Perfis 100% Verificados</span>
          </div>

        </div>

        {/* Hero Visual: Smartphone Mockups */}
        <PhoneMockupTrio />

        {/* Ticker / Highlights Bar */}
        <div className="mt-16 bg-primary-800 text-white rounded-2xl p-4 shadow-xl border border-primary-700 max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center justify-around gap-4 text-xs sm:text-sm font-bold tracking-wide text-center">
            <span className="flex items-center gap-2">
              <span className="text-primary-300">✦</span> Conexão Direta & Rápida
            </span>
            <span className="flex items-center gap-2">
              <span className="text-primary-300">✦</span> Profissionais Verificados
            </span>
            <span className="flex items-center gap-2">
              <span className="text-primary-300">✦</span> Agendamento 24/7
            </span>
            <span className="flex items-center gap-2">
              <span className="text-primary-300">✦</span> Avaliações Autênticas
            </span>
            <span className="flex items-center gap-2">
              <span className="text-primary-300">✦</span> Gestão Simplificada
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
