'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import icon from '@/assets/images/icon3.png';
import profissionalImage from '@/assets/images/proficional.png';
import { Input } from '@/components/common/form/Input';
import { Button } from '@/components/common/form/Button';
import { signinSchema, SigninFormData } from '@/shared/schemas/auth.schema';
import { useAuthStore } from '@/shared/store/auth.store';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
  });

  async function onSubmit(data: SigninFormData) {
    setLoading(true);
    setServerError(null);

    const result = await login(data.email, data.password);

    if (result.success) {
      if (result.twoFactorPending) {
        // TODO: Redirect to 2FA verification page
        router.push('/dashboard');
      } else {
        router.push('/dashboard');
      }
    } else {
      setServerError(result.error || 'Erro ao efetuar login');
    }

    setLoading(false);
  }

  return (
    <main className="h-screen w-full flex items-center justify-center font-sans bg-[#f3f4f6] p-4 sm:p-8 selection:bg-primary-200 selection:text-primary-900">
      <div className="bg-white rounded-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-[1000px] flex flex-col lg:flex-row overflow-hidden min-h-[650px] relative h-full max-h-[800px] p-4">
        
        <section className="relative rounded-md hidden lg:flex lg:w-[45%] flex-col pt-12 px-12 pb-0 overflow-hidden bg-primary-700">
          
          {/* Decorative SVGs for the background */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 text-primary-600/30">
            <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="12" />
            </svg>
          </div>

          {/* Top Content */}
          <div className="relative z-10">
            <Image src={icon} alt="Logo" className="w-40 h-24 object-contain object-left mb-8 drop-shadow-md brightness-0 invert" />
            
            <div className="relative">
              <svg className="absolute -top-4 -left-4 w-10 h-10 text-primary-500/40" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="relative z-10 text-[15px] text-white/95 font-medium leading-[1.7] max-w-[90%] tracking-wide"> 
                Conecte clientes a profissionais qualificados, faça o acompanhamento e simplifique as operações do seu negócio com total controlo.
              </p>
            </div>
          </div>

          {/* Bottom Content / Image */}
          <div className="relative z-10 flex-1 flex items-end justify-center mt-12 w-full h-full bg-primary-800/30 rounded-t-[32px] overflow-hidden backdrop-blur-sm border border-primary-600/30 border-b-0">
            <Image 
              src={profissionalImage} 
              alt="Profissional" 
              className="w-full h-auto object-cover object-bottom"
            />
          </div>

        </section>

        {/* ── RIGHT COLUMN: Form ──────────────────────────────────── */}
        <section className="w-full lg:w-[55%] flex flex-col justify-center px-8 sm:px-14 lg:px-20 py-12 relative z-10 bg-white">
          <div className="w-full max-w-[340px] mx-auto">
            
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-[#42b883]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </div>
                <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">
                  Acesso à Conta
                </h1>
              </div>
              <p className="text-[13px] text-gray-500 leading-relaxed ml-[52px]">
                Faça login com o seu e-mail de trabalho ou clique numa das opções abaixo.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-[18px]">

              {serverError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-[12px] font-medium">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{serverError}</span>
                </div>
              )}

              {/* Social Login Buttons */}
              <div className="space-y-3 mb-6">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full py-2.5 h-auto text-[13px] font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 shadow-sm transition-all rounded-lg flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Entrar com o Google
                </Button>
                
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-gray-100"></div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">OU</span>
                <div className="flex-1 h-px bg-gray-100"></div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-800 uppercase tracking-wide ml-1">E-mail</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="exemplo@gmail.com"
                  error={errors.email?.message}
                  {...register('email')}
                  className="bg-white border-gray-200 shadow-[0_1px_2px_rgb(0,0,0,0.02)] text-[13px] py-2 focus:border-[#42b883] focus:ring-1 focus:ring-[#42b883] transition-all rounded-lg w-full"
                />
              </div>

              <div className="space-y-1.5 relative">
                <label className="text-[11px] font-bold text-gray-800 uppercase tracking-wide ml-1">Senha</label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    error={errors.password?.message}
                    {...register('password')}
                    className="bg-white border-gray-200 shadow-[0_1px_2px_rgb(0,0,0,0.02)] text-[13px] py-2 focus:border-[#42b883] focus:ring-1 focus:ring-[#42b883] transition-all rounded-lg pr-10 w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center outline-none h-full"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button type="button" onClick={() => router.push('/forgot-password')} className="text-[11px] text-[#42b883] font-semibold hover:text-[#3aa374] transition-colors">
                  Esqueceu a Senha?
                </button>
              </div>

              <div className="pt-3">
                <Button
                  type="submit"
                  isLoading={loading}
                  className="w-full py-[11px] h-auto shadow-sm active:scale-[0.98] bg-[#42b883] hover:bg-[#3aa374] text-white font-semibold rounded-lg text-[13px] tracking-wide"
                >
                  {loading ? 'A autenticar...' : 'Entrar'}
                </Button>
              </div>
            </form>

            <div className="mt-6 w-full flex justify-center text-[11px] font-medium text-gray-500 text-center">
              <span>
                Problemas de acesso?{' '}
                <a href="#" className="text-[#42b883] hover:underline font-semibold">
                  Entre em contacto com o suporte
                </a>
              </span>
            </div>
            
          </div>
        </section>

      </div>
    </main>
  );
}
