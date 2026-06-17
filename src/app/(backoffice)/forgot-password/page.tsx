'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Mail } from 'lucide-react';

import bg from '@/assets/images/bg-card.png';
import prestadores from '@/assets/images/prestadores-de-serviços.jpg';
import logo from '@/assets/images/logo.png.jpg';

type FieldError = { email?: string };

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<FieldError>({});
  const [touched, setTouched] = useState<{ email?: boolean }>({});

  function validate(): FieldError {
    const e: FieldError = {};
    if (!email) e.email = 'O email é obrigatório.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Introduza um email válido.';
    return e;
  }

  function handleBlur() {
    setTouched((t) => ({ ...t, email: true }));
    const e = validate();
    setErrors((prev) => ({ ...prev, email: e.email }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ email: true });
    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      return;
    }
    setSent(true);
  }

  const fieldClass = (hasError: boolean) =>
    `w-full pl-8 pr-4 py-2 bg-transparent border-b text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all duration-200 ${
      hasError ? 'border-red-400' : 'border-gray-300 focus:border-[#0B7A45]'
    }`;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl shadow-black/10">

        {/* CARD */}
        <div className="bg-white">

          <div className="flex items-center justify-center px-8 md:px-12 py-12">
            <div className="w-full max-w-xs">

              {!sent ? (
                <>
                  {/* Header */}
                  <div className="mb-8">
                    <div className="flex justify-center mb-5">
                      <div className="w-16 h-16 rounded-xl bg-[#0B7A45]/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Image src={logo} alt="Formocosta" width={60} height={28} className="object-contain" />
                      </div>
                    </div>
                    <h2 className="text-2xl text-center font-bold text-gray-900">Esqueceu sua senha?</h2>
                    <p className="text-sm text-gray-500 mt-2 text-center leading-relaxed">
                      Introduza o seu e-mail para receber o link de recuperação de palavra-passe.
                    </p>
                  </div>

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
                          onBlur={handleBlur}
                          className={fieldClass(!!touched.email && !!errors.email && email !== '')}
                          aria-invalid={!!touched.email && !!errors.email && email !== ''}
                          aria-describedby={errors.email ? 'email-error' : undefined}
                        />
                      </div>
                      {touched.email && errors.email && email !== '' && (
                        <p id="email-error" role="alert" className="text-xs text-red-500 animate-in fade-in duration-150">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      className="w-full bg-[#0B7A45] hover:bg-[#064E2A] disabled:bg-[#0B7A45]/70 text-white text-sm font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-[#0B7A45]/25 hover:shadow-xl hover:shadow-[#0B7A45]/30 hover:-translate-y-0.5 active:translate-y-0 mt-6"
                    >
                      Enviar link
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
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900">
                    Email enviado!
                  </h2>

                  <p className="text-gray-500 leading-relaxed">
                    Enviámos um link para <span className="font-medium text-gray-700">{email}</span>. Verifica a tua caixa de entrada.
                  </p>

                  <button
                    onClick={() => router.push('/login')}
                    className="w-full bg-[#0B7A45] hover:bg-[#064E2A] text-white text-sm font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-[#0B7A45]/25 hover:shadow-xl hover:shadow-[#0B7A45]/30 hover:-translate-y-0.5 active:translate-y-0 mt-6"
                  >
                    Voltar ao login
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
