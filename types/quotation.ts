export interface QuotationItem {
  id: string
  itemName: string
  qty: number
  unit: string
  rate: number
  total: number
}

export interface Quotation {
  id: string
  quotationNo: string
  date: string
  toWhom: string
  subject: string
  items: QuotationItem[]
  subtotal: number
  roundedTotal: number
  roundOff: number
  amountInWords: string
  createdByRole: "owner" | "employee"
  createdByName: string
  createdByEmployeeId: string
}