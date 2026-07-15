import React from 'react';
import { formatCurrency } from '../utils/format';

interface TotalsProps {
  totals: {
    subtotal: number;
    discount: number;
    tax: number;
    grandTotal: number;
  };
  currency: string;
}

export const Totals: React.FC<TotalsProps> = ({ totals, currency }) => {
  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Calculations Summary</h3>
      
      <div className="space-y-2 text-xs text-slate-650">
        <div className="flex justify-between">
          <span>Gross Subtotal</span>
          <span className="font-semibold text-slate-800">{formatCurrency(totals.subtotal, currency)}</span>
        </div>
        
        {totals.discount > 0 && (
          <div className="flex justify-between text-emerald-600">
            <span>Item Discounts</span>
            <span className="font-semibold">-{formatCurrency(totals.discount, currency)}</span>
          </div>
        )}

        {totals.tax > 0 && (
          <div className="flex justify-between">
            <span>Taxes & Duties</span>
            <span className="font-semibold text-slate-800">{formatCurrency(totals.tax, currency)}</span>
          </div>
        )}

        <div className="flex justify-between border-t border-slate-200 pt-3 text-sm font-bold text-slate-900">
          <span>Grand Total Due</span>
          <span className="text-blue-600">{formatCurrency(totals.grandTotal, currency)}</span>
        </div>
      </div>
    </div>
  );
};
