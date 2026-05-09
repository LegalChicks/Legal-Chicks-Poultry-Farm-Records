import React, { useState, useEffect } from 'react';
import { getRecords, saveRecord, BaseRecord } from '../lib/db';
import { format } from 'date-fns';
import { Plus, Check, CloudOff, Cloud, AlertTriangle, Search } from 'lucide-react';
import { cn } from '../lib/utils';

// | Date | Batch | Bird ID/Count | Age | Cause of Death | Symptoms Observed | Necropsy Done? | Disposal Method | Reported To |
interface MortalityRecord {
  date: string;
  batch: string;
  count: number;
  age: string;
  cause: string;
  symptoms: string;
  necropsy: boolean;
  disposalMethod: 'Burial with Lime' | 'Incineration' | 'DA-Approved Disposal' | 'Other';
  reportedTo: string;
}

type MortRecord = MortalityRecord & BaseRecord;

export default function MortalityView() {
  const [records, setRecords] = useState<MortRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  
  const [formData, setFormData] = useState<MortalityRecord>({
    date: format(new Date(), 'yyyy-MM-dd'),
    batch: 'Batch 1',
    count: 1,
    age: '18 Weeks',
    cause: '',
    symptoms: '',
    necropsy: false,
    disposalMethod: 'Burial with Lime',
    reportedTo: ''
  });

  const loadRecords = async () => {
    const data = await getRecords<MortalityRecord>('mortality');
    setRecords(data.sort((a, b) => b.createdAt - a.createdAt));
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveRecord('mortality', formData);
    setIsAdding(false);
    loadRecords();
    setFormData(prev => ({...prev, count: 1, cause: '', symptoms: ''}));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Mortality & Culling</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Track flock health, causes of death, and biosecurity measures</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-red-200"
        >
          {isAdding ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isAdding ? 'CANCEL ENTRY' : 'RECORD MORTALITY'}
        </button>
      </div>

      {isAdding && (
        <section className="bg-red-50/50 p-6 rounded-3xl shadow-sm border border-red-200 flex flex-col animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2 mb-6 text-red-900">
             <AlertTriangle className="text-red-600 w-5 h-5" />
             <h2 className="text-lg font-bold">Record Bird Loss</h2>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="space-y-1">
              <label className="block text-xs font-bold text-red-900/60 uppercase tracking-tighter">Date</label>
              <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-3 bg-white border border-red-200 rounded-xl text-sm focus:ring-red-500 focus:border-red-500 outline-none" />
            </div>
            
            <div className="space-y-1">
              <label className="block text-xs font-bold text-red-900/60 uppercase tracking-tighter">Batch / Coop</label>
              <input type="text" required value={formData.batch} onChange={e => setFormData({...formData, batch: e.target.value})} className="w-full p-3 bg-white border border-red-200 rounded-xl text-sm focus:ring-red-500 focus:border-red-500 outline-none" />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-red-900 uppercase tracking-tighter">Bird Count</label>
              <input type="number" min="1" required value={formData.count} onChange={e => setFormData({...formData, count: parseInt(e.target.value) || 1})} className="w-full p-3 bg-white border border-red-300 rounded-xl font-bold text-red-700 text-sm focus:ring-red-500 focus:border-red-500 outline-none" />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-red-900/60 uppercase tracking-tighter">Age</label>
              <input type="text" required value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full p-3 bg-white border border-red-200 rounded-xl text-sm focus:ring-red-500 outline-none" placeholder="e.g. 18 Weeks" />
            </div>

            <div className="space-y-1 lg:col-span-2">
              <label className="block text-xs font-bold text-red-900/60 uppercase tracking-tighter">Symptoms Observed</label>
              <input type="text" value={formData.symptoms} onChange={e => setFormData({...formData, symptoms: e.target.value})} className="w-full p-3 bg-white border border-red-200 rounded-xl text-sm focus:ring-red-500 outline-none" placeholder="e.g. Lethargy, ruffled feathers, poor appetite" />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-red-900/60 uppercase tracking-tighter">Suspected Cause</label>
              <input type="text" value={formData.cause} onChange={e => setFormData({...formData, cause: e.target.value})} className="w-full p-3 bg-white border border-red-200 rounded-xl text-sm focus:ring-red-500 outline-none" placeholder="e.g. Coccidiosis, Heat Stress" />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-red-900/60 uppercase tracking-tighter">Disposal Method</label>
              <select value={formData.disposalMethod} onChange={e => setFormData({...formData, disposalMethod: e.target.value as any})} className="w-full p-3 bg-white border border-red-200 rounded-xl text-sm focus:ring-red-500 outline-none">
                <option value="Burial with Lime">Burial with Lime</option>
                <option value="Incineration">Incineration</option>
                <option value="DA-Approved Disposal">DA-Approved Disposal</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1 flex items-end pb-2">
              <label className="flex items-center gap-3 cursor-pointer p-3 bg-white border border-red-200 rounded-xl w-full">
                <input type="checkbox" checked={formData.necropsy} onChange={e => setFormData({...formData, necropsy: e.target.checked})} className="rounded text-red-600 focus:ring-red-500 w-5 h-5 border-red-300" />
                <span className="text-xs font-bold text-red-900 uppercase tracking-tighter">Necropsy Performed?</span>
              </label>
            </div>

            <div className="lg:col-span-3 pt-2">
               <button type="submit" className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-200 hover:bg-red-700 transition-colors">
                SAVE MORTALITY RECORD
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Table */}
      <section className="bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-900">Recent Mortality Logs</h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filter by Batch / Coop..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-red-500 focus:border-red-500 outline-none"
            />
          </div>
        </div>
        <div className="flex-1 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Date</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Batch / Age</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase text-center text-red-500">Count</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Symptoms / Cause</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Disposal & Actions</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {records.filter(r => r.batch.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500 text-sm">No mortality records found. Good keeping!</td></tr>
              ) : (
                records
                  .filter(r => r.batch.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(r => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-medium text-slate-900 whitespace-nowrap">{format(new Date(r.date), 'MMM d, y')}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-700 text-xs">{r.batch}</div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase">{r.age}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <span className="inline-flex items-center justify-center px-2 py-1 rounded-md text-[10px] font-bold bg-red-100 text-red-700">
                         {r.count} LOST
                       </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-900 text-xs font-bold truncate max-w-[200px]" title={r.cause}>{r.cause || 'Unknown'}</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[200px]" title={r.symptoms}>{r.symptoms || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-700 text-[10px] font-bold flex flex-col gap-1 uppercase">
                        <span className="text-slate-500">Method: <span className="text-slate-700">{r.disposalMethod}</span></span>
                        {r.necropsy && <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md w-max">Necropsy Done</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {r.syncStatus === 'synced' ? (
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Synced</span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Pending</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
