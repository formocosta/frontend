'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import bg from '@/assets/images/bg-card.png';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <main className="min-h-screen bg-[#F4FDF5] flex items-center justify-center p-4">

      {/* CARD */}
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

          <div className="w-full max-w-md">

            {!sent ? (
              <>
                {/* HEADER */}
                <div className="mb-12">
                  <h2 className="text-5xl font-bold text-gray-900">
                    Esqueci a senha
                  </h2>

                  <p className="text-gray-500 mt-4 leading-relaxed">
                    Introduz o teu email e enviaremos um link para redefinires a senha.
                  </p>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-8">

                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Email
                    </label>

                    <div className="mt-3 border-b border-gray-300 focus-within:border-[#0B7A45] transition-colors">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Digite o seu email"
                        className="w-full py-4 bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#0B7A45] hover:bg-[#08663A] transition rounded-full py-4 text-white font-semibold shadow-lg cursor-pointer"
                  >
                    Enviar link
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
              /* ESTADO APÓS ENVIO */
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-[#F4FDF5] rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-[#0B7A45]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>

                <h2 className="text-3xl font-bold text-gray-900">
                  Email enviado!
                </h2>

                <p className="text-gray-500 leading-relaxed">
                  Enviámos um link para <span className="font-medium text-gray-700">{email}</span>. Verifica a tua caixa de entrada.
                </p>

                <button
                  onClick={() => router.push('/backoffice/login')}
                  className="w-full bg-[#0B7A45] hover:bg-[#08663A] transition rounded-full py-4 text-white font-semibold shadow-lg cursor-pointer"
                >
                  Voltar ao login
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

    </main>
  );
}
