import { Quotation } from "@/types/quotation"

const STORAGE_KEY = "nsh_quotations"

export const getQuotations = (): Quotation[] => {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export const addQuotation = (quotation: Quotation) => {
  if (typeof window === "undefined") return
  const quotations = getQuotations()
  quotations.push(quotation)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quotations))
}

export const updateQuotation = (updatedQuotation: Quotation) => {
  if (typeof window === "undefined") return
  const quotations = getQuotations().map((quotation) =>
    quotation.id === updatedQuotation.id ? updatedQuotation : quotation
  )
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quotations))
}

export const getQuotationById = (id: string) => {
  return getQuotations().find((quotation) => quotation.id === id)
}