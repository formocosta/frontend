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
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col justify-between w-full transition-all duration-200">
      <div>
        {/* Header Block */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Disputas Recentes</h2>
            <p className="text-xs text-gray-500 mt-0.5">As 5 disputas abertas mais recentes no sistema administrativo</p>
          </div>
          <Scale size={16} className="text-gray-400" />
        </div>

        {/* Content States Rendering */}
        <div className="w-full">
          {isLoading ? (
            /* Skeleton Loading State */
            <div className="divide-y divide-gray-100 animate-pulse">
              <div className="p-4 grid grid-cols-4 gap-4 bg-gray-50/20">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-4 grid grid-cols-4 gap-4 items-center">
                  <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                  <div className="w-16 h-5 bg-gray-100 rounded-full"></div>
                </div>
              ))}
            </div>
          ) : errorMsg ? (
            /* Error State card */
            <div className="p-8 flex flex-col items-center justify-center text-center gap-3 animate-in fade-in duration-350">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                <AlertTriangle size={24} />
              </div>
              <div className="max-w-md">
                <h3 className="text-sm font-semibold text-gray-950">Erro ao carregar dados</h3>
                <p className="text-xs text-gray-500 mt-1">{errorMsg}</p>
              </div>
              <button
                onClick={loadData}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:border-gray-400 transition-colors shadow-2xs cursor-pointer"
              >
                <RotateCw size={12} className="animate-hover-spin" />
                Tentar Novamente
              </button>
            </div>
          ) : disputes.length === 0 ? (
            /* Empty State card */
            <div className="p-8 flex flex-col items-center justify-center text-center gap-3 animate-in fade-in duration-350">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 border border-gray-100">
                <Inbox size={22} />
              </div>
              <div className="max-w-md">
                <h3 className="text-sm font-semibold text-gray-950">Nenhuma disputa aberta</h3>
                <p className="text-xs text-gray-500 mt-1">De momento, não existem disputas pendentes de resolução no sistema.</p>
              </div>
            </div>
          ) : (
            /* Success State - Responsive Table */
            <div className="overflow-x-auto animate-in fade-in duration-350">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/30">
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Prestador</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Data de abertura</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {disputes.map((dispute) => (
                    <tr key={dispute.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 text-xs font-semibold text-gray-800">{dispute.cliente}</td>
                      <td className="p-4 text-xs font-medium text-gray-700">{dispute.prestador}</td>
                      <td className="p-4 text-xs text-gray-500 font-medium">
                        {formatDate(dispute.dataAbertura)}
                      </td>
                      <td className="p-4 text-xs">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${badgeColors[dispute.estado]}`}>
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

      {/* Footer / Fila completa */}
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <a
          href="/dashboard/disputas"
          className="inline-flex items-center justify-center gap-1.5 w-full text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          Ir para a moderação de disputas completa
          <ArrowRight size={14} />
        </a>
      </div>
    </div>
  );
}
