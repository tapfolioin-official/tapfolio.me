import React from 'react';
import { formatCurrency } from '../utils/format';

interface TotalsProps {
  totals: {
    subtotal: number;
    itemDiscounts: number;
    globalDiscount: number;
    tax: number;
    grandTotal: number;
    advancePayment: number;
    balanceDue: number;
  };
  currency: string;
  onDiscountChange?: (discount: number) => void;
  onAdvancePaymentChange?: (advance: number) => void;
}

export const Totals: React.FC<TotalsProps> = ({
  totals,
  currency,
  onDiscountChange,
  onAdvancePaymentChange
}) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Calculations Summary</h3>
      
      <div className="space-y-3 text-xs text-slate-650">
        <div className="flex justify-between items-center">
          <span>Gross Subtotal</span>
          <span className="font-semibold text-slate-800">{formatCurrency(totals.subtotal, currency)}</span>
        </div>
        
        {totals.itemDiscounts > 0 && (
          <div className="flex justify-between items-center text-emerald-600">
            <span>Item Discounts</span>
            <span className="font-semibold">-{formatCurrency(totals.itemDiscounts, currency)}</span>
          </div>
        )}

        <div className="flex justify-between items-center gap-4">
          <span className="font-medium text-slate-700">Total Discount</span>
          <input
            type="number"
            value={totals.globalDiscount || ''}
            onChange={(e) => onDiscountChange && onDiscountChange(Number(e.target.value) || 0)}
            placeholder="0.00"
            className="w-28 bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2 text-right text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 font-semibold"
          />
        </div>

        {totals.tax > 0 && (
          <div className="flex justify-between items-center">
            <span>Taxes & Duties</span>
            <span className="font-semibold text-slate-800">{formatCurrency(totals.tax, currency)}</span>
          </div>
        )}

        <div className="flex justify-between items-center border-t border-slate-200 pt-3 text-sm font-bold text-slate-900">
          <span>Grand Total</span>
          <span className="text-blue-600">{formatCurrency(totals.grandTotal, currency)}</span>
        </div>

        <div className="flex justify-between items-center gap-4">
          <span className="font-medium text-slate-700">Advance Paid</span>
          <input
            type="number"
            value={totals.advancePayment || ''}
            onChange={(e) => onAdvancePaymentChange && onAdvancePaymentChange(Number(e.target.value) || 0)}
            placeholder="0.00"
            className="w-28 bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2 text-right text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 font-semibold"
          />
        </div>

        {totals.advancePayment > 0 && (
          <div className="flex justify-between items-center border-t border-slate-200 pt-3 text-sm font-bold text-slate-900">
            <span>Balance Due</span>
            <span className="text-blue-600">{formatCurrency(totals.balanceDue, currency)}</span>
          </div>
        )}
      </div>
    </div>
  );
};
