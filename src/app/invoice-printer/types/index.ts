export interface CompanyInfo {
  logo: string; // base64 data URI
  name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  gstNumber: string;
  panNumber: string;
}

export interface ClientInfo {
  name: string;
  company: string;
  address: string;
  email: string;
  phone: string;
  gst: string;
}

export interface InvoiceDetails {
  number: string;
  date: string;
  dueDate: string;
  currency: string;
  status: 'Paid' | 'Unpaid' | 'Pending' | 'Overdue' | string;
}

export interface InvoiceItem {
  id: string;
  item: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxPercent: number; // e.g. 18 for 18%
  discount: number; // flat discount amount
}

export interface PaymentDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  ifsc: string;
  swift: string;
  upiId: string;
  showQrCode: boolean;
}

export interface InvoiceData {
  company: CompanyInfo;
  client: ClientInfo;
  details: InvoiceDetails;
  items: InvoiceItem[];
  payment: PaymentDetails;
  notes: string;
  terms: string;
  template: 'modern' | 'minimal' | 'premium' | 'corporate';
}
