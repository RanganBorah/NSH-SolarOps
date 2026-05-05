import { Invoice } from "@/types/invoice"

const STORAGE_KEY = "nsh_invoices"

export const getInvoices = (): Invoice[] => {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export const addInvoice = (invoice: Invoice) => {
  if (typeof window === "undefined") return
  const invoices = getInvoices()
  invoices.push(invoice)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices))
}

export const updateInvoice = (updatedInvoice: Invoice) => {
  if (typeof window === "undefined") return
  const invoices = getInvoices().map((invoice) =>
    invoice.id === updatedInvoice.id ? updatedInvoice : invoice
  )
  localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices))
}