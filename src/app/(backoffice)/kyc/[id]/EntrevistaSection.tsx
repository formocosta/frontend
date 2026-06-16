'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Video, MapPin, CheckCircle2, Circle, AlertTriangle, Inbox,
  RotateCw, Loader, Check, X, Calendar, Clock, Link2,
  ClipboardList, CalendarCheck, ChevronDown,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────

export type TipoEntrevista = 'video_chamada' | 'presencial';
export type EstadoEntrevista = 'agendada' | 'realizada' | 'cancelada';
export type ResultadoEntrevista = 'aprovado' | 'reprovado' | 'inconclusivo';

export interface Entrevista {
  id: string;
  candidaturaId: string;
  tipo: TipoEntrevista;
  dataHora: string;
  estado: EstadoEntrevista;
  resultado?: ResultadoEntrevista;
  notasResultado?: string;
  linkVideo?: string;
  operador: string;
  criadaEm: string;
}

// ── Module-level store ─────────────────────────────────────

const _store: Record<string, Entrevista[]> = {};

function storeGet(cid: string): Entrevista[] {
  return _store[cid] ? [..._store[cid]] : [];
}

function storeAdd(e: Entrevista): void {
  if (!_store[e.candidaturaId]) _store[e.candidaturaId] = [];
  _store[e.candidaturaId] = [e, ..._store[e.candidaturaId]];
}

function storePatch(cid: string, eid: string, updates: Partial<Entrevista>): void {
  const list = _store[cid];
  if (!list) return;
  const idx = list.findIndex(e => e.id === eid);
  if (idx !== -1) list[idx] = { ...list[idx], ...updates };
}

// ── Config ─────────────────────────────────────────────────

type IconType = React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;

const TIPO_CFG: Record<TipoEntrevista, { label: string; icon: IconType; badge: string; dot: string }> = {
  video_chamada: {
    label: 'Vídeo Chamada',
    icon: Video,
    badge: 'bg-blue-50 text-blue-700 border border-blue-100',
    dot: 'bg-blue-500',
  },
  presencial: {
    label: 'Presencial',
    icon: MapPin,
    badge: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    dot: 'bg-emerald-500',
  },
};

const ESTADO_CFG: Record<EstadoEntrevista, { label: string; classes: string }> = {
  agendada:  { label: 'Agendada',  classes: 'bg-amber-50 text-amber-700 border border-amber-100' },
  realizada: { label: 'Realizada', classes: 'bg-emerald-50 text-emerald-700 border border-emerald-100' },
  cancelada: { label: 'Cancelada', classes: 'bg-gray-50 text-gray-500 border border-gray-200' },
};

const RESULTADO_CFG: Record<ResultadoEntrevista, { label: string; classes: string }> = {
  aprovado:     { label: 'Aprovado',     classes: 'bg-emerald-50 text-emerald-700 border border-emerald-100' },
  reprovado:    { label: 'Reprovado',    classes: 'bg-red-50 text-red-600 border border-red-100' },
  inconclusivo: { label: 'Inconclusivo', classes: 'bg-gray-50 text-gray-600 border border-gray-200' },
};

// ── Helpers ────────────────────────────────────────────────

