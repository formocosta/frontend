'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Download, Menu, X } from 'lucide-react';
import iconLogo from '@/assets/images/icon2.png';

export function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#f4f2e6] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center group">
          <Image
            src={iconLogo}
            alt="Formocosta Logo"
            className="w-42 h-12 object-contain group-hover:scale-105 transition-transform"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-700">
          <a href="#inicio" className="text-slate-900 font-semibold border-b-2 border-slate-900 pb-0.5">Home</a>
          <a href="#vantagens" className="hover:text-primary-700 transition-colors">Features</a>
          <a href="#como-funciona" className="hover:text-primary-700 transition-colors">Services</a>
          <a href="#depoimentos" className="hover:text-primary-700 transition-colors">Reviews</a>
          <a href="#equipa" className="hover:text-primary-700 transition-colors">Team</a>
          <a href="#precos" className="hover:text-primary-700 transition-colors">Pricing</a>
          <a href="#contacto" className="hover:text-primary-700 transition-colors">Contact</a>
        </nav>

        {/* Header Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#download"
            className="bg-[#02562b] hover:bg-[#014220] text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2 active:scale-95"
          >
            <span>Download App</span>
            <span className="text-xs">›</span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-3 font-medium text-slate-700">
            <a
              href="#inicio"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-900 font-semibold"
            >
              Início
            </a>
            <a
              href="#vantagens"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              Vantagens
            </a>
            <a
              href="#como-funciona"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              Como Funciona
            </a>
            <a
              href="#para-quem"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              Para Quem É
            </a>
            <a
              href="#depoimentos"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              Avaliações
            </a>
          </nav>
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/login"
              className="w-full text-center py-2.5 text-sm font-semibold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50"
            >
              Aceder ao Backoffice
            </Link>
            <a
              href="#download"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-sm font-semibold text-white bg-primary-700 rounded-xl shadow"
            >
              Baixar Aplicativo Móvel
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
