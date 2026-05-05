export interface Product {
  id: string
  category: "panel" | "battery" | "inverter" | "fencing" | "accessory"
  productName: string
  companyName: string
  powerRating: string
  stock: number
  unitPrice: number
  lowStockAlert: number
}