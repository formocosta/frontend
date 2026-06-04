'use client';

import { ArrowLeftRight } from 'lucide-react';

export default function RepassesPage() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100/80 min-h-[400px] flex flex-col justify-center items-center text-center">
      <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4 shadow-sm">
        <ArrowLeftRight size={20} />
      </div>
      <h2 className="text-lg font-bold text-gray-900">Repasses</h2>
      <p className="text-xs text-gray-400 mt-1.5 max-w-sm font-medium">
        Esta página está em desenvolvimento. Brevemente poderá gerir transferências, repasses para prestadores e conciliação bancária.
      </p>
    </div>
  );
}
