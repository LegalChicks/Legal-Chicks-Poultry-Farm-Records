import React, { useState, useEffect } from 'react';
import { getRecords, saveRecord, BaseRecord } from '../lib/db';
import { format } from 'date-fns';
import { Plus, Check, CloudOff, Cloud } from 'lucide-react';
import { cn } from '../lib/utils';

interface DailyLog {
  date: string;
  weather: string;
  staffPresent: string;
  totalFlock: number;
  totalEggs: number;
  mortality: number;
  feedUsed: number;
  observations: string;
}

type LogRecord = DailyLog & BaseRecord;

export default function Dashboard() {
  const [logs, setLogs] = useState<LogRecord[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState<DailyLog>({
    date: format(new Date(), 'yyyy-MM-dd'),
    weather: 'Sunny',
    staffPresent: '',
    totalFlock: 0,
    totalEggs: 0,
    mortality: 0,
    feedUsed: 0,
    observations: ''
  });

  const loadLogs = async () => {
    const data = await getRecords<DailyLog>('daily');
    setLogs(data.sort((a, b) => b.createdAt - a.createdAt));
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveRecord('daily', formData);
    setIsAdding(false);
    loadLogs();
    // Reset form mostly
    setFormData(prev => ({
      ...prev,
      observations: '',
      mortality: 0,
      feedUsed: 0,
      totalEggs: 0,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Master Farm Logbook</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Central command record</p>
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
            Record Daily Log
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-tighter">Date</label>
              <input 
                type="date" 
                required 
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-tighter">Weather</label>
              <select 
                value={formData.weather}
                onChange={e => setFormData({...formData, weather: e.target.value})}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              >
                <option>Sunny</option>
                <option>Cloudy</option>
                <option>Rainy</option>
                <option>Stormy</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-tighter">Staff Present</label>
              <input 
                type="text" 
                required
                placeholder="Juan, Maria"
                value={formData.staffPresent}
                onChange={e => setFormData({...formData, staffPresent: e.target.value})}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
            
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-tighter">Total Active Flock</label>
              <input 
                type="number" 
                min="0"
                required
                value={formData.totalFlock}
                onChange={e => setFormData({...formData, totalFlock: parseInt(e.target.value) || 0})}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-tighter">Total Eggs Collected</label>
              <input 
                type="number" 
                min="0"
                required
                value={formData.totalEggs}
                onChange={e => setFormData({...formData, totalEggs: parseInt(e.target.value) || 0})}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-tighter">Mortality</label>
              <input 
                 type="number" 
                 min="0"
                 required
                 value={formData.mortality}
                 onChange={e => setFormData({...formData, mortality: parseInt(e.target.value) || 0})}
                 className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-red-500 focus:border-red-500 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-tighter">Feed Used (kg)</label>
              <input 
                 type="number" 
                 min="0"
                 step="0.1"
                 required
                 value={formData.feedUsed}
                 onChange={e => setFormData({...formData, feedUsed: parseFloat(e.target.value) || 0})}
                 className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>

            <div className="space-y-1 lg:col-span-2">
               <label className="block text-xs font-bold text-slate-500 uppercase tracking-tighter">Unusual Observations</label>
               <input 
                 type="text" 
                 placeholder="e.g. Some hens look lethargic in Pen 3"
                 value={formData.observations}
                 onChange={e => setFormData({...formData, observations: e.target.value})}
                 className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none"
               />
            </div>

            <div className="lg:col-span-3 pt-2">
              <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200">
                SAVE LOCAL RECORD
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Logs Table */}
      <section className="bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold">Recent Operations Logs</h2>
        </div>
        <div className="flex-1 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Date</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Weather</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Flock</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Eggs</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Mortality</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Feed (kg)</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 text-sm">
                    No logs recorded yet. Create your first entry above.
                  </td>
                </tr>
              ) : (
                logs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-xs font-medium text-slate-900 whitespace-nowrap">
                      {format(new Date(log.date), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-700">{log.weather}</td>
                    <td className="px-6 py-4 text-xs text-slate-600">{log.totalFlock.toLocaleString()}</td>
                    <td className="px-6 py-4 text-xs text-slate-600 font-bold">{log.totalEggs.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      {log.mortality > 0 ? (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-[10px] font-bold">
                          {log.mortality} LOST
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-[10px] font-bold">
                          0 LOST
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600">{log.feedUsed}</td>
                    <td className="px-6 py-4 text-right">
                      {log.syncStatus === 'synced' ? (
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
