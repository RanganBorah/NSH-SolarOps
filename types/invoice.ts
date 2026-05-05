export interface InvoiceItem {
  id: string
  description: string
  hsnSac: string
  quantity: number
  unit: string
  rateInclTax: number
  taxableRate: number
  amount: number
  cgstRate: number
  cgstAmount: number
  sgstRate: number
  sgstAmount: number
  totalTaxAmount: number
}

export interface Invoice {
  id: string
  invoiceNo: string
  invoiceDate: string
  consigneeName: string
  consigneeAddress: string
  consigneeGstin: string
  buyerName: string
  buyerAddress: string
  buyerGstin: string
  items: InvoiceItem[]
  taxableTotal: number
  cgstTotal: number
  sgstTotal: number
  roundOff: number
  finalTotal: number
  amountInWords: string
  taxAmountInWords: string
  createdByRole: "owner" | "employee"
  createdByName: string
  createdByEmployeeId: string
}