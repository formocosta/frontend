import {
  Bell,
  CheckCircle2,
  MapPin,
  Search,
  ShieldCheck,
  Star,
  Calendar,
  Users,
} from 'lucide-react';

export function PhoneMockupTrio() {
  return (
    <div className="mt-4 relative max-w-5xl mx-auto flex items-center justify-center">
      {/* Background Arc / Circle Accent (Orange Arch matching reference design) */}
      <div className="absolute bottom-0 w-[90%] sm:w-[85%] h-[260px] sm:h-[300px] bg-[#f2811d] rounded-t-full shadow-xl overflow-hidden -z-10" />

      {/* Smartphone Container Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end w-full max-w-3xl px-4 pt-4">
        
        {/* Left Smartphone Mockup (Para Profissionais) */}
        <div className="hidden md:block transform -rotate-3 hover:rotate-0 transition-transform duration-500">
          <div className="bg-slate-900 p-2.5 rounded-[32px] shadow-2xl border-4 border-slate-800">
            <div className="bg-slate-50 rounded-[24px] p-3 text-[11px] space-y-2 min-h-[290px] max-h-[310px] overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                <span className="font-extrabold text-slate-800">Painel Profissional</span>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[9px]">Online</span>
              </div>
              
              <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-100 space-y-1">
                <div className="text-[9px] text-slate-400 font-bold uppercase">Ganhos Hoje</div>
                <div className="text-base font-black text-primary-700">45.000 Kz</div>
                <div className="text-[9px] text-emerald-600 font-medium">↑ +18% esta semana</div>
              </div>

              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-slate-700">Próximos Agendamentos</div>
                <div className="bg-white p-2 rounded-lg border border-slate-100 space-y-0.5">
                  <div className="flex justify-between font-semibold text-slate-800 text-[10px]">
                    <span>Manutenção Elétrica</span>
                    <span className="text-primary-600 font-bold">14:30</span>
                  </div>
                  <div className="text-[9px] text-slate-500 flex items-center gap-1">
                    <MapPin size={9} /> Kilamba
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Main Smartphone Mockup (Para Clientes & Busca) */}
        <div className="transform md:-translate-y-2 hover:translate-y-0 transition-transform duration-500">
          <div className="bg-slate-900 p-3 rounded-[36px] shadow-2xl border-4 border-slate-800 ring-1 ring-white/20">
            
            {/* Speaker Notch */}
            <div className="w-20 h-3 bg-slate-800 mx-auto rounded-b-xl mb-1.5" />

            <div className="bg-white rounded-[26px] p-3 text-[11px] space-y-2.5 min-h-[340px] max-h-[360px] shadow-inner overflow-hidden">
              
              <div className="flex items-center justify-between pt-0.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-[10px]">
                    FC
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-[10px]">Formocosta App</div>
                    <div className="text-[8px] text-slate-400">Olá, bem-vindo!</div>
                  </div>
                </div>
                <Bell size={14} className="text-slate-400" />
              </div>

              <div className="bg-slate-100 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 text-slate-400">
                <Search size={12} />
                <span className="text-[10px]">Procurar eletricista...</span>
              </div>

              <div>
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Categorias</div>
                <div className="grid grid-cols-3 gap-1 text-center">
                  <div className="bg-primary-50 p-1.5 rounded-lg text-primary-800 font-medium text-[9px]">
                    🛠️ Serviço
                  </div>
                  <div className="bg-emerald-50 p-1.5 rounded-lg text-emerald-800 font-medium text-[9px]">
                    💇 Estética
                  </div>
                  <div className="bg-blue-50 p-1.5 rounded-lg text-blue-800 font-medium text-[9px]">
                    🩺 Saúde
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 text-white p-2.5 rounded-xl space-y-1.5 shadow-md">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center font-bold text-white text-xs">
                    DR
                  </div>
                  <div>
                    <div className="font-bold text-[11px] flex items-center gap-1">
                      Dr. Manuel Silva <ShieldCheck size={10} className="text-emerald-400" />
                    </div>
                    <div className="text-[9px] text-slate-300">Fisioterapeuta Verificado</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[9px] border-t border-slate-800 pt-1.5 text-slate-300">
                  <span className="text-amber-400 font-bold">★ 4.9 (128)</span>
                  <button className="bg-primary-600 text-white px-2.5 py-0.5 rounded font-bold text-[9px]">
                    Agendar
                  </button>
                </div>
              </div>

              <div className="pt-1.5 border-t border-slate-100 flex items-center justify-around text-slate-400">
                <div className="text-primary-700 font-bold flex flex-col items-center">
                  <Search size={14} />
                  <span className="text-[7px]">Início</span>
                </div>
                <div className="flex flex-col items-center">
                  <Calendar size={14} />
                  <span className="text-[7px]">Agenda</span>
                </div>
                <div className="flex flex-col items-center">
                  <Users size={14} />
                  <span className="text-[7px]">Perfil</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Smartphone Mockup (Notificações & Confirmados) */}
        <div className="hidden md:block transform rotate-3 hover:rotate-0 transition-transform duration-500">
          <div className="bg-slate-900 p-2.5 rounded-[32px] shadow-2xl border-4 border-slate-800">
            <div className="bg-slate-50 rounded-[24px] p-3 text-[11px] space-y-2 min-h-[290px] max-h-[310px] overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                <span className="font-extrabold text-slate-800">Notificações</span>
                <span className="text-[9px] text-slate-400">Agora</span>
              </div>

              <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-100 flex gap-2">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-800 text-[10px]">Agendamento Confirmado!</div>
                  <div className="text-[9px] text-slate-500">Serviço marcado para amanhã às 09:00.</div>
                </div>
              </div>

              <div className="bg-emerald-900 text-white p-2.5 rounded-xl space-y-0.5">
                <div className="text-[9px] text-emerald-300 font-bold">Dica Formocosta</div>
                <div className="text-[9px] leading-snug">Mantenha as notificações ativas para não perder agendamentos.</div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
