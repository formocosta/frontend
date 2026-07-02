'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  ShieldCheck,
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
      await new Promise((r) => setTimeout(r, 800));
      router.push('/dashboard');
    } catch {
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 md:p-8 font-sans overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-100/50 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary-200/30 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md bg-white rounded-sm p-8 md:p-12 shadow-2xl shadow-primary-900/10 border border-slate-100 z-10 flex flex-col justify-between">
        {/* Logo / Brand Header */}
        <div className="w-48 h-14 mb-8">
          <Image src={icon} alt="Formocosta Logo" className="w-full h-full object-contain object-left" />
        </div>

        {/* Form Content */}
        <div className="w-full space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Acessar Painel</h2>
            <p className="text-sm text-slate-500">
              Bem-vindo de volta ao Backoffice. Insira suas credenciais para continuar.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 mt-8">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-semibold text-slate-700">
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder="exemplo@formocosta.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-sm border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 outline-none text-sm text-slate-800 placeholder:text-slate-400 transition-all bg-slate-50 focus:bg-white"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                  Palavra-passe
                </label>
                <button
                  type="button"
                  onClick={() => router.push('/forgot-password')}
                  className="text-sm text-primary-600 hover:text-primary-700 font-semibold transition-colors"
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
                  className="w-full px-4 py-3 rounded-sm border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 outline-none text-sm text-slate-800 placeholder:text-slate-400 transition-all bg-slate-50 focus:bg-white pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? 'Ocultar palavra-passe' : 'Mostrar palavra-passe'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold rounded-sm transition-all duration-300 shadow-lg shadow-primary-700/30 active:scale-[0.98] disabled:opacity-75 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer mt-6"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  A entrar…
                </>
              ) : (
                <>
                  Entrar no Painel
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Support / Privacy Footer */}
        <div className="text-left mt-8 pt-8 border-t border-slate-100">
          <span className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-primary-600" />
            Área restrita e segura. Precisa de ajuda?{' '}
            <button type="button" className="text-primary-700 font-semibold hover:underline">
              Contactar Suporte
            </button>
          </span>
        </div>
      </div>
    </main>
  );
}