function makeId(): string {
  return `EV-${Date.now()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
}

function formatDataHora(value: string): string {
  if (!value) return '—';
  try {
    const d = new Date(value);
    return (
      d.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ' às ' +
      d.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
    );
  } catch {
    return value;
  }
}

function getNowLocal(): string {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 16);
}

function isDatetimeFuture(value: string): boolean {
  if (!value) return false;
  return new Date(value) > new Date();
}

// ── Form validation ────────────────────────────────────────

interface AgendarForm {
  tipo: TipoEntrevista | '';
  dataHora: string;
  linkVideo: string;
}

interface AgendarErrors {
  tipo?: string;
  dataHora?: string;
  linkVideo?: string;
}

function validateAgendar(form: AgendarForm): AgendarErrors {
  const e: AgendarErrors = {};
  if (!form.tipo) {
    e.tipo = 'Seleccione o tipo de entrevista.';
  }
  if (!form.dataHora) {
    e.dataHora = 'Seleccione uma data e hora.';
  } else if (!isDatetimeFuture(form.dataHora)) {
    e.dataHora = 'A data e hora devem ser no futuro.';
  }
  if (form.tipo === 'video_chamada' && !form.linkVideo.trim()) {
    e.linkVideo = 'O link de vídeo é obrigatório para entrevistas por vídeo.';
  }
  return e;
}

interface ResultadoForm {
  resultado: ResultadoEntrevista | '';
  notas: string;
}

interface ResultadoErrors {
  resultado?: string;
  notas?: string;
}

function validateResultado(form: ResultadoForm): ResultadoErrors {
  const e: ResultadoErrors = {};
  if (!form.resultado) e.resultado = 'Seleccione um resultado.';
  if (!form.notas.trim()) e.notas = 'As notas são obrigatórias.';
  return e;
}

// ── Small badges ────────────────────────────────────────────

function TipoBadge({ tipo }: { tipo: TipoEntrevista }) {
  const cfg = TIPO_CFG[tipo];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${cfg.badge}`}>
      <Icon size={10} />
      {cfg.label}
    </span>
  );
}

function EstadoBadge({ estado }: { estado: EstadoEntrevista }) {
  const cfg = ESTADO_CFG[estado];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${cfg.classes}`}>
      {cfg.label}
    </span>
  );
}

function ResultadoBadge({ resultado }: { resultado?: ResultadoEntrevista }) {
  if (!resultado) return <span className="text-[10px] text-gray-400">—</span>;
  const cfg = RESULTADO_CFG[resultado];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${cfg.classes}`}>
      {cfg.label}
    </span>
  );
}

// ── Field wrapper ───────────────────────────────────────────

function FormField({
  label, required, error, children,
}: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-[11px] text-red-500 font-medium">{error}</p>}
    </div>
  );
}

// ── Agendar modal ───────────────────────────────────────────

