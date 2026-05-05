import { Sale } from "@/types/sale"

const STORAGE_KEY = "nsh_sales"

export const getSales = (): Sale[] => {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export const addSale = (sale: Sale) => {
  if (typeof window === "undefined") return
  const sales = getSales()
  sales.push(sale)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sales))
}

export const getSalesByEmployee = (employeeId: string) => {
  return getSales().filter((sale) => sale.soldByEmployeeId === employeeId)
}

export const getTotalDailyRevenue = (date: string) => {
  return getSales()
    .filter((sale) => sale.soldDate === date)
    .reduce((sum, sale) => sum + sale.paidAmount, 0)
}

export const getTotalMonthlyRevenue = (monthPrefix: string) => {
  return getSales()
    .filter((sale) => sale.soldDate.startsWith(monthPrefix))
    .reduce((sum, sale) => sum + sale.paidAmount, 0)
}