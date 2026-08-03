import React, { useRef } from 'react';
import { ClientInfo } from '../types';
import { Upload, X } from 'lucide-react';

interface ClientSectionProps {
  data: ClientInfo;
  onChange: (info: Partial<ClientInfo>) => void;
}

export const ClientSection: React.FC<ClientSectionProps> = ({ data, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 800 * 1024) {
      alert('Logo image should be under 800 KB to ensure proper saving.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onChange({ logo: event.target.result as string });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (file.size > 800 * 1024) {
      alert('Logo image should be under 800 KB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onChange({ logo: event.target.result as string });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">Client Information</h3>
      
      {/* Client Logo Upload Zone */}
      <div className="space-y-3 mb-4">
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Client Logo</label>
        {data.logo ? (
          <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50/50">
            <img src={data.logo} alt="Client Logo preview" className="h-16 w-28 object-contain bg-white border border-slate-200/60 p-2 rounded-lg" />
            <div className="space-y-1">
              <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                Logo Active
              </p>
              <button
                type="button"
                onClick={() => onChange({ logo: '' })}
                className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1 transition-colors cursor-pointer"
              >
                <X size={14} /> Remove Logo
              </button>
            </div>
          </div>
        ) : (
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 hover:border-blue-500 hover:bg-slate-50/50 rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleLogoUpload}
              accept="image/*"
              className="hidden"
            />
            <Upload size={24} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
            <p className="text-xs font-semibold text-slate-700">Click to upload or drag & drop</p>
            <p className="text-[10px] text-slate-400">PNG, JPG, SVG (Max. 800 KB)</p>
          </div>
        )}
      </div>

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
