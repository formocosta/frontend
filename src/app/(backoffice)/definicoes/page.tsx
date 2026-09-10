'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Settings, User, Bell, Lock, CheckCircle2, ShieldCheck } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Input } from '@/components/common/form/Input';
import { Button } from '@/components/common/form/Button';
import { useAuthStore } from '@/shared/store/auth.store';
import { DefinicoesService, UpdateDefinicoesPayload } from '@/service/definicoes.service';

export default function DefinicoesPage() {
  const currentUser = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [notificacoesEmail, setNotificacoesEmail] = useState(true);
  const [notificacoesSistema, setNotificacoesSistema] = useState(true);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<UpdateDefinicoesPayload>();

  useEffect(() => {
    async function loadDefinicoes() {
      setLoading(true);
      try {
        const data = await DefinicoesService.getDefinicoes();
        if (data.user) {
          reset({
            nome_completo: data.user.nome_completo,
            email: data.user.email,
            telefone: data.user.telefone,
          });
        }
        if (data.preferencias) {
          setNotificacoesEmail(data.preferencias.notificacoes_email);
          setNotificacoesSistema(data.preferencias.notificacoes_sistema);
        }
      } catch (err) {
        // Fallback to auth store data
        if (currentUser) {
          reset({
            nome_completo: currentUser.nome_completo,
            email: currentUser.email,
            telefone: currentUser.telefone,
          });
        }
      } finally {
        setLoading(false);
      }
    }
    loadDefinicoes();
  }, [currentUser, reset]);

  const onSubmit = async (data: UpdateDefinicoesPayload) => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const payload: UpdateDefinicoesPayload = {
        ...data,
        notificacoes_email: notificacoesEmail,
        notificacoes_sistema: notificacoesSistema,
      };

      const result = await DefinicoesService.updateDefinicoes(payload);
      if (result.data?.user) {
        setUser(result.data.user);
      }
      setSuccess(result.message || 'Definições atualizadas com sucesso!');
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao atualizar definições.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Definições da Conta & Preferências"
        description="Gestão do perfil de utilizador, segurança e notificações da plataforma"
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-700 font-bold shadow-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-md p-4 text-sm text-emerald-700 font-bold shadow-sm flex items-center gap-2">
          <CheckCircle2 size={16} />
          {success}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-md p-12 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-2 border-[#42b883] border-t-transparent rounded-md animate-spin" />
          <p className="text-sm text-gray-500 mt-4 font-medium">A carregar definições...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* User Profile Card */}
          <div className="bg-white border border-gray-100 rounded-md p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-5">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 border-b border-gray-50 pb-3 flex items-center gap-2">
              <User size={16} className="text-[#42b883]" />
              Informações Pessoais do Perfil
            </h3>

            <div className="flex items-center gap-4 bg-gray-50/80 p-4 rounded-md border border-gray-100">
              <div className="w-14 h-14 rounded-md bg-gradient-to-br from-[#42b883] to-[#3aa374] flex items-center justify-center text-white font-black text-2xl shadow-inner shrink-0">
                {currentUser?.nome_completo?.charAt(0) || 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-[15px] font-black text-gray-900 truncate">{currentUser?.nome_completo}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                    {currentUser?.role === 'admin' ? 'Administrador' : 'Operador'}
                  </span>
                  <span className="text-[11px] text-gray-500 font-semibold truncate">{currentUser?.email}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Input
                label="Nome Completo"
                placeholder="Seu nome completo"
                error={errors.nome_completo?.message}
                {...register('nome_completo')}
                className="rounded-md"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Endereço de E-mail"
                  type="email"
                  placeholder="exemplo@formocosta.com"
                  error={errors.email?.message}
                  {...register('email')}
                  className="rounded-md"
                />
                <Input
                  label="Número de Telefone"
                  placeholder="923 456 789"
                  error={errors.telefone?.message}
                  {...register('telefone')}
                  className="rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Security Card */}
          <div className="bg-white border border-gray-100 rounded-md p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 border-b border-gray-50 pb-3 flex items-center gap-2">
              <Lock size={16} className="text-[#42b883]" />
              Segurança e Palavra-passe
            </h3>

            <Input
              label="Nova Palavra-passe (Deixar em branco para não alterar)"
              type="password"
              placeholder="Mínimo de 6 caracteres"
              error={errors.password?.message}
              {...register('password')}
              className="rounded-md"
            />
          </div>

          {/* Notifications & Preferences Card */}
          <div className="bg-white border border-gray-100 rounded-md p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 border-b border-gray-50 pb-3 flex items-center gap-2">
              <Bell size={16} className="text-[#42b883]" />
              Preferências de Notificações
            </h3>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3.5 bg-gray-50/80 rounded-md border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-[13px] font-bold text-gray-900">Notificações por E-mail</p>
                  <p className="text-[11px] text-gray-500 font-medium">Receber alertas de novas candidaturas KYC e relatórios diários no e-mail.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificacoesEmail}
                  onChange={(e) => setNotificacoesEmail(e.target.checked)}
                  className="w-4 h-4 text-[#42b883] rounded border-gray-300 focus:ring-[#42b883]"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 bg-gray-50/80 rounded-md border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-[13px] font-bold text-gray-900">Notificações do Sistema</p>
                  <p className="text-[11px] text-gray-500 font-medium">Exibir alertas e crachás em tempo real na barra de ferramentas superior.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificacoesSistema}
                  onChange={(e) => setNotificacoesSistema(e.target.checked)}
                  className="w-4 h-4 text-[#42b883] rounded border-gray-300 focus:ring-[#42b883]"
                />
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Button
              type="submit"
              variant="primary"
              className="rounded-md font-bold shadow-sm bg-[#42b883] hover:bg-[#3aa374] px-6"
              isLoading={saving}
              leftIcon={<ShieldCheck size={16} />}
            >
              Guardar Alterações
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
