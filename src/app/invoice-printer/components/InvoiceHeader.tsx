import React from 'react';
import { InvoiceDetails } from '../types';

interface InvoiceHeaderProps {
  data: InvoiceDetails;
  onChange: (info: Partial<InvoiceDetails>) => void;
}

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar ($)' },
  { code: 'EUR', symbol: '€', name: 'Euro (€)' },
  { code: 'GBP', symbol: '£', name: 'British Pound (£)' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee (₹)' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar (A$)' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar (C$)' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen (¥)' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar (S$)' }
];

const STATUSES = ['Pending', 'Paid', 'Unpaid', 'Overdue'];

export const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">Invoice Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Invoice Number</label>
          <input
            type="text"
            value={data.number}
            onChange={(e) => onChange({ number: e.target.value })}
            placeholder="e.g. INV-2026-001"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Currency</label>
          <select
            value={data.currency}
            onChange={(e) => onChange({ currency: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800"
          >
            {CURRENCIES.map((cur) => (
              <option key={cur.code} value={cur.code}>
                {cur.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Issue Date</label>
          <input
            type="date"
            value={data.date}
            onChange={(e) => onChange({ date: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Due Date</label>
          <input
            type="date"
            value={data.dueDate}
            onChange={(e) => onChange({ dueDate: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Global Discount</label>
          <input
            type="number"
            value={data.discount || ''}
            onChange={(e) => onChange({ discount: Number(e.target.value) || 0 })}
            placeholder="e.g. 500"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800"
          />
        </div>

        <div className="md:col-span-2 space-y-1">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</label>
          <div className="grid grid-cols-4 gap-2">
            {STATUSES.map((status) => {
              const active = data.status === status;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => onChange({ status })}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    active
                      ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {status}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
