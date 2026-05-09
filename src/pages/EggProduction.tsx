import React, { useState, useEffect } from 'react';
import { getRecords, saveRecord, BaseRecord } from '../lib/db';
import { format } from 'date-fns';
import { Plus, Check, CloudOff, Cloud, TrendingUp, TrendingDown, Search } from 'lucide-react';
import { cn } from '../lib/utils';

// | Date | Coop/Pen | Number of Hens | Eggs Collected | Cracked Eggs | Dirty Eggs | Fertile Eggs | Saleable Eggs | Notes |
interface EggProduction {
  date: string;
  coop: string;
  hens: number;
  collected: number;
  cracked: number;
  dirty: number;
  fertile: number;
  saleable: number;
  notes: string;
}

type EggRecord = EggProduction & BaseRecord;

export default function EggProductionView() {
  const [records, setRecords] = useState<EggRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  
  const [formData, setFormData] = useState<EggProduction>({
    date: format(new Date(), 'yyyy-MM-dd'),
    coop: 'Pen 1',
    hens: 100,
    collected: 0,
    cracked: 0,
    dirty: 0,
    fertile: 0,
    saleable: 0,
    notes: ''
  });

  const loadRecords = async () => {
    const data = await getRecords<EggProduction>('eggs');
    setRecords(data.sort((a, b) => b.createdAt - a.createdAt));
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveRecord('eggs', formData);
    setIsAdding(false);
    loadRecords();
  };

  // Calculate efficiency
  const calculateEfficiency = (collected: number, hens: number) => {
    if (hens === 0) return 0;
    return ((collected / hens) * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Daily Egg Production</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Track laying rate, fertility, and quality</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-emerald-200"
        >
          {isAdding ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isAdding ? 'CANCEL ENTRY' : 'NEW ENTRY'}
        </button>
      </div>

      {isAdding && (
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col animate-in slide-in-from-top-4 duration-300">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-900">
            Record Egg Collection
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-tighter">Date</label>
              <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
            </div>
            
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-tighter">Coop / Pen</label>
              <input type="text" required value={formData.coop} onChange={e => setFormData({...formData, coop: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-tighter">Number of Hens</label>
              <input type="number" min="0" required value={formData.hens} onChange={e => setFormData({...formData, hens: parseInt(e.target.value) || 0})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-tighter">Total Collected</label>
              <input type="number" min="0" required value={formData.collected} onChange={e => setFormData({...formData, collected: parseInt(e.target.value) || 0})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-red-500 uppercase tracking-tighter">Cracked Eggs</label>
              <input type="number" min="0" value={formData.cracked} onChange={e => setFormData({...formData, cracked: parseInt(e.target.value) || 0})} className="w-full p-3 bg-red-50/50 border border-red-200 rounded-xl text-sm focus:ring-red-500 focus:border-red-500 outline-none text-red-700" />
            </div>
            
            <div className="space-y-1">
              <label className="block text-xs font-bold text-amber-500 uppercase tracking-tighter">Dirty Eggs</label>
              <input type="number" min="0" value={formData.dirty} onChange={e => setFormData({...formData, dirty: parseInt(e.target.value) || 0})} className="w-full p-3 bg-amber-50/50 border border-amber-200 rounded-xl text-sm focus:ring-amber-500 focus:border-amber-500 outline-none text-amber-700" />
            </div>
            
            <div className="space-y-1">
              <label className="block text-xs font-bold text-indigo-500 uppercase tracking-tighter">Fertile Eggs</label>
              <input type="number" min="0" value={formData.fertile} onChange={e => setFormData({...formData, fertile: parseInt(e.target.value) || 0})} className="w-full p-3 bg-indigo-50/50 border border-indigo-200 rounded-xl text-sm focus:ring-indigo-500 focus:border-indigo-500 outline-none text-indigo-700" />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-emerald-500 uppercase tracking-tighter">Saleable Eggs</label>
              <input type="number" min="0" value={formData.saleable} onChange={e => setFormData({...formData, saleable: parseInt(e.target.value) || 0})} className="w-full p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl text-sm font-bold focus:ring-emerald-500 focus:border-emerald-500 outline-none text-emerald-700" />
            </div>

            <div className="space-y-1 lg:col-span-4">
               <label className="block text-xs font-bold text-slate-500 uppercase tracking-tighter">Notes & Observations</label>
               <input type="text" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-emerald-500 outline-none" />
            </div>

            <div className="lg:col-span-4 pt-2">
              <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200">
                SAVE LOCAL RECORD
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Table */}
      <section className="bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold">Recent Collection Logs</h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filter by Coop / Pen..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>
        </div>
        <div className="flex-1 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Date</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Coop</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Hens</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Collected</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Efficiency</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase text-red-500">Cracked</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase text-emerald-500">Saleable</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {records.filter(r => r.coop.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 ? (
                <tr><td colSpan={8} className="px-6 py-12 text-center text-slate-500 text-sm">No production records found.</td></tr>
              ) : (
                records
                  .filter(r => r.coop.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(r => {
                  const efficiency = parseFloat(calculateEfficiency(r.collected, r.hens));
                  const isGood = efficiency >= 80;
                  const isWarning = efficiency < 70;
                  
                  return (
                    <tr key={r.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 text-xs font-medium text-slate-900 whitespace-nowrap">{format(new Date(r.date), 'MMM d, y')}</td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-700">{r.coop}</td>
                      <td className="px-6 py-4 text-xs text-slate-600">{r.hens}</td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-900">{r.collected}</td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold",
                          isGood ? "bg-emerald-100 text-emerald-700" : 
                          isWarning ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                        )}>
                          {efficiency}%
                          {isGood && <TrendingUp className="w-3 h-3" />}
                          {isWarning && <TrendingDown className="w-3 h-3" />}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-red-600 font-bold">{r.cracked}</td>
                      <td className="px-6 py-4 text-xs text-emerald-600 font-bold">{r.saleable}</td>
                      <td className="px-6 py-4 text-right">
                        {r.syncStatus === 'synced' ? (
                          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Synced</span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Pending</span>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
