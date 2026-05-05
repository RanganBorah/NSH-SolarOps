"use client"

import { useEffect, useMemo, useState } from "react"
import { createCustomerIfNotExists, getCustomers, searchCustomersByName } from "@/lib/customers"
import { getProducts, reduceProductStock } from "@/lib/products"
import { addSale, getSalesByEmployee } from "@/lib/sales"

export default function EmployeeSalesPage() {
  const [employeeId, setEmployeeId] = useState("")
  const [employeeName, setEmployeeName] = useState("")

  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerAddress, setCustomerAddress] = useState("")
  const [customerNotes, setCustomerNotes] = useState("")
  const [selectedCustomerId, setSelectedCustomerId] = useState("")

  const [selectedProductId, setSelectedProductId] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [paidAmount, setPaidAmount] = useState("")
  const [soldDate, setSoldDate] = useState(new Date().toISOString().split("T")[0])
  const [warrantyDurationMonths, setWarrantyDurationMonths] = useState("12")

  const [customers, setCustomers] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [sales, setSales] = useState<any[]>([])
  const [suggestions, setSuggestions] = useState<any[]>([])

  const loadData = (empId?: string) => {
    setCustomers(getCustomers())
    setProducts(getProducts())
    if (empId) setSales(getSalesByEmployee(empId))
  }

  useEffect(() => {
    const rawUser = localStorage.getItem("nsh_user")
    if (rawUser) {
      const user = JSON.parse(rawUser)
      setEmployeeId(user.employeeId || "")
      setEmployeeName(user.name || "")
      loadData(user.employeeId || "")
    }
  }, [])

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === selectedProductId),
    [products, selectedProductId]
  )

  const parsedQuantity = Number(quantity) || 0
  const unitPrice = selectedProduct?.unitPrice || 0
  const totalAmount = parsedQuantity * unitPrice
  const parsedPaidAmount = Number(paidAmount) || 0
  const balanceAmount = Math.max(0, totalAmount - parsedPaidAmount)

  const paymentStatus: "paid" | "partial" | "unpaid" =
    parsedPaidAmount <= 0 ? "unpaid" : balanceAmount === 0 ? "paid" : "partial"

  const handleCustomerNameChange = (value: string) => {
    setCustomerName(value)
    setSelectedCustomerId("")
    if (value.trim()) setSuggestions(searchCustomersByName(value))
    else setSuggestions([])
  }

  const handleSelectCustomer = (customer: any) => {
    setSelectedCustomerId(customer.id)
    setCustomerName(customer.name)
    setCustomerPhone(customer.phone)
    setCustomerAddress(customer.address)
    setCustomerNotes(customer.notes)
    setSuggestions([])
  }

  const handleCreateSale = () => {
    if (!employeeId || !customerName.trim() || !customerPhone.trim() || !selectedProductId || parsedQuantity <= 0) return
    if (!selectedProduct) return
    if (parsedQuantity > selectedProduct.stock) return

    const customer =
      selectedCustomerId && customers.find((c) => c.id === selectedCustomerId)
        ? customers.find((c) => c.id === selectedCustomerId)
        : createCustomerIfNotExists({
            name: customerName,
            phone: customerPhone,
            address: customerAddress,
            customerType: "retail",
            notes: customerNotes,
          })

    const warrantyStartDate = soldDate
    const saleDateObj = new Date(`${soldDate}T00:00:00`)
    const expiry = new Date(saleDateObj)
    expiry.setMonth(expiry.getMonth() + (Number(warrantyDurationMonths) || 0))
    const warrantyExpiryDate = expiry.toISOString().split("T")[0]

    const newSale = {
      id: Date.now().toString(),
      customerId: customer.id,
      customerName: customer.name,
      productId: selectedProduct.id,
      productName: selectedProduct.productName,
      companyName: selectedProduct.companyName,
      powerRating: selectedProduct.powerRating,
      quantity: parsedQuantity,
      unitPrice,
      totalAmount,
      paidAmount: parsedPaidAmount,
      balanceAmount,
      paymentStatus,
      soldByEmployeeId: employeeId,
      soldByEmployeeName: employeeName,
      soldDate,
      warrantyStartDate,
      warrantyDurationMonths: Number(warrantyDurationMonths) || 0,
      warrantyExpiryDate,
    }

    addSale(newSale)
    reduceProductStock(selectedProduct.id, parsedQuantity)

    setCustomerName("")
    setCustomerPhone("")
    setCustomerAddress("")
    setCustomerNotes("")
    setSelectedCustomerId("")
    setSelectedProductId("")
    setQuantity("1")
    setPaidAmount("")
    setWarrantyDurationMonths("12")
    setSuggestions([])

    loadData(employeeId)
  }

  return (
    <div className="space-y-8">
      <div className="rounded-xl bg-slate-800 p-6">
        <h1 className="text-2xl font-bold text-white">Retail Sales</h1>
        <p className="mt-2 text-slate-300">Add sale and auto-update customer database</p>
      </div>

      <div className="space-y-4 rounded-xl bg-slate-800 p-6">
        <h2 className="text-xl font-semibold text-white">Customer</h2>

        <div className="space-y-2">
          <input
            value={customerName}
            onChange={(e) => handleCustomerNameChange(e.target.value)}
            placeholder="Customer Name"
            className="w-full rounded-md bg-white px-4 py-3 text-black"
          />

          {suggestions.length > 0 && (
            <div className="rounded-md bg-white text-black shadow">
              {suggestions.map((customer) => (
                <button
                  key={customer.id}
                  type="button"
                  onClick={() => handleSelectCustomer(customer)}
                  className="block w-full border-b px-4 py-3 text-left hover:bg-slate-100"
                >
                  {customer.name} - {customer.phone}
                </button>
              ))}
            </div>
          )}
        </div>

        <input
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          placeholder="Phone"
          className="w-full rounded-md bg-white px-4 py-3 text-black"
        />

        <input
          value={customerAddress}
          onChange={(e) => setCustomerAddress(e.target.value)}
          placeholder="Address"
          className="w-full rounded-md bg-white px-4 py-3 text-black"
        />

        <textarea
          value={customerNotes}
          onChange={(e) => setCustomerNotes(e.target.value)}
          placeholder="Notes"
          className="w-full rounded-md bg-white px-4 py-3 text-black"
        />
      </div>

      <div className="space-y-4 rounded-xl bg-slate-800 p-6">
        <h2 className="text-xl font-semibold text-white">Sale Details</h2>

        <select
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          className="w-full rounded-md bg-white px-4 py-3 text-black"
        >
          <option value="">Select Product</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.productName} | {product.companyName} | {product.powerRating} | Stock: {product.stock}
            </option>
          ))}
        </select>

        <input
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Quantity"
          className="w-full rounded-md bg-white px-4 py-3 text-black"
        />

        <input
          value={paidAmount}
          onChange={(e) => setPaidAmount(e.target.value)}
          placeholder="Paid Amount"
          className="w-full rounded-md bg-white px-4 py-3 text-black"
        />

        <input
          type="date"
          value={soldDate}
          onChange={(e) => setSoldDate(e.target.value)}
          className="w-full rounded-md bg-white px-4 py-3 text-black"
        />

        <input
          value={warrantyDurationMonths}
          onChange={(e) => setWarrantyDurationMonths(e.target.value)}
          placeholder="Warranty Duration Months"
          className="w-full rounded-md bg-white px-4 py-3 text-black"
        />

        <div className="rounded-lg border border-slate-700 p-4 text-sm text-slate-300">
          <p>Total Amount: ₹{totalAmount}</p>
          <p>Paid Amount: ₹{parsedPaidAmount}</p>
          <p>Balance Amount: ₹{balanceAmount}</p>
          <p>Status: {paymentStatus}</p>
        </div>

        <button
          onClick={handleCreateSale}
          className="rounded-md bg-green-500 px-5 py-3 font-semibold text-white"
        >
          Save Sale
        </button>
      </div>

      <div className="space-y-4 rounded-xl bg-slate-800 p-6">
        <h2 className="text-xl font-semibold text-white">My Sales</h2>

        {sales.length === 0 ? (
          <p className="text-slate-400">No sales added yet.</p>
        ) : (
          sales.map((sale) => (
            <div key={sale.id} className="rounded-lg border border-slate-700 p-4">
              <p className="font-semibold text-white">{sale.customerName}</p>
              <p className="mt-1 text-sm text-slate-300">Product: {sale.productName}</p>
              <p className="mt-1 text-sm text-slate-300">Company: {sale.companyName}</p>
              <p className="mt-1 text-sm text-slate-300">Power Rating: {sale.powerRating || "-"}</p>
              <p className="mt-1 text-sm text-slate-300">Quantity: {sale.quantity}</p>
              <p className="mt-1 text-sm text-slate-300">Total: ₹{sale.totalAmount}</p>
              <p className="mt-1 text-sm text-slate-300">Paid: ₹{sale.paidAmount}</p>
              <p className="mt-1 text-sm text-slate-300">Balance: ₹{sale.balanceAmount}</p>
              <p className="mt-1 text-sm text-slate-300">Warranty Expiry: {sale.warrantyExpiryDate}</p>
              <p className="mt-2 text-sm font-semibold text-yellow-400">{sale.paymentStatus}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}