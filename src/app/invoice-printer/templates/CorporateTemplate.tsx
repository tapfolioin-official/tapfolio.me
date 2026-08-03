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

export const CorporateTemplate: React.FC<TemplateProps> = ({ data, totals }) => {
  const { company, client, details, items, payment, notes, terms } = data;
  const qrUrl = getUpiQrUrl(payment.upiId, payment.accountName || company.name, totals.grandTotal, details.currency, details.number);
  const upiLink = getUpiLink(payment.upiId, payment.accountName || company.name, totals.grandTotal, details.currency, details.number);

  return (
    <div className="p-8 md:p-12 bg-white text-slate-800 font-sans h-full flex flex-col justify-between border-t-8 border-slate-900">
      <div>
        {/* Header Block */}
        <div className="grid grid-cols-2 gap-8 items-start pb-8 border-b border-slate-200">
          <div>
            {company.logo ? (
              <img src={company.logo} alt="Company Logo" className="max-h-16 object-contain mb-4" />
            ) : null}
            <h1 className="text-2xl font-extrabold text-slate-900 uppercase tracking-tight">{company.name}</h1>
            {company.tagline && <p className="text-xs text-slate-500 font-medium mt-0.5">{company.tagline}</p>}
          </div>

          <div className="text-right text-xs text-slate-500 space-y-1">
            <p className="font-bold text-slate-950 text-sm mb-1 uppercase tracking-wider">Office Address</p>
            <p className="whitespace-pre-line leading-relaxed">{company.address}</p>
            {company.phone && <p>Phone: {company.phone}</p>}
            {company.email && <p>Email: {company.email}</p>}
            {company.website && <p>Web: {company.website}</p>}
            {company.gstNumber && <p>GSTIN: {company.gstNumber}</p>}
            {company.panNumber && <p>PAN: {company.panNumber}</p>}
          </div>
        </div>

        {/* Invoice Metadata and Client Address */}
        <div className="grid grid-cols-2 gap-8 py-8 border-b border-slate-200 bg-slate-50/50 -mx-8 md:-mx-12 px-8 md:px-12">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Client Account</span>
            {client.logo && (
              <img src={client.logo} alt="Client Logo" className="max-h-12 object-contain mt-2 mb-2" />
            )}
            <div className="mt-2 text-xs text-slate-650 space-y-1">
              <p className="font-bold text-slate-900 text-sm">{client.name}</p>
              {client.company && <p className="font-semibold text-slate-800">{client.company}</p>}
              <p className="whitespace-pre-line leading-relaxed mt-1 text-slate-500">{client.address}</p>
              <div className="text-[11px] text-slate-500 pt-1 space-y-0.5">
                {client.email && <p>Email: {client.email}</p>}
                {client.phone && <p>Phone: {client.phone}</p>}
                {client.gst && <p className="font-semibold">GSTIN: {client.gst}</p>}
              </div>
            </div>
          </div>

          <div className="text-right text-xs">
            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wider mb-3">Invoice Details</h2>
            <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 max-w-xs ml-auto">
              <span className="text-slate-400 font-semibold text-left md:text-right">Invoice No:</span>
              <span className="text-slate-900 font-bold text-right">{details.number || 'N/A'}</span>

              <span className="text-slate-400 font-semibold text-left md:text-right">Issue Date:</span>
              <span className="text-slate-900 text-right">{details.date || 'N/A'}</span>

              <span className="text-slate-400 font-semibold text-left md:text-right">Payment Due:</span>
              <span className="text-slate-950 font-semibold text-right">{details.dueDate || 'N/A'}</span>

              <span className="text-slate-400 font-semibold text-left md:text-right">Status:</span>
              <span className="text-slate-900 font-bold text-right uppercase tracking-wider text-[10px]">
                {details.status}
              </span>
            </div>
          </div>
        </div>

        {/* Invoice Table with background head */}
        <div className="mt-8">
          <table className="w-full text-left border-collapse border border-slate-200">
            <thead>
              <tr className="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider">
                <th className="py-2.5 px-3 border border-slate-700">Line Item Description</th>
                <th className="py-2.5 px-2 text-right border border-slate-700 w-16">Qty</th>
                <th className="py-2.5 px-2 text-right border border-slate-700 w-28">Rate</th>
                <th className="py-2.5 px-2 text-right border border-slate-700 w-24">Discount</th>
                <th className="py-2.5 px-2 text-right border border-slate-700 w-20">Tax Rate</th>
                <th className="py-2.5 px-3 text-right border border-slate-700 w-32">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {items.map((item) => {
                const subtotal = item.quantity * item.unitPrice;
                const taxable = Math.max(0, subtotal - item.discount);
                const tax = taxable * (item.taxPercent / 100);
                const total = taxable + tax;

                return (
                  <tr key={item.id} className="align-top hover:bg-slate-50/50">
                    <td className="py-3 px-3 border border-slate-200">
                      <p className="font-bold text-slate-900">{item.item || 'Untitled Item'}</p>
                      {item.description && (
                        <p className="text-[11px] text-slate-500 mt-1 whitespace-pre-wrap leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-2 text-right border border-slate-200 text-slate-600">{item.quantity}</td>
                    <td className="py-3 px-2 text-right border border-slate-200 text-slate-600">
                      {formatCurrency(item.unitPrice, details.currency)}
                    </td>
                    <td className="py-3 px-2 text-right border border-slate-200 text-slate-600">
                      {item.discount > 0 ? formatCurrency(item.discount, details.currency) : '-'}
                    </td>
                    <td className="py-3 px-2 text-right border border-slate-200 text-slate-600">
                      {item.taxPercent > 0 ? `${item.taxPercent}%` : '-'}
                    </td>
                    <td className="py-3 px-3 text-right border border-slate-200 font-bold text-slate-900">
                      {formatCurrency(total, details.currency)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals Summary */}
        <div className="mt-6 flex justify-end">
          <table className="w-80 border-collapse border border-slate-200 text-xs">
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="py-2 px-3 font-semibold text-slate-500 bg-slate-50">Subtotal</td>
                <td className="py-2 px-3 text-right text-slate-800 font-medium">
                  {formatCurrency(totals.subtotal, details.currency)}
                </td>
              </tr>
              {totals.itemDiscounts > 0 && (
                <tr className="border-b border-slate-200">
                  <td className="py-2 px-3 font-semibold text-slate-500 bg-slate-50">Item Discount</td>
                  <td className="py-2 px-3 text-right text-slate-800 font-medium">
                    -{formatCurrency(totals.itemDiscounts, details.currency)}
                  </td>
                </tr>
              )}
              {totals.globalDiscount > 0 && (
                <tr className="border-b border-slate-200">
                  <td className="py-2 px-3 font-semibold text-slate-500 bg-slate-50">Total Discount</td>
                  <td className="py-2 px-3 text-right text-slate-800 font-medium">
                    -{formatCurrency(totals.globalDiscount, details.currency)}
                  </td>
                </tr>
              )}
              {totals.tax > 0 && (
                <tr className="border-b border-slate-200">
                  <td className="py-2 px-3 font-semibold text-slate-500 bg-slate-50">Tax</td>
                  <td className="py-2 px-3 text-right text-slate-800 font-medium">
                    {formatCurrency(totals.tax, details.currency)}
                  </td>
                </tr>
              )}
              <tr className="bg-slate-100 font-bold text-sm">
                <td className="py-2.5 px-3 text-slate-900">Total Due</td>
                <td className="py-2.5 px-3 text-right text-slate-950">
                  {formatCurrency(totals.grandTotal, details.currency)}
                </td>
              </tr>
              {totals.advancePayment > 0 && (
                <tr className="border-b border-slate-200">
                  <td className="py-2 px-3 font-semibold text-slate-500 bg-slate-50">Advance Paid</td>
                  <td className="py-2 px-3 text-right text-slate-800 font-medium">
                    -{formatCurrency(totals.advancePayment, details.currency)}
                  </td>
                </tr>
              )}
              {totals.advancePayment > 0 && (
                <tr className="bg-slate-100 font-bold text-sm">
                  <td className="py-2.5 px-3 text-slate-900">Balance Due</td>
                  <td className="py-2.5 px-3 text-right text-slate-950">
                    {formatCurrency(totals.balanceDue, details.currency)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Corporate footer details */}
      <div className="mt-16 border-t border-slate-200 pt-6 flex flex-row justify-between items-start gap-8 keep-together">
        <div className="text-xs space-y-4 max-w-lg">
          {(payment.bankName || payment.accountNumber || payment.upiId) && (
            <div>
              <p className="font-bold text-slate-900 mb-1.5 uppercase tracking-wider text-[10px]">Payment Specifications</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-slate-500">
                {payment.bankName && (
                  <>
                    <span className="font-semibold text-slate-700">Beneficiary Bank:</span>
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
                    <span>{payment.accountNumber}</span>
                  </>
                )}
                {payment.ifsc && (
                  <>
                    <span className="font-semibold text-slate-700">IFSC / Routing:</span>
                    <span>{payment.ifsc}</span>
                  </>
                )}
                {payment.swift && (
                  <>
                    <span className="font-semibold text-slate-700">SWIFT / BIC:</span>
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
              <p className="font-bold text-slate-900 mb-1 uppercase tracking-wider text-[10px]">Additional Notes</p>
              <p className="text-slate-500 whitespace-pre-wrap leading-relaxed">{notes}</p>
            </div>
          )}

          {terms && (
            <div>
              <p className="font-bold text-slate-900 mb-1 uppercase tracking-wider text-[10px]">Standard Terms</p>
              <p className="text-slate-400 whitespace-pre-wrap leading-relaxed text-[11px]">{terms}</p>
            </div>
          )}
        </div>

        {payment.showQrCode && payment.upiId && qrUrl && (
          <div className="flex flex-col items-center bg-slate-50 border border-slate-200 rounded p-3">
            <a href={upiLink} title="Click to pay via UPI app (Google Pay / PhonePe / Paytm)" className="cursor-pointer hover:opacity-90 transition-opacity">
              <img src={qrUrl} alt="UPI QR Code" className="w-24 h-24 object-contain mb-1.5" />
            </a>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Scan & Pay</span>
            <a href={upiLink} className="text-[8px] text-slate-900 font-bold underline mt-1 hover:text-slate-700 transition-colors">
              Click to Pay Direct
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
