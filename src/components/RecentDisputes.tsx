'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { AlertTriangle, Inbox, RotateCw, Scale, ArrowRight } from 'lucide-react';

export interface Dispute {
  id: string;
  cliente: string;
  prestador: string;
  dataAbertura: string;
  estado: 'Aberta' | 'Em análise' | 'Pendente';
}

const MOCK_DISPUTES: Dispute[] = [
  { id: '1', cliente: 'Manuel Nzagi', prestador: 'Carlos Silva', dataAbertura: '2026-06-16T15:20:00Z', estado: 'Aberta' },
  { id: '2', cliente: 'Edna Mateus', prestador: 'Ana Rodrigues', dataAbertura: '2026-06-16T13:30:00Z', estado: 'Em análise' },
  { id: '3', cliente: 'Amílcar Sousa', prestador: 'João Pereira', dataAbertura: '2026-06-16T08:30:00Z', estado: 'Pendente' },
  { id: '4', cliente: 'Kiara de Almeida', prestador: 'Pedro Santos', dataAbertura: '2026-06-15T14:20:00Z', estado: 'Aberta' },
  { id: '5', cliente: 'José Camões', prestador: 'Maria Costa', dataAbertura: '2026-06-05T10:15:00Z', estado: 'Em análise' },
  { id: '6', cliente: 'Beatriz Costa', prestador: 'Lucas Neto', dataAbertura: '2026-06-04T09:00:00Z', estado: 'Pendente' },
];

export default function RecentDisputes() {
  const viewState = 'success';
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const loadData = useCallback(() => {
    setIsLoading(true);
    setErrorMsg(null);
    setDisputes([]);

    if (timerRef.current) clearTimeout(timerRef.current);

    // Simulating API Fetch
    timerRef.current = setTimeout(() => {
      if (viewState === 'loading') {
        // stay loading
        return;
      }
      if (viewState === 'error') {
        setErrorMsg('Ocorreu um erro ao carregar as disputas do servidor. Por favor, tente novamente.');
        setIsLoading(false);
        return;
      }
      if (viewState === 'empty') {
        setDisputes([]);
        setIsLoading(false);
        return;
      }

      // Success
      // Filter open states, sort by date descending, take top 5
      const sorted = [...MOCK_DISPUTES]
        .sort((a, b) => new Date(b.dataAbertura).getTime() - new Date(a.dataAbertura).getTime())
        .slice(0, 5);

      setDisputes(sorted);
      setIsLoading(false);
    }, 600);
  }, [viewState]);

  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchTimer = setTimeout(() => {
      loadData();
    }, 0);

    refreshIntervalRef.current = setInterval(() => {
      loadData();
    }, 5 * 60 * 1000);

    return () => {
      clearTimeout(fetchTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
    };
  }, [loadData]);

  // Format date helper
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  // Badge colors config
  const badgeColors = {
    'Aberta': 'bg-amber-50 text-amber-700 border-amber-150 hover:bg-amber-100/60',
    'Em análise': 'bg-blue-50 text-blue-700 border-blue-150 hover:bg-blue-100/60',
    'Pendente': 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100/60',
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col justify-between w-full transition-all duration-200">
      <div>
        {/* Header Block */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-[15px] font-bold text-slate-900">Disputas Recentes</h2>
            <p className="text-xs text-slate-400 mt-0.5">As 5 disputas abertas mais recentes</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <Scale size={16} className="text-emerald-600" strokeWidth={1.5} />
          </div>
        </div>

        {/* Content States Rendering */}
        <div className="w-full">
          {isLoading ? (
            <div className="divide-y divide-slate-50 animate-pulse">
              <div className="p-4 grid grid-cols-4 gap-4 bg-slate-50/30">
                {[1,2,3,4].map(i => <div key={i} className="h-3 bg-slate-100 rounded w-1/2"></div>)}
              </div>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-4 grid grid-cols-4 gap-4 items-center">
                  <div className="h-3 bg-slate-100 rounded w-2/3"></div>
                  <div className="h-3 bg-slate-100 rounded w-2/3"></div>
                  <div className="h-3 bg-slate-100 rounded w-3/4"></div>
                  <div className="w-16 h-5 bg-slate-100 rounded-full"></div>
                </div>
              ))}
            </div>
          ) : errorMsg ? (
            <div className="p-8 flex flex-col items-center justify-center text-center gap-3">
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
                <AlertTriangle size={24} />
              </div>
              <div className="max-w-md">
                <h3 className="text-sm font-bold text-slate-900">Erro ao carregar dados</h3>
                <p className="text-xs text-slate-500 mt-1">{errorMsg}</p>
              </div>
              <button
                onClick={loadData}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:border-slate-300 transition-colors cursor-pointer"
              >
                <RotateCw size={12} />
                Tentar Novamente
              </button>
            </div>
          ) : disputes.length === 0 ? (
            <div className="p-8 flex flex-col items-center justify-center text-center gap-3">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100">
                <Inbox size={22} />
              </div>
              <div className="max-w-md">
                <h3 className="text-sm font-bold text-slate-900">Nenhuma disputa aberta</h3>
                <p className="text-xs text-slate-500 mt-1">De momento, não existem disputas pendentes de resolução.</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cliente</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Prestador</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden md:table-cell">Data</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {disputes.map((dispute) => (
                    <tr key={dispute.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3.5 text-xs font-semibold text-slate-800">{dispute.cliente}</td>
                      <td className="px-6 py-3.5 text-xs text-slate-600">{dispute.prestador}</td>
                      <td className="px-6 py-3.5 text-xs text-slate-400 hidden md:table-cell">
                        {formatDate(dispute.dataAbertura)}
                      </td>
                      <td className="px-6 py-3.5 text-xs">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${badgeColors[dispute.estado]}`}>
                          {dispute.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-100">
        <a
          href="/dashboard/disputas"
          className="inline-flex items-center justify-center gap-1.5 w-full text-xs font-semibold text-[#06241C] hover:text-emerald-700 hover:bg-green-50 py-2 rounded-xl transition-all"
        >
          Ir para a moderação de disputas completa
          <ArrowRight size={14} />
        </a>
      </div>
    </div>
  );
}
