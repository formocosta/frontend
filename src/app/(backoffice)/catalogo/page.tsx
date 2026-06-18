'use client';

import {
  useState, useRef, useCallback, useEffect, ChangeEvent, Suspense,
} from 'react';
import { createPortal } from 'react-dom';
import {
  GripVertical, ChevronDown, ChevronRight, Plus, Edit2,
  ToggleLeft, ToggleRight, Search, X, Check, Loader,
  AlertTriangle, Layers, Tag, Upload, Image as ImageIcon,
  ArrowUp, ArrowDown, FolderOpen, BookOpen, Eye,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// Portal — renders children at document.body, bypassing any
// CSS containing-block created by parent transforms / overflow
// ─────────────────────────────────────────────────────────────

function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type Status = 'ativa' | 'inativa';

interface Subcategoria {
  id: string;
  nome: string;
  descricao: string;
  status: Status;
  ordem: number;
}

interface Categoria {
  id: string;
  nome: string;
  descricao: string;
  icone: string;          // emoji or relative path placeholder
  iconPreview: string | null; // base64 data-url for uploaded image
  ordem: number;
  status: Status;
  subcategorias: Subcategoria[];
}

// ─────────────────────────────────────────────────────────────
// Mock data
// ─────────────────────────────────────────────────────────────

const MOCK: Categoria[] = [
  {
    id: 'CAT-001', nome: 'Limpeza', descricao: 'Serviços de higienização residencial, comercial e industrial.',
    icone: '🧹', iconPreview: null, ordem: 1, status: 'ativa',
    subcategorias: [
      { id: 'SUB-001', nome: 'Limpeza doméstica',     descricao: 'Casas e apartamentos',          status: 'ativa',  ordem: 1 },
      { id: 'SUB-002', nome: 'Limpeza pós-obra',       descricao: 'Remoção de detritos de obra',   status: 'ativa',  ordem: 2 },
      { id: 'SUB-003', nome: 'Limpeza de escritórios', descricao: 'Espaços comerciais e de trabalho', status: 'ativa', ordem: 3 },
      { id: 'SUB-004', nome: 'Limpeza de vidros',      descricao: 'Janelas e superfícies envidraçadas', status: 'inativa', ordem: 4 },
    ],
  },
  {
    id: 'CAT-002', nome: 'Canalização', descricao: 'Instalação, manutenção e reparação de sistemas hidráulicos.',
    icone: '🔧', iconPreview: null, ordem: 2, status: 'ativa',
    subcategorias: [
      { id: 'SUB-005', nome: 'Reparação de canos',   descricao: 'Conserto e substituição',       status: 'ativa',  ordem: 1 },
      { id: 'SUB-006', nome: 'Desentupimento',        descricao: 'Desobstrução de esgotos',       status: 'ativa',  ordem: 2 },
      { id: 'SUB-007', nome: 'Instalação sanitária',  descricao: 'Chuveiros, sanitas e pias',     status: 'ativa',  ordem: 3 },
    ],
  },
  {
    id: 'CAT-003', nome: 'Eletricidade', descricao: 'Instalações elétricas, revisões e projetos de energia solar.',
    icone: '⚡', iconPreview: null, ordem: 3, status: 'ativa',
    subcategorias: [
      { id: 'SUB-008', nome: 'Instalação de tomadas',  descricao: 'Pontos elétricos e interruptores', status: 'ativa', ordem: 1 },
      { id: 'SUB-009', nome: 'Revisão elétrica',       descricao: 'Diagnóstico completo da rede',     status: 'ativa', ordem: 2 },
      { id: 'SUB-010', nome: 'Energia solar',          descricao: 'Painéis fotovoltaicos',            status: 'ativa', ordem: 3 },
      { id: 'SUB-011', nome: 'Quadros elétricos',      descricao: 'Substituição e manutenção',        status: 'inativa', ordem: 4 },
    ],
  },
  {
    id: 'CAT-004', nome: 'Jardinagem', descricao: 'Criação e manutenção de jardins, poda e sistemas de rega.',
    icone: '🌿', iconPreview: null, ordem: 4, status: 'ativa',
    subcategorias: [
      { id: 'SUB-012', nome: 'Poda e manutenção', descricao: 'Manutenção regular',          status: 'ativa',  ordem: 1 },
      { id: 'SUB-013', nome: 'Plantação',          descricao: 'Fruteiras e ornamentais',    status: 'ativa',  ordem: 2 },
      { id: 'SUB-014', nome: 'Sistemas de rega',   descricao: 'Irrigação automática',       status: 'ativa',  ordem: 3 },
    ],
  },
  {
    id: 'CAT-005', nome: 'Obras & Renovação', descricao: 'Pintura, impermeabilização, montagem de móveis e acabamentos.',
    icone: '🏗️', iconPreview: null, ordem: 5, status: 'ativa',
    subcategorias: [
      { id: 'SUB-015', nome: 'Pintura',              descricao: 'Interiores e exteriores',    status: 'ativa', ordem: 1 },
      { id: 'SUB-016', nome: 'Impermeabilização',    descricao: 'Telhados e fundações',       status: 'ativa', ordem: 2 },
      { id: 'SUB-017', nome: 'Montagem de móveis',   descricao: 'Flatpack e modulares',       status: 'ativa', ordem: 3 },
    ],
  },
  {
    id: 'CAT-006', nome: 'Controlo de Pragas', descricao: 'Desinfestação, fumigação e prevenção de pragas urbanas.',
    icone: '🐛', iconPreview: null, ordem: 6, status: 'inativa',
    subcategorias: [
      { id: 'SUB-018', nome: 'Desinfestação',  descricao: 'Eliminação de pragas',         status: 'inativa', ordem: 1 },
      { id: 'SUB-019', nome: 'Fumigação',      descricao: 'Tratamento de espaços fechados', status: 'inativa', ordem: 2 },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// Module-level store
// ─────────────────────────────────────────────────────────────

let _store: Categoria[] | null = null;

function getStore(): Categoria[] {
  if (!_store) _store = JSON.parse(JSON.stringify(MOCK));
  return _store!;
}

function saveStore(next: Categoria[]) {
  _store = next;
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

// ─────────────────────────────────────────────────────────────
// Small helpers
// ─────────────────────────────────────────────────────────────

function reorder<T>(arr: T[], from: number, to: number): T[] {
  const result = [...arr];
  const [moved] = result.splice(from, 1);
  result.splice(to, 0, moved);
  return result.map((item, i) => ({ ...(item as object), ordem: i + 1 } as T));
}

// ─────────────────────────────────────────────────────────────
// Shared sub-components
// ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Status }) {
  return status === 'ativa'
    ? (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
        Ativa
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 border border-gray-200">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
        Inativa
      </span>
    );
}

function Toggle({ status, onClick }: { status: Status; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title={status === 'ativa' ? 'Desativar' : 'Ativar'}
      className={`transition-colors cursor-pointer ${status === 'ativa' ? 'text-emerald-600 hover:text-emerald-700' : 'text-gray-300 hover:text-gray-500'}`}
    >
      {status === 'ativa'
        ? <ToggleRight size={22} strokeWidth={1.5} />
        : <ToggleLeft  size={22} strokeWidth={1.5} />}
    </button>
  );
}

function IconDisplay({ icone, preview, size = 32 }: { icone: string; preview: string | null; size?: number }) {
  if (preview) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={preview}
        alt="icon"
        style={{ width: size, height: size }}
        className="rounded-lg object-cover shrink-0"
      />
    );
  }
  return (
    <span style={{ fontSize: size * 0.6, width: size, height: size }}
      className="flex items-center justify-center shrink-0 select-none">
      {icone || '📁'}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// Confirm deactivation modal
// ─────────────────────────────────────────────────────────────

interface ConfirmModalProps {
  nome: string;
  tipo: 'categoria' | 'subcategoria';
  onClose: () => void;
  onConfirm: () => void;
}

function ConfirmModal({ nome, tipo, onClose, onConfirm }: ConfirmModalProps) {
  const [busy, setBusy] = useState(false);
  const handle = () => {
    setBusy(true);
    setTimeout(() => { onConfirm(); }, 350);
  };
  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={!busy ? onClose : undefined} />
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
              <AlertTriangle size={18} className="text-amber-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Desativar {tipo}</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Tem a certeza que deseja desativar <span className="font-semibold text-gray-800">"{nome}"</span>?
                Esta ação é <span className="font-semibold">reversível</span> — pode reativar a qualquer momento através do toggle.
              </p>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-xs text-amber-700 font-medium leading-relaxed">
            A {tipo} ficará inativa e não aparecerá aos utilizadores da plataforma, mas todos os dados serão preservados.
          </div>
          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              onClick={onClose}
              disabled={busy}
              className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:border-gray-400 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handle}
              disabled={busy}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl disabled:opacity-50 transition-colors cursor-pointer"
            >
              {busy ? <Loader size={11} className="animate-spin" /> : <ToggleLeft size={11} />}
              Desativar
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}

// ─────────────────────────────────────────────────────────────
// Category / Subcategory form modal
// ─────────────────────────────────────────────────────────────

interface CatFormData {
  nome: string;
  descricao: string;
  icone: string;
  iconPreview: string | null;
  ordem: number;
}

interface SubFormData {
  nome: string;
  descricao: string;
  ordem: number;
}

function CategoriaModal({
  initial,
  maxOrdem,
  onClose,
  onSave,
}: {
  initial: CatFormData | null;
  maxOrdem: number;
  onClose: () => void;
  onSave: (data: CatFormData) => void;
}) {
  const isEdit = !!initial;
  const [form, setForm] = useState<CatFormData>(
    initial ?? { nome: '', descricao: '', icone: '📁', iconPreview: null, ordem: maxOrdem + 1 },
  );
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [busy, setBusy]       = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const nomeErr = !form.nome.trim() ? 'Nome é obrigatório.' : '';
  const hasErr  = !!nomeErr;

  const mark = (f: string) => setTouched(s => new Set(s).add(f));

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setForm(f => ({ ...f, iconPreview: ev.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const submit = () => {
    setTouched(new Set(['nome', 'icone']));
    if (hasErr || busy) return;
    setBusy(true);
    setTimeout(() => onSave(form), 350);
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={!busy ? onClose : undefined} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in duration-200">

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#06241C]/10 rounded-lg flex items-center justify-center shrink-0">
              <FolderOpen size={16} className="text-[#06241C]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">{isEdit ? 'Editar Categoria' : 'Nova Categoria'}</h3>
              <p className="text-xs text-gray-500 mt-0.5">Preencha os dados da categoria</p>
            </div>
          </div>
          <button onClick={onClose} disabled={busy} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer disabled:opacity-40">
            <X size={14} />
          </button>
        </div>

        {/* Icon section */}
        <div className="flex items-start gap-4">
          {/* Preview */}
          <div className="w-16 h-16 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
            <IconDisplay icone={form.icone} preview={form.iconPreview} size={40} />
          </div>
          <div className="flex-1 space-y-2">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Ícone</label>
            <div className="flex gap-2">
              {/* Emoji input */}
              <input
                type="text"
                value={form.icone}
                onChange={e => setForm(f => ({ ...f, icone: e.target.value, iconPreview: null }))}
                placeholder="Emoji ou texto"
                maxLength={4}
                className="w-24 px-3 py-2 text-sm text-center bg-white border border-gray-200 rounded-xl outline-none focus:border-emerald-400 transition-colors placeholder:text-gray-400"
              />
              {/* Upload */}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-colors cursor-pointer"
              >
                <Upload size={12} /> Carregar imagem
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </div>
            {form.iconPreview && (
              <button
                onClick={() => setForm(f => ({ ...f, iconPreview: null }))}
                className="text-[10px] text-red-500 hover:text-red-700 font-medium cursor-pointer"
              >
                × Remover imagem
              </button>
            )}
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Nome <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.nome}
              onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
              onBlur={() => mark('nome')}
              placeholder="Ex: Limpeza, Eletricidade..."
              className={`w-full px-3.5 py-2.5 text-xs bg-white border rounded-xl outline-none transition-all placeholder:text-gray-400 ${touched.has('nome') && nomeErr ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-emerald-400'}`}
            />
            {touched.has('nome') && nomeErr && <p className="text-[10px] text-red-500 mt-1 font-medium">{nomeErr}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Descrição</label>
            <textarea
              value={form.descricao}
              onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
              placeholder="Breve descrição da categoria..."
              rows={2}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-200 rounded-xl outline-none focus:border-emerald-400 transition-all resize-none placeholder:text-gray-400"
            />
          </div>

          <div className="w-32">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Ordem</label>
            <input
              type="number"
              min={1}
              value={form.ordem}
              onChange={e => setForm(f => ({ ...f, ordem: Math.max(1, parseInt(e.target.value) || 1) }))}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-200 rounded-xl outline-none focus:border-emerald-400 transition-all"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <button onClick={onClose} disabled={busy} className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:border-gray-400 transition-colors cursor-pointer disabled:opacity-50">
            Cancelar
          </button>
          <button
            onClick={submit}
            disabled={busy}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#06241C] hover:bg-[#0B392E] rounded-xl disabled:opacity-50 transition-colors cursor-pointer"
          >
            {busy ? <Loader size={11} className="animate-spin" /> : <Check size={11} />}
            {isEdit ? 'Guardar' : 'Criar categoria'}
          </button>
        </div>
      </div>
    </div>
    </Portal>
  );
}

function SubcategoriaModal({
  initial,
  catNome,
  maxOrdem,
  onClose,
  onSave,
}: {
  initial: SubFormData | null;
  catNome: string;
  maxOrdem: number;
  onClose: () => void;
  onSave: (data: SubFormData) => void;
}) {
  const isEdit = !!initial;
  const [form, setForm] = useState<SubFormData>(
    initial ?? { nome: '', descricao: '', ordem: maxOrdem + 1 },
  );
  const [touched, setTouched] = useState(false);
  const [busy, setBusy]       = useState(false);
  const nomeErr = touched && !form.nome.trim() ? 'Nome é obrigatório.' : '';

  const submit = () => {
    setTouched(true);
    if (!form.nome.trim() || busy) return;
    setBusy(true);
    setTimeout(() => onSave(form), 350);
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={!busy ? onClose : undefined} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in duration-200">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
              <Tag size={15} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">{isEdit ? 'Editar Subcategoria' : 'Nova Subcategoria'}</h3>
              <p className="text-xs text-gray-500 mt-0.5">em <span className="font-semibold">{catNome}</span></p>
            </div>
          </div>
          <button onClick={onClose} disabled={busy} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer disabled:opacity-40">
            <X size={14} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Nome <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.nome}
              onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
              onBlur={() => setTouched(true)}
              placeholder="Ex: Limpeza doméstica, Poda..."
              className={`w-full px-3.5 py-2.5 text-xs bg-white border rounded-xl outline-none transition-all placeholder:text-gray-400 ${nomeErr ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-emerald-400'}`}
            />
            {nomeErr && <p className="text-[10px] text-red-500 mt-1 font-medium">{nomeErr}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Descrição</label>
            <textarea
              value={form.descricao}
              onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
              placeholder="Descrição breve..."
              rows={2}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-200 rounded-xl outline-none focus:border-emerald-400 transition-all resize-none placeholder:text-gray-400"
            />
          </div>

          <div className="w-28">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Ordem</label>
            <input
              type="number"
              min={1}
              value={form.ordem}
              onChange={e => setForm(f => ({ ...f, ordem: Math.max(1, parseInt(e.target.value) || 1) }))}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-200 rounded-xl outline-none focus:border-emerald-400 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-1">
          <button onClick={onClose} disabled={busy} className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:border-gray-400 transition-colors cursor-pointer disabled:opacity-50">
            Cancelar
          </button>
          <button
            onClick={submit}
            disabled={busy}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#06241C] hover:bg-[#0B392E] rounded-xl disabled:opacity-50 transition-colors cursor-pointer"
          >
            {busy ? <Loader size={11} className="animate-spin" /> : <Check size={11} />}
            {isEdit ? 'Guardar' : 'Criar subcategoria'}
          </button>
        </div>
      </div>
    </div>
    </Portal>
  );
}

// ─────────────────────────────────────────────────────────────
// Subcategoria row
// ─────────────────────────────────────────────────────────────

function SubcategoriaRow({
  sub,
  isFirst,
  isLast,
  onToggle,
  onEdit,
  onMoveUp,
  onMoveDown,
}: {
  sub: Subcategoria;
  isFirst: boolean;
  isLast: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50/40 transition-colors ${sub.status === 'inativa' ? 'opacity-60' : ''}`}>
      {/* Left indent line */}
      <div className="flex flex-col items-center gap-0.5 shrink-0">
        <button onClick={onMoveUp} disabled={isFirst} className="w-5 h-5 flex items-center justify-center text-gray-300 hover:text-gray-500 disabled:opacity-0 transition-colors cursor-pointer">
          <ArrowUp size={11} />
        </button>
        <button onClick={onMoveDown} disabled={isLast} className="w-5 h-5 flex items-center justify-center text-gray-300 hover:text-gray-500 disabled:opacity-0 transition-colors cursor-pointer">
          <ArrowDown size={11} />
        </button>
      </div>

      {/* Status dot */}
      <span className={`w-2 h-2 rounded-full shrink-0 ${sub.status === 'ativa' ? 'bg-emerald-400' : 'bg-gray-300'}`} />

      {/* Order badge */}
      <span className="text-[9px] font-mono font-bold text-gray-300 w-4 shrink-0">{sub.ordem}</span>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <span className="text-xs font-semibold text-gray-800">{sub.nome}</span>
        {sub.descricao && <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed truncate">{sub.descricao}</p>}
      </div>

      {/* Status badge */}
      <div className="hidden sm:block shrink-0">
        <StatusBadge status={sub.status} />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        <Toggle status={sub.status} onClick={onToggle} />
        <button
          onClick={onEdit}
          className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <Edit2 size={11} />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Category card (draggable + accordion)
// ─────────────────────────────────────────────────────────────

interface CategoriaCardProps {
  cat: Categoria;
  index: number;
  total: number;
  isDragging: boolean;
  isDragOver: boolean;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onDrop: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onToggle: () => void;
  onEdit: () => void;
  onAddSub: () => void;
  onToggleSub: (subId: string) => void;
  onEditSub: (sub: Subcategoria) => void;
  onMoveSub: (subId: string, dir: 'up' | 'down') => void;
}

function CategoriaCard({
  cat, index, total,
  isDragging, isDragOver,
  onDragStart, onDragOver, onDragEnd, onDrop,
  onMoveUp, onMoveDown,
  onToggle, onEdit, onAddSub,
  onToggleSub, onEditSub, onMoveSub,
}: CategoriaCardProps) {
  const [expanded, setExpanded] = useState(false);

  const activeSubs   = cat.subcategorias.filter(s => s.status === 'ativa').length;
  const totalSubs    = cat.subcategorias.length;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDrop={onDrop}
      className={`relative rounded-2xl border shadow-xs transition-all duration-150 select-none ${
        isDragging
          ? 'opacity-40 scale-[0.99] shadow-md'
          : isDragOver
            ? 'border-[#06241C]/40 shadow-md ring-2 ring-[#06241C]/10'
            : cat.status === 'inativa'
              ? 'border-gray-100 bg-gray-50/50'
              : 'border-gray-200 bg-white'
      }`}
    >
      {/* Drop indicator top line */}
      {isDragOver && (
        <div className="absolute -top-px left-4 right-4 h-0.5 bg-[#06241C] rounded-full z-10 pointer-events-none" />
      )}

      {/* ── Card header ─────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-4">

        {/* Drag handle + order arrows (stacked) */}
        <div className="flex flex-col items-center gap-0 shrink-0">
          <div
            className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 transition-colors touch-none"
            title="Arrastar para reordenar"
          >
            <GripVertical size={16} />
          </div>
        </div>

        {/* Mobile order arrows */}
        <div className="flex flex-col gap-0 sm:hidden shrink-0">
          <button onClick={onMoveUp} disabled={index === 0} className="w-5 h-4 flex items-center justify-center text-gray-300 hover:text-gray-600 disabled:opacity-0 cursor-pointer">
            <ArrowUp size={10} />
          </button>
          <button onClick={onMoveDown} disabled={index === total - 1} className="w-5 h-4 flex items-center justify-center text-gray-300 hover:text-gray-600 disabled:opacity-0 cursor-pointer">
            <ArrowDown size={10} />
          </button>
        </div>

        {/* Order badge */}
        <span className="text-[10px] font-mono font-bold text-gray-300 w-5 text-center shrink-0">{cat.ordem}</span>

        {/* Icon */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cat.status === 'inativa' ? 'bg-gray-100' : 'bg-emerald-50'}`}>
          <IconDisplay icone={cat.icone} preview={cat.iconPreview} size={28} />
        </div>

        {/* Name + description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-sm font-bold truncate ${cat.status === 'inativa' ? 'text-gray-400' : 'text-gray-900'}`}>
              {cat.nome}
            </span>
            <StatusBadge status={cat.status} />
          </div>
          {cat.descricao && (
            <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed line-clamp-1">{cat.descricao}</p>
          )}
          <p className="text-[10px] text-gray-400 font-medium mt-0.5">
            {activeSubs} subcateg. ativa{activeSubs !== 1 ? 's' : ''} · {totalSubs} total
          </p>
        </div>

        {/* Desktop order arrows */}
        <div className="hidden sm:flex flex-col gap-0 shrink-0">
          <button onClick={onMoveUp} disabled={index === 0} className="w-6 h-5 flex items-center justify-center text-gray-200 hover:text-gray-500 disabled:opacity-0 transition-colors cursor-pointer">
            <ArrowUp size={12} />
          </button>
          <button onClick={onMoveDown} disabled={index === total - 1} className="w-6 h-5 flex items-center justify-center text-gray-200 hover:text-gray-500 disabled:opacity-0 transition-colors cursor-pointer">
            <ArrowDown size={12} />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Toggle status={cat.status} onClick={onToggle} />
          <button
            onClick={onEdit}
            className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <Edit2 size={12} />
          </button>
          <button
            onClick={() => setExpanded(v => !v)}
            className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            title={expanded ? 'Recolher subcategorias' : 'Expandir subcategorias'}
          >
            {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </button>
        </div>
      </div>

      {/* ── Accordion: subcategorias ─────────────────── */}
      {expanded && (
        <div className="border-t border-gray-100">
          {/* Sub-header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50/60">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Subcategorias ({totalSubs})
            </span>
            <button
              onClick={onAddSub}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-[#06241C] bg-white border border-[#06241C]/20 hover:border-[#06241C]/40 rounded-lg transition-colors cursor-pointer"
            >
              <Plus size={9} /> Nova subcategoria
            </button>
          </div>

          {/* Subcat list */}
          {cat.subcategorias.length === 0 ? (
            <div className="px-4 py-6 text-center">
              <p className="text-xs text-gray-400">Nenhuma subcategoria nesta categoria.</p>
              <button onClick={onAddSub} className="mt-2 text-xs text-emerald-600 font-semibold hover:text-emerald-700 cursor-pointer">
                Adicionar primeira subcategoria →
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {cat.subcategorias
                .slice()
                .sort((a, b) => a.ordem - b.ordem)
                .map((sub, si, arr) => (
                  <SubcategoriaRow
                    key={sub.id}
                    sub={sub}
                    isFirst={si === 0}
                    isLast={si === arr.length - 1}
                    onToggle={() => onToggleSub(sub.id)}
                    onEdit={() => onEditSub(sub)}
                    onMoveUp={() => onMoveSub(sub.id, 'up')}
                    onMoveDown={() => onMoveSub(sub.id, 'down')}
                  />
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Page skeleton
// ─────────────────────────────────────────────────────────────

function PageSkeleton() {
  return (
    <div className="flex flex-col gap-5 max-w-[1100px] mx-auto animate-pulse">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 space-y-2">
            <div className="h-2.5 bg-gray-100 rounded w-1/2" />
            <div className="h-7 bg-gray-200 rounded w-1/3" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-4">
        <div className="h-8 bg-gray-100 rounded-xl" />
      </div>
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-xs p-4 flex items-center gap-4">
          <div className="w-4 h-12 bg-gray-100 rounded" />
          <div className="w-10 h-10 rounded-xl bg-gray-100 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 bg-gray-200 rounded w-1/4" />
            <div className="h-2.5 bg-gray-100 rounded w-1/2" />
          </div>
          <div className="w-16 h-5 bg-gray-100 rounded-full" />
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main page content
// ─────────────────────────────────────────────────────────────

type Modal =
  | { type: 'newCat' }
  | { type: 'editCat'; cat: Categoria }
  | { type: 'newSub'; catId: string }
  | { type: 'editSub'; catId: string; sub: Subcategoria }
  | { type: 'confirmToggle'; catId: string; subId?: string; nome: string; tipo: 'categoria' | 'subcategoria' };

function CatalogoContent() {
  const [cats, setCats]       = useState<Categoria[]>(() => [...getStore()]);
  const [search, setSearch]   = useState('');
  const [modal, setModal]     = useState<Modal | null>(null);
  const [toast, setToast]     = useState<{ msg: string; key: number } | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const toastRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    const key = Date.now();
    setToast({ msg, key });
    if (toastRef.current) clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const update = useCallback((next: Categoria[]) => {
    saveStore(next);
    setCats([...next]);
  }, []);

  // ── Search filter ──────────────────────────────────────────
  const q = search.toLowerCase();
  const visible = cats.filter(c =>
    !q ||
    c.nome.toLowerCase().includes(q) ||
    c.descricao.toLowerCase().includes(q) ||
    c.subcategorias.some(s => s.nome.toLowerCase().includes(q))
  );

  // ── KPIs ──────────────────────────────────────────────────
  const totalCats    = cats.length;
  const ativasCats   = cats.filter(c => c.status === 'ativa').length;
  const totalSubs    = cats.reduce((s, c) => s + c.subcategorias.length, 0);
  const ativasSubs   = cats.reduce((s, c) => s + c.subcategorias.filter(sb => sb.status === 'ativa').length, 0);

  // ── Drag & drop ───────────────────────────────────────────
  const handleDragStart = (i: number) => setDragIdx(i);

  const handleDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    setOverIdx(i);
  };

  const handleDrop = (i: number) => {
    if (dragIdx === null || dragIdx === i) { setDragIdx(null); setOverIdx(null); return; }
    const next = reorder(cats, dragIdx, i);
    update(next);
    setDragIdx(null);
    setOverIdx(null);
    showToast('Ordem das categorias atualizada.');
  };

  const handleDragEnd = () => { setDragIdx(null); setOverIdx(null); };

  // ── Move cat ───────────────────────────────────────────────
  const moveCat = (i: number, dir: 'up' | 'down') => {
    const to = dir === 'up' ? i - 1 : i + 1;
    if (to < 0 || to >= cats.length) return;
    update(reorder(cats, i, to));
    showToast('Ordem atualizada.');
  };

  // ── Toggle category ────────────────────────────────────────
  const toggleCat = (catId: string) => {
    const cat = cats.find(c => c.id === catId)!;
    if (cat.status === 'ativa') {
      setModal({ type: 'confirmToggle', catId, nome: cat.nome, tipo: 'categoria' });
    } else {
      update(cats.map(c => c.id === catId ? { ...c, status: 'ativa' } : c));
      showToast(`Categoria "${cat.nome}" ativada.`);
    }
  };

  // ── Toggle subcategoria ────────────────────────────────────
  const toggleSub = (catId: string, subId: string) => {
    const cat = cats.find(c => c.id === catId)!;
    const sub = cat.subcategorias.find(s => s.id === subId)!;
    if (sub.status === 'ativa') {
      setModal({ type: 'confirmToggle', catId, subId, nome: sub.nome, tipo: 'subcategoria' });
    } else {
      update(cats.map(c =>
        c.id !== catId ? c : {
          ...c,
          subcategorias: c.subcategorias.map(s =>
            s.id === subId ? { ...s, status: 'ativa' } : s
          ),
        }
      ));
      showToast(`Subcategoria "${sub.nome}" ativada.`);
    }
  };

  // ── Confirm deactivation ───────────────────────────────────
  const confirmDeactivate = () => {
    if (!modal || modal.type !== 'confirmToggle') return;
    const { catId, subId, nome } = modal;
    if (subId) {
      update(cats.map(c =>
        c.id !== catId ? c : {
          ...c,
          subcategorias: c.subcategorias.map(s =>
            s.id === subId ? { ...s, status: 'inativa' } : s
          ),
        }
      ));
      showToast(`Subcategoria "${nome}" desativada.`);
    } else {
      update(cats.map(c => c.id === catId ? { ...c, status: 'inativa' } : c));
      showToast(`Categoria "${nome}" desativada.`);
    }
    setModal(null);
  };

  // ── Move subcat ────────────────────────────────────────────
  const moveSub = (catId: string, subId: string, dir: 'up' | 'down') => {
    const cat = cats.find(c => c.id === catId)!;
    const sorted = cat.subcategorias.slice().sort((a, b) => a.ordem - b.ordem);
    const idx = sorted.findIndex(s => s.id === subId);
    const to  = dir === 'up' ? idx - 1 : idx + 1;
    if (to < 0 || to >= sorted.length) return;
    const reordered = reorder(sorted, idx, to);
    update(cats.map(c => c.id !== catId ? c : { ...c, subcategorias: reordered }));
  };

  // ── Save category ──────────────────────────────────────────
  const saveCat = (data: CatFormData) => {
    if (!modal) return;
    if (modal.type === 'newCat') {
      const novo: Categoria = {
        ...data,
        id: `CAT-${uid()}`,
        status: 'ativa',
        subcategorias: [],
      };
      const next = [...cats, novo].map((c, i) => ({ ...c, ordem: i + 1 }));
      update(next);
      showToast(`Categoria "${data.nome}" criada.`);
    } else if (modal.type === 'editCat') {
      update(cats.map(c => c.id === modal.cat.id ? { ...c, ...data } : c));
      showToast(`Categoria "${data.nome}" atualizada.`);
    }
    setModal(null);
  };

  // ── Save subcategory ───────────────────────────────────────
  const saveSub = (catId: string, data: SubFormData, subId?: string) => {
    if (subId) {
      update(cats.map(c =>
        c.id !== catId ? c : {
          ...c,
          subcategorias: c.subcategorias.map(s =>
            s.id === subId ? { ...s, ...data } : s
          ),
        }
      ));
      showToast(`Subcategoria "${data.nome}" atualizada.`);
    } else {
      const nova: Subcategoria = {
        ...data,
        id: `SUB-${uid()}`,
        status: 'ativa',
      };
      update(cats.map(c =>
        c.id !== catId ? c : { ...c, subcategorias: [...c.subcategorias, nova] }
      ));
      showToast(`Subcategoria "${data.nome}" criada.`);
    }
    setModal(null);
  };

  // ─────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-5 max-w-[1100px] mx-auto">

      {/* Toast */}
      {toast && (
        <div key={toast.key} className="shrink-0 flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl animate-in fade-in duration-200">
          <Check size={14} className="text-emerald-600 shrink-0" />
          <p className="text-xs font-semibold text-emerald-700">{toast.msg}</p>
        </div>
      )}

      {/* KPI row */}
      <div className="shrink-0 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#06241C]/8 flex items-center justify-center shrink-0">
            <BookOpen size={18} className="text-[#06241C]" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Categorias</p>
            <p className="text-2xl font-bold text-gray-900">{totalCats}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{ativasCats} ativas</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
            <Layers size={18} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Subcategorias</p>
            <p className="text-2xl font-bold text-gray-900">{totalSubs}</p>
            <p className="text-[10px] text-emerald-600 mt-0.5">{ativasSubs} ativas</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
            <Eye size={18} className="text-amber-500" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Visíveis</p>
            <p className="text-2xl font-bold text-gray-900">{ativasCats}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">categorias publicadas</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
            <ToggleLeft size={18} className="text-gray-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Inativas</p>
            <p className="text-2xl font-bold text-gray-900">{totalCats - ativasCats + totalSubs - ativasSubs}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">itens desativados</p>
          </div>
        </div>
      </div>

      {/* Search + New category */}
      <div className="shrink-0 bg-white rounded-2xl border border-gray-200 shadow-xs p-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Pesquisar categoria ou subcategoria..."
            className="w-full pl-8 pr-8 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-400 focus:bg-white transition-colors placeholder:text-gray-400"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
              <X size={11} />
            </button>
          )}
        </div>
        <span className="text-[10px] text-gray-400 font-medium hidden sm:block whitespace-nowrap">
          {visible.length} de {cats.length}
        </span>
        <button
          onClick={() => setModal({ type: 'newCat' })}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#06241C] hover:bg-[#0B392E] rounded-xl transition-all shadow-sm active:scale-[0.98] cursor-pointer whitespace-nowrap"
        >
          <Plus size={13} /> Nova categoria
        </button>
      </div>

      {/* Drag hint */}
      <div className="shrink-0 flex items-center gap-2 px-1">
        <GripVertical size={12} className="text-gray-300" />
        <p className="text-[10px] text-gray-400 font-medium">
          Arraste as categorias para reordenar · Use ↑↓ no mobile
        </p>
      </div>

      {/* Category list */}
      {visible.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs py-20 flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
            <AlertTriangle size={20} className="text-gray-300" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-600">Nenhuma categoria encontrada</p>
            <p className="text-xs text-gray-400 mt-1">
              {search ? 'Tente um termo diferente.' : 'Crie a primeira categoria.'}
            </p>
          </div>
          {!search && (
            <button
              onClick={() => setModal({ type: 'newCat' })}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#06241C] hover:bg-[#0B392E] rounded-xl transition-colors cursor-pointer"
            >
              <Plus size={12} /> Criar primeira categoria
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((cat, i) => {
            const realIdx = cats.indexOf(cat);
            return (
              <CategoriaCard
                key={cat.id}
                cat={cat}
                index={realIdx}
                total={cats.length}
                isDragging={dragIdx === realIdx}
                isDragOver={overIdx === realIdx && dragIdx !== realIdx}
                onDragStart={() => handleDragStart(realIdx)}
                onDragOver={e => handleDragOver(e, realIdx)}
                onDragEnd={handleDragEnd}
                onDrop={() => handleDrop(realIdx)}
                onMoveUp={() => moveCat(realIdx, 'up')}
                onMoveDown={() => moveCat(realIdx, 'down')}
                onToggle={() => toggleCat(cat.id)}
                onEdit={() => setModal({ type: 'editCat', cat })}
                onAddSub={() => setModal({ type: 'newSub', catId: cat.id })}
                onToggleSub={subId => toggleSub(cat.id, subId)}
                onEditSub={sub => setModal({ type: 'editSub', catId: cat.id, sub })}
                onMoveSub={(subId, dir) => moveSub(cat.id, subId, dir)}
              />
            );
          })}
        </div>
      )}

      {/* ── Modals ─────────────────────────────────────────── */}

      {modal?.type === 'newCat' && (
        <CategoriaModal
          initial={null}
          maxOrdem={cats.length}
          onClose={() => setModal(null)}
          onSave={saveCat}
        />
      )}

      {modal?.type === 'editCat' && (
        <CategoriaModal
          initial={{
            nome: modal.cat.nome,
            descricao: modal.cat.descricao,
            icone: modal.cat.icone,
            iconPreview: modal.cat.iconPreview,
            ordem: modal.cat.ordem,
          }}
          maxOrdem={cats.length}
          onClose={() => setModal(null)}
          onSave={saveCat}
        />
      )}

      {modal?.type === 'newSub' && (() => {
        const cat = cats.find(c => c.id === modal.catId)!;
        return (
          <SubcategoriaModal
            initial={null}
            catNome={cat.nome}
            maxOrdem={cat.subcategorias.length}
            onClose={() => setModal(null)}
            onSave={data => saveSub(modal.catId, data)}
          />
        );
      })()}

      {modal?.type === 'editSub' && (() => {
        const cat = cats.find(c => c.id === modal.catId)!;
        return (
          <SubcategoriaModal
            initial={{ nome: modal.sub.nome, descricao: modal.sub.descricao, ordem: modal.sub.ordem }}
            catNome={cat.nome}
            maxOrdem={cat.subcategorias.length}
            onClose={() => setModal(null)}
            onSave={data => saveSub(modal.catId, data, modal.sub.id)}
          />
        );
      })()}

      {modal?.type === 'confirmToggle' && (
        <ConfirmModal
          nome={modal.nome}
          tipo={modal.tipo}
          onClose={() => setModal(null)}
          onConfirm={confirmDeactivate}
        />
      )}

    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────

export default function CatalogoPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <CatalogoContent />
    </Suspense>
  );
}
