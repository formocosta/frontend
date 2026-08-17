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
    <div className="mt-14 relative max-w-5xl mx-auto flex items-center justify-center">
      {/* Background Arc / Circle Accent */}
      <div className="absolute bottom-0 w-[80%] h-[320px] bg-gradient-to-t from-primary-700 to-primary-600 rounded-t-full shadow-2xl overflow-hidden -z-10" />

      {/* Smartphone Container Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end w-full max-w-4xl px-4 pt-8">
        
        {/* Left Smartphone Mockup (Para Profissionais) */}
        <div className="hidden md:block transform -rotate-3 hover:rotate-0 transition-transform duration-500">
          <div className="bg-slate-900 p-3 rounded-[36px] shadow-2xl border-4 border-slate-800">
            <div className="bg-slate-50 rounded-[28px] p-4 text-xs space-y-3 min-h-[380px] overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-extrabold text-slate-800">Painel Profissional</span>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px]">Online</span>
              </div>
              
              <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 space-y-1.5">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Ganhos Hoje</div>
                <div className="text-lg font-black text-primary-700">45.000 Kz</div>
                <div className="text-[10px] text-emerald-600 font-medium">↑ +18% esta semana</div>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-700">Próximos Agendamentos</div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>Manutenção Elétrica</span>
                    <span className="text-primary-600 font-bold">14:30</span>
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-1">
                    <MapPin size={10} /> Centralidade do Kilamba
                  </div>
                </div>
                
                <div className="bg-white p-2.5 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>Consulta Estética</span>
                    <span className="text-primary-600 font-bold">16:00</span>
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-1">
                    <MapPin size={10} /> Talatona, Luanda
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Main Smartphone Mockup (Para Clientes & Busca) */}
        <div className="transform md:-translate-y-4 hover:translate-y-0 transition-transform duration-500">
          <div className="bg-slate-900 p-3.5 rounded-[42px] shadow-2xl border-4 border-slate-800 ring-1 ring-white/20">
            
            {/* Speaker Notch */}
            <div className="w-24 h-4 bg-slate-800 mx-auto rounded-b-xl mb-2" />

            <div className="bg-white rounded-[32px] p-4 text-xs space-y-3.5 min-h-[440px] shadow-inner">
              
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center">
                    FC
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-[11px]">Formocosta App</div>
                    <div className="text-[9px] text-slate-400">Olá, bem-vindo!</div>
                  </div>
                </div>
                <Bell size={16} className="text-slate-400" />
              </div>

              <div className="bg-slate-100 rounded-xl px-3 py-2 flex items-center gap-2 text-slate-400">
                <Search size={14} />
                <span className="text-[11px]">Procurar eletricista, médico...</span>
              </div>

              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Categorias Populares</div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-primary-50 p-2 rounded-xl text-primary-800 font-medium text-[10px] border border-primary-100">
                    🛠️ Manutenção
                  </div>
                  <div className="bg-emerald-50 p-2 rounded-xl text-emerald-800 font-medium text-[10px] border border-emerald-100">
                    💇 Estética
                  </div>
                  <div className="bg-blue-50 p-2 rounded-xl text-blue-800 font-medium text-[10px] border border-blue-100">
                    🩺 Saúde
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 text-white p-3 rounded-2xl space-y-2 shadow-md">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center font-bold text-white text-sm">
                    DR
                  </div>
                  <div>
                    <div className="font-bold text-[12px] flex items-center gap-1">
                      Dr. Manuel Silva <ShieldCheck size={12} className="text-emerald-400" />
                    </div>
                    <div className="text-[10px] text-slate-300">Fisioterapeuta Verificado</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] border-t border-slate-800 pt-2 text-slate-300">
                  <div className="flex items-center gap-1 text-amber-400 font-bold">
                    ★ 4.9 (128 avaliações)
                  </div>
                  <button className="bg-primary-600 hover:bg-primary-500 text-white px-3 py-1 rounded-lg font-bold text-[10px]">
                    Agendar
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-around text-slate-400">
                <div className="text-primary-700 font-bold flex flex-col items-center">
                  <Search size={16} />
                  <span className="text-[8px]">Início</span>
                </div>
                <div className="flex flex-col items-center">
                  <Calendar size={16} />
                  <span className="text-[8px]">Agenda</span>
                </div>
                <div className="flex flex-col items-center">
                  <Users size={16} />
                  <span className="text-[8px]">Perfil</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Smartphone Mockup (Notificações & Confirmados) */}
        <div className="hidden md:block transform rotate-3 hover:rotate-0 transition-transform duration-500">
          <div className="bg-slate-900 p-3 rounded-[36px] shadow-2xl border-4 border-slate-800">
            <div className="bg-slate-50 rounded-[28px] p-4 text-xs space-y-3 min-h-[380px]">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-extrabold text-slate-800">Notificações</span>
                <span className="text-[10px] text-slate-400">Agora</span>
              </div>

              <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex gap-2">
                <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-800 text-[11px]">Agendamento Confirmado!</div>
                  <div className="text-[10px] text-slate-500">O seu serviço de climatização foi agendado para amanhã às 09:00.</div>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex gap-2">
                <Star size={18} className="text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-800 text-[11px]">Nova Avaliação 5★</div>
                  <div className="text-[10px] text-slate-500">"Excelente profissional, muito pontual e atencioso."</div>
                </div>
              </div>

              <div className="bg-emerald-900 text-white p-3 rounded-xl space-y-1">
                <div className="text-[10px] text-emerald-300 font-bold">Dica Formocosta</div>
                <div className="text-[10px] leading-relaxed">Mantenha as suas notificações ativas para nunca perder um pedido de serviço.</div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
