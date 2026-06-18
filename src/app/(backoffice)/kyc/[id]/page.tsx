'use client';

import { use, useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft, User, FileText, Eye, CheckCircle2, XCircle,
  AlertTriangle, RotateCw, Calendar, Shield, PenLine, Clock,
  X, Check, Loader, Save, ExternalLink, FileCheck, Info,
  Lock, FileImage,
} from 'lucide-react';
import EntrevistaSection from './EntrevistaSection';

// ── Types ──────────────────────────────────────────────────

type StatusDocumento = 'pendente' | 'aprovado' | 'rejeitado';
type StatusCandidatura = 'pendente' | 'em_analise' | 'entrevista_agendada' | 'aprovado' | 'rejeitado';

interface Documento {
  id: string;
  nome: string;
  tipo: 'pdf' | 'imagem';
  status: StatusDocumento;
  motivoRejeicao?: string;
}

interface AcaoHistorico {
  id: string;
  tipo: 'status' | 'doc_aprovado' | 'doc_rejeitado' | 'nota' | 'entrevista';
  descricao: string;
  detalhe?: string;
  operador: string;
  data: string;
}

interface PrestadorDetalhe {
  id: string;
  nome: string;
  bi: string;
  dataNascimento: string;
  contacto: string;
  email: string;
  bio: string;
  anosExperiencia: number;
  morada: string;
  statusVerificacao: StatusCandidatura;
  entrevistaConcluida: boolean;
  documentos: Documento[];
  notasInternas: string;
  historico: AcaoHistorico[];
}

// ── Config ─────────────────────────────────────────────────

const CANDIDATURA_STATUS_CFG: Record<StatusCandidatura, { label: string; classes: string }> = {
  pendente:              { label: 'Pendente',             classes: 'bg-amber-50 text-amber-700 border border-amber-100' },
  em_analise:            { label: 'Em Análise',           classes: 'bg-blue-50 text-blue-700 border border-blue-100' },
  entrevista_agendada:   { label: 'Entrevista Agendada',  classes: 'bg-violet-50 text-violet-700 border border-violet-100' },
  aprovado:              { label: 'Aprovado',             classes: 'bg-emerald-50 text-emerald-700 border border-emerald-100' },
  rejeitado:             { label: 'Rejeitado',            classes: 'bg-red-50 text-red-600 border border-red-100' },
};

const DOC_STATUS_CFG: Record<StatusDocumento, { label: string; classes: string; dot: string }> = {
  pendente:  { label: 'Pendente',  classes: 'bg-amber-50 text-amber-700 border border-amber-100',    dot: 'bg-amber-400' },
  aprovado:  { label: 'Aprovado',  classes: 'bg-emerald-50 text-emerald-700 border border-emerald-100', dot: 'bg-emerald-500' },
  rejeitado: { label: 'Rejeitado', classes: 'bg-red-50 text-red-600 border border-red-100',          dot: 'bg-red-500' },
};

const HISTORICO_DOT: Record<AcaoHistorico['tipo'], string> = {
  doc_aprovado:  'bg-emerald-500',
  doc_rejeitado: 'bg-red-500',
  entrevista:    'bg-violet-500',
  nota:          'bg-gray-400',
  status:        'bg-blue-400',
};

// ── Mock data ──────────────────────────────────────────────

const NOMES_BY_ID: Record<string, string> = {
  'AP-001': 'João Manuel Pereira',
  'AP-002': 'Maria Fernanda Costa',
  'AP-003': 'António dos Santos Neto',
  'AP-004': 'Beatriz Lopes Domingos',
  'AP-005': 'Carlos Alberto Gomes',
  'AP-006': 'Sofia Isabel Monteiro',
  'AP-007': 'Rui Filipe Alves',
  'AP-008': 'Ana Paula Rodrigues',
  'AP-009': 'Pedro Miguel Ferreira',
  'AP-010': 'Teresa Maria Caetano',
};

