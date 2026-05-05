"use client"

import { useEffect, useMemo, useState } from "react"
import { addInvoice, getInvoices, updateInvoice } from "@/lib/invoices"
import {
  calculateInvoiceItem,
  calculateInvoiceTotals,
  generateInvoiceNumber,
  numberToWords,
  numberToWordsWithPaise,
} from "@/lib/invoice-utils"

export default function EmployeeInvoicesPage() {
  const [invoiceId, setInvoiceId] = useState("")
  const [employeeName, setEmployeeName] = useState("")
  const [employeeId, setEmployeeId] = useState("")
  const [consigneeName, setConsigneeName] = useState("")
  const [consigneeAddress, setConsigneeAddress] = useState("")
  const [consigneeGstin, setConsigneeGstin] = useState("")
  const [buyerName, setBuyerName] = useState("")
  const [buyerAddress, setBuyerAddress] = useState("")
  const [buyerGstin, setBuyerGstin] = useState("")
  const [items, setItems] = useState([
    {
      id: Date.now().toString(),
      description: "",
      hsnSac: "",
      quantity: 1,
      unit: "PCS",
      rateInclTax: 0,
      taxableRate: 0,
      amount: 0,
      cgstRate: 9,
      cgstAmount: 0,
      sgstRate: 9,
      sgstAmount: 0,
      totalTaxAmount: 0,
    },
  ])
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const rawUser = localStorage.getItem("nsh_user")
    if (rawUser) {
      const user = JSON.parse(rawUser)
      setEmployeeName(user.name || "")
      setEmployeeId(user.employeeId || "")
    }
  }, [])

  const invoices = useMemo(() => getInvoices(), [refreshKey])

  const totals = calculateInvoiceTotals(items)
  const amountInWords = numberToWords(totals.finalTotal)
  const taxAmountInWords = numberToWordsWithPaise(totals.cgstTotal + totals.sgstTotal)

  const handleItemChange = (
    id: string,
    field: "description" | "hsnSac" | "quantity" | "unit" | "rateInclTax" | "cgstRate" | "sgstRate",
    value: string
  ) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item

        const updated = {
          ...item,
          [field]:
            field === "quantity" || field === "rateInclTax" || field === "cgstRate" || field === "sgstRate"
              ? Number(value) || 0
              : value,
        }

        const calc = calculateInvoiceItem({
          quantity: Number(updated.quantity) || 0,
          rateInclTax: Number(updated.rateInclTax) || 0,
          cgstRate: Number(updated.cgstRate) || 0,
          sgstRate: Number(updated.sgstRate) || 0,
        })

        return {
          ...updated,
          taxableRate: calc.taxableRate,
          amount: calc.amount,
          cgstAmount: calc.cgstAmount,
          sgstAmount: calc.sgstAmount,
          totalTaxAmount: calc.totalTaxAmount,
        }
      })
    )
  }

  const handleAddRow = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `${Date.now()}${prev.length}`,
        description: "",
        hsnSac: "",
        quantity: 1,
        unit: "PCS",
        rateInclTax: 0,
        taxableRate: 0,
        amount: 0,
        cgstRate: 9,
        cgstAmount: 0,
        sgstRate: 9,
        sgstAmount: 0,
        totalTaxAmount: 0,
      },
    ])
  }

  const handleRemoveRow = (id: string) => {
    setItems((prev) => (prev.length === 1 ? prev : prev.filter((item) => item.id !== id)))
  }

  const resetForm = () => {
    setInvoiceId("")
    setConsigneeName("")
    setConsigneeAddress("")
    setConsigneeGstin("")
    setBuyerName("")
    setBuyerAddress("")
    setBuyerGstin("")
    setItems([
      {
        id: Date.now().toString(),
        description: "",
        hsnSac: "",
        quantity: 1,
        unit: "PCS",
        rateInclTax: 0,
        taxableRate: 0,
        amount: 0,
        cgstRate: 9,
        cgstAmount: 0,
        sgstRate: 9,
        sgstAmount: 0,
        totalTaxAmount: 0,
      },
    ])
  }

  const handleSaveInvoice = () => {
    if (
      !consigneeName.trim() ||
      !buyerName.trim() ||
      items.some((item) => !item.description.trim())
    ) return

    const baseData = {
      invoiceNo: invoiceId
        ? invoices.find((i) => i.id === invoiceId)?.invoiceNo || generateInvoiceNumber(invoices.length)
        : generateInvoiceNumber(invoices.length),
      invoiceDate: new Date().toISOString().split("T")[0],
      consigneeName: consigneeName.trim(),
      consigneeAddress: consigneeAddress.trim(),
      consigneeGstin: consigneeGstin.trim(),
      buyerName: buyerName.trim(),
      buyerAddress: buyerAddress.trim(),
      buyerGstin: buyerGstin.trim(),
      items,
      taxableTotal: totals.taxableTotal,
      cgstTotal: totals.cgstTotal,
      sgstTotal: totals.sgstTotal,
      roundOff: totals.roundOff,
      finalTotal: totals.finalTotal,
      amountInWords,
      taxAmountInWords,
      createdByRole: "employee" as const,
      createdByName: employeeName,
      createdByEmployeeId: employeeId,
    }

    if (invoiceId) {
      updateInvoice({
        id: invoiceId,
        ...baseData,
      })
    } else {
      addInvoice({
        id: Date.now().toString(),
        ...baseData,
      })
    }

    resetForm()
    setRefreshKey((v) => v + 1)
  }

  const handleEditInvoice = (invoice: any) => {
    setInvoiceId(invoice.id)
    setConsigneeName(invoice.consigneeName)
    setConsigneeAddress(invoice.consigneeAddress)
    setConsigneeGstin(invoice.consigneeGstin)
    setBuyerName(invoice.buyerName)
    setBuyerAddress(invoice.buyerAddress)
    setBuyerGstin(invoice.buyerGstin)
    setItems(invoice.items)
  }

  return (
    <div className="space-y-8">
      <div className="rounded-xl bg-slate-800 p-6">
        <h1 className="text-2xl font-bold text-white">Tax Invoices</h1>
      </div>

      <div className="space-y-4 rounded-xl bg-slate-800 p-6">
        <input value={consigneeName} onChange={(e) => setConsigneeName(e.target.value)} placeholder="Consignee Name" className="w-full rounded-md bg-white px-4 py-3 text-black" />
        <input value={consigneeAddress} onChange={(e) => setConsigneeAddress(e.target.value)} placeholder="Consignee Address" className="w-full rounded-md bg-white px-4 py-3 text-black" />
        <input value={consigneeGstin} onChange={(e) => setConsigneeGstin(e.target.value)} placeholder="Consignee GSTIN" className="w-full rounded-md bg-white px-4 py-3 text-black" />
        <input value={buyerName} onChange={(e) => setBuyerName(e.target.value)} placeholder="Buyer Name" className="w-full rounded-md bg-white px-4 py-3 text-black" />
        <input value={buyerAddress} onChange={(e) => setBuyerAddress(e.target.value)} placeholder="Buyer Address" className="w-full rounded-md bg-white px-4 py-3 text-black" />
        <input value={buyerGstin} onChange={(e) => setBuyerGstin(e.target.value)} placeholder="Buyer GSTIN" className="w-full rounded-md bg-white px-4 py-3 text-black" />

        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={item.id} className="grid gap-3 rounded-lg border border-slate-700 p-4 md:grid-cols-12">
              <input value={item.description} onChange={(e) => handleItemChange(item.id, "description", e.target.value)} placeholder={`Description ${index + 1}`} className="md:col-span-3 w-full rounded-md bg-white px-4 py-3 text-black" />
              <input value={item.hsnSac} onChange={(e) => handleItemChange(item.id, "hsnSac", e.target.value)} placeholder="HSN/SAC" className="md:col-span-2 w-full rounded-md bg-white px-4 py-3 text-black" />
              <input value={item.quantity} onChange={(e) => handleItemChange(item.id, "quantity", e.target.value)} placeholder="Qty" className="md:col-span-1 w-full rounded-md bg-white px-4 py-3 text-black" />
              <input value={item.unit} onChange={(e) => handleItemChange(item.id, "unit", e.target.value)} placeholder="Unit" className="md:col-span-1 w-full rounded-md bg-white px-4 py-3 text-black" />
              <input value={item.rateInclTax} onChange={(e) => handleItemChange(item.id, "rateInclTax", e.target.value)} placeholder="Rate Incl Tax" className="md:col-span-2 w-full rounded-md bg-white px-4 py-3 text-black" />
              <input value={item.cgstRate} onChange={(e) => handleItemChange(item.id, "cgstRate", e.target.value)} placeholder="CGST %" className="md:col-span-1 w-full rounded-md bg-white px-4 py-3 text-black" />
              <input value={item.sgstRate} onChange={(e) => handleItemChange(item.id, "sgstRate", e.target.value)} placeholder="SGST %" className="md:col-span-1 w-full rounded-md bg-white px-4 py-3 text-black" />
              <button onClick={() => handleRemoveRow(item.id)} className="md:col-span-1 rounded-md bg-red-500 px-3 py-3 text-white">X</button>
            </div>
          ))}
        </div>

        <button onClick={handleAddRow} className="rounded-md bg-blue-500 px-5 py-3 font-semibold text-white">
          Add Item Row
        </button>

        <div className="rounded-lg border border-slate-700 p-4 text-sm text-slate-300">
          <p>Taxable Total: ₹{totals.taxableTotal.toFixed(2)}</p>
          <p>CGST Total: ₹{totals.cgstTotal.toFixed(2)}</p>
          <p>SGST Total: ₹{totals.sgstTotal.toFixed(2)}</p>
          <p>Round Off: {totals.roundOff >= 0 ? `(+${totals.roundOff.toFixed(2)})` : `(${totals.roundOff.toFixed(2)})`}</p>
          <p>Final Total: ₹{totals.finalTotal.toFixed(2)}</p>
          <p>Amount in Words: {amountInWords}</p>
          <p>Tax Amount in Words: {taxAmountInWords}</p>
        </div>

        <button onClick={handleSaveInvoice} className="rounded-md bg-green-500 px-5 py-3 font-semibold text-white">
          {invoiceId ? "Update Invoice" : "Save Invoice"}
        </button>
      </div>

      <div className="space-y-4 rounded-xl bg-slate-800 p-6">
        <h2 className="text-xl font-semibold text-white">Invoice List</h2>

        {invoices.length === 0 ? (
          <p className="text-slate-400">No invoices created yet.</p>
        ) : (
          invoices.map((invoice) => (
            <div key={invoice.id} className="rounded-lg border border-slate-700 p-4">
              <p className="font-semibold text-white">{invoice.invoiceNo}</p>
              <p className="mt-1 text-sm text-slate-300">Consignee: {invoice.consigneeName}</p>
              <p className="mt-1 text-sm text-slate-300">Buyer: {invoice.buyerName}</p>
              <p className="mt-1 text-sm text-slate-300">Date: {invoice.invoiceDate}</p>
              <p className="mt-1 text-sm text-slate-300">Final Total: ₹{invoice.finalTotal.toFixed(2)}</p>
              <button onClick={() => handleEditInvoice(invoice)} className="mt-3 rounded-md bg-yellow-500 px-4 py-2 text-black">
                Edit
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}