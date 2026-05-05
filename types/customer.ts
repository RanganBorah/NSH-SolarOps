export interface Customer {
  id: string
  name: string
  phone: string
  address: string
  customerType: "retail" | "project" | "both"
  notes: string
}