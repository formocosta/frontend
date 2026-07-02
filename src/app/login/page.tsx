'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Eye,
  EyeOff,
  ShieldCheck,
  Users,
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
    <main className="min-h-screen w-full flex font-sans bg-white selection:bg-primary-200 selection:text-primary-900">
      
      {/* ── LEFT COLUMN: Form ──────────────────────────────────── */}
      <section className="w-full lg:w-[45%] xl:w-[40%] flex flex-col justify-center px-8 sm:px-16 md:px-24 py-12 relative z-10 bg-white">
        
        {/* Logo */}
        <div className="absolute top-8 left-8 sm:top-12 sm:left-12 lg:left-16 xl:left-24">
          <div className="w-36 h-10">
            <Image src={icon} alt="Formocosta Logo" className="w-full h-full object-contain object-left" />
          </div>
        </div>

        <div className="w-full max-w-sm mx-auto mt-16 lg:mt-0">
          <div className="space-y-2 mb-10">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Acessar Conta
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              A plataforma que une clientes e prestadores de serviços.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Google OAuth (Optional / Visual Flair) */}
            <Button
              type="button"
              variant="outline"
              className="w-full py-3 text-sm text-slate-600 bg-white hover:bg-slate-50 border-slate-200 shadow-sm mb-6"
            >
              <svg className="w-4 h-4 mr-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continuar com Google
            </Button>

            <div className="flex items-center gap-4 mb-6 opacity-60">
              <div className="flex-1 h-px bg-slate-200"></div>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">ou use e-mail</span>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>

            <Input
              id="email"
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-slate-50 border-transparent shadow-inner text-sm py-3 focus:bg-white focus:ring-2 focus:ring-primary-500/20 transition-all"
            />

            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Palavra-passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-slate-50 border-transparent shadow-inner text-sm py-3 focus:bg-white focus:ring-2 focus:ring-primary-500/20 transition-all pr-12"
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                isLoading={loading}
                className="w-full py-3.5 shadow-lg shadow-primary-700/20 active:scale-[0.98]"
                size="lg"
              >
                {loading ? 'A autenticar...' : 'Entrar na Conta'}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Ao acessar, você concorda com nossos{' '}
              <a href="#" className="text-primary-700 hover:underline">Termos</a> e{' '}
              <a href="#" className="text-primary-700 hover:underline">Política de Privacidade</a>.
            </p>
          </div>

          <div className="mt-12 text-center">
             <button onClick={() => router.push('/forgot-password')} className="text-sm text-slate-500 font-medium hover:text-primary-700 transition-colors">
               Esqueceu a palavra-passe?
             </button>
          </div>
        </div>
      </section>

      {/* ── RIGHT COLUMN: Minimalist Brand Moment ────────────────── */}
      <section className="hidden lg:flex flex-1 bg-primary-50 relative overflow-hidden items-center justify-center p-12">
        {/* Soft background gradient shapes */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary-200/40 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary-300/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
          
          {/* Floating UI Widget (The "Signature") */}
          <div className="w-full bg-white/70 backdrop-blur-xl border border-white shadow-2xl shadow-primary-900/5 rounded-sm p-8 mb-16 relative">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-sm bg-primary-100 flex items-center justify-center text-primary-700">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 tracking-tight">Verificação de Qualidade</div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Prestadores Confiáveis</div>
                </div>
              </div>
              <div className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded-sm flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></div>
                Ativo
              </div>
            </div>

            <div className="space-y-5">
              {/* Provider Showcase (Generated Image) */}
              <div className="flex items-center gap-3.5 p-3 bg-slate-50/60 rounded-sm border border-slate-100/55">
                <div className="w-12 h-12 rounded-sm overflow-hidden relative shrink-0">
                  <Image 
                    src="/provider_avatar.png" 
                    alt="Prestador em Destaque" 
                    width={48} 
                    height={48} 
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-950 truncate">Mariana Silva</div>
                  <div className="text-[10px] text-slate-500 font-semibold truncate">TI & Suporte Técnico</div>
                  <div className="flex items-center gap-1 mt-1 text-[9px] font-extrabold text-primary-700">
                    <span>★ 4.9</span>
                    <span className="text-slate-300">•</span>
                    <span>142 Serviços Concluídos</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
                  <span>Índice de Satisfação (Match)</span>
                  <span className="text-primary-700">98%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 w-[98%] rounded-full"></div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1 border border-slate-100 rounded-sm p-3 bg-white/50">
                  <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Clientes Ativos</div>
                  <div className="text-sm font-extrabold text-slate-800">45.2K+</div>
                </div>
                <div className="flex-1 border border-slate-100 rounded-sm p-3 bg-white/50">
                  <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Serviços Concluídos</div>
                  <div className="text-sm font-extrabold text-slate-800">128K+</div>
                </div>
              </div>
            </div>
            
            {/* Glass reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent rounded-sm pointer-events-none"></div>
          </div>

          {/* Typography */}
          <div className="text-center space-y-4">
            <div className="w-8 h-8 mx-auto text-primary-300 flex justify-center">
               <Users size={32} strokeWidth={2} />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              A Ponte entre Necessidade e Talento
            </h2>
            <p className="text-sm text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
              Descubra os melhores profissionais para o seu projeto ou ofereça seus serviços para milhares de clientes, tudo em um só lugar.
            </p>
          </div>
          
          {/* Pagination dots indicator */}
          <div className="flex items-center gap-2 mt-10">
            <div className="w-6 h-1.5 rounded-full bg-primary-500"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-primary-200"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-primary-200"></div>
          </div>
        </div>
      </section>

    </main>
  );
}
