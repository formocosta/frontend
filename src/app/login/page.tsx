'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Home,
  LayoutGrid,
  Settings,
} from 'lucide-react';
import Image from 'next/image';
import icon from '@/assets/images/icon2.png';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate direct redirect
      await new Promise((r) => setTimeout(r, 800));
      router.push('/dashboard');
    } catch {
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="h-screen w-screen bg-[#4a5450] flex items-center justify-center p-3 md:p-6 font-sans overflow-hidden">
      <div className="w-full max-w-5xl bg-white rounded-sm p-2 grid md:grid-cols-2 shadow-2xl border border-gray-100 h-full max-h-[580px] md:max-h-[640px] transition-all duration-300">

        {/* ── LEFT COLUMN (Login Form) ──────────────────────── */}
        <div className="flex flex-col justify-between p-6 md:p-8 h-full overflow-y-auto">
          {/* Logo / Brand Header */}
          <div className="w-42  h-12">
            <Image src={icon} alt="Formocosta Logo" className="w-full h-full object-contain" />
          </div>

          {/* Form Content */}
          <div className="max-w-sm w-full mx-auto my-auto space-y-4">
            <div className="space-y-1.5">
              {/* Green Icon Box */}

              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Acessar Painel</h2>
              <p className="text-xs text-gray-400">
                Bem-vindo ao Backoffice. Faça login na sua conta.
              </p>
            </div>

            <div className="w-full border-t border-gray-100 my-2" />

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Email Input */}
              <div className="space-y-1">
                <label htmlFor="email" className="text-xs font-semibold text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="exemplo@formocosta.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-sm border border-gray-200 focus:border-[#064e3b] focus:ring-1 focus:ring-[#064e3b] outline-none text-sm text-gray-800 placeholder:text-gray-300 transition-all bg-white"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="text-xs font-semibold text-gray-700">
                    Palavra-passe
                  </label>
                  <button
                    type="button"
                    onClick={() => router.push('/forgot-password')}
                    className="text-xs text-gray-400 hover:text-gray-900 font-medium transition-colors"
                  >
                    Esqueceu?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-sm border border-gray-200 focus:border-[#064e3b] focus:ring-1 focus:ring-[#064e3b] outline-none text-sm text-gray-800 placeholder:text-gray-300 transition-all bg-white pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? 'Ocultar palavra-passe' : 'Mostrar palavra-passe'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-[#03321f] to-[#0b482e] hover:from-[#0b482e] hover:to-[#03321f] text-white text-sm font-semibold rounded-sm transition-all duration-300 shadow-md shadow-[#0b482e]/20 active:scale-[0.98] disabled:opacity-75 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    A entrar…
                  </>
                ) : (
                  <>
                    Entrar no Painel
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Support / Privacy Footer */}
          <div className="text-center">
            <span className="text-[11px] text-gray-400">
              Área restrita. Precisa de ajuda?{' '}
              <button type="button" className="text-[#064e3b] font-semibold hover:underline">
                Contactar Suporte
              </button>
            </span>
          </div>
        </div>

        {/* ── RIGHT COLUMN (Premium Card) ────────────────────── */}
        <div className="p-2 hidden md:flex h-full">
          <div className="w-full h-full rounded-sm bg-gradient-to-br from-[#022c22] via-[#064e3b] to-[#022c22] relative overflow-hidden flex flex-col justify-between p-8 shadow-inner">
            {/* Glossy gradient reflection background blobs */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.15),transparent_50%)] pointer-events-none" />
            <div className="absolute -top-[30%] -right-[30%] w-[80%] h-[80%] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-[30%] -left-[30%] w-[80%] h-[80%] rounded-full bg-[#059669]/10 blur-[100px] pointer-events-none" />

            {/* Wavy light overlay */}
            <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z" fill="white" />
              </svg>
            </div>

            {/* Premium Typography Header */}
            <div className="relative z-10 mt-2 space-y-1 select-none">
              <div className="font-serif italic text-white/90 text-3xl lg:text-[2.2rem] font-medium leading-none">
                Gerencie
              </div>
              <div className="font-serif italic text-white/90 text-3xl lg:text-[2.2rem] font-medium leading-none">
                o Futuro
              </div>
              <div className="font-sans font-light text-white text-3xl lg:text-[2.2rem] leading-none pt-1 tracking-tight">
                dos Serviços,
              </div>
              <div className="font-sans font-normal text-emerald-300 text-3xl lg:text-[2.2rem] leading-none tracking-tight">
                hoje
              </div>
            </div>

            {/* Floating Widgets Area */}
            <div className="relative h-48 mt-auto w-full select-none">
              {/* Bottom-left logo icon square */}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md p-2 rounded-sm shadow-xl border border-white/20 z-20 animate-float-delayed">
                <div className="w-7 h-7 rounded-sm bg-gradient-to-br from-[#064e3b] to-[#022c22] flex items-center justify-center shadow-md p-1.5">
                  <Image src={icon} alt="Formocosta Logo" className="w-full h-full object-contain filter brightness-0 invert" />
                </div>
              </div>

              {/* Vertical Menu Widget */}
              <div className="absolute bottom-4 left-16 bg-white/95 backdrop-blur-md py-3.5 px-2 rounded-sm flex flex-col gap-3.5 shadow-xl border border-white/20 z-20 animate-float">
                <Home size={16} className="text-[#064e3b] cursor-pointer hover:scale-110 transition-transform" />
                <LayoutGrid size={16} className="text-gray-400 cursor-pointer hover:scale-110 transition-transform" />
                <Settings size={16} className="text-gray-400 cursor-pointer hover:scale-110 transition-transform" />
              </div>

              {/* Larger Statistics Card */}
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-sm w-56 shadow-2xl border border-white/30 z-10 animate-float">
                <div className="flex justify-between items-start mb-2">
                  {/* Stylized Logo symbol */}
                  <div className="text-emerald-800/25">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M8 6h3a6 6 0 0 1 6 6v0a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6v0a6 6 0 0 1 6-6zm3 10a4 4 0 0 0 4-4v0a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v0a4 4 0 0 0 4 4h3z" opacity="0.6" />
                      <path d="M16 6h-3a6 6 0 0 0-6 6v0a6 6 0 0 0 6 6h3a6 6 0 0 0 6-6v0a6 6 0 0 0-6-6zm-3 10a4 4 0 0 1-4-4v0a4 4 0 0 1 4-4h3a4 4 0 0 1 4 4v0a4 4 0 0 1-4 4h-3z" />
                    </svg>
                  </div>
                </div>

                <div className="space-y-0.5 mb-3">
                  <div className="text-xl font-bold text-gray-900 tracking-tight">
                    12.347,23 Kz
                  </div>
                  <div className="text-[9px] text-gray-400 font-medium uppercase tracking-wider">
                    Faturamento do Dia
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-2 flex justify-between items-center">
                  <div>
                    <div className="text-[9px] text-gray-400 font-medium">Prestadores</div>
                    <div className="text-xs font-semibold text-gray-800">3.495</div>
                  </div>
                  <button type="button" className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-[9px] font-bold rounded-sm text-gray-700 transition-colors cursor-pointer">
                    Ver todos
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
