'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Smartphone,
  ShieldCheck,
  Calendar,
  UserCheck,
  Star,
  Download,
  ArrowRight,
  Menu,
  X,
  Briefcase,
  Users,
  CheckCircle2,
  Bell,
  Search,
  Clock,
  ChevronRight,
  Sparkles,
  MapPin,
  TrendingUp,
  Lock,
} from 'lucide-react';
import iconLogo from '@/assets/images/icon3.png';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'clients' | 'pros'>('clients');
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-primary-200 selection:text-primary-900">
      
      {/* ── 1. HEADER / NAVBAR ────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-10 flex items-center justify-center bg-primary-700 rounded-xl p-1.5 shadow-md group-hover:scale-105 transition-transform">
              <Image
                src={iconLogo}
                alt="Formocosta Logo"
                className="w-full h-full object-contain brightness-0 invert"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Formo<span className="text-primary-700">costa</span>
              </span>
              <span className="text-[10px] text-primary-600 font-bold uppercase tracking-widest -mt-1">
                Mobile App
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#inicio" className="hover:text-primary-700 transition-colors">Início</a>
            <a href="#vantagens" className="hover:text-primary-700 transition-colors">Vantagens</a>
            <a href="#como-funciona" className="hover:text-primary-700 transition-colors">Como Funciona</a>
            <a href="#para-quem" className="hover:text-primary-700 transition-colors">Para Quem É</a>
            <a href="#depoimentos" className="hover:text-primary-700 transition-colors">Avaliações</a>
          </nav>

          {/* Header Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-semibold text-slate-700 hover:text-primary-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 border border-slate-200 hover:border-primary-300 bg-white"
            >
              Portal Backoffice
            </Link>
            
            <a
              href="#download"
              className="bg-primary-700 hover:bg-primary-800 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-95"
            >
              <Download size={16} />
              <span>Baixar App</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 shadow-lg animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-3 font-medium text-slate-700">
              <a
                href="#inicio"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-900 font-semibold"
              >
                Início
              </a>
              <a
                href="#vantagens"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-50"
              >
                Vantagens
              </a>
              <a
                href="#como-funciona"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-50"
              >
                Como Funciona
              </a>
              <a
                href="#para-quem"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-50"
              >
                Para Quem É
              </a>
              <a
                href="#depoimentos"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-50"
              >
                Avaliações
              </a>
            </nav>
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <Link
                href="/login"
                className="w-full text-center py-2.5 text-sm font-semibold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50"
              >
                Aceder ao Backoffice
              </Link>
              <a
                href="#download"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-semibold text-white bg-primary-700 rounded-xl shadow"
              >
                Baixar Aplicativo Móvel
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ── 2. HERO SECTION ───────────────────────────────────────────── */}
      <section id="inicio" className="relative pt-12 pb-20 lg:pt-16 lg:pb-32 overflow-hidden bg-gradient-to-b from-white via-primary-50/30 to-slate-50">
        
        {/* Background Decorative Elements */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none -z-10">
          <div className="absolute top-12 left-10 w-72 h-72 bg-primary-200/40 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero Header Content */}
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100/80 border border-primary-200 text-primary-800 text-xs sm:text-sm font-bold tracking-wide shadow-sm">
              <Sparkles size={14} className="text-primary-700 animate-pulse" />
              <span>O SEU APP DE SERVIÇOS & GESTÃO DE NEGÓCIOS</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Conecte Clientes & Profissionais <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-700 via-primary-600 to-emerald-500">Qualificados</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed">
              Encontre especialistas verificados, agende serviços instantaneamente ou expanda o seu negócio com uma gestão completa na palma da sua mão.
            </p>

            {/* Store Download Buttons & CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              
              {/* Google Play Button */}
              <a
                href="#download"
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-2xl flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all group active:scale-95 border border-slate-800"
              >
                <svg className="w-7 h-7 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] uppercase font-semibold text-slate-400 leading-none">Disponível no</div>
                  <div className="text-base font-bold text-white leading-tight">Google Play</div>
                </div>
              </a>

              {/* App Store Button */}
              <a
                href="#download"
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-2xl flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all group active:scale-95 border border-slate-800"
              >
                <svg className="w-7 h-7 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.64 1.35-.57.66-1.07 1.73-.93 2.76 1.01.08 2.03-.51 2.65-1.26z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] uppercase font-semibold text-slate-400 leading-none">Descarregar na</div>
                  <div className="text-base font-bold text-white leading-tight">App Store</div>
                </div>
              </a>

            </div>

            {/* Quick Ratings & Trust Indicator */}
            <div className="pt-2 flex items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-current" />
                  ))}
                </div>
                <span className="font-bold text-slate-800 ml-1">4.9/5</span>
              </div>
              <span className="text-slate-300">•</span>
              <span>+10.000 Downloads</span>
              <span className="text-slate-300">•</span>
              <span>Perfis 100% Verificados</span>
            </div>

          </div>

          {/* Hero Visual: Smartphone Mockup Trio */}
          <div className="mt-14 relative max-w-5xl mx-auto flex items-center justify-center">
            
            {/* Background Arc / Circle Accent */}
            <div className="absolute bottom-0 w-[80%] h-[320px] bg-gradient-to-t from-primary-700 to-primary-600 rounded-t-full shadow-2xl overflow-hidden -z-10" />

            {/* Smartphone Container Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end w-full max-w-4xl px-4 pt-8">
              
              {/* Left Smartphone Mockup (Para Profissionais) */}
              <div className="hidden md:block transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="bg-slate-900 p-3 rounded-[36px] shadow-2xl border-4 border-slate-800">
                  {/* Screen Content */}
                  <div className="bg-slate-50 rounded-[28px] p-4 text-xs space-y-3 min-h-[380px] overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="font-extrabold text-slate-800">Painel Profissional</span>
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px]">Online</span>
                    </div>
                    
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 space-y-1.5">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Ganhos Hoje</div>
                      <div className="text-lg font-black text-primary-700">45.000 Kz</div>
                      <div className="text-[10px] text-emerald-600 font-medium">↑ +18% esta semana</div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-[11px] font-bold text-slate-700">Próximos Agendamentos</div>
                      <div className="bg-white p-2.5 rounded-xl border border-slate-100 space-y-1">
                        <div className="flex justify-between font-semibold text-slate-800">
                          <span>Manutenção Elétrica</span>
                          <span className="text-primary-600 font-bold">14:30</span>
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1">
                          <MapPin size={10} /> Centralidade do Kilamba
                        </div>
                      </div>
                      
                      <div className="bg-white p-2.5 rounded-xl border border-slate-100 space-y-1">
                        <div className="flex justify-between font-semibold text-slate-800">
                          <span>Consulta Estética</span>
                          <span className="text-primary-600 font-bold">16:00</span>
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1">
                          <MapPin size={10} /> Talatona, Luanda
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center Main Smartphone Mockup (Para Clientes & Busca) */}
              <div className="transform md:-translate-y-4 hover:translate-y-0 transition-transform duration-500">
                <div className="bg-slate-900 p-3.5 rounded-[42px] shadow-2xl border-4 border-slate-800 ring-1 ring-white/20">
                  
                  {/* Speaker Notch */}
                  <div className="w-24 h-4 bg-slate-800 mx-auto rounded-b-xl mb-2" />

                  {/* Screen Content */}
                  <div className="bg-white rounded-[32px] p-4 text-xs space-y-3.5 min-h-[440px] shadow-inner">
                    
                    {/* Header bar in phone */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center">
                          FC
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-[11px]">Formocosta App</div>
                          <div className="text-[9px] text-slate-400">Olá, bem-vindo!</div>
                        </div>
                      </div>
                      <Bell size={16} className="text-slate-400" />
                    </div>

                    {/* Search Bar */}
                    <div className="bg-slate-100 rounded-xl px-3 py-2 flex items-center gap-2 text-slate-400">
                      <Search size={14} />
                      <span className="text-[11px]">Procurar eletricista, médico...</span>
                    </div>

                    {/* Quick Categories */}
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Categorias Populares</div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-primary-50 p-2 rounded-xl text-primary-800 font-medium text-[10px] border border-primary-100">
                          🛠️ Manutenção
                        </div>
                        <div className="bg-emerald-50 p-2 rounded-xl text-emerald-800 font-medium text-[10px] border border-emerald-100">
                          💇 Estética
                        </div>
                        <div className="bg-blue-50 p-2 rounded-xl text-blue-800 font-medium text-[10px] border border-blue-100">
                          🩺 Saúde
                        </div>
                      </div>
                    </div>

                    {/* Featured Specialist Card */}
                    <div className="bg-slate-900 text-white p-3 rounded-2xl space-y-2 shadow-md">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center font-bold text-white text-sm">
                          DR
                        </div>
                        <div>
                          <div className="font-bold text-[12px] flex items-center gap-1">
                            Dr. Manuel Silva <ShieldCheck size={12} className="text-emerald-400" />
                          </div>
                          <div className="text-[10px] text-slate-300">Fisioterapeuta Verificado</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[10px] border-t border-slate-800 pt-2 text-slate-300">
                        <div className="flex items-center gap-1 text-amber-400 font-bold">
                          ★ 4.9 (128 avaliações)
                        </div>
                        <button className="bg-primary-600 hover:bg-primary-500 text-white px-3 py-1 rounded-lg font-bold text-[10px]">
                          Agendar
                        </button>
                      </div>
                    </div>

                    {/* Bottom Nav Bar in phone */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-around text-slate-400">
                      <div className="text-primary-700 font-bold flex flex-col items-center">
                        <Search size={16} />
                        <span className="text-[8px]">Início</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Calendar size={16} />
                        <span className="text-[8px]">Agenda</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Users size={16} />
                        <span className="text-[8px]">Perfil</span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Right Smartphone Mockup (Notificações & Confirmados) */}
              <div className="hidden md:block transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="bg-slate-900 p-3 rounded-[36px] shadow-2xl border-4 border-slate-800">
                  {/* Screen Content */}
                  <div className="bg-slate-50 rounded-[28px] p-4 text-xs space-y-3 min-h-[380px]">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="font-extrabold text-slate-800">Notificações</span>
                      <span className="text-[10px] text-slate-400">Agora</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex gap-2">
                      <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-slate-800 text-[11px]">Agendamento Confirmado!</div>
                        <div className="text-[10px] text-slate-500">O seu serviço de climatização foi agendado para amanhã às 09:00.</div>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex gap-2">
                      <Star size={18} className="text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-slate-800 text-[11px]">Nova Avaliação 5★</div>
                        <div className="text-[10px] text-slate-500">"Excelente profissional, muito pontual e atencioso."</div>
                      </div>
                    </div>

                    <div className="bg-emerald-900 text-white p-3 rounded-xl space-y-1">
                      <div className="text-[10px] text-emerald-300 font-bold">Dica Formocosta</div>
                      <div className="text-[10px] leading-relaxed">Mantenha as suas notificações ativas para nunca perder um pedido de serviço.</div>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Ticker / Highlights Bar */}
          <div className="mt-16 bg-primary-800 text-white rounded-2xl p-4 shadow-xl border border-primary-700 max-w-5xl mx-auto">
            <div className="flex flex-wrap items-center justify-around gap-4 text-xs sm:text-sm font-bold tracking-wide text-center">
              <span className="flex items-center gap-2">
                <span className="text-primary-300">✦</span> Conexão Direta & Rápida
              </span>
              <span className="flex items-center gap-2">
                <span className="text-primary-300">✦</span> Profissionais Verificados
              </span>
              <span className="flex items-center gap-2">
                <span className="text-primary-300">✦</span> Agendamento 24/7
              </span>
              <span className="flex items-center gap-2">
                <span className="text-primary-300">✦</span> Avaliações Autênticas
              </span>
              <span className="flex items-center gap-2">
                <span className="text-primary-300">✦</span> Gestão Simplificada
              </span>
            </div>
          </div>

        </div>
      </section>


      {/* ── 3. BENEFITS SECTION ("VANTAGENS DO APP") ───────────────────── */}
      <section id="vantagens" className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <div className="inline-block px-3.5 py-1 rounded-full bg-primary-100 text-primary-800 text-xs font-bold uppercase tracking-wider">
              PORQUÊ ESCOLHER O FORMOCOSTA
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Benefícios Pensados para Clientes e Profissionais
            </h2>
            <p className="text-slate-600 text-base">
              A nossa plataforma elimina barreiras, garantindo transparência, pontualidade e uma experiência sem complicações.
            </p>
          </div>

          {/* Feature Grid with Central Smartphone Representation */}
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
            
            {/* Left Column Features */}
            <div className="space-y-8">
              
              {/* Feature 1 */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative group">
                <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center mb-4 font-bold group-hover:scale-110 transition-transform">
                  <UserCheck size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Busca & Profissionais Verificados</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Encontre especialistas credenciados em diversas áreas com perfis detalhados e avaliações autênticas de utilizadores.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative group">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 font-bold group-hover:scale-110 transition-transform">
                  <Calendar size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Agendamento Fácil & Flexível</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Marque atendimentos para a data e hora mais convenientes sem necessidade de chamadas telefónicas demoradas.
                </p>
              </div>

            </div>

            {/* Center Phone Display (As in Reference Image) */}
            <div className="flex justify-center my-4 lg:my-0">
              <div className="bg-slate-900 p-4 rounded-[40px] shadow-2xl border-4 border-slate-800 max-w-[280px] w-full">
                <div className="bg-primary-700 rounded-[30px] p-5 text-white text-center space-y-4 min-h-[400px] flex flex-col justify-between">
                  <div className="pt-4">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl mx-auto flex items-center justify-center mb-3">
                      <Smartphone size={32} className="text-white" />
                    </div>
                    <div className="text-xs uppercase tracking-widest text-primary-200 font-bold">App Formocosta</div>
                    <div className="text-xl font-black mt-1">Solução Tudo-em-Um</div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-left space-y-2 border border-white/10">
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <CheckCircle2 size={16} className="text-primary-300" /> Clientes Satisfeitos
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <CheckCircle2 size={16} className="text-primary-300" /> Profissionais Ativos
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <CheckCircle2 size={16} className="text-primary-300" /> Notificações Diretas
                    </div>
                  </div>

                  <div className="pb-2">
                    <a href="#download" className="block w-full py-2.5 bg-white text-primary-800 font-bold text-xs rounded-xl shadow hover:bg-slate-100 transition-colors">
                      Explorar no App
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column Features */}
            <div className="space-y-8">
              
              {/* Feature 3 */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative group">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4 font-bold group-hover:scale-110 transition-transform">
                  <Briefcase size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Gestão Completa de Negócio</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Para os prestadores de serviço: organize o seu calendário, acompanhe novos clientes e controle a evolução da sua atividade.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative group">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 font-bold group-hover:scale-110 transition-transform">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Segurança & Padrão de Qualidade</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Garantia de comunicação transparente, acompanhamento de histórico e feedback em tempo real após a prestação do serviço.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ── 4. HOW IT WORKS SECTION ("COMO FUNCIONA") ─────────────────── */}
      <section id="como-funciona" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <div className="inline-block px-3.5 py-1 rounded-full bg-primary-100 text-primary-800 text-xs font-bold uppercase tracking-wider">
              PASSO A PASSO
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Como Funciona a Aplicação Formocosta?
            </h2>
            <p className="text-slate-600 text-base">
              Em apenas três passos simples, está pronto para agendar ou oferecer serviços com total praticidade.
            </p>
          </div>

          {/* 3 Step Cards */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all relative">
              <div className="w-10 h-10 rounded-full bg-primary-700 text-white font-black text-sm flex items-center justify-center mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Baixe a App & Crie Conta</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Descarregue a aplicação gratuitamente na Play Store ou App Store e conclua o seu registo em menos de 2 minutos.
              </p>
              <div className="flex items-center text-xs font-bold text-primary-700 gap-1">
                <span>Disponível para iOS e Android</span>
                <ChevronRight size={14} />
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all relative">
              <div className="w-10 h-10 rounded-full bg-primary-700 text-white font-black text-sm flex items-center justify-center mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Pesquise ou Registe Serviços</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Encontre o especialista ideal filtrando por categoria e localização, ou publique a sua oferta profissional.
              </p>
              <div className="flex items-center text-xs font-bold text-primary-700 gap-1">
                <span>Filtros avançados e categorias</span>
                <ChevronRight size={14} />
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all relative">
              <div className="w-10 h-10 rounded-full bg-primary-700 text-white font-black text-sm flex items-center justify-center mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Agende & Acompanhe tudo</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Confirme o agendamento e receba lembretes automáticos e notificações do estado do serviço diretamente na app.
              </p>
              <div className="flex items-center text-xs font-bold text-primary-700 gap-1">
                <span>Notificações em tempo real</span>
                <ChevronRight size={14} />
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ── 5. DUAL AUDIENCE TABBED SECTION ("PARA QUEM É") ────────────── */}
      <section id="para-quem" className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <div className="inline-block px-3.5 py-1 rounded-full bg-primary-100 text-primary-800 text-xs font-bold uppercase tracking-wider">
              UMA PLATAFORMA, DUAS SOLUÇÕES
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Feito para Quem Procura e para Quem Oferece
            </h2>
          </div>

          {/* Interactive Audience Switcher */}
          <div className="mt-10 flex justify-center">
            <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab('clients')}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                  activeTab === 'clients'
                    ? 'bg-primary-700 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users size={16} />
                <span>Para Clientes</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('pros')}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                  activeTab === 'pros'
                    ? 'bg-primary-700 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Briefcase size={16} />
                <span>Para Profissionais</span>
              </button>
            </div>
          </div>

          {/* Tab Content Display */}
          <div className="mt-12 max-w-4xl mx-auto bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm">
            {activeTab === 'clients' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-slate-900">
                    A forma mais fácil de resolver as suas necessidades diárias
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3 text-slate-700 text-sm">
                      <CheckCircle2 size={18} className="text-primary-700 shrink-0 mt-0.5" />
                      <span><strong>Acesso a Profissionais Credenciados:</strong> Todos os perfis passam por validação.</span>
                    </li>
                    <li className="flex items-start gap-3 text-slate-700 text-sm">
                      <CheckCircle2 size={18} className="text-primary-700 shrink-0 mt-0.5" />
                      <span><strong>Agendamento em Tempo Real:</strong> Escolha horários livres diretamente na agenda do profissional.</span>
                    </li>
                    <li className="flex items-start gap-3 text-slate-700 text-sm">
                      <CheckCircle2 size={18} className="text-primary-700 shrink-0 mt-0.5" />
                      <span><strong>Transparência de Preços:</strong> Saiba exatamente quanto vai pagar antes de confirmar.</span>
                    </li>
                  </ul>
                  <a
                    href="#download"
                    className="inline-flex items-center gap-2 text-sm font-bold text-primary-700 hover:text-primary-800"
                  >
                    <span>Comece a procurar serviços agora</span>
                    <ArrowRight size={16} />
                  </a>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-inner space-y-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">O que você ganha como cliente</div>
                  <div className="space-y-3">
                    <div className="p-3 bg-primary-50 rounded-xl flex items-center justify-between">
                      <span className="text-xs font-bold text-primary-900">Economia de Tempo</span>
                      <span className="text-xs font-black text-primary-700">100% Digital</span>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-xl flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-900">Histórico de Atendimentos</span>
                      <span className="text-xs font-black text-emerald-700">Organizado</span>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-xl flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-900">Suporte Dedicado</span>
                      <span className="text-xs font-black text-blue-700">Sempre Ativo</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-slate-900">
                    Ferramentas profissionais para fazer o seu negócio crescer
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3 text-slate-700 text-sm">
                      <CheckCircle2 size={18} className="text-primary-700 shrink-0 mt-0.5" />
                      <span><strong>Visibilidade Ampliada:</strong> Seja encontrado por centenas de novos clientes na sua zona.</span>
                    </li>
                    <li className="flex items-start gap-3 text-slate-700 text-sm">
                      <CheckCircle2 size={18} className="text-primary-700 shrink-0 mt-0.5" />
                      <span><strong>Gestão de Agenda Automática:</strong> Defina os seus horários e evite sobreposição de compromissos.</span>
                    </li>
                    <li className="flex items-start gap-3 text-slate-700 text-sm">
                      <CheckCircle2 size={18} className="text-primary-700 shrink-0 mt-0.5" />
                      <span><strong>Aumento de Faturação:</strong> Ferramentas completas para controlar rendimentos e pedidos.</span>
                    </li>
                  </ul>
                  <a
                    href="#download"
                    className="inline-flex items-center gap-2 text-sm font-bold text-primary-700 hover:text-primary-800"
                  >
                    <span>Cadastre o seu perfil profissional</span>
                    <ArrowRight size={16} />
                  </a>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-inner space-y-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">O que você ganha como profissional</div>
                  <div className="space-y-3">
                    <div className="p-3 bg-primary-50 rounded-xl flex items-center justify-between">
                      <span className="text-xs font-bold text-primary-900">Mais Clientes Mensais</span>
                      <span className="text-xs font-black text-primary-700">Crescimento</span>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-xl flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-900">Controlo de Agenda</span>
                      <span className="text-xs font-black text-emerald-700">Sem Faltas</span>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-xl flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-900">Reputação de Marca</span>
                      <span className="text-xs font-black text-amber-700">Avaliações 5★</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>


      {/* ── 6. TESTIMONIALS SECTION ("DEPOIMENTOS") ──────────────────── */}
      <section id="depoimentos" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <div className="inline-block px-3.5 py-1 rounded-full bg-primary-100 text-primary-800 text-xs font-bold uppercase tracking-wider">
              AVALIAÇÕES REAIS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              O que Dizem Nossos Utilizadores
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-current" />
                ))}
              </div>
              <p className="text-slate-600 text-sm italic leading-relaxed">
                "Encontrar um eletricista de confiança era um desafio constante. Com a app Formocosta, agendei em minutos e o serviço foi impecável."
              </p>
              <div className="pt-2 flex items-center gap-3 border-t border-slate-100">
                <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-xs">
                  AM
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs">Ana Maria</div>
                  <div className="text-[10px] text-slate-400">Cliente em Luanda</div>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-current" />
                ))}
              </div>
              <p className="text-slate-600 text-sm italic leading-relaxed">
                "Desde que me registei como prestador de serviços na Formocosta, a minha carteira de clientes duplicou. A gestão da agenda é fantástica."
              </p>
              <div className="pt-2 flex items-center gap-3 border-t border-slate-100">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs">
                  CB
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs">Carlos Bernardo</div>
                  <div className="text-[10px] text-slate-400">Técnico de Climatização</div>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-current" />
                ))}
              </div>
              <p className="text-slate-600 text-sm italic leading-relaxed">
                "A transparência e as avaliações reais dão-me total segurança antes de contratar qualquer profissional para a minha casa."
              </p>
              <div className="pt-2 flex items-center gap-3 border-t border-slate-100">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                  VS
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs">Valdemar Sousa</div>
                  <div className="text-[10px] text-slate-400">Cliente Frequente</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ── 7. DOWNLOAD APP CTA BANNER ────────────────────────────────── */}
      <section id="download" className="py-20 bg-primary-900 text-white relative overflow-hidden">
        
        {/* Background Decorative Circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-700/40 rounded-full blur-3xl -z-0" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl -z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-gradient-to-r from-primary-800 to-primary-900 rounded-3xl p-8 sm:p-14 border border-primary-700/50 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-10">
            
            {/* CTA Text */}
            <div className="space-y-6 max-w-xl">
              <span className="px-3.5 py-1.5 rounded-full bg-primary-700 text-primary-200 font-bold text-xs uppercase tracking-wider border border-primary-600">
                Disponível Agora
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Experimente a App Formocosta Hoje Mesmo
              </h2>
              <p className="text-primary-100 text-base sm:text-lg leading-relaxed">
                Descarregue gratuitamente e tenha o melhor catálogo de serviços e profissionais qualificados sempre à mão.
              </p>
              
              {/* Store Buttons */}
              <div className="pt-2 flex flex-wrap gap-4">
                
                <a
                  href="#"
                  className="bg-white text-slate-900 hover:bg-slate-100 px-6 py-3.5 rounded-2xl flex items-center gap-3 shadow-lg transition-all font-bold text-sm"
                >
                  <svg className="w-6 h-6 fill-current text-primary-700" viewBox="0 0 24 24">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                  </svg>
                  <span>Google Play</span>
                </a>

                <a
                  href="#"
                  className="bg-white text-slate-900 hover:bg-slate-100 px-6 py-3.5 rounded-2xl flex items-center gap-3 shadow-lg transition-all font-bold text-sm"
                >
                  <svg className="w-6 h-6 fill-current text-primary-700" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.64 1.35-.57.66-1.07 1.73-.93 2.76 1.01.08 2.03-.51 2.65-1.26z" />
                  </svg>
                  <span>App Store</span>
                </a>

              </div>
            </div>

            {/* QR Code / App Preview Graphic */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 flex flex-col items-center text-center space-y-3">
              <div className="w-32 h-32 bg-white rounded-2xl p-2 shadow-inner flex items-center justify-center">
                <div className="w-full h-full border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400">
                  <Smartphone size={32} className="text-primary-700 mb-1" />
                  <span className="text-[9px] font-bold text-slate-600">QR CODE APP</span>
                </div>
              </div>
              <span className="text-xs text-primary-100 font-medium">Aponte a câmara do telemóvel para descarregar</span>
            </div>

          </div>
        </div>
      </section>


      {/* ── 8. FOOTER ─────────────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            
            {/* Brand column */}
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-9 flex items-center justify-center bg-primary-700 rounded-xl p-1 shadow-md">
                  <Image
                    src={iconLogo}
                    alt="Formocosta Logo"
                    className="w-full h-full object-contain brightness-0 invert"
                  />
                </div>
                <span className="font-extrabold text-xl text-white tracking-tight">
                  Formo<span className="text-primary-500">costa</span>
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Conectamos clientes e profissionais com segurança, eficiência e controlo total.
              </p>
            </div>

            {/* Links column 1 */}
            <div className="space-y-3">
              <div className="text-white font-bold text-xs uppercase tracking-wider">Navegação</div>
              <ul className="space-y-2 text-xs">
                <li><a href="#inicio" className="hover:text-white transition-colors">Início</a></li>
                <li><a href="#vantagens" className="hover:text-white transition-colors">Vantagens</a></li>
                <li><a href="#como-funciona" className="hover:text-white transition-colors">Como Funciona</a></li>
                <li><a href="#para-quem" className="hover:text-white transition-colors">Para Quem É</a></li>
              </ul>
            </div>

            {/* Links column 2 */}
            <div className="space-y-3">
              <div className="text-white font-bold text-xs uppercase tracking-wider">Portais</div>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/login" className="text-primary-400 font-semibold hover:underline">
                    Portal Backoffice / Gestão →
                  </Link>
                </li>
                <li><a href="#download" className="hover:text-white transition-colors">App Android (Play Store)</a></li>
                <li><a href="#download" className="hover:text-white transition-colors">App iOS (App Store)</a></li>
              </ul>
            </div>

            {/* Support column */}
            <div className="space-y-3">
              <div className="text-white font-bold text-xs uppercase tracking-wider">Suporte & Contacto</div>
              <p className="text-xs text-slate-400">
                Dúvidas ou suporte técnico? Entre em contacto com a nossa equipa.
              </p>
              <div className="text-xs font-semibold text-white">
                suporte@formocosta.com
              </div>
            </div>

          </div>

          <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div>
              © {new Date().getFullYear()} Formocosta. Todos os direitos reservados.
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-slate-400 transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-slate-400 transition-colors">Política de Privacidade</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
