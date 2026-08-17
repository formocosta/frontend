import { ChevronRight } from 'lucide-react';

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-block px-3.5 py-1 rounded-full bg-primary-100 text-primary-800 text-xs font-bold uppercase tracking-wider">
            PASSO A PASSO
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Como Funciona a Aplicação Formocosta?
          </h2>
          <p className="text-slate-600 text-base">
            Em apenas três passos simples, está pronto para agendar ou oferecer serviços com total praticidade.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          
          {/* Step 1 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all relative">
            <div className="w-10 h-10 rounded-full bg-primary-700 text-white font-black text-sm flex items-center justify-center mb-6">
              1
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Baixe a App & Crie Conta</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Descarregue a aplicação gratuitamente na Play Store ou App Store e conclua o seu registo em menos de 2 minutos.
            </p>
            <div className="flex items-center text-xs font-bold text-primary-700 gap-1">
              <span>Disponível para iOS e Android</span>
              <ChevronRight size={14} />
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all relative">
            <div className="w-10 h-10 rounded-full bg-primary-700 text-white font-black text-sm flex items-center justify-center mb-6">
              2
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Pesquise ou Registe Serviços</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Encontre o especialista ideal filtrando por categoria e localização, ou publique a sua oferta profissional.
            </p>
            <div className="flex items-center text-xs font-bold text-primary-700 gap-1">
              <span>Filtros avançados e categorias</span>
              <ChevronRight size={14} />
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all relative">
            <div className="w-10 h-10 rounded-full bg-primary-700 text-white font-black text-sm flex items-center justify-center mb-6">
              3
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Agende & Acompanhe tudo</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Confirme o agendamento e receba lembretes automáticos e notificações do estado do serviço diretamente na app.
            </p>
            <div className="flex items-center text-xs font-bold text-primary-700 gap-1">
              <span>Notificações em tempo real</span>
              <ChevronRight size={14} />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
