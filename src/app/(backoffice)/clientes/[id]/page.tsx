'use client';
 
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useClienteDetail } from '@/hooks/users/users.hooks';
import { ArrowLeft, Mail, Phone, Calendar, ShieldCheck, MapPin, ClipboardList, Info } from 'lucide-react';
import Link from 'next/link';
import { StatusBadge } from '@/components/common/ui/Badge';
 
export default function ClienteDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { cliente, loading, error, fetchCliente } = useClienteDetail();
 
  useEffect(() => {
    if (id) {
      fetchCliente(id);
    }
  }, [id, fetchCliente]);
 
  if (loading) {
    return (
      <div className="bg-white rounded-sm p-12 shadow-sm border border-gray-100/80 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-2 border-[#42b883] border-t-transparent rounded-sm animate-spin" />
        <p className="text-sm text-gray-500 mt-4 font-medium">A carregar detalhes do cliente...</p>
      </div>
    );
  }
 
  if (error || !cliente) {
    return (
      <div className="space-y-4">
        <Link href="/clientes" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#42b883] transition-colors">
          <ArrowLeft size={14} /> Voltar para Clientes
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-sm p-6 text-center">
          <h3 className="text-base font-bold text-red-900">Erro ao carregar</h3>
          <p className="text-xs text-red-700 mt-2 font-medium">{error || 'Cliente não encontrado.'}</p>
        </div>
      </div>
    );
  }
 
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/clientes"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#42b883] transition-colors"
        >
          <ArrowLeft size={14} /> Voltar para Clientes
        </Link>
      </div>
 
      <div className="bg-white border border-gray-100 rounded-sm p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-sm bg-gradient-to-br from-[#42b883] to-[#3aa374] flex items-center justify-center text-white font-bold text-3xl shadow-md shrink-0">
          {cliente.nome_completo.charAt(0)}
        </div>
        <div className="flex-1 text-center sm:text-left space-y-1.5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <h1 className="text-xl font-black text-gray-900 tracking-tight">{cliente.nome_completo}</h1>
            <div className="self-center sm:self-auto">
              <StatusBadge status={cliente.status} />
            </div>
          </div>
          <p className="text-xs font-medium text-gray-500">ID da Conta: {cliente.id}</p>
        </div>
      </div>
 
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Access and contacts */}
        <div className="bg-white border border-gray-100 rounded-sm p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 border-b border-gray-50 pb-2">
            Dados de Acesso e Contato
          </h3>
 
          <div className="space-y-3.5">
            <div className="flex items-start gap-3">
              <Mail size={16} className="text-gray-400 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-gray-400 block uppercase">E-mail</span>
                <span className="text-xs font-semibold text-gray-700">{cliente.email}</span>
                {cliente.email_verified_at ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-sm mt-1">
                    <ShieldCheck size={10} /> Verificado em {new Date(cliente.email_verified_at).toLocaleDateString('pt-AO')}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-sm mt-1">
                    Não verificado
                  </span>
                )}
              </div>
            </div>
 
            <div className="flex items-start gap-3">
              <Phone size={16} className="text-gray-400 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-gray-400 block uppercase">Telefone</span>
                <span className="text-xs font-semibold text-gray-700">{cliente.telefone}</span>
                {cliente.telefone_verificado_at ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-sm mt-1">
                    <ShieldCheck size={10} /> Verificado em {new Date(cliente.telefone_verificado_at).toLocaleDateString('pt-AO')}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-sm mt-1">
                    Não verificado
                  </span>
                )}
              </div>
            </div>
 
            <div className="flex items-start gap-3">
              <Calendar size={16} className="text-gray-400 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-gray-400 block uppercase">Membro Desde</span>
                <span className="text-xs font-semibold text-gray-700">
                  {new Date(cliente.created_at).toLocaleString('pt-AO', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
 
        {/* Client Profile Details */}
        <div className="bg-white border border-gray-100 rounded-sm p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 border-b border-gray-50 pb-2">
            Perfil de Cliente
          </h3>
 
          {cliente.cliente ? (
            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] font-bold text-gray-400 block uppercase">NIF</span>
                  <span className="text-xs font-semibold text-gray-700">{cliente.cliente.nif || 'Não informado'}</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-400 block uppercase">Tipo de Cliente</span>
                  <span className="text-xs font-semibold text-gray-700 capitalize">
                    {cliente.cliente.tipo_cliente === 'singular' ? 'Pessoa Singular' : cliente.cliente.tipo_cliente === 'coletivo' ? 'Pessoa Coletiva' : 'Não informado'}
                  </span>
                </div>
              </div>
 
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] font-bold text-gray-400 block uppercase">Gênero</span>
                  <span className="text-xs font-semibold text-gray-700 capitalize">
                    {cliente.cliente.genero === 'masculino' ? 'Masculino' : cliente.cliente.genero === 'feminino' ? 'Feminino' : 'Não informado'}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-400 block uppercase">Data Nascimento</span>
                  <span className="text-xs font-semibold text-gray-700">
                    {cliente.cliente.data_nascimento 
                      ? new Date(cliente.cliente.data_nascimento).toLocaleDateString('pt-AO')
                      : 'Não informada'}
                  </span>
                </div>
              </div>
 
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-gray-400 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-gray-400 block uppercase">Endereço</span>
                  <span className="text-xs font-semibold text-gray-700">
                    {[
                      cliente.cliente.provincia,
                      cliente.cliente.municipio,
                      cliente.cliente.bairro,
                      cliente.cliente.morada_detalhe
                    ].filter(Boolean).join(', ') || 'Nenhum endereço cadastrado'}
                  </span>
                </div>
              </div>
 
              <div className="flex items-start gap-3">
                <ClipboardList size={16} className="text-gray-400 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-gray-400 block uppercase">Serviços Solicitados</span>
                  <span className="text-sm font-black text-gray-900">
                    {cliente.cliente.total_servicos || 0} serviço(s) concluído(s)
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center text-gray-400 border border-dashed border-gray-100 rounded-sm">
              <Info size={24} className="mb-2" />
              <p className="text-xs font-medium">Esta conta de cliente não possui perfil de dados complementares preenchido no aplicativo.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
