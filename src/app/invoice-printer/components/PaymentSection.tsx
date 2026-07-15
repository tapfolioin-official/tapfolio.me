import React from 'react';
import { PaymentDetails } from '../types';

interface PaymentSectionProps {
  data: PaymentDetails;
  onChange: (info: Partial<PaymentDetails>) => void;
}

export const PaymentSection: React.FC<PaymentSectionProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">Payment Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Bank Name</label>
          <input
            type="text"
            value={data.bankName}
            onChange={(e) => onChange({ bankName: e.target.value })}
            placeholder="e.g. Silicon Valley Bank"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Account Name</label>
          <input
            type="text"
            value={data.accountName}
            onChange={(e) => onChange({ accountName: e.target.value })}
            placeholder="e.g. Acme Design LLC"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Account Number</label>
          <input
            type="text"
            value={data.accountNumber}
            onChange={(e) => onChange({ accountNumber: e.target.value })}
            placeholder="e.g. 1234567890"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">IFSC Code (for Indian Banks)</label>
          <input
            type="text"
            value={data.ifsc}
            onChange={(e) => onChange({ ifsc: e.target.value })}
            placeholder="e.g. SBIN0001234"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">SWIFT Code (for International)</label>
          <input
            type="text"
            value={data.swift}
            onChange={(e) => onChange({ swift: e.target.value })}
            placeholder="e.g. ABININBBXXX"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">UPI ID (e.g. GPay / PhonePe)</label>
          <input
            type="text"
            value={data.upiId}
            onChange={(e) => onChange({ upiId: e.target.value })}
            placeholder="e.g. acme@okaxis"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800"
          />
        </div>

        <div className="md:col-span-2 pt-2">
          <label className="flex items-center gap-3 cursor-pointer group select-none">
            <input
              type="checkbox"
              checked={data.showQrCode}
              onChange={(e) => onChange({ showQrCode: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600 border-slate-350 focus:ring-blue-500 bg-slate-50 cursor-pointer"
            />
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-850 group-hover:text-slate-900 transition-colors">
                Generate UPI Payment QR Code
              </span>
              <p className="text-[10px] text-slate-450 leading-none">
                If checked, scans will direct payments to your UPI ID with the grand total pre-filled.
              </p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
