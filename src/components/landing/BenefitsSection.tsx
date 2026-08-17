import {
  Briefcase,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  UserCheck,
} from 'lucide-react';

export function BenefitsSection() {
  return (
    <section id="vantagens" className="py-20 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-block px-3.5 py-1 rounded-full bg-primary-100 text-primary-800 text-xs font-bold uppercase tracking-wider">
            PORQUÊ ESCOLHER O FORMOCOSTA
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Benefícios Pensados para Clientes e Profissionais
          </h2>
          <p className="text-slate-600 text-base">
            A nossa plataforma elimina barreiras, garantindo transparência, pontualidade e uma experiência sem complicações.
          </p>
        </div>

        {/* Feature Grid with Central Smartphone Representation */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
          
          {/* Left Column Features */}
          <div className="space-y-8">
            
            {/* Feature 1 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative group">
              <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center mb-4 font-bold group-hover:scale-110 transition-transform">
                <UserCheck size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Busca & Profissionais Verificados</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Encontre especialistas credenciados em diversas áreas com perfis detalhados e avaliações autênticas de utilizadores.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative group">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 font-bold group-hover:scale-110 transition-transform">
                <Calendar size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Agendamento Fácil & Flexível</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Marque atendimentos para a data e hora mais convenientes sem necessidade de chamadas telefónicas demoradas.
              </p>
            </div>

          </div>

          {/* Center Phone Display */}
          <div className="flex justify-center my-4 lg:my-0">
            <div className="bg-slate-900 p-4 rounded-[40px] shadow-2xl border-4 border-slate-800 max-w-[280px] w-full">
              <div className="bg-primary-700 rounded-[30px] p-5 text-white text-center space-y-4 min-h-[400px] flex flex-col justify-between">
                <div className="pt-4">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl mx-auto flex items-center justify-center mb-3">
                    <Smartphone size={32} className="text-white" />
                  </div>
                  <div className="text-xs uppercase tracking-widest text-primary-200 font-bold">App Formocosta</div>
                  <div className="text-xl font-black mt-1">Solução Tudo-em-Um</div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-left space-y-2 border border-white/10">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <CheckCircle2 size={16} className="text-primary-300" /> Clientes Satisfeitos
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <CheckCircle2 size={16} className="text-primary-300" /> Profissionais Ativos
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <CheckCircle2 size={16} className="text-primary-300" /> Notificações Diretas
                  </div>
                </div>

                <div className="pb-2">
                  <a href="#download" className="block w-full py-2.5 bg-white text-primary-800 font-bold text-xs rounded-xl shadow hover:bg-slate-100 transition-colors">
                    Explorar no App
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column Features */}
          <div className="space-y-8">
            
            {/* Feature 3 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative group">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4 font-bold group-hover:scale-110 transition-transform">
                <Briefcase size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Gestão Completa de Negócio</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Para os prestadores de serviço: organize o seu calendário, acompanhe novos clientes e controle a evolução da sua atividade.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative group">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 font-bold group-hover:scale-110 transition-transform">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Segurança & Padrão de Qualidade</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Garantia de comunicação transparente, acompanhamento de histórico e feedback em tempo real após a prestação do serviço.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
