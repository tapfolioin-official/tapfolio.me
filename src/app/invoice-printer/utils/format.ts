export const formatCurrency = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  } catch (e) {
    return `${currency || 'USD'} ${amount.toFixed(2)}`;
  }
};

export const getUpiLink = (upiId: string, name: string, amount: number, currency: string, invoiceNumber?: string) => {
  if (!upiId) return '';
  let url = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount.toFixed(2)}&cu=${currency === 'INR' ? 'INR' : currency}`;
  if (invoiceNumber) {
    url += `&tn=${encodeURIComponent(`Invoice ${invoiceNumber}`)}`;
  }
  return url;
};

export const getUpiQrUrl = (upiId: string, name: string, amount: number, currency: string, invoiceNumber?: string) => {
  const upiUrl = getUpiLink(upiId, name, amount, currency, invoiceNumber);
  if (!upiUrl) return '';
  return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(upiUrl)}`;
};
