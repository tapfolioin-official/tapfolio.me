import React from 'react';
import { InvoiceData } from '../types';
import { formatCurrency, getUpiQrUrl, getUpiLink } from '../utils/format';

interface TemplateProps {
  data: InvoiceData;
  totals: {
    subtotal: number;
    itemDiscounts: number;
    globalDiscount: number;
    tax: number;
    grandTotal: number;
    advancePayment: number;
    balanceDue: number;
  };
}

export const PremiumTemplate: React.FC<TemplateProps> = ({ data, totals }) => {
  const { company, client, details, items, payment, notes, terms } = data;
  const qrUrl = getUpiQrUrl(payment.upiId, payment.accountName || company.name, totals.grandTotal, details.currency, details.number);
  const upiLink = getUpiLink(payment.upiId, payment.accountName || company.name, totals.grandTotal, details.currency, details.number);

  return (
    <div className="bg-white text-slate-800 font-sans h-full flex flex-col justify-between relative">
      {/* Decorative top gold gradient accent */}
      <div className="h-2 w-full bg-gradient-to-r from-amber-100 via-amber-500 to-amber-900 no-print"></div>

      <div className="p-8 md:p-12 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Layout */}
          <div className="flex flex-row justify-between items-start gap-8 border-b-2 border-amber-50 pb-8">
            <div>
              {company.logo ? (
                <img src={company.logo} alt="Company Logo" className="max-h-16 object-contain mb-4" />
              ) : null}
              <h1 className="text-3xl font-serif-premium font-normal tracking-wide text-slate-900 leading-tight">
                {company.name}
              </h1>
              {company.tagline && (
                <p className="text-xs font-serif-premium italic text-amber-700 tracking-wider mt-1">
                  {company.tagline}
                </p>
              )}
            </div>

            <div className="text-right text-xs text-slate-500 space-y-1 mt-2">
              <p className="font-semibold text-slate-700 uppercase tracking-widest text-[9px]">Registered Office</p>
              <p className="whitespace-pre-line leading-relaxed">{company.address}</p>
              {company.phone && <p>Tel: {company.phone}</p>}
              {company.email && <p>Email: {company.email}</p>}
              {company.website && <p>Web: {company.website}</p>}
              {company.gstNumber && <p className="text-[10px]">GSTIN: {company.gstNumber}</p>}
              {company.panNumber && <p className="text-[10px]">PAN: {company.panNumber}</p>}
            </div>
          </div>

          {/* Invoice Meta Grid */}
          <div className="grid grid-cols-2 gap-8 py-8 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700">Client / Billex</span>
              {client.logo && (
                <img src={client.logo} alt="Client Logo" className="max-h-12 object-contain mt-2 mb-2" />
              )}
              <div className="mt-2 text-sm text-slate-600 space-y-1 font-serif-premium">
                <p className="font-bold text-slate-900 text-lg">{client.name}</p>
                {client.company && <p className="font-medium text-slate-700">{client.company}</p>}
                <p className="whitespace-pre-line leading-relaxed text-xs text-slate-500 font-sans mt-1">
                  {client.address}
                </p>
                <div className="text-xs font-sans text-slate-500 pt-1">
                  {client.email && <p>Email: {client.email}</p>}
                  {client.phone && <p>Tel: {client.phone}</p>}
                  {client.gst && <p className="text-[10px] mt-0.5">GSTIN: {client.gst}</p>}
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-start items-end text-xs">
              <h2 className="text-3xl font-serif-premium text-amber-700 font-normal uppercase tracking-widest mb-4">
                Invoice
              </h2>
              <div className="space-y-1.5 text-right w-full font-sans">
                <div className="flex flex-row justify-end gap-8">
                  <span className="text-slate-400 font-medium">Invoice No:</span>
                  <span className="text-slate-900 font-bold">{details.number || 'N/A'}</span>
                </div>
                <div className="flex flex-row justify-end gap-8">
                  <span className="text-slate-400 font-medium">Issue Date:</span>
                  <span className="text-slate-900 font-medium">{details.date || 'N/A'}</span>
                </div>
                <div className="flex flex-row justify-end gap-8">
                  <span className="text-slate-400 font-medium">Due Date:</span>
                  <span className="text-slate-900 font-medium">{details.dueDate || 'N/A'}</span>
                </div>
                <div className="flex flex-row justify-end gap-8 items-center pt-1">
                  <span className="text-slate-400 font-medium">Payment Status:</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700">
                    {details.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Items Table */}
          <div className="mt-8">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-amber-600 text-[10px] font-bold uppercase tracking-widest text-amber-700">
                  <th className="py-3 px-1 font-serif-premium">Item & Details</th>
                  <th className="py-3 px-2 text-right">Qty</th>
                  <th className="py-3 px-2 text-right">Rate</th>
                  <th className="py-3 px-2 text-right">Discount</th>
                  <th className="py-3 px-2 text-right">Tax</th>
                  <th className="py-3 px-1 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {items.map((item) => {
                  const subtotal = item.quantity * item.unitPrice;
                  const taxable = Math.max(0, subtotal - item.discount);
                  const tax = taxable * (item.taxPercent / 100);
                  const total = taxable + tax;

                  return (
                    <tr key={item.id} className="align-top">
                      <td className="py-4 px-1">
                        <p className="font-serif-premium font-bold text-slate-900 text-sm">{item.item || 'Untitled Item'}</p>
                        {item.description && (
                          <p className="text-xs text-slate-500 mt-1 whitespace-pre-wrap leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </td>
                      <td className="py-4 px-2 text-right text-slate-500">{item.quantity}</td>
                      <td className="py-4 px-2 text-right text-slate-500">
                        {formatCurrency(item.unitPrice, details.currency)}
                      </td>
                      <td className="py-4 px-2 text-right text-slate-500">
                        {item.discount > 0 ? formatCurrency(item.discount, details.currency) : '-'}
                      </td>
                      <td className="py-4 px-2 text-right text-slate-500">
                        {item.taxPercent > 0 ? `${item.taxPercent}%` : '-'}
                      </td>
                      <td className="py-4 px-1 text-right font-serif-premium font-bold text-slate-900">
                        {formatCurrency(total, details.currency)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="mt-8 flex justify-end border-t border-slate-100 pt-6">
            <div className="w-72 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="text-slate-800">{formatCurrency(totals.subtotal, details.currency)}</span>
              </div>
              {totals.itemDiscounts > 0 && (
                <div className="flex justify-between text-slate-500">
                  <span>Item Discount</span>
                  <span className="text-slate-800">-{formatCurrency(totals.itemDiscounts, details.currency)}</span>
                </div>
              )}
              {totals.globalDiscount > 0 && (
                <div className="flex justify-between text-slate-500">
                  <span>Total Discount</span>
                  <span className="text-slate-800">-{formatCurrency(totals.globalDiscount, details.currency)}</span>
                </div>
              )}
              {totals.tax > 0 && (
                <div className="flex justify-between text-slate-500">
                  <span>Calculated Tax</span>
                  <span className="text-slate-800">{formatCurrency(totals.tax, details.currency)}</span>
                </div>
              )}
              <div className="flex justify-between border-t-2 border-double border-amber-600 pt-3 text-base font-serif-premium font-bold text-slate-900">
                <span>Total Amount Due</span>
                <span className="text-amber-800">{formatCurrency(totals.grandTotal, details.currency)}</span>
              </div>
              {totals.advancePayment > 0 && (
                <div className="flex justify-between text-slate-500">
                  <span>Advance Paid</span>
                  <span className="text-slate-800">-{formatCurrency(totals.advancePayment, details.currency)}</span>
                </div>
              )}
              {totals.advancePayment > 0 && (
                <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-serif-premium font-bold text-slate-900">
                  <span>Balance Due</span>
                  <span className="text-amber-800">{formatCurrency(totals.balanceDue, details.currency)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer info: Banking details & QR */}
        <div className="mt-16 border-t border-slate-100 pt-8 flex flex-row justify-between items-start gap-8 keep-together">
          <div className="text-xs space-y-4 max-w-lg">
            {(payment.bankName || payment.accountNumber || payment.upiId) && (
              <div>
                <p className="font-bold text-amber-700 mb-2 uppercase tracking-widest text-[9px]">Banking & Settlement</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-500">
                  {payment.bankName && (
                    <>
                      <span className="font-semibold text-slate-700">Depository Bank:</span>
                      <span>{payment.bankName}</span>
                    </>
                  )}
                  {payment.accountName && (
                    <>
                      <span className="font-semibold text-slate-700">Account Name:</span>
                      <span>{payment.accountName}</span>
                    </>
                  )}
                  {payment.accountNumber && (
                    <>
                      <span className="font-semibold text-slate-700">Account Number:</span>
                      <span className="font-medium text-slate-800">{payment.accountNumber}</span>
                    </>
                  )}
                  {payment.ifsc && (
                    <>
                      <span className="font-semibold text-slate-700">IFSC Code:</span>
                      <span>{payment.ifsc}</span>
                    </>
                  )}
                  {payment.swift && (
                    <>
                      <span className="font-semibold text-slate-700">SWIFT Address:</span>
                      <span>{payment.swift}</span>
                    </>
                  )}
                  {payment.upiId && (
                    <>
                      <span className="font-semibold text-slate-700">UPI Address:</span>
                      <span>{payment.upiId}</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {notes && (
              <div>
                <p className="font-bold text-amber-700 mb-1 uppercase tracking-widest text-[9px]">Invoice Notes</p>
                <p className="text-slate-500 whitespace-pre-wrap leading-relaxed font-serif-premium italic text-xs">
                  {notes}
                </p>
              </div>
            )}

            {terms && (
              <div>
                <p className="font-bold text-amber-700 mb-1 uppercase tracking-widest text-[9px]">Terms of Agreement</p>
                <p className="text-slate-400 whitespace-pre-wrap leading-relaxed text-[11px] font-sans">
                  {terms}
                </p>
              </div>
            )}
          </div>

          {payment.showQrCode && payment.upiId && qrUrl && (
            <div className="flex flex-col items-center bg-slate-50 border border-slate-100 rounded-lg p-4">
              <a href={upiLink} title="Click to pay via UPI app (Google Pay / PhonePe / Paytm)" className="cursor-pointer hover:opacity-90 transition-opacity">
                <img src={qrUrl} alt="UPI QR Code" className="w-24 h-24 object-contain mb-2 border border-amber-100 p-1 bg-white" />
              </a>
              <span className="text-[9px] text-amber-800 font-bold uppercase tracking-widest">Instant UPI Payment</span>
              <a href={upiLink} className="text-[8px] text-amber-700 font-serif-premium font-bold underline mt-1.5 hover:text-amber-900 transition-colors">
                Pay Direct Link
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
