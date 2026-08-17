import {
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  Star,
  UserCheck,
  Zap,
} from 'lucide-react';

export function BenefitsSection() {
  return (
    <section id="vantagens" className="py-20 bg-[#f4f2e6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Pill & Titles matching reference design */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-block px-5 py-1.5 rounded-full bg-[#02562b] text-white text-xs font-bold uppercase tracking-wider shadow-sm">
            PORQUÊ ESCOLHER-NOS
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Benefícios da Nossa Plataforma
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Descubra como o nosso aplicativo transforma a contratação de serviços e a gestão do seu negócio. Desde a busca por especialistas até o agendamento intuitivo.
          </p>
        </div>

        {/* 2x2 Feature Cards Grid with Central Smartphone Mockup */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
          
          {/* Left Column 2 Cards */}
          <div className="space-y-6">
            
            {/* Benefit Card 1 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative group">
              <div className="w-14 h-14 rounded-full bg-[#02562b] text-white flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-md">
                <UserCheck size={26} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Profissionais Verificados</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Acesso instantâneo a especialistas credenciados em diversas categorias com perfis detalhados e avaliações autênticas.
              </p>
            </div>

            {/* Benefit Card 2 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative group">
              <div className="w-14 h-14 rounded-full bg-[#02562b] text-white flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-md">
                <Calendar size={26} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Agendamento Simplificado</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Marque atendimentos e acompanhe horários em tempo real sem complicações nem necessidade de chamadas demoradas.
              </p>
            </div>

          </div>

          {/* Center Phone Display with App Mockup Screen */}
          <div className="flex justify-center my-4 lg:my-0">
            <div className="bg-slate-900 p-3.5 rounded-[42px] shadow-2xl border-4 border-slate-800 max-w-[300px] w-full">
              
              {/* Top Speaker Notch */}
              <div className="w-24 h-3.5 bg-slate-800 mx-auto rounded-b-xl mb-2" />

              <div className="bg-[#f4f2e6] rounded-[30px] p-4 text-slate-900 space-y-3 min-h-[420px] shadow-inner overflow-hidden border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-300 pb-2">
                  <span className="font-bold text-xs text-slate-800">Serviços & Gestão</span>
                  <span className="bg-[#02562b] text-white font-bold px-2 py-0.5 rounded-full text-[9px]">Formocosta</span>
                </div>
                
                {/* Main Green Promo Card inside mockup */}
                <div className="bg-[#02562b] text-white p-4 rounded-2xl space-y-2 shadow-md">
                  <div className="text-[10px] uppercase font-bold text-emerald-200 tracking-wider">Tudo na Palma da Mão</div>
                  <div className="text-lg font-black leading-tight">Encontre & Agende em Segundos</div>
                  <div className="text-[10px] text-slate-200">Conexão direta entre clientes e profissionais qualificados.</div>
                </div>

                {/* Grid items mockup */}
                <div className="grid grid-cols-2 gap-2 text-center pt-1">
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-[#02562b]/10 text-[#02562b] flex items-center justify-center font-bold text-sm mb-1">
                      🛠️
                    </div>
                    <span className="text-[10px] font-bold text-slate-800">Serviços</span>
                  </div>
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-[#02562b]/10 text-[#02562b] flex items-center justify-center font-bold text-sm mb-1">
                      ⭐
                    </div>
                    <span className="text-[10px] font-bold text-slate-800">Avaliações</span>
                  </div>
                </div>

                {/* Bottom App Navigation line */}
                <div className="bg-white p-2.5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-700">
                  <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-[#02562b]" /> Suporte 24/7</span>
                  <span className="text-[#02562b]">Ver Mais →</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column 2 Cards */}
          <div className="space-y-6">
            
            {/* Benefit Card 3 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative group">
              <div className="w-14 h-14 rounded-full bg-[#02562b] text-white flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-md">
                <Zap size={26} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Gestão para Prestadores</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Ferramentas completas para organizar a agenda, acompanhar ganhos diários e impulsionar a sua visibilidade no mercado.
              </p>
            </div>

            {/* Benefit Card 4 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative group">
              <div className="w-14 h-14 rounded-full bg-[#02562b] text-white flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-md">
                <ShieldCheck size={26} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Padrão de Qualidade & Confiança</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Garantia de atendimento seguro, histórico de pedidos acessível e sistema autêntico de recomendação.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
