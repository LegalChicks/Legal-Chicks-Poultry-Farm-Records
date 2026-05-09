import React, { useState, useEffect } from 'react';
import { getRecords, saveRecord, BaseRecord } from '../lib/db';
import { format } from 'date-fns';
import { Plus, Check, CloudOff, Cloud, Calculator, Search } from 'lucide-react';
import { cn } from '../lib/utils';

// | Date | Feed Type | Batch | Bags Opened | Total KG Used | Birds Fed | Estimated Intake/Bird | Remaining Stock | Notes |
interface FeedConsumption {
  date: string;
  feedType: string;
  batch: string;
  bagsOpened: number;
  totalKg: number;
  birdsFed: number;
  eggMassOrWeightGain: number; // for FCR
  remainingStock: number;
  notes: string;
}

type FeedRecord = FeedConsumption & BaseRecord;

export default function FeedConsumptionView() {
  const [records, setRecords] = useState<FeedRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  
  const [formData, setFormData] = useState<FeedConsumption>({
    date: format(new Date(), 'yyyy-MM-dd'),
    feedType: 'Layer Mash',
    batch: 'Batch 1',
    bagsOpened: 0,
    totalKg: 0,
    birdsFed: 0,
    eggMassOrWeightGain: 0,
    remainingStock: 0,
    notes: ''
  });

  const loadRecords = async () => {
    const data = await getRecords<FeedConsumption>('feed');
    setRecords(data.sort((a, b) => b.createdAt - a.createdAt));
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveRecord('feed', formData);
    setIsAdding(false);
    loadRecords();
  };

  const calculateIntake = (kg: number, birds: number) => {
    if (birds === 0) return 0;
    return ((kg * 1000) / birds).toFixed(0); // grams per bird
  };

  const calculateFCR = (kgFeed: number, kgOutput: number) => {
    if (kgOutput === 0) return 0;
    return (kgFeed / kgOutput).toFixed(2);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Feed Consumption</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Track feed usage, conversion ratio, and inventory</p>
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
            Record Feed Usage
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-tighter">Date</label>
              <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
            </div>
            
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-tighter">Feed Type</label>
              <input type="text" required value={formData.feedType} onChange={e => setFormData({...formData, feedType: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-tighter">Batch / Pen</label>
              <input type="text" required value={formData.batch} onChange={e => setFormData({...formData, batch: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-tighter">Birds Fed</label>
              <input type="number" min="0" required value={formData.birdsFed} onChange={e => setFormData({...formData, birdsFed: parseInt(e.target.value) || 0})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-tighter">Total KG Used</label>
              <input type="number" step="0.1" min="0" required value={formData.totalKg} onChange={e => setFormData({...formData, totalKg: parseFloat(e.target.value) || 0})} className="w-full p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none text-emerald-700 font-bold" />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-tighter">Output Mass (KG) <span className="opacity-70">(FCR)</span></label>
              <input type="number" step="0.1" min="0" value={formData.eggMassOrWeightGain} onChange={e => setFormData({...formData, eggMassOrWeightGain: parseFloat(e.target.value) || 0})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-emerald-500 outline-none" placeholder="Egg mass or gain" />
            </div>
            
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-tighter">Bags Opened</label>
              <input type="number" min="0" value={formData.bagsOpened} onChange={e => setFormData({...formData, bagsOpened: parseInt(e.target.value) || 0})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-emerald-500 outline-none" />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-tighter">Remaining Stock (Bags)</label>
              <input type="number" min="0" value={formData.remainingStock} onChange={e => setFormData({...formData, remainingStock: parseInt(e.target.value) || 0})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-emerald-500 outline-none" />
            </div>

            <div className="space-y-1 lg:col-span-4">
               <label className="block text-xs font-bold text-slate-500 uppercase tracking-tighter">Notes & Observations</label>
               <input type="text" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-emerald-500 outline-none" placeholder="e.g. Birds eating less due to heat" />
            </div>

            <div className="lg:col-span-4 pt-2">
               <div className="text-xs font-bold text-slate-500 flex items-center justify-end gap-2 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                 <Calculator className="w-4 h-4 text-emerald-600" />
                 <span>EST. INTAKE/BIRD: <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">{calculateIntake(formData.totalKg, formData.birdsFed)}g</span></span>
               </div>
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
          <h2 className="text-lg font-bold">Recent Feed Logs</h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filter by Batch / Pen..." 
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
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Batch</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Feed Type</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">KG Used</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase text-blue-500">Intake/Bird</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase text-indigo-500">FCR</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Stock</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {records.filter(r => r.batch.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 ? (
                <tr><td colSpan={8} className="px-6 py-12 text-center text-slate-500 text-sm">No feed records found.</td></tr>
              ) : (
                records
                  .filter(r => r.batch.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(r => {
                  const intake = Number(calculateIntake(r.totalKg, r.birdsFed));
                  const fcr = Number(calculateFCR(r.totalKg, r.eggMassOrWeightGain));
                  
                  return (
                    <tr key={r.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 text-xs font-medium text-slate-900 whitespace-nowrap">{format(new Date(r.date), 'MMM d, y')}</td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-700">{r.batch}</td>
                      <td className="px-6 py-4 text-xs text-slate-600">{r.feedType}</td>
                      <td className="px-6 py-4 text-xs font-bold text-emerald-700">{r.totalKg} kg</td>
                      <td className="px-6 py-4 text-xs font-bold text-blue-600">{intake > 0 ? `${intake} g` : '-'}</td>
                      <td className="px-6 py-4 text-xs font-bold text-indigo-600">{fcr > 0 ? fcr : '-'}</td>
                      <td className="px-6 py-4 text-xs text-slate-600">{r.remainingStock} bags</td>
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
