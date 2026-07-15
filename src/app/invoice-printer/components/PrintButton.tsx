import React from 'react';
import { Printer, Download, FileText } from 'lucide-react';
import { InvoiceData } from '../types';

interface PrintButtonProps {
  data: InvoiceData;
  previewRef: React.RefObject<HTMLDivElement | null>;
}

export const PrintButton: React.FC<PrintButtonProps> = ({ data, previewRef }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadHtml = () => {
    if (!previewRef.current) return;

    // Grab the inner content of the invoice preview
    const previewContent = previewRef.current.innerHTML;
    const invoiceNumber = data.details.number || 'invoice';

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice - ${invoiceNumber}</title>
  <!-- Load Tailwind CSS for offline-like styled execution -->
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Inter', sans-serif;
      background: #f8fafc;
      padding: 2rem 1rem;
    }
    .font-serif-premium {
      font-family: 'Playfair Display', Georgia, serif;
    }
    /* Printable dimensions matching A4 standard */
    .a4-page {
      max-width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      background: white;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      border-radius: 0.75rem;
      overflow: hidden;
      border: 1px solid #e2e8f0;
    }
    @media print {
      body {
        background: white;
        padding: 0;
      }
      .a4-page {
        box-shadow: none;
        border: none;
        max-width: 100%;
        min-height: 0;
        margin: 0;
      }
    }
  </style>
</head>
<body>
  <!-- Embedded invoice container -->
  <div class="a4-page">
    ${previewContent}
  </div>
  
  <!-- Automatic prompt to print when opening the HTML page if desired -->
  <script>
    // window.print();
  </script>
</body>
</html>`;

    // Create a Blob and trigger the download
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${invoiceNumber.toLowerCase().replace(/[^a-z0-9]/g, '_')}_invoice.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Print Button */}
      <button
        type="button"
        onClick={handlePrint}
        className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl shadow transition-all cursor-pointer text-sm"
      >
        <Printer size={16} /> Print Invoice
      </button>

      {/* Save PDF Button */}
      <button
        type="button"
        onClick={handlePrint}
        className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all cursor-pointer text-sm"
      >
        <FileText size={16} /> Save as PDF
      </button>

      {/* Download HTML Button */}
      <button
        type="button"
        onClick={handleDownloadHtml}
        className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all cursor-pointer text-sm"
      >
        <Download size={16} /> Export HTML
      </button>
    </div>
  );
};
