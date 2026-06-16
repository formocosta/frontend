'use client';

import { use, useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, FileText, CheckCircle2, AlertCircle,
  Calendar, UserCheck, Scale, Clock, ShieldAlert,
  Loader, Check, X, AlertTriangle, RotateCw
} from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  bi: string;
  dataSubmissao: string;
  status: 'pendente' | 'em_analise' | 'entrevista_agendada';
  documentosEnviados: number;
  operadorAtribuido: string;
}

interface DocumentDetail {
  nome: string;
  tipo: string;
  tamanho: string;
  dataEnvio: string;
  ficheiro: string;
}

export default function CandidateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [approvedDocs, setApprovedDocs] = useState<Record<string, boolean>>({
    'bi': true,
    'antecedentes': false,
    'residencia': false,
    'carta': false,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const loadData = useCallback(() => {
    setIsLoading(true);
    setErrorMsg(null);

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      try {
        const stored = localStorage.getItem('kyc_candidaturas');
        if (stored) {
          const data: Candidate[] = JSON.parse(stored);
          const index = data.findIndex(c => c.id === id);
          if (index !== -1) {
            let item = data[index];
            if (item.status === 'pendente') {
              // Auto-mark as 'em_analise' when opened
              item = { ...item, status: 'em_analise' };
              data[index] = item;
              localStorage.setItem('kyc_candidaturas', JSON.stringify(data));
            }
            setCandidate(item);
          } else {
            setErrorMsg('Candidatura não encontrada.');
          }
        } else {
          setErrorMsg('Não foi possível carregar as candidaturas da plataforma.');
        }
      } catch {
        setErrorMsg('Erro ao ler a base de dados de candidaturas.');
      } finally {
        setIsLoading(false);
      }
    }, 400);
  }, [id]);

  useEffect(() => {
    loadData();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [loadData]);

  const updateStatus = (newStatus: 'pendente' | 'em_analise' | 'entrevista_agendada') => {
    if (!candidate) return;
    try {
      const stored = localStorage.getItem('kyc_candidaturas');
      if (stored) {
        const data: Candidate[] = JSON.parse(stored);
        const index = data.findIndex(c => c.id === candidate.id);
        if (index !== -1) {
          const updatedItem = { ...candidate, status: newStatus };
          data[index] = updatedItem;
          localStorage.setItem('kyc_candidaturas', JSON.stringify(data));
          setCandidate(updatedItem);
        }
      }
    } catch (err) {
      console.error('Erro ao atualizar o estado da candidatura', err);
    }
  };

  const toggleDocApproval = (docKey: string) => {
    setApprovedDocs(prev => ({
      ...prev,
      [docKey]: !prev[docKey]
    }));
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const statusBadges = {
    'pendente': { label: 'Pendente', classes: 'bg-gray-50 text-gray-650 border-gray-250' },
    'em_analise': { label: 'Em análise', classes: 'bg-blue-50 text-blue-700 border-blue-150' },
    'entrevista_agendada': { label: 'Entrevista Agendada', classes: 'bg-indigo-50 text-indigo-700 border-indigo-150' },
  };

  const documentsList: { key: string; name: string; type: string; size: string; description: string }[] = [
    { key: 'bi', name: 'Bilhete de Identidade (BI)', type: 'PDF / Imagem', size: '2.4 MB', description: 'Cópia digitalizada do documento de identificação nacional (Frente e Verso)' },
    { key: 'antecedentes', name: 'Registo Criminal', type: 'PDF', size: '1.1 MB', description: 'Certificado de registo criminal válido emitido pelas autoridades competentes' },
    { key: 'residencia', name: 'Comprovativo de Residência', type: 'PDF / JPEG', size: '1.7 MB', description: 'Fatura de serviços públicos ou declaração de residência oficial com menos de 3 meses' },
    { key: 'carta', name: 'Carta de Condução / Licença', type: 'PDF / Imagem', size: '1.9 MB', description: 'Documento comprovativo da habilitação legal para condução ou licença profissional' },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 max-w-[1400px] mx-auto pb-8">
        <div className="h-5 bg-gray-150 rounded w-1/4 animate-pulse"></div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white rounded-2xl p-6 border border-gray-200 shadow-xs h-[300px] animate-pulse"></div>
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-xs h-[500px] animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (errorMsg || !candidate) {
    return (
      <div className="max-w-[1400px] mx-auto py-12 flex flex-col items-center justify-center text-center gap-4">
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-red-500 shadow-2xs border border-red-100">
          <AlertTriangle size={28} />
        </div>
        <div className="max-w-md">
          <h2 className="text-base font-bold text-gray-900">Não foi possível carregar a candidatura</h2>
          <p className="text-xs text-gray-500 mt-1">{errorMsg || 'Candidato inválido ou ID incorreto.'}</p>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={() => router.push('/kyc')}
            className="px-4 py-2 bg-white border border-gray-300 hover:border-gray-400 rounded-xl text-xs font-semibold text-gray-700 transition-colors shadow-2xs cursor-pointer"
          >
            Voltar para a Fila
          </button>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-xs font-semibold text-white transition-all shadow-sm cursor-pointer inline-flex items-center gap-1.5"
          >
            <RotateCw size={12} />
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  const daysDiff = (Date.now() - new Date(candidate.dataSubmissao).getTime()) / (1000 * 60 * 60 * 24);
  const isUrgent = daysDiff > 3 && candidate.status === 'pendente';

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-8">

      {/* Back navigation & Page Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/kyc')}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-emerald-700 transition-colors cursor-pointer bg-white px-3.5 py-2 rounded-xl border border-gray-200 shadow-2xs"
        >
          <ArrowLeft size={14} />
          Voltar para a Fila
        </button>

        <div className="text-xs text-gray-400 font-semibold flex items-center gap-1.5">
          <span>Candidaturas</span>
          <span>•</span>
          <span>{candidate.id}</span>
          <span>•</span>
          <span className="text-gray-900 font-bold">{candidate.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Left Column - Candidate Info & Decision Panel */}
        <div className="lg:col-span-1 space-y-6">

          {/* Personal details card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-4">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Candidato</span>
              <h3 className="text-base font-extrabold text-gray-900 tracking-tight leading-tight">{candidate.name}</h3>
              <span className="text-xs font-mono font-semibold text-gray-400 mt-1 block">BI: {candidate.bi}</span>
            </div>

            <div className="h-px bg-gray-100" />

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400 font-semibold">Estado de Análise:</span>
                <div className="flex items-center gap-2">
                  {isUrgent && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-red-50 text-red-700 border border-red-200 animate-pulse">
                      <ShieldAlert size={10} />
                      Urgente
                    </span>
                  )}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusBadges[candidate.status].classes}`}>
                    {statusBadges[candidate.status].label}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400 font-semibold">Submetido em:</span>
                <span className="text-gray-800 font-bold flex items-center gap-1">
                  <Calendar size={12} className="text-gray-450" />
                  {formatDate(candidate.dataSubmissao)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400 font-semibold">Operador Atribuído:</span>
                <span className="text-gray-800 font-bold flex items-center gap-1">
                  <UserCheck size={12} className="text-gray-450" />
                  {candidate.operadorAtribuido}
                </span>
              </div>
            </div>
          </div>

          {/* Decision actions panel */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-4">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Ações de Moderação</h4>

            <div className="space-y-2.5">
              <button
                onClick={() => updateStatus('entrevista_agendada')}
                disabled={candidate.status === 'entrevista_agendada'}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 text-indigo-700 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Clock size={14} />
                Agendar Entrevista
              </button>

              <button
                onClick={() => {
                  alert('Candidatura Aprovada com sucesso! O prestador foi notificado por e-mail.');
                  updateStatus('em_analise');
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-[0.98]"
              >
                <Check size={14} />
                Aprovar Candidatura
              </button>

              <button
                onClick={() => {
                  alert('Candidatura Rejeitada. O prestador foi notificado para rever a documentação.');
                  updateStatus('pendente');
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 hover:bg-red-100 hover:border-red-300 text-red-700 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-[0.98]"
              >
                <X size={14} />
                Rejeitar Candidatura
              </button>
            </div>

            <p className="text-[10px] text-gray-400 font-semibold text-center mt-2 leading-relaxed">
              * A alteração de estado envia notificações automáticas ao e-mail do candidato e altera a visibilidade de sua conta no app.
            </p>
          </div>

        </div>

        {/* Right Column - Visual Document Checker */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Documentação Submetida</h3>
                <p className="text-xs text-gray-500 mt-0.5">Analise cada documento anexado para certificar a elegibilidade do parceiro</p>
              </div>
              <FileText size={18} className="text-gray-400" />
            </div>

            <div className="divide-y divide-gray-100">
              {documentsList.map((doc) => (
                <div key={doc.key} className="p-6 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:bg-gray-50/30 transition-colors">
                  <div className="space-y-2 max-w-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-800">{doc.name}</span>
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.2 rounded font-mono font-semibold">{doc.size}</span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">{doc.description}</p>

                    <div className="flex items-center gap-3 text-[11px] text-gray-450 pt-1">
                      <span className="font-semibold">{doc.type}</span>
                      <span>•</span>
                      <span className="underline cursor-pointer hover:text-emerald-700">doc_anexo_{doc.key}.pdf</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-start md:self-center">
                    <button
                      onClick={() => alert(`A abrir visualização do ficheiro: doc_anexo_${doc.key}.pdf`)}
                      className="px-3 py-1.5 bg-white border border-gray-200 hover:border-gray-400 rounded-lg text-xs font-semibold text-gray-700 transition-colors cursor-pointer"
                    >
                      Visualizar
                    </button>

                    <button
                      onClick={() => toggleDocApproval(doc.key)}
                      className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                        approvedDocs[doc.key]
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                          : 'bg-white border-gray-200 text-gray-300 hover:text-emerald-600 hover:border-emerald-200'
                      }`}
                      title={approvedDocs[doc.key] ? "Documento Aprovado" : "Marcar como Aprovado"}
                    >
                      <Check size={14} strokeWidth={approvedDocs[doc.key] ? 3 : 2} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
