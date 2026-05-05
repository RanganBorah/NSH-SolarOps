export interface Sale {
  id: string
  customerId: string
  customerName: string
  productId: string
  productName: string
  companyName: string
  powerRating: string
  quantity: number
  unitPrice: number
  totalAmount: number
  paidAmount: number
  balanceAmount: number
  paymentStatus: "paid" | "partial" | "unpaid"
  soldByEmployeeId: string
  soldByEmployeeName: string
  soldDate: string
  warrantyStartDate: string
  warrantyDurationMonths: number
  warrantyExpiryDate: string
}