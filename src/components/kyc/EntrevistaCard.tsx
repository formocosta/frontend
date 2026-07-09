'use client';

import React, { useState } from 'react';
import { Video, MapPin, Calendar, Clock, Edit } from 'lucide-react';
import { Entrevista } from '@/shared/types/backoffice/kyc.types';
import { Badge } from '@/components/common/ui/Badge';
import { Button } from '@/components/common/form/Button';
import { Modal } from '@/components/common/ui/Modal';
import { Select, SelectOption } from '@/components/common/form/Select';
import { Textarea } from '@/components/common/form/Textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { atualizarEntrevistaSchema, AtualizarEntrevistaFormData } from '@/shared/schemas/kyc.schema';

interface EntrevistaCardProps {
  entrevista: Entrevista;
  onAtualizar: (id: string, data: AtualizarEntrevistaFormData) => Promise<boolean>;
}

const tipoConfig: Record<string, { label: string; icon: React.ElementType }> = {
  video_chamada: { label: 'Videchamada', icon: Video },
  presencial: { label: 'Presencial', icon: MapPin },
};

const statusConfig: Record<string, { label: string; variant: 'success' | 'danger' | 'warning' | 'info' }> = {
  agendada: { label: 'Agendada', variant: 'info' },
  realizada: { label: 'Realizada', variant: 'success' },
  cancelada: { label: 'Cancelada', variant: 'danger' },
  nao_compareceu: { label: 'Não Compareceu', variant: 'danger' },
  faltou: { label: 'Faltou', variant: 'danger' },
};

const resultadoConfig: Record<string, { label: string; variant: 'success' | 'danger' | 'warning' }> = {
  aprovado: { label: 'Aprovado', variant: 'success' },
  reprovado: { label: 'Reprovado', variant: 'danger' },
  inconclusivo: { label: 'Inconclusivo', variant: 'warning' },
};

const statusOptions: SelectOption[] = [
  { value: 'agendada', label: 'Agendada' },
  { value: 'realizada', label: 'Realizada' },
  { value: 'cancelada', label: 'Cancelada' },
  { value: 'nao_compareceu', label: 'Não Compareceu' },
  { value: 'faltou', label: 'Faltou' },
];

const resultadoOptions: SelectOption[] = [
  { value: 'aprovado', label: 'Aprovado' },
  { value: 'reprovado', label: 'Reprovado' },
  { value: 'inconclusivo', label: 'Inconclusivo' },
];

export function EntrevistaCard({ entrevista, onAtualizar }: EntrevistaCardProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const tipo = tipoConfig[entrevista.tipo] || tipoConfig.video;
  const status = statusConfig[entrevista.status] || statusConfig.agendada;
  const resultado = entrevista.resultado ? resultadoConfig[entrevista.resultado] : null;
  const Icon = tipo.icon;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AtualizarEntrevistaFormData>({
    resolver: zodResolver(atualizarEntrevistaSchema),
    defaultValues: {
      status: entrevista.status,
      resultado: entrevista.resultado,
      notas: entrevista.notas,
    },
  });

  async function onSubmit(data: AtualizarEntrevistaFormData) {
    setLoading(true);
    const success = await onAtualizar(entrevista.id, data);
    if (success) {
      setShowEditModal(false);
    }
    setLoading(false);
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Icon size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{tipo.label}</p>
              <div className="flex items-center gap-3 text-[11px] text-gray-500 font-medium mt-0.5">
                <span className="flex items-center gap-1">
                  <Calendar size={11} />
                  {new Date(entrevista.agendada_para).toLocaleDateString('pt-AO')}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  {new Date(entrevista.agendada_para).toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={status.variant}>{status.label}</Badge>
            {resultado && <Badge variant={resultado.variant}>{resultado.label}</Badge>}
          </div>
        </div>

        {entrevista.notas && (
          <p className="mt-3 text-xs text-gray-600 bg-gray-50 rounded-lg p-2.5">
            {entrevista.notas}
          </p>
        )}

        {entrevista.link_videochamada && (
          <a
            href={entrevista.link_videochamada}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            <Video size={12} />
            Abrir link da videchamada
          </a>
        )}

        <div className="flex items-center justify-end mt-3 pt-3 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowEditModal(true)}
            leftIcon={<Edit size={14} />}
          >
            Actualizar
          </Button>
        </div>
      </div>

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Actualizar Entrevista"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowEditModal(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={loading}>
              Guardar
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Select
            label="Estado"
            options={statusOptions}
            error={errors.status?.message}
            {...register('status')}
          />

          <Select
            label="Resultado"
            options={resultadoOptions}
            placeholder="Selecione o resultado"
            error={errors.resultado?.message}
            {...register('resultado')}
          />

          <Textarea
            label="Notas"
            placeholder="Adicione notas sobre a entrevista..."
            error={errors.notas?.message}
            rows={3}
            {...register('notas')}
          />
        </form>
      </Modal>
    </>
  );
}
