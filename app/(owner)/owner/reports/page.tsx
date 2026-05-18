"use client"

import { useEffect, useState } from "react"
import { getAttendance } from "@/lib/attendance"
import { getCustomers } from "@/lib/customers"
import { getEmployees } from "@/lib/employees"
import { getInvoices } from "@/lib/invoices"
import { getProducts } from "@/lib/products"
import { getProjects } from "@/lib/projects"
import { getQuotations } from "@/lib/quotations"
import { getSales } from "@/lib/sales"
import { getTasks } from "@/lib/tasks"

type ReportMetric = {
  label: string
  value: number | string
}

type ReportTotals = {
  quotationValue: number
  invoiceValue: number
  salesValue: number
}

export default function OwnerReportsPage() {
  const [metrics, setMetrics] = useState<ReportMetric[]>([])
  const [totals, setTotals] = useState<ReportTotals>({
    quotationValue: 0,
    invoiceValue: 0,
    salesValue: 0,
  })

  useEffect(() => {
    const employees = getEmployees()
    const attendance = getAttendance()
    const customers = getCustomers()
    const projects = getProjects()
    const products = getProducts()
    const sales = getSales()
    const quotations = getQuotations()
    const invoices = getInvoices()
    const tasks = getTasks()

    setMetrics([
      { label: "Employees", value: employees.length },
      { label: "Attendance Records", value: attendance.length },
      { label: "Customers", value: customers.length },
      { label: "Projects", value: projects.length },
      { label: "Inventory Products", value: products.length },
      { label: "Sales Records", value: sales.length },
      { label: "Quotations", value: quotations.length },
      { label: "Tax Invoices", value: invoices.length },
      {
        label: "Pending Tasks",
        value: tasks.filter((task) => task.status === "pending").length,
      },
      {
        label: "Completed Tasks",
        value: tasks.filter((task) => task.status === "completed").length,
      },
    ])

    setTotals({
      quotationValue: quotations.reduce(
        (sum, quotation) => sum + quotation.roundedTotal,
        0
      ),
      invoiceValue: invoices.reduce(
        (sum, invoice) => sum + invoice.finalTotal,
        0
      ),
      salesValue: sales.reduce((sum, sale) => sum + sale.totalAmount, 0),
    })
  }, [])

  return (
    <div className="space-y-8">
      <div className="rounded-xl bg-slate-800 p-6">
        <h1 className="text-2xl font-bold text-white">Reports</h1>
        <p className="mt-2 text-slate-400">
          Owner overview from the current local storage records.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-slate-800 p-5">
          <p className="text-slate-400">Quotation Value</p>
          <p className="mt-2 text-2xl font-bold text-white">
            ₹{totals.quotationValue.toFixed(2)}
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-5">
          <p className="text-slate-400">Invoice Value</p>
          <p className="mt-2 text-2xl font-bold text-white">
            ₹{totals.invoiceValue.toFixed(2)}
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-5">
          <p className="text-slate-400">Sales Value</p>
          <p className="mt-2 text-2xl font-bold text-white">
            ₹{totals.salesValue.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="flex items-center justify-between rounded-xl bg-slate-800 p-5"
          >
            <p className="text-slate-300">{metric.label}</p>
            <p className="text-xl font-bold text-white">{metric.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}