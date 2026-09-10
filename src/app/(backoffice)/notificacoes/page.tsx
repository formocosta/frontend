'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  AlertCircle,
  Info,
  Clock,
  ExternalLink,
  Filter,
  UserCheck,
  CreditCard,
  HelpCircle,
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/common/form/Button';
import { DefinicoesService, Notificacao } from '@/service/definicoes.service';

export default function NotificacoesPage() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'todas' | 'nao_lidas'>('todas');
  const [markingAll, setMarkingAll] = useState(false);
  const [markingId, setMarkingId] = useState<string | null>(null);

  const fetchNotificacoes = async () => {
    try {
      setLoading(true);
      const res = await DefinicoesService.getNotificacoes();
      setNotificacoes(res.data || []);
    } catch (err) {
      console.error('Erro ao carregar notificações:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotificacoes();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      setMarkingId(id);
      await DefinicoesService.markNotificacaoAsRead(id);
      setNotificacoes((prev) =>
        prev.map((item) => (item.id === id ? { ...item, lida: true } : item))
      );
    } catch (err) {
      console.error('Erro ao marcar notificação como lida:', err);
    } finally {
      setMarkingId(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAll(true);
      await DefinicoesService.markAllNotificacoesAsRead();
      setNotificacoes((prev) => prev.map((item) => ({ ...item, lida: true })));
    } catch (err) {
      console.error('Erro ao marcar todas notificações como lidas:', err);
    } finally {
      setMarkingAll(false);
    }
  };

  const filteredNotificacoes = notificacoes.filter((item) => {
    if (filter === 'nao_lidas') return !item.lida;
    return true;
  });

  const totalNaoLidas = notificacoes.filter((item) => !item.lida).length;

  const getTipoIcon = (tipo: string) => {
    switch (tipo?.toLowerCase()) {
      case 'kyc':
        return <UserCheck className="w-5 h-5 text-amber-500" />;
      case 'repasse':
      case 'pagamento':
        return <CreditCard className="w-5 h-5 text-emerald-500" />;
      case 'suporte':
        return <HelpCircle className="w-5 h-5 text-blue-500" />;
      case 'alerta':
        return <AlertCircle className="w-5 h-5 text-rose-500" />;
      default:
        return <Info className="w-5 h-5 text-[#42b883]" />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Central de Notificações"
        description="Acompanhe alertas, requisições de suporte e movimentações do sistema em tempo real"
        action={
          totalNaoLidas > 0 ? (
            <Button
              variant="outline"
              onClick={handleMarkAllAsRead}
              isLoading={markingAll}
              className="border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold rounded-md"
              leftIcon={<CheckCheck size={16} className="text-[#42b883]" />}
            >
              Marcar todas como lidas
            </Button>
          ) : undefined
        }
      />

      {/* Filter Tabs & Stats Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-gray-100 p-4 rounded-md shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('todas')}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-colors flex items-center gap-2 ${
              filter === 'todas'
                ? 'bg-[#42b883] text-white shadow-sm'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100'
            }`}
          >
            <Filter size={14} />
            Todas ({notificacoes.length})
          </button>
          <button
            onClick={() => setFilter('nao_lidas')}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-colors flex items-center gap-2 ${
              filter === 'nao_lidas'
                ? 'bg-[#42b883] text-white shadow-sm'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100'
            }`}
          >
            <Bell size={14} />
            Não Lidas ({totalNaoLidas})
          </button>
        </div>

        {totalNaoLidas > 0 && (
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-md border border-amber-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            {totalNaoLidas} {totalNaoLidas === 1 ? 'notificação pendente' : 'notificações pendentes'}
          </span>
        )}
      </div>

      {/* List Container */}
      {loading ? (
        <div className="bg-white rounded-md p-12 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-2 border-[#42b883] border-t-transparent rounded-md animate-spin" />
          <p className="text-sm text-gray-500 mt-4 font-medium">A carregar notificações...</p>
        </div>
      ) : filteredNotificacoes.length === 0 ? (
        <div className="bg-white rounded-md p-12 text-center border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#42b883] flex items-center justify-center mx-auto">
            <CheckCircle2 size={24} />
          </div>
          <h3 className="text-base font-bold text-gray-900">Sem notificações</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto font-medium">
            {filter === 'nao_lidas'
              ? 'Não possui notificações por ler no momento.'
              : 'Não há registos de notificações no seu histórico.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotificacoes.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-md border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm ${
                item.lida
                  ? 'bg-white border-gray-100 opacity-90'
                  : 'bg-emerald-50/30 border-emerald-200/60 shadow-[0_2px_12px_rgba(66,184,131,0.05)]'
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="p-2.5 rounded-md bg-white border border-gray-100 shadow-sm shrink-0 mt-0.5">
                  {getTipoIcon(item.tipo)}
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-gray-900 leading-snug">{item.titulo}</h4>
                    {!item.lida && (
                      <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-[#42b883] text-white rounded">
                        Nova
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed">{item.mensagem}</p>
                  <div className="flex items-center gap-3 text-[11px] text-gray-400 font-semibold pt-1">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {item.created_at}
                    </span>
                    <span className="uppercase text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-bold">
                      {item.tipo}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100 shrink-0">
                {item.link && item.link !== '#' && (
                  <Link
                    href={item.link}
                    className="px-3 py-1.5 text-xs font-bold text-[#42b883] bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors flex items-center gap-1.5"
                  >
                    Ver Detalhes
                    <ExternalLink size={14} />
                  </Link>
                )}

                {!item.lida && (
                  <button
                    onClick={() => handleMarkAsRead(item.id)}
                    disabled={markingId === item.id}
                    className="px-3 py-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <CheckCircle2 size={14} className="text-[#42b883]" />
                    Marcar como Lida
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
