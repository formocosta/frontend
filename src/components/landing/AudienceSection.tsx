'use client';

import { useState } from 'react';
import { ArrowRight, Briefcase, CheckCircle2, Users } from 'lucide-react';

export function AudienceSection() {
  const [activeTab, setActiveTab] = useState<'clients' | 'pros'>('clients');

  return (
    <section id="para-quem" className="py-20 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-block px-3.5 py-1 rounded-full bg-primary-100 text-primary-800 text-xs font-bold uppercase tracking-wider">
            UMA PLATAFORMA, DUAS SOLUÇÕES
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Feito para Quem Procura e para Quem Oferece
          </h2>
        </div>

        {/* Interactive Audience Switcher */}
        <div className="mt-10 flex justify-center">
          <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1 border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('clients')}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'clients'
                  ? 'bg-primary-700 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users size={16} />
              <span>Para Clientes</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('pros')}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'pros'
                  ? 'bg-primary-700 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase size={16} />
              <span>Para Profissionais</span>
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="mt-12 max-w-4xl mx-auto bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm">
          {activeTab === 'clients' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-slate-900">
                  A forma mais fácil de resolver as suas necessidades diárias
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-slate-700 text-sm">
                    <CheckCircle2 size={18} className="text-primary-700 shrink-0 mt-0.5" />
                    <span><strong>Acesso a Profissionais Credenciados:</strong> Todos os perfis passam por validação.</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-700 text-sm">
                    <CheckCircle2 size={18} className="text-primary-700 shrink-0 mt-0.5" />
                    <span><strong>Agendamento em Tempo Real:</strong> Escolha horários livres diretamente na agenda do profissional.</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-700 text-sm">
                    <CheckCircle2 size={18} className="text-primary-700 shrink-0 mt-0.5" />
                    <span><strong>Transparência de Preços:</strong> Saiba exatamente quanto vai pagar antes de confirmar.</span>
                  </li>
                </ul>
                <a
                  href="#download"
                  className="inline-flex items-center gap-2 text-sm font-bold text-primary-700 hover:text-primary-800"
                >
                  <span>Comece a procurar serviços agora</span>
                  <ArrowRight size={16} />
                </a>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-inner space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">O que você ganha como cliente</div>
                <div className="space-y-3">
                  <div className="p-3 bg-primary-50 rounded-xl flex items-center justify-between">
                    <span className="text-xs font-bold text-primary-900">Economia de Tempo</span>
                    <span className="text-xs font-black text-primary-700">100% Digital</span>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-xl flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900">Histórico de Atendimentos</span>
                    <span className="text-xs font-black text-emerald-700">Organizado</span>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-xl flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900">Suporte Dedicado</span>
                    <span className="text-xs font-black text-blue-700">Sempre Ativo</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-slate-900">
                  Ferramentas profissionais para fazer o seu negócio crescer
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-slate-700 text-sm">
                    <CheckCircle2 size={18} className="text-primary-700 shrink-0 mt-0.5" />
                    <span><strong>Visibilidade Ampliada:</strong> Seja encontrado por centenas de novos clientes na sua zona.</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-700 text-sm">
                    <CheckCircle2 size={18} className="text-primary-700 shrink-0 mt-0.5" />
                    <span><strong>Gestão de Agenda Automática:</strong> Defina os seus horários e evite sobreposição de compromissos.</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-700 text-sm">
                    <CheckCircle2 size={18} className="text-primary-700 shrink-0 mt-0.5" />
                    <span><strong>Aumento de Faturação:</strong> Ferramentas completas para controlar rendimentos e pedidos.</span>
                  </li>
                </ul>
                <a
                  href="#download"
                  className="inline-flex items-center gap-2 text-sm font-bold text-primary-700 hover:text-primary-800"
                >
                  <span>Cadastre o seu perfil profissional</span>
                  <ArrowRight size={16} />
                </a>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-inner space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">O que você ganha como profissional</div>
                <div className="space-y-3">
                  <div className="p-3 bg-primary-50 rounded-xl flex items-center justify-between">
                    <span className="text-xs font-bold text-primary-900">Mais Clientes Mensais</span>
                    <span className="text-xs font-black text-primary-700">Crescimento</span>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-xl flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900">Controlo de Agenda</span>
                    <span className="text-xs font-black text-emerald-700">Sem Faltas</span>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-xl flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900">Reputação de Marca</span>
                    <span className="text-xs font-black text-amber-700">Avaliações 5★</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
