'use client';

import { useEffect, useState } from 'react';
import {
  HelpCircle,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  BookOpen,
  LifeBuoy,
  MessageSquare
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Input } from '@/components/common/form/Input';
import { Button } from '@/components/common/form/Button';
import { DefinicoesService, SuporteInfo } from '@/service/definicoes.service';

export default function SuportePage() {
  const [suporteInfo, setSuporteInfo] = useState<SuporteInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Form states
  const [assunto, setAssunto] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [sending, setSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadSuporte() {
      try {
        setLoading(true);
        const data = await DefinicoesService.getSuporteInfo();
        setSuporteInfo(data);
      } catch (err) {
        console.error('Erro ao carregar dados de suporte:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSuporte();
  }, []);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assunto.trim() || !mensagem.trim()) {
      setErrorMsg('Por favor preencha todos os campos da mensagem.');
      return;
    }

    try {
      setSending(true);
      setErrorMsg(null);
      const res = await DefinicoesService.enviarMensagemSuporte({ assunto, mensagem });
      setSuccessMsg(res.message || 'Ticket de suporte enviado com sucesso! Responderemos em breve.');
      setAssunto('');
      setMensagem('');
      setTimeout(() => setSuccessMsg(null), 6000);
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || 'Falha ao enviar mensagem de suporte.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Suporte Técnico & Central de Ajuda"
        description="Consulte dúvidas frequentes ou solicite apoio direto à equipa técnica do Formocosta"
      />

      {loading ? (
        <div className="bg-white rounded-md p-12 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-2 border-[#42b883] border-t-transparent rounded-md animate-spin" />
          <p className="text-sm text-gray-500 mt-4 font-medium">A carregar suporte...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Quick Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-md border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex items-start gap-4">
              <div className="p-3 bg-emerald-50 text-[#42b883] rounded-md shrink-0">
                <Phone size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">Atendimento Telefónico</h4>
                <p className="text-sm font-bold text-gray-900">
                  {suporteInfo?.contacto_emergencia.telefone || '+244 923 000 000'}
                </p>
                <p className="text-[11px] text-gray-500 font-medium">Linha direta para urgências operacionais</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-md border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex items-start gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-md shrink-0">
                <Mail size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">E-mail de Suporte</h4>
                <p className="text-sm font-bold text-gray-900">
                  {suporteInfo?.contacto_emergencia.email || 'suporte@formocosta.ao'}
                </p>
                <p className="text-[11px] text-gray-500 font-medium">Resposta em menos de 24 horas úteis</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-md border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex items-start gap-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-md shrink-0">
                <Clock size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">Horário de Funcionamento</h4>
                <p className="text-sm font-bold text-gray-900">
                  {suporteInfo?.contacto_emergencia.horario || 'Seg - Sex: 08:00 - 18:00'}
                </p>
                <p className="text-[11px] text-gray-500 font-medium">Dias úteis no fuso de Luanda (GMT+1)</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* FAQ Accordion Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white p-6 rounded-md border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 border-b border-gray-50 pb-3 flex items-center gap-2">
                  <BookOpen size={16} className="text-[#42b883]" />
                  Perguntas Frequentes (FAQ)
                </h3>

                <div className="space-y-3">
                  {suporteInfo?.faqs && suporteInfo.faqs.length > 0 ? (
                    suporteInfo.faqs.map((faq, index) => {
                      const isOpen = openFaqIndex === index;
                      return (
                        <div
                          key={index}
                          className="border border-gray-100 rounded-md overflow-hidden transition-all bg-gray-50/50"
                        >
                          <button
                            onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                            className="w-full p-4 text-left font-bold text-xs sm:text-sm text-gray-900 flex items-center justify-between gap-3 hover:bg-gray-100/50 transition-colors"
                          >
                            <span className="flex items-center gap-2">
                              <HelpCircle size={16} className="text-[#42b883] shrink-0" />
                              {faq.pergunta}
                            </span>
                            {isOpen ? (
                              <ChevronUp size={16} className="text-gray-400 shrink-0" />
                            ) : (
                              <ChevronDown size={16} className="text-gray-400 shrink-0" />
                            )}
                          </button>
                          {isOpen && (
                            <div className="p-4 pt-0 text-xs text-gray-600 font-medium leading-relaxed border-t border-gray-100/80 bg-white">
                              {faq.resposta}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-gray-500">Sem perguntas frequentes registadas.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Support Ticket Form Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white p-6 rounded-md border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 border-b border-gray-50 pb-3 flex items-center gap-2">
                  <MessageSquare size={16} className="text-[#42b883]" />
                  Enviar Mensagem ao Suporte
                </h3>

                {successMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    {successMsg}
                  </div>
                )}

                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-xs font-bold">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmitTicket} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Assunto do Pedido
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Dúvida sobre repasse de pagamento"
                      value={assunto}
                      onChange={(e) => setAssunto(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-xs focus:ring-[#42b883] focus:border-[#42b883] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Descrição Detalhada
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Descreva detalhadamente a sua questão ou o problema encontrado..."
                      value={mensagem}
                      onChange={(e) => setMensagem(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-xs focus:ring-[#42b883] focus:border-[#42b883] outline-none resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={sending}
                    className="w-full bg-[#42b883] hover:bg-[#3aa374] font-bold text-xs rounded-md shadow-sm py-2.5"
                    leftIcon={<Send size={14} />}
                  >
                    Submeter Ticket
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