function buildMockDetalhe(id: string): PrestadorDetalhe {
  const nome = NOMES_BY_ID[id] ?? 'Prestador Desconhecido';
  const slug = nome.toLowerCase().replace(/\s+/g, '.').replace(/[^\w.]/g, '');
  return {
    id,
    nome,
    bi: '005432876LA041',
    dataNascimento: '1990-03-15',
    contacto: '+244 923 456 789',
    email: `${slug}@gmail.com`,
    bio: 'Profissional experiente na área de construção civil e acabamentos, com vasta experiência em mercados urbanos e periurbanos de Luanda. Especializado em revestimentos cerâmicos, pintura e instalações sanitárias básicas.',
    anosExperiencia: 8,
    morada: 'Rua dos Coqueiros, Nº 45, Bairro Rangel, Luanda, Angola',
    statusVerificacao: 'em_analise',
    entrevistaConcluida: false,
    documentos: [
      { id: 'doc-1', nome: 'Bilhete de Identidade',              tipo: 'imagem', status: 'pendente' },
      { id: 'doc-2', nome: 'Comprovativo de Residência',         tipo: 'imagem', status: 'pendente' },
      { id: 'doc-3', nome: 'Certificado de Qualificações',       tipo: 'pdf',    status: 'aprovado' },
      { id: 'doc-4', nome: 'Comprovativo de Seguro Profissional',tipo: 'pdf',    status: 'pendente' },
    ],
    notasInternas: '',
    historico: [
      { id: 'h2', tipo: 'status',      descricao: 'Candidatura aberta para análise',    operador: 'Operador Kwame',  data: '2026-06-16T10:30:00Z' },
      { id: 'h1', tipo: 'status',      descricao: 'Candidatura submetida pelo prestador', operador: 'Sistema',       data: '2026-06-10T09:00:00Z' },
    ],
  };
}

// ── Module-level cache (persists status changes within session) ───

const _cache: Record<string, PrestadorDetalhe> = {};

function getDetalhe(id: string): PrestadorDetalhe {
  if (!_cache[id]) _cache[id] = buildMockDetalhe(id);
  return _cache[id];
}

function patchCache(id: string, updater: (prev: PrestadorDetalhe) => PrestadorDetalhe): void {
  if (_cache[id]) _cache[id] = updater(_cache[id]);
}

// ── Helpers ────────────────────────────────────────────────

function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('pt-PT', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return iso; }
}

function formatDateLong(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('pt-PT', {
      day: '2-digit', month: 'long', year: 'numeric',
    });
  } catch { return iso; }
}

function makeHistoricoId(): string {
  return `h-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

// ── Primitive display components ───────────────────────────

function InfoField({
  label, value, mono, className,
}: {
  label: string; value: string; mono?: boolean; className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-xs font-semibold text-gray-800 ${mono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  );
}

function CandidaturaStatusBadge({ status }: { status: StatusCandidatura }) {
  const cfg = CANDIDATURA_STATUS_CFG[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${cfg.classes}`}>
      {cfg.label}
    </span>
  );
}

