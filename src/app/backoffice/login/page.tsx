'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
} from 'lucide-react';

import logo from '@/assets/images/logo.png.jpg';
import prestadores from '@/assets/images/prestadores-de-serviços.jpg';

type FieldError = { email?: string; password?: string };

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldError>({});
  const [serverError, setServerError] = useState('');
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

  function validate(): FieldError {
    const e: FieldError = {};
    if (!email) e.email = 'O email é obrigatório.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Introduza um email válido.';
    if (!password) e.password = 'A palavra-passe é obrigatória.';
    else if (password.length < 6) e.password = 'Mínimo de 6 caracteres.';
    return e;
  }

  function handleBlur(field: 'email' | 'password') {
    setTouched((t) => ({ ...t, [field]: true }));
    const e = validate();
    setErrors((prev) => ({ ...prev, [field]: e[field] }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setServerError('');
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      router.push('/backoffice/dashboard');
    } catch {
      setServerError('Credenciais inválidas. Verifique e tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  const fieldClass = (hasError: boolean) =>
    `w-full pl-8 pr-4 py-2 bg-transparent border-b text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all duration-200 ${
      hasError ? 'border-red-400' : 'border-gray-300 focus:border-[#0B7A45]'
    }`;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl rounded-2xl overflow-hidden shadow-xl shadow-black/15 grid md:grid-cols-[1fr_1fr]">

        {/* ── LEFT PANEL ────────────────────────────────────── */}
        <div className="relative hidden md:flex flex-col p-10 bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url(${prestadores.src})`, backgroundAttachment: 'fixed', backgroundSize: '1000px 620px' }}>
          
          {/* overlay for text visibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#064E2A]/85 via-[#0B7A45]/75 to-[#10A05C]/60" />

         

          {/* Headline */}
          <div className="relative mt-8 z-10 space-y-4">
            <h1 className="text-4xl font-bold text-white leading-tight">
              Bem-vindo à<br />
              <span className="text-emerald-200">sua plataforma</span>
            </h1>
            <p className="text-white/70 text-sm mt-8 leading-relaxed max-w-xs">
              Solução completa para gestão de serviços profissionais em Angola.
            </p>
          </div>

        </div>

        {/* ── RIGHT PANEL ───────────────────────────────────── */}
        <div className="flex items-center justify-center px-8 md:px-12 py-12">
          <div className="w-85 max-w-xs">
    
            {/* Header */}
            <div className="mb-8">
              <div className="flex justify-center mb-5">
                <div className="w-25 h-25 rounded-xl bg-[#0B7A45]/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                  <Image src={logo} alt="Formocosta" width={100} height={50} className="object-contain" />
                </div>
              </div>
              <h2 className="text-2xl text-center font-bold text-gray-900">Acessa a tua Conta</h2>
              <p className="text-sm text-gray-500 mt-1.5">
                Preencha os campos a baixo para acessar a plataforma.
              </p>
            </div>

            {/* Server error */}
            {serverError && (
              <div className="mb-5 flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 animate-in fade-in slide-in-from-top-1 duration-200">
                <span>{serverError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-5">

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
                      touched.email && errors.email && email !== '' ? 'text-red-400' : 'text-gray-400'
                    }`}
                  />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="email@gmail.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (touched.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    onBlur={() => handleBlur('email')}
                    className={fieldClass(!!touched.email && !!errors.email && email !== '')}
                    aria-invalid={!!touched.email && !!errors.email && email !== ''}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                </div>
                {touched.email && errors.email && email !== '' && (
                  <p id="email-error" role="alert" className="text-xs text-red-500 flex items-center gap-1 animate-in fade-in duration-150">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Palavra-passe
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
                      touched.password && errors.password && password !== '' ? 'text-red-400' : 'text-gray-400'
                    }`}
                  />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (touched.password) setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    onBlur={() => handleBlur('password')}
                    className={`${fieldClass(!!touched.password && !!errors.password && password !== '')} pr-10`}
                    aria-invalid={!!touched.password && !!errors.password && password !== ''}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Ocultar palavra-passe' : 'Mostrar palavra-passe'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {touched.password && errors.password && password !== '' && (
                  <p id="password-error" role="alert" className="text-xs text-red-500 animate-in fade-in duration-150">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Forgot password */}
              <div className="flex justify-end -mt-1">
                <button
                  type="button"
                  onClick={() => router.push('/backoffice/forgot-password')}
                  className="text-xs text-[#0B7A45] hover:text-[#064E2A] font-medium transition-colors"
                >
                  Esqueceu a palavra-passe?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="relative w-60 mx-auto flex items-center justify-center gap-2 bg-[#0B7A45] hover:bg-[#064E2A] disabled:bg-[#0B7A45]/70 text-white text-sm font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-[#0B7A45]/25 hover:shadow-xl hover:shadow-[#0B7A45]/30 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    A autenticar…
                  </>
                ) : (
                  <>
                    Entrar na conta
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>

            {/* Terms */}
            <p className="text-center text-xs text-gray-400 mt-4 leading-relaxed">
              Ao entrar, aceita os nossos{' '}
              <button className="underline underline-offset-2 hover:text-gray-600 transition-colors">
                Termos de Serviço
              </button>{' '}
              e{' '}
              <button className="underline underline-offset-2 hover:text-gray-600 transition-colors">
                Política de Privacidade
              </button>
              .
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
