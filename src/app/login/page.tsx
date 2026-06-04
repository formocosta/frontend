'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { MOCK_USERS } from '@/lib/auth';
import {
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Home,
  LayoutGrid,
  Settings,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError('');
    setLoading(true);

    try {
      // Simulate network request
      await new Promise((r) => setTimeout(r, 1200));
      const mockUser = MOCK_USERS[email];
      
      if (!mockUser) {
        setServerError('Credenciais inválidas. Verifique e tente novamente.');
        return;
      }

      login(
        { id: mockUser.id, name: mockUser.name, email, role: mockUser.role },
        'mock-access-token',
        'mock-refresh-token',
      );
      router.push('/dashboard');
    } catch {
      setServerError('Ocorreu um erro no servidor. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#4a5450] flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] p-3 grid md:grid-cols-2 shadow-2xl border border-gray-100 min-h-[640px] md:min-h-[700px] transition-all duration-300">
        
        {/* ── LEFT COLUMN (Login Form) ──────────────────────── */}
        <div className="flex flex-col justify-between p-8 md:p-12 min-h-[500px]">
          {/* Logo / Brand Header */}
          <div className="text-gray-300/80 font-serif italic text-2xl tracking-wider select-none">
            Formocosta
          </div>

          {/* Form Content */}
          <div className="max-w-sm w-full mx-auto my-auto space-y-6">
            <div className="space-y-2">
              {/* Green Icon Box */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#064e3b] to-[#022c22] flex items-center justify-center shadow-lg shadow-[#064e3b]/20">
                {/* Overlapping loops SVG icon */}
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-emerald-300">
                  <path d="M8 6h3a6 6 0 0 1 6 6v0a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6v0a6 6 0 0 1 6-6zm3 10a4 4 0 0 0 4-4v0a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v0a4 4 0 0 0 4 4h3z" opacity="0.6" />
                  <path d="M16 6h-3a6 6 0 0 0-6 6v0a6 6 0 0 0 6 6h3a6 6 0 0 0 6-6v0a6 6 0 0 0-6-6zm-3 10a4 4 0 0 1-4-4v0a4 4 0 0 1 4-4h3a4 4 0 0 1 4 4v0a4 4 0 0 1-4 4h-3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Acessar Painel</h2>
              <p className="text-sm text-gray-400">
                Bem-vindo ao Backoffice. Faça login na sua conta.
              </p>
            </div>

            <div className="w-full border-t border-gray-100 my-4" />

            {serverError && (
              <div className="text-center text-xs text-red-600 font-medium bg-red-50 border border-red-100 rounded-xl p-3 animate-in fade-in duration-200">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-semibold text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="exemplo@formocosta.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#064e3b] focus:ring-1 focus:ring-[#064e3b] outline-none text-sm text-gray-800 placeholder:text-gray-300 transition-all bg-white"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="text-xs font-semibold text-gray-700">
                    Palavra-passe
                  </label>
                  <button
                    type="button"
                    onClick={() => router.push('/forgot-password')}
                    className="text-xs text-gray-500 hover:text-gray-900 font-medium transition-colors"
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#064e3b] focus:ring-1 focus:ring-[#064e3b] outline-none text-sm text-gray-800 placeholder:text-gray-300 transition-all bg-white pr-10"
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
                className="w-full py-3.5 bg-gradient-to-r from-[#03321f] to-[#0b482e] hover:from-[#0b482e] hover:to-[#03321f] text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-md shadow-[#0b482e]/20 active:scale-[0.98] disabled:opacity-75 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer pt-6"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    A autenticar…
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
            <span className="text-xs text-gray-400">
              Área restrita. Precisa de ajuda?{' '}
              <button type="button" className="text-[#064e3b] font-semibold hover:underline">
                Contactar Suporte
              </button>
            </span>
          </div>
        </div>

        {/* ── RIGHT COLUMN (Premium Card) ────────────────────── */}
        <div className="p-3 hidden md:flex">
          <div className="w-full h-full rounded-[2.2rem] bg-gradient-to-br from-[#022c22] via-[#064e3b] to-[#022c22] relative overflow-hidden flex flex-col justify-between p-12 shadow-inner">
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
            <div className="relative z-10 mt-6 space-y-1.5 select-none">
              <div className="font-serif italic text-white/90 text-4xl lg:text-[2.75rem] font-medium leading-none">
                Gerencie
              </div>
              <div className="font-serif italic text-white/90 text-4xl lg:text-[2.75rem] font-medium leading-none">
                o Futuro
              </div>
              <div className="font-sans font-light text-white text-4xl lg:text-[2.75rem] leading-none pt-2 tracking-tight">
                dos Serviços,
              </div>
              <div className="font-sans font-normal text-emerald-300 text-4xl lg:text-[2.75rem] leading-none tracking-tight">
                hoje
              </div>
            </div>

            {/* Floating Widgets Area */}
            <div className="relative h-64 mt-auto w-full select-none">
              {/* Bottom-left logo icon square */}
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-white/20 z-20 animate-float-delayed">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#064e3b] to-[#022c22] flex items-center justify-center shadow-md">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-emerald-300">
                    <path d="M8 6h3a6 6 0 0 1 6 6v0a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6v0a6 6 0 0 1 6-6zm3 10a4 4 0 0 0 4-4v0a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v0a4 4 0 0 0 4 4h3z" opacity="0.6" />
                    <path d="M16 6h-3a6 6 0 0 0-6 6v0a6 6 0 0 0 6 6h3a6 6 0 0 0 6-6v0a6 6 0 0 0-6-6zm-3 10a4 4 0 0 1-4-4v0a4 4 0 0 1 4-4h3a4 4 0 0 1 4 4v0a4 4 0 0 1-4 4h-3z" />
                  </svg>
                </div>
              </div>

              {/* Vertical Menu Widget */}
              <div className="absolute bottom-6 left-24 bg-white/95 backdrop-blur-md py-4 px-3 rounded-2xl flex flex-col gap-4 shadow-xl border border-white/20 z-20 animate-float">
                <Home size={18} className="text-[#064e3b] cursor-pointer hover:scale-110 transition-transform" />
                <LayoutGrid size={18} className="text-gray-400 cursor-pointer hover:scale-110 transition-transform" />
                <Settings size={18} className="text-gray-400 cursor-pointer hover:scale-110 transition-transform" />
              </div>

              {/* Larger Statistics Card */}
              <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md p-5 rounded-[2rem] w-64 shadow-2xl border border-white/30 z-10 animate-float">
                <div className="flex justify-between items-start mb-4">
                  {/* Stylized Logo symbol */}
                  <div className="text-emerald-800/25">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path d="M8 6h3a6 6 0 0 1 6 6v0a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6v0a6 6 0 0 1 6-6zm3 10a4 4 0 0 0 4-4v0a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v0a4 4 0 0 0 4 4h3z" opacity="0.6" />
                      <path d="M16 6h-3a6 6 0 0 0-6 6v0a6 6 0 0 0 6 6h3a6 6 0 0 0 6-6v0a6 6 0 0 0-6-6zm-3 10a4 4 0 0 1-4-4v0a4 4 0 0 1 4-4h3a4 4 0 0 1 4 4v0a4 4 0 0 1-4 4h-3z" />
                    </svg>
                  </div>
                </div>
                
                <div className="space-y-1 mb-4">
                  <div className="text-2xl font-bold text-gray-900 tracking-tight">
                    12.347,23 Kz
                  </div>
                  <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                    Faturamento do Dia
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                  <div>
                    <div className="text-[10px] text-gray-400 font-medium">Prestadores Ativos</div>
                    <div className="text-xs font-semibold text-gray-800">3.495</div>
                  </div>
                  <button type="button" className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-[10px] font-bold rounded-full text-gray-700 transition-colors cursor-pointer">
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
