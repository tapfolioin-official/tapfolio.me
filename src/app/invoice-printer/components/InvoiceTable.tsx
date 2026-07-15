import React from 'react';
import { InvoiceItem } from '../types';
import { Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '../utils/format';

interface InvoiceTableProps {
  items: InvoiceItem[];
  currency: string;
  onAddItem: () => void;
  onUpdateItem: (id: string, item: Partial<InvoiceItem>) => void;
  onRemoveItem: (id: string) => void;
}

export const InvoiceTable: React.FC<InvoiceTableProps> = ({
  items,
  currency,
  onAddItem,
  onUpdateItem,
  onRemoveItem
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Line Items</h3>
        <button
          type="button"
          onClick={onAddItem}
          className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/80 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
        >
          <Plus size={14} /> Add Item
        </button>
      </div>

      {/* Desktop Tabular view */}
      <div className="hidden lg:block overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
              <th className="py-3 px-4 w-[35%]">Item & Description</th>
              <th className="py-3 px-2 text-right w-[10%]">Qty</th>
              <th className="py-3 px-2 text-right w-[15%]">Rate</th>
              <th className="py-3 px-2 text-right w-[12%]">Disc.</th>
              <th className="py-3 px-2 text-right w-[10%]">Tax %</th>
              <th className="py-3 px-2 text-right w-[13%]">Total</th>
              <th className="py-3 px-4 text-center w-[5%]"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => {
              const itemSubtotal = item.quantity * item.unitPrice;
              const taxable = Math.max(0, itemSubtotal - item.discount);
              const itemTotal = taxable + taxable * (item.taxPercent / 100);

              return (
                <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="py-3 px-4 space-y-1">
                    <input
                      type="text"
                      value={item.item}
                      onChange={(e) => onUpdateItem(item.id, { item: e.target.value })}
                      placeholder="Item name"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800 font-medium"
                    />
                    <textarea
                      value={item.description}
                      onChange={(e) => onUpdateItem(item.id, { description: e.target.value })}
                      placeholder="Add description (optional)"
                      rows={1}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-blue-500 focus:bg-white text-slate-500 resize-none"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) => onUpdateItem(item.id, { quantity: Number(e.target.value) || 0 })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-right focus:outline-none focus:border-blue-500 focus:bg-white text-slate-850"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <input
                      type="number"
                      value={item.unitPrice}
                      min="0"
                      onChange={(e) => onUpdateItem(item.id, { unitPrice: Number(e.target.value) || 0 })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-right focus:outline-none focus:border-blue-500 focus:bg-white text-slate-850"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <input
                      type="number"
                      value={item.discount}
                      min="0"
                      onChange={(e) => onUpdateItem(item.id, { discount: Number(e.target.value) || 0 })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-right focus:outline-none focus:border-blue-500 focus:bg-white text-slate-850"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <input
                      type="number"
                      value={item.taxPercent}
                      min="0"
                      max="100"
                      onChange={(e) => onUpdateItem(item.id, { taxPercent: Number(e.target.value) || 0 })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-right focus:outline-none focus:border-blue-500 focus:bg-white text-slate-850"
                    />
                  </td>
                  <td className="py-3 px-2 text-right font-bold text-slate-900 pr-1">
                    {formatCurrency(itemTotal, currency)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-all cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Card Layout */}
      <div className="lg:hidden space-y-4">
        {items.map((item, idx) => {
          const itemSubtotal = item.quantity * item.unitPrice;
          const taxable = Math.max(0, itemSubtotal - item.discount);
          const itemTotal = taxable + taxable * (item.taxPercent / 100);

          return (
            <div key={item.id} className="border border-slate-200 rounded-xl p-4 bg-white space-y-3 relative shadow-sm">
              <div className="absolute top-3 right-3">
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                  className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-all cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <span className="text-[10px] bg-slate-100 text-slate-650 font-bold px-2 py-0.5 rounded">
                Item #{idx + 1}
              </span>

              <div className="space-y-2 pt-1">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-550 uppercase">Item Name</label>
                  <input
                    type="text"
                    value={item.item}
                    onChange={(e) => onUpdateItem(item.id, { item: e.target.value })}
                    placeholder="e.g. Website Design"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-550 uppercase">Description</label>
                  <textarea
                    value={item.description}
                    onChange={(e) => onUpdateItem(item.id, { description: e.target.value })}
                    placeholder="e.g. Front-end coding using React"
                    rows={2}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-blue-500 focus:bg-white text-slate-500 resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-550 uppercase">Quantity</label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => onUpdateItem(item.id, { quantity: Number(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-550 uppercase">Unit Price</label>
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => onUpdateItem(item.id, { unitPrice: Number(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-550 uppercase">Discount</label>
                  <input
                    type="number"
                    value={item.discount}
                    onChange={(e) => onUpdateItem(item.id, { discount: Number(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-550 uppercase">Tax %</label>
                  <input
                    type="number"
                    value={item.taxPercent}
                    onChange={(e) => onUpdateItem(item.id, { taxPercent: Number(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-500">Item Total:</span>
                <span className="font-bold text-slate-900">{formatCurrency(itemTotal, currency)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
