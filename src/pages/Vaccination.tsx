import React, { useState, useEffect } from 'react';
import { getRecords, saveRecord, BaseRecord } from '../lib/db';
import { format } from 'date-fns';
import { Plus, Check, CloudOff, Cloud, Syringe } from 'lucide-react';

interface VaccinationRecord {
  date: string;
  vaccine: string;
  batch: string;
  dosage: string;
  route: string;
  administeredBy: string;
  nextSchedule: string;
  notes: string;
}

type VacRecord = VaccinationRecord & BaseRecord;

export default function VaccinationView() {
  const [records, setRecords] = useState<VacRecord[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  
  const [formData, setFormData] = useState<VaccinationRecord>({
    date: format(new Date(), 'yyyy-MM-dd'),
    vaccine: 'ND Vaccine',
    batch: 'Batch 1',
    dosage: '1 dose/bird',
    route: 'Drinking Water',
    administeredBy: '',
    nextSchedule: '',
    notes: ''
  });

  const loadRecords = async () => {
    const data = await getRecords<VaccinationRecord>('vaccination');
    setRecords(data.sort((a, b) => b.createdAt - a.createdAt));
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveRecord('vaccination', formData);
    setIsAdding(false);
    loadRecords();
    setFormData(prev => ({...prev, notes: ''}));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Vaccination & Medication</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Track flock treatments and compliance.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-200"
        >
          {isAdding ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isAdding ? 'CANCEL ENTRY' : 'NEW ENTRY'}
        </button>
      </div>

      {isAdding && (
        <section className="bg-indigo-50/50 p-6 rounded-3xl shadow-sm border border-indigo-200 flex flex-col animate-in slide-in-from-top-4 duration-300">
           <div className="flex items-center gap-2 mb-6">
             <Syringe className="text-indigo-600 w-5 h-5" />
             <h2 className="text-lg font-bold text-indigo-900">Record Medical Treatment</h2>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-indigo-900/60 uppercase tracking-tighter">Date</label>
              <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-3 bg-white border border-indigo-200 rounded-xl text-sm focus:ring-indigo-500 outline-none" />
            </div>
            
            <div className="space-y-1">
              <label className="block text-xs font-bold text-indigo-900/60 uppercase tracking-tighter">Vaccine / Med</label>
              <input type="text" required value={formData.vaccine} onChange={e => setFormData({...formData, vaccine: e.target.value})} className="w-full p-3 bg-white border border-indigo-200 rounded-xl text-sm focus:ring-indigo-500 outline-none" />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-indigo-900/60 uppercase tracking-tighter">Batch / Coop</label>
              <input type="text" required value={formData.batch} onChange={e => setFormData({...formData, batch: e.target.value})} className="w-full p-3 bg-white border border-indigo-200 rounded-xl text-sm focus:ring-indigo-500 outline-none" />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-indigo-900/60 uppercase tracking-tighter">Dosage</label>
              <input type="text" required value={formData.dosage} onChange={e => setFormData({...formData, dosage: e.target.value})} className="w-full p-3 bg-white border border-indigo-200 rounded-xl text-sm focus:ring-indigo-500 outline-none" />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-indigo-900/60 uppercase tracking-tighter">Admin Route</label>
              <select value={formData.route} onChange={e => setFormData({...formData, route: e.target.value})} className="w-full p-3 bg-white border border-indigo-200 rounded-xl text-sm focus:ring-indigo-500 outline-none">
                <option>Drinking Water</option>
                <option>Injection (IM)</option>
                <option>Eye Drop</option>
                <option>Feed Mix</option>
                <option>Spray</option>
                <option>Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-indigo-900/60 uppercase tracking-tighter">Administered By</label>
              <input type="text" required value={formData.administeredBy} onChange={e => setFormData({...formData, administeredBy: e.target.value})} className="w-full p-3 bg-white border border-indigo-200 rounded-xl text-sm focus:ring-indigo-500 outline-none" />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-indigo-900/60 uppercase tracking-tighter">Next Schedule (Optional)</label>
              <input type="date" value={formData.nextSchedule} onChange={e => setFormData({...formData, nextSchedule: e.target.value})} className="w-full p-3 bg-white border border-indigo-200 rounded-xl text-sm focus:ring-indigo-500 outline-none" />
            </div>

            <div className="space-y-1 lg:col-span-4">
              <label className="block text-xs font-bold text-indigo-900/60 uppercase tracking-tighter">Notes</label>
              <input type="text" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full p-3 bg-white border border-indigo-200 rounded-xl text-sm focus:ring-indigo-500 outline-none" />
            </div>

            <div className="lg:col-span-4 pt-2">
               <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors">
                SAVE TREATMENT RECORD
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Table */}
      <section className="bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Recent Treatments</h2>
        </div>
        <div className="flex-1 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Date</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Treatment</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Batch</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Dosage / Route</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">By</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase text-indigo-500">Next Due</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {records.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-500 text-sm">No vaccination records yet.</td></tr>
              ) : (
                records.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-medium text-slate-900 whitespace-nowrap">{format(new Date(r.date), 'MMM d, y')}</td>
                    <td className="px-6 py-4 text-xs font-bold text-indigo-700">{r.vaccine}</td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-700">{r.batch}</td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-slate-600 font-bold">{r.dosage}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">{r.route}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600">{r.administeredBy}</td>
                    <td className="px-6 py-4 text-xs font-bold text-indigo-600">{r.nextSchedule ? format(new Date(r.nextSchedule), 'MMM d, y') : '-'}</td>
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
