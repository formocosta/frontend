'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff, Lock } from 'lucide-react';
import logo from '@/assets/images/logo.png.jpg';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [touched, setTouched] = useState<{ password?: boolean; confirm?: boolean }>({});

  function validate() {
    const e: { password?: string; confirm?: string } = {};
    if (!password) e.password = 'A senha é obrigatória.';
    else if (password.length < 8) e.password = 'Mínimo de 8 caracteres.';
    if (!confirm) e.confirm = 'Confirmação é obrigatória.';
    else if (password !== confirm) e.confirm = 'As senhas não coincidem.';
    return e;
  }

  function handleBlur(field: 'password' | 'confirm') {
    setTouched((t) => ({ ...t, [field]: true }));
    const e = validate();
    setErrors((prev) => ({ ...prev, [field]: e[field] }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ password: true, confirm: true });
    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      return;
    }

    // TODO: chamar API → POST /auth/reset-password { token, password }
    console.log({ token, password });
    setDone(true);
  }

  const fieldClass = (hasError: boolean) =>
    `w-full pl-10 pr-4 py-2 bg-transparent border-b text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all duration-200 ${
      hasError ? 'border-red-400' : 'border-gray-300 focus:border-[#0B7A45]'
    }`;

  return (
    <div className="w-full max-w-xs">

      {!done ? (
        <>
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-center mb-5">
              <div className="w-20 h-20 rounded-xl bg-[#0B7A45]/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                <Image src={logo} alt="Formocosta" width={90} height={50} className="object-contain" />
              </div>
            </div>
            <h2 className="text-2xl text-center font-bold text-gray-900">Redefinir Senha</h2>
            <p className="text-sm text-gray-500 mt-2 text-center leading-relaxed">
              Introduza e confirme a sua nova senha.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* PASSWORD */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Nova Senha
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
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (touched.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  onBlur={() => handleBlur('password')}
                  placeholder="••••••••"
                  className={`${fieldClass(!!touched.password && !!errors.password && password !== '')} pr-10`}
                  aria-invalid={!!touched.password && !!errors.password && password !== ''}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
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

            {/* CONFIRM */}
            <div className="space-y-1.5">
              <label htmlFor="confirm" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Confirmar Senha
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
                    touched.confirm && errors.confirm && confirm !== '' ? 'text-red-400' : 'text-gray-400'
                  }`}
                />
                <input
                  id="confirm"
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={confirm}
                  onChange={(e) => {
                    setConfirm(e.target.value);
                    if (touched.confirm) setErrors((prev) => ({ ...prev, confirm: undefined }));
                  }}
                  onBlur={() => handleBlur('confirm')}
                  placeholder="••••••••"
                  className={`${fieldClass(!!touched.confirm && !!errors.confirm && confirm !== '')} pr-10`}
                  aria-invalid={!!touched.confirm && !!errors.confirm && confirm !== ''}
                  aria-describedby={errors.confirm ? 'confirm-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? 'Ocultar confirmação' : 'Mostrar confirmação'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {touched.confirm && errors.confirm && confirm !== '' && (
                <p id="confirm-error" role="alert" className="text-xs text-red-500 animate-in fade-in duration-150">
                  {errors.confirm}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[#0B7A45] hover:bg-[#064E2A] disabled:bg-[#0B7A45]/70 text-white text-sm font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-[#0B7A45]/25 hover:shadow-xl hover:shadow-[#0B7A45]/30 hover:-translate-y-0.5 active:translate-y-0 mt-6"
            >
              Redefinir Senha
            </button>
          </form>

          {/* Back to login */}
          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="text-xs text-[#0B7A45] hover:text-[#064E2A] font-medium transition-colors"
            >
              Voltar ao login
            </button>
          </div>
        </>
      ) : (
        /* ESTADO APÓS ENVIO */
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-[#F4FDF5] rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-[#0B7A45]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900">
            Senha redefinida!
          </h2>

          <p className="text-gray-500 leading-relaxed">
            A sua senha foi alterada com sucesso. Já pode fazer login.
          </p>

          <button
            onClick={() => router.push('/login')}
            className="w-full bg-[#0B7A45] hover:bg-[#064E2A] text-white text-sm font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-[#0B7A45]/25 hover:shadow-xl hover:shadow-[#0B7A45]/30 hover:-translate-y-0.5 active:translate-y-0 mt-6"
          >
            Ir para o login
          </button>
        </div>
      )}

    </div>
  );
}

export default function ResetPassword() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl shadow-black/10">

        {/* CARD */}
        <div className="bg-white">

          <div className="flex items-center justify-center px-8 md:px-12 py-12">
            <Suspense fallback={<div className="text-gray-400">A carregar...</div>}>
              <ResetPasswordForm />
            </Suspense>
          </div>

        </div>

      </div>
    </main>
  );
}
