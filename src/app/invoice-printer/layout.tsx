import type { Metadata } from 'next';
import './styles/invoice.css';

export const metadata: Metadata = {
  title: 'Invoice Printer | Premium SaaS Invoice Generator',
  description: 'Create, customize, and print high-quality invoices with multiple professional styles. Clean, isolated, secure, and client-side saved.',
  keywords: ['invoice builder', 'receipt generator', 'invoice print', 'A4 PDF invoice', 'premium invoice templates']
};

export default function InvoicePrinterLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-slate-50/55 text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      {children}
    </div>
  );
}
