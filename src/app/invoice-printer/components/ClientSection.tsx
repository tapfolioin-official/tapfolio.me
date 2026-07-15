import React from 'react';
import { ClientInfo } from '../types';

interface ClientSectionProps {
  data: ClientInfo;
  onChange: (info: Partial<ClientInfo>) => void;
}

export const ClientSection: React.FC<ClientSectionProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">Client Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Contact Name</label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="e.g. John Doe"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Company Name</label>
          <input
            type="text"
            value={data.company}
            onChange={(e) => onChange({ company: e.target.value })}
            placeholder="e.g. Acme Client Ltd"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800"
          />
        </div>

        <div className="md:col-span-2 space-y-1">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Address</label>
          <textarea
            value={data.address}
            onChange={(e) => onChange({ address: e.target.value })}
            placeholder="Street address, city, state, zip code"
            rows={3}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all resize-none text-slate-800"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="e.g. client@example.com"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
          <input
            type="text"
            value={data.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="e.g. +1 (555) 987-6543"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800"
          />
        </div>

        <div className="md:col-span-2 space-y-1">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">GSTIN (Optional)</label>
          <input
            type="text"
            value={data.gst}
            onChange={(e) => onChange({ gst: e.target.value })}
            placeholder="e.g. 27BBBBB2222B2Z2"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800"
          />
        </div>
      </div>
    </div>
  );
};
