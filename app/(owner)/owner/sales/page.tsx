"use client"

import { useEffect, useMemo, useState } from "react"
import { getSales } from "@/lib/sales"
import { Sale } from "@/types/sale"

export default function OwnerSalesPage() {
  const [mounted, setMounted] = useState(false)
  const [sales, setSales] = useState<Sale[]>([])
  const [search, setSearch] = useState("")
  const [paymentFilter, setPaymentFilter] = useState("all")

  useEffect(() => {
    setMounted(true)
    setSales(getSales())
  }, [])

  const getDisplayItems = (sale: Sale) => {
    if (sale.items && sale.items.length > 0) return sale.items

    return [
      {
        id: sale.productId || sale.id,
        productId: sale.productId || "",
        productName: sale.productName || "",
        companyName: sale.companyName || "",
        powerRating: sale.powerRating || "",
        quantity: sale.quantity || 0,
        unitPrice: sale.unitPrice || 0,
        totalAmount: sale.totalAmount || 0,
      },
    ]
  }

  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const searchText = search.toLowerCase().trim()
      const itemText = getDisplayItems(sale)
        .map(
          (item) =>
            `${item.productName} ${item.companyName} ${item.powerRating}`
        )
        .join(" ")
        .toLowerCase()

      const matchesSearch =
        !searchText ||
        sale.customerName.toLowerCase().includes(searchText) ||
        sale.soldByEmployeeName.toLowerCase().includes(searchText) ||
        sale.soldByEmployeeId.toLowerCase().includes(searchText) ||
        itemText.includes(searchText)

      const matchesPayment =
        paymentFilter === "all" || sale.paymentStatus === paymentFilter

      return matchesSearch && matchesPayment
    })
  }, [sales, search, paymentFilter])

  const totalSalesAmount = sales.reduce(
    (sum, sale) => sum + sale.totalAmount,
    0
  )

  const totalPaidAmount = sales.reduce(
    (sum, sale) => sum + sale.paidAmount,
    0
  )

  const totalBalanceAmount = sales.reduce(
    (sum, sale) => sum + sale.balanceAmount,
    0
  )

  const paidSales = sales.filter((sale) => sale.paymentStatus === "paid").length
  const partialSales = sales.filter((sale) => sale.paymentStatus === "partial").length
  const unpaidSales = sales.filter((sale) => sale.paymentStatus === "unpaid").length

  if (!mounted) return null

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h1 className="text-2xl font-bold text-white">Sales</h1>
        <p className="mt-2 text-slate-400">
          View all employee sales, payment collection, balance and warranty records.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Total Sales</p>
          <p className="mt-2 text-2xl font-bold text-white">{sales.length}</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Sales Value</p>
          <p className="mt-2 text-2xl font-bold text-white">
            ₹{totalSalesAmount.toFixed(2)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Amount Collected</p>
          <p className="mt-2 text-2xl font-bold text-green-400">
            ₹{totalPaidAmount.toFixed(2)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Balance Pending</p>
          <p className="mt-2 text-2xl font-bold text-yellow-400">
            ₹{totalBalanceAmount.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Paid Sales</p>
          <p className="mt-2 text-2xl font-bold text-green-400">{paidSales}</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Partial Sales</p>
          <p className="mt-2 text-2xl font-bold text-yellow-400">
            {partialSales}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Unpaid Sales</p>
          <p className="mt-2 text-2xl font-bold text-red-400">{unpaidSales}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Search Sales
            </label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customer, product, company, employee"
              className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Payment Status
            </label>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
            >
              <option value="all">All Sales</option>
              <option value="paid">Paid</option>
              <option value="partial">Partial</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold text-white">All Sales Records</h2>
        <p className="mt-1 text-sm text-slate-400">
          Showing {filteredSales.length} of {sales.length} sales
        </p>

        {filteredSales.length === 0 ? (
          <p className="mt-5 text-slate-400">No sales found.</p>
        ) : (
          <div className="mt-5 space-y-4">
            {filteredSales.map((sale) => (
              <div
                key={sale.id}
                className="rounded-xl border border-slate-800 bg-slate-950 p-5"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-white">
                      {sale.customerName}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Sold by: {sale.soldByEmployeeName || "-"} (
                      {sale.soldByEmployeeId || "-"})
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Sale Date: {sale.soldDate}
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                      sale.paymentStatus === "paid"
                        ? "bg-green-500/20 text-green-400"
                        : sale.paymentStatus === "partial"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {sale.paymentStatus.toUpperCase()}
                  </span>
                </div>

                <div className="mt-4 space-y-2 rounded-xl border border-slate-800 bg-slate-900 p-4">
                  {getDisplayItems(sale).map((item, index) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-1 border-b border-slate-800 pb-2 last:border-b-0 last:pb-0 md:flex-row md:items-center md:justify-between"
                    >
                      <p className="text-sm text-slate-300">
                        {index + 1}. {item.productName} | {item.companyName} |{" "}
                        {item.powerRating || "-"}
                      </p>
                      <p className="text-sm font-semibold text-white">
                        {item.quantity} × ₹{item.unitPrice.toFixed(2)} = ₹
                        {item.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid gap-3 text-sm text-slate-300 md:grid-cols-4">
                  <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
                    <p className="text-slate-500">Total</p>
                    <p className="mt-1 font-semibold text-white">
                      ₹{sale.totalAmount.toFixed(2)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
                    <p className="text-slate-500">Paid</p>
                    <p className="mt-1 font-semibold text-green-400">
                      ₹{sale.paidAmount.toFixed(2)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
                    <p className="text-slate-500">Balance</p>
                    <p className="mt-1 font-semibold text-yellow-400">
                      ₹{sale.balanceAmount.toFixed(2)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
                    <p className="text-slate-500">Warranty Expiry</p>
                    <p className="mt-1 font-semibold text-white">
                      {sale.warrantyExpiryDate}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}