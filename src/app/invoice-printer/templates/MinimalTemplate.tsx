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

export const MinimalTemplate: React.FC<TemplateProps> = ({ data, totals }) => {
  const { company, client, details, items, payment, notes, terms } = data;
  const qrUrl = getUpiQrUrl(payment.upiId, payment.accountName || company.name, totals.grandTotal, details.currency, details.number);
  const upiLink = getUpiLink(payment.upiId, payment.accountName || company.name, totals.grandTotal, details.currency, details.number);

  return (
    <div className="p-8 md:p-12 bg-white text-black font-sans h-full flex flex-col justify-between">
      <div>
        {/* Header Grid */}
        <div className="flex flex-row justify-between items-start gap-8">
          <div>
            {company.logo ? (
              <img src={company.logo} alt="Company Logo" className="max-h-12 object-contain grayscale mb-4" />
            ) : null}
            <h1 className="text-xl font-bold uppercase tracking-widest">{company.name}</h1>
            {company.tagline && <p className="text-xs text-zinc-500 mt-0.5">{company.tagline}</p>}
          </div>

          <div className="text-right text-xs text-zinc-600 space-y-1">
            <p className="whitespace-pre-line leading-relaxed">{company.address}</p>
            {company.phone && <p>T: {company.phone}</p>}
            {company.email && <p>E: {company.email}</p>}
            {company.gstNumber && <p>GST: {company.gstNumber}</p>}
            {company.panNumber && <p>PAN: {company.panNumber}</p>}
          </div>
        </div>

        {/* Invoice Title & Info Banner */}
        <div className="flex flex-row justify-between items-start border-t border-zinc-200 mt-12 pt-6 gap-6">
          <div>
            <h2 className="text-2xl font-light uppercase tracking-wider mb-2">Invoice</h2>
            <p className="text-xs text-zinc-500">Invoice Number: <span className="font-semibold text-black">{details.number || 'N/A'}</span></p>
            <p className="text-xs text-zinc-500 mt-0.5">Date: <span className="text-black">{details.date || 'N/A'}</span></p>
            <p className="text-xs text-zinc-500 mt-0.5">Due Date: <span className="text-black">{details.dueDate || 'N/A'}</span></p>
            <p className="text-xs text-zinc-500 mt-0.5">Status: <span className="uppercase text-black font-bold tracking-wider">{details.status}</span></p>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Bill To</span>
            <div className="mt-2 text-xs text-zinc-700 space-y-0.5">
              <p className="font-bold text-black text-sm">{client.name}</p>
              {client.company && <p className="font-semibold text-zinc-900">{client.company}</p>}
              <p className="whitespace-pre-line leading-relaxed">{client.address}</p>
              {client.email && <p>E: {client.email}</p>}
              {client.phone && <p>T: {client.phone}</p>}
              {client.gst && <p>GST: {client.gst}</p>}
            </div>
          </div>
        </div>

        {/* Invoice Items Table */}
        <div className="mt-12">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                <th className="py-2 px-1">Description</th>
                <th className="py-2 px-2 text-right">Qty</th>
                <th className="py-2 px-2 text-right">Rate</th>
                {totals.discount > 0 && <th className="py-2 px-2 text-right">Disc.</th>}
                {totals.tax > 0 && <th className="py-2 px-2 text-right">Tax</th>}
                <th className="py-2 px-1 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs">
              {items.map((item) => {
                const subtotal = item.quantity * item.unitPrice;
                const taxable = Math.max(0, subtotal - item.discount);
                const tax = taxable * (item.taxPercent / 100);
                const total = taxable + tax;

                return (
                  <tr key={item.id} className="align-top">
                    <td className="py-3 px-1">
                      <p className="font-semibold text-black">{item.item || 'Untitled Item'}</p>
                      {item.description && <p className="text-zinc-500 mt-1 whitespace-pre-wrap leading-relaxed">{item.description}</p>}
                    </td>
                    <td className="py-3 px-2 text-right text-zinc-600">{item.quantity}</td>
                    <td className="py-3 px-2 text-right text-zinc-600">{formatCurrency(item.unitPrice, details.currency)}</td>
                    {totals.discount > 0 && (
                      <td className="py-3 px-2 text-right text-zinc-600">
                        {item.discount > 0 ? formatCurrency(item.discount, details.currency) : '-'}
                      </td>
                    )}
                    {totals.tax > 0 && (
                      <td className="py-3 px-2 text-right text-zinc-600">{item.taxPercent > 0 ? `${item.taxPercent}%` : '-'}</td>
                    )}
                    <td className="py-3 px-1 text-right font-medium text-black">
                      {formatCurrency(total, details.currency)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="mt-8 flex justify-end border-t border-zinc-200 pt-4">
          <div className="w-64 space-y-2 text-xs">
            <div className="flex justify-between text-zinc-500">
              <span>Subtotal</span>
              <span className="text-zinc-900">{formatCurrency(totals.subtotal, details.currency)}</span>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-zinc-500">
                <span>Discount</span>
                <span className="text-zinc-900">-{formatCurrency(totals.discount, details.currency)}</span>
              </div>
            )}
            {totals.tax > 0 && (
              <div className="flex justify-between text-zinc-500">
                <span>Tax</span>
                <span className="text-zinc-900">{formatCurrency(totals.tax, details.currency)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-black pt-2 text-sm font-bold text-black uppercase tracking-wider">
              <span>Total Due</span>
              <span>{formatCurrency(totals.grandTotal, details.currency)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Notes and Payments */}
      <div className="mt-16 border-t border-zinc-200 pt-6 flex flex-row justify-between items-start gap-8 keep-together">
        <div className="text-xs space-y-4 max-w-lg text-zinc-600">
          {(payment.bankName || payment.accountNumber || payment.upiId) && (
            <div>
              <p className="font-bold text-black mb-1.5 uppercase tracking-wider text-[10px]">Payment Details</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-zinc-500">
                {payment.bankName && (
                  <>
                    <span className="font-medium text-zinc-700">Bank:</span>
                    <span>{payment.bankName}</span>
                  </>
                )}
                {payment.accountName && (
                  <>
                    <span className="font-medium text-zinc-700">A/C Name:</span>
                    <span>{payment.accountName}</span>
                  </>
                )}
                {payment.accountNumber && (
                  <>
                    <span className="font-medium text-zinc-700">A/C No:</span>
                    <span>{payment.accountNumber}</span>
                  </>
                )}
                {payment.ifsc && (
                  <>
                    <span className="font-medium text-zinc-700">IFSC:</span>
                    <span>{payment.ifsc}</span>
                  </>
                )}
                {payment.swift && (
                  <>
                    <span className="font-medium text-zinc-700">SWIFT:</span>
                    <span>{payment.swift}</span>
                  </>
                )}
                {payment.upiId && (
                  <>
                    <span className="font-medium text-zinc-700">UPI ID:</span>
                    <span>{payment.upiId}</span>
                  </>
                )}
              </div>
            </div>
          )}

          {notes && (
            <div>
              <p className="font-bold text-black mb-1 uppercase tracking-wider text-[10px]">Notes</p>
              <p className="whitespace-pre-line leading-relaxed text-zinc-500">{notes}</p>
            </div>
          )}

          {terms && (
            <div>
              <p className="font-bold text-black mb-1 uppercase tracking-wider text-[10px]">Terms & Conditions</p>
              <p className="whitespace-pre-line leading-relaxed text-zinc-500">{terms}</p>
            </div>
          )}
        </div>

        {payment.showQrCode && payment.upiId && qrUrl && (
          <div className="flex flex-col items-center border border-zinc-200 rounded p-3">
            <a href={upiLink} title="Click to pay via UPI app (Google Pay / PhonePe / Paytm)" className="cursor-pointer hover:opacity-90 transition-opacity">
              <img src={qrUrl} alt="UPI QR Code" className="w-24 h-24 object-contain mb-1.5 grayscale" />
            </a>
            <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold">UPI QR</span>
            <a href={upiLink} className="text-[8px] text-zinc-900 font-semibold underline mt-1 hover:text-zinc-600 transition-colors">
              Pay Direct Link
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
