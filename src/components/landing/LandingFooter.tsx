import Image from 'next/image';
import Link from 'next/link';
import iconLogo from '@/assets/images/icon3.png';

export function LandingFooter() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand column */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-9 flex items-center justify-center bg-primary-700 rounded-xl p-1 shadow-md">
                <Image
                  src={iconLogo}
                  alt="Formocosta Logo"
                  className="w-full h-full object-contain brightness-0 invert"
                />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Formo<span className="text-primary-500">costa</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Conectamos clientes e profissionais com segurança, eficiência e controlo total.
            </p>
          </div>

          {/* Links column 1 */}
          <div className="space-y-3">
            <div className="text-white font-bold text-xs uppercase tracking-wider">Navegação</div>
            <ul className="space-y-2 text-xs">
              <li><a href="#inicio" className="hover:text-white transition-colors">Início</a></li>
              <li><a href="#vantagens" className="hover:text-white transition-colors">Vantagens</a></li>
              <li><a href="#como-funciona" className="hover:text-white transition-colors">Como Funciona</a></li>
              <li><a href="#para-quem" className="hover:text-white transition-colors">Para Quem É</a></li>
            </ul>
          </div>

          {/* Links column 2 */}
          <div className="space-y-3">
            <div className="text-white font-bold text-xs uppercase tracking-wider">Portais</div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/login" className="text-primary-400 font-semibold hover:underline">
                  Portal Backoffice / Gestão →
                </Link>
              </li>
              <li><a href="#download" className="hover:text-white transition-colors">App Android (Play Store)</a></li>
              <li><a href="#download" className="hover:text-white transition-colors">App iOS (App Store)</a></li>
            </ul>
          </div>

          {/* Support column */}
          <div className="space-y-3">
            <div className="text-white font-bold text-xs uppercase tracking-wider">Suporte & Contacto</div>
            <p className="text-xs text-slate-400">
              Dúvidas ou suporte técnico? Entre em contacto com a nossa equipa.
            </p>
            <div className="text-xs font-semibold text-white">
              suporte@formocosta.com
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} Formocosta. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-400 transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Política de Privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
