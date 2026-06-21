'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
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
    <main className="h-screen w-screen bg-[#f0f2f1] flex items-center justify-center p-3 md:p-6 font-sans overflow-hidden">
      <div className="w-full max-w-4xl bg-white rounded-sm p-2 grid md:grid-cols-2 shadow-2xl border border-gray-100 h-full max-h-[500px] md:max-h-[560px] transition-all duration-300">

        {/* ── LEFT COLUMN (Login Form) ──────────────────────── */}
        <div className="flex flex-col justify-between p-6 md:p-8 h-full overflow-y-auto">
          {/* Logo / Brand Header */}
          <div className="w-42  h-12">
            <Image src={icon} alt="Formocosta Logo" className="w-full h-full object-contain" />
          </div>

          {/* Form Content */}
          <div className="max-w-sm w-full mx-auto my-auto space-y-5">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Acessar Painel</h2>
              <p className="text-sm text-gray-400">
                Bem-vindo ao Backoffice. Faça login na sua conta.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="exemplo@formocosta.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-[#06241C] focus:ring-2 focus:ring-[#06241C]/10 outline-none text-sm text-gray-800 placeholder:text-gray-300 transition-all"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Palavra-passe
                  </label>
                  <button
                    type="button"
                    onClick={() => router.push('/forgot-password')}
                    className="text-xs text-[#06241C] font-semibold hover:underline"
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-[#06241C] focus:ring-2 focus:ring-[#06241C]/10 outline-none text-sm text-gray-800 placeholder:text-gray-300 transition-all pr-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
                className="w-3/4 mx-auto py-3 bg-[#06241C] hover:bg-[#0a3529] text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-[#06241C]/20 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer mt-2"
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

        {/* ── RIGHT COLUMN ────────────────────────────────────── */}
        <div className="p-2 hidden md:flex h-full">
          <div className="w-full h-full rounded-sm bg-[#2d7a55] relative overflow-hidden flex flex-col items-center justify-center select-none">

            {/* Decorative dots */}
            <div className="absolute top-6 right-8 w-2 h-2 rounded-full bg-[#06241C]/20" />
            <div className="absolute top-14 right-16 w-1.5 h-1.5 rounded-full bg-[#06241C]/15" />
            <div className="absolute bottom-10 left-8 w-2 h-2 rounded-full bg-[#06241C]/20" />

            {/* Title */}
            <div className="absolute top-8 left-8 z-10 space-y-1 select-none">
              <div className="font-serif italic text-[#06241C]/80 text-3xl lg:text-[2.2rem] font-medium leading-none">Gerencie</div>
              <div className="font-serif italic text-[#06241C]/80 text-3xl lg:text-[2.2rem] font-medium leading-none">o Futuro</div>
              <div className="font-sans font-light text-[#06241C] text-3xl lg:text-[2.2rem] leading-none pt-1 tracking-tight">dos Serviços,</div>
              <div className="font-sans font-normal text-[#2d6a4f] text-3xl lg:text-[2.2rem] leading-none tracking-tight">hoje</div>
            </div>

            {/* Cards centrados */}
            <div className="relative flex flex-col items-center justify-center gap-3 w-full px-8 mt-auto mb-8">

              {/* Card — bar chart */}
              <div className="bg-white rounded-2xl shadow-lg p-3 w-52">
                <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider mb-2">Candidaturas</p>
                <div className="flex items-end gap-1 h-10">
                  {[40,65,45,80,55,90,70].map((h, i) => (
                    <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, backgroundColor: i === 5 ? '#06241C' : '#a7d4bb' }} />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 w-52">
                {/* Card — donut */}
                <div className="bg-white rounded-2xl shadow-lg p-3 flex-1 ">
                  <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Serviços</p>
                  <div className="flex items-center justify-center">
                    <svg viewBox="0 0 40 40" className="w-10 h-10">
                      <circle cx="20" cy="20" r="15" fill="none" stroke="#e8f5ee" strokeWidth="8"/>
                      <circle cx="20" cy="20" r="15" fill="none" stroke="#06241C" strokeWidth="8" strokeDasharray="56 38" strokeLinecap="round"/>
                      <circle cx="20" cy="20" r="15" fill="none" stroke="#4a9e7c" strokeWidth="8" strokeDasharray="22 72" strokeDashoffset="-56" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <p className="text-center text-[10px] font-bold text-[#06241C] mt-1">342</p>
                </div>

                {/* Card — line chart */}
                <div className="bg-white rounded-2xl shadow-lg p-3 flex-1 ">
                  <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Receita</p>
                  <p className="text-xs font-bold text-[#06241C] mb-1">245K Kz</p>
                  <svg viewBox="0 0 100 30" className="w-full h-6">
                    <polyline points="0,28 20,20 40,24 60,12 80,8 100,10" fill="none" stroke="#4a9e7c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="0,28 20,20 40,24 60,12 80,8 100,10 100,30 0,30" fill="#4a9e7c" opacity="0.12"/>
                  </svg>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
