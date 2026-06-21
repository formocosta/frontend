'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Menu, X, ChevronRight, Star, Shield, Clock, CheckCircle,
  ArrowRight, Users, MapPin, Globe, Camera, Briefcase,
  MessageCircle, Zap, TrendingUp, Award, BadgeCheck,
  Wrench, Droplets, Leaf, Hammer, Bug,
  Home as HomeIcon, CreditCard, Search, Headphones,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// Brand
// ─────────────────────────────────────────────────────────────

function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 select-none group">
      <div className="w-8 h-8 bg-[#06241C] rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#0a3529] transition-colors shadow-sm shadow-green-900/30">
        <span className="text-white font-black text-[15px] tracking-tight">F</span>
      </div>
      <span className={`font-bold text-[17px] tracking-tight leading-none ${light ? 'text-white' : 'text-slate-900'}`}>
        Formocosta
      </span>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────
// Navbar
// ─────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { href: '#inicio',        label: 'Início' },
  { href: '#como-funciona', label: 'Como Funciona' },
  { href: '#servicos',      label: 'Serviços' },
  { href: '#prestadores',   label: 'Prestadores' },
  { href: '#contacto',      label: 'Contacto' },
];

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const go = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">

            <Logo light={!scrolled} />

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-0.5">
              {NAV_LINKS.map(l => (
                <button
                  key={l.href}
                  onClick={() => go(l.href)}
                  className={`px-3.5 py-2 text-[13px] font-medium rounded-lg transition-all cursor-pointer ${
                    scrolled
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      : 'text-white/75 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </nav>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className={`text-[13px] font-semibold px-4 py-2 rounded-xl transition-all ${
                  scrolled
                    ? 'text-slate-700 hover:bg-slate-100'
                    : 'text-white/85 hover:text-white hover:bg-white/10'
                }`}
              >
                Entrar
              </Link>
              <Link
                href="/login"
                className="text-[13px] font-bold px-5 py-2.5 bg-[#06241C] hover:bg-[#0a3529] text-white rounded-xl transition-all shadow-sm shadow-green-900/25 hover:shadow-green-900/30 hover:shadow-md active:scale-[0.97]"
              >
                Contratar Serviço
              </Link>
            </div>

            {/* Mobile burger */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className={`md:hidden w-9 h-9 flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                scrolled
                  ? 'text-slate-700 hover:bg-slate-100'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div className={`fixed inset-0 z-40 flex flex-col bg-white transition-all duration-300 md:hidden ${
        mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="flex items-center h-16 px-4 border-b border-slate-100">
          <Logo />
          <button onClick={() => setMobileOpen(false)} className="ml-auto w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 cursor-pointer">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-1">
          {NAV_LINKS.map(l => (
            <button
              key={l.href}
              onClick={() => go(l.href)}
              className="w-full flex items-center justify-between px-4 py-3.5 text-[15px] font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
            >
              {l.label}
              <ChevronRight size={16} className="text-slate-300" />
            </button>
          ))}
        </div>
        <div className="p-5 border-t border-slate-100 space-y-3">
          <Link href="/login" onClick={() => setMobileOpen(false)} className="block text-center py-3.5 text-[14px] font-semibold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            Entrar
          </Link>
          <Link href="/login" onClick={() => setMobileOpen(false)} className="block text-center py-3.5 text-[14px] font-bold text-white bg-[#06241C] hover:bg-[#0a3529] rounded-xl transition-colors shadow-sm">
            Contratar Serviço
          </Link>
          <Link href="/login" onClick={() => setMobileOpen(false)} className="block text-center py-3.5 text-[14px] font-bold text-[#06241C] bg-green-50 hover:bg-green-100 rounded-xl transition-colors">
            Tornar-me Prestador →
          </Link>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #06241C 0%, #0c3d2c 50%, #06241C 100%)' }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }}
      />
      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-700/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-0 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: copy */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 backdrop-blur-sm text-white/80 text-xs font-semibold px-3.5 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Plataforma líder em Angola
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black text-white leading-[1.08] tracking-tight">
                Encontre profissionais{' '}
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #4ade80, #86efac)' }}>
                  de confiança
                </span>
                {' '}para qualquer serviço.
              </h1>
              <p className="text-lg text-white/60 leading-relaxed max-w-xl font-medium">
                Solicite serviços, acompanhe o processo e pague com segurança numa única plataforma.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-[15px] rounded-2xl transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-400/35 hover:shadow-xl active:scale-[0.97] group"
              >
                Contratar Serviço
                <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white/10 hover:bg-white/15 text-white font-bold text-[15px] rounded-2xl border border-white/20 hover:border-white/30 transition-all backdrop-blur-sm active:scale-[0.97]"
              >
                Tornar-me Prestador
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <Shield size={15} className="text-emerald-400" />
                <span>Pagamentos seguros</span>
              </div>
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <BadgeCheck size={15} className="text-emerald-400" />
                <span>Prestadores verificados</span>
              </div>
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <Headphones size={15} className="text-emerald-400" />
                <span>Suporte 24/7</span>
              </div>
            </div>
          </div>

          {/* Right: app illustration */}
          <div className="relative hidden lg:block">
            <div className="relative w-full max-w-[420px] mx-auto">

              {/* Card 1 — Serviço confirmado */}
              <div className="bg-white rounded-2xl shadow-2xl p-5 mb-4 animate-float">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
                    <CheckCircle size={22} className="text-emerald-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Serviço confirmado</p>
                    <p className="text-sm font-bold text-slate-800 truncate">Limpeza doméstica</p>
                  </div>
                  <span className="shrink-0 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg">Pago</span>
                </div>
                <div className="mt-3.5 flex items-center justify-between border-t border-slate-50 pt-3">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => <Star key={i} size={12} className="text-amber-400 fill-amber-400" />)}
                    <span className="text-xs text-slate-500 ml-1.5 font-medium">5.0</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#06241C] flex items-center justify-center text-white text-[10px] font-bold">AM</div>
                    <span className="text-xs text-slate-500">António M.</span>
                  </div>
                </div>
              </div>

              {/* Card 2 — Prestador */}
              <div className="bg-white rounded-2xl shadow-2xl p-5 animate-float-delayed">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3.5">Prestador disponível agora</p>
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#06241C] to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
                    MR
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800">Manuel Rodrigues</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-slate-500">Canalizador</span>
                      <span className="text-slate-200">·</span>
                      <div className="flex items-center gap-1">
                        <Star size={11} className="text-amber-400 fill-amber-400" />
                        <span className="text-[11px] font-semibold text-slate-600">4.9</span>
                      </div>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-lg shrink-0">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />Disponível
                  </span>
                </div>
                <div className="mt-3.5 grid grid-cols-2 gap-2">
                  <button className="text-[12px] font-bold bg-[#06241C] text-white py-2.5 rounded-xl cursor-default">Contratar</button>
                  <button className="text-[12px] font-bold bg-slate-100 text-slate-700 py-2.5 rounded-xl cursor-default">Ver perfil</button>
                </div>
              </div>

              {/* Floating stat — bottom left */}
              <div className="absolute -bottom-5 -left-8 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 border border-slate-100">
                <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                  <TrendingUp size={17} className="text-[#06241C]" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800">+1.247</p>
                  <p className="text-[10px] text-slate-400 font-medium leading-tight">serviços este mês</p>
                </div>
              </div>

              {/* Floating badge — top right */}
              <div className="absolute -top-5 -right-6 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 border border-slate-100">
                <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                  <Award size={17} className="text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800">4.9 ★</p>
                  <p className="text-[10px] text-slate-400 font-medium leading-tight">média geral</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60L480 20L960 45L1440 0V60H0Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Stats bar
// ─────────────────────────────────────────────────────────────

const STATS = [
  { value: '+12.000', label: 'Serviços concluídos',    icon: <CheckCircle size={20} className="text-[#06241C]" /> },
  { value: '+850',    label: 'Prestadores verificados', icon: <BadgeCheck size={20} className="text-emerald-600" /> },
  { value: '4.9 ★',  label: 'Avaliação média',         icon: <Star size={20} className="text-amber-500" /> },
  { value: '18',      label: 'Províncias cobertas',     icon: <MapPin size={20} className="text-teal-600" /> },
];

function StatsBar() {
  return (
    <section className="bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
          {STATS.map(s => (
            <div key={s.label} className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                {s.icon}
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-500 font-medium leading-tight mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// How it Works
// ─────────────────────────────────────────────────────────────

const HOW_CLIENTS = [
  { step: '01', icon: <Search size={22} />,    title: 'Pesquise o serviço',    desc: 'Escolha o tipo de serviço que precisa e a localização. Encontramos os melhores prestadores disponíveis.' },
  { step: '02', icon: <Users size={22} />,     title: 'Escolha o prestador',   desc: 'Compare perfis, avaliações e preços. Selecione o profissional que melhor se adapta às suas necessidades.' },
  { step: '03', icon: <CreditCard size={22} />,title: 'Pague com segurança',   desc: 'Pagamento protegido na plataforma. O valor só é liberado após a conclusão satisfatória do serviço.' },
];

const HOW_PROVIDERS = [
  { step: '01', icon: <BadgeCheck size={22} />, title: 'Registe-se e verifique',   desc: 'Crie o seu perfil profissional e passe pelo processo de verificação de identidade e competências.' },
  { step: '02', icon: <Zap size={22} />,         title: 'Receba solicitações',     desc: 'Seja notificado sobre oportunidades de trabalho próximas de si e aceite as que lhe interessam.' },
  { step: '03', icon: <TrendingUp size={22} />,  title: 'Faça crescer o negócio', desc: 'Conclua serviços, receba avaliações positivas e aumente a sua visibilidade e rendimento.' },
];

function HowItWorks() {
  const [tab, setTab] = useState<'clientes' | 'prestadores'>('clientes');
  const steps = tab === 'clientes' ? HOW_CLIENTS : HOW_PROVIDERS;

  return (
    <section id="como-funciona" className="bg-slate-50 py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block text-[11px] font-bold text-[#06241C] bg-green-50 border border-green-100 px-3 py-1 rounded-full uppercase tracking-widest mb-4">Como funciona</span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Simples, rápido e seguro
          </h2>
          <p className="mt-4 text-slate-500 text-base leading-relaxed">
            Da solicitação ao pagamento, todo o processo é gerido na nossa plataforma.
          </p>
        </div>

        {/* Tab toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm">
            {(['clientes', 'prestadores'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all cursor-pointer capitalize ${
                  tab === t
                    ? 'bg-[#06241C] text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Para {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((s, i) => (
            <div key={s.step} className="relative group">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[calc(50%+40px)] right-[-40px] h-px bg-gradient-to-r from-slate-200 to-transparent pointer-events-none" />
              )}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-green-50 border border-green-100 rounded-2xl flex items-center justify-center text-[#06241C] group-hover:bg-[#06241C] group-hover:text-white group-hover:border-[#06241C] transition-all duration-300 shrink-0">
                    {s.icon}
                  </div>
                  <span className="text-4xl font-black text-slate-100 leading-none select-none">{s.step}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Services grid
// ─────────────────────────────────────────────────────────────

const SERVICES = [
  { icon: <HomeIcon size={26} />, label: 'Limpeza',            count: '213 prestadores', color: 'text-emerald-700', bg: 'bg-emerald-50 group-hover:bg-[#06241C]' },
  { icon: <Droplets size={26} />, label: 'Canalização',        count: '148 prestadores', color: 'text-teal-600',    bg: 'bg-teal-50 group-hover:bg-teal-600' },
  { icon: <Zap size={26} />,      label: 'Eletricidade',       count: '187 prestadores', color: 'text-amber-500',   bg: 'bg-amber-50 group-hover:bg-amber-500' },
  { icon: <Leaf size={26} />,     label: 'Jardinagem',         count: '94 prestadores',  color: 'text-green-600',   bg: 'bg-green-50 group-hover:bg-green-600' },
  { icon: <Hammer size={26} />,   label: 'Obras',              count: '162 prestadores', color: 'text-orange-600',  bg: 'bg-orange-50 group-hover:bg-orange-600' },
  { icon: <Bug size={26} />,      label: 'Controlo de Pragas', count: '47 prestadores',  color: 'text-rose-600',    bg: 'bg-rose-50 group-hover:bg-rose-600' },
];

function ServicesGrid() {
  return (
    <section id="servicos" className="bg-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block text-[11px] font-bold text-[#06241C] bg-green-50 border border-green-100 px-3 py-1 rounded-full uppercase tracking-widest mb-4">Serviços</span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            O profissional certo para cada necessidade
          </h2>
          <p className="mt-4 text-slate-500 text-base leading-relaxed">
            Categorias de serviço com prestadores verificados e disponíveis na sua região.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
          {SERVICES.map(s => (
            <Link
              key={s.label}
              href="/login"
              className="group relative bg-white border border-slate-200 hover:border-green-200 rounded-3xl p-6 lg:p-8 flex flex-col items-start gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer overflow-hidden"
            >
              <div className={`w-14 h-14 rounded-2xl ${s.bg} flex items-center justify-center shrink-0 transition-all duration-300`}>
                <span className={`${s.color} group-hover:text-white transition-colors duration-300`}>
                  {s.icon}
                </span>
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-slate-800 group-hover:text-slate-900">{s.label}</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">{s.count}</p>
              </div>
              <ArrowRight size={15} className="absolute bottom-6 right-6 text-slate-200 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all duration-300" />
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm font-bold text-[#06241C] hover:text-[#0a3529] transition-colors group">
            Ver todos os serviços disponíveis
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Why us
// ─────────────────────────────────────────────────────────────

const WHY_US = [
  { icon: <Shield size={24} />,    title: 'Pagamentos 100% seguros',   desc: 'O valor fica retido na plataforma e só é liberado após confirmação do serviço. Zero risco para o cliente.', color: 'text-[#06241C]',    bg: 'bg-green-50' },
  { icon: <BadgeCheck size={24} />,title: 'Prestadores verificados',    desc: 'Todos os prestadores passam por um processo rigoroso de verificação de identidade, habilitações e antecedentes.', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { icon: <Clock size={24} />,     title: 'Resposta em minutos',        desc: 'Receba propostas de prestadores disponíveis em menos de 30 minutos, 7 dias por semana.', color: 'text-amber-500',   bg: 'bg-amber-50' },
  { icon: <Headphones size={24} />,title: 'Suporte dedicado',           desc: 'Equipa de suporte disponível para resolver qualquer questão antes, durante e após o serviço.', color: 'text-teal-600',  bg: 'bg-teal-50' },
];

function WhyUs() {
  return (
    <section className="bg-slate-50 py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div>
            <span className="inline-block text-[11px] font-bold text-[#06241C] bg-green-50 border border-green-100 px-3 py-1 rounded-full uppercase tracking-widest mb-5">Porquê nós?</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-6">
              A plataforma que coloca a sua tranquilidade em primeiro lugar
            </h2>
            <p className="text-slate-500 text-base leading-relaxed mb-8">
              A Formocosta nasceu com o objetivo de profissionalizar o mercado de serviços em Angola, oferecendo uma experiência segura e transparente para clientes e prestadores.
            </p>
            <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#06241C] hover:bg-[#0a3529] text-white font-bold text-sm rounded-2xl transition-all active:scale-[0.97] group">
              Começar agora
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Right: feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {WHY_US.map(w => (
              <div key={w.title} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-11 h-11 ${w.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <span className={w.color}>{w.icon}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">{w.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// For Providers
// ─────────────────────────────────────────────────────────────

const PROVIDER_BENEFITS = [
  { icon: <TrendingUp size={18} />, text: 'Aumente o seu rendimento mensal' },
  { icon: <Users size={18} />,      text: 'Aceda a uma base de clientes qualificada' },
  { icon: <Shield size={18} />,     text: 'Pagamentos garantidos e pontuais' },
  { icon: <Award size={18} />,      text: 'Construa reputação com avaliações reais' },
  { icon: <Zap size={18} />,        text: 'Receba solicitações na sua área' },
  { icon: <Headphones size={18} />, text: 'Suporte dedicado para prestadores' },
];

function ForProviders() {
  return (
    <section
      id="prestadores"
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #06241C 0%, #0c3d2c 100%)' }}
    >
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div className="space-y-8">
            <div>
              <span className="inline-block text-[11px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1 rounded-full uppercase tracking-widest mb-5">Para prestadores</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Faça crescer o seu negócio{' '}
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #4ade80, #86efac)' }}>
                  connosco
                </span>
              </h2>
              <p className="mt-5 text-white/60 text-base leading-relaxed">
                Junte-se a mais de 850 prestadores verificados e comece a receber clientes qualificados hoje mesmo.
              </p>
            </div>

            <ul className="space-y-3">
              {PROVIDER_BENEFITS.map(b => (
                <li key={b.text} className="flex items-center gap-3 text-white/80 text-sm font-medium">
                  <div className="w-8 h-8 bg-emerald-500/20 border border-emerald-500/30 rounded-lg flex items-center justify-center text-emerald-400 shrink-0">
                    {b.icon}
                  </div>
                  {b.text}
                </li>
              ))}
            </ul>

            <Link href="/login" className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-[15px] rounded-2xl transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.97] group">
              Tornar-me Prestador
              <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Right: earnings mock card */}
          <div className="flex justify-center lg:justify-end">
            <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-3xl p-8 w-full max-w-sm space-y-6">
              <div>
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">Rendimento estimado</p>
                <p className="text-4xl font-black text-white">AOA 285.000</p>
                <p className="text-white/50 text-sm mt-1">por mês em média</p>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Serviços completados', value: '42', icon: <CheckCircle size={14} className="text-emerald-400" /> },
                  { label: 'Avaliação média',       value: '4.8 ★', icon: <Star size={14} className="text-amber-400" /> },
                  { label: 'Taxa de aceitação',     value: '94%',   icon: <TrendingUp size={14} className="text-emerald-400" /> },
                ].map(r => (
                  <div key={r.label} className="flex items-center justify-between bg-white/5 border border-white/[0.08] rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      {r.icon}
                      <span className="text-white/60 text-xs font-medium">{r.label}</span>
                    </div>
                    <span className="text-white text-sm font-bold">{r.value}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 pt-4">
                <p className="text-white/30 text-[11px] text-center leading-relaxed">
                  Baseado na média dos prestadores activos na plataforma
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Testimonials
// ─────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    name: 'Beatriz Lourenço',
    role: 'Cliente',
    location: 'Luanda',
    avatar: 'BL',
    rating: 5,
    text: 'Excelente plataforma! Encontrei um eletricista em menos de 20 minutos. O trabalho ficou perfeito e o pagamento foi super seguro. Recomendo a todos.',
    service: 'Instalação elétrica',
  },
  {
    name: 'João Madalena',
    role: 'Canalizador',
    location: 'Benguela',
    avatar: 'JM',
    rating: 5,
    text: 'Desde que me registei na Formocosta, a minha agenda encheu. Consigo gerir os meus serviços facilmente e os pagamentos chegam sempre a tempo. É incrível.',
    service: 'Prestador verificado',
  },
  {
    name: 'Ana Cristina Pinto',
    role: 'Cliente',
    location: 'Luanda',
    avatar: 'AC',
    rating: 5,
    text: 'A transparência do processo é o que mais gosto. Consigo acompanhar tudo em tempo real e saber exactamente o que vou pagar antes de confirmar o serviço.',
    service: 'Limpeza doméstica',
  },
];

function Testimonials() {
  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block text-[11px] font-bold text-[#06241C] bg-green-50 border border-green-100 px-3 py-1 rounded-full uppercase tracking-widest mb-4">Testemunhos</span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            O que dizem os nossos utilizadores
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="bg-slate-50 border border-slate-100 rounded-3xl p-7 flex flex-col gap-5 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              {/* Stars */}
              <div className="flex items-center gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              {/* Quote */}
              <p className="text-slate-600 text-sm leading-relaxed flex-1">
                &ldquo;{t.text}&rdquo;
              </p>
              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#06241C] to-emerald-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {t.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-800 truncate">{t.name}</p>
                  <p className="text-[11px] text-slate-400 font-medium">{t.role} · {t.location}</p>
                </div>
                <span className="text-[10px] font-semibold text-[#06241C] bg-green-50 border border-green-100 px-2 py-0.5 rounded-lg shrink-0">
                  {t.service}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// CTA Banner
// ─────────────────────────────────────────────────────────────

function CtaBanner() {
  return (
    <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div
          className="relative rounded-[2rem] overflow-hidden p-12 lg:p-20 text-center space-y-8"
          style={{ background: 'linear-gradient(135deg, #06241C 0%, #0f4a34 100%)' }}
        >
          <div className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }}
          />
          <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Pronto para começar?
            </h2>
            <p className="text-white/70 text-lg max-w-xl mx-auto leading-relaxed">
              Junte-se a milhares de clientes e prestadores que já confiam na Formocosta.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-[#06241C] font-bold text-[15px] rounded-2xl transition-all shadow-lg active:scale-[0.97] group"
              >
                Contratar Serviço
                <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-[15px] rounded-2xl border border-white/25 transition-all active:scale-[0.97]"
              >
                Tornar-me Prestador
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer id="contacto" className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 lg:gap-12">

          {/* Brand col */}
          <div className="col-span-2 lg:col-span-2 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#06241C] rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-[15px]">F</span>
              </div>
              <span className="font-bold text-[17px] tracking-tight text-white">Formocosta</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              A plataforma que conecta clientes a profissionais de confiança em Angola.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: <Globe size={17} />,       href: '#', label: 'Facebook' },
                { icon: <Briefcase size={17} />,      href: '#', label: 'LinkedIn' },
                { icon: <Camera size={17} />,         href: '#', label: 'Instagram' },
                { icon: <MessageCircle size={17} />,  href: '#', label: 'WhatsApp' },
              ].map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 bg-white/[0.08] hover:bg-[#06241C] border border-white/[0.08] hover:border-[#06241C] rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Empresa */}
          <div className="space-y-4">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Empresa</p>
            <ul className="space-y-3">
              {['Sobre nós', 'Como funciona', 'Carreiras', 'Blog', 'Imprensa'].map(l => (
                <li key={l}>
                  <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Suporte */}
          <div className="space-y-4">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Suporte</p>
            <ul className="space-y-3">
              {['Centro de Ajuda', 'Contacto', 'Reportar problema', 'Comunidade', 'Estado do sistema'].map(l => (
                <li key={l}>
                  <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Contacto</p>
            <ul className="space-y-3">
              <li>
                <a href="tel:+244923000000" className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-white transition-colors group">
                  <Wrench size={14} className="text-slate-600 group-hover:text-emerald-400 transition-colors shrink-0" />
                  +244 923 000 000
                </a>
              </li>
              <li>
                <a href="mailto:info@formocosta.ao" className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-white transition-colors group">
                  <Zap size={14} className="text-slate-600 group-hover:text-emerald-400 transition-colors shrink-0" />
                  info@formocosta.ao
                </a>
              </li>
              <li>
                <span className="flex items-start gap-2.5 text-sm text-slate-400">
                  <MapPin size={14} className="text-slate-600 shrink-0 mt-0.5" />
                  Luanda, Angola
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            © 2026 Formocosta. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-5">
            {['Termos e Condições', 'Política de Privacidade', 'Cookies'].map(l => (
              <a key={l} href="#" className="text-xs text-slate-500 hover:text-slate-300 transition-colors whitespace-nowrap">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <StatsBar />
        <HowItWorks />
        <ServicesGrid />
        <WhyUs />
        <ForProviders />
        <Testimonials />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}
