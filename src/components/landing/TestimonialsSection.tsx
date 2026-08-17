import { Star } from 'lucide-react';

export function TestimonialsSection() {
  return (
    <section id="depoimentos" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-block px-3.5 py-1 rounded-full bg-primary-100 text-primary-800 text-xs font-bold uppercase tracking-wider">
            AVALIAÇÕES REAIS
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            O que Dizem Nossos Utilizadores
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-current" />
              ))}
            </div>
            <p className="text-slate-600 text-sm italic leading-relaxed">
              "Encontrar um eletricista de confiança era um desafio constante. Com a app Formocosta, agendei em minutos e o serviço foi impecável."
            </p>
            <div className="pt-2 flex items-center gap-3 border-t border-slate-100">
              <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-xs">
                AM
              </div>
              <div>
                <div className="font-bold text-slate-900 text-xs">Ana Maria</div>
                <div className="text-[10px] text-slate-400">Cliente em Luanda</div>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-current" />
              ))}
            </div>
            <p className="text-slate-600 text-sm italic leading-relaxed">
              "Desde que me registei como prestador de serviços na Formocosta, a minha carteira de clientes duplicou. A gestão da agenda é fantástica."
            </p>
            <div className="pt-2 flex items-center gap-3 border-t border-slate-100">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs">
                CB
              </div>
              <div>
                <div className="font-bold text-slate-900 text-xs">Carlos Bernardo</div>
                <div className="text-[10px] text-slate-400">Técnico de Climatização</div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-current" />
              ))}
            </div>
            <p className="text-slate-600 text-sm italic leading-relaxed">
              "A transparência e as avaliações reais dão-me total segurança antes de contratar qualquer profissional para a minha casa."
            </p>
            <div className="pt-2 flex items-center gap-3 border-t border-slate-100">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                VS
              </div>
              <div>
                <div className="font-bold text-slate-900 text-xs">Valdemar Sousa</div>
                <div className="text-[10px] text-slate-400">Cliente Frequente</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
