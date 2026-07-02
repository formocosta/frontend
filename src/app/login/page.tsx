'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import Image from 'next/image';
import icon from '@/assets/images/icon2.png';
import { Input } from '@/components/common/form/Input';
import { Button } from '@/components/common/form/Button';

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
            <Input
              id="email"
              type="email"
              label="Email"
              placeholder="exemplo@formocosta.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                  Palavra-passe
                </label>
                <button
                  type="button"
                  onClick={() => router.push('/forgot-password')}
                  className="text-sm text-primary-600 hover:text-primary-700 font-semibold transition-colors outline-none focus:underline"
                >
                  Esqueceu?
                </button>
              </div>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center outline-none focus:text-primary-500"
                    aria-label={showPassword ? 'Ocultar palavra-passe' : 'Mostrar palavra-passe'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                isLoading={loading}
                className="w-full shadow-lg shadow-primary-700/30 active:scale-[0.98]"
                rightIcon={<ArrowRight size={18} />}
                size="lg"
              >
                {loading ? 'A entrar…' : 'Entrar no Painel'}
              </Button>
            </div>
          </form>
        </div>

        {/* Support / Privacy Footer */}
        <div className="text-left mt-8 pt-8 border-t border-slate-100">
          <span className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-primary-600" />
            Área restrita e segura. Precisa de ajuda?{' '}
            <button type="button" className="text-primary-700 font-semibold hover:underline outline-none">
              Contactar Suporte
            </button>
          </span>
        </div>
      </div>
    </main>
  );
}
