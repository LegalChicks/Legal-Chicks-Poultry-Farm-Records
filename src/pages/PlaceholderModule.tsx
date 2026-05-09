import React from 'react';
import { Construction } from 'lucide-react';

export default function PlaceholderModule({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-slate-200">
        <Construction className="w-10 h-10 text-slate-400" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">{title}</h1>
      <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] max-w-sm mb-8">
        This module is currently under development. It will support offline syncing capabilities when released.
      </p>
      <button className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-2xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm">
        GO BACK
      </button>
    </div>
  );
}
