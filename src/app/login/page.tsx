'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Image from 'next/image';
import icon from '@/assets/images/icon2.png';
import loginIllustration from '@/assets/images/login_illustration.png';

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
      <div className="w-full max-w-4xl bg-white rounded-3xl p-3 grid md:grid-cols-2 shadow-2xl border border-gray-100/50 h-full max-h-[500px] md:max-h-[580px] transition-all duration-300">

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
                <label htmlFor="password" className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                  Palavra-passe
                </label>
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

              {/* Remember me & Forgot account */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-[#2d7a55] focus:ring-[#2d7a55]/20 focus:ring-offset-0 focus:ring-2 w-4 h-4 accent-[#2d7a55]"
                  />
                  <span className="text-xs text-gray-500 font-medium">Lembrar-me</span>
                </label>
                <button
                  type="button"
                  onClick={() => router.push('/forgot-password')}
                  className="text-xs text-[#2d7a55] hover:text-[#236143] font-semibold hover:underline transition-colors"
                >
                  Esqueci minha conta
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#2d7a55] hover:bg-[#236143] text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-[#2d7a55]/20 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    A entrar…
                  </>
                ) : (
                  'Entrar'
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
        <div className="p-1 hidden md:flex h-full">
          <div className="w-full h-full rounded-2xl bg-[#2d7a55] relative overflow-hidden flex items-center justify-center select-none">
            <Image
              src={loginIllustration}
              alt="Formocosta Serviços"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

      </div>
    </main>
  );
}
