import { Smartphone } from 'lucide-react';

export function DownloadBanner() {
  return (
    <section id="download" className="py-20 bg-primary-900 text-white relative overflow-hidden">
      {/* Background Decorative Circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-700/40 rounded-full blur-3xl -z-0" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-r from-primary-800 to-primary-900 rounded-3xl p-8 sm:p-14 border border-primary-700/50 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-10">
          
          {/* CTA Text */}
          <div className="space-y-6 max-w-xl">
            <span className="px-3.5 py-1.5 rounded-full bg-primary-700 text-primary-200 font-bold text-xs uppercase tracking-wider border border-primary-600">
              Disponível Agora
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Experimente a App Formocosta Hoje Mesmo
            </h2>
            <p className="text-primary-100 text-base sm:text-lg leading-relaxed">
              Descarregue gratuitamente e tenha o melhor catálogo de serviços e profissionais qualificados sempre à mão.
            </p>
            
            {/* Store Buttons */}
            <div className="pt-2 flex flex-wrap gap-4">
              
              <a
                href="#"
                className="bg-white text-slate-900 hover:bg-slate-100 px-6 py-3.5 rounded-2xl flex items-center gap-3 shadow-lg transition-all font-bold text-sm"
              >
                <svg className="w-6 h-6 fill-current text-primary-700" viewBox="0 0 24 24">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                <span>Google Play</span>
              </a>

              <a
                href="#"
                className="bg-white text-slate-900 hover:bg-slate-100 px-6 py-3.5 rounded-2xl flex items-center gap-3 shadow-lg transition-all font-bold text-sm"
              >
                <svg className="w-6 h-6 fill-current text-primary-700" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.64 1.35-.57.66-1.07 1.73-.93 2.76 1.01.08 2.03-.51 2.65-1.26z" />
                </svg>
                <span>App Store</span>
              </a>

            </div>
          </div>

          {/* QR Code Graphic */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 flex flex-col items-center text-center space-y-3">
            <div className="w-32 h-32 bg-white rounded-2xl p-2 shadow-inner flex items-center justify-center">
              <div className="w-full h-full border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400">
                <Smartphone size={32} className="text-primary-700 mb-1" />
                <span className="text-[9px] font-bold text-slate-600">QR CODE APP</span>
              </div>
            </div>
            <span className="text-xs text-primary-100 font-medium">Aponte a câmara do telemóvel para descarregar</span>
          </div>

        </div>
      </div>
    </section>
  );
}
