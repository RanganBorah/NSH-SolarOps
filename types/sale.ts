export type WarrantyUnit = "months" | "years"

export interface SaleItem {
  id: string
  productId: string
  productName: string
  companyName: string
  powerRating: string
  quantity: number
  unitPrice: number
  totalAmount: number
  warrantyDuration: number
  warrantyUnit: WarrantyUnit
  warrantyStartDate: string
  warrantyExpiryDate: string
}

export interface Sale {
  id: string
  customerId: string
  customerName: string
  items: SaleItem[]
  totalAmount: number
  paidAmount: number
  balanceAmount: number
  paymentStatus: "paid" | "partial" | "unpaid"
  soldByEmployeeId: string
  soldByEmployeeName: string
  soldDate: string
  warrantyStartDate?: string
  warrantyDurationMonths?: number
  warrantyExpiryDate?: string
  productId?: string
  productName?: string
  companyName?: string
  powerRating?: string
  quantity?: number
  unitPrice?: number
}