import { Customer } from "@/types/customer"

const STORAGE_KEY = "nsh_customers"

export const getCustomers = (): Customer[] => {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export const addCustomer = (customer: Customer) => {
  if (typeof window === "undefined") return
  const customers = getCustomers()
  customers.push(customer)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customers))
}

export const updateCustomer = (updatedCustomer: Customer) => {
  if (typeof window === "undefined") return
  const customers = getCustomers().map((customer) =>
    customer.id === updatedCustomer.id ? updatedCustomer : customer
  )
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customers))
}

export const searchCustomersByName = (query: string): Customer[] => {
  if (!query.trim()) return []
  const customers = getCustomers()
  const q = query.trim().toLowerCase()

  return customers.filter((customer) =>
    customer.name.toLowerCase().includes(q)
  )
}

export const findCustomerByPhone = (phone: string): Customer | undefined => {
  const customers = getCustomers()
  return customers.find((customer) => customer.phone === phone.trim())
}

export const createCustomerIfNotExists = (data: {
  name: string
  phone: string
  address: string
  customerType: "retail" | "project" | "both"
  notes: string
}) => {
  const existing = findCustomerByPhone(data.phone)

  if (existing) return existing

  const newCustomer: Customer = {
    id: Date.now().toString(),
    name: data.name.trim(),
    phone: data.phone.trim(),
    address: data.address.trim(),
    customerType: data.customerType,
    notes: data.notes.trim(),
  }

  addCustomer(newCustomer)
  return newCustomer
}