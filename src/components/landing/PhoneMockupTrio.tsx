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
    <div className="mt-1 relative max-w-7xl mx-auto flex items-center justify-center">
      {/* Background Arc / Circle Accent (Perfect SVG Circle Arch matching reference design) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140%] max-w-6xl h-[400px] sm:h-[480px] pointer-events-none -z-10 overflow-hidden flex items-end justify-center">
        <svg viewBox="0 0 1000 500" className="w-full h-full" preserveAspectRatio="none">
          <ellipse cx="500" cy="500" rx="500" ry="460" fill="#f2811d" />
        </svg>
      </div>

      {/* Smartphone Container Flex (Tightly grouped & overlapping like the reference design) */}
      <div className="flex items-center justify-center -space-x-12 sm:-space-x-16 md:-space-x-20 w-full max-w-4xl px-4 pt-4 z-10">

        {/* Left Smartphone Mockup (Tilted left -14deg, overlapping under center) */}
        <div className="hidden sm:block z-0 transform -rotate-[14deg] translate-x-6 translate-y-8 hover:rotate-0 transition-transform duration-500 origin-bottom-right">
          <div className="bg-slate-900 p-3.5 rounded-[40px] shadow-2xl border-4 border-slate-800 w-[240px] sm:w-[280px]">
            <div className="bg-slate-50 rounded-[28px] p-4 text-xs space-y-3 min-h-[380px] max-h-[400px] overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-extrabold text-slate-800 text-xs">Painel Profissional</span>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[9px]">Online</span>
              </div>

              <div className="bg-white p-3.5 rounded-md shadow-sm border border-slate-100 space-y-1">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Ganhos Hoje</div>
                <div className="text-lg font-black text-primary-700">45.000 Kz</div>
                <div className="text-[10px] text-emerald-600 font-medium">↑ +18% esta semana</div>
              </div>

              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-slate-700">Próximos Agendamentos</div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-100 space-y-1">
                  <div className="flex justify-between font-semibold text-slate-800 text-[10px]">
                    <span>Manutenção Elétrica</span>
                    <span className="text-primary-600 font-bold">14:30</span>
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-1">
                    <MapPin size={10} /> Kilamba
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Main Smartphone Mockup (Upright, Front & Centered) */}
        <div className="z-20 transform hover:scale-105 transition-transform duration-500">
          <div className="bg-slate-900 p-4 rounded-[44px] shadow-2xl border-4 border-slate-800 ring-1 ring-white/20 w-[270px] sm:w-[310px]">

            {/* Speaker Notch */}
            <div className="w-28 h-4 bg-slate-800 mx-auto rounded-b-xl mb-2.5" />

            <div className="bg-white rounded-[32px] p-4 text-xs space-y-3.5 min-h-[440px] max-h-[460px] shadow-inner overflow-hidden">

              <div className="flex items-center justify-between pt-0.5">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-sm">
                    FC
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Formocosta App</div>
                    <div className="text-[10px] text-slate-400">Olá, bem-vindo!</div>
                  </div>
                </div>
                <Bell size={18} className="text-slate-400" />
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

              <div className="bg-slate-900 text-white p-2.5 rounded-md space-y-1.5 shadow-md">
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

        {/* Right Smartphone Mockup (Tilted right +14deg, overlapping under center) */}
        <div className="hidden sm:block z-0 transform rotate-[14deg] -translate-x-6 translate-y-8 hover:rotate-0 transition-transform duration-500 origin-bottom-left">
          <div className="bg-slate-900 p-3.5 rounded-[40px] shadow-2xl border-4 border-slate-800 w-[240px] sm:w-[280px]">
            <div className="bg-[#02562b] text-white rounded-[28px] p-4 text-xs space-y-3.5 min-h-[380px] max-h-[400px] overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/20 pb-2">
                <span className="font-extrabold text-white text-xs">Notificações</span>
                <span className="text-[10px] text-emerald-200">Agora</span>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-md border border-white/10 flex gap-2.5">
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white text-xs">Serviço Confirmado!</div>
                  <div className="text-[10px] text-slate-200 mt-0.5">O profissional estará no local às 09:00.</div>
                </div>
              </div>

              <div className="bg-white/15 p-3 rounded-md space-y-1 border border-white/10">
                <div className="text-[10px] text-amber-300 font-bold">Dica Formocosta</div>
                <div className="text-[10px] text-slate-100 leading-snug">Acompanhe o estado do seu pedido em tempo real.</div>
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>

  );
}
