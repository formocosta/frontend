'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import bg from '@/assets/images/bg-card.png';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('As senhas não coincidem.');
      return;
    }

    if (password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres.');
      return;
    }

    // TODO: chamar API → POST /auth/reset-password { token, password }
    console.log({ token, password });

    setDone(true);
  }

  return (
    <div className="w-full max-w-md">

      {!done ? (
        <>
          <div className="mb-12">
            <h2 className="text-5xl font-bold text-gray-900">
              Nova senha
            </h2>

            <p className="text-gray-500 mt-4 leading-relaxed">
              Introduz e confirma a tua nova senha.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Nova senha
              </label>

              <div className="mt-3 border-b border-gray-300 focus-within:border-[#0B7A45] transition-colors flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite a nova senha"
                  className="w-full py-4 bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="px-2 text-gray-500 hover:text-[#0B7A45] transition"
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>

            {/* CONFIRM */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Confirmar senha
              </label>

              <div className="mt-3 border-b border-gray-300 focus-within:border-[#0B7A45] transition-colors flex items-center">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Confirme a nova senha"
                  className="w-full py-4 bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="px-2 text-gray-500 hover:text-[#0B7A45] transition"
                >
                  {showConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-[#0B7A45] hover:bg-[#08663A] transition rounded-full py-4 text-white font-semibold shadow-lg cursor-pointer"
            >
              Redefinir senha
            </button>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => router.push('/backoffice/login')}
                className="text-sm text-gray-400 hover:text-[#0B7A45] transition"
              >
                Voltar ao login
              </button>
            </div>

          </form>
        </>
      ) : (
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-[#F4FDF5] rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-[#0B7A45]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-gray-900">
            Senha redefinida!
          </h2>

          <p className="text-gray-500 leading-relaxed">
            A tua senha foi alterada com sucesso. Já podes fazer login.
          </p>

          <button
            onClick={() => router.push('/backoffice/login')}
            className="w-full bg-[#0B7A45] hover:bg-[#08663A] transition rounded-full py-4 text-white font-semibold shadow-lg cursor-pointer"
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
    <main className="min-h-screen bg-[#F4FDF5] flex items-center justify-center p-4">

      <div className="w-full max-w-6xl min-h-[50vh] bg-white rounded-3xl overflow-hidden shadow-2xl grid md:grid-cols-2">

        {/* LEFT */}
        <div className="relative hidden md:block">

          <Image
            src={bg}
            alt="Prestadores de serviços"
            fill
            priority
            sizes="50vw"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-black/20" />

          <div className="relative z-10 flex flex-col justify-between h-full p-12">

            <div>
              <h1 className="text-5xl font-bold text-white leading-tight max-w-md">
                Plataforma de Prestação de Serviços
              </h1>

              <p className="text-white/80 mt-6 text-lg leading-relaxed max-w-md">
                Gerencie profissionais, clientes e serviços numa única plataforma moderna.
              </p>
            </div>

            <div className="flex gap-6 text-sm text-white/70">
              <button className="hover:text-white transition">Sobre</button>
              <button className="hover:text-white transition">Privacidade</button>
              <button className="hover:text-white transition">Termos</button>
              <button className="hover:text-white transition">FAQ</button>
            </div>

          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center justify-center px-10 md:px-16 py-12">
          <Suspense fallback={<div className="text-gray-400">A carregar...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>

      </div>

    </main>
  );
}
