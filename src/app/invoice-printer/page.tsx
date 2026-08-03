'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useInvoiceData } from './hooks/useInvoiceData';
import { CompanySection } from './components/CompanySection';
import { ClientSection } from './components/ClientSection';
import { InvoiceHeader } from './components/InvoiceHeader';
import { InvoiceTable } from './components/InvoiceTable';
import { Totals } from './components/Totals';
import { PaymentSection } from './components/PaymentSection';
import { TemplateSwitcher } from './components/TemplateSwitcher';
import { PrintButton } from './components/PrintButton';
import { InvoicePreview } from './components/InvoicePreview';
import { 
  Building2, 
  User, 
  Receipt, 
  ListTodo, 
  CreditCard, 
  FileText, 
  RotateCcw, 
  Trash2,
  ChevronDown,
  ChevronUp,
  LayoutTemplate
} from 'lucide-react';

export default function InvoicePrinterPage() {
  const [mounted, setMounted] = useState(false);
  const [openSection, setOpenSection] = useState<string>('company');
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit');
  const previewRef = useRef<HTMLDivElement>(null);

  const {
    invoiceData,
    updateCompany,
    updateClient,
    updateDetails,
    updatePayment,
    updateNotes,
    updateTerms,
    updateTemplate,
    addItem,
    updateItem,
    removeItem,
    resetToDefault,
    clearAll,
    totals
  } = useInvoiceData();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !invoiceData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-blue-600"></div>
          <p className="text-sm font-semibold text-slate-500">Preparing invoice workshop...</p>
        </div>
      </div>
    );
  }

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? '' : section);
  };

  const sections = [
    {
      id: 'company',
      title: 'Company Information',
      icon: Building2,
      component: <CompanySection data={invoiceData.company} onChange={updateCompany} />
    },
    {
      id: 'client',
      title: 'Client Information',
      icon: User,
      component: <ClientSection data={invoiceData.client} onChange={updateClient} />
    },
    {
      id: 'details',
      title: 'Invoice Details',
      icon: Receipt,
      component: <InvoiceHeader data={invoiceData.details} onChange={updateDetails} />
    },
    {
      id: 'items',
      title: 'Line Items',
      icon: ListTodo,
      component: (
        <InvoiceTable
          items={invoiceData.items}
          currency={invoiceData.details.currency}
          onAddItem={addItem}
          onUpdateItem={updateItem}
          onRemoveItem={removeItem}
        />
      )
    },
    {
      id: 'payments',
      title: 'Payment Settlement',
      icon: CreditCard,
      component: (
        <PaymentSection
          data={invoiceData.payment}
          onChange={updatePayment}
          advancePayment={invoiceData.details.advancePayment}
          onAdvancePaymentChange={(val) => updateDetails({ advancePayment: val })}
        />
      )
    },
    {
      id: 'notes-terms',
      title: 'Notes & Terms',
      icon: FileText,
      component: (
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Invoice Notes</label>
            <textarea
              value={invoiceData.notes}
              onChange={(e) => updateNotes(e.target.value)}
              placeholder="Thank you for your business..."
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all resize-none text-slate-800"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Terms & Conditions</label>
            <textarea
              value={invoiceData.terms}
              onChange={(e) => updateTerms(e.target.value)}
              placeholder="1. Payment is due within 30 days..."
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all resize-none text-slate-800"
            />
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <header className="no-print sticky top-0 z-35 bg-white border-b border-slate-200/80 backdrop-filter backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <LayoutTemplate size={20} />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-none">Invoice Printer</h1>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">Isolated Tapfolio Module</p>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetToDefault}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-3 py-2 rounded-xl transition-all cursor-pointer"
          >
            <RotateCcw size={14} /> Reset Demo
          </button>
          <button
            type="button"
            onClick={clearAll}
            className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-xl transition-all cursor-pointer"
          >
            <Trash2 size={14} /> Clear Form
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-6 print:p-0">
        
        {/* Mobile Tab Swapper */}
        <div className="no-print lg:hidden flex rounded-xl bg-slate-200/80 p-1">
          <button
            type="button"
            onClick={() => setMobileTab('edit')}
            className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mobileTab === 'edit'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Edit Invoice Form
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('preview')}
            className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mobileTab === 'preview'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Live Preview & Export
          </button>
        </div>

        {/* Responsive Grid System */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form Editors */}
          <div className={`no-print ${mobileTab === 'edit' ? 'block' : 'hidden'} lg:block lg:col-span-5 space-y-6`}>
            
            {/* Template Switcher */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
              <TemplateSwitcher current={invoiceData.template} onChange={updateTemplate} />
            </div>

            {/* Accordion Forms */}
            <div className="space-y-4">
              {sections.map((sect) => {
                const isOpen = openSection === sect.id;
                const Icon = sect.icon;

                return (
                  <div
                    key={sect.id}
                    className={`bg-white border rounded-2xl shadow-sm transition-all duration-300 ${
                      isOpen ? 'border-slate-300 ring-2 ring-slate-100' : 'border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    {/* Header */}
                    <button
                      type="button"
                      onClick={() => toggleSection(sect.id)}
                      className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-800 hover:text-slate-900 transition-colors cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl transition-all ${isOpen ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'}`}>
                          <Icon size={16} />
                        </div>
                        <span className="text-sm tracking-tight">{sect.title}</span>
                      </div>
                      {isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                    </button>

                    {/* Content body */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isOpen ? 'max-h-[1500px] border-t border-slate-100 p-5' : 'max-h-0'
                      }`}
                    >
                      {sect.component}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Subtotal & Calculations Display */}
            <Totals totals={totals} currency={invoiceData.details.currency} />
          </div>

          {/* Right Column: Live A4 PDF Preview */}
          <div className={`${mobileTab === 'preview' ? 'block' : 'hidden'} lg:block lg:col-span-7 space-y-6 lg:sticky lg:top-24 print:block print:w-full`}>
            
            {/* Top Toolbar Actions */}
            <div className="no-print bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Export Actions</h3>
                  <p className="text-[10px] text-slate-400">Save your work as physical sheets, PDF forms, or local HTML documents.</p>
                </div>
                <PrintButton data={invoiceData} previewRef={previewRef} />
              </div>
            </div>

            {/* A4 Preview Frame */}
            <div ref={previewRef} className="print-area flex justify-center w-full">
              <InvoicePreview data={invoiceData} totals={totals} />
            </div>
          </div>

        </div>
      </main>

      {/* Footer Info */}
      <footer className="no-print mt-auto py-8 text-center text-[10px] text-slate-450 border-t border-slate-200/60 bg-white">
        <p className="font-semibold">Tapfolio Invoice Printer &copy; 2026. All rights reserved.</p>
        <p className="mt-1">Premium styling optimized for A4 portrait layout. Client-side state saved securely.</p>
      </footer>
    </div>
  );
}
