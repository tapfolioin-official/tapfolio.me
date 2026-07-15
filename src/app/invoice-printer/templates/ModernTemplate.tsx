import React from 'react';
import { InvoiceData } from '../types';
import { formatCurrency, getUpiQrUrl, getUpiLink } from '../utils/format';

interface TemplateProps {
  data: InvoiceData;
  totals: {
    subtotal: number;
    discount: number;
    tax: number;
    grandTotal: number;
  };
}

export const ModernTemplate: React.FC<TemplateProps> = ({ data, totals }) => {
  const { company, client, details, items, payment, notes, terms } = data;
  const qrUrl = getUpiQrUrl(payment.upiId, payment.accountName || company.name, totals.grandTotal, details.currency, details.number);
  const upiLink = getUpiLink(payment.upiId, payment.accountName || company.name, totals.grandTotal, details.currency, details.number);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'unpaid':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'overdue':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="p-8 md:p-12 bg-white text-slate-800 font-sans h-full flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <div className="flex flex-row justify-between items-start border-b border-slate-100 pb-8 gap-6">
          <div className="flex-1">
            {company.logo ? (
              <img src={company.logo} alt="Company Logo" className="max-h-16 object-contain mb-4" />
            ) : (
              <div className="w-12 h-12 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xl mb-4">
                {company.name.charAt(0)}
              </div>
            )}
            <h1 className="text-2xl font-bold text-slate-900 leading-tight">{company.name}</h1>
            {company.tagline && <p className="text-sm text-slate-500 mt-1">{company.tagline}</p>}
          </div>

          <div className="text-right text-sm text-slate-500 space-y-1">
            <p className="font-semibold text-slate-900">From</p>
            <p className="whitespace-pre-line leading-relaxed">{company.address}</p>
            {company.phone && <p>Phone: {company.phone}</p>}
            {company.email && <p>Email: {company.email}</p>}
            {company.website && <p>Website: {company.website}</p>}
            {company.gstNumber && <p className="text-xs">GST: {company.gstNumber}</p>}
            {company.panNumber && <p className="text-xs">PAN: {company.panNumber}</p>}
          </div>
        </div>

        {/* Invoice Metadata and Client info */}
        <div className="grid grid-cols-2 gap-8 py-8 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-slate-400">Bill To</span>
            <div className="mt-2 text-sm text-slate-600 space-y-1">
              <p className="font-bold text-slate-900 text-base">{client.name}</p>
              {client.company && <p className="font-medium text-slate-800">{client.company}</p>}
              <p className="whitespace-pre-line leading-relaxed">{client.address}</p>
              {client.email && <p>Email: {client.email}</p>}
              {client.phone && <p>Phone: {client.phone}</p>}
              {client.gst && <p className="text-xs">GST: {client.gst}</p>}
            </div>
          </div>

          <div className="flex flex-col justify-between items-end text-sm">
            <div className="space-y-2 text-right w-full">
              <div className="flex flex-row justify-end gap-8">
                <span className="text-slate-400 font-medium">Invoice Number:</span>
                <span className="text-slate-900 font-bold">{details.number || 'N/A'}</span>
              </div>
              <div className="flex flex-row justify-end gap-8">
                <span className="text-slate-400 font-medium">Invoice Date:</span>
                <span className="text-slate-900 font-medium">{details.date || 'N/A'}</span>
              </div>
              <div className="flex flex-row justify-end gap-8">
                <span className="text-slate-400 font-medium">Due Date:</span>
                <span className="text-slate-900 font-medium">{details.dueDate || 'N/A'}</span>
              </div>
              <div className="flex flex-row justify-end gap-8 items-center">
                <span className="text-slate-400 font-medium">Status:</span>
                <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${getStatusColor(details.status)}`}>
                  {details.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Items Table */}
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-1">Item & Description</th>
                <th className="py-3 px-2 text-right">Qty</th>
                <th className="py-3 px-2 text-right">Price</th>
                <th className="py-3 px-2 text-right">Discount</th>
                <th className="py-3 px-2 text-right">Tax %</th>
                <th className="py-3 px-1 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {items.map((item) => {
                const subtotal = item.quantity * item.unitPrice;
                const taxable = Math.max(0, subtotal - item.discount);
                const tax = taxable * (item.taxPercent / 100);
                const total = taxable + tax;

                return (
                  <tr key={item.id} className="align-top">
                    <td className="py-4 px-1">
                      <p className="font-semibold text-slate-950">{item.item || 'Untitled Item'}</p>
                      {item.description && <p className="text-xs text-slate-500 mt-1 whitespace-pre-wrap">{item.description}</p>}
                    </td>
                    <td className="py-4 px-2 text-right text-slate-600">{item.quantity}</td>
                    <td className="py-4 px-2 text-right text-slate-600">{formatCurrency(item.unitPrice, details.currency)}</td>
                    <td className="py-4 px-2 text-right text-slate-600">
                      {item.discount > 0 ? formatCurrency(item.discount, details.currency) : '-'}
                    </td>
                    <td className="py-4 px-2 text-right text-slate-600">{item.taxPercent > 0 ? `${item.taxPercent}%` : '-'}</td>
                    <td className="py-4 px-1 text-right font-medium text-slate-950">
                      {formatCurrency(total, details.currency)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals Summary */}
        <div className="mt-6 flex flex-col md:flex-row justify-end border-t border-slate-100 pt-6 gap-6">
          <div className="w-full md:w-80 space-y-3 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span className="font-medium text-slate-800">{formatCurrency(totals.subtotal, details.currency)}</span>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-slate-500">
                <span>Discount</span>
                <span className="font-medium text-slate-800">-{formatCurrency(totals.discount, details.currency)}</span>
              </div>
            )}
            {totals.tax > 0 && (
              <div className="flex justify-between text-slate-500">
                <span>Tax</span>
                <span className="font-medium text-slate-800">{formatCurrency(totals.tax, details.currency)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-bold text-slate-950">
              <span>Grand Total</span>
              <span className="text-blue-600">{formatCurrency(totals.grandTotal, details.currency)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment details and footer notes */}
      <div className="mt-12 border-t border-slate-100 pt-8 flex flex-row justify-between items-start gap-8 keep-together">
        <div className="text-sm space-y-4 max-w-lg">
          {/* Bank transfer info */}
          {(payment.bankName || payment.accountNumber || payment.upiId) && (
            <div>
              <p className="font-bold text-slate-900 mb-2 uppercase text-xs tracking-wider">Payment Options</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-500">
                {payment.bankName && (
                  <>
                    <span className="font-semibold text-slate-700">Bank:</span>
                    <span>{payment.bankName}</span>
                  </>
                )}
                {payment.accountName && (
                  <>
                    <span className="font-semibold text-slate-700">A/C Holder:</span>
                    <span>{payment.accountName}</span>
                  </>
                )}
                {payment.accountNumber && (
                  <>
                    <span className="font-semibold text-slate-700">A/C Number:</span>
                    <span>{payment.accountNumber}</span>
                  </>
                )}
                {payment.ifsc && (
                  <>
                    <span className="font-semibold text-slate-700">IFSC:</span>
                    <span>{payment.ifsc}</span>
                  </>
                )}
                {payment.swift && (
                  <>
                    <span className="font-semibold text-slate-700">SWIFT:</span>
                    <span>{payment.swift}</span>
                  </>
                )}
                {payment.upiId && (
                  <>
                    <span className="font-semibold text-slate-700">UPI ID:</span>
                    <span>{payment.upiId}</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Notes & Terms */}
          {notes && (
            <div>
              <p className="font-bold text-slate-900 mb-1 text-xs tracking-wider uppercase">Notes</p>
              <p className="text-xs text-slate-500 whitespace-pre-wrap leading-relaxed">{notes}</p>
            </div>
          )}
          {terms && (
            <div>
              <p className="font-bold text-slate-900 mb-1 text-xs tracking-wider uppercase">Terms & Conditions</p>
              <p className="text-xs text-slate-500 whitespace-pre-wrap leading-relaxed">{terms}</p>
            </div>
          )}
        </div>

        {/* UPI QR Code */}
        {payment.showQrCode && payment.upiId && qrUrl && (
          <div className="flex flex-col items-center bg-slate-50 border border-slate-100 rounded-lg p-4">
            <a href={upiLink} title="Click to pay via UPI app (Google Pay / PhonePe / Paytm)" className="cursor-pointer hover:opacity-90 transition-opacity">
              <img src={qrUrl} alt="UPI QR Code" className="w-28 h-28 object-contain mb-2" />
            </a>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Scan to Pay UPI</span>
            <span className="text-[10px] font-semibold text-slate-600 mt-1">{payment.upiId}</span>
            <a href={upiLink} className="text-[9px] text-blue-600 font-bold underline mt-1.5 hover:text-blue-800 transition-colors">
              Click to Pay Direct
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