function DocStatusBadge({ status }: { status: StatusDocumento }) {
  const cfg = DOC_STATUS_CFG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${cfg.classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ── Loading skeleton ────────────────────────────────────────

function PageLoadingSkeleton() {
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-8 px-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-gray-100 rounded w-44" />
        <div className="h-6 bg-gray-100 rounded-full w-24" />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* Dados skeleton */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 space-y-5">
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="flex gap-4">
              <div className="w-14 h-14 bg-gray-200 rounded-xl shrink-0" />
              <div className="space-y-2 flex-1 pt-1">
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="h-2.5 bg-gray-100 rounded w-1/2" />
                  <div className="h-3.5 bg-gray-200 rounded w-3/4" />
                </div>
              ))}
            </div>
            <div className="h-20 bg-gray-50 rounded-xl" />
          </div>
          {/* Documentos skeleton */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
            </div>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-gray-100 last:border-0">
                <div className="w-9 h-9 bg-gray-100 rounded-lg" />
                <div className="flex-1 h-3 bg-gray-100 rounded" />
                <div className="w-20 h-5 bg-gray-100 rounded-full" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-14 bg-gray-100 rounded-xl" />
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
            <div className="h-28 bg-gray-100 rounded-xl" />
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-200 mt-1 shrink-0" />
                <div className="space-y-1 flex-1">
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                  <div className="h-2.5 bg-gray-50 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Document viewer ─────────────────────────────────────────

function DocumentViewer({ doc, onClose }: { doc: Documento; onClose: () => void }) {
  const isPdf = doc.tipo === 'pdf';
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden animate-in fade-in duration-200">
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isPdf ? 'bg-red-50 border border-red-100' : 'bg-blue-50 border border-blue-100'}`}>
            {isPdf
              ? <FileText size={14} className="text-red-500" />
              : <FileImage size={14} className="text-blue-500" />}
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-800">{doc.nome}</p>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{doc.tipo}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="#preview"
            onClick={e => e.preventDefault()}
            className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <ExternalLink size={11} />
            Abrir
          </a>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-4 py-14">
          <div className={`w-14 h-14 rounded-xl border flex items-center justify-center ${isPdf ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'}`}>
            {isPdf
              ? <FileText size={26} className="text-red-400" />
              : <FileImage size={26} className="text-blue-400" />}
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-semibold text-gray-700">{doc.nome}</p>
            <p className="text-xs text-gray-400 max-w-xs">
              O preview seguro estará disponível em produção através de URL assinada com expiração.
            </p>
          </div>
          <a
            href="#preview"
            onClick={e => e.preventDefault()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:border-gray-400 transition-colors cursor-pointer shadow-sm"
          >
            <ExternalLink size={11} />
            {isPdf ? 'Descarregar PDF' : 'Ver imagem completa'}
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Rejection modal ─────────────────────────────────────────

function RejeicaoModal({
  titulo,
  onClose,
  onConfirm,
}: {
  titulo: string;
  onClose: () => void;
  onConfirm: (motivo: string) => void;
}) {
  const [motivo, setMotivo] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { textareaRef.current?.focus(); }, []);

  const isValid = motivo.trim().length > 0;

  const handleConfirm = () => {
    if (isValid) onConfirm(motivo.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
              <XCircle size={18} className="text-red-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">{titulo}</h3>
              <p className="text-xs text-gray-500 mt-0.5">Indique um motivo claro e detalhado.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer shrink-0"
          >
            <X size={14} />
          </button>
        </div>

        {/* Textarea */}
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            Motivo <span className="text-red-500">*</span>
          </label>
          <textarea
            ref={textareaRef}
            value={motivo}
            onChange={e => setMotivo(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) handleConfirm(); }}
            placeholder="Descreva o motivo da rejeição com clareza..."
            rows={4}
            className="w-full px-3 py-2.5 text-xs text-gray-800 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-red-300 focus:bg-white resize-none transition-all placeholder:text-gray-400"
          />
          <p className="text-[10px] text-gray-400 mt-1">Ctrl+Enter para confirmar rapidamente</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:border-gray-400 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isValid}
            className="px-4 py-2 text-xs font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Confirmar Rejeição
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ───────────────────────────────────────────────

export default function DetalheKYCPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [detalhe, setDetalhe] = useState<PrestadorDetalhe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [rejeicaoModal, setRejeicaoModal] = useState<{
    tipo: 'documento' | 'perfil';
    docId?: string;
  } | null>(null);
  const [agendarModal, setAgendarModal] = useState(false);
  const [notas, setNotas] = useState('');
  const [isSavingNotas, setIsSavingNotas] = useState(false);
  const [notasSavedAt, setNotasSavedAt] = useState<Date | null>(null);
  const [entrevistaConcluida, setEntrevistaConcluida] = useState(false);

  const loadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveNotasTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Load ──────────────────────────────────────────────────

  const loadData = useCallback(() => {
    setIsLoading(true);
    setError(null);
    if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
    loadTimerRef.current = setTimeout(() => {
      try {
        const data = getDetalhe(id);
        setDetalhe({ ...data, documentos: data.documentos.map(d => ({ ...d })), historico: [...data.historico] });
        setNotas(data.notasInternas);
        setEntrevistaConcluida(data.entrevistaConcluida);
        setIsLoading(false);
      } catch {
        setError('Erro ao carregar os dados desta candidatura.');
        setIsLoading(false);
      }
    }, 600);
  }, [id]);

  useEffect(() => {
    loadData();
    return () => {
      if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
      if (saveNotasTimerRef.current) clearTimeout(saveNotasTimerRef.current);
    };
  }, [loadData]);

  // ── Document actions ──────────────────────────────────────

  const aprovarDocumento = (docId: string) => {
    const docNome = detalhe?.documentos.find(d => d.id === docId)?.nome ?? docId;
    const acao: AcaoHistorico = {
      id: makeHistoricoId(),
      tipo: 'doc_aprovado',
      descricao: `Documento aprovado: "${docNome}"`,
      operador: 'Operador Atual',
      data: new Date().toISOString(),
    };
    setDetalhe(prev => {
      if (!prev) return prev;
      const next = {
        ...prev,
        documentos: prev.documentos.map(d => d.id === docId ? { ...d, status: 'aprovado' as const, motivoRejeicao: undefined } : d),
        historico: [acao, ...prev.historico],
      };
      patchCache(id, () => next);
      return next;
    });
  };

  const confirmarRejeicaoDoc = (docId: string, motivo: string) => {
    const docNome = detalhe?.documentos.find(d => d.id === docId)?.nome ?? docId;
    const acao: AcaoHistorico = {
      id: makeHistoricoId(),
      tipo: 'doc_rejeitado',
      descricao: `Documento rejeitado: "${docNome}"`,
      detalhe: motivo,
      operador: 'Operador Atual',
      data: new Date().toISOString(),
    };
    setDetalhe(prev => {
      if (!prev) return prev;
      const next = {
        ...prev,
        documentos: prev.documentos.map(d =>
          d.id === docId ? { ...d, status: 'rejeitado' as const, motivoRejeicao: motivo } : d,
        ),
        historico: [acao, ...prev.historico],
      };
      patchCache(id, () => next);
      return next;
    });
    setRejeicaoModal(null);
  };

  // ── Profile actions ───────────────────────────────────────

  const aprovarPerfil = () => {
    const acao: AcaoHistorico = {
      id: makeHistoricoId(),
      tipo: 'status',
      descricao: 'Perfil aprovado — candidatura concluída com sucesso',
      operador: 'Operador Atual',
      data: new Date().toISOString(),
    };
    setDetalhe(prev => {
      if (!prev) return prev;
      const next = { ...prev, statusVerificacao: 'aprovado' as const, historico: [acao, ...prev.historico] };
      patchCache(id, () => next);
      return next;
    });
  };

  const confirmarRejeicaoPerfil = (motivo: string) => {
    const acao: AcaoHistorico = {
      id: makeHistoricoId(),
      tipo: 'status',
      descricao: 'Perfil rejeitado',
      detalhe: motivo,
      operador: 'Operador Atual',
      data: new Date().toISOString(),
    };
    setDetalhe(prev => {
      if (!prev) return prev;
      const next = { ...prev, statusVerificacao: 'rejeitado' as const, historico: [acao, ...prev.historico] };
      patchCache(id, () => next);
      return next;
    });
    setRejeicaoModal(null);
  };

  const handleEntrevistaAgendada = () => {
    const acao: AcaoHistorico = {
      id: makeHistoricoId(),
      tipo: 'entrevista',
      descricao: 'Entrevista agendada',
      operador: 'Operador Atual',
      data: new Date().toISOString(),
    };
    setDetalhe(prev => {
      if (!prev) return prev;
      const next = { ...prev, statusVerificacao: 'entrevista_agendada' as const, historico: [acao, ...prev.historico] };
      patchCache(id, () => next);
      return next;
    });
  };

  // ── Notes auto-save ───────────────────────────────────────

  const handleNotasBlur = () => {
    const current = detalhe?.notasInternas ?? '';
    if (notas === current) return;
    setIsSavingNotas(true);
    if (saveNotasTimerRef.current) clearTimeout(saveNotasTimerRef.current);
    saveNotasTimerRef.current = setTimeout(() => {
      const acao: AcaoHistorico = {
        id: makeHistoricoId(),
        tipo: 'nota',
        descricao: 'Nota interna actualizada',
        operador: 'Operador Atual',
        data: new Date().toISOString(),
      };
      setDetalhe(prev => {
        if (!prev) return prev;
        const next = { ...prev, notasInternas: notas, historico: [acao, ...prev.historico] };
        patchCache(id, () => next);
        return next;
      });
      setIsSavingNotas(false);
      setNotasSavedAt(new Date());
    }, 600);
  };

  // ── Derived state ─────────────────────────────────────────

  const activeDoc = detalhe?.documentos.find(d => d.id === activeDocId) ?? null;
  const docsPendentes = detalhe?.documentos.filter(d => d.status === 'pendente').length ?? 0;
  const todosAprovados = detalhe?.documentos.every(d => d.status === 'aprovado') ?? false;
  const isFinalizado = detalhe?.statusVerificacao === 'aprovado' || detalhe?.statusVerificacao === 'rejeitado';
  const canAprovar = todosAprovados && entrevistaConcluida && !isFinalizado;

  // ── Render: loading ───────────────────────────────────────

  if (isLoading) return <PageLoadingSkeleton />;

  // ── Render: error ─────────────────────────────────────────

  if (error || !detalhe) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 pb-8 space-y-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
        >
          <ChevronLeft size={14} />
          Voltar às candidaturas
        </button>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-16 flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
            <AlertTriangle size={22} className="text-red-500" />
          </div>
          <div className="max-w-sm">
            <h3 className="text-sm font-semibold text-gray-900">Candidatura não encontrada</h3>
            <p className="text-xs text-gray-500 mt-1">{error ?? 'Não foi possível carregar esta candidatura.'}</p>
          </div>
          <button
            onClick={loadData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:border-gray-400 transition-colors shadow-sm cursor-pointer"
          >
            <RotateCw size={12} />
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  // ── Render: success ───────────────────────────────────────

  return (
    <>
      <div className="space-y-6 max-w-[1400px] mx-auto pb-8 px-4">

        {/* Top bar */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors cursor-pointer group"
          >
            <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Voltar às candidaturas
          </button>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 font-medium font-mono">{id}</span>
            <CandidaturaStatusBadge status={detalhe.statusVerificacao} />
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* ─── Left column ────────────────────────────────── */}
          <div className="xl:col-span-2 space-y-6">

            {/* 1. Dados do Prestador */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">Dados do Prestador</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Informação pessoal submetida na candidatura</p>
                </div>
                <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <User size={16} className="text-emerald-600" />
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* Avatar + name */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-[#06241C] flex items-center justify-center text-white text-lg font-bold shrink-0 shadow-sm">
                    {detalhe.nome.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{detalhe.nome}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{detalhe.email}</p>
                  </div>
                </div>

                {/* Personal info grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 pt-1">
                  <InfoField label="Nº de BI" value={detalhe.bi} mono />
                  <InfoField label="Data de Nascimento" value={formatDateLong(detalhe.dataNascimento)} />
                  <InfoField label="Contacto" value={detalhe.contacto} />
                  <InfoField label="Anos de Experiência" value={`${detalhe.anosExperiencia} anos`} />
                  <InfoField label="Morada" value={detalhe.morada} className="sm:col-span-2" />
                </div>

                {/* Bio */}
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Apresentação</p>
                  <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-100">
                    {detalhe.bio}
                  </p>
                </div>
              </div>
            </section>

            {/* 2. Documentos */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">Documentos Submetidos</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {detalhe.documentos.filter(d => d.status === 'aprovado').length}/{detalhe.documentos.length} aprovados
                  </p>
                </div>
                <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <FileCheck size={16} className="text-emerald-600" />
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {detalhe.documentos.map(doc => {
                  const isActive = activeDocId === doc.id;
                  const isPdf = doc.tipo === 'pdf';
                  return (
                    <div
                      key={doc.id}
                      className={`px-5 py-4 flex items-center gap-4 transition-colors ${isActive ? 'bg-emerald-50/40' : 'hover:bg-gray-50/60'}`}
                    >
                      {/* Type icon */}
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isPdf ? 'bg-red-50 border border-red-100' : 'bg-blue-50 border border-blue-100'}`}>
                        {isPdf
                          ? <FileText size={14} className="text-red-500" />
                          : <FileImage size={14} className="text-blue-500" />}
                      </div>

                      {/* Name + rejection reason */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">{doc.nome}</p>
                        {doc.motivoRejeicao && (
                          <p className="text-[10px] text-red-500 font-medium mt-0.5 truncate" title={doc.motivoRejeicao}>
                            Motivo: {doc.motivoRejeicao}
                          </p>
                        )}
                      </div>

                      {/* Status + action buttons */}
                      <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                        <DocStatusBadge status={doc.status} />
                        {!isFinalizado && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setActiveDocId(isActive ? null : doc.id)}
                              title="Visualizar documento"
                              className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
                                isActive
                                  ? 'bg-emerald-600 border-emerald-600 text-white'
                                  : 'border-gray-200 text-gray-500 hover:border-emerald-400 hover:text-emerald-600'
                              }`}
                            >
                              <Eye size={12} />
                            </button>
                            {doc.status !== 'aprovado' && (
                              <button
                                onClick={() => aprovarDocumento(doc.id)}
                                title="Aprovar documento"
                                className="w-7 h-7 rounded-lg border border-gray-200 text-gray-500 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-600 flex items-center justify-center transition-colors cursor-pointer"
                              >
                                <Check size={12} />
                              </button>
                            )}
                            {doc.status !== 'rejeitado' && (
                              <button
                                onClick={() => setRejeicaoModal({ tipo: 'documento', docId: doc.id })}
                                title="Rejeitar documento"
                                className="w-7 h-7 rounded-lg border border-gray-200 text-gray-500 hover:border-red-300 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors cursor-pointer"
                              >
                                <X size={12} />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 3. Document viewer (inline, conditional) */}
            {activeDoc && (
              <DocumentViewer doc={activeDoc} onClose={() => setActiveDocId(null)} />
            )}

            {/* 4. Entrevistas */}
            <EntrevistaSection
              candidaturaId={id}
              agendarModalOpen={agendarModal}
              onAgendarModalClose={() => setAgendarModal(false)}
              onProgressChange={setEntrevistaConcluida}
              onEntrevistaAgendada={handleEntrevistaAgendada}
            />
          </div>

          {/* ─── Right column ───────────────────────────────── */}
          <div className="space-y-6">

            {/* 4. Ações Principais */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-900">Ações Principais</h2>
                <Shield size={15} className="text-gray-400" />
              </div>
              <div className="p-5 space-y-3">

                {isFinalizado ? (
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 flex flex-col items-center gap-2 text-center">
                    {detalhe.statusVerificacao === 'aprovado'
                      ? <CheckCircle2 size={22} className="text-emerald-600" />
                      : <XCircle size={22} className="text-red-500" />}
                    <p className="text-xs font-bold text-gray-800">
                      {detalhe.statusVerificacao === 'aprovado' ? 'Candidatura Aprovada' : 'Candidatura Rejeitada'}
                    </p>
                    <p className="text-[10px] text-gray-400">Esta candidatura já foi finalizada.</p>
                  </div>
                ) : (
                  <>
                    {/* Agendar */}
                    <button
                      onClick={() => setAgendarModal(true)}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-violet-300 hover:bg-violet-50/30 transition-all group cursor-pointer text-left"
                    >
                      <div className="w-8 h-8 bg-violet-50 border border-violet-100 rounded-lg flex items-center justify-center group-hover:bg-violet-100 transition-colors shrink-0">
                        <Calendar size={14} className="text-violet-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">Agendar Entrevista</p>
                        <p className="text-[10px] text-gray-400 font-medium">Marcar data, hora e tipo</p>
                      </div>
                    </button>

                    {/* Entrevista concluída indicator (auto-driven by EntrevistaSection) */}
                    <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border transition-colors ${entrevistaConcluida ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-gray-100'}`}>
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${entrevistaConcluida ? 'bg-[#06241C] border-[#06241C]' : 'border-gray-300'}`}>
                        {entrevistaConcluida && <Check size={9} className="text-white" strokeWidth={3} />}
                      </div>
                      <p className={`text-xs font-medium ${entrevistaConcluida ? 'text-emerald-700' : 'text-gray-400'}`}>Entrevista concluída</p>
                    </div>

                    {/* Aprovar perfil */}
                    <button
                      onClick={aprovarPerfil}
                      disabled={!canAprovar}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-100 text-white disabled:text-gray-400 disabled:cursor-not-allowed rounded-xl transition-all cursor-pointer"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${canAprovar ? 'bg-emerald-500' : 'bg-gray-200'}`}>
                        {canAprovar
                          ? <CheckCircle2 size={14} className="text-white" />
                          : <Lock size={14} className="text-gray-400" />}
                      </div>
                      <div className="text-left">
                        <p className={`text-xs font-bold ${canAprovar ? 'text-white' : 'text-gray-500'}`}>Aprovar Perfil</p>
                        <p className={`text-[10px] font-medium ${canAprovar ? 'text-emerald-100' : 'text-gray-400'}`}>
                          {!todosAprovados
                            ? `${docsPendentes} doc. por analisar`
                            : !entrevistaConcluida
                              ? 'Entrevista pendente'
                              : 'Pronto para aprovação'}
                        </p>
                      </div>
                    </button>

                    {/* Rejeitar perfil */}
                    <button
                      onClick={() => setRejeicaoModal({ tipo: 'perfil' })}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 hover:border-red-200 hover:bg-red-50/30 rounded-xl transition-all group cursor-pointer"
                    >
                      <div className="w-8 h-8 bg-red-50 border border-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors shrink-0">
                        <XCircle size={14} className="text-red-500" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-gray-800">Rejeitar Perfil</p>
                        <p className="text-[10px] text-gray-400 font-medium">Rejeitar candidatura completa</p>
                      </div>
                    </button>

                    {/* Pending docs alert */}
                    {docsPendentes > 0 && (
                      <div className="flex items-start gap-2 px-3 py-2.5 bg-amber-50 border border-amber-100 rounded-xl">
                        <Info size={13} className="text-amber-600 mt-0.5 shrink-0" />
                        <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
                          {docsPendentes} documento{docsPendentes > 1 ? 's' : ''} ainda {docsPendentes > 1 ? 'estão' : 'está'} por analisar.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </section>

            {/* 5. Notas Internas */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">Notas Internas</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Apenas visível no backoffice</p>
                </div>
                <PenLine size={15} className="text-gray-400" />
              </div>
              <div className="p-5 space-y-2">
                <textarea
                  value={notas}
                  onChange={e => setNotas(e.target.value)}
                  onBlur={handleNotasBlur}
                  placeholder="Adicione observações internas sobre esta candidatura..."
                  rows={5}
                  className="w-full px-3 py-2.5 text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-400 focus:bg-white resize-none transition-all placeholder:text-gray-400"
                />
                <p className="text-[10px] text-gray-400 flex items-center gap-1">
                  {isSavingNotas ? (
                    <>
                      <Loader size={10} className="animate-spin text-amber-500" />
                      <span className="text-amber-600">A guardar...</span>
                    </>
                  ) : notasSavedAt ? (
                    <>
                      <Save size={10} className="text-emerald-500" />
                      <span className="text-emerald-600">
                        Guardado às {notasSavedAt.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </>
                  ) : (
                    'Auto-save ao sair do campo'
                  )}
                </p>
              </div>
            </section>

            {/* 6. Histórico */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">Histórico de Ações</h2>
                  <p className="text-xs text-gray-500 mt-0.5">{detalhe.historico.length} eventos</p>
                </div>
                <Clock size={15} className="text-gray-400" />
              </div>

              <div className="p-5">
                {detalhe.historico.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-6">Sem histórico de ações.</p>
                ) : (
                  <div>
                    {detalhe.historico.map((item, idx) => (
                      <div key={item.id} className="flex gap-3">
                        {/* Timeline dot + line */}
                        <div className="flex flex-col items-center pt-1">
                          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${HISTORICO_DOT[item.tipo]}`} />
                          {idx < detalhe.historico.length - 1 && (
                            <span className="w-px flex-1 bg-gray-100 my-1" style={{ minHeight: 16 }} />
                          )}
                        </div>
                        {/* Content */}
                        <div className="pb-4 flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-800 leading-snug">{item.descricao}</p>
                          {item.detalhe && (
                            <p className="text-[10px] text-gray-500 mt-0.5 italic leading-relaxed">{item.detalhe}</p>
                          )}
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-[10px] text-gray-400">{item.operador}</span>
                            <span className="text-[10px] text-gray-300">·</span>
                            <span className="text-[10px] text-gray-400">{formatDateTime(item.data)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

          </div>
        </div>
      </div>

      {/* ── Modals ─────────────────────────────────────────── */}

      {rejeicaoModal?.tipo === 'documento' && rejeicaoModal.docId && (
        <RejeicaoModal
          titulo="Rejeitar Documento"
          onClose={() => setRejeicaoModal(null)}
          onConfirm={motivo => confirmarRejeicaoDoc(rejeicaoModal.docId!, motivo)}
        />
      )}

      {rejeicaoModal?.tipo === 'perfil' && (
        <RejeicaoModal
          titulo="Rejeitar Perfil do Prestador"
          onClose={() => setRejeicaoModal(null)}
          onConfirm={confirmarRejeicaoPerfil}
        />
      )}

    </>
  );
}