function AgendarModal({
  candidaturaId,
  onClose,
  onSuccess,
}: {
  candidaturaId: string;
  onClose: () => void;
  onSuccess: (nova: Entrevista) => void;
}) {
  const [form, setForm] = useState<AgendarForm>({ tipo: '', dataHora: '', linkVideo: '' });
  const [errors, setErrors] = useState<AgendarErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const set = <K extends keyof AgendarForm>(key: K, value: AgendarForm[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    const errs = validateAgendar(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const nova: Entrevista = {
        id: makeId(),
        candidaturaId,
        tipo: form.tipo as TipoEntrevista,
        dataHora: form.dataHora,
        estado: 'agendada',
        linkVideo: form.tipo === 'video_chamada' ? form.linkVideo.trim() : undefined,
        operador: 'Operador Atual',
        criadaEm: new Date().toISOString(),
      };
      storeAdd(nova);
      onSuccess(nova);
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5 animate-in fade-in duration-200">

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-violet-50 rounded-lg flex items-center justify-center shrink-0">
              <Calendar size={18} className="text-violet-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Agendar Entrevista</h3>
              <p className="text-xs text-gray-500 mt-0.5">Preencha os dados abaixo para agendar.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer shrink-0"
          >
            <X size={14} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">

          {/* Tipo */}
          <FormField label="Tipo de Entrevista" required error={errors.tipo}>
            <div className="relative">
              <select
                value={form.tipo}
                onChange={e => {
                  set('tipo', e.target.value as TipoEntrevista | '');
                  set('linkVideo', '');
                  setErrors(prev => ({ ...prev, tipo: undefined, linkVideo: undefined }));
                }}
                className="w-full appearance-none px-3 py-2.5 pr-8 text-xs text-gray-800 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-400 focus:bg-white transition-all cursor-pointer [color-scheme:light]"
              >
                <option value="">Seleccione o tipo...</option>
                <option value="video_chamada">Vídeo Chamada</option>
                <option value="presencial">Presencial</option>
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </FormField>

          {/* Data e Hora */}
          <FormField label="Data e Hora" required error={errors.dataHora}>
            <div className={`flex items-center gap-2 bg-gray-50 border rounded-xl px-3 py-2.5 transition-all focus-within:border-emerald-400 focus-within:bg-white ${errors.dataHora ? 'border-red-300' : 'border-gray-200'}`}>
              <Clock size={13} className="text-gray-400 shrink-0" />
              <input
                type="datetime-local"
                value={form.dataHora}
                min={getNowLocal()}
                onChange={e => {
                  set('dataHora', e.target.value);
                  setErrors(prev => ({ ...prev, dataHora: undefined }));
                }}
                className="flex-1 bg-transparent text-xs text-gray-800 outline-none [color-scheme:light]"
              />
            </div>
          </FormField>

          {/* Link vídeo (condicional) */}
          {form.tipo === 'video_chamada' && (
            <FormField label="Link de Vídeo" required error={errors.linkVideo}>
              <div className={`flex items-center gap-2 bg-gray-50 border rounded-xl px-3 py-2.5 transition-all focus-within:border-emerald-400 focus-within:bg-white ${errors.linkVideo ? 'border-red-300' : 'border-gray-200'}`}>
                <Link2 size={13} className="text-gray-400 shrink-0" />
                <input
                  type="url"
                  value={form.linkVideo}
                  onChange={e => {
                    set('linkVideo', e.target.value);
                    setErrors(prev => ({ ...prev, linkVideo: undefined }));
                  }}
                  placeholder="https://meet.google.com/..."
                  className="flex-1 bg-transparent text-xs text-gray-800 outline-none placeholder:text-gray-400"
                />
              </div>
            </FormField>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:border-gray-400 disabled:opacity-50 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl transition-colors cursor-pointer"
          >
            {isSubmitting && <Loader size={11} className="animate-spin" />}
            {isSubmitting ? 'A agendar...' : 'Agendar Entrevista'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Resultado modal ─────────────────────────────────────────

function ResultadoModal({
  entrevista,
  onClose,
  onSuccess,
}: {
  entrevista: Entrevista;
  onClose: () => void;
  onSuccess: (resultado: ResultadoEntrevista, notas: string) => void;
}) {
  const [form, setForm] = useState<ResultadoForm>({ resultado: '', notas: '' });
  const [errors, setErrors] = useState<ResultadoErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { textareaRef.current?.focus(); }, []);

  const handleSubmit = () => {
    const errs = validateResultado(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onSuccess(form.resultado as ResultadoEntrevista, form.notas.trim());
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5 animate-in fade-in duration-200">

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
              <ClipboardList size={18} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Registar Resultado</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                <TipoBadge tipo={entrevista.tipo} />
                {' · '}
                {formatDataHora(entrevista.dataHora)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer shrink-0"
          >
            <X size={14} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">

          {/* Resultado */}
          <FormField label="Resultado" required error={errors.resultado}>
            <div className="relative">
              <select
                value={form.resultado}
                onChange={e => {
                  setForm(prev => ({ ...prev, resultado: e.target.value as ResultadoEntrevista | '' }));
                  setErrors(prev => ({ ...prev, resultado: undefined }));
                }}
                className="w-full appearance-none px-3 py-2.5 pr-8 text-xs text-gray-800 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-400 focus:bg-white transition-all cursor-pointer [color-scheme:light]"
              >
                <option value="">Seleccione o resultado...</option>
                <option value="aprovado">Aprovado</option>
                <option value="reprovado">Reprovado</option>
                <option value="inconclusivo">Inconclusivo</option>
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </FormField>

          {/* Notas */}
          <FormField label="Notas do Entrevistador" required error={errors.notas}>
            <textarea
              ref={textareaRef}
              value={form.notas}
              onChange={e => {
                setForm(prev => ({ ...prev, notas: e.target.value }));
                setErrors(prev => ({ ...prev, notas: undefined }));
              }}
              placeholder={'Avaliação técnica, comunicação, pontos fortes, pontos a melhorar...'}
              rows={5}
              className="w-full px-3 py-2.5 text-xs text-gray-800 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-400 focus:bg-white resize-none transition-all placeholder:text-gray-400"
            />
          </FormField>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:border-gray-400 disabled:opacity-50 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#06241C] hover:bg-[#0B392E] disabled:opacity-60 disabled:cursor-not-allowed rounded-xl transition-colors cursor-pointer shadow-sm active:scale-[0.98]"
          >
            {isSubmitting && <Loader size={11} className="animate-spin" />}
            {isSubmitting ? 'A guardar...' : 'Guardar Resultado'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Progress indicator ──────────────────────────────────────

function ProgressItem({
  label, done, icon: Icon,
}: {
  label: string; done: boolean; icon: IconType;
}) {
  return (
    <div className={`flex items-center gap-3 rounded-xl border p-3.5 transition-all ${done ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-gray-100'}`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${done ? 'bg-emerald-100' : 'bg-gray-100'}`}>
        {done
          ? <CheckCircle2 size={15} className="text-emerald-600" />
          : <Circle size={15} className="text-gray-400" />}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider truncate"><Icon size={9} className="inline mr-1" />{label}</p>
        <p className={`text-xs font-semibold mt-0.5 ${done ? 'text-emerald-700' : 'text-gray-400'}`}>
          {done ? 'Concluída' : 'Pendente'}
        </p>
      </div>
    </div>
  );
}

function ProgressoIndicador({ entrevistas }: { entrevistas: Entrevista[] }) {
  const videoOk = entrevistas.some(e => e.tipo === 'video_chamada' && e.estado === 'realizada');
  const presOk = entrevistas.some(e => e.tipo === 'presencial' && e.estado === 'realizada');

  return (
    <div className="grid grid-cols-2 gap-3">
      <ProgressItem label="Vídeo Chamada" done={videoOk} icon={Video} />
      <ProgressItem label="Presencial" done={presOk} icon={MapPin} />
    </div>
  );
}

// ── Skeleton ────────────────────────────────────────────────

function EntrevistasSkeleton() {
  return (
    <div className="animate-pulse space-y-3 p-5">
      <div className="grid grid-cols-2 gap-3">
        <div className="h-16 bg-gray-100 rounded-xl" />
        <div className="h-16 bg-gray-100 rounded-xl" />
      </div>
      <div className="h-px bg-gray-100 my-1" />
      {[1, 2].map(i => (
        <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-2">
          <div className="flex gap-3">
            <div className="w-20 h-5 bg-gray-100 rounded-full" />
            <div className="w-16 h-5 bg-gray-100 rounded-full" />
          </div>
          <div className="h-3 bg-gray-50 rounded w-2/3" />
        </div>
      ))}
    </div>
  );
}

// ── Interviews list ─────────────────────────────────────────

function EntrevistasList({
  entrevistas,
  onMarcarRealizada,
  onCancelar,
  onRegistarResultado,
}: {
  entrevistas: Entrevista[];
  onMarcarRealizada: (id: string) => void;
  onCancelar: (id: string) => void;
  onRegistarResultado: (entrevista: Entrevista) => void;
}) {
  if (entrevistas.length === 0) {
    return (
      <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
        <div className="w-11 h-11 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 border border-gray-100">
          <Inbox size={20} />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-800">Sem entrevistas registadas</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Não existem entrevistas para esta candidatura.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/30">
            <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Tipo</th>
            <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Data / Hora</th>
            <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Estado</th>
            <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Resultado</th>
            <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Operador</th>
            <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {entrevistas.map(ev => (
            <tr key={ev.id} className="hover:bg-gray-50/50 transition-colors">

              {/* Tipo */}
              <td className="px-4 py-3.5">
                <div className="space-y-1">
                  <TipoBadge tipo={ev.tipo} />
                  {ev.linkVideo && (
                    <a
                      href={ev.linkVideo}
                      target="_blank"
                      rel="noreferrer"
                      onClick={e => e.preventDefault()}
                      className="flex items-center gap-1 text-[10px] text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <Link2 size={9} />
                      Link de vídeo
                    </a>
                  )}
                </div>
              </td>

              {/* Data/Hora */}
              <td className="px-4 py-3.5 text-xs text-gray-600 font-medium whitespace-nowrap">
                {formatDataHora(ev.dataHora)}
              </td>

              {/* Estado */}
              <td className="px-4 py-3.5">
                <EstadoBadge estado={ev.estado} />
              </td>

              {/* Resultado */}
              <td className="px-4 py-3.5">
                {ev.resultado ? (
                  <div className="space-y-1">
                    <ResultadoBadge resultado={ev.resultado} />
                    {ev.notasResultado && (
                      <p className="text-[10px] text-gray-400 max-w-[140px] truncate" title={ev.notasResultado}>
                        {ev.notasResultado}
                      </p>
                    )}
                  </div>
                ) : (
                  <ResultadoBadge />
                )}
              </td>

              {/* Operador */}
              <td className="px-4 py-3.5 text-xs text-gray-600 font-medium whitespace-nowrap">
                {ev.operador}
              </td>

              {/* Ações */}
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {ev.estado === 'agendada' && (
                    <>
                      <button
                        onClick={() => onMarcarRealizada(ev.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <Check size={9} strokeWidth={3} />
                        Realizada
                      </button>
                      <button
                        onClick={() => onCancelar(ev.id)}
                        className="w-6 h-6 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:border-red-300 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
                        title="Cancelar entrevista"
                      >
                        <X size={10} />
                      </button>
                    </>
                  )}
                  {ev.estado === 'realizada' && !ev.resultado && (
                    <button
                      onClick={() => onRegistarResultado(ev)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#06241C] hover:bg-[#0B392E] text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-sm"
                    >
                      <ClipboardList size={9} />
                      Resultado
                    </button>
                  )}
                  {(ev.estado === 'cancelada' || (ev.estado === 'realizada' && ev.resultado)) && (
                    <span className="text-[10px] text-gray-400">—</span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Main exported component ─────────────────────────────────

export interface EntrevistaSectionProps {
  candidaturaId: string;
  agendarModalOpen: boolean;
  onAgendarModalClose: () => void;
  onProgressChange?: (anyCompleted: boolean) => void;
  onEntrevistaAgendada?: () => void;
}

export default function EntrevistaSection({
  candidaturaId,
  agendarModalOpen,
  onAgendarModalClose,
  onProgressChange,
  onEntrevistaAgendada,
}: EntrevistaSectionProps) {
  const [entrevistas, setEntrevistas] = useState<Entrevista[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resultadoModal, setResultadoModal] = useState<Entrevista | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const bannerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Load ──────────────────────────────────────────────────

  const loadData = useCallback(() => {
    setIsLoading(true);
    setError(null);
    if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
    loadTimerRef.current = setTimeout(() => {
      try {
        setEntrevistas(storeGet(candidaturaId));
        setIsLoading(false);
      } catch {
        setError('Erro ao carregar as entrevistas.');
        setIsLoading(false);
      }
    }, 400);
  }, [candidaturaId]);

  useEffect(() => {
    loadData();
    return () => {
      if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
      if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current);
    };
  }, [loadData]);

  // ── Notify parent of progress changes ─────────────────────

  useEffect(() => {
    const anyCompleted = entrevistas.some(e => e.estado === 'realizada');
    onProgressChange?.(anyCompleted);
  }, [entrevistas, onProgressChange]);

  // ── Success banner helper ──────────────────────────────────

  const showBanner = (msg: string) => {
    setSuccessBanner(msg);
    if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current);
    bannerTimerRef.current = setTimeout(() => setSuccessBanner(null), 3500);
  };

  // ── Handlers ──────────────────────────────────────────────

  const handleAgendarSuccess = (nova: Entrevista) => {
    setEntrevistas(prev => [nova, ...prev]);
    onAgendarModalClose();
    onEntrevistaAgendada?.();
    showBanner('Entrevista agendada com sucesso.');
  };

  const handleMarcarRealizada = (eid: string) => {
    storePatch(candidaturaId, eid, { estado: 'realizada' });
    setEntrevistas(prev =>
      prev.map(e => e.id === eid ? { ...e, estado: 'realizada' } : e),
    );
    showBanner('Entrevista marcada como realizada.');
  };

  const handleCancelar = (eid: string) => {
    storePatch(candidaturaId, eid, { estado: 'cancelada' });
    setEntrevistas(prev =>
      prev.map(e => e.id === eid ? { ...e, estado: 'cancelada' } : e),
    );
    showBanner('Entrevista cancelada.');
  };

  const handleResultadoSuccess = (resultado: ResultadoEntrevista, notas: string) => {
    if (!resultadoModal) return;
    const eid = resultadoModal.id;
    storePatch(candidaturaId, eid, { resultado, notasResultado: notas });
    setEntrevistas(prev =>
      prev.map(e => e.id === eid ? { ...e, resultado, notasResultado: notas } : e),
    );
    setResultadoModal(null);
    showBanner('Resultado registado com sucesso.');
  };

  // ── Render ────────────────────────────────────────────────

  return (
    <>
      {/* Section card */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">

        {/* Card header */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Entrevistas</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {isLoading ? 'A carregar...' : `${entrevistas.length} entrevista${entrevistas.length !== 1 ? 's' : ''} registada${entrevistas.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <div className="w-9 h-9 bg-violet-50 rounded-lg flex items-center justify-center">
            <CalendarCheck size={16} className="text-violet-600" />
          </div>
        </div>

        {/* Success banner */}
        {successBanner && (
          <div className="mx-5 mt-4 flex items-center gap-2 px-3 py-2.5 bg-emerald-50 border border-emerald-100 rounded-xl animate-in fade-in duration-200">
            <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
            <p className="text-[11px] font-semibold text-emerald-700">{successBanner}</p>
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <EntrevistasSkeleton />
        ) : error ? (
          <div className="py-12 flex flex-col items-center gap-3 text-center">
            <div className="w-11 h-11 bg-red-50 rounded-full flex items-center justify-center">
              <AlertTriangle size={20} className="text-red-500" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-800">Erro ao carregar entrevistas</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{error}</p>
            </div>
            <button
              onClick={loadData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:border-gray-400 transition-colors shadow-sm cursor-pointer"
            >
              <RotateCw size={11} />
              Tentar Novamente
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">

            {/* Progress indicators */}
            <div className="px-5 py-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Progresso</p>
              <ProgressoIndicador entrevistas={entrevistas} />
            </div>

            {/* Interviews table */}
            <EntrevistasList
              entrevistas={entrevistas}
              onMarcarRealizada={handleMarcarRealizada}
              onCancelar={handleCancelar}
              onRegistarResultado={setResultadoModal}
            />

          </div>
        )}
      </section>

      {/* Modals */}
      {agendarModalOpen && (
        <AgendarModal
          candidaturaId={candidaturaId}
          onClose={onAgendarModalClose}
          onSuccess={handleAgendarSuccess}
        />
      )}

      {resultadoModal && (
        <ResultadoModal
          entrevista={resultadoModal}
          onClose={() => setResultadoModal(null)}
          onSuccess={handleResultadoSuccess}
        />
      )}
    </>
  );
}
