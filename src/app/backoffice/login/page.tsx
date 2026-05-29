'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';

import bg from '@/assets/images/bg-card.png';

export default function SignIn() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

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

            {/* HEADER */}
            <div className="mb-12">

              <h2 className="text-5xl font-bold text-gray-900">
                Log in
              </h2>

              <p className="text-gray-500 mt-4 leading-relaxed">
                Entre com as suas credenciais para acessar a plataforma.
              </p>

            </div>

            {/* FORM */}
            <form className="space-y-8">

              {/* EMAIL */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Email
                </label>

                <div className="mt-3 border-b border-gray-300 focus-within:border-[#0B7A45] transition-colors">
                  <input
                    type="email"
                    placeholder="Digite o seu email"
                    className="w-full py-4 bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Password
                </label>

                <div className="mt-3 border-b border-gray-300 focus-within:border-[#0B7A45] transition-colors flex items-center">

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite a sua senha"
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

              {/* FORGOT */}
              <div className="flex justify-end">

                <button
                  type="button"
                  onClick={() => router.push('/backoffice/forgot-password')}
                  className="text-sm text-gray-400 hover:text-[#0B7A45] transition"
                >
                  Esqueci minha senha
                </button>

              </div>

              {/* BUTTON */}
              <button
                type="submit"
                className="w-full bg-[#0B7A45] hover:bg-[#08663A] transition rounded-full py-4 text-white font-semibold shadow-lg cursor-pointer"
              >
                Entrar
              </button>

            </form>

          </div>

        </div>

      </div>

    </main>
  );
}