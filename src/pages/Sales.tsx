import React, { useState, useEffect } from 'react';
import { getRecords, saveRecord, BaseRecord } from '../lib/db';
import { format } from 'date-fns';
import { Plus, Check, CloudOff, Cloud, Banknote, Search } from 'lucide-react';
import { cn } from '../lib/utils';

interface SalesRecord {
  date: string;
  buyer: string;
  product: string;
  quantity: number;
  price: number;
  discount: number;
  paymentMethod: string;
  status: 'Paid' | 'Unpaid' | 'Partial';
}

type SaleRecord = SalesRecord & BaseRecord;

export default function SalesView() {
  const [records, setRecords] = useState<SaleRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  
  const [formData, setFormData] = useState<SalesRecord>({
    date: format(new Date(), 'yyyy-MM-dd'),
    buyer: '',
    product: 'Table Eggs',
    quantity: 1,
    price: 0,
    discount: 0,
    paymentMethod: 'Cash',
    status: 'Paid'
  });

  const loadRecords = async () => {
    const data = await getRecords<SalesRecord>('sales');
    setRecords(data.sort((a, b) => b.createdAt - a.createdAt));
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveRecord('sales', formData);
    setIsAdding(false);
    loadRecords();
    setFormData(prev => ({...prev, buyer: '', quantity: 1, price: 0, discount: 0}));
  };

  const calculateTotal = (qty: number, price: number, discount: number) => {
    return (qty * price) - discount;
  };

  const grandTotal = records.reduce((acc, r) => acc + calculateTotal(r.quantity, r.price, r.discount), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Sales Record</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Track all farm income.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          <div className="bg-emerald-50 text-emerald-800 px-4 py-2 rounded-xl border border-emerald-100 flex items-center justify-between sm:justify-start gap-4">
            <span className="text-[10px] font-bold uppercase tracking-widest">Total Revenue</span>
            <span className="text-lg font-bold">₱{grandTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          </div>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="flex-1 sm:flex-none justify-center bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-emerald-200"
          >
            {isAdding ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isAdding ? 'CANCEL ENTRY' : 'NEW SALE'}
          </button>
        </div>
      </div>

      {isAdding && (
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2 mb-6">
             <Banknote className="text-emerald-500 w-5 h-5" />
             <h2 className="text-lg font-bold text-slate-900">Record New Sale</h2>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-tighter">Date</label>
              <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
            </div>
            
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-tighter">Buyer Name</label>
              <input type="text" required value={formData.buyer} onChange={e => setFormData({...formData, buyer: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-tighter">Product</label>
              <select value={formData.product} onChange={e => setFormData({...formData, product: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                <option>Table Eggs</option>
                <option>Fertile Eggs</option>
                <option>Day-Old Chicks</option>
                <option>Growers</option>
                <option>Roosters</option>
                <option>Manure</option>
                <option>Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-tighter">Quantity</label>
              <input type="number" min="1" step="0.01" required value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseFloat(e.target.value) || 0})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-tighter">Unit Price (₱)</label>
              <input type="number" min="0" step="0.01" required value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value) || 0})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-tighter">Discount (₱)</label>
              <input type="number" min="0" step="0.01" value={formData.discount} onChange={e => setFormData({...formData, discount: parseFloat(e.target.value) || 0})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-tighter">Payment Method</label>
              <select value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                <option>Cash</option>
                <option>GCash</option>
                <option>Bank Transfer</option>
                <option>Check</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-tighter">Payment Status</label>
               <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                <option>Paid</option>
                <option>Unpaid</option>
                <option>Partial</option>
              </select>
            </div>

            <div className="lg:col-span-4 pt-4 border-t border-slate-100 flex flex-col gap-4">
               <div className="text-xs font-bold text-slate-500 flex items-center justify-end gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                 <span className="uppercase tracking-widest text-[#10b981]">Net Total</span>
                 <strong className="text-2xl font-black text-slate-900">₱{calculateTotal(formData.quantity, formData.price, formData.discount).toLocaleString(undefined, {minimumFractionDigits: 2})}</strong>
               </div>
              <button type="submit" className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 transition-colors">
                SAVE LOCAL RECORD
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Table */}
      <section className="bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-900">Recent Sales</h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filter by Buyer or Product..." 
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
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Buyer</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Product / Qty</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Price/Unit</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Net Total</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Method/Status</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase text-right">Sync</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {records.filter(r => r.buyer.toLowerCase().includes(searchTerm.toLowerCase()) || r.product.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-500 text-sm">No sales recorded yet.</td></tr>
              ) : (
                records
                  .filter(r => r.buyer.toLowerCase().includes(searchTerm.toLowerCase()) || r.product.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(r => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-medium text-slate-900 whitespace-nowrap">{format(new Date(r.date), 'MMM d, y')}</td>
                    <td className="px-6 py-4 text-xs font-bold text-emerald-800">{r.buyer}</td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-slate-900">{r.product}</div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase">Qty: {r.quantity}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600">₱{r.price.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">₱{calculateTotal(r.quantity, r.price, r.discount).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                    <td className="px-6 py-4 flex flex-col gap-1 items-start">
                       <span className="text-[10px] font-bold text-slate-500 uppercase">{r.paymentMethod}</span>
                       <span className={cn(
                         "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider",
                         r.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                         r.status === 'Unpaid' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                       )}>{r.status}</span>
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
