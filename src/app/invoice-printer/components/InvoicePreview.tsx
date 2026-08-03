import React from 'react';
import { InvoiceData } from '../types';
import { ModernTemplate } from '../templates/ModernTemplate';
import { MinimalTemplate } from '../templates/MinimalTemplate';
import { PremiumTemplate } from '../templates/PremiumTemplate';
import { CorporateTemplate } from '../templates/CorporateTemplate';

interface InvoicePreviewProps {
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

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ data, totals }) => {
  const renderTemplate = () => {
    switch (data.template) {
      case 'minimal':
        return <MinimalTemplate data={data} totals={totals} />;
      case 'premium':
        return <PremiumTemplate data={data} totals={totals} />;
      case 'corporate':
        return <CorporateTemplate data={data} totals={totals} />;
      case 'modern':
      default:
        return <ModernTemplate data={data} totals={totals} />;
    }
  };

  return (
    <div className="a4-container bg-white border border-slate-200/80 rounded-2xl shadow-xl overflow-hidden print-area transition-all duration-300">
      {renderTemplate()}
    </div>
  );
};
