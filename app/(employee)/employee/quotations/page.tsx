"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { addQuotation, getQuotations, updateQuotation } from "@/lib/quotations"
import {
  calculateQuotationSubtotal,
  calculateRoundOff,
  calculateRoundedTotal,
  generateQuotationNumber,
  numberToWords,
} from "@/lib/quotation-utils"

export default function EmployeeQuotationsPage() {
  const [mounted, setMounted] = useState(false)
  const [quotationId, setQuotationId] = useState("")
  const [employeeName, setEmployeeName] = useState("")
  const [employeeId, setEmployeeId] = useState("")
  const [toWhom, setToWhom] = useState("")
  const [subject, setSubject] = useState("")
  const [items, setItems] = useState([
    { id: `${Date.now()}`, itemName: "", rate: 0, qty: 1, unit: "Nos", total: 0 },
  ])
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    setMounted(true)
    const rawUser = localStorage.getItem("nsh_user")
    if (rawUser) {
      const user = JSON.parse(rawUser)
      setEmployeeName(user.name || "")
      setEmployeeId(user.employeeId || "")
    }
  }, [])

  const quotations = useMemo(() => {
    if (!mounted) return []
    return getQuotations()
  }, [mounted, refreshKey])

  const subtotal = calculateQuotationSubtotal(items.map((item) => ({ qty: item.qty, rate: item.rate })))
  const roundedTotal = calculateRoundedTotal(subtotal)
  const roundOff = calculateRoundOff(subtotal)
  const amountInWords = numberToWords(roundedTotal)

  const handleItemChange = (
    id: string,
    field: "itemName" | "rate" | "qty" | "unit",
    value: string
  ) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item

        const updated = {
          ...item,
          [field]: field === "rate" || field === "qty" ? Number(value) || 0 : value,
        }

        return {
          ...updated,
          total: (Number(updated.rate) || 0) * (Number(updated.qty) || 0),
        }
      })
    )
  }

  const handleAddRow = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${prev.length}`,
        itemName: "",
        rate: 0,
        qty: 1,
        unit: "Nos",
        total: 0,
      },
    ])
  }

  const handleRemoveRow = (id: string) => {
    setItems((prev) =>
      prev.length === 1
        ? prev
        : prev.filter((item) => item.id !== id)
    )
  }

  const resetForm = () => {
    setQuotationId("")
    setToWhom("")
    setSubject("")
    setItems([
      { id: `${Date.now()}`, itemName: "", rate: 0, qty: 1, unit: "Nos", total: 0 },
    ])
  }

  const handleSaveQuotation = () => {
    if (!toWhom.trim() || !subject.trim()) return
    if (items.some((item) => !item.itemName.trim() || item.rate <= 0 || item.qty <= 0 || !item.unit.trim())) return

    const baseData = {
      quotationNo: quotationId
        ? quotations.find((q) => q.id === quotationId)?.quotationNo || generateQuotationNumber(quotations.length)
        : generateQuotationNumber(quotations.length),
      date: new Date().toISOString().split("T")[0],
      toWhom: toWhom.trim(),
      subject: subject.trim(),
      items,
      subtotal,
      roundedTotal,
      roundOff,
      amountInWords,
      createdByRole: "employee" as const,
      createdByName: employeeName,
      createdByEmployeeId: employeeId,
    }

    if (quotationId) {
      updateQuotation({
        id: quotationId,
        ...baseData,
      })
    } else {
      addQuotation({
        id: `${Date.now()}`,
        ...baseData,
      })
    }

    resetForm()
    setRefreshKey((v) => v + 1)
  }

  const handleEditQuotation = (quotation: any) => {
    setQuotationId(quotation.id)
    setToWhom(quotation.toWhom)
    setSubject(quotation.subject)
    setItems(quotation.items)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (!mounted) return null

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h1 className="text-2xl font-bold text-white">Quotations</h1>
        <p className="mt-2 text-slate-400">Create, edit and print quotations</p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              To Whom
            </label>
            <input
              value={toWhom}
              onChange={(e) => setToWhom(e.target.value)}
              placeholder="Customer / Company name"
              className="w-full rounded-xl border border-slate-700 bg-white px-4 py-3 text-black outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Subject
            </label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Quotation subject"
              className="w-full rounded-xl border border-slate-700 bg-white px-4 py-3 text-black outline-none"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Quotation Items</h2>
              <p className="text-sm text-slate-400">
                Fill item name, rate, quantity and unit. Total is automatic.
              </p>
            </div>

            <button
              onClick={handleAddRow}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Add Item
            </button>
          </div>

          <div className="hidden rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-300 md:grid md:grid-cols-12 md:gap-3">
            <div className="md:col-span-4">Item Name</div>
            <div className="md:col-span-2">Rate (₹)</div>
            <div className="md:col-span-2">Qty</div>
            <div className="md:col-span-2">Unit</div>
            <div className="md:col-span-1">Total</div>
            <div className="md:col-span-1">Remove</div>
          </div>

          <div className="mt-4 space-y-4">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-4"
              >
                <div className="mb-3 text-sm font-semibold text-slate-300 md:hidden">
                  Item {index + 1}
                </div>

                <div className="grid gap-3 md:grid-cols-12">
                  <div className="md:col-span-4">
                    <label className="mb-2 block text-xs text-slate-400 md:hidden">
                      Item Name
                    </label>
                    <input
                      value={item.itemName}
                      onChange={(e) => handleItemChange(item.id, "itemName", e.target.value)}
                      placeholder="Item name"
                      className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-xs text-slate-400 md:hidden">
                      Rate (₹)
                    </label>
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) => handleItemChange(item.id, "rate", e.target.value)}
                      placeholder="Rate"
                      className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-xs text-slate-400 md:hidden">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e) => handleItemChange(item.id, "qty", e.target.value)}
                      placeholder="Qty"
                      className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-xs text-slate-400 md:hidden">
                      Unit
                    </label>
                    <input
                      value={item.unit}
                      onChange={(e) => handleItemChange(item.id, "unit", e.target.value)}
                      placeholder="Nos / Mtrs / Kg"
                      className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className="mb-2 block text-xs text-slate-400 md:hidden">
                      Total
                    </label>
                    <div className="flex h-[48px] items-center rounded-xl bg-slate-800 px-3 text-sm font-semibold text-emerald-400">
                      ₹{item.total.toFixed(2)}
                    </div>
                  </div>

                  <div className="md:col-span-1">
                    <label className="mb-2 block text-xs text-slate-400 md:hidden">
                      Remove
                    </label>
                    <button
                      onClick={() => handleRemoveRow(item.id)}
                      className="w-full rounded-xl bg-red-500 px-3 py-3 font-semibold text-white hover:bg-red-600"
                    >
                      X
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-sm text-slate-300">
          <div className="space-y-2">
            <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
            <p>Round Off: (+{roundOff.toFixed(2)})</p>
            <p>Rounded Total: ₹{roundedTotal.toFixed(2)}</p>
            <p>Amount in Words: {amountInWords}</p>
          </div>
        </div>

        <button
          onClick={handleSaveQuotation}
          className="rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
        >
          {quotationId ? "Update Quotation" : "Save Quotation"}
        </button>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold text-white">Quotation List</h2>

        {quotations.length === 0 ? (
          <p className="mt-4 text-slate-400">No quotations created yet.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {quotations.map((quotation) => (
              <div key={quotation.id} className="rounded-xl border border-slate-700 bg-slate-950 p-4">
                <p className="font-semibold text-white">{quotation.quotationNo}</p>
                <p className="mt-1 text-sm text-slate-300">To: {quotation.toWhom}</p>
                <p className="mt-1 text-sm text-slate-300">Subject: {quotation.subject}</p>
                <p className="mt-1 text-sm text-slate-300">Date: {quotation.date}</p>
                <p className="mt-1 text-sm text-slate-300">Total: ₹{quotation.roundedTotal.toFixed(2)}</p>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleEditQuotation(quotation)}
                    className="rounded-md bg-yellow-500 px-4 py-2 text-black"
                  >
                    Edit
                  </button>

                  <Link
                    href={`/employee/quotations/${quotation.id}`}
                    className="rounded-md bg-blue-500 px-4 py-2 text-white"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}